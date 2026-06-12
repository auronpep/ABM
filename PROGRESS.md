# PROGRESS — sale-one funnel build (2026-06-10, night session)

## 2026-06-11 — Program session: architecture decision (handoff §5.2)

**Question:** client-local program v1 vs API-connected program v1.
**Evidence gathered this session:**
- `public/login.html` is a static MOCK — the form redirects to `app.html`
  with no credential check; there is no auth on this site at all.
- `api.barmatrix.app` is Clerk-authed end to end:
  `/api/me/day-plan` mounts `clerkMiddleware()` (`C:\barmatrix-api\src\routes\me-day-plan.ts`),
  entitlement checks run through `clerk-entitlement.ts` (`[clerkMiddleware(), enrollmentCheck]`),
  and the Stripe-ownership path 401s unauthenticated callers (`src/index.ts:628–665`).
- Therefore API-connected program v1 requires introducing Clerk into the
  Vite shell + founder-coordinated entitlement linkage — and `C:\barmatrix-api`
  is founder-owned (read-only; changes surface as diffs, never commits).

**Decision: client-local program v1.** The first repair loop (P1 §2) is
buildable entirely from the qdata bank + `bm_redzone_map` in localStorage —
the handoff itself calls this "pure win either way" (§5.3). Spaced-retest
scheduling is a localStorage date. Diagnostic→account linkage and the
server-side day-plan reconnect are deferred to an explicitly scoped
auth/Clerk session with founder involvement (queued in APPROVALS_NEEDED.md).
Retest pass bar: 2 of 3 within the timer (repair is claimed "for now" and
re-verified at day 4 — honest framing makes the softer bar safe).

## 2026-06-11 — Built + verified: the first repair loop (P1 §2)

### What was built
- **Trap index** (`scripts/build_trap_index.mjs` → `public/qdata/trap-index.json`,
  wired first into `npm run build`): per-question wrong-choice molds, so the
  loop can scope the bank by (filter_broken, mold) without fetching 81 files.
