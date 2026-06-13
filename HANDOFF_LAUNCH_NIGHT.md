# HANDOFF — Launch Night: copy surgery + paid program readiness

**Written:** 2026-06-11 evening, by the session that fixed the checkout dead-button.
**Mission:** make barmatrix.app ready to send to our TikTok influencer **tonight**, then build out the paid program so a buyer's first few days work. Two workstreams, in this order:

1. **WORKSTREAM A — copy surgery (blocks the influencer send).** Exact change list below; every file:line enumerated. Ship it, deploy, verify, done in under an hour.
2. **WORKSTREAM B — paid program build-out (the real focus).** What happens after someone purchases: Day-1 through Day-7.

**The gate is LIFTED** (founder, 2026-06-11): commit/push/deploy immediately, no approval waits. Still controlled: customer-facing email sends, Stripe product/price/webhook config, live-DB writes. Use `codex@barmatrix.app` as the internal test/catchall mailbox for dark email QA; mailbox settings are in `C:\Users\JesusLovesMe\.env` and the password key is `CODEX_EMAIL_PASSWORD`. Founder is separately fixing the Stripe merchant name ("JWM Services" → BarMatrix) in the Stripe dashboard.

---

## ⚖️ NEW VOICE LAW (founder directive 2026-06-11 — overrides any older copy)

> "Items like who the founder is or that all questions are attorney reviewed are not things we want to say and promote — it's weak. We don't have such a weak product that we need these items to add value to it. The product is the most valuable item and we don't want to use other items to give it credibility. We want the results to speak for themselves."

Operating rules derived from it (also saved to memory `founder-voice-no-crutches`):
- **No founder-credibility copy.** No "built by a California attorney," no Wheaton, no founder bio, no "attorney-reviewed questions." Anywhere.
- **No bank-size promotion.** Remove every "2,400 questions" claim. We are not selling a big bank; we are selling **the ability to identify and fix red zones**. When a removed phrase leaves a hole, fill it with red-zone/repair capability copy, not another number.
- This complements (does not replace) the existing rules: `no-guardrails-in-content`, `naming-is-swappable`.
- **Distinction that matters:** "attorney" inside question *fact patterns* (qdata JSON, seed questions) is substantive content — KEEP. "Attorney-grade" as a *product-standard* phrase (e.g. "Attorney-grade law" in `src/content/home.ts`) is a quality claim about the product, not borrowed credibility — defensible to keep, but if in doubt, recast toward results ("the legal mechanics are exactly what the bar tests" already carries it).

---

## ⚖️ ATTORNEY DIRECTIVE (counsel, 2026-06-11 — added launch night, overrides §A1's "defensible to keep" note)

> Counsel instructed us to limit unnecessary legal liability. This is an **educational study site**. We are **strictly prohibited from mentioning anything about attorney review of questions, drills, or any content** on the live site.

Operating rules:
- **Zero attorney-review claims anywhere on the live site** — no "attorney-reviewed," no "reviewed by an attorney within 48 hours," no "written and attorney-reviewed by our team." This includes FAQ/help answers, emails, checkout, funnel trust blocks, and program copy.
- **"Attorney-grade" product-standard phrases are also out.** The A1 note above said they were "defensible to keep" — counsel's directive supersedes that. Recast toward results ("the legal mechanics are exactly what the bar tests").
- The voice-law distinction stands: "attorney" inside question *fact patterns* (qdata JSON, seed questions) is substantive educational content — KEEP.
- Sweep: `grep -rniE "attorney" index.html src public --include="*.html" --include="*.ts*" | grep -vi qdata` must return only fact-pattern/content uses (or nothing user-facing).
- This conveniently merges with the voice law: removing attorney-review copy was already required as credibility-crutch removal; counsel's directive makes it a hard legal prohibition, not a style choice.

---

## WORKSTREAM A — exact change list (do these, then deploy)

