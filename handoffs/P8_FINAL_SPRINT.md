# P8 — FINAL SPRINT (EXAM-WEEK EXPERIENCE)

**Implementer:** Claude Code · **Inherits:** docs 00, 02, 03, 04 and
P5 guardrails. **Objective:** convert data the program has been quietly
accumulating since day 1 into the exam-week finale — the single biggest
"this was worth $999" moment in the product. Pairs naturally with P6 §5
(exam date); build that first or alongside.

## 1. The Last-Minute Review deck

Membership has been recording since day 1: gold/silver keys flagged
`last_minute_review: true` plus remediation cards, accumulated per
student as they work. The surface was deferred (REQUIREMENTS §3C);
this builds it.

- Server: `GET /api/me/final-sprint` → the student's accumulated deck
  (keys earned + remediation cards from their misses), ordered: live
  zones first, then repaired-but-recent, then the rest.
- UI: a card-by-card review deck at `#/final-sprint`. One card per
  screen, swipe/advance. Each card is a key or remediation truth the
  student EARNED — frame it that way: "You built this deck. Every card
  is a pattern you paid for in misses and repaired."
- Empty/thin state (early buyer peeks at it): show the count and the
  promise — "12 cards so far. It grows every time you repair." Never
  fake fullness.
- Printable/exportable view (single page, clean) — students will want
  it on paper the night before.

## 2. Exam-week mode (T-minus-7 reorientation)

When `exam_date - today ≤ 7` (P6 §5), the dashboard reorients. Cheap
orchestration of existing pieces:

- Final Sprint deck becomes the primary surface; day-plan ladder
  switches to: deck review → daily reps on still-live zones only →
  short timed sets. No NEW zones opened inside T-7.
- Verse rotation: weight selection toward the courage/peace verses in
  the existing 73-verse bank (tag or id-list the subset; the rotation
  system is live).
- Tone: calm, settled, zero countdown pressure. The date never renders
  as a ticking number. Suggested line: "The work is done. This week we
  keep it warm."
- After exam date passes: dashboard offers a single quiet state ("It's
  in God's hands and yours now.") with the deck still accessible. No
  surveys, no upsells.

## 3. Weekly Repair Report email

One email per week via existing Resend wiring. **ACTIVATION IS
FOUNDER-GATED — build dark behind a flag** (same protocol as the P1
welcome email; do not send without explicit founder approval).

- Content (plain, short): zones repaired this week · what's holding
  (retests passed) · the next scheduled retest · ONE review truth from
  this week's work. No streaks, no "you've been quiet," no guilt re-
  engagement hooks. If the student did nothing this week, the email
  simply doesn't send — absence of work is never named.
- Server: weekly job (cron or internal job endpoint pattern —
  `POST /api/internal/jobs/*` precedent exists; needs
  INTERNAL_JOB_SECRET env, currently absent on prod).
- Unsubscribe honored instantly, one click.

## 4. Welcome email (carry-over from P1 §4)

Still founder-gated, still pending. If approval lands during this work,
ship it from the existing P1 spec (subject: "Your Red-Zone map is
ready"). Listed here so it isn't orphaned.

## 5. Events (doc 04 rules)

`final_sprint_viewed` (card_count), `final_sprint_card_advance`,
`exam_week_mode_entered` (server-side), `weekly_report_sent` /
`weekly_report_opened` (server-side, no PII).

## 6. Acceptance

- [ ] Deck renders the student's true accumulated membership (verify
      against keys/remediation rows for a test student)
- [ ] Thin-state shows honest count; deck grows after a repair
- [ ] Printable view fits one page, clean, no app chrome
- [ ] T-7 reorientation flips the ladder; no new zones open inside T-7
- [ ] Verse rotation inside exam week draws from the courage/peace
      subset; no-repeat rotation still holds
- [ ] Weekly email renders correctly in dark-flag preview; ZERO sends
      without founder approval flag
- [ ] No-activity week produces no email
- [ ] Drift scan passes on all new copy
