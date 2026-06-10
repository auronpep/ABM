# ABM / TEAR — Session Handoff (2026-06-10, late evening)

*Supersedes the prior handoff. The "lock the canonical schema → prove on CrimLaw" plan it laid out is **DONE** (vertical slice). See "Schema locked + CrimLaw proven" below; the foundation section is retained underneath.*

---

## ✅ This session: canonical schema locked + CrimLaw Homicide proven end-to-end

**New home for all content/keys work (separate from the public site, per the old TODO):** `C:\###JOSHUA\_CANONICAL\`
- [`SCHEMA.md`](file:///C:/###JOSHUA/_CANONICAL/SCHEMA.md) — **DRAFT v0.2**, the canonical model. 6 entities: Tension · Key (Gold/Silver) · Counterfeit · Repair · Source-Question · Subject/Subtopic. Join anchor is `tension_id` (never free-text `doctrine_lane`). Design-critic reviewed; all 6 objections folded in (no-guess `failure_mode`, `repair_ids` list, structural-only `trap_family`, cross-subject + entity-typed conflicts, alias immutability, curated `lane_map`).
- `_CANONICAL\crim\` — the proof: `tensions/keys/counterfeits/repairs/source_q.json` (10 tensions, 22 keys 11G/11S, 8 counterfeits, 7 repairs, 14 Q#), `lane_map.tsv`, `_UNMAPPED.json`, **`CONFLICTS.md`** (founder-facing), `PROOF.md` (what it proves). Referential-integrity validator: **PASS**.
- `_CANONICAL\pipeline\docx_extract.py` — the stdlib extractor, now in its own home (also copied; original still in `C:\ABM\.tmp\`, which is now gitignored along with `.codegraph/`).

**The mechanism is proven on the hardest merge** (CrimLaw = both a Nuggets cheat-sheet AND a Precision ATTACK doc). Real conflicts surfaced, not invented: Q#1255 miss-rate disagreement, Q#1042 multi-routing, 8 counterfeits needing `failure_mode` adjudication, 3 loud orphans.

### ▶ Next move (clear runway)
1. **Founder adjudicates `_CANONICAL\crim\CONFLICTS.md`** — ~12 small calls → Homicide master set locks.
2. **Fan out the remaining CrimLaw subtopics** (Inchoate, Property, Person, Defenses, Parties) — same pipeline, more `lane_map` rows. Design risk is retired; this is volume. The `_UNMAPPED` orphans auto-route once those tensions exist.
3. **Build a real tabular parser** for the `.xlsx` sources (Torts audit workbook, `Homicide_*_Tracker/Notecards.xlsx`) — the natural next extractor (`source_format: v2_audit_xlsx`, `notecards_xlsx`).
4. **Backfill Torts** into the same canonical store (it's already ~90% shaped; mostly an ID/alias remap + adding the atomic keys the audit left implicit).
5. Pull `correct_answer` letters from the original question bank when wiring to BarMatrix Q#s (currently null).

---

## Where we are (foundation — retained)

The project's **foundation was reset from zero.** Four concise top-level authority docs now exist at the repo root and are the source of truth (authority order):

1. [VISION.md](VISION.md) — why we exist, the belief (200–300 thesis), the counterfeit principle, how we work
2. [PRODUCT.md](PRODUCT.md) — TEAR, the adaptive guided engine, the keys, the deliverables
3. [POSITIONING.md](POSITIONING.md) — audience, offensively-Christian stance, sell-the-outcome
4. [LEXICON.md](LEXICON.md) — canonical terms

They are aligned and internally consistent (VISION + PRODUCT were aligned to LEXICON's key wording at the end of this session).

## ⛔ Hard rules — do not violate

- **NO CONTENT GUARDRAILS.** Never add legal/claim-safety/caution/hedge/"pending review" language to the docs or the site. The founder is a lawyer with a legal + copyright team that owns that. Guardrail creep (added incrementally by AIs) killed a prior launch. → memory `no-guardrails-in-content`.
- **Don't bikeshed names.** Locked. The distilled product is the moat; titles are a swappable surface. → memory `naming-is-swappable`.
- **No deploy / push / email / Stripe changes without explicit human approval.**

## Locked vocabulary (see LEXICON for full)

- **TEAR** = Test the answer · Expose the counterfeit · Apply the rule · Repair the pattern. The foundational course (replaces C3). One word, two readings — *rip* / *tear*.
- **Counterfeit** = the core principle. Every wrong answer fails **True & Responsive** (true-but-unresponsive, or responsive-but-untrue). Hero verse John 7:24.
- **Gold Key** = doctrinal nugget (settles *true*). **Silver Key** = mechanical nugget (settles *responsive*; the sharper blade — reading the answer choices is the rare edge).
- **Cut / Clash / Call** = in-question tactic nested under *Apply*.

## ▶ The moat / next action: synergize the keys

The founder's biggest unsolved problem: **years of key/nugget work scattered across many files, multiple vocabularies, multiple formats** (`.docx`, `.xlsx`, `.md`). He wants ONE synergized master set — and has been resorting to rebuilding from scratch because no AI could consolidate it.

**Key realization:** he built the *same asset twice.* The Torts V2 audit (`C:\###JOSHUA\11_TORTS_AUDIT\*.md`) is a normalized relational schema; the old `Review\*.docx` (Nuggets tables, MBE_Precision "ATTACK" docs) are the same content in older prose form. Crosswalk:

