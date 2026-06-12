# BarMatrix Site Audit Fixes - 2026-06-12

Branch: `codex/site-audit-fixes`
Baseline tag: `baseline-pre-codex-audit-2026-06-12`
Target repo: `C:\ABM`

## 2026-06-12 Login / Checkout Debug

Root-cause hypothesis:
- Auth currently forces every sign-in/sign-up result to `/#/welcome`, so a tester bouncing from checkout, pricing, practice, or login loses intent.
- Checkout currently returns Stripe success to `/?purchase=success#/welcome`, but `public/checkout.html` defines a success screen without rendering it and the SPA does not surface purchase-success context.
- Static checkout/login links do not consistently preserve plan, source, or next step, making "I signed up and can't find it" plausible when a buyer uses a different email or returns to a form.

Enhancement checklist:
- [x] Add a focused regression script for auth/checkout flow markers.
- [x] Preserve auth return intent from query/hash/local storage.
- [x] Use the preserved auth intent after Clerk sign-in/sign-up instead of hard-coding welcome.
- [x] Make checkout URLs carry selected plan, source, and after-checkout route.
- [x] Route Pricing enrollment through the same checkout URL builder.
- [x] Route diagnostic checkout bridge through the same checkout URL builder.
- [x] Render the checkout success screen on purchase-success returns.
- [x] Change Stripe `success_url` to return to `checkout.html` first so success feedback is visible.
- [x] Preserve cancel return plan/source on checkout cancellation.
- [x] Add a post-purchase sign-up CTA that clearly says to use the checkout email.
- [x] Add purchase-aware guidance to Welcome for signed-out users.
- [x] Fix Nav/Footer account links to use the SPA auth routes consistently.
- [x] Update login page copy/links to preserve dashboard intent.
- [x] Build and smoke-test login, signup, checkout success, cancelled checkout, pricing, diagnostic bridge, and welcome.

Verification log:
- [x] Red regression observed: `node scripts/auth_checkout_flow_test.mjs` fails on missing `src/lib/authFlow.ts`.
- [x] Regression script passes: `auth_checkout_flow_test: 24 checks passed`.
- [x] `npm run build` passes.
- [x] Local browser smoke passes on `http://127.0.0.1:4173`: home, pricing, checkout success, cancelled checkout, login, sign-in, legacy `?purchase=success#/welcome`, pricing -> checkout -> browser back, and checkout-success -> sign-up. Expected local Clerk production-domain console errors still appear on localhost.

## 2026-06-12 Production Deploy

Deploy checklist:
- [x] Verify GitHub remote target and private visibility before any push/write.
- [x] Verify linked Vercel project and production target.
- [x] Rerun checkout/auth regression script.
- [x] Rerun production build.
- [x] Deploy to Vercel production.
- [x] Inspect the deployment and verify live routes.

Deploy log:
- [x] GitHub remote verified private: `auronpep/ABM`, `visibility=PRIVATE`.
- [x] Vercel link verified: project `barmatrix-app`, project id `prj_LwBgARXTft6aeyoRwhIqEDWh5p4P`, org id `team_HKHemC6mfIOm0t6aROxfEOug`.
- [x] `node scripts/auth_checkout_flow_test.mjs` passed.
- [x] `node scripts/dashboard_enhancement_check.mjs` passed.
- [x] `npm run build` passed.
- [x] Production deployment ready: `dpl_GwCor2A1sju4XAS33op9BMBpfSS8`, deployment URL `https://barmatrix-d51crkesx-sunnylee.vercel.app`, aliased to `https://barmatrix.app` and `https://www.barmatrix.app`.
- [x] `vercel inspect barmatrix-d51crkesx-sunnylee.vercel.app` reports target `production`, status `Ready`.
- [x] Live HTTP checks returned 200 for `/`, `checkout.html`, `lp-tear-method.html`, legacy `lp-c3-cut-clash-call.html`, and `404.html`.
- [x] Live browser smoke verified `#/welcome`, `#/dashboard`, `#/practice`, checkout success, and 390px `#/welcome` without console errors, raw fetch errors, or horizontal overflow.

## 2026-06-12 Dashboard Enhancement Implementation

Enhancement checklist:
- [x] Add `#/dashboard` as the canonical enrolled dashboard route while keeping `#/welcome` for post-purchase/onboarding.
- [x] Add stable dashboard copy/status labels in `src/content/dashboard.ts`.
- [x] Add a compact Today card with assignment, reason, estimate, unlock, and one primary CTA.
- [x] Group the Red-Zone map into Active, Retest ready, Holding, and Queued sections with mobile-safe row layout.
- [x] Add read-only local progress and quiet insight mirrors.
- [x] Move optional Practice Library access behind the dashboard as a secondary action.
- [x] Make Practice Library signed-out/API-unavailable states graceful instead of showing raw fetch errors.

Verification log:
- [x] Red regression observed: `node scripts/dashboard_enhancement_check.mjs` failed on missing dashboard route type.
- [x] Regression script passes: `dashboard_enhancement_check: all checks passed`.
- [x] `npm run build` passes.
- [x] Browser smoke passes on local preview: `#/welcome` shows Today card + mirrors, `#/dashboard` shows the account gate, `#/practice` shows a graceful fallback without raw fetch text/code inputs, and 390px returning-user welcome has no horizontal overflow.
## Phase Checklist

- [x] Phase 1: Run build pipeline steps individually and capture output.
  - [x] `node scripts/build_trap_index.mjs`
  - [x] `node scripts/build_styles.mjs`
  - [x] `node scripts/contract_check.mjs`
  - [x] `node scripts/drift_scan.mjs`
  - [x] `tsc --noEmit`
  - [x] `npm run build`
