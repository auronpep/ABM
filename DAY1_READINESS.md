# DAY-1 READINESS — first-customer checklist

Created 2026-06-11 for the friend-tester run (100%-off code, full Day-1
walkthrough + feedback). Status legend: ✅ done · 🟡 founder action ·
🔴 build work remaining · ⬜ later.

## A. Fixed this session (live on barmatrix.app)

- [x] ✅ **login.html trap removed** — was a fake credential form (collected
  email+password, redirected to a 404, displayed fabricated streak data).
  Now an honest "Open your dashboard" page → `/#/welcome`, with a
  new-device note pointing at support@barmatrix.app. Nav/Footer "Sign in"
  links now land somewhere real.
- [x] ✅ **All 30 ad landing pages' primary CTA fixed** — "Start the Free
  Diagnostic" pointed at dead `app.html` (404) on every lp-*.html +
  campaign.html. Now `/#/diagnostic`. (Note: the old `?lp=` attribution
  param is dropped; the SPA captures `utm_*` only — use UTM-tagged links
  for future campaigns.)
- [x] ✅ **Dashboard/app links fixed** on help.html, 404.html, campaign
  footers (`app.html` → `/#/welcome`).
- [x] ✅ **checkout.html next-steps** — "Open your dashboard" pointed at
  the 404; fake "TestFlight" step removed. Now: diagnostic → first repair.
- [x] ✅ **Dead footer links** about/partners/press.html (404s on 28 pages)
  → `/#/how-it-works` / support mailto.
- [x] ✅ First repair loop live (commit 25c4d65): /welcome → zone-scoped
  drills → timed retest → repair stamp → 4-day spaced retest.

## B. Founder actions BEFORE sending the friend (blocking the test)

- [ ] 🟡 **Stripe "No-cost Orders" toggle** — Dashboard → Settings →
  Payments → Checkout & Payment Links → enable No-cost Orders. Without it,
  a 100%-off code may fail at $0 total. (Stripe processes $0 checkout
  sessions without collecting a card once enabled; API ver ≥ 2023-08-16.)
- [ ] 🟡 **Confirm the friend's promo code applies to the pay-in-full
  price.** The API enables `allow_promotion_codes` ONLY on `pay_in_full`
  (C:\barmatrix-api\src\checkout.ts:53) — the 2-pay plan has NO promo
  field. The friend must pick **"Enroll — $999"** and enter the code on
  Stripe's page.
- [x] ✅ **Internal test/catchall mailbox exists** — use
  `codex@barmatrix.app` for BarMatrix email-flow QA. Mailbox settings are in
  `C:\Users\JesusLovesMe\.env`; the password key is `CODEX_EMAIL_PASSWORD`.
  Do not document or print the password value.
- [ ] 🟡 **support@barmatrix.app mailbox exists and is monitored** — the
  live login page and footers now reference it; `codex@barmatrix.app` can be
  used for internal catchall testing, but it is not a public support inbox.
- [ ] 🟡 *(Recommended)* **PostHog key** (`vercel env add VITE_POSTHOG_KEY`
  + redeploy) so the friend's run emits measurable events
  (diag_complete → checkout_start → first_login → first_drill_complete →
  first_retest_complete → zone_repaired). Without it, events buffer in
  the friend's browser only.
- [ ] 🟡 **Verify webhook fulfillment on a $0 session** — entitlement grant
  fires on `checkout.session.completed`; a $0 session still completes, but
  this exact path has not been exercised. The friend's purchase IS the
  test; just watch the Stripe dashboard + webhook logs during the run.

## C. Instructions to give the friend (current product constraints)

1. Use ONE browser on ONE device for everything (not incognito) — your
   map and progress live in that browser. Accounts come later.
2. Start at barmatrix.app → take the diagnostic (mini + 18 questions,
   ~12 min) BEFORE buying.
3. At checkout choose **Enroll — $999 (pay in full)** → on the Stripe
   page click "Add promotion code" → enter the code → $0, no card.
4. You'll land back on the welcome page → "Start the first repair" →
   4–6 drills → 3-question timed retest (6:00) → repair stamp.
5. Day 4: come back in the same browser — the welcome page will offer
   your spaced retest.
6. Feedback wanted on: clarity of the verdict, drill forensics, the retest
   moment, anything confusing, anything that feels like shame/guilt
   (there should be none), and anywhere you got stuck.

## D. Known gaps the friend WILL hit (set expectations, then build)

- [ ] 🔴 **No accounts / cross-device access** — Clerk auth into the shell
  + diagnostic_id→entitlement linkage (API already supports it; needs a
  founder-coordinated session; barmatrix-api changes ship as diffs to
  founder). The exact seam is now documented in
  `docs/LIVE_INFRASTRUCTURE.md` §2 — key fact: **buying does NOT create a
  Clerk account; the buyer's checkout email is the join key**, so the
  future sign-up step must use the same email.
- [ ] 🔴 **Day 2–7 engine** — after zone #1 is repaired, the CTA degrades
  to the generic drill bank. Next-zone repair loop, timed mixed sets,
  one-primary-action priority. Server `/api/me/day-plan` (J7) already
  implements this — reconnect after auth, don't rebuild.
- [ ] 🔴 **No welcome email** — "Your Red-Zone map is ready" (P1 §4);
  build dark in barmatrix-api `src/email.ts`; use `codex@barmatrix.app` as
  the QA recipient/catchall for test sends before any customer-facing send
  (APPROVALS §7).
- [ ] ⬜ Payment-plan dunning (P1 §6) — N/A for the $0 test; needed before
  a real 2-pay buyer. Stripe smart retries + 2 plain emails + pause.
- [ ] ⬜ Attorney gate L-2 — 3 mini-diagnostic seed questions still await
  attorney sign-off (APPROVALS §3).
- [ ] ⬜ Prayer-chain shared backend — needed by July 13 (APPROVALS §6).
- [ ] ⬜ Lighthouse mobile ≥ 90 pass on the live site (never measured).

## E. Definition of "ready for the friend"

All of section B checked. Sections A is done; C is the script to send
with the code; D items are post-feedback build queue, not blockers for a
single supervised tester who gets the constraints up front.
