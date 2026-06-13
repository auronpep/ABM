# BarMatrix Site Audit Fixes - 2026-06-12

Branch: `codex/site-audit-fixes`
Baseline tag: `baseline-pre-codex-audit-2026-06-12`
Target repo: `C:\ABM`

## 2026-06-13 Old-System Baseline Pivot

Context:
- The current launch repair has restored major checkout/account/practice paths, but the user flagged that the redesign may be a shallow rebuild rather than a real integration of the old application.
- The old system and `barmatrix-app` lineage may live under `C:\BMO`; treat that as a candidate source of truth before making deeper current-branch repairs.
- Goal is to decide whether the fastest route is now: old app baseline + new marketing copy, instead of continuing to patch the rebuild.

Plan:
- [x] Inventory `C:\BMO` repositories, branches, remotes, tags, package scripts, route surfaces, and deployment artifacts without changing files.
- [x] Inventory the current app/API worktrees and record exact branches, tags, remotes, and deployment checkpoints.
- [x] Compare old-system functionality against the current live launch branch, focusing on checkout, auth, account, dashboard, practice, drills, diagnostic, and mastery.
- [x] Recommend the fastest safe route with a rollback checkpoint and isolated implementation branch/worktree.

Review:
- `C:\BMO` is an ops-center repo, not the clean app checkout. Its key junctions are `C:\BMO\app-repo` -> `C:\barmatrix-app`, `C:\BMO\api-repo` -> `C:\barmatrix-api`, and `C:\BMO\website-repo` -> `C:\barmatrix-site`.
- The clean current production app lane is `C:\barmatrix-app\.worktrees\old-app-marketing-transplant` on `codex/old-app-marketing-transplant`, with live checkpoint tag `live-lead-me-completion-2026-06-13-dpl-BpyBUp`.
- The earlier old-app checkpoint is `origin/codex/restore-old-app-marketing` / tag `checkpoint-current-live-bmo-restore-2026-06-12`; production has since added checkout/account, diagnostic CTA, red-zone routing, dashboard label, and Lead Me completion fixes on top.
- Route inventory confirms current production still has the old paid surface: `/dashboard`, `/dashboard/path`, `/dashboard/mastery`, `/dashboard/final-sprint`, `/practice`, `/drills`, `/mastery`, `/coach`, `/certification`, `/boot-camps`, `/timed-sets`, subject drills, traps, tensions, sign-in, sign-up, account, checkout, and checkout success.
- Live browser smoke on `https://barmatrix.app` confirmed usable pages for `/`, `/dashboard`, `/dashboard/path`, `/practice`, `/drills`, `/mastery`, `/diagnostic`, `/checkout`, and `/checkout/success?plan=full&source=audit&after=dashboard`; all returned one `<main>` and no console errors in that pass.
- Recommendation: do not hard-rollback below `codex/old-app-marketing-transplant` unless a specific old tool is proven missing. That branch is already the old app plus current marketing/checkout repairs. The fastest safe route is to keep it as the launch base and inventory/fix specific missing old-tool behaviors one at a time.

## 2026-06-13 Criminal Law Pattern Analysis

Plan:
- [x] Inspect `C:\Users\JesusLovesMe\Documents\CrimL\Criminal LAw.xlsx` schema and row coverage.
- [x] Quantify answer distribution, percent-correct, and most-popular-wrong-answer patterns.
- [x] Classify bottom-up criminal law/procedure trap families without relying on existing CQ tags.
- [x] Write a BarMatrix-ready analysis report and prompt pack under `C:\ABM\work`.
- [x] Record verification and file paths here.

Review:
- Source workbook `C:\Users\JesusLovesMe\Documents\CrimL\Criminal LAw.xlsx` has 945 question rows, 772 rows with percent-correct data, average percent correct 58.5, median 60.0, 181 questions below 50 percent correct, and 48 below 45 percent correct.
- Generated:
  - `C:\ABM\work\criminal-law-pattern-analysis\criminal_law_pattern_report.md`
  - `C:\ABM\work\criminal-law-pattern-analysis\chatgpt_project_prompt_pack.md`
  - `C:\ABM\work\criminal-law-pattern-analysis\criminal_law_pattern_index.csv`
  - `C:\ABM\work\criminal-law-pattern-analysis\criminal_law_lowest_75_compact.csv`
  - `C:\ABM\work\criminal-law-pattern-analysis\criminal_law_stats.json`
  - `C:\ABM\work\criminal-law-pattern-analysis\criminal_law_enrichment.json`
- Verified generated CSV counts: `criminal_law_pattern_index.csv` has 945 rows and `criminal_law_lowest_75_compact.csv` has 75 rows.
- Main product finding: answer choices often reveal the legal axis, but the reliable move is answer-menu decoding plus stem breaker-fact lookup, not answer-letter guessing.

### Refined pass

Plan:
- [x] Reclassify all below-50-percent Criminal Law items by answer-menu type.
- [x] Reclassify critical items by breaker-fact type.
- [x] Cross-tab answer menus against breaker facts to find product-ready trap modules.
- [x] Generate refined report, critical index, taxonomy JSON, and tag catalog.
- [x] Verify generated row counts.

Review:
- Generated `C:\ABM\work\criminal-law-pattern-analysis\criminal_law_refined_report.md`.
- Generated `C:\ABM\work\criminal-law-pattern-analysis\criminal_law_refined_critical_index.csv` with 181 rows, matching all items below 50 percent correct.
- Generated `C:\ABM\work\criminal-law-pattern-analysis\criminal_law_refined_taxonomy.json`.
- Generated `C:\ABM\work\criminal-law-pattern-analysis\criminal_law_refined_tag_catalog.csv` with 12 product-ready tags.
- Refined finding: 165 of 181 critical items have at least a partial answer-choice axis signal; 92 are `answer_menu_strong`, 73 are `answer_menu_partial`, and only 16 are `stem_first_required`.
- Highest-value product units are menu-plus-breaker pairings, such as property-label menu plus missing element, remedy menu plus probable-cause/exception, and right-source menu plus wrong trigger/attachment.

### Mechanical choices-only pass

Plan:
- [x] Read `C:\CCG\reasoning-creed-prompt.md` and apply its proof-before-proxy framing.
- [x] Retest longest-answer and other answer-choice-only heuristics mechanically.
- [x] Train/test choices-only combination rules without using stems.
- [x] Write a refined mechanical choices-only report and update result files.
- [x] Verify output counts and record the best honest scoring route here.

Correction:
- User corrected the drift: the target is not doctrine-family analysis, it is mechanically identifying the answer that is TRUE and RESPONSIVE, then applying TEAR-style elimination.
- Updated `C:\ABM\tasks\lessons.md` with this rule.

Review:
- Generated `C:\ABM\work\criminal-law-pattern-analysis\true_responsive_mechanical_report.md`.
- Generated `C:\ABM\work\criminal-law-pattern-analysis\true_responsive_choices_only.py`.
- Generated `C:\ABM\work\criminal-law-pattern-analysis\true_responsive_choices_only_results.json`.
- Generated `C:\ABM\work\criminal-law-pattern-analysis\true_responsive_choices_only_scoreboard.csv`.
- Generated `C:\ABM\work\criminal-law-pattern-analysis\true_responsive_choices_only_buckets.csv`.
- Best teachable answer-choice-only rule: pick the longest answer unless D is the unique longest or there is a length tie; then pick C.
- Score: 58.3% over all 945 questions, 66.2% over 772 graded questions, and 65.2% over 181 below-50-percent critical questions.
- TRUE/RESPONSIVE grid search learned: reward length, penalize absolutes/overclaims, penalize bare-result answers. Because/reason words did not add stable signal after length.

## 2026-06-13 Outline Code Lookup Table

Plan:
- [x] Inspect the attached BarMatrix 8-digit outline-code reference.
- [x] Generate a spreadsheet-friendly lookup table keyed by outline code.
- [x] Verify row count and sample deepest-label mappings.
- [x] Record generated file paths and review notes here.

Review:
- Generated `C:\ABM\work\outline-code-lookup\outline_code_lookup.xlsx` with two sheets: `Lookup` for the full 15-column reference and `DeepestOnly` for quick code-to-deepest-label lookup.
- Generated CSV exports:
  - `C:\ABM\work\outline-code-lookup\outline_code_lookup.csv`
  - `C:\ABM\work\outline-code-lookup\outline_code_deepest_identifier_lookup.csv`
- Verified 593 valid outline-code rows and 36 AB subtopics.
- Sample mappings verified:
  - `31010101` -> `Roles of judge and jury`
  - `33040400` -> `Confrontation Clause`
  - `71040100` -> `Solicitation`
  - `75070000` -> `Fourth Amendment`

## 2026-06-12 Rich Item Database Migration

Scope: move the CQ-derived drill/diagnostic/repair content model from static `public/qdata/*.json` toward DB-backed API item projections while preserving almost all useful CQ file structure for repair pages.

Plan:
- [x] Confirm current frontend consumers: Drill/Diagnostic/Repair use `/qdata`; Practice uses API DB.
- [x] Confirm existing API normalized tables already cover `questions`, `answer_choices`, `question_tags`, attempts, and forensics.
- [x] Add a rich render-document DB layer for CQ-derived item projections.
- [x] Generate `item_render_documents` upserts alongside existing CQ question SQL.
- [x] Add API helpers/routes for qdata-compatible item lookup and trap index from DB.
- [x] Add tests proving the API can return public-safe and repair-rich projections without exposing answer keys pre-submit.
- [x] Verify API typecheck/tests and regenerate CQ SQL.
- [x] Document frontend migration path from `/qdata` to API item endpoints.

Design:
- Do not create a second production database. Use the existing `barmatrix-api` MySQL database as the single content source.
- Keep normalized tables for selection, analytics, no-repeat, attempts, and red-zone queries.
- Add one rich JSON render table keyed to `questions.question_id` so the full CQ-derived repair/drill page package survives ingestion.
- Frontend migration should be one surface at a time: first API qdata-compatible reads, then DB-backed repair selection/state, then diagnostic session persistence.

Review:
- Added `item_render_documents` SQL generation in `C:\barmatrix-api\src\scripts\generate-cq-batch.ts`, including raw CQ markdown, source SHA-256, public payload, repair payload, and full payload.
- Added DB-backed item projection helpers/routes: `/api/items/library`, `/api/items/trap-index`, `/api/items/:id/public`, and enrolled-only `/api/items/:id/repair`.
- Regenerated `C:\barmatrix-api\tasks\cq-batch-2026-06-12\cq-batch.sql`: 223 PASS / 0 QUARANTINE; SQL now includes `CREATE TABLE IF NOT EXISTS item_render_documents` and `INSERT INTO item_render_documents`.
- Documented the frontend migration path in `C:\ABM\docs\CQ_DB_FRONTEND_MIGRATION.md`.
- Verification passed: `node --import tsx --test src/lib/item-render.test.ts src/routes/items.test.ts`, `node --import tsx --test src/scripts/generate-cq-batch.test.ts`, `npm run typecheck`, `git diff --check` in `C:\barmatrix-api`, and `git diff --check` in `C:\ABM` (line-ending warnings only).
- Not loaded into the live database in this slice: DB env/client access was still not configured locally. Frontend `/qdata` consumers are not switched yet.

## 2026-06-12 Diagnostic Verdict Answer Visibility

Plan:
- [x] Trace the diagnostic verdict data flow from answer selection to results rendering.
- [x] Add a focused failing regression proving the verdict must show score count and correct answers.
- [x] Update the diagnostic results UI with minimal, source-backed score and answer-key display.
- [x] Verify with the focused regression, production build, and browser smoke on the diagnostic verdict.
- [x] Record final review, exact commands, and any limitations here.

Review:
- Root cause: the diagnostic `qdata` payloads already had `key` and choice text, but `finish()` reduced each miss to only `picked`, trap, and repair metadata before passing it to `RedZoneReveal`.
- Added `scripts/diagnostic_verdict_check.mjs`; red state observed before implementation on missing `MissRecord.correct`.
- `MissRecord` now carries `correct` and `correctText`, and `Diagnostic.finish()` fills those fields from the loaded qdata item.
- `RedZoneReveal` now renders a score row (`Score: N of 18 correct`) and each miss card shows `Correct answer: <letter> - <answer text>` under `Your pick`.
- Verification passed:
  - `node scripts/diagnostic_verdict_check.mjs`
  - `.\node_modules\.bin\tsc.cmd --noEmit`
  - `npm run build`
  - Browser smoke on `http://127.0.0.1:4176/#/diagnostic`: answered B through all 18 questions, verdict rendered `Score: 2 of 18 correct`, 16 miss cards, and first miss included `Correct answer: A` with answer text.
- Local browser console note: Clerk production-key domain errors still appear on `127.0.0.1`; this is the same local-only auth-domain limitation recorded in prior audits and did not block the diagnostic verdict flow.

## 2026-06-12 CQ Finished Question Integration

Scope: integrate the current `C:\CCG\Finished` CQ markdown set into the BarMatrix API question bank artifacts, drill packs, item SQL, and ABM tracking docs without disturbing unrelated in-progress API changes.

Plan:
- [x] Read ABM ingestion docs and prior Batch 1 runbook.
- [x] Compare current `C:\CCG\Finished` file count against existing API QA artifacts.
- [x] Regenerate CQ QA, SQL, and subject packs with the existing API generator.
- [x] Verify pass/quarantine counts, subject totals, SQL output, and generated pack files.
- [x] Rebuild ABM static `public/qdata` payloads and trap index for the local drill bank.
- [x] Run API typecheck/build-level verification that does not require live DB writes.
- [x] Update ABM ingestion/runbook docs with the current generated counts and caveats.
- [x] Record final review, exact commands, and any DB/live-load blockers here.

Current truth before regeneration:
- `C:\CCG\Finished` contains 223 `CQ*.md` files.
- Existing `C:\barmatrix-api\tasks\cq-batch-2026-06-12\qa-report.json` contains 180 passed files and 0 quarantined files.
- Expected delta for this run is 43 additional CQ files, subject to the generator's QA gate.
- API worktree is already dirty and ahead/behind `origin/main`; integration must not revert or overwrite unrelated source edits.