### A1. Remove the Builder/founder section
- `src/pages/Home.tsx` lines ~93–110: the entire `{/* ============ FOUNDER ============ */}` block — "▌ The Builder · 03", "Built by a California attorney with Wheaton roots.", "Every question is attorney-reviewed before it reaches you…", and its "Read the FAQ →" link if it belongs to that block. Delete the section; renumber subsequent "· 0N" section labels on the homepage if they're sequential.
- `src/components/RedZoneReveal.tsx` line ~205: `<p>Built by a California attorney. Every question attorney-reviewed before it reaches you.</p>` — delete or replace with a results line (e.g. about the verdict they're looking at).
- Sweep confirm: `grep -rni "builder\|wheaton\|attorney-reviewed\|built by" src public --include="*.html" --include="*.ts*" | grep -vi qdata` — also check `public/emails.html` and `public/help.html` (both contain founder/attorney mentions in body copy or FAQ answers; rewrite those answers to product-results voice).

### A2. Remove every "2,400" bank-size claim (30 files)
Files: `index.html`, `public/campaign.html`, `public/checkout.html`, `public/emails.html`, and all 26 `public/lp-*.html`.
- These are mostly the same one or two sentence patterns repeated ("2,400-question tagged MBE bank…", the checkout "INCLUDED" list, lp-page included-lists). A scripted pass is safest: find each phrase variant, replace with red-zone capability phrasing, e.g.:
  - "2,400-question tagged MBE bank · Wrong Answer Forensics · …" → "Finds your red zones · Wrong Answer Forensics on every miss · targeted repair drills · …"
  - "2,400-question MBE bank, fully tagged · all 8 subjects" (checkout INCLUDED list) → "Red-Zone Map across all 8 MBE subjects"
- Also remove "47 trap tags" if encountered (same stale-number family; canon's numbers are different — see `docs/CANON_REFERENCE.md`).
- Verify zero remain: `grep -rn "2,400\|2400\|47 trap" public src index.html`

### A3. Refund policy: 7-day → 3-day
- `public/checkout.html` line ~838 (terms-row label): "…Refund Policy (7-day no-questions refund window)…" → 3-day. Also the pay-meta line "7-DAY MONEY-BACK GUARANTEE…" → 3-day, and the INCLUDED list bullet "7-day no-questions refund window".
- `public/emails.html` — every 7-day refund mention.
- `public/help.html` — the Billing & Refunds section ("the 7-day window") + any article body.
- Sweep: `grep -rni "7-day\|7 day\|seven.day" public src index.html`
- **Note for founder ops (do not change in code):** the API/Stripe refund handling and partner-payout timing were designed around a 7-day window (see `docs/LIVE_INFRASTRUCTURE.md`, barmatrix-api refund queue). Site copy moves to 3-day now; founder aligns the operational window on his side.

### A4. Terms / Privacy / Refund links → real pages (founder explicitly wants this fixed)
- Today all three links in `public/checkout.html` (and possibly footers) point at `/help.html`.
- Build three dedicated static pages matching the site shell: `public/terms.html`, `public/privacy.html`, `public/refund.html`. Plain, readable, accurate to how the product actually works (data collected per `docs/LIVE_INFRASTRUCTURE.md` §"the seam": email, attempts, Stripe payment via hosted checkout, localStorage progress; 3-day refund). Write them in normal product voice — these are operative policy pages, not marketing hedges (the no-guardrails rule governs marketing copy; a policy page stating the 3-day refund mechanics is product fact). The founder's legal team audits the live site directly — ship plain and correct, they'll refine.
- Point the checkout terms-row links + all footer policy links at the new pages. Sweep: `grep -rn "help.html" public src | grep -i "terms\|privacy\|refund"`

### A5. Build · deploy · verify (commands that work on this box)
```bash
npm run build                          # contract check + tsc + vite
vercel deploy --prod --archive=tgz     # --archive=tgz REQUIRED; CLI is logged in (team sunnylee)
# verify live:
curl -s https://barmatrix.app/checkout.html | grep -c "3-day"     # > 0
curl -s https://barmatrix.app/ | grep -ci "2,400\|wheaton"        # = 0
```
Then walk it in a real browser: home → diagnostic intro → checkout (`?plan=full`) → terms box → Enroll → confirm checkout.stripe.com loads. The enroll flow was verified working tonight (live `cs_live_…` session) — don't break it; `checkout.html`'s submit handler now shows an explicit prompt if terms are unchecked (commit `36a8f57`).

### A6. Influencer-send checklist (after deploy)
- Give the founder UTM-tagged links for the influencer (the SPA captures `utm_*`; the old `?lp=` param is dead): e.g. `https://barmatrix.app/?utm_source=tiktok&utm_medium=influencer&utm_campaign=launch1`.
- PostHog key is still NOT set — without it, events buffer in visitors' browsers only. One founder command: `vercel env add VITE_POSTHOG_KEY` + redeploy (APPROVALS item). Strongly worth doing before traffic arrives; flag it to the founder again.
- FTC reminder for the influencer (their content, not ours): disclosure line if they're compensated — see `docs/legacy-barmatrix-site/04_PARTNER_PROGRAM.md`. Referral *tracking* is a stub in the API (`/api/referrals/click` returns a placeholder) — attribution tonight = UTM only.

---

## WORKSTREAM B — the paid program: purchase → first few days

**Read first:** `HANDOFF_PROGRAM.md` (state + constraints), `docs/LIVE_INFRASTRUCTURE.md` (the seam — critical), `handoffs/P1_DAY_ONE_EXPERIENCE.md` (the spec), `DAY1_READINESS.md` (gap list).

### What already works (verified live, don't rebuild)
- Funnel: mini-diagnostic → 18-question diagnostic → Red-Zone verdict → checkout → **live Stripe** → return to `/?purchase=success#/welcome`.
- `#/welcome` reads the buyer's #1 red zone from `localStorage.bm_redzone_map` and launches the **first repair loop** (commit `25c4d65`): zone-scoped drills → 6:00 timed 3-question retest → vermilion→brass repair stamp → 4-day spaced retest scheduled. Engine: `src/program/repair.ts` (state in `localStorage.bm_program_v1`). 135-question qdata bank.
- Server-side, the API already fulfills purchases (webhook → entitlement) and has `/api/me/day-plan` (a full next-action engine) — Clerk-gated.

### The constraint that shapes everything (from docs/LIVE_INFRASTRUCTURE.md)
**Buying does NOT create an account.** Entitlement is keyed to the **checkout email**; the program is currently browser-local (same device/browser as the diagnostic). Clerk linkage needs a founder-coordinated session (barmatrix-api changes ship as diffs to the founder — its tree is founder-owned, read-only for us).

### Build order for "set for their first few days"
1. **Day 2–7 engine, client-local (P1 §5).** After zone #1 is repaired the CTA currently degrades to the generic drill library. Build the priority ladder in `src/program/`: overdue spaced retest → drills on hottest live zone → timed mixed set → next zone repair. Exactly ONE primary action on /welcome each visit. Mirror `/api/me/day-plan`'s shape (inspect `C:\barmatrix-api\src\routes\me-day-plan*`) so reconnecting to the server later is a swap, not a rewrite.
2. **Multi-zone progression.** `src/funnel/zones.ts` synthesizes the full ranked zone list — repair loop currently consumes only #1. Wire zone #2..N with the same loop; show the map's state (repaired/live/scheduled) on /welcome.
3. **Return-visit choreography.** Day-4 spaced retest already triggers from localStorage date; make the welcome page's state machine explicit for: returning mid-repair, returning with overdue retest, returning with all zones green (→ timed mixed sets).
4. **Welcome email, built dark (P1 §4).** "Your Red-Zone map is ready" — implement as a diff for the founder in barmatrix-api `src/email.ts`; dark-send first to `codex@barmatrix.app`, the BarMatrix test/catchall mailbox. Must include: link back, and the instruction to use the same browser/device (until accounts exist) — that instruction is product fact, not a guardrail.
5. **Events.** `first_drill_complete`, `first_retest_complete`, `zone_repaired` exist; add day-2+ events (`retest_overdue_shown`, `mixed_set_complete`, `zone_n_started`). North star: % of buyers with `zone_repaired` within 24h ≥ 70%. All inert until PostHog key is set.
6. **Then (founder-coordinated, not tonight):** Clerk into the shell + `diagnostic_id` → checkout metadata → server claiming, so the program survives device changes. The API supports all of it already.

### Sanctuary rules for program UX (unchanged)
No streaks, no guilt, no "falling behind." Spaced retests invite; they never shame. And the new voice law above applies to program copy too: the *result* (a repaired zone, a held retest) is the proof.

---

## Working facts
- Build: `npm run build` · Dev: `npm run dev` (port 5173) · Deploy: `vercel deploy --prod --archive=tgz` from C:\ABM.
- Browser→API tests only work on the live origin (CORS allowlist = barmatrix.app only; localhost/previews fail by design).
- qdata regen: drop `CQ*.md` in `C:\CCG\Finished\` → `scripts/build_qdata.py` → rebuild → redeploy.
- `C:\barmatrix-app` + `C:\barmatrix-api` = founder-owned dirty trees: read freely, never commit; API changes ship as diffs.
- Attorney gate L-2 (3 mini-diagnostic seed questions) still open — unrelated to tonight.
- Docs map: `docs/README.md` (reading order) · `docs/LIVE_INFRASTRUCTURE.md` (the seam + runbook) · `docs/CANON_REFERENCE.md` (true numbers — use these, never the old marketing figures) · `docs/legacy-barmatrix-site/` (old-site capture).
- Memory to load: `barmatrix-session-status`, `no-guardrails-in-content`, `naming-is-swappable`, `founder-voice-no-crutches`, `legacy-site-capture`.

## Definition of done — tonight
1. Zero "2,400"/bank-size, zero Builder/founder-credibility copy, 3-day refund everywhere, real policy pages linked. Deployed + grep-verified + browser-walked.
2. Influencer UTM links handed to founder; PostHog key flagged.
3. Workstream B started: Day 2–7 engine is the first build target; the buyer's first 72 hours should never dead-end into the generic drill library.
