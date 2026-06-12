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
