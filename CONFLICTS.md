# CONFLICTS — sale-one handoff vs. live repo reality

*Per the kickoff rule: where the handoffs conflict with repo reality, log it
here instead of improvising silently. Each entry states the conflict and the
resolution taken (under the founder's "creative freedom / integrate the
redesign" grant of 2026-06-10).*

## 1. Repo target

- **Handoff says:** frontend is `C:\barmatrix-app` (Next.js 16) + API
  `C:\barmatrix-api` (Express/Hostinger).
- **Reality:** `barmatrix.app` is served by THIS repo (`C:\ABM`, Vite + React)
  — both repos link to the same Vercel project (`barmatrix-app`,
  `prj_LwBgARXTft6aeyoRwhIqEDWh5p4P`) and C:\ABM was deployed over it on
  2026-06-10. `C:\barmatrix-app` sits on a dirty `feat/ambassador-launch`
  branch (founder-owned work — untouched).
- **Resolution:** funnel built in C:\ABM, the repo that actually serves
  production. The Next.js repo was not modified.

## 2. Reference .jsx prototypes missing

- **Handoff says:** adapt `mini-diagnostic.jsx`, `red-zone-reveal.jsx`,
  `manna-cafe-demo-card.jsx` "in this bundle"; seed data embedded in
  `mini-diagnostic.jsx`.
- **Reality:** Z2/Z3 contain only the .md docs. The prototypes were not found
  anywhere on disk.
- **Resolution:** components built from the doc 01/02 specs directly. The
  three seed questions were authored as fresh Christian transforms of the raw
  sources (`C:\CCG\14621.md`, `14734.md`, `14609.md`) following the C3
  transform spec embedded in those files; trap metadata and pick rates match
  doc 03 §2 exactly (Q-14621 trap C 31% VIOLATION ≠ REMEDY etc.). Forensics
  copy follows the doc 03 §5 rubric. **Because the copy is authored, founder
  gate L-2 (attorney review of the three seeds) is mandatory before
  production** — queued in APPROVALS_NEEDED.md.

## 3. "Existing 18-question diagnostic"

- **Handoff says:** reuse the live 18-question diagnostic with minimal changes.
- **Reality:** that flow lives in the Next.js app. This site had a 5-question
  static demo diagnostic.
- **Resolution:** rebuilt the full diagnostic from the live 81-question
  Repair-Drills bank (every question already carries per-choice mold
  metadata): a curated 18 spanning all five live subjects
  (`src/content/curated-diagnostic.ts`). Zone synthesis runs on the user's
  actual picked-choice molds — more honest than the old static trap map.

## 4. No server side → no `purchase` event

- **Handoff says:** `purchase` MUST fire server-side from the Stripe webhook
  (doc 04 rule 1).
- **Reality:** C:\ABM is a static site; checkout.html is a front-end mock
  with no live Stripe session. The webhook lives in `C:\barmatrix-api`
  (founder-owned, dirty working tree).
- **Resolution:** `checkout_start` fires client-side with `plan` + red_zones +
  UTM as specified. `purchase` was NOT faked client-side. Wiring real Stripe
  Checkout + the server-side purchase event is queued in APPROVALS_NEEDED.md.

## 5. Vocabulary: "Trap Map" (VISION_LOCK) vs "Red-Zone" (sale-one handoff)

- The 2026-06-10 morning VISION_LOCK renamed Red-Zone → Trap Map and banned
  pick-rate display. The same-day sale-one handoff (founder-owned, newer)
  specifies Red-Zone naming and provenance-honest pick rates ("{pct}% fall
  here on this question's tested form").
- **Resolution:** the handoff wins on funnel surfaces (Red-Zone verdict,
  pick rates with the tested-form qualifier + a unit check that enforces the
  qualifier). Drill pages still never show pick rates.

## 6. Fonts

- Doc 02 wants self-hosted Source Serif 4 + IBM Plex Mono. The live site
  ships Newsreader + IBM Plex Mono via Google Fonts and the whole existing
  design system depends on them.
- **Resolution:** funnel surfaces use the site's existing `--serif`/`--mono`
  stacks (visually equivalent register; `Source Serif 4` is already the
  declared fallback). No new font pipeline; no Google-Fonts @import was added.

## 7. P1 / P3 backend dependencies

- P1 (entitlement linkage, dunning, welcome email) and P3 (Circle, members
  auth, MariaDB schema) assume the Next.js + API + DB stack.
- **Resolution:** P1 §1 built client-side (`#/welcome` reads the diagnostic
  map carried in the buyer's browser; no-diagnostic fallback works). P3 was
  NOT built — it is governance-gated and impossible without auth/DB on the
  static stack. P4 built with a localStorage signup stub (shared backend
  queued in approvals).
