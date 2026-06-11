# 01 — FUNNEL SPEC: Five Screens

Routes are suggestions; match existing app router conventions in
`C:\barmatrix-app`.

## Screen 1 — Landing hero: the mini-diagnostic  (`/`)

The hero IS the product. Replace the current hero with the mini-diagnostic
component (reference: `mini-diagnostic.jsx`). Above it, one headline block:

> **Three questions. Three traps built for good people.**
> The MBE's most dangerous wrong answers don't exploit what you don't know.
> They exploit what's best in you — your sense of justice, your nose for the
> incriminating, your instinct for fairness.
> [Start — no account needed]

No email gate. No signup. Below the fold (keep light): one-paragraph method
explainer, founder bio block (California attorney; Wheaton roots), pricing
mention with payment plan, FAQ links. Hero demo card for single questions
(`manna-cafe-demo-card.jsx`) may be used on subject landing pages later —
NOT required for launch.

## Screen 2 — Mini-diagnostic flow (within hero)

Per-question interaction (timings; honor prefers-reduced-motion = instant):
1. Tap choice → others dim to 38% opacity, picked outlined ink. 700ms beat.
2. Reveal: trap nameplate stamps (scale 1.22→1.0, ~500ms) — gold/brass frame
   if correct ("SURVIVED"), trap-vermilion if not. If they picked the
   dominant trap, label reads `THE TRAP — {pct}% FALL HERE`.
3. One forensic paragraph keyed to THEIR choice (copy in doc 03 data).
4. Button: "Question N →" / final: "See your verdict →".

Results synthesis (after Q3): staged at ~1.2s / 2.3s / 3.5s —
per-question chips (SURVIVED brass / TRAP: {INSTINCT} vermilion) →
**CONSCIENCE TRAPS** pattern stamp → verdict paragraph (template in doc 03
§3) → CTA.

CTA branches:
- ≥1 miss: "Map every trap you fall for — free 12-minute diagnostic"
- 0 misses: same CTA; verdict copy uses the survivor variant.
Subtext: "18 questions. Your full Red-Zone map. See everything before you
pay a dollar."

CTA routes to the EXISTING 18-question diagnostic, carrying UTM + a
`mini_result` param (score + missed instinct tags) for the results page.

## Screen 3 — Full diagnostic (existing, minimal changes)

Reuse the live curated 18-question anonymous-safe diagnostic. Required
changes only: fire `full_diag_start` and `diag_complete` events (doc 04);
visual pass to match tokens (doc 02) ONLY if cheap — do not rebuild flow.

## Screen 4 — Results: the Red-Zone verdict

Replace/augment the existing results page with the synthesis treatment
(reference: `red-zone-reveal.jsx`):
1. Header: "Your wrong answers are a map." + miss cards (qid, title,
   their pick, trap chip).
2. "Run forensic analysis" auto-runs on load after 800ms (user can replay).
3. Shared-architecture chips stamp onto grouped misses (`NOT-RESPONSIVE ·
   WRONG ELEMENT` etc., from data fields — doc 03 §3 synthesis logic).
4. Red-Zone nameplate (e.g., THE TRUE-BUT-WRONG PICK) + verdict paragraph.
5. Repair path block: Silver-Key "moves" + sample assigned drills + the
   retest promise.
6. Close: "That was {N} red zone(s), found in {M} questions. The full repair
   path covers every one." → checkout CTA (doc 05 copy).

Email capture: AFTER the verdict renders, inline optional field — "Email me
my Red-Zone map." Never gate the verdict itself.

## Screen 5 — Checkout bridge + checkout (existing Stripe)

See doc 05. Reuse live Stripe Checkout; the new work is the bridge section
on the results page and the trust block, not payment plumbing.

## Global rules

- Every screen mobile-first; the funnel must be fully completable on a phone.
- No countdown timers anywhere. No exit-intent popups.
- Copy register: pastoral AND precise; second person; no hedging; no
  exclamation points. All strings pass the doc 00 blocked-terms scan.
