# 06 — TASKBOARD (ordered; each task names its acceptance test)

Branch: `feat/sale-one-funnel` in barmatrix-app; parallel branch in
barmatrix-api only if event/webhook changes require it.

## Phase A — Foundations (no UI yet)

- **A-1 Data layer.** Create `questions.seed.json` (3 questions, doc 03
  contract) + TypeScript types + a contract validator.
  ✓ Validator rejects a question missing trap.filter_broken; all 3 seeds pass.
- **A-2 Token layer.** Add doc 02 tokens + fonts (self-hosted) to the app's
  styling system without disturbing existing pages.
  ✓ Visual smoke: existing pages unchanged; token utilities render.
- **A-3 Events util.** Typed `track()` wrapper with UTM passthrough +
  no-PII guard.
  ✓ Unit test: event with an `email` property throws.

## Phase B — Screens

- **B-1 Mini-diagnostic component** (adapt `mini-diagnostic.jsx`; data-driven
  from A-1; reduced-motion + aria-live per doc 02).
  ✓ Plays end-to-end with keyboard only; swapping seed JSON changes content
  with zero code edits.
- **B-2 Landing integration.** Mini-diagnostic as hero per doc 01 Screen 1;
  below-fold blocks; old hero content removed.
  ✓ Lighthouse mobile perf ≥ 90; `mini_diag_start` fires on first tap.
- **B-3 Mini → full handoff.** Score + instinct tags carried; CTA routes
  into existing diagnostic; `full_diag_start` fires with mini props.
  ✓ Funnel view shows linked sessions.
- **B-4 Results synthesis.** Red-Zone reveal on results page per doc 01
  Screen 4 + doc 03 §3 logic; auto-run + replay; optional email capture
  after verdict.
  ✓ Two NOT_RESPONSIVE/wrong_element misses produce THE TRUE-BUT-WRONG PICK;
  zero misses produces survivor variant; verdict never blocked by email field.
- **B-5 Checkout bridge** per doc 05; both plan buttons; `checkout_start`
  with `plan`; server-side `purchase` from existing webhook with UTM
  metadata.
  ✓ Stripe test-mode purchase produces exactly one server-side `purchase`
  event with utm_source intact.

## Phase C — QA gates

- **QA-1 Funnel walkthrough** in test mode on Vercel preview: all 5 events,
  correct order, mobile device pass.
- **QA-2 Drift scan.** Script greps build output + source for every blocked
  string in doc 00 and the forbidden stat phrasings in doc 03 §4.
  ✓ CI step fails on any hit; current build passes.
- **QA-3 Accessibility pass.** Keyboard completion of entire funnel;
  axe-core no critical violations on the 5 screens.
- **QA-4 Stat-provenance unit test** (doc 03 §4) green.

## Phase D — Launch (founder-gated)

- **L-1** Founder reviews preview URL; 5 watched user sessions; fix list
  applied same day.
- **L-2** Founder confirms attorney-review status of the 3 seed questions.
- **L-3** Funnel dashboard saved + shared (doc 04 §5).
- **L-4** Founder approves production promotion. Deploy. Smoke test live:
  one full test-mode transaction end-to-end.
- **L-5** Hand back to founder: traffic plan (founder DM list + paid)
  begins. Implementation engagement ends at a working, instrumented,
  drift-clean funnel — sale #1 itself is founder territory.

## Standing reminders

Read doc 00 safety gates before every phase. PowerShell 7 only. C:\BMO is
read-only. When any instruction here conflicts with live repo reality,
stop and surface the conflict to the founder rather than improvising.
