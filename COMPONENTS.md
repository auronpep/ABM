# COMPONENTS — ABM Core Component Spec

*Companion to REQUIREMENTS.md. Defines the exact file locations, props interfaces, and
wiring for every component the redesign needs. Written 2026-06-11.*

---

## Existing — verify before touching

```
src/components/
  Nav.tsx             — top nav; already wired to hash router + Clerk auth state
  Footer.tsx          — footer with brand closing line
  MiniDiagnostic.tsx  — 3-question inline diagnostic (homepage)
  DrillPlayer.tsx     — full TEAR forensics player (core loop)
  ScriptureBand.tsx   — ScriptureBand (full-width) + ScriptureInline (inline cite)
  ForensicsDemo.tsx   — marketing reveal demo
  RedZoneReveal.tsx   — marketing zone reveal demo
  SyncRoot.tsx        — API sync state wrapper
```

---

## New — build in this order

### Phase 1: Structural scaffolding

**`src/components/AuthGuard.tsx`**
```tsx
// Checks Clerk auth. If signed out, renders <SignInPrompt />.
// If signed in but not enrolled (no entitlement), renders <EnrollPrompt />.
// SignInPrompt and EnrollPrompt are small message blocks defined inline in this
// file — not separate component files.
// Props: children, requireEnrolled?: boolean
```
- Uses `useAuth()` from `@clerk/clerk-react`
- Unenrolled state: show a "This is for enrolled students" message with a link to `#/pricing`
- Signed-out state: show "Sign in to continue" with a link to `#/sign-in`

**`src/components/PageShell.tsx`**
```tsx
// Consistent layout wrapper for all content pages.
// Props: children, className?: string, narrow?: boolean
// Default: max-width container, horizontal padding, vertical section spacing
// narrow=true: tighter max-width for reading-heavy pages (program lessons, account)
```

**`src/components/SectionRule.tsx`**
```tsx
// The ▌ LABEL · 01 divider.
// Props: label: string, index?: number
// Renders: <div className="section-rule"><span>▌ {label}{index ? ` · ${index}` : ''}</span></div>
```
Extract from `Home.tsx` where it's currently inlined.

**`src/components/SubjectBadge.tsx`**
```tsx
// Colored chip for one of the 8 MBE subjects.
// Props: subject: Subject (the 8-value enum), size?: 'sm' | 'md'
// Each subject has a fixed color; see src/lib/subjects.ts (create alongside this)
```
Create `src/lib/subjects.ts`:
```ts
export const SUBJECTS = [
  'civil-procedure', 'constitutional-law', 'contracts',
  'criminal-law', 'criminal-procedure', 'evidence',
  'real-property', 'torts'
] as const;
export type Subject = typeof SUBJECTS[number];

export const SUBJECT_LABELS: Record<Subject, string> = {
  'civil-procedure':    'Civ Pro',
  'constitutional-law': 'Con Law',
  'contracts':          'Contracts',
  'criminal-law':       'Crim Law',
  'criminal-procedure': 'Crim Pro',
  'evidence':           'Evidence',
  'real-property':      'Property',
  'torts':              'Torts',
};
```

**`src/components/KeyCard.tsx`**
```tsx
// Renders a Gold or Silver Key with type badge.
// Props: kind: 'gold' | 'silver', text: string, label?: string
// Gold: brass-colored badge, doctrinal framing
// Silver: cool-metal badge, mechanical framing
// Text is the key itself — terse, directive ("fake weapon → pick assault")
```

**`src/components/EmptyState.tsx`**
```tsx
// Props: title: string, body?: string, cta?: { label: string; route: Route }
```

**`src/components/LoadingSpinner.tsx`**
```tsx
// Simple centered spinner. Props: label?: string
```

**`src/components/ErrorBoundary.tsx`**
```tsx
// React class component error boundary. Catches render/API failures on enrolled surfaces.
// Props: children, fallback?: ReactNode
// Default fallback: quiet "Something went wrong — try again" panel with a reload action.
// Wrap each routed page once (in App.tsx), not per-component.
```

---

### Phase 2: Question / drill components

**`src/components/QuestionCard.tsx`**
```tsx
// Single MBE question. Handles selection but not submission.
// Props:
//   stem: string
//   choices: Array<{ id: string; text: string }>
//   selected: string | null
//   correct: string | null        // null until revealed
//   onSelect: (id: string) => void
//   revealed: boolean
//
// When revealed=true: highlight correct green, selected-wrong red
// When revealed=false: highlight selected as "chosen" only
```
Currently this logic is split across `Diagnostic.tsx` and `DrillPlayer.tsx`.
Extract to a single shared component.

