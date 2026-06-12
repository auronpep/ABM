# Attempt Telemetry — Design Spec

**Date:** 2026-06-12
**Status:** Draft for review
**Scope:** What we capture when a paid student answers a question, the exact attempt-payload contract, and the derived-metric definitions built on top of it.

---

## 1. Goal

Every attempt is the unit of evidence for everything adaptive in the program (PRODUCT.md "data spine"): coverage, trap/tension handling, time per question, and miss/repair state. Today the client posts a flat attempt row. This spec adds a single extensible interaction stream so behavioral micro-signals are captured once, at the source, and every future metric becomes a query instead of a migration.

## 2. Design decision

**One `interaction_log` JSONB column on `student_attempts`, written with the existing attempt POST.** No new endpoints, no event firehose table, no client-side buffering service. The hot path stays one row per attempt.

Alternatives considered and rejected:

- **Separate `attempt_events` table (one row per micro-event).** Cleaner relationally, but multiplies write volume ~10x, requires a new endpoint or batching layer, and every consumer still reassembles the stream per attempt. Premature.
- **PostHog-only capture.** Wrong home: PostHog is for funnel/engagement, not for data the repair engine must query per student per question. Diagnostic data lives in Postgres.

## 3. v1 scope (what ships)

| Tier | In v1? | How |
|---|---|---|
| T1 — Core attempt row (choice, correct, confidence, time, platform, set) | ✅ already live | unchanged |
| T2 — Behavioral micro-signals | ✅ | `interaction_log` stream (§4) |
| T3 — Repair/longitudinal state | ✅ derived only | computed from existing rows + stream (§6); no new writes |
| T4 — Question-bank health | ✅ derived only | operator queries over attempts (§7) |
| T5 — Engagement/business | ✅ thin | 2 new PostHog events (§8) |

Explicitly **out** of v1: keystroke/mouse telemetry, free-text "why" prompts, annotation tracking, mastery-decay scheduling changes (the decay *metric* is defined; acting on it in the queue is a later feature).

## 4. The attempt payload contract (client → `POST /api/attempts`)

Existing fields unchanged. One new optional field:

```jsonc
{
  "question_id": "uuid",
  "selected_letter": "A",            // final answer
  "confidence": 3,                   // 1–5
  "time_seconds": 74,                // unchanged: shown → submit
  "platform": "web",
  "set_id": "uuid",
  "interaction_log": [               // NEW, optional, ordered, ms offsets from question render
    { "t": 0,     "ev": "shown" },
    { "t": 18200, "ev": "select",         "letter": "B" },
    { "t": 41000, "ev": "scroll_stem" },
    { "t": 59300, "ev": "select",         "letter": "A" },
    { "t": 74100, "ev": "submit",         "letter": "A" }
  ]
}
```

The stream posted with the attempt necessarily ends at `submit` — forensics happens after the POST and is reported separately (§ Forensics dwell below).

### Event vocabulary (closed set, v1)

| `ev` | Fields | Fired when |
|---|---|---|
| `shown` | — | question rendered (always `t: 0`) |
| `select` | `letter` | student taps/clicks a choice (every change, including the final one) |
| `scroll_stem` | — | viewport scrolls back to the fact pattern after the choices have been visible (debounced 1/s) |
| `submit` | `letter` | final answer locked (always the last event in the posted log) |

Rules:

- Unknown `ev` values are **rejected** server-side (closed vocabulary keeps the column queryable; extending it is a deliberate schema decision, not drift).
- Max 200 events / 16 KB per attempt; server truncates oldest non-`submit` events beyond that.
- `interaction_log` absent or empty ⇒ attempt is still valid (legacy clients, JS failures). **Telemetry must never block the answer.**
- No PII possible by construction: letters and timestamps only, consistent with the `events.ts` blocked-keys rule.

### Forensics dwell — the one post-submit wrinkle

`forensics_open`/`forensics_close` happen *after* the attempt POST. v1 handles this with one small endpoint: `PATCH /api/attempts/{id}/forensics-dwell` body `{ "dwell_ms": 21500 }`, sent once on panel close (fire-and-forget, `keepalive: true`). If it never arrives, dwell is `null`, which is itself signal (skipped forensics).

## 5. Server-side storage

```sql
ALTER TABLE student_attempts
  ADD COLUMN interaction_log jsonb,
  ADD COLUMN forensics_dwell_ms integer;
```

