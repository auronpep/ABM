# P3 — BARNABAS CIRCLE MVP & CRISIS PROTOCOL

**Two halves:** governance (founder decisions + protocol text, in force
before launch) and build (small). Per RULES v2: the prayer board does not
launch without a named moderation owner and this protocol active. That
rule is the launch gate, not a formality.

---

## HALF 1 — GOVERNANCE (founder completes; build proceeds in parallel)

### Named roles (founder fills in; launch-blocking)

- **Moderation Owner:** ____________ (daily queue review; first responder)
- **Crisis Contact:** ____________ (reachable by phone during cohort;
  may be same person at MVP scale)
- **Chaplain / pastoral reviewer:** ____________ (Founding Chaplain lane)
- **Counselor referral list:** ≥3 vetted Christian counselors/practices +
  national crisis resources, assembled by founder before launch.

### Crisis Protocol (active text — adapt names, keep substance)

1. **Trigger:** any post or prayer request containing despair language,
   hopelessness, self-harm references, or reading as a goodbye — flagged
   by moderator review or member report. When in doubt, treat as triggered.
2. **Response:** a real human (Moderation Owner or Crisis Contact)
   responds personally within hours — by name, warm, unscripted. NEVER an
   automated reply, NEVER only an emoji/“praying” tally on such a post.
3. **Offer:** the response includes (a) genuine personal engagement,
   (b) crisis resources (988 Suicide & Crisis Lifeline — call/text 988 —
   plus the counselor referral list), (c) an invitation to talk further.
   We are a community, not clinicians; the protocol's job is human
   presence plus a bridge to qualified help, with the member's dignity
   intact.
4. **Honesty about limits:** we do not promise outcomes or total
   confidentiality; if we believe someone is in danger we will act like
   people who love them, which can include contacting emergency help.
   This stance appears in the community guidelines members accept.
5. **Follow-up:** personal check-in within 72 hours. Logged minimally
   (date, responder, action) in a private log — never in analytics.
6. **Moderator care:** crisis responses are debriefed with the Chaplain;
   no moderator carries these alone.

### Privacy covenant (binding; mirrors DRIFT_CONTROL §2)

Prayer/community content is excluded from analytics, marketing, training
data, and screenshots; visible to signed-in members only; never quoted
anywhere without explicit written consent; member deletion honored fully.
Privacy policy must be updated with a community-content section BEFORE
launch (founder/attorney task — drafting checklist included in build B-5).

---

## HALF 2 — BUILD (Claude Code)

Scope: ONE feature — the weekly Prayer & Progress thread. Not a social
platform. Members-only (existing auth/entitlements).

### Schema sketch (MariaDB; founder approval + backup before migration)

`circle_threads` (id, week_start, title, status) ·
`circle_posts` (id, thread_id, member_id, body, created_at,
status[active/removed], flagged_bool) ·
`circle_responses` (id, post_id, member_id, body, created_at, status) ·
`circle_praying` (post_id, member_id) unique pair — the "praying" tally ·
`circle_reports` (post_id, reporter_id, reason, created_at, resolved).
No soft analytics columns. No view counters.

### Behavior

- One pinned thread per week, auto-created Monday: "Prayer & Progress —
  Week of {date}". Prompt copy: "What are you studying, where are you
  stuck, and how can we pray for you?"
- Post → appears immediately; flagged terms (small wordlist incl. despair
  language) ALSO route a copy to the moderation queue with priority flag.
  Reactive moderation otherwise: every post enters the daily queue.
- Replies + a "praying" tally showing a count and the first names of
  members praying ("Ruth and 4 others are praying"). The tally is a
  commitment signal, not gamification — no leaderboards, no streaks, no
  badges anywhere in the Circle (RULES: never gamify devotion).
- Report button on every post → moderation queue.
- Moderation view: queue (priority-flagged first), remove/restore, private
  notes, and the crisis-log form (minimal fields per protocol §5).
- "Cast Your Anxiety" integration (funnel tie-in): from a results page,
  pre-fill a draft post with the member's red-zone names — member edits
  and consents before anything posts. Never auto-post.

### Analytics exception (strict)

The ONLY permitted metrics, computed as aggregates with no content and no
member identity: weekly posts count, % of posts receiving a human response
within 24h (the prayer-response SLA), open moderation-queue age. These
feed the ministry health dashboard later. No event may carry post text.

### Acceptance / launch gate

- [ ] Roles named, counselor list delivered, protocol acknowledged by
      moderator (founder confirms in writing)
- [ ] Privacy policy updated and linked
- [ ] Flag-routing verified with test despair-language post
- [ ] Prayer content absent from all analytics payloads (test asserts)
- [ ] Member deletion removes their posts/replies/tallies
- [ ] Founder approval → migration (backup first) → launch with week-1
      thread seeded by the founder personally
