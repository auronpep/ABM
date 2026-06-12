# Partner / Referral / Influencer Program

The complete program structure. The **terms** are reusable as a business-rules template; the **copy strings** use old-product framing and would be rewritten in TEAR voice before reuse. Sources: `uploads/07_INFLUENCER_REFERRAL_AND_PARTNER_OPS_INTERNAL.md`, plus referral fields in `02_THREE_DAY_LAUNCH_PLAN` and `03_APP_PRD`.

---

## Economics

- **$199 flat payout per qualified referral** (internal only — never on the student-facing pricing page).
- = 19.92% of $999 / 22.14% of $899. Stored as `19900` cents on `referral_partners.default_commission_cents`.
- **No tiered (bronze/silver/gold) structure** — single flat rate; variation is by **partner type**, not volume.
- Max payout if all 1,000 buyers referred = **$199,000**.

| Partner type | Terms |
|---|---|
| Influencer / creator | $199 flat; strict disclosure + approved claims |
| Tutor | $199 or custom agreement |
| Law-school ambassador | $199; extra sensitivity, no pressure tactics |
| Small bar-prep org | May get **custom rev-share** instead of flat $199 |

**Payout reserve table:** 100 buyers → $19,900 · 250 → $49,750 · 500 → $99,500 · 1,000 → $199,000.

---

## Qualification (all 8 must hold to become payable)

Valid attributed link/code · completed paid enrollment · not refunded · not charged back/disputed · refund window passed · partner in good standing · used required disclosures + no prohibited claims · not self-referral/duplicate/fraud.

- **Payout timing:** 15–30 days after purchase (after refund/dispute window).
- **Attribution rule:** last valid partner click within **30 days** (unless agreement says otherwise).

---

## Tracking pipeline & states

Click (`partner_id`, `campaign_id`, UTM, timestamp, `visitor_id`) → Lead (attach to profile) → Checkout (partner ID into Stripe metadata) → Purchase (stored on record) → Refund (void payable) → Payout (export after window).

Conversion `status` states: **`pending` → `payable` → `paid`**, or **`void`** (with `reason_voided`). (See `referral_clicks` / `referral_conversions` tables in `01`.)

**Payout workflow (6 steps):** Revenue ops export → strip refunds/disputes/dupes/fraud/self-refs → compliance check status + claims → mark `payable` → Finance pays $199 → mark `paid` + store date/reference.

**Partner weekly report columns:** Partner · Clicks · Leads · Checkout starts · Paid buyers · Pending payout · Payable · Paid · Refunds/voids.

---

## Outreach wave plan

- **Wave 1** — 20–30 trusted tutors/creators (validate messaging + tracking).
- **Wave 2** — 50–75 broader influencers/ambassadors (drive leads + first-250 urgency).
- **Wave 3** — high-performers only (scale after refund data is known).

Dispatch doc also says prep the "first 20–50 outreach targets" on Day 1. *(No named target-partner list exists in the files — only counts/profiles.)*

---

## Fraud / void triggers

Self-referrals · duplicate accounts · refunds · chargebacks · coupon leakage · prohibited claims · fake reviews · undisclosed sponsorship · suspicious click patterns.

---

## Compliance artifacts (reusable, but FTC-only — not product hedging)

**Required FTC disclosure (verbatim):** *"I may receive compensation if you purchase through my link."* — This is a legal-disclosure requirement on the *partner's* content, distinct from the no-guardrails rule on *our* marketing copy.

**Prohibited partner claims:** guaranteed pass · guaranteed score increase · "official MBE prep" · NCBE / State Bar approval · exclusive access to actual exam questions · unverified pass-rate/point stats · "only 250 seats" (if sales continue past 250) · competitor-superiority without substantiation.

> The old "approved partner copy" blurbs (short/long) are written in BarMatrix/"MBE Tension Matrix"/"$999/first-250" framing — old-product-specific. Preserve the *program structure and terms* above; rewrite any partner-facing copy in current TEAR voice with current pricing before use.
