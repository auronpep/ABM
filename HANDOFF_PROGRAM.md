# HANDOFF — The Program: what the first buyer sees and does after purchase

**Written:** 2026-06-11, immediately after live Stripe was restored and verified.
**Mission for the next session:** build the post-purchase experience — the
Day-1 buyer journey and the working program loop (drill → retest → visible
repair) — so that sale #1 lands in a product, not a dead end.
**Primary spec:** `handoffs/P1_DAY_ONE_EXPERIENCE.md` (now copied into this
repo, with all other packets, under `handoffs/`).

---

## 1. State of the world (verified, not assumed)

### What is LIVE on barmatrix.app right now (this repo, C:\ABM)

- Vite + React 18 + TS static SPA, hash routing (`#/welcome`, `#/prayer-chain`,
  state routes for home/diagnostic/drills/pricing/method). Deployed on Vercel
  project `barmatrix-app` (team `sunnylee`).
- The sale-one funnel (commits `fe0fe3a`, `58b0b6c`): mini-diagnostic hero →
  18-question diagnostic (curated from the 81-question qdata bank) → Red-Zone
  verdict + checkout bridge → **real Stripe hosted checkout**.
- **Stripe is LIVE and verified end-to-end**: `public/checkout.html` POSTs to
  `https://api.barmatrix.app/api/checkout/create-session`
  (`payment_plan: "pay_in_full" | "two_pay_500_499"`) → redirects to
  `checkout.stripe.com` (verified with a real browser; $500 2-pay session).
  - `success_url` = `https://barmatrix.app/?purchase=success#/welcome`
  - `cancel_url`  = `https://barmatrix.app/checkout.html?cancelled=1&plan=…`
- `#/welcome` (src/pages/Welcome.tsx) implements P1 §1 choreography:
  "You're in." → July 2026 cohort → #1 red-zone nameplate (read from
  `localStorage.bm_redzone_map`, written by the diagnostic) → one button
  "Start the first repair" → currently routes to the **generic** Drill
  library. No-diagnostic fallback routes into the diagnostic.
- Drill player (src/pages/Drill.tsx): 81 live questions from
  `public/qdata/CQ*.json`, each with full TEAR forensics, per-choice molds
  (`choiceSignals`), gold/silver keys, remediation card, recovery paths.
- Zone synthesis (src/funnel/zones.ts): groups misses by
  (filter_broken, mold) → named Red Zones with verdict templates.
- Events util (src/lib/events.ts): typed `track()` + UTM passthrough +
  no-PII guard. Buffers locally; POSTs to PostHog only if `VITE_POSTHOG_KEY`
  is set (it is NOT set yet).

### The deeper truth the next session must internalize

**This static site is the marketing/funnel shell. The real product backend
already exists** in `C:\barmatrix-api` (Node/Express on Hostinger at
`api.barmatrix.app` — LIVE, healthy, CORS already allows
`https://barmatrix.app`). It has, already built and in production:

- Stripe webhook fulfillment (`checkout.session.completed` → entitlement
  grant, cohort seat, server-side purchase handling) — `src/index.ts` ~line
  298, `src/entitlement.ts`.
- **`/api/me/day-plan` routes** (`src/routes/me-day-plan.js` import; commit
  "Add J7 day-plan API" 2026-06-09) — a next-action engine ALREADY exists
  server-side. Inspect before building any client-side scheduler.
- Drill/program machinery: `src/lib/c3-drill.ts`, `c3-bandit.ts` (adaptive
  selection), `bootcamps.ts`, `c3-coach-queries.ts`, diagnostic contracts,
  billing portal, enrollment recovery.
- The old Next.js frontend (`C:\barmatrix-app`, branch `feat/ambassador-launch`,
  DIRTY founder-owned tree — read-only reference) has working clients for all
  of it: `lib/api-client.ts` (~2000 lines: auth pattern, dashboard, day-plan,
  drills), `app/account/`, `app/dashboard/`, `app/checkout/success/`.

**So the architecture question for the program is NOT "build a program from
scratch" — it is "reconnect the existing program backend to the new shell."**
The old dashboard UI was Clerk-authed (`@clerk/nextjs`). Find out how
api.barmatrix.app authenticates (`grep -n "clerk\|auth\|bearer" C:\barmatrix-api\src\index.ts`)
before designing login. `public/login.html` exists on the live site — read it
first; it may already hold the auth pattern.

## 2. The job: P1 made real (read `handoffs/P1_DAY_ONE_EXPERIENCE.md` first)

The buyer's first hour, in order of build priority:

1. **Stripe return → /welcome with THEIR map.** Works today only if they
   bought in the same browser as their diagnostic (localStorage). P1 §3 wants
   real linkage: pass `diagnostic_id` into checkout session metadata
   (the API's `create-session` body already accepts
   `diagnostic_id: uuid | null` — checkout.html currently sends none because
   the static diagnostic has no server-side UUID). Decide: either (a) keep
   browser-local linkage for cohort #1 and verify the no-diagnostic fallback
   hard, or (b) wire the static diagnostic to the API's diagnostic-session
   endpoints (they exist — `diagnostic-contract.ts` in the API) so linkage
   survives device changes. (b) is the durable path.
2. **The first repair loop (P1 §2) — the product's first proof:**
   - 4–6 drills auto-assigned from the buyer's #1 red zone. The qdata bank
     already carries everything needed to filter by trap family
     (`choiceSignals[].mold` + filter derived via
     `src/content/curated-diagnostic.ts: filterForMold`). Exclude questions
     already seen in the diagnostic (qids are in `bm_redzone_map.misses`).
   - Then a 3-question TIMED retest from the same (filter, mold) family,
     different questions.
   - Pass → repair moment: zone chip vermilion → brass with the stamp
     animation (motion vocabulary already in `src/styles/funnel.css`:
     `.bm-stamp`, brass/vermilion tokens) + line: "Repaired — for now. We
     retest it again in 4 days to make sure it holds." Schedule the spaced
     retest (localStorage date at minimum; API day-plan if wired).
   - Miss → NO shame state: "Still live. Here's the move again:
     {silver_key_move}" + 2 more drills + immediate re-offer.
