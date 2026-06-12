# CQ Transform Prompt v3 — Design

*2026-06-12. Evolves `C:\CCG\PROMPT.md` so every generated file feeds all paid-program
components, not just a strong question. Companion to BATCH1_CQ_INGESTION.md and
DASHBOARD_PROGRAM_ENHANCEMENTS.md. Approved direction from founder session 2026-06-12.*

## Problem

Files are generated in isolation. Keys, misconceptions, tensions, and remediation cards
are minted bespoke per file, so the program surfaces that depend on *coordination across
items* (Brass Keys keyring, Misconception Mirror, tensions catalog, Last-Minute Review
deck, fresh-question retests) accumulate duplicates instead of density. Several declared
fields ship null (`difficulty`) or prose-only (dominant trap, stem), forcing the QA
gate to recover data from markdown.

## Design

### 1. Canonical registries (the core mechanism)

Same pattern as `OUTLINE_CODES_COMPLETE.md`: attach a registry file, forbid invention,
provide a mint-with-review escape hatch. Four registries, all in `C:\CCG\registries\`:

| Registry | File | Feeds |
|---|---|---|
| Gold/Silver keys | `KEYS.md` | Brass Keys keyring, LMR deck, KeyCard |
| Misconceptions | `MISCONCEPTIONS.md` (~10–20/subject) | Misconception Mirror |
| Tensions | `TENSIONS.md` (~30–50/subject) | `#/tensions` catalog, zone ranking |
| Remediation cards | `REMEDIATION_CARDS.md` | Anchor deck, repair history |

Prompt rules: (a) reuse an existing ID when the underlying distinction/belief/axis/card
matches; (b) otherwise mint a new ID **and emit a `registry_update` block** in the
output; (c) QA gate collects registry_update blocks into a review queue — new entries
are not canon until appended to the registry file. Bespoke phrasing survives as
`*_detail` free-text fields alongside the canonical ID.

Registries are **seeded from the existing 104 Finished files** by a consolidation pass
(extract all bespoke keys/misconceptions/tensions/cards, cluster, name canonically).

### 2. Retest twin (bank-growth multiplier)

The prompt already designs 5 variations and ships 1. v3 emits variation #2 as a compact
**retest twin**: stem + choices + letter map + key + per-choice why lines only (no case
study). Flagged `role: retest_twin`, same invariant layer, different skin. Serves the
4-day fresh-question retest (DASHBOARD §2.1): guaranteed unseen sibling in the same
(filter, mold) family. One transform run → two bank rows.

### 3. Machine-readable manifest (frontmatter contract)

Anything a generator or program surface consumes must exist as a YAML field, never only
as prose. Frontmatter (and B1 YAML) gains/requires:

- `stem` in `barmatrix_row` (currently recovered from Pass-1 markdown)
- `dominant_trap` in `answer_array` (parser's read location) — keep frontmatter copy
- `difficulty_band`: required, one of `core_diagnostic | trap | elite_discriminator`,
  with `band_provenance: derived_from_pick_rates | estimated` (derive mechanically when
  rates exist: e.g. <55% correct + ≥35% dominant trap → trap band)
- `diagnostic_value: high | medium | low` (discrimination quality self-nomination)
- `expected_seconds`, `position_preference: warmup | main | review`,
  `retest_interval_class: standard | short`
- `truth_family`: ID (defaults to the gold-key ID) so Today's Truths dedupes
- registry IDs used + `registry_update` blocks if any
- `twin_present: true|false`
- standard `---` frontmatter terminator (not a dash-run); fix Pass-1 §4 numbering skip

### 4. Format disciplines (stated rules, not conventions)

- Recovery cues (`future_cue` / recovery_step): imperative, second person, ≤90 chars,
  names a move not a rule.
- Drill seeds: answer ≤8 words, one controlled-vocab `target_skill` per seed, add 4th
  seed type `calibration_check`.
- `final_student_script`: ≤4 sentences, spoken cadence, tagged `tts_ready: true`.
- `component_routing`: controlled lesson IDs + one-line why.

### 5. Outline codes become navigation-grade

Codes are internal-only (never student-visible — the NCBE outline *names* are the UI).
QA gate hard-fails (not warns) any code absent from `OUTLINE_CODES_COMPLETE.md`.
This unblocks the Exam Map surface (separate spec, queued behind this work).

### 6. Generator/QA updates (barmatrix-api)

`generate-cq-batch.ts`: parse all v3 fields; verify outline codes against the map
(retire the stale "no outline map exists" warning); treat pick-rate provenance
`inherited` as a distinct category (kept out of `focus_group_response_data` by default,
informational note not warning); ingest retest twins as bank rows flagged
`role=retest_twin`; collect `registry_update` blocks into a review report.
(Subsumes spawned chip task_8e60d304.)

### 7. Backfill pass (one-time)

Over the existing 104 Finished files: map bespoke keys/misconceptions/tensions/cards to
the seeded registries, verify/correct outline codes, derive difficulty bands where pick
rates exist. Mechanical LLM pass; output is edits to the files + a diff report, QA gate
re-run after.

## Build order

1. Seed registries from the 104 files (must precede any new batch run — every file
   generated before registries exist adds dedup debt)
2. PROMPT.md v3 rewrite
3. Generator/QA updates
4. Backfill pass over the 104 files
5. Re-run `generate-cq-batch.ts all`, reload

## Risks

- Registry context grows the prompt per run → keep registries terse (ID + one-line
  statement + trigger).
- No-invent adds a failure mode (no fitting entry) → mint-with-review escape hatch.
- Twin quality is design-level only (variation table), not full-analysis → twin gets
  Pass-1 treatment for its own letter map; QA gate validates twin key consistency.

## Out of scope

Exam Map UI/API (own spec), legacy 3,686-question outline backfill, Final Sprint UI.
