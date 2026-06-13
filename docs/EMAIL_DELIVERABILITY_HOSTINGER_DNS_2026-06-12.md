# Email Deliverability / Hostinger DNS Checklist

Investigation date: 2026-06-12

## Root Cause Snapshot

ABM does not send email from the Vite frontend. Post-purchase email is handled by `C:\barmatrix-api` on Hostinger:

- Stripe `checkout.session.completed` -> `sendEnrollmentEmailForFulfillment()` -> Resend.
- Stripe invoice lifecycle events -> payment failed, installment receipt, upcoming payment emails -> Resend.
- Resend production sender is documented as `BarMatrix <access@barmatrix.app>`, with support/reply-to `support@barmatrix.app`.
- Clerk auth emails are separate. Clerk sends production auth emails from the BarMatrix domain after production setup; Clerk says it configures SPF/DKIM during setup, but DMARC and real receiving mailboxes are our responsibility.
- Stripe may also send Stripe-managed receipts/invoices. By default those send from `stripe.com` unless a Stripe custom email domain is configured.

So the deliverability work is DNS authentication plus provider-dashboard verification and reputation warm-up, not a React Email code fix.

## 2026-06-12 Execution Update

Checks now completed:

- Public DNS was checked directly and by a delegated DNS lane.
- Resend CLI was checked. The first available key was sending-only, then `RESEND_FULL_API_KEY` was used successfully for domain status.
- Production Hostinger API env was checked over SSH by key presence only; Resend, Clerk, and Stripe keys are present.
- Resend dark send succeeded from `BarMatrix <access@barmatrix.app>` to `codex@barmatrix.app`.
- Hostinger SMTP dark send succeeded from `support@barmatrix.app` to `codex@barmatrix.app`.
- IMAP login for `codex@barmatrix.app` succeeded and received headers were inspected.
- Clerk Backend API domain record was checked with the existing secret key.
- Stripe live account, recent checkout sessions, recent charges, recent events, and webhook endpoints were checked read-only with the existing live key.

Follow-up after user added Clerk CNAMEs:

- `clk._domainkey.barmatrix.app` now resolves to `dkim1.pqxm61mygn1q.clerk.services` and onward to the Clerk/SendGrid DKIM public key.
- `clk2._domainkey.barmatrix.app` now resolves to `dkim2.pqxm61mygn1q.clerk.services` and onward to the Clerk/SendGrid DKIM public key.
- `RESEND_FULL_API_KEY` was used for Resend CLI domain status. `barmatrix.app` is verified; sending is enabled; receiving is disabled; all Resend records are verified.
- User clarified the Hostinger DNS token is saved as `HOSTINGER_API` in `C:\Users\JesusLovesMe\.env`. The token worked against Hostinger's DNS Zone API. DMARC is now updated and verified publicly.

Highest-priority findings:

1. **Clerk DKIM records were missing and are now fixed.** Clerk says these are required:

| Type | Name | Value |
|---|---|---|
| CNAME | `clk._domainkey` | `dkim1.pqxm61mygn1q.clerk.services` |
| CNAME | `clk2._domainkey` | `dkim2.pqxm61mygn1q.clerk.services` |

Public DNS now resolves both. This was the strongest root-cause candidate for Clerk auth emails going to spam.

2. **Clerk account/mail records that are already present:**

| Type | Name | Value | Status |
|---|---|---|---|
| CNAME | `clerk` | `frontend-api.clerk.services` | Present |
| CNAME | `accounts` | `accounts.clerk.services` | Present |
| CNAME | `clkmail` | `mail.pqxm61mygn1q.clerk.services` | Present |

3. **Resend authentication is good in a real received message.** The Resend dark test received by Hostinger showed:

```text
dkim=pass header.d=barmatrix.app header.s=resend
spf=pass smtp.mailfrom=...@send.barmatrix.app
dmarc=pass (policy=none) header.from=barmatrix.app
```

4. **Hostinger support SMTP authentication is good in a real received message.** The Hostinger SMTP dark test showed:

```text
dkim=pass header.d=barmatrix.app header.s=hostingermail-a
spf=pass smtp.mailfrom=support@barmatrix.app
dmarc=pass (policy=none) header.from=barmatrix.app
```

