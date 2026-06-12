# P5 — PAID PROGRAM QUICK WINS

**Implementer:** Claude Code · **Inherits:** cc-handoff docs 00 (safety
gates, blocked terms), 02 (tokens), 03 (data contract), 04 (analytics
rules). Read `docs/SERVER_INVENTORY_2026-06-12.md` before assuming
anything server-side is missing.
**Objective:** ship the highest-leverage enhancements that need NO new
API endpoints — everything here runs on data and code that is already
live. One session, frontend-heavy, immediate credibility and
perceived-value gains for paying students.

## 0. Guardrails (apply to every item)

- Sanctuary Covenant: no streaks, no guilt, no leaderboards, no
  "falling behind" language.
- Attorney directive: zero attorney-review/attorney-grade mentions.
- Founder voice: no founder bio, no bank-size bragging in student-facing
  copy beyond honest subject counts (§5 is honest inventory, not a boast).
- Locked vocabulary: LEXICON.md. Drift scan all new copy.
- No-repeat ledger is law: a question answered anywhere never surfaces
  again anywhere.

## 1. Subject Practice — flip the switch

`src/pages/Practice.tsx:37` → `const SHOW_SUBJECT_PRACTICE = false;`
The per-subject drilling UI is fully built behind this flag.

- Set to `true`, verify the subject grid renders, sets pull fresh
  questions, and `practice_set_start`/`practice_set_complete` events
  fire with `mode: "subject"`.
- Confirm no-repeat ledger holds across subject sets vs repair/diagnostic.

## 2. Fresh-question retests

Today retests draw from the 81-question client qdata bank. The server
bank has 3,792 questions (`/api/questions/by-subject`, no-repeat ledger
server-side). Switch spaced retests and the post-repair 3-question
retest to draw unseen server-bank questions from the same trap family
(`filter_broken`/`mold` match).

- Touch: `src/program/repair.ts`, `src/program/plan.ts`,
  `src/lib/api-client.ts`.
- Copy moment (use it): "Different questions. Same trap. That's how we
  know it's repaired."
- Fallback: if the family has no unseen server questions, fall back to
  current behavior silently — never block a retest.

## 3. Today's Truths recap card

Dashboard footer card showing the 2–3 `review_truth` values the student
earned today (from questions attempted today). Data already returned in
forensics payloads; zero new endpoints.

- Touch: `src/components/` (new small card) + dashboard/Welcome
  dashboard-mode render.
- Empty state: card hidden. Never an empty exhortation.

## 4. Recovery chip in forensics

On a miss, surface the choice's `future_cue` as ONE chip: the single
next move. Lives in `src/components/ForensicsPanel.tsx`.

- One chip, not a list. If `future_cue` is absent, render nothing.

## 5. Honest subject coverage panel

Per-subject honest inventory on the dashboard or subject surfaces:
"Torts — 523 questions · 9 trap families mapped." Counts from
`/api/questions/by-subject`, `/api/tensions?subject=`,
`/api/traps?subject=`.

- Honest numbers only — render what the API returns, never a padded or
  rounded-up figure. This is credibility, not marketing.

## 6. Repair Ledger (new surface)

A dated, append-only timeline of evidence: each zone repaired, each
spaced retest held, each retest that re-opened a zone (honest both
ways). Built from `student_red_zones` (147 rows live; per-zone status +
last-miss date) and attempt history — no new tables.

- Framing is the anti-streak: a record of what is permanently fixed,
  not a chain that can break. Suggested header: **"The ledger."**
  Entries like "Jun 14 — THE TRUE-BUT-WRONG PICK repaired. Held on
  retest Jun 18."
- A re-opened zone is logged matter-of-factly: "Re-opened Jun 20.
  Back in rotation." No shame state.
- This is the student's answer to "what did I get for $999." Make it
  printable/screenshot-clean.
- Route suggestion: section on `#/dashboard`; full view at `#/ledger`
  if it earns its own page.

## 7. Events (extends doc 04 — server-trustworthy, no PII)

`practice_subject_set_start`, `retest_fresh_served` (props: zone,
source: server|client), `truths_card_shown`, `ledger_viewed`.

## 8. Acceptance

- [ ] Subject practice visible to enrolled students, hidden from anon
- [ ] A spaced retest serves questions the student has never seen
      (verify against attempt history)
- [ ] No-repeat ledger verified across practice + repair + retest
- [ ] Truths card shows only truths earned today; hidden when none
- [ ] Recovery chip renders on miss with `future_cue`, absent otherwise
- [ ] Subject counts match live API responses exactly
- [ ] Repair Ledger renders pass AND re-open events without guilt copy
- [ ] Drift scan passes on all new copy
- [ ] Clerk-gated flows verified on barmatrix.app (keys are
      domain-locked; prod is the only place auth is testable)
