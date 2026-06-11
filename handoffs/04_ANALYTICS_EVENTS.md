# 04 — ANALYTICS EVENTS

Five events. No more at launch. Use the existing analytics wiring
(PostHog/GA4 per current app config); if both exist, PostHog is primary.

## Event table

| Event | Fires when | Required properties |
|---|---|---|
| `mini_diag_start` | First choice tapped on landing mini-diagnostic | `utm_*`, `referrer`, `device` |
| `full_diag_start` | First question rendered in 18-q diagnostic | `utm_*`, `mini_score` (0–3 or null), `mini_missed_instincts` ([] of JUSTICE/SUSPICION/FAIRNESS) |
| `diag_complete` | 18th answer submitted | `utm_*`, `score`, `red_zones` ([zone names]), `duration_sec` |
| `checkout_start` | Stripe Checkout session created / checkout CTA clicked | `utm_*`, `red_zones`, `plan` ("full" \| "split") |
| `purchase` | Stripe webhook `checkout.session.completed` (server-side, in barmatrix-api) | `amount`, `plan`, `utm_*` (from session metadata) |

## Rules

1. `purchase` MUST be server-side from the existing webhook handler —
   never client-side. Attach UTM via Stripe session metadata at
   `checkout_start` so attribution survives.
2. UTM passthrough: capture utm_source/medium/campaign/content on first
   touch (existing UTM infra does this — reuse it); every event carries
   the stored values.
3. No PII in event properties. No answer text, no email, no names. Scores,
   zone names, instinct tags, and durations only.
4. Mini → full handoff: pass `mini_score` + `mini_missed_instincts` via
   query param or session storage NOTE: localStorage/sessionStorage are
   fine in the production Next.js app (the artifact-prototype restriction
   does not apply there).
5. Funnel dashboard: a single saved funnel view, in order:
   `mini_diag_start → full_diag_start → diag_complete → checkout_start →
   purchase`, segmented by utm_source. This is the founder's daily
   leak-review screen (doc 06, task L-3).

## Acceptance test

On a Vercel preview with debug mode: complete the full funnel in test mode
and verify all five events arrive with UTM intact, and that `purchase`
arrives from the webhook (Stripe test event), not the browser.
