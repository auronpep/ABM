# APPROVALS NEEDED — founder-gated actions (sale-one build, 2026-06-10)

One entry per gated action: what, why, exact command, rollback.
Nothing below has been executed.

## 1. Commit the sale-one funnel build

- **What:** commit the working tree (funnel, /welcome, /prayer-chain, QA
  scripts, ledger, docs) on `main`.
- **Why gated:** founder asked to be told when ready to commit/deploy.
- **Command:**
  ```
  git -C C:\ABM add -A
  git -C C:\ABM commit -m "feat: sale-one funnel — mini-diagnostic hero, 18-q Red-Zone diagnostic, checkout bridge, welcome + prayer chain, drift/contract gates"
  git -C C:\ABM push
  ```
- **Rollback:** `git revert <commit>` (no force-push needed; site unaffected
  until deploy).

## 2. Production deploy to barmatrix.app

- **What:** promote the build.
- **Why gated:** doc 00 gate 1 — production promotion is founder-gated.
  Recommend a preview deploy first: `vercel deploy --archive=tgz` (no
  `--prod`) and a click-through of the five screens.
- **Command (after preview sign-off):**
  ```
  cd C:\ABM && vercel deploy --prod --archive=tgz
  ```
- **Rollback:** `vercel rollback` to the previous production deployment
  (current prod = commit 9a07c49 build).

## 3. Gate L-2 — attorney review of the three funnel seed questions

- **What:** confirm attorney-review status of Q-14621 (The Manna Café
  Bookmaker), Q-14734 (The Upper Room Lease), Q-14609 (The Damascus Road
  Stop) in `src/funnel/questions.seed.json` — stems, choices, forensics copy,
  silver-key moves. The transforms were authored this session from the raw
  sources in `C:\CCG`; law and trap geometry preserved, but no attorney has
  seen them.
- **Why gated:** doc 00 gate 5. The ledger lists all three as `pending`.
- **Action:** review the three entries; record decisions in
  `work\review_decisions.csv` (`qid,decision,date`), re-run
  `PYTHONUTF8=1 uv run --no-project python scripts/review_ledger.py`.
- **Rollback:** swap or edit seed JSON; `npm run build` re-validates.

## 4. Real Stripe Checkout on checkout.html — ✅ RESOLVED 2026-06-11

- The rebrand deploy had replaced the Next.js live checkout with a front-end
  mock. Restored in commit `58b0b6c`: checkout.html now calls the existing
  live endpoint `POST api.barmatrix.app/api/checkout/create-session`
  (pay_in_full / two_pay_500_499) and redirects to Stripe's hosted checkout.
  Fake card fields removed entirely — no card data ever touches the site.
  Success returns to `/?purchase=success#/welcome` (P1), cancel returns to
  checkout with plan preserved, cohort-full 409 surfaces the waitlist copy.
- **Verified live:** real browser on barmatrix.app → terms → enroll →
  redirected to `checkout.stripe.com/c/pay/cs_live_…` showing $500.00 for
  the 2-pay plan. No charge made (no card entered). The server-side
  `purchase` event remains whatever the existing barmatrix-api webhook does
  on `checkout.session.completed` — untouched, as required.
- **Rollback:** `git revert 58b0b6c` + redeploy.

## 5. Analytics destination

- **What:** events currently buffer to `window.__bmEvents` + dataLayer and
  POST to PostHog **only if** `VITE_POSTHOG_KEY` is set at build time. To get
  the funnel dashboard (doc 04 §5), add the key to Vercel env and rebuild.
- **Command:** `vercel env add VITE_POSTHOG_KEY` (founder pastes key) → next
  deploy picks it up. Then save the PostHog funnel view:
  `mini_diag_start → full_diag_start → diag_complete → checkout_start →
  purchase`, segmented by utm_source.
- **Rollback:** remove the env var; events fall back to the local buffer.

## 6. Prayer-chain backend + confirmation email (deadline: live July 13)

- **What:** `#/prayer-chain` signups currently persist per-browser
  (localStorage stub). Before July 13 it needs (a) a shared store for slot
  coverage, and (b) the confirmation email with .ics (Resend — activation is
  founder-gated). Simplest path: two endpoints on the existing
  `api.barmatrix.app` (founder-owned repo) + the `chain_slots` /
  `chain_commitments` tables from P4 (backup-first migration ceremony).
- **Why gated:** live-DB migration + email provider activation.
- **Rollback:** page works (stub) without backend; revert endpoints if added.

## 7. Resend / email activation generally

- Welcome email (P1 §4) and abandoner email (doc 05) are NOT built — there is
  no email infrastructure in this repo and activation is founder-gated. The
  results-page email capture was deliberately omitted rather than collect
  emails into a void (honesty > checkbox). Approve an email provider plan and
  these become small follow-on builds.
- **Daily devotional email (added 2026-06-12):** the Forty Days countdown
  devotional (`src/content/devotional.ts`) now renders on /welcome. Once the
  email provider is approved, the same content becomes a dated daily email —
  bounded (40 sends + 2 exam days, ends July 29), content already written.

## 8. Deploy the first repair loop — ✅ RESOLVED 2026-06-11 (founder approved)

- Deployed to production via `vercel deploy --prod --archive=tgz`
  (deployment `barmatrix-1as2qwdbu-sunnylee.vercel.app`). Verified live:
  barmatrix.app serves the matching bundle (`index-BQksTwnA.js`, repair-loop
  copy present), `qdata/trap-index.json` 200 (11.4 KB), 81 questions intact,
  checkout.html 200. Rollback: `vercel rollback`.

### Original entry (for reference)

- **What:** `#/repair` (drills → timed retest → repair stamp → 4-day spaced
  retest), state-aware /welcome CTA, DrillPlayer extraction, trap index,
  program events. Client-local v1 — no API/auth dependency, no DB writes,
  no Stripe changes. Verified end-to-end in the browser (PROGRESS.md
  2026-06-11 entry has the evidence trail).
- **Why gated:** production promotion is founder-gated; this is the first
  program surface a paying buyer will touch.
- **Command:** commit working tree, then `cd C:\ABM && vercel deploy --prod --archive=tgz`
  (recommend a preview deploy first: same command without `--prod`).
- **Rollback:** `vercel rollback`; or `git revert` the commit — the loop is
  additive (new route + extracted component), funnel surfaces untouched.

## 9. P3 Barnabas Circle launch gate (not a build item)

- Governance owners (Moderation Owner, Crisis Contact, Chaplain, counselor
  list) + privacy-policy community section are founder acts. The build half
  requires auth + DB that the static site does not have — see CONFLICTS.md §7.

## 10. Prayer-requests backend + shared-wall moderation (added 2026-06-12)

- **What:** `#/prayer` (prayer requests + the Ebenezer answered wall) ships
  client-local, same stub precedent as the Prayer Chain (§6): requests persist
  per-browser, "shared with the cohort" is recorded but only visible in that
  browser. Making sharing real needs (a) two endpoints + a `prayer_requests`
  table on `api.barmatrix.app`, (b) founder/team delivery of the private
  prayer list, and (c) a **moderation pass before any shared request is
  cross-user visible** — the page already promises this in its copy, and the
  Moderation Owner role from P3 (§9) is the natural owner.
- **Why gated:** live-DB migration + cross-user UGC visibility + the
  founder-owned api repo.
- **Rollback:** page works (stub) without backend; revert endpoints if added.
