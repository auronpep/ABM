# REQUIREMENTS — ABM Redesign

*Written 2026-06-11. Source-of-truth for what the redesigned site must cover.
Authority order: VISION → PRODUCT → POSITIONING → LEXICON → this doc.*

This is a **redesign, not a rebuild.** The plumbing (api.barmatrix.app, Clerk, Stripe, MySQL) is
unchanged. The content, brand, and product framing reset to zero. The old site's features are the
inventory; the new framing is TEAR + Keys + Counterfeit.

---

## 1. What carries over (plumbing)

| Item | Status | Notes |
|---|---|---|
| **API** — `api.barmatrix.app` | Carry over | Same endpoints, same contracts. The old site's `C:\barmatrix-app\lib\api-client.ts` is the typed contract — it does **not** exist in ABM yet; port it in Phase 1 (build order step 3). |
| **Clerk auth** | Carry over | `@clerk/clerk-react` already installed. Public routes are anonymous; enrolled surfaces require a Clerk token. |
| **Stripe** | Carry over | `public/checkout.html` exists. Stripe product/price/key config is founder-owned. |
| **PostHog analytics** | Carry over | `lib/events.ts` typed union exists. Add events as features land. |
| **Sentry** | Add when live | Not yet wired. Add before first real launch. |
| **MariaDB / MySQL** | Unchanged | API owns the DB; the frontend never touches it directly. |

## 2. What does NOT carry over

- All C3 terminology (C3, Foundations "The Method" branding, molds, families, EAR/CUT/CLASH/CALL in that framing)
- All old marketing copy (headlines, body copy, positioning claims)
- All old landing pages (`public/lp-*.html`) — replace with new audience-specific pages
  - ⚠️ **Action item:** the 26 old `lp-*.html` files are still in `public/` and still deployed
    with old C3 positioning. Remove them (or `noindex` + unlink) **now**, ahead of the Phase 5
    replacement pages — do not leave old-brand claims live during the redesign.
- Boot camp gamification framing (XP, streaks, badges as primary motivators — the new framing is Sanctuary: no guilt/streak pressure)

Vocabulary mapping (old → new):

| Old | New |
|---|---|
| C3 / The Method | TEAR |
| Foundations course | TEAR program / course |
| Molds | Tension Points (internal) |
| Families (EAR, ISSUE_SENSE…) | — (internal only, not surfaced) |
| Wrong-answer forensics | Expose the counterfeit |
| Red Zone | Weak zone / repair target |
| Drill → drill | Drill → same word, new framing |
| Boot camp | TBD — not in PRODUCT.md; defer until founder scopes |

---

## 3. Route inventory — what to build

Routes use the existing hash-based SPA router (`App.tsx`). Add routes to the `ROUTES` array
and render them as conditional blocks. New routes that need Clerk-gating should check auth state
before rendering content.

### 3A. Already built (verify and polish)

| Route | Page | Status |
|---|---|---|
| `#/` | `Home.tsx` | Built. Verify mini-diagnostic, TEAR method section, pricing anchor, scripture integration. |
| `#/how-it-works` | `HowItWorks.tsx` | Built. |
| `#/pricing` | `Pricing.tsx` | Built. |
| `#/diagnostic` | `Diagnostic.tsx` | Built. Full 18-question flow. |
| `#/drills` | `Drill.tsx` | Built. Wraps `DrillPlayer.tsx`. |
| `#/welcome` | `Welcome.tsx` | Built. Post-purchase / post-diagnostic guided resume. |
| `#/repair` | `Repair.tsx` | Built. Repair loop + retest. Chromeless. |
| `#/prayer-chain` | `PrayerChain.tsx` | Built. |
| `#/sign-in` / `#/sign-up` | `Auth.tsx` | Built. Clerk components. |
| `#/practice` | `Practice.tsx` | Built (2026-06-12). Practice runner with per-question interaction recorder + forensics dwell telemetry. |
| `#/dashboard` | `Welcome.tsx` (`mode="dashboard"`) | Built (2026-06-12) as an interim shell. The full §3B dashboard (DayPlanCard, RepairTarget, SubjectMasteryPanel, RecentAttempts) replaces this. |

### 3B. Required — not yet built

**Public surfaces:**