5. **Hostinger DKIM selectors B and C still need Hostinger email-side regeneration, but selector A is working.** The `barmatrix.app` CNAMEs for `hostingermail-a`, `hostingermail-b`, and `hostingermail-c` are present and point at Hostinger's expected `dkim.mail.hostinger.com` targets. Hostinger's managed TXT targets for B and C currently return `v=DKIM1;p=`. Hostinger SMTP currently signs with selector `hostingermail-a`, which passes. Refresh/fix B/C in hPanel, but they are not blocking the tested support SMTP path.

6. **Stripe account branding/support info is wrong for BarMatrix.** Read-only Stripe API check returned:

```text
business_profile.support_email = josh@joshwood.live
business_profile.url = https://988Foundation.com
```

That is not a DNS failure, but it can damage buyer trust and reply handling. Update Stripe public business/support information in the Dashboard.

7. **Stripe receipt behavior is not controlled in BarMatrix code.** The API does not set `payment_intent_data.receipt_email`, `customer_email`, or `invoice_creation`. Stripe Checkout collects buyer email, and BarMatrix sends its own enrollment/billing lifecycle emails via Resend. Stripe customer-email settings remain a Dashboard check.

## Current Public DNS

Authoritative nameservers:

- `ns1.dns-parking.com`
- `ns2.dns-parking.com`

This means the live DNS changes belong in Hostinger hPanel for `barmatrix.app`.

Current records observed:

| Purpose | Hostinger type | Name | Value | Status |
|---|---:|---|---|---|
| Inbound mail | MX | `@` | `mx1.hostinger.com`, priority `5` | Present |
| Inbound mail | MX | `@` | `mx2.hostinger.com`, priority `10` | Present |
| Hostinger mailbox SPF | TXT | `@` | `v=spf1 include:_spf.mail.hostinger.com ~all` | Present |
| Hostinger DKIM | CNAME | `hostingermail-a._domainkey` | `hostingermail-a.dkim.mail.hostinger.com` | Present |
| Hostinger DKIM | CNAME | `hostingermail-b._domainkey` | `hostingermail-b.dkim.mail.hostinger.com` | Present, but Hostinger's target public key is empty |
| Hostinger DKIM | CNAME | `hostingermail-c._domainkey` | `hostingermail-c.dkim.mail.hostinger.com` | Present, but Hostinger's target public key is empty |
| Resend return-path MX | MX | `send` | `feedback-smtp.us-east-1.amazonses.com`, priority `10` | Present |
| Resend return-path SPF | TXT | `send` | `v=spf1 include:amazonses.com ~all` | Present |
| Resend DKIM | TXT | `resend._domainkey` | Resend-generated DKIM public key | Present |
| DMARC | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@barmatrix.app` | Present in Hostinger API and authoritative DNS; some recursive resolvers may briefly cache the old bare value |
| Clerk frontend API | CNAME | `clerk` | `frontend-api.clerk.services` | Present |
| Clerk accounts portal | CNAME | `accounts` | `accounts.clerk.services` | Present |
| Clerk mail channel | CNAME | `clkmail` | `mail.pqxm61mygn1q.clerk.services` | Present |
| Clerk DKIM 1 | CNAME | `clk._domainkey` | `dkim1.pqxm61mygn1q.clerk.services` | Present |
| Clerk DKIM 2 | CNAME | `clk2._domainkey` | `dkim2.pqxm61mygn1q.clerk.services` | Present |

## Hostinger DNS Actions

Do these in hPanel -> Domains -> DNS -> select `barmatrix.app` -> DNS records.

1. Keep the current Hostinger MX records.

Do not replace these unless moving inbox hosting away from Hostinger:

| Type | Name | Mail server | Priority |
|---|---|---|---:|
| MX | `@` | `mx1.hostinger.com` | `5` |
| MX | `@` | `mx2.hostinger.com` | `10` |

2. Keep exactly one root SPF TXT record.

Current root SPF is correct for Hostinger mailboxes:

| Type | Name | TXT value |
|---|---|---|
| TXT | `@` | `v=spf1 include:_spf.mail.hostinger.com ~all` |

Do not add a second `v=spf1 ...` TXT at `@`. If another provider ever requires root SPF, merge it into this one line.

3. Verify Hostinger mailbox DKIM in hPanel.

The public `hostingermail-a._domainkey` CNAME resolves to a real DKIM key. `hostingermail-b._domainkey` and `hostingermail-c._domainkey` both point to Hostinger targets, but those Hostinger-managed target TXT records currently appear empty publicly. In Hostinger Email -> domain/account -> Connect Domain / Protect your reputation, regenerate or refresh DKIM if available. If Hostinger shows different expected DKIM values, update only the affected CNAMEs to match Hostinger exactly.

Current status:

| Hostinger record | Status |
|---|---|
| `hostingermail-a._domainkey` | Working; real received mail signed with `hostingermail-a` and passed DKIM |
| `hostingermail-b._domainkey` | CNAME is correct in `barmatrix.app`; Hostinger's target TXT is `v=DKIM1;p=` |
| `hostingermail-c._domainkey` | CNAME is correct in `barmatrix.app`; Hostinger's target TXT is `v=DKIM1;p=` |

This cannot be fixed by changing the `barmatrix.app` CNAMEs unless Hostinger shows replacement targets. It requires Hostinger email-side DKIM regeneration or hPanel support.

4. Keep the Resend `send` subdomain records and verify them in Resend.

In Resend Dashboard -> Domains -> `barmatrix.app` -> Records, all required records should be green. Current public records match the common Resend/Amazon SES shape:

| Type | Name | Value | Priority |
|---|---|---|---:|
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | `10` |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | n/a |
| TXT | `resend._domainkey` | Copy exact DKIM value from Resend | n/a |

If Resend shows a different region or DKIM value, copy the dashboard values. Do not invent or normalize them.

5. Improve DMARC monitoring.

Current DMARC now includes aggregate reporting:

```text
v=DMARC1; p=none; rua=mailto:dmarc@barmatrix.app
```

Leave policy at `p=none` during launch/warm-up. Move later to `p=quarantine` and then `p=reject` only after Resend, Clerk, Hostinger mailbox sends, and Stripe sends all pass SPF/DKIM/DMARC in real message headers.

Hostinger API, authoritative nameservers `ns1.dns-parking.com` / `ns2.dns-parking.com`, and Cloudflare resolver `1.1.1.1` return one `_dmarc` TXT record with the `rua` value above. Google resolver `8.8.8.8` still showed the old bare value alongside the new value during verification, which appears to be recursive-cache lag after the delete/re-add correction.

6. Clerk checklist.

In Clerk Dashboard:

- Confirm the production instance email/domain setup is verified.
- Confirm Clerk's SPF/DKIM items show healthy.
- Check every active email template's From address. Clerk default aliases can include `notifications@`, `noreply@`, and `invitations@`.
- In Hostinger Email, create or alias every Clerk From address so it can receive replies and does not bounce.
- Prefer verification codes over verification links during warm-up, especially for Outlook/Microsoft addresses.
- Keep Clerk's default auth-email copy unless there is a strong product reason to customize it.

The Clerk Backend API currently reports these required CNAMEs for `barmatrix.app`; these are now present in public DNS:

| Type | Hostinger Name | Points to |
|---|---|---|
| CNAME | `clk._domainkey` | `dkim1.pqxm61mygn1q.clerk.services` |
| CNAME | `clk2._domainkey` | `dkim2.pqxm61mygn1q.clerk.services` |

Already present and should be left alone:

| Type | Hostinger Name | Points to |
|---|---|---|
| CNAME | `clerk` | `frontend-api.clerk.services` |
| CNAME | `accounts` | `accounts.clerk.services` |
| CNAME | `clkmail` | `mail.pqxm61mygn1q.clerk.services` |

7. Stripe checklist.

If using Stripe's default customer emails, no Hostinger DNS change is needed because Stripe sends from `stripe.com`.

If you want Stripe customer emails to send from `barmatrix.app`, go to Stripe Dashboard -> Settings -> Customer emails -> Custom email domain. Add the exact TXT/CNAME records Stripe gives you. Stripe's docs say CNAME record names must not have other records at the same name, and custom domain records must remain in DNS after verification.

Do not set strict SPF alignment (`aspf=s`) in DMARC if using Stripe custom email domain; Stripe documents that strict SPF alignment is not currently supported.

Also update Stripe public business information now:

- Support email should be a BarMatrix mailbox, preferably `support@barmatrix.app`.
- Business/support URL should be `https://barmatrix.app`, not `https://988Foundation.com`.
- Customer-email settings and custom email domain status are Dashboard-only in this pass; Stripe CLI is not on PATH.

## Non-DNS Deliverability Actions