**`src/components/ForensicsPanel.tsx`**
```tsx
// Full TEAR forensics reveal after an attempt.
// Maps to the 4 TEAR stages:
//   1. Test — already happened (shows the question result)
//   2. Expose — names the counterfeit and why it pulled, INCLUDING the focus-group
//      comparison: "N% chose this answer" per choice (from the forensics payload).
//      This was the old site's core differentiator — do not omit it.
//   3. Apply — shows the relevant Gold or Silver Key
//   4. Repair — confirms the pattern is logged; shows next action
//
// Props:
//   forensics: ForensicsPayload   // from GET /api/attempts/{id}/forensics
//   onNext: () => void
//   isLast: boolean               // changes "Next" to "Finish"
```
Currently embedded in `DrillPlayer.tsx`. Extract so `Repair.tsx` and `#/program` can reuse it.

**`src/components/ConfidenceSelector.tsx`**
```tsx
// 1–5 confidence picker shown after answering, before revealing.
// Props: value: number | null, onChange: (n: number) => void
// Labels: 1=Guessing · 2=Unsure · 3=Felt it · 4=Confident · 5=Certain
```

**`src/components/TimerBar.tsx`**
```tsx
// Countdown bar + digital readout. Props: totalSeconds: number, onExpire: () => void
// Already implemented inside Repair.tsx — extract here.
```

**`src/components/ProgressBar.tsx`**
```tsx
// "Drill 3 of 6" style linear progress.
// Props: current: number, total: number, label?: string
```

---

### Phase 3: Tensions + Traps

**`src/components/SubjectFilter.tsx`**
```tsx
// Filter pills for the 8 MBE subjects. "All" + each subject.
// Props: value: Subject | 'all', onChange: (v: Subject | 'all') => void
```

**`src/components/TensionCard.tsx`**
```tsx
// List card for one tension point.
// Props: tension: TensionSummary (id, slug, subject, headline, official, questionCount)
// Clicking navigates to #/tensions/:slug
```

**`src/components/TrapCard.tsx`**
```tsx
// List card for one trap.
// Props: trap: TrapSummary (id, slug, subject, kind: 'forensic'|'misconception', pullCount)
// Clicking navigates to #/traps/:slug
```

**`src/components/TensionDetail.tsx`**
```tsx
// Full tension detail layout.
// Props: tension: TensionDetail (all fields from GET /api/tensions/:slug)
// Sections: collision description (markdown), example questions (list), assigned drill CTA
```

**`src/components/TrapDetail.tsx`**
```tsx
// Full trap detail layout.
// Props: trap: TrapDetail (all fields from GET /api/traps/:slug)
// Sections: why it pulls, failure mode, example wrong answers, assigned drill CTA
```

---

### Phase 4: Dashboard / enrolled

> **Spine + glass rule (REQUIREMENTS §3B):** the dashboard's only *actions* are the Resume
> card and the repair target. Everything else on this page is glass — read-only insight whose
> CTA routes back to the prescribed next step, never to a picker. The dashboard header also
> carries the exam-runway pacing line ("at this pace, full coverage by …") — quiet context,
> never countdown-pressure copy.

**`src/components/DayPlanCard.tsx`**
```tsx
// Today's step — lesson or drill or repair target.
// Props: step: DayPlanStep
// The primary CTA on the dashboard — "Resume" is always visible
```

**`src/components/RepairTarget.tsx`**
```tsx
// Highlights the #1 current weak zone.
// Props: zone: RedZone | null
// zone=null: "No active repair targets — keep practicing"
// zone: shows zone name, proficiency %, last-miss subject, CTA → #/repair
```

**`src/components/CoverageRing.tsx`**
```tsx
// Circular progress ring for TEAR coverage.
// Props: percent: number (0–100), label?: string
// Single clean metric — replaces gamification rings
// percent = coverage from GET /api/me/c3
```

**`src/components/SubjectMasteryPanel.tsx`**
```tsx
// Per-subject mastery — glass layer on the dashboard.
// Props: subjects: Array<{ subject: Subject; pct: number; delta: number }>
// 8 rows: SubjectBadge + % correct + 7-day trend delta arrow.
// Data from GET /api/me/dashboard. Row CTA routes to the prescribed next step
// for that subject's weakest zone — not to a drill picker.
```

