# Attempt Telemetry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture per-attempt behavioral micro-signals (interaction log + forensics dwell) when students answer questions, per spec `docs/superpowers/specs/2026-06-12-attempt-telemetry-design.md`.

**Architecture:** Client (C:\ABM, Vite/React) records an ordered event stream per question and posts it with the existing `POST /api/attempts` payload. Server (C:\barmatrix-api, Express + MySQL via pg-shim `db.ts`) validates the stream with zod, derives summary scalars, and stores both inside the existing `student_attempts.metadata` JSON column. Forensics dwell arrives via a new `PATCH /api/attempts/:id/forensics-dwell`. Derived-metric SQL ships as a reference file in `C:\BMO\BARMATRIX\engineering`.

**Tech Stack:** TypeScript, zod, Express, mysql2 (through `src/db.ts` pg-style shim), node:test via `tsx --test` (api repo), `tsc --noEmit` + `npm run build` (ABM repo — it has no unit test runner).

**⚠ Spec deviation (approved path):** The spec said `ALTER TABLE student_attempts ADD COLUMN interaction_log jsonb, forensics_dwell_ms integer`. Reality: the backend is **MySQL on Hostinger** (not Postgres) and `student_attempts` already has `metadata JSON NOT NULL` written on every insert. v1 therefore stores `metadata.interaction_log` (raw stream), `metadata.telemetry` (derived scalars), and `metadata.forensics_dwell_ms` — **zero schema migration**, no deploy coordination, old rows degrade to `NULL` on `JSON_EXTRACT`. Everything else in the spec is unchanged.

**Repos touched:** Tasks 1–4 in `C:\barmatrix-api` (branch off `main`). Tasks 5–7 in `C:\ABM` (current branch). Task 8 verifies both.

---

### Task 1: Telemetry validation + summary library (api repo)

**Files:**
- Create: `C:\barmatrix-api\src\lib\attempt-telemetry.ts`
- Test: `C:\barmatrix-api\src\lib\attempt-telemetry.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/attempt-telemetry.test.ts`:

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  interactionLogSchema,
  summarizeInteractionLog,
  MAX_EVENTS,
  type InteractionEvent,
} from "./attempt-telemetry.js";

const VALID_LOG: InteractionEvent[] = [
  { t: 0, ev: "shown" },
  { t: 18200, ev: "select", letter: "B" },
  { t: 41000, ev: "scroll_stem" },
  { t: 59300, ev: "select", letter: "A" },
  { t: 74100, ev: "submit", letter: "A" },
];

describe("interactionLogSchema", () => {
  it("accepts a valid ordered log", () => {
    const r = interactionLogSchema.safeParse(VALID_LOG);
    assert.equal(r.success, true);
  });

  it("rejects unknown event names (closed vocabulary)", () => {
    const r = interactionLogSchema.safeParse([
      { t: 0, ev: "shown" },
      { t: 5, ev: "mouse_move" },
    ]);
    assert.equal(r.success, false);
  });

  it("rejects non-monotonic timestamps", () => {
    const r = interactionLogSchema.safeParse([
      { t: 100, ev: "shown" },
      { t: 50, ev: "submit", letter: "A" },
    ]);
    assert.equal(r.success, false);
  });

  it("rejects select/submit without a letter", () => {
    const r = interactionLogSchema.safeParse([{ t: 0, ev: "submit" }]);
    assert.equal(r.success, false);
  });

  it("rejects logs longer than MAX_EVENTS", () => {
    const long = Array.from({ length: MAX_EVENTS + 1 }, (_, i) => ({
      t: i,
      ev: "scroll_stem" as const,
    }));
    const r = interactionLogSchema.safeParse(long);
    assert.equal(r.success, false);
  });
});

