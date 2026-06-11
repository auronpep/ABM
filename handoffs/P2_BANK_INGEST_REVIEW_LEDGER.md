# P2 — BANK INGEST & REVIEW LEDGER

**Implementer:** Claude Code · **Inherits:** cc-handoff doc 00 gates.
**Objective:** (1) a single source-of-truth ledger answering "exactly which
Christian-flavored questions are attorney-approved and contract-valid," and
(2) the approved subset loaded to production MariaDB through the existing
gated pipeline. The $999 product's contents are defined by this packet.

## Hard rules (restated because this packet touches the DB)

- C:\BMO is READ-ONLY. Reference its scripts/SQL; copy to a working dir to
  run; never commit into BMO.
- NO production DB write without: fresh Hostinger backup → staging
  verification → explicit founder approval. Every time.
- Review-queue / pending content is NEVER promoted to student-facing
  surfaces. Retrieval does not equal approval.
- MariaDB compatibility: no MySQL-8-only JSON behavior.

## Phase 1 — The Review Ledger (build first; no DB writes)

Scan sources: `C:\CCG\Finished\*.md` (transformed questions),
`C:\BMO\BARMATRIX\c3-rewrite\` outputs (read-only), and any founder-named
corpus roots. Emit `review_ledger.csv` + summary JSON with one row per
question:

| Column | Source |
|---|---|
| qid, transformed_from | PASS-2 YAML |
| subject / topic / subtopic | YAML |
| source_path | scan |
| pass2_complete (all 5 blocks present) | scan |
| contract_valid (doc 03 contract) | validator from funnel task A-1 |
| pick_rate_provenance_ok | provenance fields present + inherited-form wording check |
| christian_flavor_clean (names-and-setting only flag from QC block) | YAML quality_control |
| attorney_status: approved / pending / draft / unknown | review records where they exist; else `unknown` |
| review_evidence_path | link to sign-off artifact if found |

Outputs: founder summary — counts by subject × attorney_status, plus the
gap list (contract failures, missing blocks). **`unknown` is treated as
`pending`. Nothing ships on inference.** Attorney sign-off is the
founder's act; the ledger only records and routes it. Provide a simple
founder workflow: a `review_decisions.csv` the founder edits
(qid → approved/rejected/date), merged into the ledger on each run.

## Phase 2 — Transform to load format

For `attorney_status = approved` AND `contract_valid = true` only:
emit load artifacts using the existing patterns
(`emit_bank_mysql.py`, `SEED_BANK_INGEST_MYSQL.sql`,
`C3_QA_GATE.sql` — copy from BMO to working dir). Preserve: stable qid,
transformed_from lineage, trap metadata (filter/mold/instinct), gold/silver
keys, drill seeds, pick-rate provenance fields, review status + date.

## Phase 3 — Staging load + QA

Load to staging DB. Gates before any promotion request:
- Row-count reconciliation: ledger approved count == staged count, by subject.
- C3 QA gate SQL passes.
- Random sample of 20 staged questions rendered in the app against source
  files — stem/choices/key/forensics byte-identical.
- Answer-shuffle behavior verified (existing
  SCHEMA_DIAGNOSTIC_ANSWER_SHUFFLE pattern) so keys survive shuffling.

## Phase 4 — Production promotion (founder-gated ceremony)

1. Fresh Hostinger DB backup, verified restorable.
2. Present founder: ledger summary, staging QA report, exact SQL to run,
   rollback statement.
3. On written approval: run, verify counts, smoke-test 5 questions live,
   log the promotion (date, counts, ledger hash).

## Standing cadence

The ledger run becomes repeatable (one command) so each new authored batch
flows: author → ledger → founder review decisions → staging → promotion.
Target steady state: ledger refresh under 5 minutes, batch promotion under
1 hour including backup.

## Acceptance

- [ ] Ledger covers every question file in named roots; zero unparsed files
      unaccounted (parse failures listed, not dropped)
- [ ] Founder can answer "how many approved Evidence questions?" in one look
- [ ] A question flipped to `approved` in review_decisions.csv appears in
      the next staging load; a `rejected` one never does
- [ ] Full Phase 1–3 dry run completed; Phase 4 awaiting founder
