# Source Workbooks — Criminal Law Pattern Batches

Externally-produced (ChatGPT custom-GPT) pattern/trap analysis workbooks for the
BarMatrix Criminal Law & Procedure question bank. These are **source inputs** to the
pattern-analysis effort in the parent folder — distinct from the Claude-generated
outputs there (`criminal_law_pattern_index.csv`, `*_taxonomy.json`, `*_report.md`,
choices-only ceiling tests, etc.).

Filed here 2026-06-13 after triage from `~/Downloads`. Originals + `.zip` copies
remain in Downloads as backup and may be deleted.

---

## CL Pattern Batch 2 (`CL_Pattern_Batch_2_*`)

A self-contained pattern-mining pass over **338 Criminal Law & Procedure questions**,
keyed to `barmatrix_question_id`. README inside the workbook cites its source as
`CL PAttern Batch 2.xlsx / Sheet1`.

| File | What it is |
|---|---|
| `CL_Pattern_Batch_2_Completed.xlsx` | Master workbook, 9 sheets (see below) |
| `CL_Pattern_Batch_2_MBE_Nuggets.csv` | 338 distilled study nuggets (Pattern \| Trap \| Look-for \| Rule), one per question, with correct/most-popular-wrong letters |
| `CL_Pattern_Batch_2_MBE_Nuggets.txt` | Same 338 nuggets, prose format (<150 words each; does not reproduce full MBE questions) |
| `Assessment_1_Criminal_Law_and_Procedure.txt` | 20-question assessment drawn from the patterns (mirrors workbook `Assessment_1` sheet) |

### Workbook sheets (data-row counts)

| Sheet | Rows | Content |
|---|---|---|
| `Sheet1` | 338 | Raw questions: stem, A–D, correct/most-popular-wrong, per-choice focus-group % (sparse), official + wrong-answer explanations |
| `Question_Extraction` | 338 | Phase-1 per-question extraction: `Pattern_ID`, NCBE outline node, tested rule, doctrinal pivot, exact trigger fragments, default correct outcome, high-value flag, most-dangerous misconception |
| `Patterns` | 68 | Pattern catalog: `Pattern_ID` → tested rule, doctrinal pivot, trigger phrases, default outcome, jurisdiction-split flag, source-QID list, difficulty, question/high-value counts |
| `Traps` | 1013 | Trap catalog: `Trap_ID` (linked to `Pattern_ID`) → seductive logic, trigger phrases, wrong-answer type, elimination cue, common misclassification, % selected |
| `Tracker` | 1081 | Per-pattern/per-trap bar-readiness tracker: core-issue check, accuracy status, failure mode, drill priority |
| `Compact_Lessons` | 68 | One brief lesson per pattern: when-you-see-this triggers, pivot, rule, default outcome, primary trap, micro-hypo |
| `Assessment_1` | 20 | 20-question assessment, each tagged to a `Pattern_ID` |

`Pattern_ID` scheme is bespoke to this batch (e.g. `H-A01` homicide-provocation,
`CPA-C16` physical-evidence-not-testimonial); not yet present anywhere else in
BMO/ABM.

### Question-ID provenance (verified 2026-06-13)

Cross-checked the 338 IDs against `C:\BMO\BARMATRIX\c3-rewrite\spine.jsonl`:

- **55 / 338** resolve in the c3-rewrite spine subset — **all 55 are `CRIMINAL`** (zero
  subject mismatches), consistent with a pure Criminal Law/Procedure batch.
- **283 / 338** do not appear in the c3-rewrite spine, CCG/Finished, or ABM qdata.
  These are the higher-numbered, named-character IDs (e.g. 19099 Simon, 20828, 18718
  Victor, 21562 Morgan, 19746 Rina, 20888 Dana) — they read like C3/authored questions
  and most likely live only in the **full live MySQL bank (3,666 q)** or the upstream
  source the GPT was given. Full validation requires the live API DB, not a local file.

> Caveat: treat focus-group percentages as sparse/partial — only a minority of `Sheet1`
> rows carry per-choice %; the rest are blank. Per INGESTION §3, focus-group pick rates
> are INTERNAL-ONLY and never displayed publicly.

### Relationship to the product / next steps

This batch's `Patterns`, `Traps`, and `Compact_Lessons` map directly onto live product
surfaces — `#/traps` catalog, `#/tensions`, prescribed drills, red-zone ranking, and the
TEAR lessons. It is **not** in ingest-ready pack form (see `INGESTION.md` §1–3 and
`BATCH1_CQ_INGESTION.md`): turning it into loaded content would need a tag → schema-
validated subject-pack JSON → SQL → `copy-data` pass, plus reconciliation of the bespoke
`Pattern_ID`/trap vocabulary onto the canonical mold/family taxonomy. Until then it serves
as **analysis source material and a cross-check** against the Claude-generated
`criminal_law_pattern_index.csv` / taxonomy in the parent folder.

This also answers the open question in `INGESTION.md` §6 ("where the near-ready batches
live — xlsx? which folder"): externally-produced Criminal Law pattern workbooks live
here.
