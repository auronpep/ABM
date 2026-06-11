# P4 — EXAM-DAY PRAYER CHAIN PAGE

**Hard deadline:** live by **July 13, 2026** (two Sundays before the exam)
for the July 28–29 California bar. Small build, immovable date. This page
is simultaneously real ministry and the best top-of-funnel artifact of
launch month — in that order, and the order shows in every design choice.

## What it is

A public page where anyone — members, families, churches, strangers —
signs up to pray for the July examinees in 15-minute slots covering both
exam days, so every student in the cohort knows that at any given minute
of the exam, someone specific is praying for them by the clock.

## Page spec (`/prayer-chain` — public, no auth)

1. **Header:** "The Exam-Day Prayer Chain — July 28–29."
   Subline: "Two days. Every fifteen minutes covered. Students prayed for
   by name, by the clock." Scripture: Ecclesiastes 4:9–10, set as an
   editorial pull-quote in brand type (tokens from cc-handoff doc 02).
2. **The grid:** both days, 7:00 AM – 6:00 PM Pacific in 15-min slots
   (covers check-in through final session; founder confirms exact exam-day
   schedule). Each slot shows coverage: "Ruth M. and 3 others." Unlimited
   signups per slot — the goal is depth, not scarcity. Empty slots read
   "Open" in faded type; covered slots fill toward brass. The grid itself,
   filling over the weeks, is the page's living proof.
3. **Signup:** first name, last initial, email, slot(s) — multi-select,
   "cover a whole hour" shortcut. Timezone handled: display PT with the
   visitor's local equivalent.
4. **Confirmation email** (transactional; Resend activation founder-gated):
   their slot(s), a one-page written prayer guide for praying over bar
   examinees (Chaplain-reviewed), and a calendar attachment (.ics).
   Optional day-before reminder checkbox at signup.
5. **For enrolled students** (members, authed view): a quiet banner —
   "During your exam, {n} people have committed to pray for this cohort,
   hour by hour." Plus opt-in: "Share my first name with the chain" so
   intercessors receive a first-names list to pray over. Opt-in only;
   default off.

## Data and conduct rules

- Emails collected are used for chain logistics ONLY (confirmation,
  optional reminder, one thank-you after results-day). A single separate
  unchecked checkbox offers BarMatrix updates; unchecked = never contacted
  again. This promise is printed on the page.
- No selling on the page. One quiet footer link to the site. No pricing,
  no diagnostic CTA above the fold. The page earns trust by wanting
  nothing; that is also, not coincidentally, why it gets shared.
- Analytics: aggregate only — `prayer_chain_signup` event with slot count
  and utm_source. No names/emails in events (doc 04 rules).
- Drift rules apply: no promised outcomes ("we pray for peace, clarity,
  and faithfulness" — never "prayer will get you a pass").

## Schema sketch (MariaDB; same migration ceremony as always)

`chain_slots` (id, day, start_time) — seeded ·
`chain_commitments` (id, slot_id, first_name, last_initial, email,
reminder_opt_in, updates_opt_in, created_at) ·
unique (slot_id, email).

## Distribution (founder lane, listed for completeness)

The page link goes in: launch-week social (the one piece of content that
needs no hook engineering), the founder DM list messages, and — if the
founder ever chooses — it is the single easiest thing for any church or
friend to share, because joining prayer costs nothing and means something.

## Acceptance

- [ ] Live on preview by July 10; production by July 13 (founder-gated)
- [ ] Signup → confirmation email with .ics verified
- [ ] Grid renders 2 days × slots correctly on mobile
- [ ] Duplicate signup (same email, same slot) handled gracefully
- [ ] Logistics-only email promise printed and honored in code paths
- [ ] Post-exam: founder sends the thank-you note; page flips to a
      "thus far the Lord has helped us" closing state (1 Samuel 7:12)
      with total coverage stats — the Ebenezer the next cohort sees
