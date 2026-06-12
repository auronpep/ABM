# INGESTION — Question Bank Scale-Up Notes

*Written 2026-06-11. Companion to REQUIREMENTS.md / COMPONENTS.md. Covers how the
hundreds of near-ready questions and items get into the database, and which redesign
components a larger bank unlocks.*

---

## 1. Where content goes

The frontend never touches the database. All content lands on the API side
(`C:\barmatrix-api`, MariaDB/MySQL behind `api.barmatrix.app`) and reaches ABM only
through the existing endpoints (REQUIREMENTS §5).

Existing ingestion plumbing on the API side:

| Piece | Path | Role |
|---|---|---|
| Schema apply | `barmatrix-api/scripts/apply-schema.mjs` | DDL / migrations |
| Data copy | `barmatrix-api/scripts/copy-data.mjs` | Bulk load |
| Subject data packs | `barmatrix-api/src/data/c3-subjects/<subject>/` | Per-subject JSON: `*_cards.json`, `*_drills.json`, overlays, manifests, tagging-schema extensions |
| SQL generator (pattern) | `barmatrix-api/src/scripts/generate-ambassador-diagnostic-sql.ts` | Template for batch → SQL scripts |

**Pattern to follow for the new batches:** tag → schema-validated JSON per subject pack →
SQL generator → `copy-data` load → verify through the public endpoints. Don't invent a new
path; clone the criminal/rp pack layout for each subject.

## 2. Vocabulary rule (important)

The database keeps the **internal** vocabulary: C3, molds, families, forensic tags,
`/api/me/c3`, etc. The TEAR / Keys / Counterfeit mapping (REQUIREMENTS §2) is a
**frontend-only translation**. Do not rename DB columns, tags, or endpoints during
ingestion — the redesign premise is "same endpoints, same contracts."

## 3. Per-item readiness checklist

An item is ingest-ready when it has all of:

- [ ] **Stem** — clean, single question, approved archetype frame
- [ ] **4 choices** with `correct` flag on exactly one
- [ ] **Per-choice `why`** — the counterfeit diagnosis for each wrong answer (this is what
      powers Expose; an item without wrong-answer whys is not ready)
- [ ] **Subject** (one of the 8) + **subtopic**
- [ ] **Tension point slug** — links the item to its tension (powers `#/tensions/:slug`
      example questions and zone ranking)
- [ ] **Trap tag(s)** — taxonomy family per wrong answer (powers `#/traps`, PersonalMatrix
      columns, personal trap profile)
- [ ] **Gold Key** (rule ref) + **Silver Key** (mechanic) — powers `KeyCard` in forensics
- [ ] **Difficulty band** — Core Diagnostic / Trap / Elite Discriminator
- [ ] **Focus-group data** (`pct` per choice + `sampleSize`) — *if available.* Items
      without it can ship; the ForensicsPanel focus-group line renders only when present.
      Track which batches have it so we know coverage.

Items missing only focus-group data → ingest now. Items missing per-choice whys, tension
slug, or trap tags → hold; they degrade the core loop.

## 4. What the larger bank unlocks (component map)

This is the payoff: most "Not yet wired" surfaces in REQUIREMENTS are content-starved,
not code-starved. Volume converts them from stubs to real pages.

| Bank milestone | Unlocks | REQUIREMENTS phase |
|---|---|---|
| ~5+ tagged Qs per tension point | `#/tensions` catalog + `#/tensions/:slug` example questions become real | Phase 2 |
| Wrong answers tagged across trap families | `#/traps` catalog + `#/traps/:slug` "example wrong answers" | Phase 2 |
| Coverage across all 8 subjects | `#/subjects` hub + per-subject pages (compose from tension/trap filters — no subjects API) | Phase 2 |
| Volume per subject (≈30+ each) | Diagnostic upgrade beyond the curated 18; better zone detection | Phase 2–3 |
| Tension-linked items at volume | Prescribed drills + red-zone ranking become meaningful (ranking needs enough misses per zone) | Phase 3 |
| Trap-dimension tags populated | `PersonalMatrix` heat grid has real columns/heat | Phase 4 |
| Focus-group pct + sampleSize | ForensicsPanel "N% chose this" line — the core differentiator | Phase 2+ |
| Per-lesson drill items | `#/program` TEAR lessons with embedded graded drills | Phase 3 |

**Recommended ingestion order:** Evidence first (taxonomy is deepest there — 44 tensions
already mapped), then Criminal Law/Procedure and Real Property (subject packs already exist
in `c3-subjects/`), then the remaining subjects to light up `#/subjects` with honest
coverage snapshots.

## 5. Verification per batch

After each batch loads:

1. `GET /api/tensions` — new tensions appear with correct question counts
2. `GET /api/tensions/{slug}/questions` — spot-check 2–3 items end-to-end (stem, choices,
   correct letter)
3. `GET /api/attempts/{id}/forensics` on a test attempt — per-choice whys + keys render;
   focus-group line present/absent as expected
4. `GET /api/traps` — trap pull-counts move
5. Run the full diagnostic once on staging — no item renders with a missing field

## 6. Open inputs (founder)

- **Where the near-ready batches live** (xlsx? JSON? which drive/folder) — needed to wire
  the tagging pass
- **Focus-group data coverage** — which batches carry real pct/sampleSize vs none
- **Per-tension minimums** — confirm the ≈5-questions-per-tension bar before the tensions
  catalog goes public, or pick a different bar