Review:
- API CQ generator now passes all 223 current `C:\CCG\Finished` files with 0 quarantined.
- Generated API artifacts:
  - `C:\barmatrix-api\tasks\cq-batch-2026-06-12\qa-report.{json,md}`
  - `C:\barmatrix-api\tasks\cq-batch-2026-06-12\cq-batch.sql` (2,185,874 bytes)
  - `C:\barmatrix-api\tasks\cq-batch-2026-06-12\packs\` (35 files)
- API subject totals: CIVIL_PROCEDURE 31, CONSTITUTIONAL_LAW 19, CONTRACTS 54, CRIMINAL_LAW 36, EVIDENCE 21, REAL_PROPERTY 21, TORTS 41.
- API pack totals from manifests: 68 pool drills, 717 microdrills, 222 anchor cards, 483 keys.
- ABM static qdata builder now parses all 223 current CCG files into `public/qdata`; 17 tracked curated diagnostic payloads remain outside `C:\CCG\Finished`, so `trap-index.json` covers 240 payloads while `index.json` lists 223 library entries.
- Verification passed:
  - `node --import tsx --test src/scripts/generate-cq-batch.test.ts` in `C:\barmatrix-api`
  - `npx tsx src/scripts/generate-cq-batch.ts all` in `C:\barmatrix-api`
  - `npm run typecheck` in `C:\barmatrix-api`
  - `uv run --with pyyaml --no-project python scripts/build_qdata.py` in `C:\ABM`
  - `node scripts/build_trap_index.mjs` in `C:\ABM`
  - qdata shape check: 240 `CQ*.json`, 223 `index.json` entries, no malformed payloads
  - `npm run contract` in `C:\ABM`
  - `npm run build` in `C:\ABM`
- DB/live-load blocker: live/API database rows were not loaded in this shell because `DATABASE_HOST`, `DATABASE_NAME`, and `DATABASE_USER` were not configured, and no `mysql`/`mariadb` CLI was available on PATH. Apply the generated `cq-batch.sql` through the configured DB channel before claiming live API bank parity.

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
- [x] Phase 1: Structural scaffolding components and `src/lib/subjects.ts`.
- [x] Phase 2: Shared question/drill components.
- [x] Phase 3: Tensions and traps components/routes.
- [x] Phase 4: Dashboard/enrolled components/routes.
- [x] Phase 5: Account components and API/helper libs.
- [x] Final verification: regression script, TypeScript/build, and route smoke.

Verification log:
- [x] Red regression observed before implementation: `node scripts/core_components_check.mjs` fails with 72 missing file/route checks.
- [x] Red regression observed for guard fallback: `node scripts/core_components_check.mjs` fails on missing `AUTH_GUARD_TIMEOUT_MS`.
- [x] Component regression passes: `node scripts/core_components_check.mjs`.
- [x] TypeScript passes: `.\node_modules\.bin\tsc.cmd --noEmit`.
- [x] Production build passes: `npm run build` (`build_trap_index`, `build_styles`, `contract_check`, `tsc --noEmit`, `vite build`).
- [x] Browser smoke on fresh preview `http://127.0.0.1:4174`: `#/tensions`, `#/traps`, `#/tensions/example-slug`, `#/traps/example-slug`, `#/practice`, `#/welcome`, `#/program`, `#/red-zones`, `#/mastery`, `#/coach`, and `#/account` render without error-boundary crashes or unexpected console errors. Guarded enrolled routes show the sign-in prompt after the Clerk timeout fallback.

Review:
- Component spec phases are present as additive modules and route shells. Existing launch flows remain intact; API-backed new public/enrolled pages degrade to empty/error states when live API data or auth is unavailable locally.
- Independent review sidecar was requested and closed after no result within the wait window; no reviewer findings were received.

## 2026-06-12 Stripe Product / Price / Webhook Configuration

Plan:
- [x] Confirm current checkout contract, plan IDs, success/cancel URLs, and webhook fulfillment expectations.
- [x] Confirm available Stripe/Vercel credentials without printing secrets.
- [x] Reconcile or create the live Stripe product and prices for pay-in-full and 2-pay checkout.
- [x] Reconcile or create the live Stripe webhook endpoint for the production API.
- [x] Update deployment secrets only if the API/app requires new IDs or signing secret.
- [x] Verify checkout session creation and webhook delivery/readiness without making an unintended paid charge.

Review:
- Stripe live account `acct_1C0EszCslAPoLKSJ` contains active product `prod_UaWB90BFtm3OaK` named `BarMatrix`.
- Live product/price contract matches production Hostinger `~/secrets/barmatrix-api.env`:
  - `STRIPE_PRODUCT_BARMATRIX_FLAGSHIP=prod_UaWB90BFtm3OaK`
  - `STRIPE_PRICE_PAY_IN_FULL=price_1TbL9bCslAPoLKSJ4xEZHol2` ($999 one-time)
  - `STRIPE_PRICE_FLAGSHIP_ANCHOR=price_1TdEOUCslAPoLKSJKezih9TK` ($0 monthly anchor)
  - `STRIPE_PRICE_PAY_IN_TWO=price_1TdEOTCslAPoLKSJnQSdUqFT` ($500 one-time first payment)
  - `STRIPE_PRICE_PAY_IN_TWO_SECOND=price_1TdEOUCslAPoLKSJbiAzqvNe` ($499 one-time second payment)
- Live webhook endpoint `we_1TdENrCslAPoLKSJxlti7W1y` is enabled at `https://api.barmatrix.app/api/webhooks/stripe` for `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, and `invoice.upcoming`.
- Hostinger API env has live `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` present; secret values were not printed.
- `https://api.barmatrix.app/health` returned `{"ok":true,"db":"up"}`.
- Live Stripe event history shows prior `checkout.session.completed` events with `pending_webhooks: 0`.
- Verification created one live pay-in-full checkout session and one live two-pay checkout session, confirmed expected amounts/price IDs, and expired both sessions before ending:
  - pay-in-full session: $999, `price_1TbL9bCslAPoLKSJ4xEZHol2`, expired.
  - two-pay first session: $500, `price_1TdEOTCslAPoLKSJnQSdUqFT`, expired.
- No product, price, webhook, or production env changes were required because Stripe and Hostinger were already correctly configured.

## 2026-06-12 Legacy LP Funnel Attribution Triage

Source note: attachment `6468156d-8013-43a6-a9a7-48c5ddc123ee/pasted-text.txt`

Plan:
- [x] Verify the attachment against current `public/` and SPA checkout/event files.
- [x] Identify the next highest-leverage action before driving traffic.
- [ ] Implement a focused attribution pass before LP family tests or paid traffic.
- [ ] Verify attribution locally and in production after implementation.

Findings:
- Current `public/` has 28 `lp-*.html` pages, not 26. The added/current LPs include `lp-tear-method.html` and `lp-flagship-repair-course.html`.
- Static LP pages already append `lp=<slug>` to checkout links and preserve `utm_*`, `gclid`, `fbclid`, `ttclid`, and `rdt_cid` on outbound links.
- `public/checkout.html` reads `plan`, `source`, `after`, `purchase`, and `cancelled`, but does not read or preserve `lp`.
- `public/checkout.html` sends Stripe `success_url` and `cancel_url` with `plan/source/after`, but drops the inbound `lp` value.
- SPA PostHog/event capture lives in `src/lib/events.ts`; static LP pages and static checkout do not currently emit a static-page visit or checkout-start event.

## 2026-06-12 Email Deliverability / Hostinger DNS Investigation

Plan:
- [x] Identify every sender/provider involved after purchase: Clerk auth emails, app transactional emails, Stripe receipts, and any React Email/Resend paths.
- [x] Verify configured sending domains and from-addresses from code, docs, and provider-facing config surfaces available locally.
- [x] Query current public DNS for `barmatrix.app` and likely mail subdomains.
- [x] Compare current DNS against current Clerk/Resend/Stripe/Google/Yahoo deliverability requirements.
- [x] Produce exact Hostinger DNS records/actions needed, separating confirmed missing records from provider-dashboard records that must be copied manually.

Findings:
- Started from current ABM repo state on branch `codex/launch-checkout-restore`; worktree already contains unrelated launch/content/qdata edits.
- Deliverability report written: `docs/EMAIL_DELIVERABILITY_HOSTINGER_DNS_2026-06-12.md`.
- ABM frontend has no React Email/Resend sender dependency; post-purchase transactional sends live in `C:\barmatrix-api\src\email.ts` through Resend, triggered from Stripe webhooks in `C:\barmatrix-api\src\index.ts`.
- Server inventory says Resend is configured in production with `BarMatrix <access@barmatrix.app>` and support/reply-to `support@barmatrix.app`; secret values were not read or printed.
- Current authoritative DNS is Hostinger (`ns1.dns-parking.com`, `ns2.dns-parking.com`).
- Public DNS already has Hostinger MX/root SPF, Resend `send` MX/SPF, Resend DKIM TXT, Clerk frontend API CNAME, and `_dmarc` with `p=none`.
- Primary Hostinger action: verify provider dashboards green, add/confirm real mailboxes/aliases for all From addresses, improve DMARC with a reporting address, and test real Gmail/Outlook/Yahoo headers before escalating DMARC policy.
- Potential DNS concern: `hostingermail-b._domainkey.barmatrix.app` resolves to Hostinger DKIM but currently exposes an empty public key; verify Hostinger Email "Protect your reputation" records are green and refresh DKIM CNAMEs if hPanel expects different values.

## 2026-06-12 Email Deliverability Provider Checks Execution

Plan:
- [x] Delegate independent read-only lanes: DNS/Hostinger, Resend/API, Clerk, Stripe.
- [x] Inventory local CLIs and provider auth surfaces without printing secrets.
- [x] Run Resend CLI read-only checks if possible.
- [x] Run direct DNS checks and mailbox/authentication checks available without dashboards.
- [x] Check API/source for exact sender behavior and test hooks.
- [x] Consolidate provider dashboard blockers and next actions into the DNS report and this tracker.

Findings:
- Delegated read-only sidecar lanes started for DNS/Hostinger, Resend/API, Clerk, and Stripe.
- Local CLI inventory: `resend.ps1`, `npx.ps1`, `gh.exe`, and `vercel.ps1` are on PATH; `stripe` CLI is not on PATH.
- Codex CLI verified: `codex-cli 0.139.0`.
- Resend CLI verified: `resend-cli v2.3.0`; the first available key was sending-only, then `RESEND_FULL_API_KEY` was used successfully for domain status.
- Resend full-key checks confirmed the domain is verified. Public DNS and live received-header tests also pass.
- Production Hostinger API env file has `RESEND_API_KEY`, `BARMATRIX_EMAIL_FROM`, `BARMATRIX_SUPPORT_EMAIL`, `BARMATRIX_REPLY_TO_EMAIL`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `STRIPE_SECRET_KEY` present; values were not printed.
- Resend dark send succeeded from `BarMatrix <access@barmatrix.app>` to `codex@barmatrix.app`; Resend returned email id `b0313113-cb22-44c6-ab14-faa33745e1e9`.
- Hostinger SMTP dark send succeeded from `support@barmatrix.app` to `codex@barmatrix.app`; SMTP refused count was 0.
- IMAP header inspection of `codex@barmatrix.app` succeeded. Resend received headers showed `dkim=pass`, `spf=pass`, and `dmarc=pass`. Hostinger SMTP received headers also showed `dkim=pass`, `spf=pass`, and `dmarc=pass`.
- DNS sidecar confirmed no duplicate SPF or duplicate DMARC. DMARC is bare monitoring only: `v=DMARC1; p=none`.
- DNS sidecar confirmed Hostinger DKIM selector A passes, but selector B resolves to an empty key (`v=DKIM1;p=`); fix/refresh selector B in Hostinger hPanel.
- Clerk Backend API confirmed required CNAMEs for `barmatrix.app`: `clerk`, `accounts`, `clkmail`, `clk._domainkey`, and `clk2._domainkey`.
- Clerk DNS check: `clerk`, `accounts`, and `clkmail` CNAMEs were present; `clk._domainkey` and `clk2._domainkey` were missing publicly in the first pass and are now present after the user's Hostinger update.
- Stripe read-only API check confirmed live account `acct_1C0EszCslAPoLKSJ`, enabled BarMatrix webhook, and recent completed checkout sessions with `pending_webhooks: 0`.
- Stripe account public business info is currently not BarMatrix-clean: support email `josh@joshwood.live`, business URL `https://988Foundation.com`; fix in Stripe Dashboard.
- Stripe code/source check: BarMatrix does not set `payment_intent_data.receipt_email`, `customer_email`, or `invoice_creation`; Stripe customer-email behavior is controlled by Stripe Dashboard while BarMatrix-owned enrollment/billing lifecycle emails use Resend.
- API focused email/webhook tests passed in `C:\barmatrix-api`: `npx --no-install tsx --test src/email.test.ts src/routes/trap-naming-job.test.ts src/stripe-webhook.test.ts` -> 29 tests, 0 failures.
- Consolidated report updated: `docs/EMAIL_DELIVERABILITY_HOSTINGER_DNS_2026-06-12.md`.

## 2026-06-12 Hostinger DNS Follow-Through

Plan:
- [x] Verify the two newly added Clerk DKIM CNAME records are public.
- [x] Re-run Resend CLI domain checks using `RESEND_FULL_API_KEY` without printing the key.
- [x] Discover whether Hostinger DNS can be safely edited from local authenticated tooling/API.
- [x] Fix approved DMARC `rua` record and determine whether Hostinger DKIM B/C can be fixed from the DNS zone.
- [x] Re-query public DNS after changes and update this tracker/report.

Findings:
- User explicitly added the two Clerk CNAME records and explicitly approved fixing Hostinger DKIM and DMARC.
- `clk._domainkey.barmatrix.app` now resolves to `dkim1.pqxm61mygn1q.clerk.services` and onward to Clerk/SendGrid DKIM.
- `clk2._domainkey.barmatrix.app` now resolves to `dkim2.pqxm61mygn1q.clerk.services` and onward to Clerk/SendGrid DKIM.
- `RESEND_FULL_API_KEY` worked with Resend CLI. `resend doctor` reports `barmatrix.app (verified)`, 1 verified domain, 0 pending.
- `resend domains get 181f1d50-a382-4a1c-950d-d8c2e0e41220 --json` confirms `barmatrix.app` status `verified`, sending `enabled`, receiving `disabled`, and all Resend records `verified`.
- User clarified the Hostinger API token is `HOSTINGER_API` in `C:\Users\JesusLovesMe\.env`; it worked against Hostinger's DNS Zone API without printing the token.
- DMARC was updated through Hostinger API. The API first appended a duplicate when called with `overwrite=false`; this was immediately corrected by deleting only `_dmarc` TXT records via the documented `name` + `type` filter and re-adding one record.
- Hostinger API, authoritative nameservers `ns1.dns-parking.com` / `ns2.dns-parking.com`, and Cloudflare resolver `1.1.1.1` now show exactly one DMARC TXT: `v=DMARC1; p=none; rua=mailto:dmarc@barmatrix.app`. Google resolver `8.8.8.8` still showed the old bare value alongside the new value during verification, which appears to be recursive-cache lag after the delete/re-add correction.
- Hostinger DKIM zone records are correct for selectors A, B, and C, but Hostinger-managed target TXT records for B and C are empty (`v=DKIM1;p=`). Selector A has a real key and real Hostinger SMTP mail signs with A and passes DKIM. B/C require Hostinger hPanel/email-side regeneration; editing the `barmatrix.app` DNS zone cannot create the missing Hostinger-managed public keys.
- SSH follow-up confirmed the same: no `hostinger`, `hpanel`, `whmapi1`, `uapi`, `cpanelapi2`, `named`, or `rndc` command is available on the Hostinger shell; no DNS/zone files were found under `/home/u211961595`; common BIND/PowerDNS paths are absent. SSH can observe DNS with `dig`, but cannot edit hPanel DNS.
- The only current `checkout_start` event is fired from `src/components/RedZoneReveal.tsx`, so static LP -> checkout starts are not readable in the funnel.

