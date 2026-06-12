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
- [ ] Phase 2: Serve built site and walk SPA routes.
  - [ ] Home
  - [ ] HowItWorks
  - [ ] Pricing
  - [ ] Diagnostic
  - [ ] Drill
  - [ ] Repair
  - [ ] Welcome
  - [ ] Auth
  - [ ] PrayerChain
  - [ ] Diagnostic -> Drill -> Repair wrong-answer path
  - [ ] Refresh mid-flow
  - [ ] Back button
  - [ ] Empty / initial states
- [ ] Phase 3: Audit every `dist/*.html` static page.
  - [ ] Styles apply.
  - [ ] Internal links / anchors resolve.
  - [ ] No 404 assets.
  - [ ] CTAs point to valid destinations.
  - [ ] Desktop and 390px layouts are not visibly broken.
  - [ ] `404.html` behavior verified.
  - [ ] `vercel.json` rewrites coherent.
  - [ ] `qdata/` output well-formed and untruncated.
- [ ] Phase 4: Verify integration wiring.
  - [ ] Clerk mounts without crashing; full auth remains prod-domain-only.
  - [ ] PostHog init and CTA event wiring present without console init errors.
  - [ ] Checkout/payment hrefs are non-placeholder and consistent.
- [ ] Phase 5: Content / consistency sweep.
  - [ ] Remove live attorney-review / attorney-credential claims.
  - [ ] Remove placeholder text.
  - [ ] Remove stale pre-rebrand product names where user-facing.
  - [ ] Ensure refund window is consistently 3-day.
- [ ] Final verification: rerun full `npm run build` and re-walk changed pages.
- [ ] Push branch and open PR to `main`.

## Findings Log

- Phase 1: `node scripts/build_trap_index.mjs` passed; wrote `trap-index.json` with 135 questions.
- Phase 1: `node scripts/build_styles.mjs` passed; wrote generated `public/styles.css`.
- Phase 1: `node scripts/contract_check.mjs` passed; 3 seeds and 18 curated questions clean.
- Phase 1: `node scripts/drift_scan.mjs` passed; drift scan clean.
- Phase 1: literal `tsc --noEmit` is not available on this PowerShell PATH. Project-local `.\node_modules\.bin\tsc.cmd --noEmit` passes, and `npm run build` also reaches `tsc` through npm.
- Phase 1: `npm run build` passed; Vite built `dist/assets/index-CsI5Nlnl.js` and `dist/assets/index-DKkpFlTu.css`.

## Fix Log

Pending.

## Unfixed / Prod-Only Notes

- Bare `tsc` is not on the host PATH. No repo code fix made because npm scripts and project-local `.\node_modules\.bin\tsc.cmd` work correctly.
