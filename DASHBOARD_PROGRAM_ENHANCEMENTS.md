# Dashboard + Paid Program Enhancements — Growing Bank Edition

*Written 2026-06-12, right after batch 1 (106 questions) went live in the prod DB.
Companion to REQUIREMENTS.md (§3B enrolled surfaces), HANDOFF_PROGRAM.md, and
BATCH1_CQ_INGESTION.md. Everything here respects the spine: "lead me, no choice" —
one primary action, glass panels that mirror but never open a picker.*

---

> **Execution handoffs (2026-06-12):** this roadmap is now packaged into four
> self-contained implementation briefs — `handoffs/P5_QUICK_WINS.md` (no new
> endpoints), `handoffs/P6_PERSONALIZATION_ENDPOINTS.md` (one small endpoint
> each), `handoffs/P7_TELEMETRY_TRACK.md` (requires `feat/attempt-telemetry`
> merge first), `handoffs/P8_FINAL_SPRINT.md` (exam-week deck + founder-gated
> emails). Implementers start there.

---

## 0. What changed underneath us

- The prod bank is **3,792 questions** (3,686 pre-existing + 106 batch-1), with
  hundreds per subject (Torts alone reports 523 via `/api/questions/by-subject`).
  The live drill player still draws from the **81-question static qdata bank** —
  the gap between what students touch and what we own is now ~47×.
- Batch 1 is the first content with the full intelligence layer in the DB:
  per-choice `why_attractive` / `why_wrong_or_correct` / `future_cue`, trap molds on
  every wrong answer, **misconception_tags populated for the first time**, gold/silver
  keys with `last_minute_review` flags, remediation cards, review truths, and 372
  micro-drill seeds in the subject packs.
- The server already has the hard parts: day-plan engine (`/api/me/day-plan`),
  adaptive selection (`c3-bandit.ts`), prescribed drills, red zones, forensics.
  Almost everything below is **content wiring, not new architecture**.

## 1. The organizing idea

The bank's growth changes one thing fundamentally: **we never have to show a student
a question twice unless WE choose to.** Every enhancement below is a payoff of that:
fresh retests, honest mastery, earned keys, and a daily rhythm that doesn't repeat.

## 2. Dashboard enhancements (the spine + the glass)

### Now — data is already live, frontend work only

1. **Fresh-question spaced retests.** The repair loop's 4-day retest currently risks
   reusing qdata questions the student has seen. With ≥3 qids per (trap mold ×
   subject) in the DB, the retest can always serve *unseen* questions from the same
   (filter, mold) family. This is the single biggest credibility upgrade: "we retest
   it again in 4 days" now means a real test, not recall.