- **Engine** (`src/program/repair.ts`): derives the #1 zone from
  `bm_redzone_map` (largest zone, else most-recurrent (filter, mold) family
  among singletons), selects 4–6 drills (2 per zone member, clamped — same
  formula as /welcome's promise) + a 3-question timed retest, excluding the 18
  diagnostic questions and everything previously assigned (a `usedIds` ledger
  added after browser testing caught the day-4 retest re-serving the original
  retest trio; pre-ledger localStorage payloads are backfilled on read).
  Thin mold families fall back to same-filter, then any-unseen. State in
  `localStorage.bm_program_v1`. Pass = 2/3 in 6:00; pass schedules the
  4-day spaced retest (`retestAt`); miss appends 2 drills + a fresh retest.
- **DrillPlayer extraction** (`src/components/DrillPlayer.tsx`): the full
  TEAR forensics player pulled out of `pages/Drill.tsx` (which now wraps it)
  so the library and the program render the identical experience.
- **`#/repair`** (`src/pages/Repair.tsx`, chromeless route): sequenced drills
  ("DRILL n OF N" + zone chip) → timed retest (countdown, no forensics
  between questions, auto-grades at 0:00) → pass: vermilion→brass stamp,
  "Repaired — for now. We retest it again in 4 days to make sure it holds."
  → miss: "Still live. Here's the move again: {silver_key_move}" + 2 drills,
  no shame copy (Sanctuary: no streaks/guilt anywhere). No-diagnostic
  fallback: "First, we map you." → diagnostic.
- **/welcome** now routes its single CTA by state: overdue day-4 retest →
  continue-repair → start-first-repair → timed mixed set (clean map). The
  no-map fallback is unchanged.
- **Events**: `first_drill_complete`, `first_retest_complete` (zone, passed),
  `zone_repaired` (zone, attempt_n) added to the typed union and fired from
  the loop.

### Verified in browser (dev server, desktop + 375px)
Simulated purchase return (`/?purchase=success#/welcome`) with a seeded
wrong_element map → welcome nameplate + "6 drills" promise → drill 1 played
with a wrong pick (forensics + sequenced footer) → fast-forward → drill 6
played correct → timed retest run question-by-question at 2/3 → phase
`repaired`, `retestAt` exactly +4 days, `zone_repaired {attempt_n: 1}` fired
→ brass stamp confirmed by computed style (`rgb(143,116,47)` = --bm-brass).
Miss path run at 0/3 → "Still live" + silver-key move + drills 7–8.
Overdue-retest welcome CTA, day-4 fresh-question selection (post-fix),
no-diagnostic fallback, and mobile no-overflow all verified. Build + drift
scan green. Caveats: the preview screenshot tool timed out intermittently —
one mobile drill-view screenshot captured; the repair moment is evidenced by
DOM/style assertions instead. `first_login` double-fires on /welcome in dev
(pre-existing, dev-only React double-effect).

### Not done / next
- NOT deployed — founder review queued (APPROVALS_NEEDED.md §8).
- Diagnostic→account linkage (`diagnostic_id` into checkout metadata) and
  the API-connected day-plan need the Clerk/auth session (decision above).
- Welcome email (P1 §4) still gated on Resend (APPROVALS §7).
- Day 2–7 next-action engine beyond the welcome CTA priority: server-side
  `/api/me/day-plan` already exists — reconnect, don't rebuild.


Handoff packets: Z2 (docs 00–06) + Z3 (P1–P4), reviewed in full.
**2026-06-10 late night: founder approved commit + production deploy, and
explicitly discarded the blocked/forbidden-string build gate** — legal +
copywriting audit the live site directly (no subscribers yet). The drift
scanner remains available as `npm run drift` but no longer blocks the build.
Conflicts with the handoff's assumed stack are logged in CONFLICTS.md.

## Done (built + verified in browser this session)

### The five-screen funnel (docs 00–06)
- **Screen 1–2 — mini-diagnostic hero** (`src/components/MiniDiagnostic.tsx`):
  data-driven from `src/funnel/questions.seed.json` (3 authored transforms of
  Q-14621/14734/14609 with inherited pick rates), doc 01 headline block, lock
  beat (700ms), nameplate stamp (brass SURVIVED / vermilion THE TRAP — {pct}%
  FALL HERE with tested-form qualifier), per-choice forensics, staged
  synthesis (chips → CONSCIENCE TRAPS → instinct verdict → CTA), aria-live,
  keyboard-only operable, prefers-reduced-motion = instant.
- **Screen 3 — full diagnostic** (`src/pages/Diagnostic.tsx`): 18 curated
  questions from the live 81-question bank (`src/content/curated-diagnostic.ts`),
  subjects spread across CivPro/ConLaw/Evidence/Torts/Crim.
- **Screen 4 — Red-Zone verdict** (`src/components/RedZoneReveal.tsx`):
  miss cards → auto-run forensic analysis (800ms, replayable) →
  architecture chips → zone nameplate(s) → doc 03 §3 verdict templates →
  repair path (real silver-key moves from the bank) → close line.
  Zone synthesis groups by (filter_broken, mold); survivor variant works.
- **Screen 5 — checkout bridge** (doc 05 verbatim): six-item list, price
  block, equal-weight [Enroll — $999] / [Start with $500] buttons → existing
  checkout.html with `?plan=` preselect; trust block; no countdowns/scarcity.
- **Events (doc 04):** typed `track()` with UTM first-touch capture +
  passthrough, no-PII guard (throws — verified), device/referrer enrichment.
  Verified firing in order: `mini_diag_start → full_diag_start (with
  mini_score + mini_missed_instincts) → diag_complete (score, red_zones,
  duration_sec) → checkout_start (plan, red_zones)`. `purchase` stays
  server-side and is NOT faked (CONFLICTS §4).
- **Tokens/motion (doc 02):** `src/styles/funnel.css` — full --bm-* palette,
  stamp/rise/bar vocabulary, 2px radius geometry, vermilion/brass semantic
  reservation, reduced-motion kill-switch.

### QA gates
- **Drift scan** (`scripts/drift_scan.mjs`): every doc 00 blocked string +
  doc 03 §4 forbidden stat phrasings; scoped to marketing surfaces (qdata
  question content exempt); wired into `npm run build`; CLEAN. Also removed
  the `discount-row` class from checkout.html (→ `capacity-row`).
- **Contract check** (`scripts/contract_check.mjs`): seed contract validation
  incl. the negative case (missing trap.filter_broken rejected),
  stat-provenance qualifier check, curated-file existence; wired into build;
  CLEAN. Runtime validator at `src/funnel/validate.ts`.
- **Build:** drift + contract + `tsc --noEmit` + `vite build` — GREEN.
- **Browser walkthrough:** full funnel completed end-to-end on the dev
  server, desktop + mobile (375px); regression-checked Drills (81 intact),
  routing, checkout preselect. Key states screenshotted in-session.

### P-packets
- **P1 §1 — `#/welcome`:** "You're in." → cohort line → #1 red-zone stamp →
  one sentence → one button; no-diagnostic fallback routes into the
  diagnostic framed as setup. Map carried via localStorage.
- **P2 Phase 1 — Review Ledger:** `scripts/review_ledger.py` (read-only) →
  `work/review_ledger.csv` (84 rows: 81 corpus + 3 seeds, 0 parse failures)
  + `work/review_ledger_summary.json` (subject × status counts; 16-item gap
  list) + `work/review_decisions.csv` founder workflow. Everything is
  `pending` — nothing ships on inference.
- **P4 — `#/prayer-chain`:** July 28–29 grid (88 × 15-min slots, 7 AM–6 PM
  PT with local-time equivalents), multi-select + cover-the-hour, coverage
  fills toward brass ("Ruth M. and 3 others"), logistics-only promise
  printed, aggregate-only `prayer_chain_signup` event. Signup store is a
  localStorage stub — shared backend + .ics email queued (APPROVALS §6).
- **P3 — not built** (governance + auth/DB gated; CONFLICTS §7).

## In-flight / follow-on
- Real Stripe wiring + server-side `purchase` (APPROVALS §4).
- PostHog key + saved funnel view (APPROVALS §5).
- Prayer-chain shared backend before July 13 (APPROVALS §6).
- Ledger heuristics: a few corpus files flag `contract gaps` from multi-line
  YAML scalars (e.g. folded stems) — the gap list overstates slightly; refine
  parser when P2 Phase 2 starts.
- Lighthouse mobile ≥ 90 not yet measured (run against the Vercel preview,
  not dev server, for a truthful number).

## How to resume
1. `npm install && npm run dev` in C:\ABM (build = drift + contract + tsc +
   vite).
2. Read CONFLICTS.md + APPROVALS_NEEDED.md.
3. Funnel data: `src/funnel/` · curated list: `src/content/curated-diagnostic.ts`
   · events: `src/lib/events.ts`.
4. Ledger refresh: `PYTHONUTF8=1 uv run --no-project python scripts/review_ledger.py`.

---

## 2026-06-11 evening — gate lifted, checkout dead-button fixed, launch-night verification

- **Founder lifted the commit/push/deploy gate** ("behind schedule — commit
  everything right away; launch tonight"). HANDOFF.md hard rule updated.
  Still gated: email sending, Stripe config changes, live-DB writes.
- **Founder-reported bug investigated**: "#/diagnostic enroll →
  checkout.html?plan=full looks like a fake status preview." Verified in a
  real browser: the page IS the real checkout (POSTs to
  api.barmatrix.app/api/checkout/create-session → live Stripe `cs_live_…`).
  Root cause of the fake feel: the Enroll button was **disabled until the
  terms checkbox was ticked, with zero feedback on click**.
- **Fix shipped + deployed + verified live** (36a8f57, dpl_DgcY443…):
  button always clickable; without terms it shows "One step first — check
  the box…" and focuses the checkbox; error clears on check. Re-verified
  both paths on prod: no-terms → prompt; terms → checkout.stripe.com.
- Console sweep: `/`, `#/diagnostic`, `#/welcome`, checkout — zero errors.
- Observations for founder (not changed): Stripe page shows merchant
  "JWM Services"; checkout copy cites "47 trap tags" (stale vs canon — see
  docs/CANON_REFERENCE.md); terms links point at help.html.
