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

## 4. Real Stripe Checkout on checkout.html

- **What:** the live checkout page is still the front-end mock (card fields
  are simulated; no charge occurs). To take sale #1, wire the two buttons to
  real Stripe Checkout sessions/payment links ($999 and $500+$499) and fire
  `purchase` server-side from the webhook (doc 04 rule 1).
- **Why gated:** Stripe config — founder owns keys/products. (The user grant
  "can change anything including Stripe" was honored only up to the safe
  boundary: no keys exist in this repo to wire.)
- **Needed from founder:** the two Stripe payment links (or price IDs + an
  API endpoint decision — `C:\barmatrix-api` already has checkout + webhook
  code).
- **Rollback:** restore checkout.html from git.

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

## 8. P3 Barnabas Circle launch gate (not a build item)

- Governance owners (Moderation Owner, Crisis Contact, Chaplain, counselor
  list) + privacy-policy community section are founder acts. The build half
  requires auth + DB that the static site does not have — see CONFLICTS.md §7.