3. **Day 2–7 next-action engine (P1 §5):** exactly ONE primary action,
   strict priority: overdue spaced retest → drills on hottest live zone →
   timed mixed set → next zone. Server-side `/api/me/day-plan` may already
   BE this — inspect before writing it.
4. **Welcome email (P1 §4):** build dark behind a flag; send QA mail first to
   `codex@barmatrix.app`, the BarMatrix test/catchall mailbox. Mailbox
   settings are in `C:\Users\JesusLovesMe\.env`; the password key is
   `CODEX_EMAIL_PASSWORD` and must not be printed or committed. Subject "Your
   Red-Zone map is ready". Lives in
   barmatrix-api (`src/email.ts` exists, with a dark Day-1 trap-naming job
   already in the codebase).
5. **Events (P1 §7):** extend `src/lib/events.ts` types:
   `first_drill_complete`, `first_retest_complete` (zone, passed),
   `zone_repaired` (zone, attempt_n). `first_login` already fires on
   /welcome. North star: % of buyers with `zone_repaired` within 24h ≥ 70%.

## 3. Hard constraints and gates (unchanged)

- `C:\BMO` READ-ONLY. `C:\barmatrix-app` + `C:\barmatrix-api` have DIRTY
  founder-owned trees — read freely, NEVER commit/revert/checkout there. If
  API changes are needed, surface the exact diff to the founder instead.
- NO live-DB migrations/writes without founder approval + fresh backup.
- NO changes to Stripe products/prices/keys/webhook config. The checkout
  session endpoint is reused as-is.
- Attorney gate **L-2 is still open**: the 3 mini-diagnostic seed questions
  (`src/funnel/questions.seed.json`) await attorney confirmation; decisions
  go in `work/review_decisions.csv`, then re-run
  `PYTHONUTF8=1 uv run --no-project python scripts/review_ledger.py`.
- The founder DISCARDED the blocked-strings drift gate (2026-06-10): legal +
  copywriting audit the live site directly. `npm run drift` exists but does
  not block builds. Do NOT re-add guardrail language to copy
  (memory: no-guardrails-in-content).
- Sanctuary rules for program UX: no streaks, no guilt, no "falling behind"
  framing. Spaced retests invite; they never shame.

## 4. Working facts (environment)

- Build: `npm run build` (= contract check + tsc + vite). Dev: `npm run dev`
  (preview launch config `barmatrix-dev`, port 5173).
- Deploy: `vercel deploy --prod --archive=tgz` from C:\ABM (plain upload
  aborts on this box; `--archive=tgz` is required). Preview deploy = same
  without `--prod`. Vercel CLI is logged in (team `sunnylee`).
- Local browser testing of API calls fails CORS (localhost:5173 not in the
  API allowlist) — that is expected; verify API-touching flows on the live
  origin or a Vercel preview... NOTE: preview URLs are also not in the
  allowlist; only barmatrix.app works for browser→API tests.
- qdata regeneration: drop `CQ*.md` into `C:\CCG\Finished\`, run
  `scripts/build_qdata.py`, rebuild, redeploy.
- Analytics: set `VITE_POSTHOG_KEY` in Vercel env to activate event
  shipping; then save the funnel view (handoffs/04 §5).
- Git identity auronpep; commit small, conventional messages; main branch.

## 5. Suggested first five actions for the new session

1. Read `handoffs/P1_DAY_ONE_EXPERIENCE.md`, then this file's §2.
2. Read `public/login.html` + grep barmatrix-api for its auth mechanism and
   the `/api/me/day-plan` route shape (`C:\barmatrix-api\src\routes\`,
   `src/lib/c3-drill.ts`, `src/entitlement.ts`). Decide: client-local
   program v1 vs API-connected program v1. Write the decision into
   PROGRESS.md before coding.
3. Build the first repair loop against the qdata bank (works without any
   backend — pure win either way).
4. Upgrade /welcome → "Start the first repair" to enter that loop scoped to
   the buyer's #1 zone (not the generic drill library).
5. Verify in the browser end-to-end: diagnostic → (simulated) purchase
   return → /welcome → first repair loop → repair stamp → spaced retest
   scheduled. Screenshot the repair moment. Then update PROGRESS.md /
   APPROVALS_NEEDED.md and stop for founder review before deploying program
   surfaces.

## 6. Docs map

- `PROGRESS.md` — build log + how to resume. `CONFLICTS.md` — handoff vs
  repo reality (read §1, §4, §7). `APPROVALS_NEEDED.md` — founder queue
  (Stripe item RESOLVED; PostHog key, prayer-chain backend by Jul 13, email
  flows need dark-send verification through `codex@barmatrix.app`).
- `handoffs/` — all 11 original packets (00–06, P1–P4).
- `docs/` — reference docs: `LIVE_INFRASTRUCTURE.md` (the site↔API↔Stripe↔
  Clerk seam, code-verified readiness facts, full ops runbook),
  `CANON_REFERENCE.md` (authoritative product numbers/taxonomy from
  barmatrix-canon — use these in copy, not old-site figures), and
  `legacy-barmatrix-site/` (everything captured from the old site).
- `HANDOFF.md` — the older content/keys-consolidation handoff (separate
  workstream; don't confuse the two).