Validation at the API boundary (closed `ev` set, size cap, monotonic `t`). No indexes on the JSONB in v1 — all derived metrics are computed in batch/operator queries, not on the student hot path.

## 6. Derived metrics — definitions (computed, not stored per-attempt)

These are SQL views / nightly rollups. Definitions are normative so the numbers mean the same thing everywhere.

| Metric | Definition |
|---|---|
| **time_to_first_selection** | `t` of first `select` − 0. Splits slow-reader from deliberator. |
| **deliberation_time** | `t(submit)` − `t(first select)`. |
| **answer_changes** | count(`select`) − 1. |
| **switched_off_correct** | true iff any `select.letter` = correct letter AND `submit.letter` ≠ correct letter. The highest-value flag in the stream. |
| **stem_rereads** | count(`scroll_stem`). |
| **confidence_quadrant** | `confident` = confidence ≥ 4, `unconfident` = ≤ 2 (3 is neutral, excluded from quadrant rollups). Crossed with `correct` ⇒ `confident_wrong` (counterfeit bought — TEAR target), `unconfident_right` (fragile), `confident_right` (mastered), `unconfident_wrong` (coverage gap). |
| **picked_top_trap** | on a miss: selected choice has the highest focus-group `pct` among wrong choices ⇒ designed-trap victim; else idiosyncratic confusion. Different repair prescriptions. |
| **forensics_skipped** | miss with `forensics_dwell_ms` < 3000 or null. Predicts repeat misses; coachable. |
| **attempt_number** | row_number per (student, question) and per (student, tension_point/trap tag), ordered by `attempted_at`. Repeat-encounter outcome = `correct` on attempt_number > 1. |
| **repair_latency** | for a miss that enqueues a repair item: `completed_at(repair)` − `attempted_at(miss)`. |
| **session_position** | ordinal of the attempt within its `set_id`; accuracy-by-position gives the fatigue curve. |
| **decay curve** | accuracy on a (student, subject/trap cell) as a function of days since that cell was last touched. Metric only in v1; scheduler integration later. |

## 7. Question-bank health (operator, every attempt is a vote on the question)

- **Live pick-rate vs. focus-group `pct`** per choice — divergence beyond a threshold (start: ±15 pts with n ≥ 30) flags the question for review.
- **Discrimination** — point-biserial of `correct` vs. student rolling accuracy; negative with n ≥ 30 ⇒ broken question, surface in operator console.
- **Time outliers** — median `time_seconds` > 3× bank median ⇒ wording review.
- All computed from existing rows; no new capture needed.

## 8. PostHog additions (engagement layer only)

Two new members of the `FunnelEvent` union in `src/lib/events.ts`:

- `"set_abandoned"` — fired on leaving a set mid-run; props: `{ set_type, position, total }`.
- `"forensics_skipped"` — fired when a miss's panel closes under 3 s; props: `{ subject }`.

Everything diagnostic stays out of PostHog (no question ids, no letters), per the existing no-PII discipline.

## 9. Error handling & failure modes

- Telemetry assembly wrapped so any client error degrades to posting the attempt **without** `interaction_log` — answering is sacred, instrumentation is not.
- Dwell PATCH is fire-and-forget with `keepalive`; tab-close loss is accepted in v1 (null = skipped, which over-counts skips slightly — acceptable bias, noted in metric docs).
- Server rejects malformed logs with a 200-on-attempt / log-dropped semantics (attempt row saved, `interaction_log` null, warning logged server-side) — never 4xx the student's answer for bad telemetry.

## 10. Testing

- Unit: client event-recorder reducer (select/scroll/submit ordering, debounce, ms offsets, truncation).
- Unit: server validator (closed vocab, size cap, monotonic `t`, null-log passthrough).
- Integration: attempt POST with and without log; dwell PATCH; legacy payload (no new field) unchanged.
- SQL: fixture attempts ⇒ each §6 metric returns the hand-computed value (esp. `switched_off_correct` and quadrant edges at confidence 3).

## 11. Rollout

1. Schema migration (additive, zero-downtime).
2. API validation + dwell endpoint.
3. Client recorder in `Practice.tsx` drill flow first (it already has the choose/forensics lifecycle), then diagnostic and repair surfaces.
4. Derived-metric views + operator queries.
5. PostHog events last.
