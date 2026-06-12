# ABM — docs

Reference documentation for the ABM/TEAR project. (Top-level authority docs — `VISION.md`, `PRODUCT.md`, `POSITIONING.md`, `LEXICON.md` — live at the repo root and remain the source of truth. Launch state lives in root `PROGRESS.md`, `DAY1_READINESS.md`, `HANDOFF_PROGRAM.md`, `APPROVALS_NEEDED.md`.)

## Current operational reference

- **[LIVE_INFRASTRUCTURE.md](LIVE_INFRASTRUCTURE.md)** — what actually runs the paid program: the site↔API↔Stripe↔Clerk seam, the Day-1 activation gap, code-verified readiness facts (promo-code scope, referral stub, hardcoded cohort, Resend optionality), API surface summary, and the operational runbook (deploy/SSH/health/rollback). **Read this before touching anything post-purchase.**
- **[CANON_REFERENCE.md](CANON_REFERENCE.md)** — authoritative product numbers and taxonomy from `C:\barmatrix-canon` (84 tensions · 3,666 questions · 25 WAL codes + 23 architecture tags · red-zone proficiency formula · diagnostic 12/20 decree). **Use these numbers in copy and specs, not the old-site figures.**

## Legacy capture

- **[legacy-barmatrix-site/](legacy-barmatrix-site/README.md)** — knowledge preserved from the previous site (`C:\barmatrix-site`): the content-authoring recipe (44 Evidence tensions × 280-slot blueprint × 11 trap families × 10 QA gates), the old PRD/data model, marketing funnel + real diagnostic data, the partner-program design, brand kit + founder story, claims reference, and verbatim raw source files. Where legacy and canon disagree on numbers, **canon wins** (see CANON_REFERENCE).

## Reading order for a new session working on the paid program

1. Root `HANDOFF_PROGRAM.md` + `DAY1_READINESS.md` (state + blockers)
2. `docs/LIVE_INFRASTRUCTURE.md` (the seam + runbook)
3. `docs/CANON_REFERENCE.md` (true numbers)
4. `handoffs/P1_DAY_ONE_EXPERIENCE.md` (the buyer-journey spec)
5. Legacy docs only when designing *new* content/partner/marketing surfaces
