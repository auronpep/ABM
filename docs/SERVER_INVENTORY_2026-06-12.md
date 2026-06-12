# Server-Side Inventory — verified 2026-06-12

Read-only audit of api.barmatrix.app (Hostinger `~/domains/barmatrix.app/nodejs`), the
MariaDB database, and `C:\barmatrix-api` source. Purpose: a checked list of what
**already exists server-side** so site work never rebuilds it or assumes it's missing.
Method: live route probes, deployed-dist fingerprints, env key names, read-only SQL.

## Headline corrections to prior docs

| Prior assumption (LIVE_INFRASTRUCTURE / DAY1_READINESS / handoffs) | Verified reality |
|---|---|
| Resend email "may be silently skipping — trio possibly unset" (§6) | **Fully configured**: `RESEND_API_KEY` (re_…), from `BarMatrix <access@barmatrix.app>`, support/reply-to `support@barmatrix.app`. Enrollment email path is armed. |
| `cohort_config` seeding "unverifiable" (§6) | **Seeded**: `JULY_MBE_REPAIR` → `public_status: open`. |
| `/api/me/day-plan` "exists in source" | **Deployed and live** (401 Clerk-gated on prod; dist built Jun 9 includes it). Day 2–7 server engine is running, not just written. |
| DB "45 tables" | **51 tables**, incl. `mobile_installations`, `wal_codes`, `channel2_crosswalk`, `student_catchup_bank`, `postures`, `knowledge_*` (graph + live `/api/knowledge/search`). |
| Question bank = the 135-question client qdata | **Server holds 3,686 questions / 14,744 answer choices** (old-product MBE bank, fully loaded). The 135 client qdata files are the Christian-variant CQ transforms — a different content lane. The removed "2,400-question" marketing claim was actually an undercount of the server bank. |
| "No real users yet" framing | **44 students, 10 purchases, 8 cohort enrollments, 397 student attempts, 147 user_red_zones rows** exist server-side (old product + test traffic — verify provenance with founder before treating as launch buyers). |

## Live API surface (probed 2026-06-12)

All public content endpoints return 200 **with content**; all `/api/me/*` and enrolled
routes return 401 (deployed, Clerk-gated): `day-plan`, `red-zones(+/zone)`, `dashboard`,
`entitlement`, `gamification`, `traps`, `c3/next`, `drills/prescribed|start|:id|complete`,
boot-camp sessions, certification, foundations progress, billing portal.

Public + populated: `drills/catalog` (42 drills / 245 drill_questions), `boot-camps` (5),
`foundations`, `c3/deck` (135 cards), `c3/subjects`, `tensions` (84 tension_points),
`traps`, `red-zones`, `questions/:id` + `by-subject` (3,686), `knowledge/search`,
placement diagnostic (`diagnostic/session/*` — server-side 12-Q/20-Q flows; **0
diagnostic_responses so far** — our static funnel doesn't post to it), `cohort/status`,
checkout create/status/recover, Stripe webhook (2 stripe_event_audit_log rows).

Canon doc `C:\barmatrix-canon\10-architecture\api-surface.md` (74 routes, 2026-06-06) is
**stale**: missing `GET /api/me/day-plan`, `PATCH /api/admin/review-queue/:id`, and the
`POST /api/internal/jobs/trap-naming-email` job (deployed dark; note `INTERNAL_JOB_SECRET`
is **absent** from server env, so the job can't fire yet).

## Deployment truth

- Deploys are **atomic dist swaps** (deploy-packages → `nodejs/dist`, Jun 9 12:37 build);
  the server's git checkout (19ac7ea, Jun 2) is NOT what runs — never read it as state.
- Deployed dist ≈ local `C:\barmatrix-api` HEAD `9424128` ("Add J7 day-plan API").
- **Local founder tree is dirty beyond the deploy**: uncommitted day-plan day-card copy
  ("Trap Hunt…", richer diagnostic labels — NOT deployed) and an uncommitted removal of
  `allow_promotion_codes` from the 2-pay plan (deployed dist still has promo codes
  enabled on pay-in-full). Untracked: live Stripe promotion-code scripts dated
  2026-06-09 (`scripts/stripe-promotion-codes-2026-06-09.live-created.json`) — **promo
  codes were created on the live Stripe account**; founder-owned.
- Referral system confirmed stub end-to-end: route returns placeholder AND
  `referral_partners`/`referral_clicks`/`referral_conversions` all 0 rows.
- Empty-but-ready tables: `analytics_events`, `item_live_stats`,
  `focus_group_response_data`, `student_day_plan_progress`, `diagnostic_responses`.

## What this means for site work (don't rebuild)

1. **Day 2–7 / next-action**: server engine live at `/api/me/day-plan`. Our client-local
   ladder ([src/program/plan.ts](../src/program/plan.ts)) remains the unauth'd/offline path; after the
   Clerk seat-linkage session, swap reads to the API per the original design.
2. **Drills / boot camps / foundations / C3 / certification / gamification**: complete,
   deployed, content-loaded systems. Any "we need X" instinct in these areas → check the
   API first.
3. **Welcome email**: infrastructure + config exist; the P1 §4 "build dark" assumption is
   stale — what remains is founder wiring/approving the trigger content, not infra.
4. **Server placement diagnostic**: a full anonymous session flow exists publicly
   (`diagnostic/session/start → attempt → results`). Linking our funnel diagnostic to it
   (diagnostic_id → checkout metadata → claim) is plumbing, not new construction.
5. **Question scale**: the server bank (3,686) and the CQ qdata lane (135) are different
   products/voices — do not conflate; but the tagging taxonomy and per-question forensics
   live server-side if ever needed.
