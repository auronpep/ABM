# 05 — CHECKOUT BRIDGE

The payment plumbing is live and untouchable (doc 00 gate 3). The work here
is the persuasion surface between the Red-Zone verdict and the existing
Stripe Checkout.

## Bridge section (renders directly below the verdict + repair path)

Eyebrow (mono): `YOUR REPAIR PATH IS BUILT`

Headline: **Every red zone above has a repair path waiting.**

Body:
> The diagnostic found the patterns. The flagship repairs them: your full
> Red-Zone map across all seven subjects, wrong-answer forensics on every
> miss, targeted drills assigned per trap, timed retests until repaired
> patterns hold, and boot camps for the trap families that keep returning.

What's-inside list (keep to six, mono labels):
RED-ZONE MAP · WRONG ANSWER FORENSICS · TARGETED DRILLS · TIMED RETESTS ·
BOOT CAMPS · PATTERN MASTERY BOARD

Price block:
> **BarMatrix Flagship — $999**
> or $500 today + $499 in 30 days
> Limited July-cycle cohort seats available.

Both payment options as equal-weight buttons:
[Enroll — $999] [Start with $500]
(Each routes to the corresponding existing Stripe Checkout flow; fire
`checkout_start` with `plan` property.)

## Trust block (below price; no testimonials exist yet — do not fabricate)

- Founder line: "Built by a California attorney. Every question
  attorney-reviewed before it reaches you."
- Proof line: "You've already seen the method work — it just read your
  answers back to you."
- Terms line: link to refund/dispute policy (existing
  REFUND_AND_DISPUTE_FLOW terms page) + privacy + ToS.
- The free-first restatement: "The diagnostic was free because the proof
  should come before the price."

## Forbidden on this surface

Countdown timers; seat counters; "X people viewing"; any blocked term from
doc 00; any outcome statistic; any testimonial or star rating until real
ones exist with written consent; any scripture deployed as a sales lever
on the price block (faith identity lives in the questions and the
community pages, not stapled to the buy button).

## Abandoner path (cheap, ships with launch)

If `checkout_start` fires without `purchase` within 30 minutes AND the
user provided email at the results page: one transactional email — their
Red-Zone summary + a single link back to the bridge. No discount, no
urgency, no sequence. Uses the existing gated Resend wiring ONLY if the
founder approves activating it; otherwise skip for launch and note it.