Recommended next action:
- Add a small attribution contract: preserve `lp` through checkout success/cancel, store it with checkout intent, include it in checkout-start properties, and add a regression script that proves `lp` survives `lp page -> checkout -> Stripe URL -> return`.

Review:
- Do not start LP family rotation, Reddit traffic, paid traffic, webinar revival, or lead-magnet testing until attribution is fixed. Otherwise the tests can produce visits and even sales without a reliable source path.

## 2026-06-12 Plan Inventory Review

Scope: Review repo-local plans, handoffs, taskboards, specs, and launch docs to explain the active plan map and identify pending work.

Checklist:
- [x] Inventory explicit plan-bearing files in `tasks/`, `docs/superpowers/plans/`, `handoffs/`, and root project docs.
- [x] Extract pending and completed status from the current plan docs.
- [x] Summarize plan groups, dependencies, and next pending actions for the user.
- [x] Record review result in this section.

Review:
- Current explicit pending checklist in `tasks/todo.md`: legacy LP attribution pass and local/prod verification.
- Completed implementation groups recorded in this tracker: login/checkout intent, production deploy, dashboard enhancement, full static/site audit fixes, core components, and Stripe product/price/webhook configuration.
- Cross-doc pending clusters: first-buyer readiness gates, API/backend telemetry completion or verification, practice-library DB/API rollout, CQ ingestion follow-through, attorney/founder review ledgers, prayer-chain backend/email, Barnabas Circle governance/backend, and source-attribution cleanup before traffic.
- Documentation caveat: some older handoff checkboxes are stale because later `PROGRESS.md` / `tasks/todo.md` entries show the work shipped; use the latest tracker and source checks before acting on older unchecked boxes.

## 2026-06-12 Codex Takeover Plan — Live Today + Marketing/Social

Scope: Take over from Claude by reviewing repo documentation and producing a two-track plan for (1) getting/keeping the site live today and (2) launching a practical marketing and social media plan.

Checklist:
- [x] Review current docs inventory: root handoffs, readiness docs, product/positioning docs, infra docs, legacy marketing docs, and current task tracker.
- [x] Verify current live surface health at a basic HTTP level.
- [x] Verify the current local tree still builds.
- [x] Separate launch blockers from post-launch build queue.
- [x] Draft the two-track execution plan below.

Current truth from docs + fresh checks:
- `barmatrix.app`, `checkout.html`, `terms.html`, `privacy.html`, and `refund.html` returned HTTP 200 on 2026-06-12.
- `https://api.barmatrix.app/health` returned HTTP 200.
- Tight live/source old-claim sweep for `2,400-question`, `2400-question`, `Wheaton`, and `attorney-reviewed` returned clean; earlier broad `2,400` matches were false positives from Google Font weight URLs.
- `npm run build` passed on the current dirty tree: trap index wrote 194 questions, styles generated, contract check clean, TypeScript passed, Vite built successfully.
- Production deploy and Stripe configuration are already recorded as done in this tracker, but the working tree is dirty and contains substantial generated/question-bank/component changes that must be treated as in-progress until committed/deployed intentionally.
- Highest-leverage traffic blocker: static LP attribution still drops `lp` inside `checkout.html` and does not emit static checkout-start analytics. Do not send broad traffic until that is fixed and verified.

### Item 1 — Site live today

Plan:
- [ ] Freeze scope for today: no new product surfaces, no backend migrations, no Stripe changes, no public-upstream writes.
- [ ] Implement only the focused LP attribution pass already identified: preserve `lp` through checkout success/cancel URLs, store checkout intent with `lp`, emit/queue a static `checkout_start` event, and add a regression script proving `lp` survives LP -> checkout -> Stripe URL -> return.
- [ ] Rerun verification: attribution regression, existing auth/checkout regression, dashboard/core checks if relevant, `npm run build`, and a live-origin browser walk because API CORS only allows `barmatrix.app`.
- [ ] Verify live markers after deploy: `/`, `checkout.html`, policy pages, a representative LP, `/#/diagnostic`, `/#/welcome`, `/#/practice`, checkout terms unchecked/checked behavior, and no old credibility/bank-size claims in live HTML.
- [ ] Deploy with `vercel deploy --prod --archive=tgz` only after confirming private repo/remote visibility and current branch intent.
- [ ] After deploy, record deployment URL/id, live checks, and any remaining founder-only actions in this tracker.

Today ship/no-ship criteria:
- Ship if build passes, LP attribution is measurable, checkout still reaches live Stripe, policy/refund copy remains correct, PostHog/network events do not error visibly, and the live site remains usable on mobile.
- Do not expand into partner tracking, referral backend, prayer-chain backend, Clerk entitlement plumbing, or broader LP rewrites today unless the attribution fix is already done and verified.

Founder/operator caveats:
- Referral backend is confirmed stubbed; for today use UTM + `lp` attribution, not payable referral claims.
- If using a 100%-off friend test, the pay-in-full promo-code path still needs human Stripe confirmation during the run.
- Support mailbox and any live influencer/partner FTC disclosure are operational/founder responsibilities, not code-only items.

### Item 2 — Marketing and social media plan

Positioning:
- Audience: Bible-believing Christian bar takers preparing for the July 2026 MBE.
- Promise: wrong answers are not random; BarMatrix maps red zones and gives the next repair action.
- Voice: direct, Scripture-integrated, no founder-credibility crutches, no attorney-review claims, no bank-size bragging, no guaranteed pass/score language.
- Primary CTA: start the free diagnostic.

Before traffic:
- [ ] Finish LP attribution so every channel uses UTM + `lp` and every checkout path preserves both.
- [ ] Create one canonical launch link set:
  - influencer/TikTok: `https://barmatrix.app/?utm_source=tiktok&utm_medium=influencer&utm_campaign=launch1`
  - organic TikTok: `https://barmatrix.app/?utm_source=tiktok&utm_medium=organic&utm_campaign=launch1`
  - Reddit/community: `https://barmatrix.app/?utm_source=reddit&utm_medium=organic&utm_campaign=launch1`
  - email/text/friend tester: `https://barmatrix.app/?utm_source=founder&utm_medium=direct&utm_campaign=friend_test`
- [ ] Prepare a simple hourly launch monitor: uptime, checkout reach, diagnostic completion, checkout-start count, purchase/webhook status, support inbox.

Channel plan:
- TikTok/Reels/Shorts: 2-3 short videos per day using the legacy script structure but rewritten in TEAR voice. Patterns: trap reveal, live diagnostic clip, "wrong answers are a repair map", Scripture-integrated encouragement without outcome promises.
- Influencer/partner wave 1: 10-20 trusted Christian/law/bar-prep contacts only after attribution fix. Give approved link, FTC disclosure line, and forbidden-claims list for partner content; do not promise trackable commission until referral backend exists.
- Reddit/community: one practical-value post per relevant community, not a hard pitch. Lead with a useful trap/diagnostic insight, then link to the free diagnostic if rules allow.
- Founder direct list: send the friend-test link and a concise instruction script from `DAY1_READINESS.md`; supervised first buyer/friend run is the strongest proof source.
- Site-owned content: use the 28 LPs only as tracked diagnostic entry points after the attribution pass; do not start LP family rotation until source path is readable.

7-day cadence:
- Day 0/today: attribution fix, deploy, live smoke, canonical links, first supervised friend/influencer send.
- Day 1: publish 2 trap-reveal clips, run friend test, collect friction notes, patch only checkout/access blockers.
- Day 2: publish diagnostic/result-map clip, DM wave 1 trusted contacts, monitor checkout/support.
- Day 3: publish "first repair loop" clip, post one practical community thread, decide which LP/source is producing diagnostic starts.
- Day 4: retest/spaced-review content, follow up with warm contacts, summarize funnel numbers.
- Day 5: repeat highest-performing hook, add one email/direct outreach batch.
- Day 6-7: either scale the winning source or pause traffic and fix the biggest measured drop-off.

Metrics:
- North star: paid buyers who reach `zone_repaired` within 24h.
- Launch funnel: visit -> diagnostic start -> diagnostic complete -> checkout start -> Stripe session -> purchase -> welcome/repair.
- Social: views are secondary; track diagnostic starts by `utm_source`, `utm_campaign`, `lp`, and checkout-start preservation.

Review:
- The site is not blocked by basic availability or build failure right now. It is blocked by traffic-readiness proof: attribution must survive the LP/static checkout path before broader social or influencer traffic starts.
- The marketing plan should start narrow and proof-driven. The first social content should sell the diagnostic/repair result, not product size, founder authority, or a generalized bar-prep course.

## 2026-06-12 Launch Checkout Restore

Scope: Preserve the new marketing/sales path while restoring launch-critical old slash URLs for enrollment and post-payment account access.

Checklist:
- [x] Create rollback checkpoint branch and tag from the exact starting tree.
- [x] Add production rewrites for `/checkout`, `/checkout/success`, `/diagnostic`, `/pricing`, `/sign-in`, `/sign-up`, `/account`, and `/dashboard`.
- [x] Teach the app router to render launch-critical slash URLs while preserving hash-route fallbacks.
- [x] Update checkout success/cancel URLs and success next-step links to slash URLs.
- [x] Update auth return handling so `/sign-in?after=dashboard` and `/sign-up?after=dashboard` return to the dashboard shell.
- [x] Run focused checks: contract, drift, TypeScript, build, and route smoke.

Review:
- Rollback checkpoint branch `codex/launch-checkout-restore` and tag `pre-launch-checkout-restore-2026-06-12` were created before route changes. Because the starting tree was dirty, the tag points to local checkpoint commit `365614e`.
- Verification passed: `node scripts\contract_check.mjs`, `node scripts\drift_scan.mjs`, `.\node_modules\.bin\tsc.cmd --noEmit`, `npm run build`, and Playwright smoke for `/`, `/diagnostic`, `/pricing`, `/checkout`, `/checkout/success`, `/sign-in`, `/sign-up`, `/account`, `/dashboard`, plus hash fallbacks.

## 2026-06-12 Email QA Documentation Update

Scope: document the new BarMatrix testing/catchall mailbox without exposing secrets.

Checklist:
- [x] Locate current docs that mention email activation, support mailboxes, or dark-send QA.
- [x] Verify `CODEX_EMAIL_PASSWORD` exists in `C:\Users\JesusLovesMe\.env` without printing the value.
- [x] Update central infrastructure/readiness/handoff docs to use `codex@barmatrix.app` as the internal test and catchall mailbox.
- [x] Keep the password value out of repo docs; document only the env-file path and key name.

Review:
- `codex@barmatrix.app` is now documented as the default internal QA recipient and domain catchall for BarMatrix email-flow tests.
- The mailbox settings location is documented as `C:\Users\JesusLovesMe\.env`, with password key `CODEX_EMAIL_PASSWORD`; no secret value was read into docs or output.
- Customer-facing sends remain gated by build/runtime verification and explicit send approval where the handoff requires it.

## 2026-06-13 BMO Source-of-Truth Pivot

Scope: stop treating the redesign/rebuild as the source of truth. Use the old BMO-operated app/API as the functional base, then transplant only the sales/marketing content that improves conversion.

Current verified facts:
- `C:\BMO\app-repo` is a junction to `C:\barmatrix-app`.
- `C:\BMO\api-repo` is a junction to `C:\barmatrix-api`.
- `C:\BMO\website-repo` is a junction to `C:\barmatrix-site`.
- The clean live checkpoint for the integrated app is `C:\barmatrix-app\.worktrees\restore-old-app-marketing` on branch `codex/restore-old-app-marketing`, tag `checkpoint-current-live-bmo-restore-2026-06-12`.
- The dirty root app checkout `C:\barmatrix-app` is on `feat/ambassador-launch` and must not be used as a rollback base or edited casually.

Pivot checklist:
- [x] Verify BMO junctions and current git state for ABM, app, API, and BMO.
- [x] Identify the clean deployed checkpoint worktree and tags.
- [x] Compare the live checkpoint against old BMO functional branches/worktrees: `feat/j7-lead-me-path`, `feat/c7-forthewin`, and API checkout/access branch.
- [x] Create a short page/functionality matrix: keep, transplant marketing copy, defer, or delete from launch scope.
- [x] Make the app restore branch the single integration lane for launch fixes; keep ABM/static rebuild as reference only unless a specific asset/copy block is intentionally moved.
- [x] Reverify checkout, dashboard, mastery, final sprint, and guided path locally before any new deploy.

