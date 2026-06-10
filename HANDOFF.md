# BarMatrix Rebrand — Session Handoff (2026-06-10)

## ⛔ IMMEDIATE NEXT ACTION (blocking — do this first)

The user holds **4 top-level source-of-truth items** they consider authoritative. They are
**auditing my documentation for alignment** with those 4 before any further work. Phase 3 is paused.

**Do NOT start Phase 3 or change content until:**
1. The user names / points to their **4 top-level source-of-truth items**.
2. I diff my `src/content/*` modules + the assumed source-of-truth hierarchy (below) against them.
3. The user confirms alignment and explicitly says go.

**First message to the user:** ask which 4 items are their top-level source of truth, then reconcile.
Do not assume the four 2026-05-15 governance files are them (they're pre-pivot — see Flags).

---

## Where everything lives
- **Repo:** `auronpep/ABM` (private). The rebrand is on **`main`**, **pushed** — `origin/main` = `83fa9a9`.
  **Work in `C:\ABM` on `main` directly.** The worktree
  `C:\ABM\.claude\worktrees\upbeat-saha-cffab0` (branch `claude/upbeat-saha-cffab0`, same commit) is a
  leftover — from `C:\ABM` run `git worktree remove .claude/worktrees/upbeat-saha-cffab0` to prune it.
- **Tip commit:** `83fa9a9` (rebrand `b8a592c` + this handoff), on `main`, pushed.
- **Plan:** `C:\Users\JesusLovesMe\.claude\plans\this-is-a-new-velvety-sun.md`
- **Memory:** `C:\Users\JesusLovesMe\.claude\projects\C--ABM\memory\` → `barmatrix-pivot.md`,
  `barmatrix-skills-stale.md`, `barmatrix-session-status.md`

## Path translations (their network)
- `C:\hermes` = `\\HAILKINGJESUS\hermes`
- `$HERMES_HOME` = `\\HAILKINGJESUS\c\users\blessed\appdata\local\hermes` (index files under `\memories\`)
- Old site source (READ-ONLY): `\\PRAISEJESUS\c\barmatrix-site` (repo `auronpep/barmatrix-site`)
- Hero demo source: `\\PRAISEJESUS\c\CCG\Finished\CQ14586.md`
- Old governance/drift files (pre-pivot): `\\PRAISEJESUS\c\bmo\BARMATRIX\{MASTER_CONTEXT,RULES,DRIFT_CONTROL,NO_NEGATIVITY_PROTOCOL}.md`

## Source-of-truth hierarchy I ASSUMED (verify against the user's 4)
- **Authoritative (new):** `BARMATRIX_REBRAND_VISION_LOCK_2026-06-10.md` + `…_BUILD_PACKET_2026-06-10.md`
  (in `\\HAILKINGJESUS\hermes\barmatrix\staging\`)
- **Orientation:** Master Brain, New Session Handoff, the 5 `*_INDEX_2026-06-01.md` files, CONSOLIDATED_HANDOFF
  *(superseded on the "Barnabas Circle / Proverbs 2:6-7" points)*
- **Pre-pivot, NOT authoritative for voice** (only claim-safety survives): the four 2026-05-15 files
- ❓ **OPEN:** confirm this matches the user's 4 top-level items.

## Locked brand decisions (implemented)
Headline "Stop trusting the answer that almost tells the truth." · **TEAR Method** (Test/Expose/Apply/Repair) ·
**Be Strong Fellowship** (Joshua 1:9) · hero scripture **John 7:24** · hero demo **CQ14586** "The Barnabas Trap"
(official key **B**, dominant trap A, **no public pick-rate %**) · counterfeit thesis · product language
(Diagnostic / Trap Map / Forensics / Repair Path) · **$999** + $500/$499 plan kept · fake scarcity + stale stats removed.

## What's built (Vite + React + TypeScript static build)
- `src/content/{brand,scripture,demo,home,pricing,diagnostic}.ts` — all copy + KJV scripture map (audit these for voice)
- `src/components/{Nav,Footer,ScriptureBand,ForensicsDemo}.tsx`
- `src/pages/{Home,HowItWorks,Pricing,Diagnostic}.tsx`; `src/App.tsx` (route state); `src/styles/{base,extensions,global}.css`
  (base.css = harvested from old site; extensions.css = scripture/TEAR/fellowship layer)
- `public/` — preserved plumbing: `checkout.html` (byte-identical, Stripe untouched), 28 `lp-*.html`, campaign/emails/help/login/404

## Verification status (all green)
`tsc` + `vite build` clean. Verified via Claude_Preview MCP DOM/`eval` (not pixels): all locked copy verbatim,
zero prohibited terms, demo A→B + TEAR + no %, mobile 360px single-col/CTA-full-width/zero-overflow, pricing
diagnostic-first/no-scarcity, full diagnostic funnel → Trap Map. **Screenshots blocked** in this env
(chrome-devtools profile browser-locked; Preview screenshot times out on infinite pulse animation — inject
`*{animation:none!important}` via `preview_eval` first if a screenshot is needed).

## Founder-decision defaults baked in (override-able)
Keep $999/plan · removed stale stats + fake scarcity meter · no public pick-rate % · John 7:24 as ref+caption ·
"Bible-believing" in identity sections only · Stripe merchant-name = non-code ops TODO · CQ14586 copy = DRAFT pending attorney review.

## Hard gates before ANY public deploy
Attorney review of CQ14586 wording · founder sign-off on the defaults · Stripe merchant display-name fix ·
**resolve deployment host (see Flag 1) + set build config** · no deploy/ads/email/Stripe changes without explicit human approval.

## ⚑ Two flags to resolve
1. **Deployment host discrepancy.** Site repo's `CLAUDE_CODE_HANDOFF.md` says **Hostinger** (`public_html`,
   "serve repo as-is, NO bundler"); rebrand docs say **Vercel / barmatrix.app**. I introduced **Vite** (with the
   user's explicit "own implementation" blessing) — native on Vercel, but Hostinger's plain static serve needs a
   build step. **CONFIRM THE HOST** before scoping deploy.
2. **Pre-pivot drift files conflict with VISION_LOCK.** The four 2026-05-15 files mandate the OLD (failed) hero,
   fake scarcity, "2,400-question" stats, and an aggressive "no-negativity" launch tone — all reversed by VISION_LOCK.
   I followed VISION_LOCK and honored only their surviving **claim-safety** rules (no "guaranteed pass," no
   "NCBE/State-Bar-approved," no unlicensed exam Qs, no unsubstantiated stats). **No pivot-era drift/voice file exists yet.**

## Phase 3 (deferred until alignment confirmed)
Rebrand ~28 legacy `public/lp-*.html` + `campaign.html` + `emails.html` to the new voice (prune toward ~5 core).
`checkout.html` payment logic stays untouched.

## Resume commands
```
cd "C:/ABM"            # work on main directly
npm install            # node_modules is gitignored — install first
npm run dev            # or: npm run preview  (port 4173)
npm run build          # tsc --noEmit && vite build
```
Preview MCP: `preview_start` name "barmatrix" (`.claude/launch.json`), then `preview_eval`/`preview_resize`.

## Don't
- Don't apply the stale `anthropic-skills:barmatrix-*` skills' voice/positioning.
- Don't reintroduce fake scarcity, stale stats, public pick-rate %, or the old "Master the finite universe" hero.
- Don't deploy, push, send email, or touch Stripe without explicit approval.