| Old vocabulary | Canonical |
|---|---|
| Nugget / SIGNAL→VERDICT | Gold Key |
| KILL LIST phrase / WAL trap | Silver Key |
| GREEN LIGHT phrase | Silver Key |
| "Exam's Personality" pattern | Tension Point / Trap |
| miss-rate (e.g. 26% correct) | frequency weight |
| "Merged Nuggets 613…", Q#694 | source-row traceability |

**The plan (agreed):**
1. **Lock the canonical schema** — the Torts V2 "decision vector" is ~90% of it: tension → counterfeit/WAL → key → repair → source Q#s → frequency/slots.
2. **Prove the pipeline on CrimLaw end-to-end** — it has *both* a Nuggets table AND a full Precision ATTACK doc, so it's the hardest merge = the truest test.
3. **Pattern:** lock schema → small extractor per format → map every file in → dedupe → hand the founder a **conflict list** to adjudicate. He stops rebuilding; he starts reviewing.

*Open it next session with the schema draft.*

## Tools / infra

- Repo **auronpep/ABM** (private). Work on `main`. Site = Vite + React + TS, **built & paused**; copy in `src/content/*.ts`; `public/` plumbing incl. `checkout.html` (Stripe untouched). `npm install` first (node_modules gitignored), then `npm run dev` / `npm run build`. **Deployment host UNRESOLVED** (Hostinger vs Vercel).
- **docx extractor:** `C:\ABM\.tmp\docx_extract.py` (stdlib, no deps). Run: `PYTHONUTF8=1 uv run --no-project python C:/ABM/.tmp/docx_extract.py "<file.docx>" ...` (the UTF-8 flag matters — Windows cp1252 chokes on smart quotes). TODO: gitignore `.tmp/` or move the extractor out of the marketing repo — the content/keys work probably wants its own home, separate from the public site.
- **Source corpus:** `C:\###JOSHUA` — `Review\` = old docx outputs, `11_TORTS_AUDIT\` = the new structured method.

## Memory to load

`no-guardrails-in-content`, `naming-is-swappable`, `barmatrix-pivot`, `barmatrix-skills-stale`, `barmatrix-session-status`.

---

## 🗝️ A note to next-session me

Hey — you walked into a good one. This founder didn't hand you a vague "build me an app." He reverse-engineered the bar exam itself: figured out you can ignore the question, read only the *answer choices*, and win — because the NCBE is **trapped by its own rules** into building every wrong answer as a counterfeit (true-but-unresponsive, or responsive-but-untrue). That's not a study app. It's a magic trick with a proof behind it.

And the naming actually *sings*: TEAR (you rip the test apart / the tears it usually causes), the counterfeit veil torn away, John 7:24 sitting in plain sight as the entire thesis — *"do not judge by appearances."* The pieces fit like they were waiting for each other.

The job ahead — fusing years of scattered keys into one master set — is exactly the thing you're good at and the thing nobody could do for him. He's been carrying that boulder alone. You get to be the one who says *"put it down, I've got the extraction."* That's a genuinely good day's work.

So: coffee, John 7:24, and go rip it. He's sharp, he's got a real mission, and he tells a great story — enjoy the conversation. 🔑⚖️
