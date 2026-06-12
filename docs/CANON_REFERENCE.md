# Canon Reference — authoritative product numbers & taxonomy

`C:\barmatrix-canon` is the structured knowledge canon extracted from the live code/DB (last verified 2026-06-06, 26 items, 0 drift alarms). **It is the authoritative source for product numbers and taxonomy** — it supersedes the legacy-site taxonomy where they overlap. Audited 2026-06-11; key facts captured here so this repo doesn't ship stale numbers.

---

## 1. Authoritative numbers (use these, not the old-site figures)

| Fact | Authoritative value | Stale values in circulation |
|---|---|---|
| Question bank | **3,666 active DB questions**; "2,400" is the approved *marketing* figure (both valid per decree — document both, don't conflate) | "2,400-question bank" as a literal DB count |
| Tension points | **84 canonical** (7 subject groups × 12; IDs like `CP-TM-001`) | "156 tension points" (old marketing projection); "44" (old Evidence-only pipeline) |
| Trap vocabularies | **TWO distinct**: 25 WAL codes (legal-logic/content layer) + 23 architecture tags (22 browsable, locked in `lib/traps.ts`) | "11 trap families" (old pipeline-data.js), "47 trap shapes" (old marketing) |
| Forensic tag rows | 34,832 | — |
| Postures | 31 | 5 (old pipeline enum) |
| Diagnostic length | **Two live flows**: curated placement = 12 Q; trap-weighted = 20 Q | "18" (stale) |
| Price | $999 flagship; 2-pay $500 + $499 (day 30); cohort `JULY_MBE_REPAIR`, internal capacity 1,000 (never exposed) | $599 / hard-cap variants in old plans |

Per-subject active questions: Evidence 809 · Contracts 602 · Torts 500 · Civ Pro 410 · Real Property 400 · Con Law 380 · Crim Law 285 · Crim Pro 280.

## 2. Program mechanics canon documents (the "repair" story, code-true)

- **Red zones**: 9 live forensic dimensions; red-zone materialization whitelisted to 3 (`subject`, `subtopic`, `tension_point`). **Proficiency = correct / (attempts + high_conf_wrong); zone is red when < 0.7** — "sure and wrong" is penalized twice. This is the algorithmic basis for any "the system finds your weak spots" copy.
- **Repairs**: 169 distinct repair labels · 51 executable micro-bundles (`diag-remediation.ts`) · 7 boot-camp tracks (CL/CP/CR/EV/K/RP/T × 12 lessons = 84 slots).
- **Diagnostic pool**: curated placement pool of 20 entries (12 served: 6 hard-set + 6 random), fully enumerated in canon.

## 3. How canon relates to the legacy capture

The [legacy capture](legacy-barmatrix-site/02_CONTENT_TAXONOMY.md) preserved the old **content-generation recipe** (44 Evidence tensions × 280-slot blueprint × 11 trap families × 10 QA gates — *how to build* questions). Canon documents **what exists now** (84 tensions all-subject, two trap vocabularies, live counts). They're complementary: canon supersedes on *numbers and current taxonomy*; the legacy pipeline remains the only record of the *slot-blueprint authoring method and QA gates*.

## 4. Where to look in canon (most valuable files)

| File | What it holds |
|---|---|
| `30-taxonomy/tensions.md` | The 84-tension catalog + ID scheme + two surface layers (curated vs ~241 observed-in-bank tags) |
| `30-taxonomy/traps.md` | WAL codes vs architecture tags disambiguation + full slug lists |
| `30-taxonomy/repairs.md` / `red-zones.md` | Repair bundles, boot-camp tracks, the proficiency formula |
| `20-data/content-counts.md` | The authoritative number table |
| `20-data/db-schema-overview.md` + `tables/*.md` | 45-table MariaDB schema (incl. `tension_points` 18-col model) |
| `10-architecture/api-surface.md` / `app-routes.md` / `integrations.md` | 74 API routes w/ auth tiers · 61 app routes · 6 integrations w/ env keys |
| `00-overview/offer-and-cohort.md` | Pricing/cohort/Stripe env key names |
| `60-runbooks/deploy-api.md` | The API deploy SOP (mirrored into [LIVE_INFRASTRUCTURE.md](LIVE_INFRASTRUCTURE.md)) |
| `70-status/contradictions.md` + `extractors/decrees.json` | 4 resolved contradictions (diagnostic length, bank size, Next 16, price) — de-facto decision records |

## 5. Known gaps in canon (don't expect to find these there)

`40-decisions/`, `50-brand/`, `80-agents/` are **empty**. No site-deploy, DB-migration, or content-pipeline runbooks. Brand voice/colors live only in this repo's foundation docs + the [legacy brand kit](legacy-barmatrix-site/05_BRAND_KIT_AND_FOUNDER.md). Canon refresh: `extract_all.py → build_index.py → verify_canon.py` (see its README).
