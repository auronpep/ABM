# ABM Core Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the five-phase core component spec in `COMPONENTS.md` while preserving the current launch, diagnostic, repair, checkout, and dashboard flows.

**Architecture:** Add reusable components and typed data helpers as additive modules, then wire only stable route-level shells into `App.tsx`. Existing diagnostic and repair code remains the behavioral source of truth unless a shared component can be introduced without changing the student flow.

**Tech Stack:** React 18, TypeScript, Vite, Clerk, hash routing, existing CSS design tokens, browser `fetch`.

---

### Task 1: Regression Harness And Tracker

**Files:**
- Create: `scripts/core_components_check.mjs`
- Modify: `tasks/todo.md`

- [ ] Add a Node regression script that checks for all phase component files, required lib files, route union additions, router entries, and safety constraints such as no exposed focus-group pick-rate copy.
- [ ] Run `node scripts/core_components_check.mjs` and confirm it fails before implementation because the new files and routes are missing.
- [ ] Update `tasks/todo.md` with the phase checklist and verification log.

### Task 2: Phase 1 Structural Scaffolding

**Files:**
- Create: `src/lib/subjects.ts`
- Create: `src/components/AuthGuard.tsx`
- Create: `src/components/PageShell.tsx`
- Create: `src/components/SectionRule.tsx`
- Create: `src/components/SubjectBadge.tsx`
- Create: `src/components/KeyCard.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `src/components/LoadingSpinner.tsx`
- Create: `src/components/ErrorBoundary.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] Implement subject constants, labels, and stable chip metadata.
- [ ] Add layout, auth, empty/loading/error primitives that match existing visual tokens.
- [ ] Replace Home's inline section-rule markup with `SectionRule`.
- [ ] Run the regression script and TypeScript check.

### Task 3: Phase 2 Question And Drill Components

**Files:**
- Create: `src/components/QuestionCard.tsx`
- Create: `src/components/ForensicsPanel.tsx`
- Create: `src/components/ConfidenceSelector.tsx`
- Create: `src/components/TimerBar.tsx`
- Create: `src/components/ProgressBar.tsx`
- Modify: `src/pages/Practice.tsx`

- [ ] Add shared question choice rendering with selected/revealed/correct states.
- [ ] Add TEAR forensics, confidence, timer, and progress primitives.
- [ ] Wire Practice runner through `QuestionCard`, `ConfidenceSelector`, and `ForensicsPanel` while preserving the existing API attempt flow.
- [ ] Run the regression script and TypeScript check.

### Task 4: Phase 3 Tensions And Traps

**Files:**
- Create: `src/components/SubjectFilter.tsx`
- Create: `src/components/TensionCard.tsx`
- Create: `src/components/TrapCard.tsx`
- Create: `src/components/TensionDetail.tsx`
- Create: `src/components/TrapDetail.tsx`
- Create: `src/pages/Tensions.tsx`
- Create: `src/pages/Traps.tsx`
- Modify: `src/types.ts`
- Modify: `src/App.tsx`

- [ ] Add public list/detail components with subject filtering and route callbacks.
- [ ] Add `#/tensions`, `#/tensions/:slug`, `#/traps`, and `#/traps/:slug` route handling.
- [ ] Use graceful empty/error states when API data is unavailable.
- [ ] Run the regression script and TypeScript check.

### Task 5: Phase 4 Dashboard And Enrolled Components

**Files:**
- Create: `src/components/DayPlanCard.tsx`
- Create: `src/components/RepairTarget.tsx`
- Create: `src/components/CoverageRing.tsx`
- Create: `src/components/SubjectMasteryPanel.tsx`
- Create: `src/components/PersonalMatrix.tsx`
- Create: `src/components/RecentAttempts.tsx`
- Create: `src/components/ZoneCard.tsx`
- Create: `src/components/LessonCard.tsx`
- Create: `src/components/DrillSetCard.tsx`
- Create: `src/pages/Mastery.tsx`
- Create: `src/pages/Program.tsx`
- Create: `src/pages/RedZones.tsx`
- Create: `src/pages/Coach.tsx`
- Modify: `src/types.ts`
- Modify: `src/App.tsx`

- [ ] Add enrolled insight components as glass/read-only surfaces with CTAs back to prescribed next actions.
- [ ] Add route shells for dashboard-adjacent enrolled pages behind `AuthGuard`.
- [ ] Preserve the existing one-primary-action dashboard rule.
- [ ] Run the regression script and TypeScript check.

### Task 6: Phase 5 Account And API Helpers

**Files:**
- Create: `src/lib/api-client.ts`
- Create: `src/lib/markdown.tsx`
- Create: `src/lib/use-clerk-auth.ts`
- Create: `src/lib/use-api.ts`
- Create: `src/components/AccountStatus.tsx`
- Create: `src/components/BillingPortalButton.tsx`
- Create: `src/components/EnrollmentRecovery.tsx`
- Create: `src/pages/Account.tsx`
- Modify: `src/types.ts`
- Modify: `src/App.tsx`

- [ ] Add trimmed typed API client helpers using existing `apiFetch` and Clerk bearer tokens.
- [ ] Add dependency-free markdown rendering.
- [ ] Add account, billing portal, and enrollment recovery components.
- [ ] Add `#/account` route behind `AuthGuard`.
- [ ] Run the regression script, production build, and local route smoke checks.

### Review Checklist

- [ ] Every file named in `COMPONENTS.md` exists or is intentionally represented by an existing equivalent.
- [ ] New route entries compile and route hash slugs are carried as `slug?: string`.
- [ ] No focus-group percentages are displayed in user-facing forensics.
- [ ] Existing `#/diagnostic`, `#/drills`, `#/practice`, `#/repair`, `#/welcome`, and `#/dashboard` flows still build.
- [ ] `node scripts/core_components_check.mjs` passes.
- [ ] `npm run build` passes.
