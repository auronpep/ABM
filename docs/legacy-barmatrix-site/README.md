# Legacy BarMatrix Site — Knowledge Capture

**Purpose.** This folder preserves everything worth keeping from the **previous site and product** (`C:\barmatrix-site` and its sibling repos) so that the rebranded ABM/TEAR project does not lose it. It was created by auditing the old site against the current `C:\ABM` repo and capturing the gap.

**Why this exists.** Most of the high-value old material lived in a **gitignored `uploads/` folder** (internal PRDs, launch plans, app data model, copy kit, real marketing data, question batches) — it was never committed anywhere and would have been lost if `C:\barmatrix-site` were deleted. The product mechanics, data model, and the content-factory IP (44 tension points × 280-slot blueprint × 11 trap families) also lived only in that separate repo. All of it is now physically copied into `source/` here, plus synthesized into the reference docs below.

---

## What's here

| File | Captures |
|---|---|
| [00_PAGE_INVENTORY.md](00_PAGE_INVENTORY.md) | Every page the old site had, what each did, which carried into C:\ABM, and which unique content pages did **not** (about, partners, press, webinar, sprint, red-zone-map, seasonal, tiktok, app/operator/mobile prototypes). |
| [01_PRODUCT_AND_DATA_MODEL.md](01_PRODUCT_AND_DATA_MODEL.md) | The 11-table Postgres data model, the runtime question JSON shape, the student-app mechanics (drill flow, dashboard, forensics overlay, red-zone scoring), API endpoints, web routes, analytics events. |
| [02_CONTENT_TAXONOMY.md](02_CONTENT_TAXONOMY.md) | **The durable IP.** The 44 tension points, the 280-slot blueprint, the 11 wrong-answer ("counterfeit") trap families, the 10-gate QA rubric, CA distinctions, stem archetypes, and how it all maps onto TEAR. |
| [03_MARKETING_FUNNEL_AND_DATA.md](03_MARKETING_FUNNEL_AND_DATA.md) | Funnel/page-purpose map, pricing/offer config, conversion-target benchmarks, email sequence structure, and the real diagnostic content from `real-marketing-data.json`. |
| [04_PARTNER_PROGRAM.md](04_PARTNER_PROGRAM.md) | Referral/influencer program: economics, qualification rules, attribution/tracking states, payout workflow, fraud controls, outreach wave plan. |
| [05_BRAND_KIT_AND_FOUNDER.md](05_BRAND_KIT_AND_FOUNDER.md) | Founder origin story, the brand kit (color hex + roles, typography), persona positioning packages, the competitor-companion table, and the TikTok script library. |
| [06_CLAIMS_REFERENCE.md](06_CLAIMS_REFERENCE.md) | Factual catalog of what the old product claimed and its substantiation basis. **Reference only.** |
| `source/` | Verbatim copies of the raw files (see below). |

## `source/` — verbatim raw files

- `source/uploads/` — the 7 numbered strategy/PRD/ops docs, the 71KB build packet, `Launch_Plan_7Day.md`, `real-marketing-data.json`, and the raw question batches (`.xlsx`, `parsed_*.json`). **Docs 01–04 only survive as text inside `BARMATRIX_3DAY_SITE_APP_BUILD_PACKET_REVISED_999_1000.md`** — they had no standalone files.
- `source/app-data/` — the student-app drill content + manifest + state shape (`evidence-a1-drill.js`, `drill-*.js`, `data.js`, `drill-manifest.js`).
- `source/operator-data/` — `pipeline-data.js` (the 44-tension / 280-slot / 11-trap-family content factory) and operator `data.js`.
- `source/site-meta/` — the old site's own `README.md`, `CLAUDE_CODE_HANDOFF.md`, and marketing `data.js`.

---

## ⚠️ Reading rules (carry the project's hard rules into how you use this)

1. **No-guardrails rule.** The old docs contain disclaimer banks, "claims to avoid" lists, and prohibited-copy hedges. These are cataloged as historical fact in `06_CLAIMS_REFERENCE.md` and flagged inline. **Do NOT re-inject any of that guardrail/hedge language into ABM site content or docs.** (Per `no-guardrails-in-content` memory — guardrail creep killed a prior launch; the founder's legal team owns claim safety.)
2. **Names are swappable.** "BarMatrix," "MBE Tension Matrix," "Wrong Answer Forensics," "Red-Zone Drills," "MBE Rescue" are old surface names. The distillation (the method, the taxonomy, the data) is the moat. ABM's own VISION/PRODUCT/POSITIONING/LEXICON supersede the old positioning.
3. **Provenance not gospel.** The old commercial terms ($999 / first-250 / $199 referral / 1,000 target) and the GCP/Firebase stack were *that launch's* decisions/intent. The current ABM ships on **Vercel** with a **Clerk-gated** API. Treat the old numbers and stack as historical reference, superseded by ABM's own foundation docs and current infra. Internal sources even conflict with each other (see `03`'s 7-Day-vs-Revised note).
4. **`source/` is git-ignored by default.** The raw trove (2.2 MB, incl. confidential question content) mirrors how the old repo kept `uploads/` out of git. The synthesized `.md` docs are clean and safe to commit. If the founder wants the raw source in the repo, remove the `docs/legacy-barmatrix-site/source/` line from `.gitignore`.

## Number discrepancy — RESOLVED by canon

Marketing pages cite **"47 trap shapes / 156 tension points / 2,400 questions"**; the old content factory (`pipeline-data.js`) defines **44 tensions / 280 slots / 11 trap families** (Evidence pillar only). Both are superseded for *current* numbers: `C:\barmatrix-canon` (audited 2026-06-11) is authoritative — **84 canonical tensions (all 8 subjects) · 3,666 active questions ("2,400" remains the approved marketing figure) · 25 WAL codes + 23 architecture tags (two distinct vocabularies, not "11 families")**. See [../CANON_REFERENCE.md](../CANON_REFERENCE.md). The legacy pipeline remains the only record of the *authoring method* (slot blueprint + QA gates).

## Sibling repos (related, not captured in depth here)

The old ecosystem spanned several repos under `auronpep`. This capture focused on `barmatrix-site` (the previous marketing site C:\ABM directly rebrands). The others, for reference:

- `C:\barmatrix-app` — the real Next.js product app (gated). **Audited 2026-06-11 → captured in [../LIVE_INFRASTRUCTURE.md](../LIVE_INFRASTRUCTURE.md).**
- `C:\barmatrix-api` — the live backend API. **Audited 2026-06-11 → captured in [../LIVE_INFRASTRUCTURE.md](../LIVE_INFRASTRUCTURE.md).**
- `C:\barmatrix-canon` — structured content canon/taxonomy. **Audited 2026-06-11 → captured in [../CANON_REFERENCE.md](../CANON_REFERENCE.md)** (it IS the most advanced taxonomy version).
- `C:\BMSite`, `C:\BARMATRIX` — earlier planning repos (products, launch plans, spreadsheets). Not deeply captured; the BARMATRIX ops repo holds the DB schema source of truth (`SCHEMA_MYSQL.sql`).
- `C:\BarMatrix_Content`, `C:\####BAREXAM`, `C:\###JOSHUA` — raw subject content and source corpus (the keys-consolidation workstream's home is `C:\###JOSHUA\_CANONICAL\`, see root `HANDOFF.md`).
