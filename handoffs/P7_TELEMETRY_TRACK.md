# P7 — TELEMETRY-POWERED FEATURES

**Implementer:** Claude Code · **Inherits:** docs 00, 02, 03, 04 and
P5 guardrails. **Objective:** turn the attempt-telemetry framework
(dwell, hesitation, choice-dwell, confidence — captured client-side in
`src/lib/attemptTelemetry.ts`) into features no competitor has. All
mirrors here are PRIVATE — the sanctuary rule: a mirror the student
looks into, never a score shown to anyone else.

## 0. HARD PREREQUISITE — do this first

The API side of attempt telemetry lives on the unmerged
`feat/attempt-telemetry` worktree in barmatrix-api (client side deployed
2026-06-12). Until it merges, telemetry fields are captured but not
stored.

- [ ] Merge `feat/attempt-telemetry` into barmatrix-api main
- [ ] Staging smoke: submit an attempt, verify dwell/hesitation/
      choice-dwell rows land
- [ ] Backfill is NOT possible — features below only see attempts made
      after the merge. State this honestly in any UI ("since June 2026").

Nothing else in this handoff starts until these boxes are checked.

## 1. Second-Guess Forensics

Choice-dwell telemetry records time spent on each choice and switches
between choices. Detect the answer-switching pattern: student selects
(or dwells decisively on) the correct answer, then moves off it.

- Server: aggregate per student per week — `switched_off_correct_count`,
  with question ids. New endpoint `GET /api/me/telemetry/second-guess`.
- UI: a forensics card, TEAR-voiced: "Four times this week you held the
  right answer and traded it away. The counterfeit isn't the wrong
  choice — it's the move." Link each instance to its question forensics.
- Thresholds: surface only at ≥3 instances/week (below that it's noise).
  Never surface on a single attempt in the moment — this is a weekly
  pattern mirror, not a live nag.

## 2. Pacing Mirror

MBE budget is ~1.8 min/question. Dwell per question is captured.

- Server: per-subject median dwell on timed sets,
  `GET /api/me/telemetry/pacing`.
- UI: private read on the dashboard after timed sets: "You bank time on
  Evidence and spend it on Property." Show banked/spent per subject
  against the 1.8 budget. No red alarm styling — information, not alarm.
- Minimum data: ≥2 timed sets before rendering anything.

## 3. Calibration Mirror

Confidence (1–5) vs correctness heatmap. Needs volume — gate on ≥50
attempts with confidence recorded.

- Server: `GET /api/me/telemetry/calibration` → 5×2 grid counts.
- UI: private heatmap; the one sentence that matters renders on top:
  the cell with the most mass (e.g., "When you're at 4, you're right
  61% of the time. When you're at 2, you're right 70%. Trust your 2s
  more."). Plain, no judgment.

## 4. Timed exam simulation blocks

Scale the existing 6-question timed mixed set to MBE-format blocks:
25 / 50 / 100 questions. The 3,792-question bank with the no-repeat
ledger supports this for the program's lifetime.

- Server: extend the mixed-set builder to sized blocks; subject mix
  mirrors MBE weighting; serve unseen questions only.
- Timing: 1.8 min/q budget per block (45 min / 90 min / 3 hr); pacing
  telemetry on so §2 gets richer with every block.
- Review surface: end-of-block review runs each miss through the
  standard ForensicsPanel reveal; misses feed red-zone synthesis exactly
  like drills (one pipeline, no special case).
- Entry point: Practice Library, behind enrollment. Name suggestion:
  "Full blocks." Reserve "simulation" framing — it must feel like the
  real thing, not a game.

## 5. Events (doc 04 rules)

`second_guess_surfaced` (count), `pacing_viewed`,
`calibration_viewed`, `block_start` / `block_complete` (size, score —
server-side).

## 6. Acceptance

- [ ] §0 prerequisite boxes all checked (merge + staging smoke)
- [ ] Second-guess card only at ≥3/week; each instance links to forensics
- [ ] Pacing mirror hidden until ≥2 timed sets
- [ ] Calibration hidden until ≥50 confidence-tagged attempts
- [ ] A 25-question block serves 25 unseen questions, MBE subject mix,
      45-minute clock; misses create/heat red zones
- [ ] No telemetry surface is visible to any other student; endpoints
      Clerk-gated
- [ ] Drift scan passes on all new copy
