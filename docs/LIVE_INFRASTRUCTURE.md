# Live Infrastructure & the Paid-Customer Seam

What actually runs the paid program behind barmatrix.app, audited 2026-06-11 from `C:\barmatrix-api` and `C:\barmatrix-app` source. This is **current operational truth** (code-derived), complementing [HANDOFF_PROGRAM.md](../HANDOFF_PROGRAM.md) and [DAY1_READINESS.md](../DAY1_READINESS.md).

> Hard constraints still apply: `C:\barmatrix-app` and `C:\barmatrix-api` are dirty founder-owned trees — read freely, never commit there; API changes ship as diffs to the founder. No Stripe/DB changes without approval.

---

## 1. The three pieces

| Piece | Repo | Stack | Where it runs |
|---|---|---|---|
| **Marketing/funnel/program shell** (LIVE site) | `C:\ABM` (this repo) | Vite + React 18 SPA | Vercel → `barmatrix.app` |
| **Backend API** | `C:\barmatrix-api` | Express + TS, MariaDB | Hostinger Passenger → `api.barmatrix.app` |
| **Old product app** (reference, not the live site) | `C:\barmatrix-app` | Next.js 16 + Clerk | Vercel (its own project); read-only reference for API clients |

The API is the shared spine: Stripe fulfillment, entitlements, question delivery, day-plan engine, drills/boot-camps/C3, red zones. The old Next.js app's `lib/api-client.ts` (~2,000 lines) is the working reference client for all of it.

## 2. The seam — how a paying customer gets the program (verified from code)

1. **Checkout**: site POSTs `POST /api/checkout/create-session` with `payment_plan: "pay_in_full" | "two_pay_500_499"` (+ optional `diagnostic_id`) → Stripe hosted checkout. `success_url = https://barmatrix.app/?purchase=success#/welcome`.
2. **Fulfillment**: Stripe webhook `checkout.session.completed` → `fulfillCheckoutSession()` (`src/entitlement.ts`): upserts `students` row by **email**, inserts `purchases` (entitlement_status `active`), assigns cohort seat, resolves referral attribution, sends enrollment email via Resend *(only if configured)*.
3. **Diagnostic claiming**: if `diagnostic_id` was in checkout metadata, `claimDiagnosticAttempts()` re-points pre-purchase anonymous attempts to the student and rebuilds `user_red_zones` — Day-1 map pre-populated. *(Our static diagnostic currently sends none — browser-local linkage only.)*
4. **Auth bridge**: every gated API call runs `requireEnrollment()`: Clerk JWT → `clerkClient.users.getUser()` → primary email → `students.email` lookup → join `purchases WHERE entitlement_status='active' AND refund_status='none'` → sets `res.locals.enrolledStudentId`.

### ⚠️ The Day-1 activation gap (the one to engineer around)
**Buying does NOT create a Clerk account.** The buyer must self-register at sign-up **with the exact same email used at checkout**, or every authed route 403s ("enrollment required"). The email *is* the join key. Until the founder-coordinated Clerk/linkage session happens, the live program is browser-local by design (per DAY1_READINESS §D) — this is the known constraint, not a surprise.

## 3. Facts that affect paid-program readiness (new, code-verified)

- **Promo codes**: `allow_promotion_codes` is enabled ONLY on `pay_in_full` (`C:\barmatrix-api\src\checkout.ts:53`); the 2-pay plan has no promo field. *(Already in DAY1_READINESS §B.)*
- **Cohort is hardcoded**: `"JULY_MBE_REPAIR"` in `src/config.ts` — changing cohorts = code change + API redeploy. Capacity 1,000 internal, never exposed via API.
- **Referral attribution is a stub**: `POST /api/referrals/click` returns a placeholder UUID (`00000000-…`); partner_code→partner_id resolution is a TODO. **Partner program cannot track conversions until this is built** — relevant before activating anything from [legacy 04_PARTNER_PROGRAM](legacy-barmatrix-site/04_PARTNER_PROGRAM.md).
- **Enrollment email silently skips** if `RESEND_API_KEY` / `BARMATRIX_SUPPORT_EMAIL` / `BARMATRIX_REPLY_TO_EMAIL` aren't set in prod secrets (status "skipped", reason "missing_config"). Resend activation is founder-gated (APPROVALS §7).
- **2-pay second installment** (`armTwoPaySubscription()`, Stripe billing anchor at day 30) is implemented but the day-30 arm has **never been exercised live**.
- **`/api/me/day-plan` exists** (J7 next-action engine, server-side) — the Day 2–7 engine should reconnect to it after auth, not be rebuilt client-side.
- **Cloud Run artifacts are dead**: `Dockerfile`/`cloudbuild.yaml` in barmatrix-api are vestigial; Hostinger is the live runtime.

