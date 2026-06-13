# BMO Old-Base Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore BarMatrix from the BMO-operated functional system while keeping only the newer marketing/enrollment improvements that help launch conversion.

**Architecture:** Treat `C:\BMO` as the operating-center map, not as a single deployable repo. The deployable app is `C:\barmatrix-app`, the API is `C:\barmatrix-api`, and the legacy/static reference site is `C:\barmatrix-site`; the current live deployment remains the rollback checkpoint until a better integrated build is proven.

**Tech Stack:** Next.js App Router, React, Clerk, Stripe, Express/TypeScript API, Hostinger MySQL/API hosting, Vercel frontend deployment, legacy static React/Babel reference files under `C:\barmatrix-site`.

---

## Current Ground Truth

- `C:\BMO\app-repo` is a junction to `C:\barmatrix-app`.
- `C:\BMO\api-repo` is a junction to `C:\barmatrix-api`.
- `C:\BMO\website-repo` is a junction to `C:\barmatrix-site`.
- Current clean app integration lane: `C:\barmatrix-app\.worktrees\old-app-marketing-transplant`, branch `codex/old-app-marketing-transplant`, HEAD `0d2e1ff`.
- Current API hardening lane: `C:\barmatrix-api\.worktrees\checkout-clerk-access`, branch `codex/checkout-provisioning-hardening`.
- Useful app checkpoint tags visible now:
  - `checkpoint-current-live-bmo-restore-2026-06-12`
  - `checkpoint-pre-diagnostic-results-access-2026-06-13`
- Do not use the dirty root app checkout `C:\barmatrix-app` as an integration base without a separate inventory. It is on `feat/ambassador-launch` and differs from the clean deployed worktree.
- Legacy static product reference lives in `C:\barmatrix-site`, especially:
  - `app\main.jsx`
  - `app\shell.jsx`
  - `app\dashboard.jsx`
  - `app\red-zones.jsx`
  - `app\matrix.jsx`
  - `app\pattern-board.jsx`
  - `app\misconceptions.jsx`
  - `app\drill.jsx`
  - `checkout.html`

---

## Task 1: Freeze The Decision Boundary

**Files:**
- Modify: `C:\ABM\tasks\todo.md`

- [ ] **Step 1: Record the pivot**

Add this note under the active BMO pivot section:

```markdown
- 2026-06-13: User clarified that the old system was operated from `C:\BMO`; agents must inspect BMO junctions and old static app files before assuming the rebuilt Next app is the source of truth.
```

- [ ] **Step 2: Record the rollback rule**

Add this note under the same section:

```markdown
- Rollback rule: keep the current live deployment and clean deployed app worktree as the checkpoint until an old-base restoration candidate passes build, API contract checks, and live-route browser smoke. Do not overwrite live with static-site code just because it looks older.
```

- [ ] **Step 3: Verify tracker diff only**

Run:

```powershell
git -C C:\ABM diff -- tasks\todo.md
```

Expected: only the BMO pivot tracker section changes.

---

## Task 2: Produce A Functional Surface Matrix

**Files:**
- Create: `C:\ABM\reports\bmo-old-vs-current-functional-surface-2026-06-13.md`

- [ ] **Step 1: Inventory current app pages**

Run:

```powershell
Get-ChildItem -LiteralPath 'C:\barmatrix-app\.worktrees\old-app-marketing-transplant\app' -Directory |
  Select-Object -ExpandProperty Name |
  Sort-Object
```

Expected current top-level app surfaces include:

```text
account
boot-camps
certification
checkout
coach
dashboard
diagnostic
drills
flashcards
foundations
practice
pricing
red-zones
sign-in
sign-up
study
subjects
tensions
timed-sets
traps
```

- [ ] **Step 2: Inventory old static app functions**

Run:

```powershell
rg --files 'C:\barmatrix-site\app' | Sort-Object
```

Expected old reference functions include:

