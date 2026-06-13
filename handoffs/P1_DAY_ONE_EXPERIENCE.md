# P1 — DAY-1 BUYER EXPERIENCE

**Implementer:** Claude Code · **Inherits:** cc-handoff docs 00 (safety
gates, blocked terms), 02 (tokens), 04 (analytics rules).
**Objective:** every buyer completes their first full repair loop —
drill → retest → visible repair — within 24 hours of purchase. This is
refund prevention, retention, and testimonial generation in one system.

## 1. The 60 seconds after purchase

Stripe success → existing entitlement grant → redirect to `/welcome`
(new), NOT the generic dashboard.

`/welcome` choreography (same motion vocabulary as the funnel):
1. Confirmation line: **"You're in."** + cohort line ("July 2026 cohort").
2. Their Red-Zone map renders — carried from their diagnostic session
   (see §3 linkage). Stamp animation on their #1 red zone.
3. One sentence: "Your first repair starts with {ZONE NAME}. {N} drills,
   then a timed retest. About 20 minutes."
4. One button: **"Start the first repair."** Nothing else on the page.

## 2. The first repair loop (the product's first proof)

- Drill set: 4–6 drills auto-assigned from the buyer's #1 red zone
  (`drill_seeds` of the questions they missed in that zone).
- Then a 3-question timed retest drawn from the same trap family
  (different questions, same `filter_broken`/`mold`).
- On pass: the repair moment — zone chip transitions trap-vermilion →
  brass with the stamp animation, line: **"Repaired — for now. We retest
  it again in 4 days to make sure it holds."** (Schedules the spaced
  retest; honest about what "repaired" means.)
- On miss: no shame state. "Still live. Here's the move again:
  {silver_key_move}" + 2 more drills + immediate re-offer.

## 3. Diagnostic → account linkage

Anonymous diagnostic sessions already exist. At checkout, store the
diagnostic session id in Stripe session metadata; on webhook fulfillment,
attach it to the new entitlement/account. Edge cases:
- Buyer with NO diagnostic on record → `/welcome` routes to the 18-question
  diagnostic first, framed as setup: "First, we map you. 12 minutes."
- Multiple sessions → most recent complete session wins.
- Linkage failure → buyer lands on dashboard with a "take your diagnostic"
  primary action; never a broken welcome page.

## 4. Welcome email (one, transactional)

Send on fulfillment via existing Resend wiring. Build it dark behind a flag,
dark-send first to `codex@barmatrix.app`, and do not send to customers without
explicit approval. `codex@barmatrix.app` is the BarMatrix test/catchall
mailbox; settings are in `C:\Users\JesusLovesMe\.env` and the password key is
`CODEX_EMAIL_PASSWORD`.

Subject: `Your Red-Zone map is ready`
Body (plain, short): you're in the July cohort · your top red zone is
{ZONE NAME} · one link: "Start the first repair (about 20 min)" ·
support address · payment-plan buyers: one line confirming the $499
date, matter-of-fact. No upsells, no streak mechanics, no scripture in
this transactional email.

## 5. Day 2–7 rhythm

Dashboard "next action" engine, strict priority order: (1) overdue spaced
retest → (2) drills on hottest live zone → (3) new timed mixed set →
(4) next zone. Exactly ONE primary action rendered at all times.
Notifications (if any are on) invite, never guilt — no "you're falling
behind," no streak-loss framing (Sanctuary Covenant).

## 6. Payment-plan handling (decide-now policy, founder confirms)

Recommended policy: full access from $500; if the 30-day $499 charge
fails, Stripe smart retries for 7 days with one plain dunning email at
failure and one at day 5; access pauses (not revoked) after retries
exhaust; restores instantly on payment. No penalty language. Implement
to this policy unless founder overrides.

## 7. Events (extends doc 04; same rules — server-trustworthy, no PII)

`first_login`, `first_drill_complete`, `first_retest_complete`
(props: zone, passed), `zone_repaired` (zone, attempt_n),
`plan_payment_failed` / `plan_payment_recovered` (server-side).
North-star: % of buyers with `zone_repaired` within 24h. Target ≥ 70%.

## 8. Acceptance

- [ ] Test purchase lands on /welcome with the correct personal map
- [ ] No-diagnostic buyer path verified
- [ ] First loop completable in ≤ 25 min on mobile
- [ ] Repair stamp + 4-day retest scheduling verified
- [ ] Dunning flow verified with Stripe test clocks (script exists in BMO:
      stripe_payment_plan_test_clock.py — reference only, do not edit BMO)
- [ ] Drift scan passes on all new copy
