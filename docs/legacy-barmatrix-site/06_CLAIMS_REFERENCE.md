# Claims Reference (factual catalog only)

> ⚠️ **NO-GUARDRAILS RULE.** ABM has a hard rule against injecting legal/claim-safety/caution/hedge language into site **content** — a founder with a legal team owns that, and guardrail creep killed a prior launch (`no-guardrails-in-content` memory). **Nothing in this file is to be re-injected as copy, disclaimer, or "claims to avoid" rule into ABM content or docs.** This is preserved purely as a historical record of what the old product claimed and how it was substantiated, so that fact isn't lost. Claim-safety work lives with the founder's legal team and the `APPROVALS_NEEDED.md` gate — not in site copy.

Source: `uploads/06_CLAIMS_SIGNOFF_AND_LAUNCH_GUARDRAILS_REVISED.md` (preserved verbatim at `source/uploads/`).

---

## What the old product claimed (and its substantiation basis)

| Claim | Substantiation basis |
|---|---|
| Multiple-choice-only | Product fact (unconditional) |
| Supplements, not replaces, a full bar course | Positioning fact |
| Provides diagnostic MBE repair | Conditional: only if diagnostic + repair flow live |
| Uses "Wrong Answer Forensics" | Conditional: feature must be live |
| Uses focus-group answer-selection data | Conditional: "where available," with sample-size discipline (`focus_group_response_data.sample_size` required for display) |
| Assigns targeted repair drills | Conditional: drill assignment live |
| Available on web, iOS, Android | Conditional: accurate app-status language only |
| "First 250 enrollments save $100" | Conditional: discount technically capped at 250 redemptions |
| "Launch target 1,000 paid students" | Internal; public use avoided implying a hard cap |

## Claims the old product explicitly declined to make

(substantiation gaps it acknowledged — recorded as fact, not as a rule for ABM)

Guaranteed pass · guaranteed score increase · "official MBE prep" / "NCBE-approved" / "State Bar-approved" (affiliation confusion) · "only 250 seats" (conflicts with the 1,000 target) · same-day app-store approval (external dependency) · "better than UWorld/AdaptiBar/BARBRI/Themis" (comparative substantiation) · "students improve by X points" (needs validated data).

## Data the product collected (privacy-relevant fact)

Account data · diagnostic answers · confidence ratings · attempt data · platform/device/app-version · Stripe payment data · referral attribution · support comms · self-reported exam/jurisdiction. Consent flags stored in `students.consent_flags` (jsonb) for outcome/testimonial use.

## Old brand-name lineage (naming reference)

Per `naming-is-swappable`: public brand "BarMatrix" · method "MBE Tension Matrix" · diagnostic engine "Wrong Answer Forensics" · repair "Red-Zone Drills / Boot Camps" · lead magnet "Free MBE Trap Diagnostic" · late-season campaign "MBE Rescue." All swappable surface; the distillation is the moat.