## 4. API surface (summary)

74 routes / 23 route files. Auth tiers: admin 6 · auth 17 · enrolled 11 · public 40. Key groups: checkout + webhooks, diagnostic (two flows: curated 12-Q placement, trap-weighted 20-Q), questions/attempts/forensics, red zones (`/api/me/red-zones`), drills (catalog/prescribed/start/complete), boot camps (sessions/days/mastery), foundations, C3 (+coach), certification, day-plan, gamification, traps/tensions browse, webinar + diagnostic leads, billing portal. Full route list: `C:\barmatrix-canon\10-architecture\api-surface.md`.

## 5. Operational runbook (commands that work today)

```bash
# Site (this repo) — deploy
vercel deploy --prod --archive=tgz        # from C:\ABM; --archive=tgz required on this box

# API health
curl https://api.barmatrix.app/health      # expect {"ok":true,"db":"up"}

# API deploy (founder-owned; reference only — ships as diffs to founder)
cd C:/barmatrix-api && DRY_RUN=1 bash scripts/deploy.sh   # preflight
cd C:/barmatrix-api && bash scripts/deploy.sh             # atomic dist swap + Passenger restart + health-check auto-rollback

# Prod API server
ssh -i ~/.ssh/barmatrix_hostinger_20260527_ed25519 -p 65002 u211961595@191.96.56.130
# secrets: ~/secrets/barmatrix-api.env (chmod 600, outside clone; edit + touch tmp/restart.txt)
# restart only: touch ~/domains/barmatrix.app/nodejs/tmp/restart.txt
# rollback: mv dist.bak-<ts> dist && touch tmp/restart.txt
```

**Critical hazard**: Hostinger hPanel **Git auto-deploy must stay disconnected** on the API — re-enabling causes build-race 503s. Verify: compare `git reflog` head vs `.deploy-reflog-baseline` on the server.

**DB**: MariaDB 11.8 on Hostinger, 45 tables / 11 domains. `DATABASE_HOST` must be `127.0.0.1` (not `localhost` — IPv6 grant trap). Schema source of truth lives in the BARMATRIX ops repo (`SCHEMA_MYSQL.sql`); apply via `npm run migrate` in barmatrix-api.

**Env keys** (names only): API requires 15 at boot incl. `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRODUCT_BARMATRIX_FLAGSHIP`, `STRIPE_PRICE_PAY_IN_FULL`, `STRIPE_PRICE_FLAGSHIP_ANCHOR`, `STRIPE_PRICE_PAY_IN_TWO`, `STRIPE_PRICE_PAY_IN_TWO_SECOND`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, DB vars, `FRONTEND_URL`/`SUCCESS_URL`/`CANCEL_URL`, `ALLOWED_ORIGINS`. Optional: Resend trio, Sentry, `INTERNAL_JOB_SECRET`. Full list: `C:\barmatrix-canon\20-data\env-keys.md`.

**CORS**: only `https://barmatrix.app` is allowlisted — browser→API tests must run on the live origin (localhost and Vercel previews fail by design).

## 6. Unverifiable-from-code (watch during the first real run)

> ⚠️ Partially superseded by the verified audit in [SERVER_INVENTORY_2026-06-12.md](SERVER_INVENTORY_2026-06-12.md):
> the Resend trio IS set (key + access@barmatrix.app sender), `cohort_config` IS seeded
> (`JULY_MBE_REPAIR` open), `/api/me/day-plan` IS deployed, and the DB holds 51 tables /
> 3,686 questions / 44 students / 10 purchases. Read that doc before assuming anything is missing.

- Whether the live Stripe account's price/product IDs match the env names (2-pay anchor especially).
- The $0 promo-code webhook path (DAY1_READINESS §B — the friend's purchase is the test). Note: live
  promotion codes were created 2026-06-09 (untracked scripts in the founder's barmatrix-api tree).
