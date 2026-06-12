# BATCH 1 — CQ Question Ingestion + Drill System Design

*Written 2026-06-12. Companion to INGESTION.md. Covers the first full batch from
`C:\CCG\Finished` (106 questions), the generator that converts them, what they unlock,
and the load/verify runbook.*

---

## 1. What exists now

All 106 files in `C:\CCG\Finished` parse and pass the QA gate (0 quarantined). The
generator lives in the API repo:

| Artifact | Path |
|---|---|
| Generator (parse + QA + SQL + packs) | `barmatrix-api/src/scripts/generate-cq-batch.ts` |
| QA report (PASS/quarantine + warnings) | `barmatrix-api/tasks/cq-batch-2026-06-12/qa-report.{json,md}` |
| DB load script (idempotent upserts) | `barmatrix-api/tasks/cq-batch-2026-06-12/cq-batch.sql` (~900 KB) |
| Subject packs (7 subjects × 5 files) | `barmatrix-api/tasks/cq-batch-2026-06-12/packs/<subject>/` |

Run: `npx tsx src/scripts/generate-cq-batch.ts all` (commands: `qa | sql | packs | all`).
The parser tolerates every emitter generation found in the batch (nested stems,
`question_yaml` wrappers, numeric qids, `answer_choices` objects, unquoted `": "`
scalars, six different residual-explanation field names). Re-running is safe: UUIDs are
deterministic (SHA-256 of qid) and all SQL is `ON DUPLICATE KEY UPDATE`.

**Batch contents (per readiness checklist, INGESTION §3):**

| Subject | Questions | Pool drills | Micro-drills | Keys | Anchor cards |
|---|---|---|---|---|---|
| TORTS | 23 | 9 | 81 | 52 | 23 |
| CONTRACTS | 19 | 7 | 67 | 39 | 19 |
| CRIMINAL_LAW | 17 | 6 | 61 | 40 | 17 |
| CIVIL_PROCEDURE | 14 | 6 | 53 | 30 | 14 |
| CONSTITUTIONAL_LAW | 14 | 6 | 49 | 37 | 14 |
| EVIDENCE | 10 | 4 | 33 | 22 | 10 |
| REAL_PROPERTY | 9 | 4 | 28 | 19 | 9 |
| **Total** | **106** | **42** | **372** | **239** | **106** |

Every item carries: stem + 4 choices + correct flag, per-choice `why_attractive` /
`why_wrong_or_correct` / `future_cue` (recovery step), mold tags per wrong answer,
tension axis, gold/silver keys, a remediation card, and 3–4 drill seeds. **No measured
pick rates exist in this batch** — every percentage is provenance `predicted`, so no
`focus_group_response_data` rows are emitted (pick-rate honesty preserved).

## 2. Field → product surface map (the design)

| Source field | DB landing | Surface it powers |
|---|---|---|
| stem / choices / call | `questions` + `answer_choices` | Bank, diagnostic expansion, `#/subjects` coverage |
| per-choice whys + future_cue | `answer_choices.why_*`, `future_cue` | ForensicsPanel / Expose after a miss (already wired — lights up as soon as rows load) |
| mold_code + architecture per wrong choice | `answer_choices.forensic_tags` + `question_tags(trap_family)` | `#/traps` catalog, PersonalMatrix heat columns, trap pull-counts |
| tension_axis | `questions.tension_point` + `question_tags(tension)` | `#/tensions` observed list (see §3 caveat) |
| gold/silver keys (`last_minute_review` flags) | `questions.metadata.gold_keys/silver_keys` + `question_tags` | KeyCard in forensics; **new: Last-Minute Review deck** — 239 keys already flagged for it |
| remediation card | `questions.metadata.anchor_card` + `answer_choices.remediation_id` | Anchor deck per subject; post-miss prescription |
| drill_seeds (B5) | subject packs `*_microdrills.cq.json` | **New item type: micro-drills** — 372 prompt/answer flashes typed by skill (CUT/CLASH/Issue-Sense/timeline) for `#/program` lesson-embedded drills |
| mold/topic groupings | subject packs `*_drills.cq.json` | Prescribed drills + red-zone ranking (qid pools of 3–17 per mold) |
| confidence / deciding_phase | `questions.metadata` | Calibration features (Lesson 13) later |
| misconception_tags | `answer_choices.misconception_tags` + `question_tags` | Future misconception analytics (first batch to populate this column) |

**Component unlock status vs INGESTION §4:** wrong-answer trap tagging ✔ (`#/traps`
unlockable), 7/8 subject coverage ✔ (`#/subjects` honest snapshots), per-lesson drill
items ✔ (micro-drills), volume-per-subject partially (9–23 vs ≈30 bar — Torts/Contracts
closest). Focus-group weighting and cohort pick rates remain empty by design.

## 3. Tension catalog caveat (founder input)

Tension axes in this batch are **bespoke per question** (e.g. "later readiness /
label-only answer vs reliance before cure") — 1 question per axis, so the
≈5-questions-per-tension bar from INGESTION §6 cannot be met by volume alone. Options,
in recommended order:

1. Treat **trap molds** (wrong_element ×66, bait_doctrine ×47, tiered_absolute ×80…) and
   **topics** as the public catalog groupings now; keep bespoke tensions as per-question
   detail. This batch already supports it.
2. Run a consolidation pass mapping bespoke axes onto a fixed tension taxonomy
   (~30–50 named tensions). Mechanical LLM pass over `qa-report.json`; do before
   `#/tensions` goes public.

## 4. Load + verify runbook

1. **Load:** apply `tasks/cq-batch-2026-06-12/cq-batch.sql` to the API database (same
   channel used for the ambassador diagnostic SQL). Idempotent; re-apply safe.
2. **Verify (INGESTION §5):**
   - `GET /api/questions/by-subject?subject=TORTS` — new external_ids appear
   - `GET /api/tensions` — observed tension counts jump by ~106
   - `GET /api/attempts/{id}/forensics` on a test attempt against a batch question —
     per-choice why + future_cue render; **no pick-rate numbers anywhere** (none exist)
   - Spot-check 2–3 stems end-to-end vs the source files (start: 20556 / 19607 / 17058)
3. **Wire packs (code change, separate PR):** extend `SubjectCode` in
   `src/lib/c3-subjects.ts` to the 7 subjects and import the `*.cq.json` packs (they are
   suffix-isolated; criminal/rp legacy packs untouched). Micro-drills need a small new
   type + endpoint (`GET /api/c3/subjects/:code/microdrills`) following `getDrills()`.
4. **Re-run after future batches:** drop new CQ files into `C:\CCG\Finished`, run
   `generate-cq-batch.ts all`, re-apply. Quarantine list in qa-report.md is the
   fix-it queue back to the transform pipeline.

## 5. Known data caveats

- `outline_code` values are **invented** (no outline map exists) — stored in metadata
  with `outline_code_verified: false`; never use for navigation (2026-06-12 audit).
- 79/106 files never name the dominant trap (B1 `answer_array.dominant_trap` absent) —
  warning-level; trap attractiveness ranking will need predicted-rate inference or
  cohort data.
- CQ19607 uses an older five-block layout but parses fully; verified manually.
