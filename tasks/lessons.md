# Lessons

## 2026-06-12 - Post-checkout diagnostic CTAs

- When repairing checkout or enrollment flows, audit every post-purchase surface that can show a purchase CTA, including diagnostic results and bridge components.
- Paid or auto-provisioned users should not see enrollment offers after auth/API entitlement confirms active access; gate those CTAs on account enrollment state and provide a dashboard/account next step instead.
