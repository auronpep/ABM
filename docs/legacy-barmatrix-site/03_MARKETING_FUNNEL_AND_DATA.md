# Marketing, Funnel & Real Diagnostic Data

Sources: `uploads/01_SITE_STRATEGY_AND_POSITIONING`, `02_THREE_DAY_LAUNCH_PLAN`, `04_WEBSITE_COPY_KIT`, `Launch_Plan_7Day.md`, `real-marketing-data.json` (all under `source/uploads/`).

> Commercial terms below are the *old launch's* decisions and are **superseded by ABM's own pricing/positioning**. Preserved as reference. Two internal plans even disagree with each other — see §6.

---

## 1. Funnel / page-purpose map

| Path | Page | Purpose |
|---|---|---|
| `/` | Home | Explain product → convert to diagnostic or checkout |
| `/diagnostic` | Free Diagnostic | Primary lead capture + proof engine |
| `/how-it-works` | How It Works | Method, forensics, focus-group data, drills |
| `/pricing` | Pricing | Flagship, first-250 special, payment plan |
| `/checkout` | Checkout | Stripe + terms acceptance |
| `/app` | Apps | Web/iOS/Android access, screenshots, store status |
| `/california-july-2026` | Seasonal | Persona landing |
| `/repeat-takers` | Persona | Repeat-taker landing |
| `/full-course-companion` | Companion | Reduces "replaces my course" objection |
| `/faq` | FAQ | Scope/official-status/refund/app/time objections |
| `/partners` | Partner/Tutor | Influencer request form + approved positioning |

**Homepage block order (10):** Hero → Problem → Method → Demo (one missed answer + focus-group % + assigned drill) → Product modules → Who it's for / not for → Pricing → Platform → FAQ → Final CTA.

**Offer contents (what the buyer receives):** free diagnostic · Red-Zone Map · ~2,400-question bank · Wrong-Answer Forensics · focus-group comparison · Personal Misconception Profile · Pattern Mastery Board · targeted drills/boot camps · timed mixed sets · final-sprint path · multi-platform access · launch-cycle office hours.

---

## 2. Pricing / offer config (old — superseded)

- Standard **$999** (`barmatrix_flagship_999`, price_cents `99900`); first-250 special **$899** (`FIRST250_100OFF`, $100 off, **max 250 redemptions**, `89900`).
- Payment plans: standard `$500 + $499` (`two_pay_standard`); first-250 `$450 + $449` (`two_pay_special`, counts against the 250 cap).
- Launch target **up to 1,000** July-cycle students (target, **not** a hard cap).
- Stripe metadata for referral: `partner_id, campaign_id, coupon_code, utm_source, utm_medium, utm_campaign, referral_click_id`.

**Revenue math (verbatim scenarios):** 1,000 @ $999 = $999,000 · 250@$899 + 750@$999 = $974,000 · 250 special only = $224,750 · 250 special + 250 std = $474,500 · 250 special + 500 std = $724,250.

---

## 3. Conversion-target benchmarks (reusable as planning baselines)

| Metric | Target |
|---|---|
| Paid buyers | 1,000 |
| Gross (w/ first-250) | $974,000 |
| Diagnostic completions | 3,000–7,000 |
| Visitor → diagnostic-start | 8%–20% (by source) |
| Diagnostic → purchase | 3%–8% |
| Webinar-attendee → purchase | 8%–15% |
| Influencer-referred buyers | 250–500 |
| Refund rate | < 1.5% |

**Hourly launch-monitor checklist:** site uptime · checkout success · discount redemptions (cap at 250) · referral attribution in purchase record · diagnostic completion · paid dashboard access · app login · support triage (access/payment first).

---

## 4. Reusable copy assets (product-true; swap brand name)

**Core thesis (durable):** *"MBE misses are not random. They reveal recurring trap patterns."*

**Hero headline options:**
- *"Stop doing random MBE questions. Learn the traps the exam keeps reusing."*
- *"Your wrong answers are not random. They are a repair map."*
- *"Master the finite universe of MBE traps."*
- Subhead: *"…diagnoses the wrong-answer patterns behind your missed multiple-choice questions and assigns targeted repair drills, so every miss tells you exactly what to fix next."*

**"How it works" 4-section structure:** (1) Diagnostic reports the *type* of wrong answer, not just % (legally-true-but-irrelevant / wrong timing / exception omitted / wrong party / wrong standard). (2) Wrong-answer forensics — why it was *attractive* before why it was wrong. (3) Focus-group comparison — how often prior respondents chose the same wrong answer. (4) Assigned repair — each miss → drill/boot camp/timed set/spaced review.

