# Product Mechanics & Data Model

The engineering/product assets from the old prototype — the most expensive things to lose. Source: `uploads/03_APP_PRD_AND_DATA_MODEL_REVISED.md` (only survives inside the big build packet), plus `app/*.js(x)` and `operator/*.jsx`.

> The apps (web/iOS/Android) were designed as **clients of one shared backend** — one account, entitlement, question bank, diagnostic, and analytics layer. Apps are clients, not separate products.

---

## 1. Canonical data model (Postgres, 11 tables)

### `students`
`student_id` uuid (shared across platforms) · `email` text (unique login) · `name` text · `jurisdiction` text · `exam_date` date · `first_time_repeat` text · `full_course_used` text · `created_at` timestamp · `consent_flags` jsonb (privacy/outcome/testimonial) · `attributed_partner_id` uuid · `attributed_campaign_id` text.

### `questions`
`question_id` text · `subject` text · `topic` text · `subtopic` text · `rule_id` text (opt) · `tension_point_id` text (**matrix mapping → POE-### tension**) · `difficulty` numeric · `status` text (`active`/`hidden`/`retired`) · `version` integer.

### `answer_choices`
`choice_id` text · `question_id` text FK · `letter` text (A/B/C/D) · `text` text · `is_correct` boolean · `forensic_tags` jsonb (**wrong-answer types = the "counterfeit" classification**) · `misconception_tags` jsonb (student-language) · `student_explanation` text · `instructor_note` text.

### `student_attempts`
`attempt_id` uuid · `student_id` FK · `question_id` FK · `selected_choice_id` FK · `correct` boolean · `confidence` integer (**1–5, required** for diagnostic value) · `time_seconds` integer · `platform` text (`web`/`ios`/`android`) · `set_id` uuid (opt) · `attempted_at` timestamp.

### `focus_group_response_data` — the differentiator
Real human distribution of how a sample group answered each question; drives "X% fell for the same trap."
`question_id` FK · `pct_A`/`pct_B`/`pct_C`/`pct_D` numeric · `sample_size` integer (**required for responsible display**) · `cohort_note` text · `collected_at` timestamp.

### `purchases`
`purchase_id` uuid · `student_id` FK · `stripe_customer_id` · `stripe_checkout_session_id` · `product_code` (`barmatrix_flagship_999`) · `price_cents` (`99900`/`89900`) · `discount_code` (`FIRST250_100OFF`) · `payment_plan` (`none`/`two_pay_standard`/`two_pay_special`) · `net_collected_cents` · `source` (`direct`/`influencer`/`tutor`/`ambassador`/`paid`/`organic`) · `partner_id` FK · `refund_status` (`none`/`requested`/`refunded`/`chargeback`) · `entitlement_status` (`active`/`suspended`/`revoked`) · `created_at`.

### `referral_partners`
`partner_id` uuid · `name` · `partner_type` (`influencer`/`tutor`/`ambassador`/`org`) · `contact_email` · `default_commission_cents` (`19900`) · `payout_trigger` (`after_refund_window`) · `approved_claims_ack` boolean · `disclosure_ack` boolean · `tax_form_status` (`not_required`/`requested`/`received`) · `status` (`active`/`paused`/`terminated`).

### `referral_clicks`
`referral_click_id` uuid · `partner_id` FK · `campaign_id` · `landing_page` · `utm_source`/`utm_medium`/`utm_campaign` · `visitor_id` (cookie/device) · `clicked_at`.

### `referral_conversions`
`conversion_id` uuid · `partner_id` FK · `student_id` FK · `purchase_id` FK · `commission_cents` (`19900`) · `status` (`pending`/`payable`/`paid`/`void`) · `reason_voided` · `payable_at` · `paid_at`.

### `mobile_installations`
`installation_id` uuid · `student_id` (nullable pre-login) · `platform` (`ios`/`android`) · `app_version` · `build_number` · `device_model` · `push_token` · `created_at` · `last_seen_at`.

*(An `entitlements` concept is implied by `purchases.entitlement_status` spanning platforms.)*

---

## 2. Runtime question JSON (what the drill UI actually consumes)

Source: `app/evidence-a1-drill.js` (global `BM_EVIDENCE_DRILL`). This **denormalized** shape is richer than the normalized tables — it's the contract the drill renderer expects.

```jsonc
{
  "id": "POE-CALMAP-001",
  "slotId": "POE-CALMAP-001",          // links to operator slot blueprint
  "officialCode": "A1",                 // subtopic code (UI badge)
  "subtopic": "Roles of judge and jury",
  "mechanic": "Rule 104(a) hearsay-exception foundation",  // SILVER KEY (mechanical nugget) — MECHANIC callout
  "difficultyBand": "Core Diagnostic",  // e.g. Core Diagnostic / Trap / Elite Discriminator
  "ruleRef": "FRE 104(a)",              // GOLD KEY (doctrinal nugget / rule spine)
  "stem": "...full fact pattern + call of the question...",
  "correctLetter": "C",
  "correctExplanation": "...why the right answer is right...",
  "tags": ["decisionmaker","preliminary_fact","hearsay_foundation","judge_not_bound_by_rules"],
  "sampleSize": 1247,                   // n for focus-group distribution
  "choices": [
    { "letter": "A", "text": "...", "correct": false,
      "pct": 0.1595,                     // focus-group selection fraction (0..1)
      "why": "...why this counterfeit is attractive but fails..." }
    // B, C, D — correct choice's `why` mirrors correctExplanation
  ]
}
```

Each wrong choice carries its own `why` (the counterfeit diagnosis) and `pct` (how many fell for it). `mechanic` = Silver Key; `ruleRef` = Gold Key. **This is the TEAR forensic contract.**

---

## 3. Student-app mechanics

### Drill flow (`app/drill.jsx`)
State machine `phase ∈ {answering, revealed, forensics}`:
1. **Answering** — student picks a letter AND a confidence pip (1–5; "1 = GUESS · 5 = CERTAIN"). Submit gated until both set.
2. **Submit** → compute `correct`, push `{correct, picked, qid}` to results, phase → `revealed`, auto-open forensics after 600ms.
3. **Revealed** — choices lock; correct → `revealed-correct`, wrong pick → `revealed-picked-wrong`; each choice shows `X% chose` from `pct`.
4. **Forensics overlay** (below).
5. **Next** → advance, reset; last question → exit.

Top bar: `Q{idx+1}/{total}` + progress dots (`done`/`miss`/`current`). Card shows slotId, officialCode badge, difficultyBand, ruleRef, `n=sampleSize`, a **MECHANIC** callout, stem, choices.

### Wrong-Answer Forensics overlay (`ForensicsOverlay`) — the core differentiator
1. **"WHY {letter} LOOKED RIGHT"** (wrong answers only) — trap tag chip + the `why` line: *"Choice X reads as a defensible rule — but {why}"* → this is TEAR's **Expose the counterfeit** beat.
2. **"THE CORRECT ANSWER · {letter}"** — correct text + its `why`.
3. **"FOCUS-GROUP DISTRIBUTION · n={sampleSize}"** — horizontal bar chart of all four `pct`; picked + correct bars styled; wrong → *"You picked the highest-attractiveness wrong answer — X% of the focus group fell for the same trap."*
4. **"TENSION POINT"** — two columns: "The pivot" (`mechanic`) vs "Rule spine" (`ruleRef`).
5. **Repair CTA** — wrong → "QUEUED FOR REPAIR" card (drill, count, est minutes, `forensicFocus`, "spaced repetition active"). Correct → "CELL MASTERED · +1 mastery point."

### Dashboard / "command deck" (`app/dashboard.jsx`)
- **Today tile** — greeting, `daysToExam`, today's queue count + summed est minutes, session progress bar, "NEXT UP · DUE NOW" launcher.
- **Subject Mastery** — per-subject `pct` (≥70 green / ≥60 neutral / <60 red), 7-day delta arrow, last-14-day window, click-to-drill.
- **Active Red Zones · Top 5** — **"Ranked by miss-rate × focus-group attractiveness"** (the red-zone scoring formula). Rows: rank, name, subject, `missCount/totalAttempts`, last-missed, trend, `drillsComplete/drillsTotal`.
- **Mastery Trend · 14d** — sparkline of rolling % correct + 7-day delta.
- **Recent Attempts** — live feed (qid, subject, forensic tag).
- **Today's Queue** — sequenced "weakest tags first / spaced repetition"; items typed `Red-Zone Drill` / `Boot Camp · Day N` / `Mixed Set`.
- **Personal Tension Matrix · Hot Cells** (`MiniMatrix`) — subject (rows) × trap-dimension (cols) heat grid. **Heat = (miss_count × focus_group_attractiveness) normalized 0–5.** Cells ≥3 flagged ●.

### Student state shape (`app/data.js`, global `BM_APP_DATA`)
Top-level entities: `student` · `subjectMastery[]` `{subject,pct,delta,attempted,total,hot}` (8 MBE subjects) · `todayQueue[]` `{id,type,title,subject,tensionPoint,questionCount,estMin≈count×1.8,status,reason,priority,batch}` · `redZones[]` `{id,rank,name,subject,tensionPoint,missCount,totalAttempts,forensicTag,severity,drillsTotal,drillsComplete,lastMissed,trend}` · `recentAttempts[]` · `masteryTrend[]` (14×`{day,pct}`) · `personalMatrix` `{cols[7],rows[]}` where the **7 trap dimensions** are **Rule/Excptn, Timing, Party, Scope, Standard, Triggers, Remedy** · `misconceptions[]` `{id,label(student-voice quote),forensicTag,trueRule,timesFallen,lastFallen,assignedDrills,subjects[],severity}` · `currentDrill` · `patternBoardTrends[]`.

forensicTags seen in misconceptions: Decisionmaker Inversion, Rules-Bound Trap, Modal Inversion, Channel Mismatch, Purpose Poisoning.

### Drill manifest (`app/drill-manifest.js`, global `BM_DRILL_MANIFEST`)
```jsonc
{ "id":"A1-roles-judge-jury", "file":"app/evidence-a1-drill.js", "window":"BM_EVIDENCE_DRILL",
  "subject":"Evidence", "subtopic":"A1 · Roles of Judge and Jury", "block":"Presentation of Evidence",
  "count":8, "batch":"001", "status":"shipped" }   // status enum: shipped | drafted
```
4 drills registered: A1 (batch 001, **shipped**) + 3 Privileges batches 003/004/005 (**drafted**).

---

## 4. Operator console (`operator/`)
- **Content Pipeline** (`content-pipeline.jsx`) — 6 tabs over `BM_PIPELINE`: Tension Matrix · 44 | 280-Slot Blueprint | Wrong-Answer Taxonomy | CA Distinctions | QA Rubric | Sample Audit. Slot status pipeline `shipped → drafted → queued → todo`, filterable by posture/status. → full taxonomy in `02`.
- **Authoring workbench** (`authoring.jsx`) — 3-pane: Slot Picker × Forensic Spec + Draft × QA Rubric checklist. Pick slot → forensic spec auto-loads → required trap architecture (`trap1/2/3` + `surfaceDecoy` + `factEngine`) shown as constraints → draft stem/4 choices/correct-letter/explanation (auto-save 3s) → all 10 QA gates checked unlocks "Ship Slot." "Preview as Student" available.
- **Mission Control** (`mission.jsx`, `BM_OP_DATA`) — launch-sprint dashboard. KPIs: ENROLLMENTS (/target), GROSS REVENUE (/$974k), FOUNDING SEATS $100 OFF (/250 cap), REFUND RATE (≤1.5%). Panels: 7-day revenue bars, live activity feed, conversion funnel (flags stage drops <65% of prev), founding-cap gauge, top referring partners ($199/conversion), geo, secondary metrics, webinars, refund queue (7-day no-questions window). `daysAgo()` anchored to 2026-05-21.

---

## 5. Shared API surface, web routes, analytics events

**API endpoints:** `GET /api/session` · `POST /api/diagnostic/start` · `POST /api/diagnostic/submit` · `GET /api/questions/next` · `POST /api/attempts` · `GET /api/attempts/:id/forensics` · `GET /api/dashboard/summary` · `GET /api/drills/assigned` · `POST /api/checkout/create-session` · `POST /api/webhooks/stripe` · `POST /api/referrals/click` · `POST /api/referrals/lead` · `GET /api/app/config`.

**Web routes:** `/` · `/diagnostic` · `/diagnostic/results` · `/how-it-works` · `/pricing` · `/checkout` · `/app` · `/login` · `/dashboard` · `/drills` · `/questions/:id` · `/forensics/:attempt_id` · `/account` · `/partners`.

**Analytics events** (event → required props): `diagnostic_started` · `diagnostic_completed` · `pricing_viewed` · `checkout_started` · `purchase_completed` · `referral_click` · `referral_conversion_pending` · `question_attempted` (platform, question_id, subject, correct, confidence, time_seconds) · `forensics_viewed` (platform, attempt_id, forensic_tag) · `drill_assigned` · `mobile_app_opened` · `mobile_login_success` · `refund_requested`.

---

## TEAR mapping
- **Gold Key (doctrinal)** = `ruleRef` / tension `ruleSpine` + `axis`/`collision`.
- **Silver Key (mechanical)** = question `mechanic` field + stem archetype.
- **Counterfeit** = the per-choice `why` lines + the 11 trap families (see `02`).
- **Repair the pattern** = red-zone repair queue (`forensicTag` → assigned drills → spaced retest) — already wired in dashboard + forensics overlay.

> Infra caveat: the PRD recommended a GCP/Firebase + Cloud SQL Postgres + Expo stack. Current ABM ships on **Vercel** with a **Clerk-gated** API. The data model / API shape / mechanics above are reusable; the hosting stack is **not** — treat it as historical intent.
