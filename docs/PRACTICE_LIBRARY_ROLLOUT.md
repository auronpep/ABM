# Practice Library Rollout — usage tracking, outline drilling, single-subject practice

*Written 2026-06-12. Implements the approved plan in
`~/.claude/plans/review-our-current-project-fuzzy-lemon.md`. Companion to
DASHBOARD_PROGRAM_ENHANCEMENTS.md and BATCH1_CQ_INGESTION.md.*

## What was built

### barmatrix-api (`C:\barmatrix-api`)

| Piece | Where |
|---|---|
| Outline parser + helpers (593 codes, 36 subtopics) | `src/lib/outline.ts` (+ tests) |
| SQL generator (`npx tsx src/scripts/generate-outline-sql.ts`) | `src/scripts/generate-outline-sql.ts` |
| Generated load file (DDL + data, idempotent) | `tasks/outline-2026-06-12/outline.sql` |
| DDL record | `C:\BMO\BARMATRIX\engineering\SCHEMA_OUTLINE_MYSQL.sql` |
| `GET /api/outline` — tree + live question counts (public, counts only) | `src/routes/outline.ts` (+ tests) |
| Drill kinds `subject` + `outline` on `POST /api/drills/start` (enrolled) | `src/routes/drills.ts` (+ tests) |
| `GET /api/me/usage` — per-subject/subtopic/day usage mirror (enrolled) | `src/routes/me-usage.ts` |

Key decisions encoded:
- **Canonical outline** = `OUTLINE_CODES_COMPLETE.md` (BMO engineering, mirrored at C:\CCG).
  Parser hard-fails on drift. NEVER-invent rule enforced: only the 593 listed codes load.
- **Strict shared no-repeat ledger** (founder, 2026-06-12): the new `subject`/`outline`
  selection excludes EVERY question in `student_attempts` for that student, any mode.
  `POST /api/attempts` (already live) is the ledger writer — time_seconds, confidence,
  set_id all recorded per answer.
- **Two-tier outline navigation**: AB subtopic level works from day 1 via
  (subject, subtopic) name matching (`outline_subtopics.aliases` absorbs naming drift);
  deeper codes serve only `outline_verified = 1` questions. The invented batch-1
  metadata codes are never promoted — deep classification is a per-batch CCG pass.

### C:\ABM frontend

| Piece | Where |
|---|---|
| `#/practice` Practice Library (subject grid, outline tree, 8-digit code entry, set runner with per-question stopwatch + forensics) | `src/pages/Practice.tsx` |
| Authed API client | `src/lib/api.ts` |
| Nav "Practice" link (signed-in only) | `src/components/Nav.tsx` |
| Usage mirror glass on `#/welcome` (quiet, renders only with data) | `src/pages/Welcome.tsx` `UsageMirror` |
| Events `practice_set_start` / `practice_set_complete` | `src/lib/events.ts` |

Doctrine preserved: the led spine keeps one primary action; the Library is a separate
opt-in surface. No streaks, no percentiles, no focus-group numbers.

## Rollout order (do not reorder)

1. **Apply `barmatrix-api/tasks/outline-2026-06-12/outline.sql`** to the prod DB
   (same channel as the cq-batch SQL; idempotent). MariaDB-only syntax in the ALTERs.
2. **Deploy barmatrix-api** (`scripts/deploy.sh`, atomic Hostinger swap).
3. **Verify API** (no auth needed for the first):
   - `GET https://api.barmatrix.app/api/outline` → 36 subtopics, 593 nodes,
     subtopic `question_count` > 0 for the 7 covered subjects.
   - Unauthenticated `POST /api/drills/start {kind:"subject",subject:"TORTS"}` → 401.
   - Note any subtopic with `question_count: 0` whose subject has questions —
     that's naming drift; add the DB spelling to `outline_subtopics.aliases`.
4. **Deploy C:\ABM** (`vercel deploy --prod --archive=tgz`).
5. **Prod smoke (enrolled account, on barmatrix.app)**: start a subject set, answer one
   question (check the attempt POST carries `time_seconds` + `set_id`), start an
   outline AB drill overlapping it, confirm the answered question does NOT reappear,
   confirm the Welcome usage mirror lights up.

## Open follow-ups

- **Phase D (deferred)**: migrate the led repair loop/retests/mixed sets from static
  qdata to the DB bank with the shared ledger (plan §Phase D; biggest credibility
  upgrade per DASHBOARD_PROGRAM_ENHANCEMENTS §2.1/§3.1).
- **Deep classification**: re-run batch-1's 106 questions against the real code list
  (CCG pipeline), write `outline_code` + `outline_verified=1`; then per-batch forever.
- **Coarse coverage report**: `/api/outline` exposes per-AB counts; unmatched
  (subject, subtopic) pairs surface as zero-count subtopics — fix via aliases.
- Confidence is posted as a constant 3 from the Library runner; a sure/unsure toggle
  would feed the calibration mirror later.