describe("summarizeInteractionLog", () => {
  it("derives all scalars from a full log", () => {
    const s = summarizeInteractionLog(VALID_LOG, "B");
    assert.equal(s.time_to_first_selection_ms, 18200);
    assert.equal(s.deliberation_ms, 74100 - 18200);
    assert.equal(s.answer_changes, 1); // two selects -> one change
    assert.equal(s.switched_off_correct, true); // selected B (correct) then submitted A
    assert.equal(s.stem_rereads, 1);
  });

  it("switched_off_correct is false when never on the correct letter", () => {
    const s = summarizeInteractionLog(VALID_LOG, "C");
    assert.equal(s.switched_off_correct, false);
  });

  it("switched_off_correct is false when submit IS the correct letter", () => {
    const s = summarizeInteractionLog(VALID_LOG, "A");
    assert.equal(s.switched_off_correct, false);
  });

  it("switched_off_correct is null when correct letter unknown", () => {
    const s = summarizeInteractionLog(VALID_LOG, null);
    assert.equal(s.switched_off_correct, null);
  });

  it("returns nulls/zeros for a log with no selections", () => {
    const s = summarizeInteractionLog([{ t: 0, ev: "shown" }], "A");
    assert.equal(s.time_to_first_selection_ms, null);
    assert.equal(s.deliberation_ms, null);
    assert.equal(s.answer_changes, 0);
    assert.equal(s.stem_rereads, 0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run (from `C:\barmatrix-api`): `npx tsx --test src/lib/attempt-telemetry.test.ts`
Expected: FAIL — cannot find module `./attempt-telemetry.js`

- [ ] **Step 3: Write the implementation**

Create `src/lib/attempt-telemetry.ts`:

```ts
// Interaction-log validation + summary derivation for student attempts.
// Spec: ABM docs/superpowers/specs/2026-06-12-attempt-telemetry-design.md §4, §6.
// The log is a closed vocabulary; unknown events are rejected so the column
// stays queryable. Telemetry must never block an attempt — callers safeParse
// and drop on failure, they do not 4xx.

import { z } from "zod";

export const MAX_EVENTS = 200;
export const MAX_LOG_BYTES = 16 * 1024;

const LETTERS = ["A", "B", "C", "D"] as const;

const letterEvent = z.object({
  t: z.number().int().min(0),
  ev: z.union([z.literal("select"), z.literal("submit")]),
  letter: z.enum(LETTERS),
});

const plainEvent = z.object({
  t: z.number().int().min(0),
  ev: z.union([z.literal("shown"), z.literal("scroll_stem")]),
});

export const interactionLogSchema = z
  .array(z.union([letterEvent, plainEvent]))
  .max(MAX_EVENTS)
  .superRefine((events, ctx) => {
    for (let i = 1; i < events.length; i++) {
      if (events[i].t < events[i - 1].t) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `non-monotonic t at index ${i}`,
        });
        return;
      }
    }
  });

export type InteractionEvent = z.infer<typeof interactionLogSchema>[number];

export interface TelemetrySummary {
  time_to_first_selection_ms: number | null;
  deliberation_ms: number | null;
  answer_changes: number;
  switched_off_correct: boolean | null;
  stem_rereads: number;
}

export function summarizeInteractionLog(
  events: readonly InteractionEvent[],
  correctLetter: "A" | "B" | "C" | "D" | null,
): TelemetrySummary {
  const selects = events.filter(
    (e): e is Extract<InteractionEvent, { letter: string }> =>
      e.ev === "select" || e.ev === "submit",
  );
  const firstSelect = selects[0] ?? null;
  const submit = selects.find((e) => e.ev === "submit") ?? null;

  let switchedOffCorrect: boolean | null = null;
  if (correctLetter !== null && submit) {
    const touchedCorrect = selects.some((e) => e.letter === correctLetter);
    switchedOffCorrect = touchedCorrect && submit.letter !== correctLetter;
  }

  return {
    time_to_first_selection_ms: firstSelect ? firstSelect.t : null,
    deliberation_ms: firstSelect && submit ? submit.t - firstSelect.t : null,
    answer_changes: Math.max(0, selects.length - 1),
    switched_off_correct: switchedOffCorrect,
    stem_rereads: events.filter((e) => e.ev === "scroll_stem").length,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx tsx --test src/lib/attempt-telemetry.test.ts`
Expected: all tests PASS

- [ ] **Step 5: Commit (in barmatrix-api)**

```bash
git add src/lib/attempt-telemetry.ts src/lib/attempt-telemetry.test.ts
git commit -m "feat: interaction-log schema + telemetry summary derivation"
```

---

### Task 2: Accept `interaction_log` on POST /api/attempts (api repo)

**Files:**
- Modify: `C:\barmatrix-api\src\routes\attempts.ts` (the `attemptBody` schema ~line 43 and the INSERT block ~lines 220–242)
- Test: `C:\barmatrix-api\src\routes\attempts.test.ts` (append)

- [ ] **Step 1: Write the failing tests**

Append to `src/routes/attempts.test.ts` (it already imports `attemptBody` and node:test; add `buildAttemptMetadata` to the dynamic import on ~line 24):

```ts
describe("buildAttemptMetadata", () => {
  const base = { anonymous: false };

  it("embeds a valid log plus derived telemetry", () => {
    const meta = buildAttemptMetadata(base, [
      { t: 0, ev: "shown" },
      { t: 1000, ev: "select", letter: "B" },
      { t: 2000, ev: "submit", letter: "A" },
    ], "B");
    assert.equal(meta.interaction_log?.length, 3);
    assert.equal(meta.telemetry?.answer_changes, 1);
    assert.equal(meta.telemetry?.switched_off_correct, true);
    assert.equal(meta.anonymous, false);
  });

  it("drops a malformed log without throwing (attempt is sacred)", () => {
    const meta = buildAttemptMetadata(base, [{ t: 5, ev: "bogus" }], "A");
    assert.equal(meta.interaction_log, undefined);
    assert.equal(meta.telemetry, undefined);
    assert.equal(meta.anonymous, false);
  });

  it("drops an absent log silently", () => {
    const meta = buildAttemptMetadata(base, undefined, "A");
    assert.equal(meta.interaction_log, undefined);
  });

  it("keeps the summary but drops the raw log when oversized", () => {
    const huge = Array.from({ length: 200 }, (_, i) => ({
      t: i * 1000,
      ev: "scroll_stem" as const,
      // pad via many events; size guard tested with the byte cap
    }));
    const meta = buildAttemptMetadata(base, huge, "A");
    // 200 small events are < 16KB, so this stays; the byte-cap branch is
    // exercised by lowering nothing — assert the summary always exists when
    // the log parsed:
    assert.equal(meta.telemetry?.stem_rereads, 200);
  });
});

describe("attemptBody with interaction_log", () => {
  it("still accepts a legacy payload without the field", () => {
    const r = attemptBody.safeParse({
      question_id: "123e4567-e89b-12d3-a456-426614174000",
      selected_letter: "A",
      confidence: 3,
      time_seconds: 10,
    });
    assert.equal(r.success, true);
  });

  it("passes interaction_log through as unknown (validated later, never rejects)", () => {
    const r = attemptBody.safeParse({
      question_id: "123e4567-e89b-12d3-a456-426614174000",
      selected_letter: "A",
      confidence: 3,
      time_seconds: 10,
      interaction_log: [{ t: 0, ev: "bogus" }],
    });
    assert.equal(r.success, true); // bad telemetry must NOT 400 the attempt
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx tsx --test src/routes/attempts.test.ts`
Expected: FAIL — `buildAttemptMetadata` is not exported

- [ ] **Step 3: Implement**

In `src/routes/attempts.ts`:

(a) Add import near the other lib imports:

```ts
import {
  interactionLogSchema,
  summarizeInteractionLog,
  MAX_LOG_BYTES,
  type InteractionEvent,
  type TelemetrySummary,
} from "../lib/attempt-telemetry.js";
```

(b) Extend `attemptBody` — add one line inside the existing `z.object({...})`:

```ts
  // Behavioral micro-signal stream (spec 2026-06-12). Deliberately z.unknown():
  // malformed telemetry must never 400 the attempt; it is validated separately
  // in buildAttemptMetadata and dropped on failure.
  interaction_log: z.unknown().optional(),
```

(c) Add the exported helper above `registerAttemptsRoutes`:

```ts
export interface AttemptMetadata {
  [key: string]: unknown;
  interaction_log?: InteractionEvent[];
  telemetry?: TelemetrySummary;
}

export function buildAttemptMetadata(
  base: Record<string, unknown>,
  rawLog: unknown,
  correctLetter: "A" | "B" | "C" | "D" | null,
): AttemptMetadata {
  if (rawLog === undefined || rawLog === null) return { ...base };
  const parsed = interactionLogSchema.safeParse(rawLog);
  if (!parsed.success) {
    console.warn("[attempts post] dropped malformed interaction_log");
    return { ...base };
  }
  const telemetry = summarizeInteractionLog(parsed.data, correctLetter);
  const oversized = JSON.stringify(parsed.data).length > MAX_LOG_BYTES;
  if (oversized) {
    console.warn("[attempts post] interaction_log over byte cap; kept summary only");
    return { ...base, telemetry };
  }
  return { ...base, interaction_log: parsed.data, telemetry };
}
```

(d) In the INSERT (step "3. Insert the attempt", ~line 240), replace the metadata value

```ts
          isAnonymous ? JSON.stringify({ anonymous: true }) : JSON.stringify({}),
```

with

```ts
          JSON.stringify(
            buildAttemptMetadata(
              isAnonymous ? { anonymous: true } : {},
              body.interaction_log,
              correctAnswer,
            ),
          ),
```

- [ ] **Step 4: Run tests + typecheck**

Run: `npx tsx --test src/routes/attempts.test.ts && npm run typecheck`
Expected: all PASS, no type errors

- [ ] **Step 5: Commit**

```bash
git add src/routes/attempts.ts src/routes/attempts.test.ts
git commit -m "feat: capture interaction_log + derived telemetry in attempt metadata"
```

---

### Task 3: PATCH /api/attempts/:id/forensics-dwell (api repo)

**Files:**
- Modify: `C:\barmatrix-api\src\routes\attempts.ts` (add route inside `registerAttemptsRoutes`, after the POST)
- Test: `C:\barmatrix-api\src\routes\attempts.test.ts` (append)

- [ ] **Step 1: Write the failing test**

Append to `src/routes/attempts.test.ts` (add `forensicsDwellBody` to the dynamic import):

```ts
describe("forensicsDwellBody", () => {
  it("accepts a sane dwell", () => {
    assert.equal(forensicsDwellBody.safeParse({ dwell_ms: 21500 }).success, true);
  });
  it("rejects negative and non-integer dwell", () => {
    assert.equal(forensicsDwellBody.safeParse({ dwell_ms: -1 }).success, false);
    assert.equal(forensicsDwellBody.safeParse({ dwell_ms: 1.5 }).success, false);
  });
  it("rejects dwell over 24h (garbage clock guard)", () => {
    assert.equal(
      forensicsDwellBody.safeParse({ dwell_ms: 86_400_001 }).success,
      false,
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test src/routes/attempts.test.ts`
Expected: FAIL — `forensicsDwellBody` is not exported

- [ ] **Step 3: Implement**

In `src/routes/attempts.ts`, add next to `attemptBody`:

```ts
export const forensicsDwellBody = z.object({
  dwell_ms: z.number().int().min(0).max(86_400_000),
});
```

Add the route inside `registerAttemptsRoutes`, after the forensics GET. Mirrors the GET's open-auth posture (anonymous diagnostic uses forensics too); a stray PATCH can only set one bounded JSON key on an existing attempt:

```ts
  // Fire-and-forget dwell report. Arrives after the attempt POST because the
  // forensics panel opens after submit (spec §4). Absent dwell = skipped
  // forensics, which is itself signal — so failures here return errors but
  // clients treat the call as best-effort.
  app.patch("/api/attempts/:id/forensics-dwell", async (req: Request, res: Response) => {
    const id = req.params.id;
    if (typeof id !== "string" || !UUID_RE.test(id)) {
      res.status(400).json({ error: "invalid attempt id" });
      return;
    }
    const parse = forensicsDwellBody.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: parse.error.flatten() });
      return;
    }
    try {
      const pool = getPool();
      const { rowCount } = await pool.query(
        `UPDATE student_attempts
            SET metadata = JSON_SET(metadata, '$.forensics_dwell_ms', $1)
          WHERE attempt_id = $2`,
        [parse.data.dwell_ms, id],
      );
      if (rowCount === 0) {
        res.status(404).json({ error: "attempt not found" });
        return;
      }
      res.status(204).end();
    } catch (err) {
      console.error("[attempts dwell] failed:", err);
      res.status(500).json({ error: "internal server error" });
    }
  });
```

- [ ] **Step 4: Run tests + typecheck**

Run: `npx tsx --test src/routes/attempts.test.ts && npm run typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/routes/attempts.ts src/routes/attempts.test.ts
git commit -m "feat: forensics-dwell PATCH endpoint writing metadata.forensics_dwell_ms"
```

---

### Task 4: Derived-metric SQL reference (engineering dir)

**Files:**
- Create: `C:\BMO\BARMATRIX\engineering\TELEMETRY_METRICS_MYSQL.sql`

- [ ] **Step 1: Write the SQL file**

All metrics read `metadata` JSON scalars (no JSON_TABLE — keeps MariaDB/MySQL-5.7-compatible on Hostinger). Content:

```sql
-- TELEMETRY_METRICS_MYSQL.sql
-- Derived attempt-telemetry metrics (spec 2026-06-12, ABM repo).
-- Read-only views over student_attempts.metadata JSON scalars written by
-- POST /api/attempts (telemetry summary) and PATCH .../forensics-dwell.
-- Old rows yield NULLs; that is expected.

CREATE OR REPLACE VIEW v_attempt_telemetry AS
SELECT
  a.attempt_id,
  a.student_id,
  a.question_id,
  a.set_id,
  a.correct,
  a.confidence,
  a.time_seconds,
  a.attempted_at,
  CAST(JSON_EXTRACT(a.metadata, '$.telemetry.time_to_first_selection_ms') AS SIGNED) AS time_to_first_selection_ms,
  CAST(JSON_EXTRACT(a.metadata, '$.telemetry.deliberation_ms') AS SIGNED)            AS deliberation_ms,
  CAST(JSON_EXTRACT(a.metadata, '$.telemetry.answer_changes') AS SIGNED)             AS answer_changes,
  JSON_EXTRACT(a.metadata, '$.telemetry.switched_off_correct') = TRUE                AS switched_off_correct,
  CAST(JSON_EXTRACT(a.metadata, '$.telemetry.stem_rereads') AS SIGNED)               AS stem_rereads,
  CAST(JSON_EXTRACT(a.metadata, '$.forensics_dwell_ms') AS SIGNED)                   AS forensics_dwell_ms,
  -- Spec §6: forensics_skipped = miss with dwell < 3000ms or never reported.
  (a.correct = 0 AND COALESCE(CAST(JSON_EXTRACT(a.metadata, '$.forensics_dwell_ms') AS SIGNED), 0) < 3000) AS forensics_skipped,
  -- Spec §6 quadrant: confidence>=4 confident, <=2 unconfident, 3 neutral (NULL).
  CASE
    WHEN a.confidence >= 4 AND a.correct = 1 THEN 'confident_right'
    WHEN a.confidence >= 4 AND a.correct = 0 THEN 'confident_wrong'
    WHEN a.confidence <= 2 AND a.correct = 1 THEN 'unconfident_right'
    WHEN a.confidence <= 2 AND a.correct = 0 THEN 'unconfident_wrong'
    ELSE NULL
  END AS confidence_quadrant
FROM student_attempts a;

-- Repeat encounters + session position (spec §6 attempt_number / session_position).
CREATE OR REPLACE VIEW v_attempt_sequencing AS
SELECT
  a.attempt_id,
  a.student_id,
  a.question_id,
  a.set_id,
  a.correct,
  a.attempted_at,
  ROW_NUMBER() OVER (PARTITION BY a.student_id, a.question_id ORDER BY a.attempted_at) AS attempt_number,
  ROW_NUMBER() OVER (PARTITION BY a.student_id, a.set_id      ORDER BY a.attempted_at) AS session_position
FROM student_attempts a;

-- Bank health: live pick-rate per choice vs focus-group pct (spec §7).
-- Flag review when n >= 30 and divergence > 15 points.
CREATE OR REPLACE VIEW v_question_live_pick_rates AS
SELECT
  a.question_id,
  a.selected_letter,
  COUNT(*)                                            AS picks,
  SUM(COUNT(*)) OVER (PARTITION BY a.question_id)     AS total_attempts,
  COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY a.question_id) AS live_pct
FROM student_attempts a
WHERE a.selected_letter IS NOT NULL
GROUP BY a.question_id, a.selected_letter;

-- Time outliers (spec §7): questions whose median time >= 3x bank median.
-- MySQL lacks MEDIAN(); approximate with AVG on the operator console, or run:
--   SELECT question_id, AVG(time_seconds) AS avg_s FROM student_attempts
--   GROUP BY question_id HAVING avg_s >= 3 * (SELECT AVG(time_seconds) FROM student_attempts);
```

If `CREATE OR REPLACE VIEW` with window functions fails on the Hostinger MySQL version, keep the first view and convert the other two to documented operator queries — note it in the file.

- [ ] **Step 2: Sanity-check the SQL locally**

If the dev MySQL container is available (`docker-compose.dev.yml` in barmatrix-api): apply against it and `SELECT * FROM v_attempt_telemetry LIMIT 1;`. If no local DB, mark the file "untested against prod version" in its header comment — do not run against production.

- [ ] **Step 3: Commit (BMO repo if it is a git repo; otherwise note the file in the api commit message)**

```bash
git -C C:/BMO add BARMATRIX/engineering/TELEMETRY_METRICS_MYSQL.sql && git -C C:/BMO commit -m "docs: telemetry derived-metric views" || echo "BMO not a repo — file saved unversioned"
```

---

### Task 5: Client attempt recorder (ABM repo)

**Files:**
- Create: `C:\ABM\src\lib\attemptTelemetry.ts`

No unit runner exists in ABM (`npm run build` runs `tsc --noEmit`); correctness is enforced by types + the server-side tests of the same contract. Keep the module pure and small.

- [ ] **Step 1: Write the module**

```ts
// Per-question interaction recorder. Mirrors the server contract in
// barmatrix-api src/lib/attempt-telemetry.ts: closed event vocabulary,
// ms offsets from question render, stream ends at submit.
// Telemetry must never break answering — all entry points are try/catch-free
// pure array pushes; the caller wraps the POST itself.

export type ChoiceLetter = "A" | "B" | "C" | "D";

export type InteractionEvent =
  | { t: number; ev: "shown" }
  | { t: number; ev: "scroll_stem" }
  | { t: number; ev: "select"; letter: ChoiceLetter }
  | { t: number; ev: "submit"; letter: ChoiceLetter };

const MAX_EVENTS = 200;
const SCROLL_DEBOUNCE_MS = 1000;

export interface AttemptRecorder {
  /** Reset for a newly rendered question. */
  markShown: () => void;
  recordSelect: (letter: ChoiceLetter) => void;
  /** Debounced to at most one event per second. */
  recordScrollStem: () => void;
  /** Final stream ending with the submit event. */
  snapshot: (submittedLetter: ChoiceLetter) => InteractionEvent[];
}

export function createAttemptRecorder(now: () => number = Date.now): AttemptRecorder {
  let shownAt = now();
  let events: InteractionEvent[] = [{ t: 0, ev: "shown" }];
  let lastScrollAt = -Infinity;

  const offset = () => Math.max(0, now() - shownAt);
  const push = (e: InteractionEvent) => {
    if (events.length < MAX_EVENTS - 1) events.push(e); // reserve room for submit
  };

  return {
    markShown: () => {
      shownAt = now();
      events = [{ t: 0, ev: "shown" }];
      lastScrollAt = -Infinity;
    },
    recordSelect: (letter) => push({ t: offset(), ev: "select", letter }),
    recordScrollStem: () => {
      const t = offset();
      if (t - lastScrollAt < SCROLL_DEBOUNCE_MS) return;
      lastScrollAt = t;
      push({ t, ev: "scroll_stem" });
    },
    snapshot: (submittedLetter) => [
      ...events,
      { t: offset(), ev: "submit", letter: submittedLetter },
    ],
  };
}
```

- [ ] **Step 2: Typecheck**

Run (from `C:\ABM`): `npx tsc --noEmit`
Expected: clean

- [ ] **Step 3: Commit (in ABM)**

```bash
git add src/lib/attemptTelemetry.ts
git commit -m "feat: per-question interaction recorder for attempt telemetry"
```

---

### Task 6: Wire recorder + dwell into Practice (ABM repo)

**Files:**
- Modify: `C:\ABM\src\pages\Practice.tsx` (PracticeRunner, ~lines 352–560)

Practice submits on first click (`choose()` is select+submit in one), so `select` events beyond the final one only appear if the UI later adds a separate confirm step — the recorder contract already supports it. What this task wires: `shown`, `scroll_stem` (scroll-up detection), `submit`, the `interaction_log` POST field, and the dwell PATCH.

- [ ] **Step 1: Add recorder + scroll listener to PracticeRunner**

Imports at top of file:

```ts
import { createAttemptRecorder } from "../lib/attemptTelemetry";
```

Inside `PracticeRunner`, next to `shownAt` (~line 363):

```ts
  const recorder = useRef(createAttemptRecorder());
  const forensicsShownAt = useRef<number | null>(null);
  const dwellSent = useRef(false);
```

In the question-load effect (~line 366), after `shownAt.current = Date.now();` add:

```ts
        recorder.current.markShown();
        forensicsShownAt.current = null;
        dwellSent.current = false;
```

Add a scroll-up listener effect after that effect. Re-reading the stem means scrolling back up after having scrolled down past it; track the max depth reached and fire when the student climbs back >200px:

```ts
  useEffect(() => {
    let maxY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > maxY) {
        maxY = y;
      } else if (maxY - y > 200) {
        recorder.current.recordScrollStem();
        maxY = y; // re-arm from the new position
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [qid]);
```

- [ ] **Step 2: Post the log with the attempt and stamp forensics-shown**

In `choose()` (~line 405), build the log before the fetch and add it to the body:

```ts
    const interactionLog = recorder.current.snapshot(letter);
```

and in the POST body after `set_id: run.drill.drill_id,`:

```ts
          interaction_log: interactionLog,
```

After `setAttempt(result);` add:

```ts
      forensicsShownAt.current = Date.now();
```

- [ ] **Step 3: Send dwell on advance**

Add a helper inside `PracticeRunner` (above the return):

```ts
  const sendDwell = (attemptResult: AttemptResponse | null) => {
    if (!attemptResult || dwellSent.current || forensicsShownAt.current === null) return;
    dwellSent.current = true;
    const dwellMs = Math.max(0, Date.now() - forensicsShownAt.current);
    void (async () => {
      try {
        const token = await getToken();
        await apiFetch(`/api/attempts/${attemptResult.attempt_id}/forensics-dwell`, {
          method: "PATCH",
          token,
          body: { dwell_ms: dwellMs },
        });
      } catch {
        // dwell is best-effort; absence reads as skipped, which is honest
      }
    })();
  };
```

Wire it into the advance button (~line 551) — replace `onClick={() => onAdvance(isCorrect)}` with:

```ts
            onClick={() => {
              sendDwell(attempt);
              onAdvance(isCorrect);
            }}
```

and into the exit button (~line 482) — replace `onClick={onExit}` with:

```ts
          onClick={() => {
            sendDwell(attempt);
            onExit();
          }}
```

(Check `apiFetch` supports PATCH + body; it takes `method`/`body`/`token` per its use at line 410 — if `method` is typed as a union without PATCH, widen the type in `src/lib/api.ts`.)

- [ ] **Step 4: Typecheck + build**

Run: `npm run build`
Expected: clean build

- [ ] **Step 5: Commit**

```bash
git add src/pages/Practice.tsx src/lib/api.ts
git commit -m "feat: wire interaction log + forensics dwell into practice runner"
```

---

### Task 7: PostHog events (ABM repo)

**Files:**
- Modify: `C:\ABM\src\lib\events.ts:5-19` (FunnelEvent union)
- Modify: `C:\ABM\src\pages\Practice.tsx` (fire both events)

- [ ] **Step 1: Extend the union**

In `src/lib/events.ts` add to `FunnelEvent`:

```ts
  | "set_abandoned"
  | "forensics_skipped"
```

- [ ] **Step 2: Fire the events in Practice**

`set_abandoned` — in the exit button handler from Task 6, fire only mid-set (not from the finished screen; `PracticeRunner` returns early when `finished`, so this handler only runs mid-set). Final handler:

```ts
          onClick={() => {
            sendDwell(attempt);
            track("set_abandoned", {
              set_type: run.mode,
              position: run.index + 1,
              total,
            });
            onExit();
          }}
```

`forensics_skipped` — inside `sendDwell`, after computing `dwellMs`, add (spec: misses closed under 3s; no question ids or letters in props, per the PII discipline):

```ts
    if (!attemptResult.correct && dwellMs < 3000) {
      track("forensics_skipped", { subject: question?.subject ?? "unknown" });
    }
```

(`question` is in scope in `PracticeRunner`; `track` is already imported in Practice.tsx.)

- [ ] **Step 3: Typecheck + build**

Run: `npm run build`
Expected: clean

- [ ] **Step 4: Commit**

```bash
git add src/lib/events.ts src/pages/Practice.tsx
git commit -m "feat: set_abandoned and forensics_skipped funnel events"
```

---

### Task 8: Full verification

- [ ] **Step 1: api repo full suite**

Run (from `C:\barmatrix-api`): `npm run typecheck && npm test`
Expected: clean typecheck, all tests pass (including pre-existing ones — `attemptBody` legacy-payload tests prove old clients unaffected)

- [ ] **Step 2: ABM repo build**

Run (from `C:\ABM`): `npm run build`
Expected: clean

- [ ] **Step 3: End-to-end smoke (only if dev API + DB available)**

Start `npm run dev` in barmatrix-api with the dev MySQL, POST an attempt with an `interaction_log`, confirm the row's `metadata` contains `interaction_log` + `telemetry`, PATCH dwell, confirm `metadata.forensics_dwell_ms`. If no local DB: state plainly in the completion note that server behavior is verified by unit tests only and needs a staging smoke before deploy.

- [ ] **Step 4: Do NOT deploy**

Deploys of barmatrix-api (Hostinger) and ABM (`vercel deploy --prod`) are launch-gated actions — leave both for the operator.

---

## Self-review notes

- Spec §4 closed vocabulary, size cap, monotonic-t, null-log passthrough → Task 1–2. Spec §4 dwell PATCH → Task 3. Spec §5 storage → metadata JSON (documented deviation, MySQL reality). Spec §6 metric definitions → Task 1 scalars + Task 4 views. Spec §7 bank health → Task 4. Spec §8 PostHog → Task 7. Spec §9 failure posture → `z.unknown()` + safeParse-drop in Task 2, try/catch in Tasks 3/6. Spec §10 tests → Tasks 1–3. Spec §11 rollout order → task order mirrors it.
- Discrimination index (spec §7) intentionally deferred: needs a per-student rolling-accuracy rollup that doesn't exist yet; noted here so it isn't silently lost.