```text
C:\barmatrix-site\app\dashboard.jsx
C:\barmatrix-site\app\drill.jsx
C:\barmatrix-site\app\main.jsx
C:\barmatrix-site\app\matrix.jsx
C:\barmatrix-site\app\misconceptions.jsx
C:\barmatrix-site\app\pattern-board.jsx
C:\barmatrix-site\app\red-zones.jsx
C:\barmatrix-site\app\shell.jsx
```

- [ ] **Step 3: Create the matrix**

Write the report with these columns:

```markdown
| Capability | Old BMO/static source | Current Next source | API backed? | Launch decision | Notes |
| --- | --- | --- | --- | --- | --- |
```

Include at minimum these capabilities:

```text
Marketing homepage
Pricing
Checkout
Checkout success
Sign in/sign up
Account recovery/billing
Dashboard command deck
Lead Me/path
Subject mastery
Red-zone map
Tension matrix
Pattern mastery board
Misconceptions/wrong-answer forensics
Question history/recent attempts
All drills/library
Drill runner
Boot camps
Timed sets
Certification
Foundations/C3 method
Referral
Webinar/waitlist
```

- [ ] **Step 4: Classify each capability**

Use exactly one launch decision per row:

```text
Keep current
Port old behavior
Use old as visual reference
Defer after launch
Remove from launch nav
```

---

## Task 3: Choose The Base With A Reversible Test

**Files:**
- Modify only after Task 2 is reviewed:
  - `C:\barmatrix-app\.worktrees\old-app-marketing-transplant\app\dashboard\page.tsx`
  - `C:\barmatrix-app\.worktrees\old-app-marketing-transplant\app\dashboard\path\page.tsx`
  - `C:\barmatrix-app\.worktrees\old-app-marketing-transplant\app\dashboard\mastery\page.tsx`
  - `C:\barmatrix-app\.worktrees\old-app-marketing-transplant\app\dashboard\final-sprint\page.tsx`
  - any targeted tests under `C:\barmatrix-app\.worktrees\old-app-marketing-transplant\tests`

- [ ] **Step 1: Define the candidate decision**

Use this rule:

```text
If the current Next app already has the route, API hook, and auth/entitlement gate, keep the Next app and port only missing old behavior/copy.
If the current Next app only has a decorative placeholder and the old static app has a clearer functional workflow, port the workflow into Next with API-backed state where available.
If neither side has working state, keep it out of the paid launch path.
```

- [ ] **Step 2: Before editing, create a local checkpoint**

Run:

```powershell
git -C 'C:\barmatrix-app\.worktrees\old-app-marketing-transplant' status --short --branch
git -C 'C:\barmatrix-app\.worktrees\old-app-marketing-transplant' tag bmo-old-base-pivot-start-2026-06-13
```

Expected: clean worktree before the tag is created.

- [ ] **Step 3: Add focused regression tests before each port**

For every ported surface, add one test proving the user-facing promise. Example for dashboard:

```text
The paid dashboard must expose account, Lead Me, red-zone map, practice/drills, boot camps, timed sets, mastery, and certification entry points without replacing everything with a single enroll CTA.
```

- [ ] **Step 4: Verify locally**

Run:

```powershell
node --test tests\*.test.ts
npm run lint
npm run build
```

Expected: all tests pass, lint exits 0, build exits 0.

- [ ] **Step 5: Browser smoke the paid path**

Smoke these routes in a local production preview:

```text
/
/diagnostic
/pricing
/checkout
/checkout/success
/sign-in
/sign-up
/account
/dashboard
/dashboard/path
/dashboard/mastery
/dashboard/final-sprint
/red-zones
/traps
/tensions
/drills
/practice
/timed-sets
/certification
/foundations
```

Expected: no raw error text, no visible raw internal slug/enum labels in primary copy, no horizontal overflow, and each paid-program page has a coherent next action.

---

## Task 4: Keep Marketing Transplants Narrow

