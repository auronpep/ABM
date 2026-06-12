# BarMatrix Site Audit Fixes - 2026-06-12

Branch: `codex/site-audit-fixes`
Baseline tag: `baseline-pre-codex-audit-2026-06-12`
Target repo: `C:\ABM`

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
- [ ] Push branch and open PR to `main`.

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
