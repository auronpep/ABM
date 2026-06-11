# 00 — MISSION AND SCOPE: Sale #1 Funnel

**Date:** 2026-06-10 · **Owner:** Founder · **Implementer:** Claude Code
**Read order:** 00 → 01 → 02 → 03 → 04 → 05 → 06

## Objective

One definition of done: the `purchase` analytics event fires once from a real
buyer. Everything in this handoff exists to ship a five-screen conversion
funnel and nothing else.

The funnel: **Land → 3-question mini-diagnostic → full 18-question diagnostic
→ Red-Zone results verdict → checkout.**

## Repo targets

- Frontend: `C:\barmatrix-app` — Next.js 16 / React 19 on Vercel
  (`barmatrix.app`). Branch from `main`.
- API: `C:\barmatrix-api` — Node 24 / TypeScript / Express on Hostinger at
  `api.barmatrix.app`, backed by Hostinger **MariaDB** (NOT MySQL 8 — no
  MySQL-8-only JSON behavior such as `CAST(... AS JSON)`).
- Ops/source of truth: `C:\BMO` — READ ONLY. Do not edit, revert, or commit
  anything in C:\BMO.
- Legacy static site `C:\barmatrix-site` — not a target. Do not touch.

Existing live surfaces to REUSE, not rebuild: Stripe Checkout + webhooks,
entitlement recovery, UTM attribution, the curated 18-question diagnostic
flow, five landing pages. This project replaces page content and adds
components; it does not re-architect.

## Hard scope limits (do not build)

- No community features (prayer board, Tables, Circle pages).
- No mobile apps. No new subjects/questions. No CMS.
- No email sequences. No referral/ambassador surfaces.
- No new auth flows — keep the existing optional-auth pattern.
- No design-system overhaul — tokens in doc 02 only.

## Safety gates (absolute)

1. NO production deploy without explicit founder approval. Build on a
   branch; preview deploys on Vercel are fine; promotion to production is
   founder-gated.
2. NO database migrations or writes to the live Hostinger DB without
   founder approval AND a fresh backup first.
3. NO changes to Stripe products, prices, keys, or webhook config. Reuse
   the live $999 checkout exactly as-is.
4. NO edits to `.env`, credentials, DNS, or provider dashboards.
5. Question content ships ONLY if its attorney-review status is confirmed.
   The three seed questions in doc 03 must be verified as attorney-approved
   by the founder before public deploy. Flag, don't assume.

## Compliance constraints (inherit everywhere)

From RULES/DRIFT_CONTROL (v2): price is $999 ($500 + $499 plan). Blocked
strings anywhere in code/copy: `$899`, `discount`, `coupon`, `early bird`,
`save $100`, `first 250`, `guaranteed pass`, `guaranteed score`,
`NCBE-approved`, `State Bar-approved`, `official MBE prep`. No outcome
statistics. No "God will help you pass" or any promise of spiritual/exam
outcomes. Pick-rate stats must use provenance-honest wording (doc 03 §4).
No fake countdown timers or manufactured scarcity. "Limited seats available"
is the only capacity language permitted.

## Environment notes for the implementer

- All shell commands in PowerShell 7 (`pwsh`). Never PS 5.1 or cmd.exe.
  Never use here-strings (`@"..."@`); use file writes or string arrays.
- Run `git status` before touching any repo; treat unrelated dirty work as
  founder-owned, never revert it.
- Tests/lint/build must pass locally before requesting founder review.

## Definition of done (launch gate checklist)

- [ ] Five screens live on a Vercel preview URL
- [ ] All five analytics events firing with UTM passthrough (doc 04)
- [ ] Lighthouse mobile ≥ 90 performance on landing + results
- [ ] Drift-control string scan passes (doc 06, task QA-2)
- [ ] Founder watched 5 user sessions; fixes applied
- [ ] Founder approves production promotion