| Route | Purpose | Maps from old site |
|---|---|---|
| `#/tensions` | Tension catalog — browse all tension points by subject | `/tensions` |
| `#/tensions/:slug` | Tension detail — the collision, why it pulls, example questions | `/tensions/[slug]` |
| `#/traps` | Trap catalog — browse forensic + misconception traps | `/traps` |
| `#/traps/:slug` | Trap detail — why it pulls, example wrong answers | `/traps/[slug]` |
| `#/subjects` | Subject landing hub — 8 MBE subjects, each with a coverage snapshot | `/subjects` |
| `#/subjects/:slug` | Per-subject page — key tension points, common traps, drill entry | `/subjects/[slug]` |
| `#/about` | About / mission page | `/about` |
| `#/faq` | FAQ — also absorbs the old help page (`public/help.html` stays static until then) | `/faq`, `/help` |
| `#/terms` / `#/privacy` / `#/refund` | Legal + refund policy. Static `public/terms.html`, `privacy.html`, `refund.html` already exist — keep serving them and link all three in the footer until SPA versions land. | `/terms`, `/privacy`, refund window |

> **Note — no subjects API:** there is no `/api/subjects` endpoint. Subject pages compose from
> `GET /api/tensions?subject=` and `GET /api/traps?subject=` filters.

**Enrolled experience model — the spine and the glass:**

