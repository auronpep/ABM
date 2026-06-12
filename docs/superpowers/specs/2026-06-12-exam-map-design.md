# The Exam Map — Outline Browser with Drill Launch — Design

*2026-06-12. Dashboard surface that renders the official NCBE outline as an explorable
map with per-node drill buttons and coverage/progress/score tracking. Queued BEHIND
prompt-v3 (2026-06-12-cq-prompt-v3-design.md) — depends on navigation-grade outline
codes. Approved direction + mockup reviewed by founder 2026-06-12.*

## Premise

The 8-digit outline codes are internal inventions — never shown to students. The
outline they index is the official NCBE subject-matter outline (36 subtopics, 593 nodes
in `C:\CCG\OUTLINE_CODES_COMPLETE.md`), which students already trust. Public-facing
legitimacy (NCBE names), private plumbing (our codes as join keys).

## Surface

`#/map` (or per-subject `#/map/:subject`), a destination surface like `#/subjects` —
NOT the daily glass. Resolves the "glass never opens a picker" rule: the spine still
leads the day with one action; the map is deliberate roaming. Each row has exactly one
action. The day plan may *reference* the map ("today's work lights up Parol evidence
rule") so the surfaces reinforce.

Per row (see mockup in founder session):

- **Drill button left of the label** (▶) — launches a prescribed drill scoped to that
  node (or branch: prefix match)
- Node label = NCBE outline text, sentence case
- Right side, three quiet numbers: **"N here"** (bank coverage), **"n done"**
  (student attempts), **score %** (private mirror — sanctuary rule, no cohort
  comparison, no percentile)
- Branch rows: brass progress ring; leaf scores aggregate up the tree
- Empty nodes: "being charted" (honest, no drill button)
- Hottest node gets a warm tint; Brass Keys earned from a node's questions can stamp
  onto its row (later)

## Data & API

1. **Outline tree**: build step converts `OUTLINE_CODES_COMPLETE.md` → static versioned
   JSON (`outline.v1.json`), shipped with the frontend. No API for structure.
2. **`GET /api/outline/:subject`** — one query: group `questions` by
   `metadata.outline_code` prefix; join the student's attempts; return
   `{code, question_count, attempted, correct}` per node. Tree + labels come from the
   static JSON client-side.
3. **Drill launch**: existing `/api/drills/prescribed` engine + new `outline_prefix`
   filter + seen-question exclusion (c3-bandit already does selection).
4. Enrolled-gated (Clerk), same as other drill endpoints.

## Honesty prerequisite (why this queues behind prompt-v3)

Only v3-gate-verified files have trustworthy codes. Batch 1's 106 are per-file
inventions; the 3,686 legacy questions mostly have none. Sequence:

- prompt-v3 backfill re-codes the 104 Finished files against the map (hard-verified)
- map counts start small and honest; "being charted" handles sparse nodes from day one
- legacy 3,686 re-coding is incremental, post-launch of the surface (out of scope here)

The batch-1 caveat "outline codes — never use for navigation" is retired the right
way: not by trusting invented codes, but by making verified codes a QA gate requirement.

## Build order

1. Outline JSON build step (from OUTLINE_CODES_COMPLETE.md)
2. `GET /api/outline/:subject` + `outline_prefix` filter on prescribed drills
3. `#/map` frontend surface (tree, drill button, three counters, brass rings)
4. Batch-1 outline-code backfill load (rides the prompt-v3 backfill artifacts)

## Hard rules carried forward

- No 8-digit codes anywhere student-visible
- Maps and mirrors, not scoreboards — score is a private mirror
- One primary action per row; the daily spine is untouched
- No focus-group numbers in any payload