**Files:**
- Candidate current marketing files:
  - `C:\barmatrix-app\.worktrees\old-app-marketing-transplant\app\page.tsx`
  - `C:\barmatrix-app\.worktrees\old-app-marketing-transplant\app\pricing\page.tsx`
  - `C:\barmatrix-app\.worktrees\old-app-marketing-transplant\app\checkout\page.tsx`
  - `C:\barmatrix-app\.worktrees\old-app-marketing-transplant\app\checkout\checkout-client.tsx`
  - `C:\barmatrix-app\.worktrees\old-app-marketing-transplant\app\diagnostic\page.tsx`

- [ ] **Step 1: Preserve the new sales path only where it helps conversion**

Keep these principles:

```text
The homepage and sales pages should sell the diagnostic-first paid repair system.
The paid app after enrollment should feel like a working command center, not a marketing funnel.
Post-purchase and enrolled diagnostic-results views must not ask active students to enroll again.
```

- [ ] **Step 2: Avoid broad rewrites**

Do not rework styles, routing, or copy sitewide unless a test or browser smoke proves the current surface blocks enrollment, account access, or paid-program use.

- [ ] **Step 3: Verify the checkout/auth seam every time**

Run:

```powershell
node --test tests\checkout-success-state.test.ts tests\account-entitlement-state.test.ts tests\diagnostic-results-enrolled-cta.test.ts
```

Expected: enrolled users get dashboard/account next steps; signed-out users get a clear sign-in/account path; no enrolled diagnostic result displays a primary enrollment CTA.

---

## Task 5: Deploy Only After The Base Decision Is Proven

**Files:**
- Modify: `C:\ABM\tasks\todo.md`

- [ ] **Step 1: Verify private remotes before push/deploy**

Run:

```powershell
git -C 'C:\barmatrix-app\.worktrees\old-app-marketing-transplant' remote -v
gh repo view auronpep/barmatrix-app --json visibility,nameWithOwner
```

Expected: repo is `PRIVATE`.

- [ ] **Step 2: Commit with a base-decision message**

Run:

```powershell
git -C 'C:\barmatrix-app\.worktrees\old-app-marketing-transplant' status --short
git -C 'C:\barmatrix-app\.worktrees\old-app-marketing-transplant' add <only-files-from-this-task>
git -C 'C:\barmatrix-app\.worktrees\old-app-marketing-transplant' commit -m "Restore BMO paid app base"
```

Expected: commit contains only planned files.

- [ ] **Step 3: Deploy and tag**

Run deploy from the real app path or clean worktree, not the `C:\BMO\app-repo` junction:

```powershell
vercel deploy --prod --archive=tgz
git -C 'C:\barmatrix-app\.worktrees\old-app-marketing-transplant' tag live-bmo-old-base-restore-2026-06-13-<deployment-id>
```

Expected: production deployment is aliased to `https://barmatrix.app`, and the tag names the deployment ID.

- [ ] **Step 4: Live verification**

Verify live:

```text
https://barmatrix.app/
https://barmatrix.app/diagnostic
https://barmatrix.app/pricing
https://barmatrix.app/checkout
https://barmatrix.app/account
https://barmatrix.app/dashboard
https://barmatrix.app/dashboard/path
https://barmatrix.app/red-zones
https://barmatrix.app/drills
https://barmatrix.app/practice
```

Expected: current marketing path still sells enrollment; paid app path exposes the restored functional command center; no active buyer is sent back to an enroll CTA after checkout or diagnostic completion.

---

## Staff-Engineer Review Gate

Before calling this done, answer these in `C:\ABM\tasks\todo.md`:

```text
1. Which old BMO surfaces were kept only as reference?
2. Which current Next surfaces are API-backed and production-ready?
3. Which paid surfaces are still mocked, deferred, or hidden from launch nav?
4. What exact tag/commit is the rollback point?
5. What live browser evidence proves checkout -> account -> dashboard works?
```