**`src/components/PersonalMatrix.tsx`**
```tsx
// The student's personal tension matrix — 8 subjects (rows) × trap dimensions (cols)
// heat grid. Old site's signature visual; lives on #/mastery.
// Props: matrix: { cols: string[]; rows: Array<{ subject: Subject; heat: number[] }> }
// Heat 0–5; cells ≥3 visually flagged. Read-only — clicking a hot cell routes to the
// prescribed repair for that zone.
// Data from GET /api/me/c3 / dashboard payload — confirm exact field when porting api-client.
```

**`src/components/RecentAttempts.tsx`**
```tsx
// Last N attempts. Props: attempts: RecentAttempt[]
// Each row: subject badge, correct/wrong icon, time spent, question preview
```

**`src/components/ZoneCard.tsx`**
```tsx
// A single weak zone. Props: zone: RedZone
// Shows: subject, zone name (tension/trap slug), proficiency %, high-confidence misses
// CTA → assigned drill or #/red-zones/:slug
```

**`src/components/LessonCard.tsx`**
```tsx
// TEAR lesson progress card.
// Props: lesson: FoundationsLesson (slug, title, part, complete, drillCount)
// complete=true: brass checkmark; in-progress: partial bar; not-started: plain
```

**`src/components/DrillSetCard.tsx`**
```tsx
// A prescribed drill set.
// Props: drillSet: { name: string; count: number; zone?: string; route: Route }
// CTA → starts the drill set
```

---

### Phase 5: Account

**`src/components/AccountStatus.tsx`**
```tsx
// Enrollment status + plan info.
// Props: status: AccountStatus from GET /api/me/dashboard (enrolled, plan, nextPayment)
```

**`src/components/BillingPortalButton.tsx`**
```tsx
// Triggers POST /api/billing/create-portal-session → redirect to Stripe portal.
// No props.
```

**`src/components/EnrollmentRecovery.tsx`**
```tsx
// Recovery panel for students who paid but aren't enrolled.
// Reads ?checkout_session_id from URL.
// Calls GET /api/checkout/:sessionId/status; if not fulfilled, shows recover button.
// Calls POST /api/checkout/:sessionId/recover on click.
```

---

## lib/ additions needed

**`src/lib/api-client.ts`** — Port from old site (`C:\barmatrix-app\lib\api-client.ts`).
Trim to only the endpoints ABM will call. Add Clerk token injection (the old site's pattern:
`Authorization: Bearer ${token}` in every Clerk-gated call, token from `useAuth().getToken()`).

**`src/lib/subjects.ts`** — Subject enum + labels (spec above).

**`src/lib/markdown.ts`** — Markdown → React renderer for tension/trap/lesson body copy.
Old site has `lib/markdown.tsx` (uses no external parser, just regex transforms for the
simple markdown in API responses). Port it.

**`src/lib/use-clerk-auth.ts`** — Thin hook that calls `useAuth().getToken()` and memoizes it.
Old site's pattern is stable; port the hook as-is.

**`src/lib/use-api.ts`** — Generic data fetching hook wrapping the typed API client.
Signature: `useApi<T>(fn: () => Promise<T>): { data: T | null, loading: boolean, error: string | null }`.
Used by all enrolled surfaces to load their data.

---

## types.ts additions

Extend `src/types.ts` with:
```ts
// Add to existing Route union:
export type Route =
  | 'home' | 'how-it-works' | 'pricing' | 'diagnostic' | 'drills'
  | 'welcome' | 'repair' | 'prayer-chain' | 'sign-in' | 'sign-up'
  // New public:
  | 'tensions' | 'tensions-detail'
  | 'traps' | 'traps-detail'
  | 'subjects' | 'subjects-detail'
  | 'about' | 'faq' | 'terms' | 'privacy' | 'refund'
  | 'webinar' | 'waitlist' | 'referral'
  // New enrolled:
  | 'dashboard' | 'program' | 'program-lesson'
  | 'red-zones' | 'red-zone-detail'
  | 'coach' | 'mastery' | 'account';
```

When adding slug-based routes, extend the router to carry a `slug?: string` param alongside
the `Route` — or adopt `wouter` (recommended in REQUIREMENTS §8).
