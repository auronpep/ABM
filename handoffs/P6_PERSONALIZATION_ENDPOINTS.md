# P6 — PERSONALIZATION (ONE SMALL ENDPOINT EACH)

**Implementer:** Claude Code · **Inherits:** docs 00, 02, 03, 04 and
P5 guardrails (Sanctuary Covenant, attorney directive, LEXICON, no-repeat
ledger). Server work lands in barmatrix-api; read
`docs/SERVER_INVENTORY_2026-06-12.md` first — most data already exists.
**Objective:** five features that each need exactly one small API
addition (or one query change) and make the program feel personally
intelligent rather than generic.

## 1. The Daily Rep

60-second warm-up: 3 micro-drills typed by `target_skill`, served before
the day's primary action. 372 micro-drill seeds per subject already
ingested (batch 1).

- New endpoint: `GET /api/c3/subjects/:code/microdrills` (Clerk-gated,
  respects no-repeat ledger for full questions; micro-drills themselves
  may repeat by design — they are reps, not questions).
- UI: small card above DayPlanCard. "The Daily Rep — 60 seconds."
  Completing it is satisfying, skipping it is consequence-free; no
  streak counter, ever.

## 2. Brass Keys collection

Keys are EARNED, never browsed. A gold/silver key unlocks when its zone
is repaired. 239 keys exist in the bank.

- New endpoint: `GET /api/me/keys` → keys unlocked by this student's
  repaired zones (join `student_red_zones` status → keys by trap family).
- UI: keyring visual on the dashboard. Locked keys render as silhouettes
  with no name — curiosity, not checklist pressure.
- Framing: durable asset. "Every key you hold is a pattern you own."

## 3. Misconception Mirror

`misconception_tags` are populated (first time, batch 1). When the same
misconception fires across ≥2 zones, surface it ONCE:
"One belief is causing misses in two places: {misconception}."

- New endpoint: `GET /api/me/misconceptions` → tags appearing in ≥2 of
  the student's live zones, with zone names.
- Personal, never comparative. One card max per visit; dismissible;
  re-surfaces only if it fires in a NEW zone.

## 4. Confidence-weighted zone prioritization

The day-plan ladder currently ranks the "hottest" zone by miss count.
High-confidence misses (confidence 4–5, wrong) are the most dangerous
kind — the student doesn't know they're wrong. Confidence is already
captured on every attempt (`student_attempts.confidence`).

- One query change in the day-plan/zone ranking: weight misses by
  confidence (suggested: weight = confidence, so a confident miss counts
  4–5× an unsure one). Keep the ladder's priority order otherwise intact
  (`src/program/plan.ts` mirror + server `/api/me/day-plan`).
- Copy moment when such a zone is served: "This one feels right to you.
  That's exactly why it's first."

## 5. Exam-date-aware day plan

Let the student set their exam date once; the plan engine counts down to
a real date instead of counting up from purchase.

- Schema: `students.exam_date DATE NULL` (one column; schema is locked —
  confirm with founder before migration, or store in Clerk
  `unsafeMetadata` like other cross-device prefs to avoid the migration
  entirely — PREFER the metadata route, zero schema change).
- Behavior: spaced-retest intervals compress as the date approaches
  (e.g., 4-day holds become 2-day inside T-14); mixed timed sets weight
  toward still-live zones inside T-21. Exact curve is implementer's
  choice — document it in the PR.
- Never render "X days left" as pressure. The date changes the
  prescription, not the tone.

## 6. Events (doc 04 rules)

`daily_rep_complete`, `key_unlocked` (key_id, zone),
`misconception_surfaced` (tag, zone_count), `exam_date_set`.

## 7. Acceptance

- [ ] Daily Rep serves 3 typed micro-drills in <1s, completes in ~60s
- [ ] Keyring shows exactly the keys for repaired zones; locked keys
      unnamed
- [ ] Misconception card fires only at ≥2 zones, once, dismissible
- [ ] A confidence-4 miss outranks two confidence-1 misses in zone
      ordering (write the test first)
- [ ] Exam date persists cross-device; retest intervals verifiably
      compress inside the window
- [ ] No new copy violates Sanctuary Covenant; drift scan passes
- [ ] All endpoints Clerk-gated, 401 on anonymous probe
