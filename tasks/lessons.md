# Lessons

## 2026-06-12 - Post-checkout diagnostic CTAs

- When repairing checkout or enrollment flows, audit every post-purchase surface that can show a purchase CTA, including diagnostic results and bridge components.
- Paid or auto-provisioned users should not see enrollment offers after auth/API entitlement confirms active access; gate those CTAs on account enrollment state and provide a dashboard/account next step instead.

## 2026-06-13 - BarMatrix source-of-truth discipline

- When the user says a redesign feels like a cheap rebuild, stop patching the rebuild and verify the older functional app/API source before more UI repair.
- Treat `C:\BMO` as the operating-center map, not automatically as the clean app checkout; follow its junctions to the actual app/API/site repos and inspect their worktrees.
- When comparing old BarMatrix behavior to the current app, remember that the old system and `barmatrix-app` were operated from `C:\BMO`; use that context to locate historical workflows before deciding a feature is missing.
- Use a clean deployed checkpoint worktree for rollback and integration. Do not base launch work on a dirty root checkout unless its uncommitted changes have been intentionally inventoried and accepted.

## 2026-06-13 - Criminal answer-choice mechanics

- When the user asks for answer-choice-only pattern work, do not drift into doctrine-family analysis. Treat the task as mechanical scoring over answer text.
- Frame C3 as TRUE and RESPONSIVE first: the credited answer breaks neither `NOT_TRUE` nor `NOT_RESPONSIVE`; distractors fail by overclaim, falsity, distortion, misfit, bait doctrine, or wrong element.
- For mechanical proxies, test answer-length, because-clause/reason coupling, absolute/overclaim penalties, limited-language cues, and residual selection with train/test splits before making product claims.