- [x] Phase 2: Serve built site and walk SPA routes.
  - [x] Home
  - [x] HowItWorks
  - [x] Pricing
  - [x] Diagnostic
  - [x] Drill
  - [x] Repair
  - [x] Welcome
  - [x] Auth
  - [x] PrayerChain
  - [x] Diagnostic -> Drill -> Repair wrong-answer path
  - [x] Refresh mid-flow
  - [x] Back button
  - [x] Empty / initial states
- [x] Phase 3: Audit every `dist/*.html` static page.
  - [x] Styles apply.
  - [x] Internal links / anchors resolve.
  - [x] No 404 assets.
  - [x] CTAs point to valid destinations.
  - [x] Desktop and 390px layouts are not visibly broken.
  - [x] `404.html` behavior verified.
  - [x] `vercel.json` rewrites coherent.
  - [x] `qdata/` output well-formed and untruncated.
- [x] Phase 4: Verify integration wiring.
  - [x] Clerk mounts without crashing; full auth remains prod-domain-only.
  - [x] PostHog init and CTA event wiring present without console init errors.
  - [x] Checkout/payment hrefs are non-placeholder and consistent.
- [x] Phase 5: Content / consistency sweep.
  - [x] Remove live attorney-review / attorney-credential claims.
  - [x] Remove placeholder text.
  - [x] Remove stale pre-rebrand product names where user-facing.
  - [x] Ensure refund window is consistently 3-day.
- [x] Final verification: rerun full `npm run build` and re-walk changed pages.
- [x] Push branch and open PR to `main`.

## Findings Log

- Phase 1: `node scripts/build_trap_index.mjs` passed; wrote `trap-index.json` with 135 questions.
- Phase 1: `node scripts/build_styles.mjs` passed; wrote generated `public/styles.css`.
- Phase 1: `node scripts/contract_check.mjs` passed; 3 seeds and 18 curated questions clean.
- Phase 1: `node scripts/drift_scan.mjs` passed; drift scan clean.
- Phase 1: literal `tsc --noEmit` is not available on this PowerShell PATH. Project-local `.\node_modules\.bin\tsc.cmd --noEmit` passes, and `npm run build` also reaches `tsc` through npm.
- Phase 1: `npm run build` passed; Vite built `dist/assets/index-CsI5Nlnl.js` and `dist/assets/index-DKkpFlTu.css`.
- Phase 2: SPA routes Home, HowItWorks, Pricing, Diagnostic, Drill, Practice, Repair, Welcome, Auth, and PrayerChain render locally without unexpected console errors.
- Phase 2: Diagnostic completed through the full 18-question verdict path; wrong-answer Drill and Repair miss paths reveal TEAR/counterfeit forensics. Repair state survives refresh and browser back/forward.
- Phase 3: final static scan checked 38 `dist/*.html` files; no missing local links, anchors, stylesheets, or assets. `qdata/` has 137 parseable JSON files.
- Phase 3: `404.html` renders directly. No custom `vercel.json` rewrites are present, so no shadowing rules were found.
- Phase 4: Clerk provider and auth routes mount. Local browser logs only the expected production-key domain lock for localhost.
- Phase 4: Checkout renders `$999` and `$500 + $499`, links terms/privacy/refund, and shows inline validation when terms are unchecked.
- Phase 4: PostHog wiring is present in `src/lib/events.ts`; events buffer locally, push to `dataLayer`, and capture only when a PostHog key exists.
- Phase 5: no attorney-review / attorney-credential claims found in live source or built static output.
- Phase 5: stale `C3` / `Foundations` campaign copy and stale `$450 + $449` help copy were found and fixed.
- Phase 5: `emails.html` had `href="#"` CTA/footer placeholders; fixed to app, checkout, billing/support, or partner destinations.

## Fix Log

- Fixed stale campaign naming by adding current TEAR and Flagship-repair LPs, updating campaign/footer links, and keeping the two legacy LP URLs as styled redirects.
- Fixed the Help billing FAQ to match the current 2-pay plan: `$500 today + $499 approximately 30 days later`.
- Fixed email-gallery placeholder links so CTAs and footer links resolve to real app, checkout, or mailto destinations.

## Unfixed / Prod-Only Notes

- Bare `tsc` is not on the host PATH. No repo code fix made because npm scripts and project-local `.\node_modules\.bin\tsc.cmd` work correctly.
- Full Clerk sign-in/sign-up cannot be exercised locally because the production publishable key is domain-locked to `barmatrix.app`; local verification is limited to mount, route, trigger, and signed-out fallback behavior.
- No live Stripe checkout session was created during audit; checkout was verified through render, pricing/policy links, and pre-submit validation only.

## PR

- Draft PR: https://github.com/auronpep/ABM/pull/1

## 2026-06-12 Core Component Spec Implementation

Source spec: `COMPONENTS.md` / attached `pasted-text.txt`
Plan: `docs/superpowers/plans/2026-06-12-core-components.md`

Checklist:
- [x] Phase 0: Add failing regression harness for the component spec.
- [ ] Phase 1: Structural scaffolding components and `src/lib/subjects.ts`.
- [ ] Phase 2: Shared question/drill components.
- [ ] Phase 3: Tensions and traps components/routes.
- [ ] Phase 4: Dashboard/enrolled components/routes.
- [ ] Phase 5: Account components and API/helper libs.
- [ ] Final verification: regression script, TypeScript/build, and route smoke.

Verification log:
- [x] Red regression observed before implementation: `node scripts/core_components_check.mjs` fails with 72 missing file/route checks.

Review:
- Pending implementation.