2. **Today's Truths recap card.** Every batch-1 question carries a one-line
   `review_truth`. After each completed step, the dashboard's quiet footer shows the
   2–3 truths the student earned today ("Later readiness does not save the claimant
   when…"). Zero new endpoints — truths ride in question metadata. Maps and mirrors:
   it's a mirror of work done, not a task.
3. **Recovery chip in forensics.** Wrong answers now carry `future_cue` (the recovery
   step: "Run the timeline backward to December 5"). Surface it as the single
   next-move chip on the miss screen — this is the Expose layer's missing half.

### Next — small API additions (one endpoint or one query each)

4. **The Daily Rep (60-second warm-up).** Before the day's primary action, a 3-item
   micro-drill set from the 372 drill seeds (prompt → tap-to-reveal answer → "got it
   / shaky"). Typed by `target_skill` (CUT / CLASH / Issue-Sense / timeline), so the
   warm-up always matches the day's prescribed zone. Needs:
   `GET /api/c3/subjects/:code/microdrills` (packs are generated, suffix-isolated,
   ready to import in `c3-subjects.ts`). "Shaky" feeds the zone heat quietly.
5. **Brass Keys collection.** Gold/silver keys are *earned*, not browsed: a key
   unlocks (brass stamp animation, existing motion vocabulary) when the student
   repairs a zone whose questions teach it. The dashboard glass shows the keyring —
   239 keys exist; a July-cohort student might earn 40–60. This converts repair work
   into a visible, durable asset and seeds the exam-week deck (below) without
   building Final Sprint yet.
6. **Misconception mirror.** Batch 1 populates `misconception_tags`
   ("performance_date_controls_everything", "direct_notice_required"). When the same
   misconception fires across ≥2 different zones, the glass names it once: "One belief
   is causing misses in two places." This is PersonalMatrix's sharpest cell, shipped
   early as a single card instead of the full Phase-4 heat grid.

### Later — needs attempt volume

7. **Calibration mirror.** `student_attempts.confidence` (1–5) already exists; batch-1
   metadata carries the question's confidence class (ANCHOR_ASSISTED etc.). Plot
   "sure-and-wrong" vs "unsure-and-right" per zone. Sanctuary rule: shown as a
   private mirror, never a score.
8. **Cohort pick-rate slot.** As real attempts accumulate on the new questions, the
   ForensicsPanel `cohortPct` placeholder fills ("41% of past cohorts chose this").
   No focus-group numbers ever (founder decision 2026-06-11); batch 1 has none anyway.

## 3. Paid program (TEAR) enhancements

1. **DB-backed prescribed drills (the big unlock).** Move the repair loop's question
   source from the 81-file qdata bank to `/api/drills/prescribed` against the full
   bank, filtered by (filter_broken, mold) with seen-question exclusion. The
   c3-bandit already does adaptive selection server-side. qdata stays as the
   anonymous/funnel bank; enrolled students get the deep bank. This is the moment
   the $999 product becomes visibly bigger than the free funnel.
2. **Per-lesson embedded graded drills.** The component map's Phase-3 row is now
   content-complete: each TEAR lesson embeds micro-drills matched by `target_skill`
   (Lesson 8 "not-responsive molds" → wrong_element/bait_doctrine seeds; Lesson 9
   "tension points" → timeline_clash seeds), then 2–3 full questions from the matching
   trap-mold pool via `POST /api/foundations/{slug}/attempts`.
3. **Trap-mold drill circuits as prescriptions.** The 42 generated pool drills
   (e.g. "Trap mold: tiered_absolute", 12 Torts questions) become prescribable units:
   when a student's hottest zone maps to a mold, the day plan assigns the circuit,
   not a hand-picked set. Pass criterion is already in the pack JSON.
4. **Last-Minute Review deck (deferred surface, seeded now).** Keys flagged
   `last_minute_review: true` + remediation cards + review truths accumulate into a
   per-student exam-week deck. Don't build the Final Sprint UI yet (REQUIREMENTS §3C
   defers it) — but record the earned-deck membership from day 1 so the deck is full
   when the surface ships.
5. **Subject coverage honesty on #/subjects.** With real per-subject volume, the
   public subject pages and the mastery coverage ring can show honest counts
   ("Torts: 523 questions, 9 trap families mapped"). Composes from existing
   `/api/tensions?subject=` + `/api/traps?subject=` — no new API.

## 4. Build order (respects REQUIREMENTS §9 and P1)

| Step | Item | Size | Dependency |
|---|---|---|---|
| 1 | Fresh-question retests + recovery chip (§2.1, §2.3) | S | none — data live |
| 2 | DB-backed prescribed drills for enrolled (§3.1) | M | Clerk-gated drills endpoints (already exist server-side) |
| 3 | Today's Truths card (§2.2) | S | none |
| 4 | Micro-drills endpoint + Daily Rep (§2.4) | M | wire packs into c3-subjects.ts |
| 5 | Lesson-embedded drills (§3.2) | M | `#/program` lessons (Phase 3) |
| 6 | Brass Keys collection (§2.5) | M | zone-repair events (exist) |
| 7 | Misconception mirror (§2.6) | S | attempts on batch-1 questions |
| 8 | Calibration mirror, cohort slot (§2.7–8) | M | attempt volume |

## 5. Hard rules carried forward

- One primary action everywhere; glass never opens a picker.
- Maps and mirrors, not scoreboards — no streaks, no leaderboards, no percentile shame.
- No focus-group numbers in any student-facing payload, ever.
- Outline codes from batch 1 are unverified — never use for navigation or labels.
- Each batch re-runs `generate-cq-batch.ts all` → load → these surfaces get denser
  with zero additional build.