**Email sequence structure (3 templates):**
- Lead — subject *"Your MBE trap profile is the starting point"* (diagnostic → repair-map framing).
- Buyer onboarding — subject *"Start here: your Red-Zone Map"* (first task = diagnostic, not random questions).
- Influencer outreach — subject *"[Brand] partner link for your MBE audience."*

**Diagnostic loop (6 steps):** identify legal tension point → show which trigger fact changed the outcome → explain why the wrong answer looked attractive → compare to focus-group selection data → assign next repair drill → continue across platforms.

> The copy kit also contains a prohibited-claims list, first-250 microcopy guardrails, and a disclaimer block. **Per the no-guardrails rule those are NOT to be ported into ABM content** — cataloged in `06_CLAIMS_REFERENCE.md` only.

---

## 5. Real diagnostic content — `real-marketing-data.json` (highest preserve-priority)

The actual hero question + diagnostic set that powered the old proof engine. **Product content, not voice — fully reusable.** Verbatim copy at `source/uploads/real-marketing-data.json`.

**Hero question `POE-CALMAP-001`** — Evidence · subtopic "A1 · Roles of Judge and Jury" · tension "POE-001 · Preliminary Admissibility" · difficulty 0.78 · repair drill "Red-Zone Drill A1" · repairCount 8. Stem: federal civil trial, excited-utterance note, EMT sworn statement, hearsay objection — who decides foundation + may the statement be considered.

Focus-group distribution + forensic tags (the moat data):
| Choice | % | Verdict | Forensic tag |
|---|---|---|---|
| A | 16% | wrong | DECISIONMAKER INVERSION |
| B | 8% | wrong | DECISIONMAKER INVERSION + RULES BOUND |
| **C** | **69%** | **CORRECT** | court decides preliminary questions; judge not bound by evidence rules except privilege |
| D | 7% | wrong | RULES-BOUND TRAP |

**Diagnostic set (5 items, all Evidence / roles of judge & jury):**
| ID | Scenario | Correct | Trap tags |
|---|---|---|---|
| POE-CALMAP-001 | excited-utterance note | C | decisionmaker-inversion, wrong-decisionmaker, categorical-error |
| POE-CALMAP-002 | surveillance-video authentication | B | decisionmaker-inversion, rules-bound-trap, categorical-error |
| POE-CALMAP-003 | Miranda confession hearing | B | (same family) |
| POE-CALMAP-004 | expert-qualification résumé hearsay | A | wrong-decisionmaker, rules-bound-trap, categorical-error |
| POE-CALMAP-005 | child-witness competency | C | decisionmaker-inversion, wrong-decisionmaker, categorical-error |

**Durable forensic vocabulary** (recurs across all items): `decisionmaker-inversion`, `wrong-decisionmaker`, `rules-bound-trap`, `categorical-error`. ID convention `POE-CALMAP-NNN`; per-choice `{pct, correct, forensicTag, why}` is the data shape to keep.

> Raw question batches also preserved: `source/uploads/parsed_questions.json`, `parsed_batches_3_4_5.json` (1MB), and the `.xlsx` batch files. Note: ABM already has its own question bank (`qdata/`), so treat these as legacy source content, not the live bank.

---

## 6. ⚠️ Internal-plan conflict (resolve before reusing any number)

`Launch_Plan_7Day.md` is an **earlier, divergent plan** that contradicts the 2026-05-15 revised docs:

| Item | 7-Day plan | Revised (01–03) |
|---|---|---|
| Price | $599 founding → $899/$999 | $999 / $899 special |
| Payment plan | 2 × $325 | $500+$499 / $450+$449 |
| Cohort | "1,000 seats" **hard cap** | 1,000 **target**, not a cap |
| Platform | **Web only** | Web + iOS + Android |
| Refund | 7-day no-questions | (unspecified) |

The 7-Day plan's lasting value is its **build mechanics and asset inventory** (2,400-question attorney-approved bank; AI-worker division of labor; Postgres table names `questions/answer_choices/tension_points/subtopics/wrong_answer_tags/misconception_tags/focus_group_response_data/boot_camps/mastery_scores`; Gemini-rendered personalized Red-Zone PDF lead magnet) — **not** its commercial terms. The revised docs supersede on price/cohort/platform; ABM's own foundation docs supersede both.