"Lead me, no choice" is the main path. Every enrolled surface has exactly **one primary action**;
the dashboard opens with the Resume card (today's day-plan step) plus the current #1 repair
target, and drills are always prescribed, never browsed. Around that spine sits a **glass
layer** — read-only insight panels (weak-zone map, subject mastery, personal tension matrix,
trap profile, quiet milestones) that let a $999 student see exactly where they stand. Glass
panels never open a picker: every CTA routes back to the prescribed next step. Sanctuary rule
throughout — maps and mirrors, not scoreboards.

**Enrolled surfaces (Clerk-gated):**

| Route | Purpose | Maps from old site |
|---|---|---|
| `#/dashboard` | Student home — day plan, progress, assigned drills. (Interim shell live since 2026-06-12 — Welcome in dashboard mode; this row is the full build.) | `/dashboard` |
| `#/program` | TEAR program hub — current lesson + next repair target | `/foundations` → re-framed as TEAR |
| `#/program/:slug` | TEAR lesson content + embedded drills | `/foundations/[slug]` |
| `#/red-zones` | Weak-zone library — the student's repair map | `/red-zones` |
| `#/red-zones/:slug` | Zone detail + drill entry | `/red-zones/[dimension]/[tag]` |
| `#/coach` | Adaptive next-step — guided Resume action | `/coach` |
| `#/mastery` | TEAR readiness — three sections: coverage ring, personal tension matrix (8-subject × trap-dimension heat grid), personal trap profile ("the counterfeits that pull you") | `/dashboard/mastery`, personal matrix, misconceptions profile |
| `#/account` | Billing portal, enrollment recovery | `/account` |

**Engagement / lead capture:**

| Route | Purpose | Maps from old site |
|---|---|---|
| `#/webinar` | Webinar lead capture | `/webinar` |
| `#/waitlist` | Waitlist signup | `/waitlist` |
| `#/referral` | Referral share | `/referral` |

### 3C. Defer — do not build yet

| Item | Reason |
|---|---|
| Certification surface | Phase 4 — no content authored |
| Boot camps | Not in PRODUCT.md; founder must scope |
| `#/partners` — partner/influencer page | Key old funnel arm (`/partners`: tutor/influencer program, FTC disclosure). Do not drop silently — founder must re-scope partner economics under the new brand first. |
| Webinar replay (`/webinar-replay`) | Needs recorded content under the new brand first |
| Timed mixed sets | Lower priority than TEAR core loop |
| Final sprint mode | Exam-week feature, needs content |
| Knowledge search | Internal tooling, not student-facing yet |

---

## 4. Component inventory — what to build

### 4A. Already built — verify, do not rebuild

| Component | File | Notes |
|---|---|---|
| Nav | `components/Nav.tsx` | |
| Footer | `components/Footer.tsx` | |
| MiniDiagnostic | `components/MiniDiagnostic.tsx` | 3-question inline diagnostic on homepage |
| DrillPlayer | `components/DrillPlayer.tsx` | TEAR forensics player — the core question+reveal UI |
| ScriptureBand | `components/ScriptureBand.tsx` | Scripture quote stripe; `ScriptureInline` variant |
| ForensicsDemo | `components/ForensicsDemo.tsx` | Marketing demo of the forensics reveal |
| RedZoneReveal | `components/RedZoneReveal.tsx` | Marketing demo of zone reveal |
| SyncRoot | `components/SyncRoot.tsx` | API sync state wrapper |

### 4B. Required — build in order listed

**Structural / shared:**

| Component | Purpose | Notes |
|---|---|---|
| `AuthGuard` | Wraps enrolled routes; shows sign-in prompt if no Clerk token | Use `useAuth()` from `@clerk/clerk-react`; redirect to `#/sign-in` on no session |
| `PageShell` | Consistent max-width + vertical padding wrapper | Most pages reuse the same container/section grid |
| `SectionRule` | The `▌ LABEL · 01` divider used throughout the home page | Extract from `Home.tsx` into a shared component |
| `SubjectBadge` | Colored chip for the 8 MBE subjects | Consistent subject color mapping across tensions, traps, drills |
| `KeyCard` | Renders a Gold or Silver Key with its type badge | Used in drill forensics, tension detail, trap detail, repair loop |
| `EmptyState` | "Nothing here yet" placeholder for enrolled surfaces with no data | |
| `LoadingSpinner` | Consistent loading state | |
| `ErrorBoundary` | Catch API failures gracefully | |

**Question / drill:**

| Component | Purpose | Notes |
|---|---|---|
| `QuestionCard` | Renders a single MBE question stem + 4 answer choices | Core UI — used in diagnostic, drills, practice, retest |
| `ForensicsPanel` | Full TEAR forensics reveal after an attempt | TEAR stages: Expose → Apply → Repair. Already partially in `DrillPlayer.tsx` |
| `ConfidenceSelector` | The 1–5 confidence picker shown after answering | Carried from old site; part of the attempt POST payload |
| `TimerBar` | Countdown timer for timed retest sets | Already used in `Repair.tsx`; extract to reuse |
| `ProgressBar` | "Drill 3 of 6" drill-set progress indicator | |

**Tensions + Traps:**

| Component | Purpose | Notes |
|---|---|---|
| `TensionCard` | List-item card for a tension — subject, headline, official flag | Used in catalog `#/tensions` |
| `TrapCard` | List-item card for a trap — kind (forensic/misconception), subject distribution | Used in catalog `#/traps` |
| `TensionDetail` | Full tension detail layout — collision description, example questions | Used at `#/tensions/:slug` |
| `TrapDetail` | Full trap detail layout — why it pulls, example wrong answers | Used at `#/traps/:slug` |
| `SubjectFilter` | Filter bar for the 8 MBE subjects | Shared between tensions, traps, drills, subjects |

**Dashboard / enrolled:**

| Component | Purpose | Notes |
|---|---|---|
| `DayPlanCard` | Shows today's step(s) — lesson or drill or repair | Maps from old `day-cards.tsx` |
| `RepairTarget` | Highlights the current highest-priority weak zone | Top of dashboard; routes to `#/repair` |
| `CoverageRing` | Circular progress ring for overall TEAR coverage | Replace old gamification rings with this single clean metric |
| `SubjectMasteryPanel` | Per-subject mastery — 8 subjects, % correct + trend delta | Glass layer on dashboard; data from `GET /api/me/dashboard`. Old-site dashboard staple — the lone ring is too thin for $999. |
| `PersonalMatrix` | 8-subject × trap-dimension heat grid — the student's personal tension matrix | Glass layer on `#/mastery`; old site's signature visual. Data from `GET /api/me/c3` / dashboard payload (confirm field when porting api-client). |
| `RecentAttempts` | Last N attempts with correct/wrong, subject, time | Used in dashboard |
| `ZoneCard` | Weak-zone card — subject, proficiency, miss count | Used in `#/red-zones` |
| `LessonCard` | TEAR lesson card — part, number, progress state | Used in `#/program` |
| `DrillSetCard` | Prescribed drill set card — zone name, drill count | Used in dashboard + red zones |

**Account:**

| Component | Purpose | Notes |
|---|---|---|
| `AccountStatus` | Enrollment status, plan, next payment | Maps from old `account-status.tsx` |
| `BillingPortalButton` | Opens Stripe customer portal | Maps from old `billing-portal-button.tsx` |
| `EnrollmentRecovery` | Recovery panel for checkout-without-auth | Maps from old `enrollment-recovery.tsx`; uses `GET /api/checkout/:sessionId/status` |

---

## 5. API endpoints the frontend must consume

The old site's `lib/api-client.ts` is the contract. ABM already calls the diagnostic endpoints.
Below is the full list grouped by feature surface and enrollment gate.

### Public (anonymous)

| Endpoint | Surface | Notes |
|---|---|---|
| `POST /api/diagnostic/start` | Diagnostic | ✅ Already used |
| `POST /api/diagnostic/session/{id}/attempt` | Diagnostic | ✅ Already used |
| `GET /api/diagnostic/{id}/results` | Diagnostic | ✅ Already used |
| `GET /api/questions/{id}` | Drills, diagnostic | ✅ Already used |
| `POST /api/attempts` | Drills, diagnostic | ✅ Already used |
| `GET /api/attempts/{id}/forensics` | DrillPlayer forensics reveal | ✅ Already used |
| `GET /api/tensions` | Tension catalog | Not yet wired |
| `GET /api/tensions/{slug}` | Tension detail | Not yet wired |
| `GET /api/tensions/{slug}/questions` | Tension detail questions | Not yet wired |
| `GET /api/traps` | Trap catalog | Not yet wired |
| `GET /api/traps/{slug}` | Trap detail | Not yet wired |
| `GET /api/cohort/status` | Pricing page, checkout | Not yet wired |
| `POST /api/checkout/create-session` | Checkout | Exists in `public/checkout.html` |
| `GET /api/checkout/{sessionId}/status` | Post-purchase | Not yet wired |
| `POST /api/checkout/{sessionId}/recover` | Enrollment recovery | Not yet wired |
| `POST /api/webinar/leads` | Webinar lead capture | Not yet wired |
| `POST /api/diagnostic/lead` | Post-diagnostic email capture | Not yet wired |

### Enrolled (Clerk token required)

| Endpoint | Surface | Notes |
|---|---|---|
| `GET /api/me/dashboard` | Dashboard | Not yet wired |
| `GET /api/me/day-plan` | Dashboard day plan | Not yet wired |
| `POST /api/me/day-plan/steps/{id}/complete` | Dashboard | Not yet wired |
| `GET /api/me/red-zones` | Red zones library | Not yet wired |
| `GET /api/me/red-zones/zone` | Zone detail | Not yet wired |
| `GET /api/drills/prescribed` | Dashboard, red zones | Not yet wired |
| `POST /api/drills/start` | Repair loop, drills | Not yet wired |
| `GET /api/drills/{id}` | DrillPlayer | Not yet wired |
| `POST /api/drills/{id}/complete` | DrillPlayer | Not yet wired |
| `GET /api/me/c3/next` | Coach / guided resume | Not yet wired (rename C3 → TEAR internally, same endpoint) |
| `GET /api/me/c3` | Mastery surface | Not yet wired |
| `GET /api/foundations` | TEAR program outline | Not yet wired |
| `GET /api/foundations/{slug}` | TEAR lesson content | Not yet wired |
| `POST /api/me/foundations/{slug}` | Mark lesson complete | Not yet wired |
| `POST /api/foundations/{slug}/attempts` | Grade TEAR drill item | Not yet wired |
| `GET /api/me/traps` | Personal trap profile (mastery surface) | Not yet wired |
| `GET /api/me/traps/{slug}` | Personal trap detail | Not yet wired |
| `POST /api/billing/create-portal-session` | Account billing | Not yet wired |

---

## 6. Content system — what to extend

Content lives in `src/content/*.ts`. The pattern: locked copy flows through typed constants,
never hard-coded inline.

| File | What it holds | Status |
|---|---|---|
| `brand.ts` | Brand name, hero copy, thesis, closing line, nav labels | ✅ Built |
| `scripture.ts` | All scripture references (verse text + reference) | ✅ Built |
| `home.ts` | Home page section copy | ✅ Built |
| `pricing.ts` | Pricing copy, plan details, guarantee text | ✅ Built |
| `diagnostic.ts` | Diagnostic UI copy | ✅ Built |
| `curated-diagnostic.ts` | Curated 3-question mini-diagnostic seed | ✅ Built |
| `demo.ts` | ForensicsDemo content | ✅ Built |
| `tensions.ts` | Static UI copy for the tensions catalog | Add when building `#/tensions` |
| `subjects.ts` | Subject hub copy — per-subject blurbs, coverage snapshot labels | Add when building `#/subjects` |
| `traps.ts` | Static UI copy for the traps catalog | Add when building `#/traps` |
| `program.ts` | TEAR program / course UI copy | Add when building `#/program` |
| `dashboard.ts` | Dashboard section labels, empty states | Add when building `#/dashboard` |
| `account.ts` | Account page copy | Add when building `#/account` |

---

## 7. Style / design constraints

- **Type scale:** uses CSS custom properties set in `src/styles/`. Do not use Tailwind (the old site used Tailwind v4; ABM uses a custom CSS system built by `scripts/build_styles.mjs`).
- **Colors:** vermilion (primary CTA), brass (secondary / success), off-white background. See existing style files.
- **Scripture integration:** `ScriptureBand` and `ScriptureInline` are the two approved patterns. Do not bolt on quotes ad-hoc.
- **Sanctuary rule:** no streaks, no guilt, no shame copy. The repair loop already follows this (verified). Every new surface must too.
- **Bounce test:** the copy should make a neutral non-Christian reader feel this isn't for them. This is a design goal, not a risk.
- **No content guardrails:** do not add legal hedges, claim-safety notes, or pending-review language to any user-facing copy. (HANDOFF.md standing rule.)

---

## 8. Routing architecture note

The current SPA uses `window.location.hash` for routing — a `routeFromHash()` function in `App.tsx`
maps `#/slug` to a `Route` type. Slug routes (tensions detail, traps detail, subjects detail, program
lessons) will need a parameterized pattern. Options:

**Option A — extend hash router** to support `#/tensions/hearsay-purpose` by parsing the segment after the first `/`. Minimal change, no new deps.

**Option B — add a router library** (`react-router-dom` v7, `wouter`). Cleaner for 15+ routes with params.

**Recommendation:** adopt `wouter` (2.1 kB, zero deps, hooks-based, works in Vite + hash mode).
Wire it in `App.tsx` before building any slug-based routes.

**404 handling:** unknown hashes currently fall back to `home` silently. When migrating the
router, render a not-found state instead (a static `public/404.html` already exists for
non-SPA paths).

---

## 9. Build order recommendation

Phase 1 — **Foundations** (unblock everything else):
1. Add `wouter` hash router; migrate existing routes
2. Build `AuthGuard`, `PageShell`, `SectionRule`, `SubjectBadge`, `KeyCard`
3. Wire `lib/api-client.ts` (port the typed client from the old site, trim to only what ABM needs)

Phase 2 — **Public catalog surfaces**:
4. `#/tensions` + `#/tensions/:slug` — `TensionCard`, `TensionDetail`, `SubjectFilter`
5. `#/traps` + `#/traps/:slug` — `TrapCard`, `TrapDetail`
6. `#/subjects` + `#/subjects/:slug`

Phase 3 — **Enrolled core loop**:
7. `#/dashboard` — `DayPlanCard`, `RepairTarget`, `RecentAttempts`, `SubjectMasteryPanel`
8. `#/program` + `#/program/:slug` — `LessonCard`, TEAR lesson renderer
9. `#/red-zones` + `#/red-zones/:slug` — `ZoneCard`, `DrillSetCard`
10. `#/coach` — guided Resume; thin wrapper on `GET /api/me/c3/next`

Phase 4 — **Account + engagement**:
11. `#/account` — `AccountStatus`, `BillingPortalButton`, `EnrollmentRecovery`
12. `#/webinar`, `#/waitlist`, `#/referral`
13. `#/mastery` — `CoverageRing`, `PersonalMatrix`, trap profile

Phase 5 — **Polish + launch**:
14. Sentry wiring
15. Landing pages (`public/lp-*.html`) — new audience-specific pages replacing old ones
16. SEO: `sitemap`, `robots.txt`, canonical meta
17. Performance audit

---

## 10. What the old site has that ABM must not replicate

These were on the old site but are explicitly out of scope or redesigned away:

| Old feature | Why it's out |
|---|---|
| Old C3 forensics terminology in UI | Replaced by TEAR. Internal vocab only. |
| Gamification (XP, streaks, badge shelf) | Sanctuary rule — causes guilt/pressure. Replace with quiet coverage progress only. |
| Landing pages with old positioning | All copy resets. New pages only. |
| `/app` redirect page | Simplify — dashboard is the entry point |
| Tension ISR + complex Next.js caching | Vite SPA — no SSR, no ISR |
| Boot camp catalog (as currently built) | Not in PRODUCT.md; defer |
| `/certification` (Phase 4) | No content authored |
| Timed sets as a separate surface | Part of repair loop; not a standalone menu item |