- Make sure `access@barmatrix.app` exists or aliases to a monitored inbox because Resend sends from it.
- Make sure `support@barmatrix.app` exists and is monitored because replies go there.
- Keep `codex@barmatrix.app` as internal QA/catchall.
- Add `dmarc@barmatrix.app` or use a DMARC report service before enabling `rua=`.
- Send real dark tests to Gmail, Outlook/Hotmail, Yahoo, and the Hostinger mailbox. Inspect message headers for `spf=pass`, `dkim=pass`, and `dmarc=pass`.
- Set up Google Postmaster Tools for `barmatrix.app`.
- Warm up slowly. New-domain reputation starts low; even correct DNS can still land in spam until Gmail/Microsoft/Yahoo see consistent low-complaint engagement.
- For marketing/abandoner/list-style emails, include visible unsubscribe and List-Unsubscribe headers. Keep purchase receipts, auth verification, and access/billing notices transactional and short.

## Exact Remaining hPanel Actions

Use Hostinger hPanel -> Domains -> DNS -> select `barmatrix.app` -> DNS records.

1. Refresh Hostinger DKIM selectors B and C.

Go to Hostinger Email for `barmatrix.app`, then look for the domain authentication / "Protect your reputation" / DKIM section. Regenerate or refresh DKIM if available. The broken public record is:

```text
hostingermail-b._domainkey.barmatrix.app -> hostingermail-b.dkim.mail.hostinger.com -> v=DKIM1;p=
hostingermail-c._domainkey.barmatrix.app -> hostingermail-c.dkim.mail.hostinger.com -> v=DKIM1;p=
```

The `barmatrix.app` CNAMEs are already present and correct, so do not delete them unless Hostinger support tells you to. If Hostinger shows corrected values or replacement CNAME targets for B/C, update only those affected records. Do not touch `hostingermail-a._domainkey`; it is already signing successfully.

2. Confirm DMARC reporting mailbox.

The Hostinger DNS API already updated `_dmarc` to:

```text
v=DMARC1; p=none; rua=mailto:dmarc@barmatrix.app
```

Confirm `dmarc@barmatrix.app` is a real mailbox, alias, or covered by catchall. Keep `p=none` for now. This only adds reporting; it does not reject mail.

3. Hostinger API route used.

`HOSTINGER_API` in `C:\Users\JesusLovesMe\.env` was used against Hostinger's DNS Zone API. The safe edit path was: GET zone, validate `_dmarc`, PUT `_dmarc`, observe duplicate caused by append behavior, DELETE only `_dmarc` TXT via `name` + `type` filter, validate again, and PUT one final `_dmarc` TXT.

## Verification Commands

PowerShell checks used in this investigation:

```powershell
Resolve-DnsName -Name barmatrix.app -Type NS
Resolve-DnsName -Name barmatrix.app -Type MX
Resolve-DnsName -Name barmatrix.app -Type TXT
Resolve-DnsName -Name send.barmatrix.app -Type MX
Resolve-DnsName -Name send.barmatrix.app -Type TXT
Resolve-DnsName -Name resend._domainkey.barmatrix.app -Type TXT
Resolve-DnsName -Name _dmarc.barmatrix.app -Type TXT
Resolve-DnsName -Name clerk.barmatrix.app -Type CNAME
Resolve-DnsName -Name accounts.barmatrix.app -Type CNAME
Resolve-DnsName -Name clkmail.barmatrix.app -Type CNAME
Resolve-DnsName -Name clk._domainkey.barmatrix.app -Type CNAME
Resolve-DnsName -Name clk2._domainkey.barmatrix.app -Type CNAME
Resolve-DnsName -Name hostingermail-a._domainkey.barmatrix.app -Type CNAME
Resolve-DnsName -Name hostingermail-b._domainkey.barmatrix.app -Type CNAME
```

Official references checked:

- Resend domain verification: https://resend.com/docs/dashboard/domains/introduction
- Resend verification troubleshooting: https://resend.com/docs/knowledge-base/what-if-my-domain-is-not-verifying
- Clerk email deliverability: https://clerk.com/docs/guides/development/troubleshooting/email-deliverability
- Clerk domain warm-up: https://clerk.com/docs/guides/development/troubleshooting/email-domain-name-warmup
- Google sender guidelines: https://support.google.com/mail/answer/81126
- Yahoo sender best practices: https://senders.yahooinc.com/best-practices/
- Hostinger DNS management: https://www.hostinger.com/support/1583249-how-to-manage-dns-records-at-hostinger/
- Hostinger SPF: https://www.hostinger.com/support/1583673-what-is-the-spf-record-for-hostinger-email/
- Hostinger DMARC: https://www.hostinger.com/support/8412851-how-to-add-a-dmarc-record-for-hostinger-email/
- Stripe custom email domain: https://docs.stripe.com/get-started/account/email-domain
