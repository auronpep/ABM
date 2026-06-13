# CQ DB Frontend Migration

Backend source of truth: `C:\barmatrix-api\tasks\cq-batch-2026-06-12\cq-batch.sql`

The CQ items now load into normalized question-bank tables and a rich render table:

- `questions`, `answer_choices`, `question_tags`: selection, attempts, analytics, red-zone, drill targeting.
- `item_render_documents`: CQ-derived render payloads for public item display, trap index browsing, repair pages, and full provenance.

## API Endpoints

- `GET /api/items/library?page=1&limit=100`
  - Public-safe paged item list.
  - Does not include answer keys, counterfeits, or repair explanations.

- `GET /api/items/trap-index`
  - Public-safe trap-index projection built from repair payload metadata.
  - Includes ids, subject/topic/subtopic, difficulty, tension, dominant trap label, and mold tags.

- `GET /api/items/:id/public`
  - Public-safe item payload.
  - `:id` may be a question UUID, CQ source stem such as `CQ14382`, `CQ14382.md`, or the generated external id such as `14382_bethlehem_lanterns`.

- `GET /api/items/:id/repair`
  - Enrolled-only repair payload.
  - Includes answer key, correct explanation, counterfeits, Gold/Silver keys, repair card, exam-day script, drill seeds, and provenance.

## Migration Order

1. Replace static trap-index reads with `GET /api/items/trap-index`.
2. Replace question display fetches with `GET /api/items/:id/public`.
3. Replace repair-page content fetches with `GET /api/items/:id/repair` after an authenticated/enrolled dashboard session exists.
4. Keep attempts and no-repeat behavior on normalized DB tables; do not derive student state from render JSON.
5. After all dashboard consumers read from API, retire `/qdata` generation as a fallback-only artifact.

## Payload Rule

Public surfaces use `public_payload` only. Anything that reveals `key`, `correct_choice`, `counterfeits`, Gold/Silver keys, repair card, or drill seeds must come from the enrolled-only repair route or a post-submit forensics route.