Review:
- Route inventory showed the deployed integrated app was not missing most old app routes; it still has the old app surface plus newer study/flashcard routes.
- The actual regression was paid-dashboard collapse: `/dashboard/mastery`, `/dashboard/final-sprint`, and `/dashboard/path` had been redirected into a simplified Lead Me-only dashboard.
- 2026-06-13 follow-up: user clarified the old system was operated from `C:\BMO`. Rechecked the junctions: `C:\BMO\app-repo` -> `C:\barmatrix-app`, `C:\BMO\api-repo` -> `C:\barmatrix-api`, and `C:\BMO\website-repo` -> `C:\barmatrix-site`. The old static app in `C:\barmatrix-site\app` is a functional/product reference for dashboard, red zones, matrix, pattern board, misconceptions, and drills, but the API-backed Next app remains the safer deployable base unless a specific old workflow is intentionally ported.
- 2026-06-13 follow-up plan saved: `docs/superpowers/plans/2026-06-13-bmo-old-base-restoration.md`.
- New branch `codex/bmo-paid-functionality-restore` was created from clean app checkpoint tag `checkpoint-current-live-bmo-restore-2026-06-12`.
- Restored the BMO old dashboard split: `/dashboard/path` = Lead Me, `/dashboard` = full dashboard, `/dashboard/mastery` = mastery board, `/dashboard/final-sprint` = final sprint.
- Verification passed in the app worktree: focused route tests, full `node --test tests\*.test.ts` 73/73, `npm run lint`, `npm run build`, and local production browser smoke on `http://localhost:3022`.
- Production deployment `dpl_7jK8Q3gp1h1Tq1QtDKFYcnSPhK2d` was built and aliased to `https://barmatrix.app`; tag `live-bmo-paid-tools-2026-06-13-dpl-7jK8Q3g` marks the deployed app commit.
- Live enrolled browser smoke confirmed `/dashboard/path`, `/dashboard`, `/dashboard/mastery`, and `/dashboard/final-sprint` render without raw errors, horizontal overflow, or duplicate `<main>` landmarks.
- 2026-06-13 detail polish follow-up: fixed visible internal slugs on trap/tension detail pages and humanized subject distribution labels. App commit `04791f7` (`Polish trap and tension detail labels`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_HPyRdF4AoosRU4DdrQAko2aXX79n`, aliased to `https://barmatrix.app`, and tagged `live-detail-label-polish-2026-06-13-dpl-HPyRdF4`.
- Verification passed for detail polish: focused tests `node --test tests\detail-page-display-polish.test.ts tests\trap-misconception-column.test.ts tests\mobile-content-overflow.test.ts`; full app tests `node --test tests\*.test.ts` (94/94); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; local browser smoke on `/traps/overbroad_rule` and `/tensions/cp_diversity_amount_vs_supplemental_jurisdiction`; live browser smoke on both routes with no visible raw slugs, no `CIVIL_PROCEDURE` / `CONSTITUTIONAL_LAW` enum text, one `<main>`, no horizontal overflow, and no console errors.
- 2026-06-13 red-zone detail follow-up: targeted live smoke then found `/red-zones/forensic/overbroad_rule` rendered raw route tag `overbroad_rule` as the page H1. Fixed the H1 to use `titleize(tag)` while preserving decoded route params for `/api/me/red-zones/zone`. App commit `16ea626` (`Polish red-zone detail headings`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_CDgxxUAiNGRBZvZiKWg7bsP1VjxA`, aliased to `https://barmatrix.app`, and tagged `live-red-zone-title-polish-2026-06-13-dpl-CDgxxUA`.
- Verification passed for red-zone detail polish: focused tests `node --test tests\red-zone-detail-routing.test.ts tests\detail-page-display-polish.test.ts tests\mobile-content-overflow.test.ts`; full app tests `node --test tests\*.test.ts` (95/95); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; local browser smoke on `/red-zones/forensic/overbroad_rule`; live browser smoke on `/red-zones/forensic/overbroad_rule`, `/traps/overbroad_rule`, and `/tensions/cp_diversity_amount_vs_supplemental_jurisdiction` with readable headings, no raw route slug text, one `<main>`, no horizontal overflow, and no console errors.
- 2026-06-13 auth access follow-up: fixed the sign-in/sign-up launch path so `after=dashboard` is preserved through both the Clerk form and the no-Clerk fallback. The auth pages now render immediate account-access copy, pass `forceRedirectUrl` / `fallbackRedirectUrl` into Clerk, and keep fallback CTAs pointed at the sanitized return path instead of dropping users on `/` or a generic account page. App commit `7f6391e` (`Polish auth access shell`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_DPr1edzdDJmxu5hFM4HfQfqdFk6f`, aliased to `https://barmatrix.app`, and tagged `live-auth-access-shell-2026-06-13-dpl-DPr1edz`.
- Verification passed for auth access polish: focused tests `node --test tests\auth-form-fallback.test.ts tests\checkout-success-state.test.ts tests\account-entitlement-state.test.ts`; full app tests `node --test tests\*.test.ts` (98/98); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; local production browser smoke on `/sign-in?after=dashboard` and `/sign-up?after=dashboard`; live browser smoke confirmed already-authenticated users land on `/dashboard`; no-cookie HTTPS smoke confirmed both auth pages return 200, include sign-in/sign-up copy, include `/dashboard`, and do not render an empty `<main>`.
- 2026-06-13 paid-surface label follow-up: removed customer-facing internal labels from paid-program surfaces. The dashboard cohort card now formats `cohort_code` / `public_status` for display instead of exposing values such as `JULY_MBE_REPAIR`, and the trap catalog captions no longer show API field names `forensic_tags` or `misconception_tags`. App commit `944083d` (`Polish paid surface labels`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_HWP7gE1n9Cn7U772kRtfV2g26JND`, aliased to `https://barmatrix.app`, and tagged `live-paid-surface-label-polish-2026-06-13-dpl-HWP7gE1`.
- Verification passed for paid-surface label polish: focused tests `node --test tests\trap-misconception-column.test.ts tests\paid-program-display-labels.test.ts`; full app tests `node --test tests\*.test.ts` (100/100); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; local and live browser smoke on `/dashboard` and `/traps` confirmed no raw `JULY_MBE_REPAIR`, no `forensic_tags`, no `misconception_tags`, one `<main>`, no horizontal overflow, and no console errors.
- 2026-06-13 study-surface label follow-up: removed internal implementation labels from paid study pages. Timed sets, subject pages, and subject drill pages no longer expose `SRC-0026`, `BY-SUBJECT API`, `Inline forensics`, `subject endpoint`, or `The route is live` in customer-facing copy. Replaced those with product language such as `Live mixed bank`, `Wrong-answer forensics`, `Guided review`, `Subject bank`, and `Live practice`. App commit `4d7f8e7` (`Polish study surface labels`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_H2xzrJHYRKGd711w3MYxBo5Wu3pH`, aliased to `https://barmatrix.app`, and tagged `live-study-surface-label-polish-2026-06-13-dpl-H2xzrJH`.
- Verification passed for study-surface label polish: focused tests `node --test tests\study-surface-public-labels.test.ts tests\paid-program-display-labels.test.ts tests\trap-misconception-column.test.ts`; full app tests `node --test tests\*.test.ts` (102/102); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; local and live browser smoke on `/timed-sets`, `/drills/contracts`, `/subjects/civil-procedure`, and `/subjects/criminal-law` confirmed the replacement product labels are visible, no forbidden implementation labels remain, one `<main>` renders, no horizontal overflow appears, and no console errors appear.
- 2026-06-13 study metadata label follow-up: after live interaction checks on `/timed-sets`, `/drills/contracts`, `/subjects/civil-procedure`, and `/dashboard/path`, found that started/synced paid study workflows still exposed raw returned metadata such as all-caps topic/subtopic/tension labels. Added shared formatter `lib/study-labels.ts` and wired all seven subject pages plus all seven subject-drill pages through it so API taxonomy remains useful internally but renders as customer-readable labels. App commit `b7186ad` (`Polish study metadata labels`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_Bc8g3xx85nohoH55rQN7JSHbL65A`, aliased to `https://barmatrix.app`, and tagged `live-study-metadata-label-polish-2026-06-13-dpl-Bc8g3xx`.
- Verification passed for study metadata label polish: focused test `node --test tests\study-surface-public-labels.test.ts` (4/4); full app tests `node --test tests\*.test.ts` (104/104); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production Vercel build completed with TypeScript and 53 static pages; live route checks returned 200 for `/`, `/drills/contracts`, `/subjects/civil-procedure`, `/subjects/contracts`, and `/dashboard/path`; live HTML checks on `/drills/contracts` and `/subjects/civil-procedure` found no forbidden raw/debug strings; live API formatting probe showed customer-readable labels like `Personal Jurisdiction`, `Consent and Forum Selection Clauses`, `Rule 50(a) Timing`, and preserved acronym `JMOL`.
- 2026-06-13 source-context clarification: user reiterated that the old system and `barmatrix-app` were operated under `C:\BMO`. Keep using `C:\BMO` as the old operating context and comparison map when deciding what functionality to restore, while using the verified `C:\barmatrix-app` worktree as the deployable Next app integration lane.
- 2026-06-13 legacy dashboard route follow-up: restored direct paid-app destinations that existed in the old BMO/static app navigation but were missing as first-class Next routes: `/matrix`, `/misconceptions`, and `/question-history`. Added compatibility redirects for `/pattern-board` -> `/dashboard/mastery` and `/history` -> `/question-history`, then linked the new pages from the dashboard navigation and command center. App commit `e082a8b` (`Restore legacy dashboard routes`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_AmiNVhCapWsJom2f54BoPwFVo6b3`, aliased to `https://barmatrix.app`, and tagged `live-legacy-dashboard-routes-2026-06-13-dpl-AmiNVh`.
- Verification passed for legacy dashboard routes: focused route test `node --test tests\legacy-dashboard-routes.test.ts`; full app tests `node --test tests\*.test.ts` (106/106); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; local production HTTP smoke confirmed `/matrix`, `/misconceptions`, `/question-history`, and `/dashboard` returned 200 with restored labels, `/pattern-board` redirected to `/dashboard/mastery`, and `/history` redirected to `/question-history`; live HTTPS smoke confirmed `/matrix`, `/misconceptions`, and `/question-history` return 200 with body markers, `/history` and `/pattern-board` redirect correctly, and signed-out dashboard routes continue to route through Clerk sign-in.

### 2026-06-13 Old Sidebar Compatibility Pass

Scope: restore old BMO sidebar access points that still 404 on the live app while keeping current honest product state.

Checklist:
- [x] Add regression coverage for old sidebar URLs `/drill`, `/mobile`, `/mobile-apps`, and `/support`.
- [x] Map `/drill` to the current practice/drill-mode experience.
- [x] Add an honest mobile access page for mobile web/PWA use without claiming unavailable native apps.
- [x] Add a first-class support page and link it from paid/account surfaces.
- [x] Build, smoke locally, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Live pre-fix check on `https://barmatrix.app` returned 404 for `/drill`, `/mobile`, `/mobile-apps`, and `/support`; current equivalents `/practice` and `/app` returned usable pages, and `/drills` correctly redirected signed-out users to Clerk.
- Implemented old-sidebar compatibility in app commit `2ad7579` (`Restore old sidebar access routes`) on private branch `codex/old-app-marketing-transplant`: `/drill` redirects to `/practice`, `/mobile` redirects to `/mobile-apps`, `/mobile-apps` is an honest mobile web/PWA access page, `/support` is a first-class account/billing/study support page, dashboard program navigation includes Mobile Access and Support, Account points support users to `/support`, and sitemap includes `/mobile-apps` plus `/support`.
- Verification passed: focused red/green test `node --test tests\legacy-sidebar-compatibility.test.ts`; full app tests `node --test tests\*.test.ts` (109/109); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; local production HTTP smoke confirmed `/drill` -> `/practice`, `/mobile` -> `/mobile-apps`, `/mobile-apps` 200, `/support` 200, and `/account` source includes `/support`.
- Production deployment `dpl_FAsfXQReTN3arNunhgQitozgkgv9` was built, aliased to `https://barmatrix.app`, and tagged `live-old-sidebar-routes-2026-06-13-dpl-FAsfXQR`. Live HTTPS smoke confirmed `/drill` -> `/practice`, `/mobile` -> `/mobile-apps`, `/mobile-apps` 200 with mobile access copy, `/support` 200 with support and billing mailboxes, signed-out `/account` still gates through Clerk, and `/sitemap.xml` includes `/mobile-apps` plus `/support`.

### 2026-06-13 Drill Catalog Label Polish

Scope: remove raw taxonomy/code labels from the paid drill catalog so the enrolled drill library feels like a finished product surface.

Checklist:
- [x] Crawl current source/live links for broken public routes after the old-sidebar deployment.
- [x] Verify the live drill catalog API shape and identify raw labels returned by the backend.
- [x] Add regression coverage for catalog label formatting.
- [x] Format code-like catalog labels before rendering catalog cards.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Source/live link crawl found no public 404s after the old-sidebar route pass; only expected Clerk-gated redirects remained for account/dashboard/drill library routes.
- Live API evidence from `https://api.barmatrix.app/api/drills/catalog` showed catalog labels such as `CON CM 018`, `TORT CA 003`, `CON JR 01`, and `CON SOP 01`. The UI was rendering `item.label` directly on catalog cards, which exposed backend taxonomy labels to paid users.
- Added `formatCatalogDrillLabel` in `lib/drills.ts` and wired `app/drills/page.tsx` catalog cards through it. Code-like labels now render as product labels such as `Constitutional Law Targeted Drill 18` or `Torts Targeted Drill 3`, while human labels remain humanized.
- Verification passed: focused test `node --test tests\paid-program-display-labels.test.ts`; full app tests `node --test tests\*.test.ts` (110/110); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; Vercel production build completed with TypeScript and 62 static pages.
- App commit `7266fa4` (`Polish drill catalog labels`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to production `dpl_HvxcKfdRxwjQUkgtVCTS8ZdQed3g`, aliased to `https://barmatrix.app`, and tagged `live-drill-catalog-label-polish-2026-06-13-dpl-HvxcKfd`.
- Live HTTPS smoke after deploy confirmed `/drills` remains correctly Clerk-gated for signed-out users, `/drill` redirects to `/practice`, `/boot-camps` and `/support` return 200, and the catalog API returns with `Access-Control-Allow-Origin: https://barmatrix.app`.

### 2026-06-13 Boot Camp Target Label Polish

Scope: remove raw boot-camp seed/taxonomy codes from public boot-camp target chips.

Checklist:
- [x] Verify live boot-camp API payload and raw target codes.
- [x] Add regression coverage for boot-camp target label formatting.
- [x] Format boot-camp catalog and detail target chips through a customer-facing helper.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Live API evidence from `https://api.barmatrix.app/api/boot-camps` showed seeded camp targets such as `CRIM-4A-BOOT-01`, `CRIM-4A-BOOT-03`, `CRIM-WE-02`, and other code-like values. The catalog and detail pages were rendering those via `humanizeTag(value)`, which could expose labels like `CRIM 4A BOOT 01`.
- Added `formatBootCampTargetLabel` in `lib/boot-camps.ts`, mapping seeded Criminal Procedure targets to readable labels such as `Fourth Amendment Focus 1` and `Warrant Exception Focus 2`, while preserving normal snake-case trap labels via the existing humanizer.
- App commit `84bdb91` (`Polish boot camp target labels`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_6a84FJo7NDpwQzZGnsK1LVwGCdGo`, aliased to `https://barmatrix.app`, and tagged `live-boot-camp-label-polish-2026-06-13-dpl-6a84FJo`.
- Verification passed: focused test `node --test tests\boot-camp-public-labels.test.ts`; full app tests `node --test tests\*.test.ts` (111/111); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; live HTTPS smoke confirmed `/boot-camps`, `/boot-camps/criminal-4th-am-search-seizure`, and `/support` return 200, and the boot-camp API returns seeded camp targets with `Access-Control-Allow-Origin: https://barmatrix.app`.

### 2026-06-13 Certification Public Label Polish

Scope: make the linked certification surface feel like a production paid-program feature instead of a prototype while preserving its existing Clerk/API workflow.

Checklist:
- [x] Identify certification as a linked paid-program surface still exposing prototype language and raw competency labels.
- [x] Add regression coverage for certification public labels.
- [x] Format competency IDs, capture modes, option values, result conditions, and remediation lesson links before display.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Source evidence showed `/certification` is linked from the main app shell and paid dashboard, and the runner already uses real API calls (`/api/certification`, `/api/certification/:id`, start, and submit). The customer-facing issue was display polish: visible copy such as `answers are fixed sample items`, raw IDs such as `M1`, and raw capture modes such as `rule_distractor` / `axis_survivor`.
- Added `lib/certification-labels.ts` and wired the scorecard plus runner through it. The scorecard now labels `M1` as `Mastery Check 1`, renders capture modes as product language, masks the API preview note with customer-facing scorecard copy, and formats result answer/key values, conditions, and repair links.
- App commit `7dc9fb3` (`Polish certification public labels`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_GJBYe1jYNTqv7cRGhURV26i2dSY2`, aliased to `https://barmatrix.app`, and tagged `live-certification-label-polish-2026-06-13-dpl-GJBYe1j`.
- Verification passed: focused test `node --test tests\certification-public-labels.test.ts`; full app tests `node --test tests\*.test.ts` (113/113); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production Vercel build completed with TypeScript and 62 static pages; live HTTPS smoke confirmed `/certification` and `/certification/M1` return 200 without `fixed sample items`, `sample items`, `Preview Certification`, `rule_distractor`, or `axis_survivor`, and signed-out `/dashboard` still redirects to Clerk sign-in.

### 2026-06-13 Doctrinal Lesson Method Fallback

Scope: keep paid guided-path learners moving when the dedicated doctrinal lesson endpoint is not approved yet.

Checklist:
- [x] Verify the live doctrinal lesson API behavior.
- [x] Add regression coverage so the route does not render a coming-soon dead end.
- [x] Replace the 503 branch with a live Method lesson fallback and path completion action.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Live API evidence confirmed `https://api.barmatrix.app/api/study/doctrinal/lesson-01` and `lesson-02` currently return `503` with `content_not_yet_approved`. The frontend previously rendered `Coming soon`, `This lesson is in final review`, and sent the user back to the path without a useful lesson destination.
- Replaced the 503 branch in `app/study/doctrinal/[slug]/page.tsx` with a paid-path compatibility fallback: `Open Method lesson` links to `/foundations/${slug}`, and `Mark complete and return` keeps the existing `completePathStep` behavior for signed-in users with a path step id.
- App commit `bf155b6` (`Fallback doctrinal lessons to Method`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_31S5adQfdTCpgjRFuER8DEaYxHoU`, aliased to `https://barmatrix.app`, and tagged `live-doctrinal-method-fallback-2026-06-13-dpl-31S5adQ`.
- Verification passed: focused test `node --test tests\doctrinal-lesson-fallback.test.ts`; full app tests `node --test tests\*.test.ts` (114/114); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production Vercel build completed with TypeScript and 62 static pages; live HTTPS smoke confirmed `/study/doctrinal/lesson-01?step=smoke` returns 200 and no longer ships the old coming-soon/final-review wording.

### 2026-06-13 Public Marketing Source Stamp Polish

Scope: remove internal source-control labels from prospect-facing public pages without changing the locked marketing copy itself.

Checklist:
- [x] Verify live public pages still exposed internal source stamps.
- [x] Add regression coverage for public source-stamp exposure.
- [x] Remove visible source badges from About and FAQ.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Live evidence confirmed `/about` and `/faq` returned 200 but shipped visible `SRC-0029` source labels in the HTML.
- Removed only the rendered source badges from `app/about/page.tsx` and `app/faq/page.tsx`; maintainer comments and locked-copy references remain in source where useful.
- App commit `d658b2d` (`Polish public marketing source stamps`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_69F94cQPMKNKh4B2pd49Q9bgqPzK`, aliased to `https://barmatrix.app`, and tagged `live-public-source-stamp-polish-2026-06-13-dpl-69F94cQ`.
- Verification passed: focused test `node --test tests\public-marketing-copy-polish.test.ts`; full app tests `node --test tests\*.test.ts` (115/115); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production Vercel build completed with TypeScript and 62 static pages; live HTTPS smoke confirmed `/about` and `/faq` return 200 with expected content and no visible source stamp.

### 2026-06-13 Homepage Proof Caption Polish

Scope: make the homepage proof card read like product evidence instead of a mockup/demo.

Checklist:
- [x] Scan live public routes for remaining prototype/internal labels.
- [x] Add regression coverage for the homepage proof-card caption.
- [x] Rename the proof-card caption class and replace `Illustrative example` with `Diagnostic output example`.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Live public route scan showed only `/` still returned prototype-style proof-card hits: `demo-caption` and `Illustrative example`; the other scanned public routes returned 200 without the rough-edge patterns.
- Updated the homepage forensic proof card from `demo-caption` / `Illustrative example` to `proof-caption` / `Diagnostic output example`, preserving the same layout and proof card content.
- App commit `a73895c` (`Polish homepage proof caption`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_7LK5eW6WQf7PJxPNxSq1noCXwafu`, aliased to `https://barmatrix.app`, and tagged `live-homepage-proof-caption-polish-2026-06-13-dpl-7LK5eW`.
- Verification passed: focused test `node --test tests\homepage-proof-card-polish.test.ts`; full app tests `node --test tests\*.test.ts` (116/116); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production Vercel build completed with TypeScript and 62 static pages; live HTTPS smoke confirmed `/` returns 200, includes `Diagnostic output example`, and no longer includes `Illustrative example` or `demo-caption`.

### 2026-06-13 Final Sprint Copy Polish

Scope: remove prototype-feeling date labels from the paid final-sprint dashboard while preserving the existing per-device exam-date behavior.

Checklist:
- [x] Scan source and live public routes for remaining launch-hostile labels after the homepage polish.
- [x] Add regression coverage for final-sprint date copy.
- [x] Replace visible `sample date` / `preview date` language with planning-date language.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Source scan found the strongest remaining paid-surface rough edge in `app/dashboard/final-sprint/page.tsx`: visible copy described the missing-date state as a `sample date`, displayed `Preview date:`, and offered a `Use preview date` button.
- Updated the visible copy to describe the fallback date as a default planning date inside the sprint window, and changed the CTA to `Use planning date`; no scheduling logic, storage key, dashboard API, or route behavior changed.
- App commit `90d77eb` (`Polish final sprint planning copy`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_9sgxCUv2exMU3bnXXTDFt8GHdugx`, aliased to `https://barmatrix.app`, and tagged `live-final-sprint-copy-polish-2026-06-13-dpl-9sgxCUv`.
- Verification passed: focused test `node --test tests\final-sprint-copy-polish.test.ts`; full app tests `node --test tests\*.test.ts` (117/117); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production Vercel build completed with TypeScript and 62 static pages; live HTTPS smoke confirmed `/dashboard/final-sprint` returns 200 on both `https://barmatrix.app` and the deployment URL. The exact label is client-rendered, so source regression and build output are the text-level proof for this pass.

### 2026-06-13 Legacy Static Entry Redirects

Scope: keep old saved/static launch-path URLs from landing on 404s while preserving the current canonical slash routes.

Checklist:
- [x] Re-scan current production launch routes and legacy static entry URLs.
- [x] Add regression coverage for old checkout/auth/account static URLs.
- [x] Redirect legacy static entry URLs to the current checkout, auth, account, and dashboard routes.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Live route evidence before this pass showed the canonical launch routes working, but `/checkout.html`, `/login.html`, and `/welcome` returned 404. Those are old-style entry points that can exist in saved links, older emails, or stale browser history.
- Added permanent redirects in `next.config.ts`: `/checkout.html` -> `/checkout`, `/login.html` and `/signin.html` -> `/sign-in`, `/signup.html` -> `/sign-up`, `/account.html` -> `/account`, `/dashboard.html` -> `/dashboard`, and `/welcome` -> `/account?welcome=1`.
- App commit `067aada` (`Restore legacy static entry redirects`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_R1Vx3biT5NfBGe3jx1svUwMDAjww`, aliased to `https://barmatrix.app`, and tagged `live-legacy-static-entry-redirects-2026-06-13-dpl-R1Vx3b`.
- Verification passed: focused test `node --test tests\legacy-static-url-redirects.test.ts`; full app tests `node --test tests\*.test.ts` (118/118); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production deploy completed; live HTTPS smoke confirmed all seven legacy URLs return `308` to the intended canonical route on both `https://barmatrix.app` and the deployment URL.

### 2026-06-13 Legacy Public HTML Redirects

Scope: extend old static-site compatibility from launch entry URLs to the broader public, legal, and product `.html` surface.

Checklist:
- [x] Scan current production for old public/legal `.html` URLs that still 404.
- [x] Centralize legacy static redirects in `next.config.ts`.
- [x] Expand redirect regression coverage for public/legal/product `.html` URLs.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Live evidence before this pass showed `/pricing.html`, `/diagnostic.html`, `/terms.html`, `/privacy.html`, `/refund.html`, `/support.html`, `/about.html`, `/faq.html`, `/waitlist.html`, `/referral.html`, `/partners.html`, `/boot-camps.html`, `/timed-sets.html`, `/certification.html`, `/red-zones.html`, `/traps.html`, `/tensions.html`, `/foundations.html`, and `/mastery.html` all returned 404; `/webinar.html` was already redirecting.
- Refactored the redirect table into `LEGACY_STATIC_REDIRECTS` and covered the old public/legal/product URLs plus the launch-entry URLs already restored in the prior pass.
- App commit `9df8902` (`Redirect legacy public html pages`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_4EdE7GQ7PvR4ecPoXjfG7akiDHxx`, aliased to `https://barmatrix.app`, and tagged `live-legacy-public-html-redirects-2026-06-13-dpl-4EdE7G`.
- Verification passed: focused tests `node --test tests\legacy-static-url-redirects.test.ts tests\webinar-lead-capture.test.ts`; full app tests `node --test tests\*.test.ts` (119/119); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production Vercel build completed with TypeScript and 62 static pages; live HTTPS smoke confirmed all 27 legacy URLs return `308` to their intended canonical routes on both `https://barmatrix.app` and the deployment URL.

### 2026-06-13 Diagnostic Repair Proof Copy

Scope: strengthen the public proof-before-price funnel so the free diagnostic sounds like real repair assignment evidence, not a sample/demo offer.

Checklist:
- [x] Re-scan live public funnel pages for remaining sample/demo/prototype language.
- [x] Add regression coverage to the existing diagnostic-first sales-copy test.
- [x] Replace `Sample assigned drills` / `try before you buy` wording on the homepage and diagnostic page.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Live evidence before this pass showed `/` still contained `Sample assigned` and `try before you buy`, and `/diagnostic` still contained `Sample assigned`. The rest of the scanned public funnel pages were clean for the checked rough-edge terms.
- Updated the homepage and diagnostic page list items to `Assigned repair drills tied to your diagnostic misses`, keeping the diagnostic-first offer intact while making the proof feel like a real program output.
- App commit `58645ff` (`Polish diagnostic repair proof copy`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_oRNMGaL7BMWSqJ8mwYy7ze8YvnhV`, aliased to `https://barmatrix.app`, and tagged `live-diagnostic-repair-proof-copy-2026-06-13-dpl-oRNMGa`.
- Verification passed: focused test `node --test tests\diagnostic-first-sales-copy.test.ts`; full app tests `node --test tests\*.test.ts` (119/119); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production Vercel build completed with TypeScript and 62 static pages; live HTTPS smoke confirmed `/` and `/diagnostic` return 200, include `Assigned repair drills tied to your diagnostic misses`, and no longer include `Sample assigned drills` or `try before you buy` on both `https://barmatrix.app` and the deployment URL.

### 2026-06-13 Account Access Fallback Polish

Scope: remove stale account-access launch-placeholder copy so post-purchase users never see "sign-in is coming online" messaging.

Checklist:
- [x] Re-check live checkout-success, auth, account, and dashboard route behavior.
- [x] Add focused regression coverage for the account fallback copy.
- [x] Point the fallback at live sign-in with checkout-email guidance.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Live route evidence before this pass showed `/checkout/success`, `/sign-in`, and `/sign-up` returning usable pages; `/account` and `/dashboard` correctly redirected signed-out users to sign-in. Source review found one stale fallback in `lib/copy.ts`: `Sign-in is coming online with the cohort launch`.
- Updated `ACCOUNT_PLACEHOLDER` to `Open your BarMatrix account.`, with guidance to sign in using the checkout email and CTA `/sign-in?after=account`.
- Added `tests/account-entitlement-state.test.ts` coverage to prevent the stale `coming online` / `check your email for your access details` placeholder from returning.
- App commit `9c698b0` (`Polish account access fallback`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_3mvsRbFa2p1U9y94iaGkttboguqX`, aliased to `https://barmatrix.app`, and tagged `live-account-access-fallback-polish-2026-06-13-dpl-3mvsRbF`.
- Verification passed: focused test `node --test tests\account-entitlement-state.test.ts`; full app tests `node --test tests\*.test.ts` (120/120); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production Vercel build completed with TypeScript and 62 static pages; live HTTPS smoke confirmed `/`, `/checkout/success?plan=full&source=pricing&after=dashboard`, `/sign-in?after=account`, and `/sign-up?after=dashboard&source=checkout_success` return 200, while `/account` and `/dashboard` redirect signed-out users to sign-in.

### 2026-06-13 Live Route and Checkout-Account Verification

Scope: continue launch-readiness verification after the account fallback deploy, focusing on live links, checkout/account handoff evidence, and old-dashboard compatibility routes.

Checklist:
- [x] Re-check the clean API checkout/account worktree and production deployment notes.
- [x] Crawl live nav-linked routes from `https://barmatrix.app`.
- [x] Crawl all sitemap routes for bad statuses and rough launch copy markers.
- [x] Smoke old dashboard compatibility routes and paid dashboard guards.

Review:
- API checkout/account handoff evidence is already deployed from clean worktree `C:\barmatrix-api\.worktrees\checkout-clerk-access` on branch `codex/checkout-provisioning-hardening`: Stripe Checkout requires first/last name custom fields, webhook/recovery fulfillment creates or reuses a Clerk user, and the access email sends a Clerk sign-in-token link instead of routing buyers back through manual sign-up.
- Re-ran focused API verification in the clean worktree: `npx --no-install tsx --test src\checkout.test.ts src\entitlement.test.ts src\clerk-access.test.ts src\email.test.ts src\checkout-recovery-access.test.ts` passed 40/40, `npm run typecheck` passed, and `npm run build` passed.
- Full API test glob still requires a local MySQL server for `src\routes\me-red-zones.integration.test.ts`; that group failed with `ECONNREFUSED 127.0.0.1:3306`, while non-DB launch-critical tests passed.
- Live nav crawl found no public 404s: `/`, `/diagnostic`, `/pricing`, `/checkout`, `/checkout/success`, `/sign-in`, `/sign-up`, `/support`, policy pages, and product pages returned 200; `/account`, `/dashboard`, `/dashboard/path`, and `/drills` correctly redirected signed-out users to sign-in.
- Sitemap crawl covered 52 routes and found 0 bad statuses. Four rough-marker hits were false positives: `sample` in partner application copy, Sentry `sampled` telemetry attributes, and normal form placeholders.
- Old-dashboard compatibility smoke passed: `/matrix`, `/misconceptions`, `/question-history`, `/practice`, `/red-zones`, `/traps`, `/tensions`, `/foundations`, `/mastery`, and `/coach` returned 200 with product shell markers; `/pattern-board`, `/history`, `/mobile`, and `/drill` redirected to their intended current routes; paid dashboard subroutes redirected signed-out users to sign-in.

### 2026-06-13 Auth Unavailable Fallback Polish

Scope: remove the last stale no-Clerk auth fallback copy so buyers who hit an auth-loading failure still get active checkout/account guidance.

Checklist:
- [x] Audit authenticated paid-user surfaces for stale launch-placeholder copy.
- [x] Add regression coverage for the auth-unavailable fallback.
- [x] Replace `coming online` fallback wording with checkout-email/account-access guidance.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Source review found `app/auth-unavailable.tsx` still told users `Account creation is coming online.`, `Sign-in is coming online.`, and referenced being `connected for the cohort launch` when the Clerk hosted auth form could not load.
- Updated the fallback copy to direct sign-up and sign-in users to use the email from checkout, open their account-link email first when applicable, and continue to the dashboard.
- App commit `5a4ed7b` (`Polish auth unavailable fallback`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_DTttv77kE2utoBpGs88gGv9FPwEL`, aliased to `https://barmatrix.app`, and tagged `live-auth-unavailable-fallback-2026-06-13-dpl-DTttv77`.
- Verification passed: focused test `node --test tests\auth-form-fallback.test.ts` (4/4); full app tests `node --test tests\*.test.ts` (120/120); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production Vercel build completed with TypeScript and 62 static pages; live HTTPS smoke confirmed `/sign-in?after=dashboard`, `/sign-up?after=dashboard`, `/checkout/success?plan=full&source=pricing&after=dashboard`, and `/` return 200 with no stale fallback copy, while `/account` and `/dashboard` redirect signed-out users to sign-in instead of 404.

### 2026-06-13 Diagnostic Results Account-Check Guard

Scope: prevent a signed-in buyer whose enrollment has not attached yet from seeing another enrollment CTA after finishing the diagnostic.

Checklist:
- [x] Reproduce the weak branch in source: signed-in accounts with `dash.data.enrolled === false` fell through to the anonymous/not-enrolled checkout CTA.
- [x] Add regression coverage for signed-in unconfirmed diagnostic results.
- [x] Route signed-in unconfirmed accounts to account access/recovery before another checkout.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Root cause: `app/diagnostic/[session]/results/page.tsx` only separated `enrolled`, `access_unavailable`, `signed_out`, and `not_enrolled`; a signed-in user whose entitlement was delayed or mismatched hit the same `Enroll and save this map` panel as an anonymous prospect.
- Added an `account_unconfirmed` access state for `dash.signedIn && dash.data && !dash.data.enrolled`, with copy that sends the user to `/account` to confirm or recover access before another checkout. The zero-red-zone state now uses the same account-check guidance.
- App commit `06e7786` (`Route signed-in diagnostic users to account check`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_7HBHpWWJCnpVwdf2or7h2qRCoMXg`, aliased to `https://barmatrix.app`, and tagged `live-diagnostic-account-check-2026-06-13-dpl-7HBHpW`.
- Verification passed: focused test `node --test tests\diagnostic-results-enrolled-cta.test.ts`; full app tests `node --test tests\*.test.ts` (120/120); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production Vercel build completed with TypeScript and 62 static pages; live HTTPS smoke confirmed `/diagnostic/00000000-0000-0000-0000-000000000000/results`, `/diagnostic`, `/checkout/success?plan=full&source=pricing&after=dashboard`, and `/sign-in?after=account` return 200 while `/account` and `/dashboard` redirect signed-out users to sign-in.

### 2026-06-13 Checkout Marker Diagnostic Guard

Scope: close the remaining paid-user diagnostic-results gap when the browser has just completed checkout but Clerk/auth state is missing or slow on the diagnostic results screen.

Checklist:
- [x] Verify the reported coupon checkout account in live Hostinger DB and Clerk without printing secrets.
- [x] Add a confirmed-checkout client marker from the checkout success page.
- [x] Teach diagnostic results to treat a recent confirmed checkout as account-access context, not a prospect sales context.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Live Hostinger DB evidence for `votewood@icloud.com`: one `students` row with `status='enrolled'`, an active live purchase for checkout session `cs_live_b1FrOJl5ikoZ1w7rcytZJXKp1Tp9Cei0xlW1OlcqCqCwGQMvooKbW3K2ol`, `net_collected_cents=0`, `entitlement_status='active'`, `refund_status='none'`, and an active cohort enrollment. Clerk evidence showed one matching user with primary email `votewood@icloud.com`.
- Because protected APIs already resolve entitlement by Clerk primary email -> `students.email` -> active purchase, the underlying reported account should be enrolled. The remaining failure mode was client state: a post-checkout browser could reach diagnostic results without a resolved signed-in dashboard state and still see the anonymous enrollment CTA.
- Added `lib/checkout-access-state.ts` with a 30-day `barmatrix.checkout.confirmed_access` localStorage marker. `PurchaseSuccessTracker` writes it only after checkout activation is confirmed, and diagnostic results read it through `useRecentConfirmedCheckoutAccess()` to show account/sign-in guidance instead of another checkout.
- App commit `a6d5aa3` (`Remember confirmed checkout for diagnostic results`) was pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_FzcaCaE6EbruvmdqUwnXWQQ5uCSz`, aliased to `https://barmatrix.app`, and tagged `live-checkout-marker-diagnostic-guard-2026-06-13-dpl-FzcaCa`.
- Verification passed: focused test `node --test tests\diagnostic-results-enrolled-cta.test.ts` (3/3); full app tests `node --test tests\*.test.ts` (121/121); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`; production Vercel build completed with TypeScript and 62 static pages; live HTTPS smoke confirmed checkout success, diagnostic results shell, diagnostic, and sign-in return 200 while signed-out `/account` and `/dashboard` redirect to sign-in.

### 2026-06-13 Account Billing Portal Recovery

Scope: keep the enrolled account page from hiding the Stripe billing action when an active purchase may still be recoverable through Stripe customer lookup.

Checklist:
- [x] Recheck the signed-in live account page for the reported checkout account.
- [x] Verify production purchase data for the checkout account without printing secrets.
- [x] Add regression coverage for active enrolled accounts with `stripe_customer_missing`.
- [x] Build, deploy, live-smoke, and tag the deployed checkpoint.

Review:
- Authenticated live browser evidence for `votewood@icloud.com` showed `/dashboard/path` loading the paid guided path and `/account` showing `ACCOUNT ACTIVE`, but the billing panel still displayed `No Stripe billing portal`.
- Production database evidence for the same account showed an enrolled student, active purchase, checkout session present, Stripe customer present, and billing capability logic computing `portal_available: true`.
- Updated `BillingPortalButton` so active enrolled accounts keep the payment-method CTA available even when the dashboard billing capability is stale or conservative; non-enrolled accounts still see the support/blocked state.
- App commits `38bc5ed` (`Recover billing portal for enrolled accounts`) and `6aea453` (`Keep billing portal available for enrolled accounts`) were pushed to private branch `codex/old-app-marketing-transplant`, deployed to Vercel production `dpl_BUP14hXjCQCi98AEDvYwJiasRw8d`, aliased to `https://barmatrix.app`, and tagged `live-account-billing-portal-cta-2026-06-13-dpl-BUP14hX`.
- Verification passed locally: focused test `node --test tests\api-client-billing-portal.test.ts`; full app tests `node --test tests\*.test.ts` (122/122); `npm run lint`; `git diff --check` with only CRLF warnings; `npm run build`.
- Live authenticated smoke after deploy confirmed `/account` shows `ACCOUNT ACTIVE`, no longer shows `No Stripe billing portal`, and shows `Update Payment Method`. A click from the current in-app browser session still returned the support fallback, likely because that browser session is not the verified `votewood@icloud.com` Stripe-backed account; production backend checks for the verified Clerk user and student id both resolve to the expected active Stripe-backed purchase.
- Follow-up verified the cause of the failed click: the in-app browser was still signed in as `qa-test@barmatrix-qa.com`. After signing out and applying a fresh Clerk sign-in token for `votewood@icloud.com`, the account page showed active access and clicking `Update Payment Method` successfully opened the live Stripe billing portal for `votewood@icloud.com`.

### 2026-06-13 Verified Paid Account Surface Sweep

Scope: use the verified Stripe-backed checkout account to smoke the paid-user program surfaces and identify the next runtime blocker.

Checklist:
- [x] Sign out the stale QA account browser session.
- [x] Sign in with a fresh Clerk sign-in token for `votewood@icloud.com`.
- [x] Verify dashboard, account, billing portal, and paid surface routes.
- [x] Verify The Method first-lesson entry without mutating buyer progress.

Review:
- The stale in-app browser identity was visible in the user menu as `qa-test@barmatrix-qa.com`; after signing out, a fresh one-time link for `votewood@icloud.com` loaded the paid dashboard with zero progress and the active account shell.
- Live billing proof: `/account` showed `ACCOUNT ACTIVE` and `Update Payment Method`; clicking the button opened Stripe Billing with billing email `votewood@icloud.com`.
- Live paid route sweep found no sign-in gates, raw API errors, or dead pages on `/dashboard`, `/dashboard/path`, `/dashboard/mastery`, `/dashboard/final-sprint`, `/drills`, `/boot-camps`, `/timed-sets`, `/certification`, `/coach`, `/matrix`, `/misconceptions`, `/question-history`, and `/red-zones`.
- The only keyword hits were not checkout CTAs: dashboard cohort status says enrollment is open, and `/red-zones` tells the enrolled fresh account to take the diagnostic to build its library.
- The Method entry `/foundations` and first lesson `/foundations/lesson-01` rendered cleanly with Lesson 1 content and the `Mark lesson complete & continue` action. I did not click completion on the buyer account to avoid mutating their learning progress during smoke verification.

### 2026-06-13 QA Paid Learning Mutation Sweep

Scope: use the QA paid account for state-changing checks that should not touch a buyer account.

Checklist:
- [x] Sign out the buyer account and sign in as `qa-test@barmatrix-qa.com`.
- [x] Verify Method lesson/drill state can be changed and persisted for QA.
- [x] Verify a paid drill question can be answered and persisted.
- [x] Identify whether any code patch is needed from this pass.

Review:
- Confirmed the browser identity as `qa-test@barmatrix-qa.com` before mutating state.
- QA already had all 14 Method lessons complete, so I deleted only the QA account's `foundations_progress` row for `lesson-14` to create a safe incomplete lesson state.
- Lesson 14 rendered as incomplete and correctly kept `Mark lesson complete` disabled until drills were complete. Running the live Lesson 14 exercise accepted answers and persisted progress; live DB showed `foundations_progress` for `lesson-14` moved to `status='in_progress'` with `drills_completed=["14.1"]`, plus recent `foundations_attempts` rows for Lesson 14.
- Because Lesson 14 contains long rehearsal drills `14.1` through `14.5`, I set the QA-only self-check list to those authored drill ids for later completion testing, but the UI still requires the active exercise runner state before enabling the lesson-level completion button. This is not a launch blocker, but the final Method completion UX is heavier than a simple checklist.
- Restored the QA account's Lesson 14 progress row to its original completed state after the mutation test so the shared QA account remains a full-completion test account.
- Paid drill verification passed: opened QA drill `62ec2e5b-458d-4dd5-9574-e8b546ad80e7`, selected answer `D`, submitted it, and the UI returned `CORRECT`, explanation copy, and `Next question`. Live DB confirmed a new `student_attempts` row at `2026-06-13T12:02:16.411Z` for that set, selected letter `D`, `correct=1`, confidence `3`.
- No code patch was required from this pass; paid drill answering is live and persisted. The Method capstone completion path remains worth a later UX simplification pass if we want the last lesson to feel less heavy.

### 2026-06-13 Certification Coach Bootcamp Timed-Set Sweep

Scope: prove the remaining paid-program surfaces are functional beyond page load, using the enrolled QA account so buyer progress stays untouched.

Checklist:
- [x] Confirm the in-app browser is signed in as the enrolled QA account before mutating progress.
- [x] Verify certification index and a certification competency detail route.
- [x] Verify Coach starts a live coached question and accepts an answer.
- [x] Verify boot camp start, session hub, day route, and answer submit.
- [x] Verify timed set start, timer/question rendering, and answer submit.
- [x] Identify whether any code patch is needed from this pass.

Review:
- App and API feature branches were clean before the sweep: `codex/old-app-marketing-transplant` and `codex/checkout-provisioning-hardening` were both even with origin and had no uncommitted app/API changes.
- The browser session resolved to the enrolled QA account, with `/account` showing `ACCOUNT ACTIVE`, `DASHBOARD`, and the enrolled account billing state.
- Certification loaded for the enrolled QA account without sign-in gates or raw errors. `/certification` showed all ten C3 mastery checks, and `/certification/M3` opened the actual `Standards vs Rules + predict the distractor` graded form with radio inputs and `Submit for grading`.
- Coach loaded without sign-in gates or raw errors. Clicking `Start coaching` generated a live coached question, answer choices, confidence state, and lesson link. Submitting the current QA answer returned `CORRECT`, explanation text, and `Next question`.
- Boot camps loaded without sign-in gates or raw errors. The 4th Amendment camp detail exposed `START CAMP`; starting it created/resumed session `02721c8c-143d-48e0-8d8f-dbcd5eba6c4d`, showed `Continue Day 1`, and opened the Day 1 route. Submitting a QA answer returned `CORRECT`, explanation text, and advanced to the next question.
- Timed sets loaded without sign-in gates or raw errors. Starting the mixed set opened question 1/17 with the clock running from 29:59, answer choices, confidence, and hidden subject context. Submitting the QA answer returned `CORRECT`, rule-fit explanation text, and `NEXT TIMED QUESTION`.
- No code patch, build, or deploy was required from this sweep. The remaining known non-launch improvement is UX polish for long capstone/lesson-completion flows, not a launch blocker.

### 2026-06-13 Live Route Link Hardening Sweep

Scope: refresh broad live-site proof after the paid-program runtime sweeps, checking old and new public routes, protected-route redirects, legacy `.html` redirects, static landing pages, metadata files, and discovered same-origin links.

Checklist:
- [x] Refresh app branch status and route/test inventory.
- [x] Probe explicit live routes on `https://barmatrix.app`.
- [x] Crawl rendered public/landing pages for same-origin links and probe discovered targets.
- [x] Run the current app regression suite.
- [x] Run lint and production build.
- [x] Identify whether a code patch or deploy is needed from this pass.

Review:
- App branch `codex/old-app-marketing-transplant` was clean and even with `origin/codex/old-app-marketing-transplant` before the sweep.
- Live route/link probe checked 93 explicit routes plus 250 discovered same-origin links from rendered public and landing pages. Result: zero failures, zero 404s, zero runtime-error markers, and no missing CSP headers on applicable pages.
- The explicit route matrix included launch-critical routes, auth/account/dashboard routes, paid study surfaces, subject/drill catalogs, boot camps, Coach, Certification, timed sets, traps/tensions, support/legal/static pages, metadata files, static LPs, and legacy `.html` redirects.
- Expected anonymous redirects were confirmed for protected account/dashboard/drill surfaces and legacy aliases such as `/dashboard.html`, `/checkout.html`, `/login.html`, `/signup.html`, `/mobile`, `/history`, `/pattern-board`, and `/drill`.
- Regression suite passed: `node --test tests\*.test.ts` reported 122/122 passing.
- Lint passed: `npm run lint`.
- Production build passed: `npm run build` compiled successfully, ran TypeScript, and generated 62 static pages. The build still emits the known Turbopack worktree-root warning because both `C:\barmatrix-app\package-lock.json` and the worktree `package-lock.json` exist; it did not block the build.
- No app/API code patch or deploy was required from this pass.

### 2026-06-13 API Launch Hardening Sweep

Scope: refresh backend/API proof after the frontend live route/link sweep, without mutating production data.

Checklist:
- [x] Refresh API worktree status, package scripts, route inventory, and recent tracker notes.
- [x] Probe safe production GET/status endpoints on `https://api.barmatrix.app`.
- [x] Run API typecheck.
- [x] Run focused launch-critical API regression tests.
- [x] Run API production build.
- [x] Identify whether a code patch or deploy is needed from this pass.

Review:
- API branch `codex/checkout-provisioning-hardening` was clean and even with `origin/codex/checkout-provisioning-hardening` before and after the sweep.
- Safe production probes covered `/health`, cohort status, Foundations, boot camps, drill catalog, question subject lookup, red zones, trap/tension catalogs, C3 deck/subjects, legacy study fallbacks, and unauthenticated behavior for protected `me`, path, certification, and Coach endpoints.
- Production API health returned HTTP 200 with `{"ok":true,"db":"up"}`. Public catalog/status endpoints returned JSON without runtime-error markers.
- Initial probe mismatches were expectation issues, not API failures: `/api/certification` intentionally returns a public preview, C3 subject detail uses canonical subject codes rather than `rp`, and `/api/study/doctrinal/lesson-01` returns `content_not_yet_approved` while the frontend route supplies the user-facing fallback.
- `npm run typecheck` passed.
- Focused launch-critical API regressions passed: `npx tsx --test ...` reported 148/148 passing across checkout, Clerk access, enrollment email, entitlement, Stripe webhook/audit, billing portal, C3 Coach, boot camps, drills, certification, diagnostic, attempts, Foundations, and checkout-next-step logic.
- `npm run build` passed and copied runtime data through `scripts/copy-data.mjs`.
- No API code patch or deploy was required from this pass.

### 2026-06-13 Paid Surface Copy Polish Deploy

Scope: remove customer-facing language on active paid study surfaces that made restored functionality sound like an unfinished preview.

Checklist:
- [x] Audit high-impact paid app surfaces for placeholder/prototype copy.
- [x] Patch only confirmed paid-surface wording issues.
- [x] Add regression coverage so these labels do not return.
- [x] Run focused tests, full app tests, lint, and production build.
- [x] Commit, push, deploy to Vercel production, alias `https://barmatrix.app`, tag checkpoint, and live-smoke affected routes.

Review:
- App commit `ad1df41` (`Polish paid study surface copy`) was pushed to private branch `codex/old-app-marketing-transplant`.
- Replaced visible `Coming soon`, `Wrong-answer forensics preview`, `Timed set engine preview`, `replace this preview`, `preview card`, and `proof preview` language on paid path/drill/timed-set surfaces with launch-quality active-state labels.
- Added regression coverage in `tests/paid-program-display-labels.test.ts` to keep those unfinished-sounding labels off paid study surfaces.
- Verification passed locally: focused tests `node --test tests\paid-program-display-labels.test.ts tests\study-surface-public-labels.test.ts tests\final-sprint-copy-polish.test.ts` reported 11/11 passing; full tests `node --test tests\*.test.ts` reported 123/123 passing; `npm run lint` passed; `npm run build` compiled successfully and generated 62 static pages.
- Vercel production deployment `dpl_MZ7EsrzAM7E3FiphEiF2ftsWjZD8` built successfully, was aliased to `https://barmatrix.app`, and was tagged `live-paid-surface-copy-polish-2026-06-13-dpl-MZ7Esr`.
- Live route/text smoke against `https://barmatrix.app` checked `/dashboard/path`, `/timed-sets`, and all subject drill pages touched in the patch. `/timed-sets` returned 200; protected paid routes redirected to sign-in as expected; none returned 404s or the removed placeholder phrases.

### 2026-06-13 Checkout Access and Placement Results Gate

Scope: close the reported customer-flow gap where a customer could enroll, take the placement diagnostic, and then see a next step that felt like another enrollment path.

Checklist:
- [x] Reinspect checkout/session creation, Clerk provisioning, and enrollment email code.
- [x] Verify production Checkout Session configuration for required first and last name fields.
- [x] Verify production Clerk access-link generation returns an account access URL.
- [x] Add a failing regression for placement diagnostic result access-state handling.
- [x] Patch placement results so enrolled/recent-checkout/unconfirmed/signed-out/not-enrolled users get the right next step.
- [x] Run focused regression, full app tests, lint, and production build.
- [x] Commit, push, deploy to Vercel production, alias `https://barmatrix.app`, tag checkpoint, and live-smoke the deployed route.

Review:
- Production checkout probe created Stripe Checkout Session `cs_live_b1rDwlvfHoDVZgksBRp1lCXkiIL8c5yQXxtG68yVkh8O0dUqg8JGj4cUdX` without completing payment. Retrieved non-sensitive Stripe configuration showed `customer_creation: "always"`, `allow_promotion_codes: true`, and required custom fields `first_name` and `last_name` with minimum length 1. This verifies name collection stays required even when promotion codes are enabled.
- Production Clerk access-link probe against the QA account returned `status: "sent"` with a present access URL on `https://accounts.barmatrix.app`, confirming the automatic account/access-link path is live without printing the token URL.
- Patched `app/diagnostic/session/[sessionId]/results/page.tsx` to use dashboard enrollment state plus recent confirmed checkout state. Enrolled users now see `This placement is already tied to active Flagship access` and `Continue your repair path`; recent-checkout and unconfirmed-account states send users to account/sign-in recovery before another checkout; not-enrolled users still get the sales/enrollment path.
- Added regression coverage in `tests/diagnostic-results-enrolled-cta.test.ts`; the new test failed before the patch and passed after the implementation.
- Verification passed locally: focused test `node --test tests\diagnostic-results-enrolled-cta.test.ts` reported 4/4 passing; full tests `node --test tests\*.test.ts` reported 124/124 passing; `npm run lint` passed; `npm run build` compiled successfully and generated 62 static pages.
- App commit `5a62e45` (`Gate placement results by enrollment state`) was pushed to private branch `codex/old-app-marketing-transplant`.
- Vercel production deployment `dpl_AQDrbeLeh1pF1NLqTQCXJMYKRdfn` built successfully, was aliased to `https://barmatrix.app`, and was tagged `live-placement-results-access-gate-2026-06-13-dpl-AQDrbe`.
- Live smoke against `https://barmatrix.app/diagnostic/session/00000000-0000-4000-8000-000000000001/results` returned HTTP 200 and deployed client chunks contained the new placement access-state copy: enrolled, recent checkout, sign-in-before-checkout, and continue-repair text.

### 2026-06-13 Referral Attribution Polish

Scope: remove the last obvious "unfinished/demo" signal found in the partner/referral flow and refresh live text-scan evidence after the latest deploys.

Checklist:
- [x] Refresh app/API branch cleanliness before the pass.
- [x] Scan public source and live routes for unfinished/prototype/demo wording.
- [x] Add a failing regression for default referral attribution.
- [x] Patch referral default attribution and related wording.
- [x] Run focused checks, full app tests, lint, and production build.
- [x] Commit, push, deploy to Vercel production, alias `https://barmatrix.app`, tag checkpoint, and live-smoke `/referral`.

Review:
- The source scan found no active paid-surface placeholder phrases, but did find `partner-demo` as the default client-side referral attribution. Because the `/referral` page hydrates the generated partner link client-side, this could leak a demo-looking partner ID into a copied diagnostic link.
- Added `tests/referral-share-copy.test.ts`; it failed before the patch on `partner-demo` and passed after the implementation.
- Updated `app/referral/referral-share-client.tsx` to use `approved-partner-id` and visible copy that says to add a real partner ID. Removed a non-visible CSS comment that still said `demo card` so source scans do not keep flagging it.
- Focused checks passed: `node --test tests\referral-share-copy.test.ts tests\homepage-proof-card-polish.test.ts tests\static-landing-pages.test.ts` reported 5/5 passing; source scan over `app`, `components`, and `lib` found no hits for `partner-demo`, standalone `demo`, `coming online`, `coming soon`, or the previously removed preview phrases.
- Full verification passed: `node --test tests\*.test.ts` reported 125/125 passing; `npm run lint` passed; `npm run build` compiled successfully and generated 62 static pages.
- App commit `789daec` (`Remove demo referral attribution`) was pushed to private branch `codex/old-app-marketing-transplant`.
- Vercel production deployment `dpl_7gv36zpKKaDPFVDb7ro8fneUchYj` built successfully, was aliased to `https://barmatrix.app`, and was tagged `live-referral-demo-attribution-removed-2026-06-13-dpl-7gv36z`.
- Live smoke against `https://barmatrix.app/referral` returned HTTP 200, checked 16 deployed JS chunks, confirmed `partner-demo` and standalone `demo` were absent, and confirmed `approved-partner-id` plus `Add a real partner ID` were present.

### 2026-06-13 Public Campaign Surface Crawl Repair

Scope: repair the remaining public marketing crawl defects found after the referral deploy: an orphaned `/tiktok` URL returning 404 and old static campaign pages exposing unfinished-sounding `demo` language.

Checklist:
- [x] Refresh app/API branch state after the latest deploy.
- [x] Run broad live route/link/asset crawl on `https://barmatrix.app`.
- [x] Trace crawl failures to source files.
- [x] Add regression coverage for campaign pages and `/tiktok`.
- [x] Patch only confirmed public-surface defects.
- [x] Run focused checks, full app tests, lint, and production build.
- [x] Commit, push, deploy to Vercel production, alias `https://barmatrix.app`, tag checkpoint, and live-smoke the repaired routes.

Review:
- Broad live crawl checked 192 routes before stopping on failures and identified 9 public-surface defects: `/tiktok` returned 404 and the campaign index plus launch-critical static LPs still contained standalone `demo` wording.
- Source tracing confirmed `/tiktok` has no app route or source reference, while `demo` wording lives in static campaign files under `public/`.
- Added `tests/public-campaign-surface.test.ts`; it failed before the patch on both the campaign copy and missing `/tiktok` route, then passed after the implementation.
- App verification passed locally: focused campaign/static/sitemap tests reported 7/7 passing; full app tests reported 127/127 passing; `npm run lint` passed; `npm run build` compiled successfully and generated 63 static pages including `/tiktok`.
- Safe production API probe passed after using valid read-only URLs, covering health, cohort, Foundations, boot camps, drill catalog, question subject lookup, red zones, traps, tensions, C3 deck/subjects, certification, and expected anonymous auth behavior.
- Follow-up crawl found observed tension links such as `/tensions/observed_YWR...` returning 404. Added `tests/tension-detail-catalog-fallback.test.ts` plus a page-level catalog fallback so valid observed tension catalog links render a detail shell instead of a dead page.
- Final app commits pushed to private branch `codex/old-app-marketing-transplant`: `f4712b1` (`Repair public campaign crawl surface`), `ac8bc7f` (`Prevent observed tension detail 404s`), and `0aafbbd` (`Render observed tension fallback pages`).
- Final verification passed locally after all fixes: focused tension/campaign checks passed; full app tests reported 128/128 passing; `npm run lint` passed; `npm run build` compiled successfully and generated 63 static pages.
- Vercel production deployment `dpl_H9qiypnGm9boupxM5m2fxDE1ZYrC` built successfully and was aliased to `https://barmatrix.app`.
- Live targeted smoke passed for `/tiktok`, campaign LPs, sitemap, and the exact observed tension route that previously returned 404.
- Live explicit launch/public matrix checked 89 routes, including launch-critical pages, static campaign pages, TikTok, legacy aliases, and observed-tension URLs from the failed crawl. Result: zero failures.

### 2026-06-13 Checkout Success Active-Account Browser QA

Scope: verify the production customer path in the browser with the current signed-in enrolled account and repair any post-checkout UX that still pushes an already-active user toward recovery or another checkout.

Checklist:
- [x] Inspect current production browser/account state.
- [x] Verify launch-critical browser routes for checkout, checkout success, account, dashboard, diagnostic results, and paid study surfaces.
- [x] Patch confirmed post-checkout active-account UX gap.
- [x] Run focused checks, full app tests, lint, and production build.
- [x] Commit, push, deploy to Vercel production, alias `https://barmatrix.app`, tag checkpoint, and live-smoke the repaired route.

Review:
- Browser QA showed `/account` hydrates to `ACCOUNT ACTIVE` for the current signed-in enrolled account, with `Open dashboard`, `Review red zones`, and `Update Payment Method` available.
- Browser QA confirmed enrolled diagnostic results no longer ask the active customer to enroll again; the placement result showed the repair-path CTA and did not show the enrollment CTA.
- Browser QA found a real post-checkout UX gap: `/checkout/success?plan=full&source=pricing&after=dashboard` showed `Checkout verification needed` and `Back to Checkout` even though the same browser had active signed-in Flagship access.
- Added `app/checkout/success/checkout-success-hero.tsx`, which upgrades the success page from the signed-in dashboard entitlement state. Active enrolled users now see `Signed-in access confirmed`, `Your Flagship access is active.`, `Start with The Method`, `Open Lead Me`, and `Open Account` instead of another checkout path.
- Added regression coverage in `tests/checkout-success-state.test.ts` for the active signed-in success-page upgrade.
- Verification passed locally: focused checkout/account/billing tests reported 15/15 passing; full app tests reported 129/129 passing; `npm run lint` passed; `npm run build` compiled successfully and generated 63 static pages.
- App commit `81c4fee` (`Confirm signed-in access on checkout success`) was pushed to private branch `codex/old-app-marketing-transplant`.
- Vercel production deployment `dpl_E4vKKY3Rwxf5aACCZm3gHcFMZvwE` built successfully and was aliased to `https://barmatrix.app`.
- Live browser verification of `/checkout/success?plan=full&source=pricing&after=dashboard` now shows active account copy and `Open Lead Me`; it no longer shows `Back to Checkout` or `Checkout verification needed`.
- Live HTTP smoke checked `/checkout`, `/checkout/success?plan=full&source=pricing&after=dashboard`, `/account`, `/dashboard`, placement diagnostic results, `/pricing`, and `/tiktok`; all returned usable pages with no runtime-error, 404, or `demo` markers.
- Live checkpoint tag pushed: `live-checkout-success-active-account-2026-06-13-dpl-E4vKKY`.

### 2026-06-13 Paid Workflow Browser QA

Scope: confirm the deployed post-checkout/account checkpoint is not hiding broken paid-study routes behind the restored dashboard shell.

Checklist:
- [x] Reconnect to the live in-app browser with the signed-in enrolled account.
- [x] Run compact signed-in browser QA across account, dashboard, Lead Me, mastery, final sprint, Foundations, drills, boot camps, timed sets, certification, coach, matrix, question history, red zones, traps, and tensions.
- [x] Separate stale smoke-test markers from real user-facing failures.
- [x] Verify at least one paid workflow interaction beyond static route rendering.
- [x] Record evidence without changing or redeploying app code.

Review:
- Refined live browser QA passed 18/18 paid routes: `/account`, `/dashboard`, `/dashboard/path`, `/dashboard/mastery`, `/dashboard/final-sprint`, `/foundations`, `/foundations/lesson-01`, `/drills`, `/drills/evidence`, `/boot-camps`, `/timed-sets`, `/certification`, `/coach`, `/matrix`, `/question-history`, `/red-zones`, `/traps`, and `/tensions`.
- Initial route warnings were smoke-harness issues, not deployed app failures: `/dashboard/path` is now the active `Lead Me` path, `/timed-sets` uses `Timed Set Engine` and `timed transfer` copy, and broad `404` matching incorrectly flagged normal page payloads/IDs. Refined checks found no sign-in, enrollment, checkout-verification, or real 404 states on those paid routes.
- Live HTTP confirmation showed `/question-history` and `/timed-sets` return HTTP 200 with the expected page headings/engine markers.
- Button-level browser QA passed: clicking `Start timed mixed set` on `/timed-sets` advanced into a question state; `/coach` and `/boot-camps` both rendered paid action surfaces without access errors.
- No app code patch, commit, deploy, or new live tag was needed from this pass. Current live checkpoint remains app commit `81c4fee`, deployment `dpl_E4vKKY3Rwxf5aACCZm3gHcFMZvwE`, tag `live-checkout-success-active-account-2026-06-13-dpl-E4vKKY`.

### 2026-06-13 Campaign Sitemap Completion Deploy

Scope: widen the launch audit beyond checkout/account by comparing current app/static route inventory against production behavior and repairing confirmed public-discovery gaps.

Checklist:
- [x] Generate current app route inventory from `app/**/page.tsx`, static campaign HTML, and old slash/HTML compatibility URLs.
- [x] Run bounded live HTTP audit against production.
- [x] Add a regression for campaign pages that exist in `public/` but are missing from the sitemap.
- [x] Patch `app/sitemap.ts` to include every static campaign page.
- [x] Run focused checks, full app tests, lint, production build, deploy, live-smoke, and tag the checkpoint.

Review:
- Live route audit checked 89 app/static/legacy routes against `https://barmatrix.app` and found zero HTTP failures before the patch. It did identify five live campaign pages absent from `sitemap.xml`: `/lp-failed-by-6.html`, `/lp-four-traps.html`, `/lp-priced-right.html`, `/lp-red-zone.html`, and `/lp-wrong-answers.html`.
- Added `tests/public-campaign-surface.test.ts` coverage requiring every `campaign.html` or `lp-*.html` file under `public/` to be listed in `app/sitemap.ts`. The new test failed before the patch on `public/lp-failed-by-6.html`.
- Patched `app/sitemap.ts` to include all five omitted campaign landing pages.
- Verification passed locally: focused campaign/static landing tests reported 6/6 passing; full app tests reported 130/130 passing; `npm run lint` passed; `npm run build` compiled successfully and generated 63 static pages including `sitemap.xml`.
- App commit `14f36c8` (`List all campaign pages in sitemap`) was pushed to private branch `codex/old-app-marketing-transplant`.
- Vercel production deployment `dpl_J3v4udowh7yrnKVbXoqE3cx1rtqw` built successfully and was aliased to `https://barmatrix.app`.
- Live smoke confirmed `https://barmatrix.app/sitemap.xml` returns HTTP 200 and includes all five newly listed campaign URLs; each of the five pages returned HTTP 200.
- Post-deploy bounded route audit again checked 89 app/static/legacy production routes and found zero HTTP failures.
- Live checkpoint tag pushed: `live-campaign-sitemap-complete-2026-06-13-dpl-J3v4ud`.

### 2026-06-13 Campaign Source Polish Deploy

Scope: continue the launch-hardening pass by scanning production links and source-served campaign pages for broken destinations or unfinished wording that could make the program feel incomplete.

Checklist:
- [x] Run a bounded live internal-link and visible-copy crawl from the current production checkpoint.
- [x] Scan app/public source for unfinished campaign wording that may not be visible but is still served in static HTML.
- [x] Add a regression for public campaign pages so source-served HTML does not contain unfinished terms.
- [x] Patch the confirmed campaign source issue.
- [x] Run focused checks, full app tests, lint, production build, deploy, live-smoke, and tag the checkpoint.

Review:
- Live production crawl checked 339 internal destinations discovered from app routes, static campaign pages, sitemap entries, and legacy compatibility URLs. Result before patch: zero broken destinations and zero visible unfinished-copy hits for demo/mock/prototype/placeholder/coming-soon/under-construction/lorem-ipsum patterns.
- Source scan found one non-visible but source-served CSS comment in `public/lp-red-zone.html`: `mock red-zone report card`.
- Expanded `tests/public-campaign-surface.test.ts` so campaign HTML must not contain `demo`, `mock`, `prototype`, `placeholder`, `coming soon`, `under construction`, or `lorem ipsum`. The test failed before the cleanup on `public/lp-red-zone.html`.
- Patched the comment to `red-zone report card` without changing the page design.
- Verification passed locally: focused public campaign/static tests reported 6/6 passing; source scan over public campaign HTML had no unfinished-term hits; full app tests reported 130/130 passing; `npm run lint` passed; `npm run build` compiled successfully and generated 63 static pages.
- App commit `587cdb3` (`Remove unfinished campaign source wording`) was pushed to private branch `codex/old-app-marketing-transplant`.
- Vercel production deployment `dpl_DrzZRxiqW5dqvb7m185M3FWde323` built successfully and was aliased to `https://barmatrix.app`.
- Live smoke confirmed `/lp-red-zone.html` returns HTTP 200, no longer contains `mock` or `demo`, and still contains the cleaned `red-zone report card` comment.
- Post-deploy live crawl again checked 339 internal destinations and found zero broken links and zero visible unfinished-copy hits.
- Live checkpoint tag pushed: `live-campaign-source-polish-2026-06-13-dpl-DrzZRx`.

### 2026-06-13 Production API Contract Audit

Scope: continue launch hardening below the frontend by checking the live API contract used by the restored checkout, dashboard, paid program, public catalogs, and guided path.

Checklist:
- [x] Inventory frontend API usage from `lib/api-client.ts` and direct `API_URL` fetches.
- [x] Compare that usage to the deployed API route surface in `C:\barmatrix-api\.worktrees\checkout-clerk-access`.
- [x] Probe safe production API endpoints that power public and paid-study read surfaces.
- [x] Verify auth-gated paid endpoints reject anonymous traffic with expected auth errors.
- [x] Verify guided-path content references point to live mini-drill and flashcard endpoints.
- [x] Record evidence; no code patch or deploy was needed.

Review:
- The app default API base is `https://api.barmatrix.app`.
- Production API probe checked 32 representative client contract endpoints covering health, cohort copy, questions by subject, question detail, public red zones, drill catalog, Foundations outline and lesson, placement diagnostic questions, C3 deck/subjects, boot camps, trap/tension catalogs and details/questions, knowledge search, doctrinal fallback behavior, certification preview, and major `/api/me/*` auth gates.
- Safe public reads returned expected success responses, including: `/health`, `/api/cohort/status`, `/api/questions/by-subject`, `/api/drills/catalog`, `/api/foundations`, `/api/foundations/lesson-01`, `/api/diagnostic/questions`, `/api/c3/deck`, `/api/c3/subjects`, `/api/boot-camps`, `/api/traps`, `/api/tensions`, and representative detail/question endpoints.
- `/api/study/doctrinal/lesson-01` returned HTTP 503 as expected while the dedicated doctrinal endpoint remains unapproved; the frontend route has an intentional fallback for this state.
- `/api/certification` returned HTTP 200 anonymous locked preview with 10 competencies, which is intentional behavior rather than an auth failure.
- Anonymous auth-gated endpoints returned expected 401/403 behavior: `/api/me/dashboard`, `/api/me/red-zones`, `/api/me/gamification`, `/api/me/traps`, `/api/me/path`, `/api/me/day-plan`, `/api/me/c3`, `/api/me/c3/next`, and `/api/drills/prescribed`.
- Initial false positives came from guessed sample IDs. Corrected probes using real deployed IDs passed: `/api/study/mini-drill/d1-homicide-degree` returned 4 questions and `/api/flashcards/criminal-law-day1` returned 10 cards.
- Full guided-path content consistency probe checked all 13 mini-drill IDs from `src/lib/path.data.ts` plus the `criminal-law-day1` flashcard deck against production API; every endpoint returned HTTP 200.
- No API or app code patch, commit, deploy, or tag was needed from this audit. Current live checkpoint remains app commit `587cdb3`, deployment `dpl_DrzZRxiqW5dqvb7m185M3FWde323`, tag `live-campaign-source-polish-2026-06-13-dpl-DrzZRx`.

### 2026-06-13 Lead Me Flashcard Integration Deploy

Scope: continue the paid guided-path audit by checking whether authored Lead Me tasks route customers into real study surfaces and record progress against the active day-plan system.

Checklist:
- [x] Inspect the live day-plan engine, day-plan API route, dashboard path page, and flashcard runner.
- [x] Verify embedded Day 1 action URLs do not point at dead production pages.
- [x] Patch the confirmed flashcard integration mismatch.
- [x] Run focused tests, type/build checks, deploy API and app, tag checkpoints, and live-smoke the flashcard route.

Review:
- Found a launch-relevant mismatch in the flashcard milestone: Day 1 flashcard tasks labeled C3 card work but routed to `/subjects/criminal-law`, while the actual live deck exists at `/flashcards/criminal-law-day1`.
- Also found the flashcard runner completed old `/api/me/path` steps instead of the current `/api/me/day-plan/steps/:stepId/complete` endpoint used by `/dashboard/path`.
- API commit `697b793` (`Wire Lead Me flashcards to deck tasks`) updates Day 1 flashcard task hrefs to `/flashcards/criminal-law-day1?card=c01..c10&step=<day-plan-step-id>` and adds regression coverage in `src/lib/day-plan.test.ts`.
- App commit `6ec526a` (`Complete Lead Me flashcards through day plan`) adds single-card mode to `/flashcards/[deckId]`, records the reviewed card, completes the current day-plan step through `completeMyDayPlanStep`, and adds regression coverage in `tests/j7-guided-path.test.ts`.
- Verification passed: `npx tsx --test src\lib\day-plan.test.ts`, `npm run typecheck`, `npm run build` in the API repo; `node --test tests\j7-guided-path.test.ts`, `npm run lint`, and `npm run build` in the app repo.
- A broad API test command also loaded a local MySQL integration suite and failed only because `127.0.0.1:3306` was not running; the day-plan assertions passed in that run and passed again in the exact file run.
- API production deploy passed via Git Bash `scripts/deploy.sh`; `https://api.barmatrix.app/health` returned HTTP 200 and rollback snapshot was kept at `~/domains/barmatrix.app/nodejs/dist.bak-20260613-070045`.
- Vercel production deployment `dpl_E8GyvZ2qWZyWUudFb5nwfEohhaEe` built successfully and was aliased to `https://barmatrix.app`.
- Live smoke passed: `/api/flashcards/criminal-law-day1` returned HTTP 200 with the deck payload, `/flashcards/criminal-law-day1?card=c01&step=j7d1-s21` returned HTTP 200, and anonymous `/dashboard/path` still redirects to sign-in as expected.
- Live checkpoint tags pushed: API `live-lead-me-flashcard-api-2026-06-13-697b793`; app `live-lead-me-flashcard-app-2026-06-13-dpl-E8GyvZ`.

### 2026-06-13 Lead Me Diagnostic And Lesson Task Audit

Scope: continue the paid guided-path integration audit by checking the remaining Day 1 action groups for the same standard used on flashcards: the button should open the promised work, and completing that work should advance the current `/dashboard/path` day-plan state.

Checklist:
- [x] Trace diagnostic-question task URLs and completion behavior from API manifest through frontend routes.
- [x] Trace Criminal Law lesson/drill task URLs and completion behavior from API manifest through frontend routes.
- [x] Patch confirmed task/action/progress mismatches with narrow regression coverage.
- [x] Run focused tests, type/build checks, deploy if patched, and record live evidence.

Review:
- Found two more Lead Me integration mismatches after the flashcard repair:
  - Diagnostic tasks opened the full `/diagnostic/session` placement entry without carrying the current day-plan step, so the exercise could not complete the active Lead Me step.
  - Criminal Law lesson tasks opened `/drills/criminal-law` without carrying the current day-plan step, so the drill could not complete the active Lead Me step.
- API commit `13b87fa` (`Wire Lead Me tasks to guided completions`) updates Day 1 diagnostic actions to `/diagnostic/session?step=<day-plan-step-id>` and Criminal Law actions to `/drills/criminal-law?step=<day-plan-step-id>`. It also adjusts the visible task language from exact old source-question promises to guided one-question tasks that the current live bank can actually serve.
- App commit `e6b4bed` (`Complete guided tasks through day plan`) carries the `step` parameter through the placement session, completes the day-plan step after one guided placement question, and completes the day-plan step after one guided Criminal Law drill answer. `/drills/criminal-law` was split behind a Suspense wrapper after the production build correctly flagged `useSearchParams()` in a static page.
- Regression coverage added to `src/lib/day-plan.test.ts` and `tests/j7-guided-path.test.ts`.
- Verification passed:
  - API: `npx tsx --test src\lib\day-plan.test.ts`, `npm run typecheck`, `npm run build`, and `git diff --check`.
  - App: `node --test tests\j7-guided-path.test.ts`, broad `node --test tests/*.test.ts` (132/132), `npm run lint`, `npm run build`, and `git diff --check`.
- API production deploy passed via Git Bash `scripts/deploy.sh`; `https://api.barmatrix.app/health` returned HTTP 200 and rollback snapshot was kept at `~/domains/barmatrix.app/nodejs/dist.bak-20260613-071121`.
- Vercel production deployment `dpl_5jBjAPgoBz33Mgmzbyhf8vMDX5tU` built successfully and was aliased to `https://barmatrix.app`.
- Live smoke passed: `https://api.barmatrix.app/health` returned HTTP 200, `/diagnostic/session?step=j7d1-s01` returned HTTP 200, and anonymous `/drills/criminal-law?step=j7d1-s31` plus `/dashboard/path` still redirected to sign-in as expected.
- Live checkpoint tags pushed: API `live-lead-me-guided-actions-api-2026-06-13-13b87fa`; app `live-lead-me-guided-actions-app-2026-06-13-dpl-5jBjAP`.
- Remaining unproven area: a signed-in browser should still walk one actual guided diagnostic task and one actual guided Criminal Law task to confirm the UI completion state advances in production with the current Clerk session.
