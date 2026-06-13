# Rich Item Database Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move CQ-derived drill, diagnostic, and repair content toward API/DB-backed item projections while preserving the rich CQ file data needed by repair pages.

**Architecture:** Keep the existing `barmatrix-api` MySQL database as the single production content store. Continue using normalized `questions`, `answer_choices`, and `question_tags` for selection/analytics, and add an `item_render_documents` table for full CQ-derived render packages plus raw source markdown. Add API helpers/routes that return safe public payloads before an answer and repair/forensics payloads after an attempt.

**Tech Stack:** TypeScript, Express, MySQL 8 JSON columns, existing `mysql2` DB wrapper, CQ markdown parser in `src/scripts/generate-cq-batch.ts`, ABM React frontend.

---

### Task 1: Backend Render Document Foundation

**Files:**
- Modify: `C:\barmatrix-api\src\scripts\generate-cq-batch.ts`
- Add: `C:\barmatrix-api\src\scripts\generate-cq-batch.test.ts` updates
- Generate: `C:\barmatrix-api\tasks\cq-batch-2026-06-12\cq-batch.sql`

- [ ] Add `item_render_documents` DDL to generated CQ SQL.
- [ ] Generate one render document per passed CQ file with public, repair, and full/source payloads.
- [ ] Include raw source markdown and a source hash so future rebuilds can prove provenance.
- [ ] Add regression coverage proving a representative CQ file emits an item render upsert.

### Task 2: API Item Projection Helpers

**Files:**
- Add: `C:\barmatrix-api\src\lib\item-render.ts`
- Add: `C:\barmatrix-api\src\lib\item-render.test.ts`

- [ ] Shape qdata-compatible public payloads from DB rows plus render JSON.
- [ ] Shape trap-index entries from DB rows plus render JSON.
- [ ] Shape repair render payloads that include picked-choice forensics, keys, repair card, and exam-day script.
- [ ] Ensure public payloads never expose `key`, correct choice, or forensics before answer submit.

### Task 3: API Routes

**Files:**
- Add: `C:\barmatrix-api\src\routes\items.ts`
- Modify: `C:\barmatrix-api\src\index.ts`
- Add: `C:\barmatrix-api\src\routes\items.test.ts`

- [ ] Add `GET /api/items/library`.
- [ ] Add `GET /api/items/:id/public`.
- [ ] Add `GET /api/items/trap-index`.
- [ ] Add `GET /api/items/:id/repair?attempt_id=...` for answered attempts.
- [ ] Register routes before generic `questions/:id`-style routes if route precedence requires it.

### Task 4: Frontend Migration

**Files:**
- Modify later: `C:\ABM\src\pages\Drill.tsx`
- Modify later: `C:\ABM\src\pages\Diagnostic.tsx`
- Modify later: `C:\ABM\src\pages\Repair.tsx`
- Modify later: `C:\ABM\src\program\repair.ts`

- [ ] Add API client methods for item library, public item, trap index, and repair render.
- [ ] Switch Drill to API with `/qdata` fallback.
- [ ] Switch Diagnostic curated IDs to API with `/qdata` fallback.
- [ ] Switch Repair selection to API trap index with `/qdata` fallback.
- [ ] Move repair state persistence from browser-only localStorage to API assignments after DB attempts are wired.

### Task 5: Verification

- [ ] `node --import tsx --test src/scripts/generate-cq-batch.test.ts`
- [ ] `node --import tsx --test src/lib/item-render.test.ts src/routes/items.test.ts`
- [ ] `npm run typecheck` in `C:\barmatrix-api`
- [ ] `npx tsx src/scripts/generate-cq-batch.ts all`
- [ ] `git diff --check` in `C:\barmatrix-api`
- [ ] Update `C:\ABM\tasks\todo.md` with the exact results and remaining frontend/DB-load steps.
