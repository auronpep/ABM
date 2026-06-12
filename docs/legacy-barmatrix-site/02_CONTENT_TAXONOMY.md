# Content Taxonomy — the durable IP

**This is the most expensive-to-recreate asset.** A complete content-authoring factory: tension points → 280-slot blueprint → 11 trap families → 10 QA gates. Subject-agnostic in shape; built out for the **Evidence "Presentation of Evidence" pillar** only.

Source: `operator/pipeline-data.js` (global `BM_PIPELINE`), preserved verbatim at `source/operator-data/pipeline-data.js`.

`meta`: pillar "Presentation of Evidence" · subject "Evidence" · `slotsTotal` **280** · `tensionsTotal` **44** · `auditedSamples` 38 · `avgFocusAccuracy` 70.4% · `hardRows` 5.

> Number note: marketing pages say "47 trap shapes / 156 tension points." Those are the rounded all-8-subjects projection. The real built numbers for the Evidence pillar are **44 tensions / 280 slots / 11 trap families**. (And `C:\barmatrix-canon` may hold a further-evolved version of this taxonomy — check there before rebuilding.)

---

## 1. Tension Matrix — `tensions[]` (44 rows, IDs POE-001…POE-044)

Each tension = "one collision the exam reuses."

```jsonc
{
  "id": "POE-001",
  "title": "Preliminary admissibility: court may consider inadmissible material",
  "ruleSpine": "FRE 104(a); CA §§402,405",
  "collision": "...the legal tension in prose...",
  "triggers": "affidavit; letter; report; hearsay statement; ...",   // fact triggers (semicolon list)
  "axis": "judge decides admissibility; evidence rules other than privilege do not bind the judge",
  "walTraps": "judge/jury × hearsay/not-hearsay 2x2; exception-needed false answer",
  "caDistinction": "CA: §402 hearing vocabulary; §405 court determination ...",
  "analog": "Q1,Q7,Q17",     // reference questions
  "quota": 8                  // slots assigned to this tension
}
```

`axis` = the decisive pivot (the Silver-Key mechanic). `walTraps` = the wrong-answer-layer trap menu for that tension.

---

## 2. 280-Slot Blueprint — `slots[]`

Each slot = one prescribed question spec (tension × posture × difficulty → trap architecture).

```jsonc
{
  "slotId": "POE-V3-001",
  "tensionId": "POE-001",
  "pillar": "Presentation of Evidence",
  "title": "...",
  "ruleSpine": "FRE 104(a); CA §§402,405",
  "posture": "Federal civil",
  "difficulty": "Foundation",
  "surfaceDecoy": "hearsay exception",
  "stemFrame": "Which ruling is most proper?",
  "factEngine": "...instruction for building the fact pattern...",
  "correctAxis": "...",
  "trap1": "jury decides admissibility",
  "trap2": "hearsay/affidavit categorically barred",
  "trap3": "exception required for material considered only by judge",
  "caFlag": "CA distinction item",   // or null
  "analog": "Q1,Q7,Q17",
  "qaReq": "Answer choices must be parallel and differ by actor, purpose, channel, timing, or modal force..."
}
```

- **Posture enum:** Federal civil · Federal criminal · Federal diversity · California civil · California criminal.
- **Difficulty enum:** Foundation · Recognition · Trap · Integration · California (UI also references "Elite Discriminator").

---

## 3. Wrong-Answer Taxonomy — `taxonomy[]` (11 trap families) — THE COUNTERFEIT CATALOG

The heart of TEAR's "counterfeit" concept. Each family is a way a wrong answer is **true-but-unresponsive** or **responsive-but-untrue**. Shape: `{family, what, language, bestFor, warning}` (the `warning` = when the trap is legitimate vs invalid; these are authoring guardrails for *question construction*, not site-copy guardrails).

1. **Decisionmaker inversion** — moves a judge-only issue to the jury or vice versa. ("weight and credibility for the jury; admissibility for the jury")
2. **Purpose poisoning** — treats a permissible purpose as an impermissible merits purpose.
3. **Channel mismatch** — right topic, wrong proof channel. ("may prove it extrinsically; only by certified record")
4. **Modal inversion** — changes may/must/cannot or permissive/conclusive.
5. **Burden conversion** — turns a production burden into persuasion, or shifts an element.
6. **Surface doctrine overread** — applies a real exclusion to material used at a different layer. ("hearsay inadmissible; best evidence required")
7. **Status confusion** — misclassifies the target as witness/party/character witness/juror/judge/declarant.
8. **Timing failure** — uses a rule from the wrong stage.
9. **Source reliability mistake** — treats a questionable source as judicially noticeable/reliable.
10. **Civil/criminal instruction confusion** — imports civil conclusive notice into criminal cases, or vice versa.
11. **California mechanical swap** — copies a federal item into CA without changing the structural premise.

**TEAR split (latent in the families):** e.g. *Surface doctrine overread* = true rule, wrong layer → **true-but-unresponsive**; *Decisionmaker inversion* = responsive framing, wrong actor → **responsive-but-untrue**.

---

## 4. Stem Archetypes — `stemPatterns[]` (~30 approved stem frames)

Shape `{archetype, count, bestUse, risk, difficulty}`. Examples: `is-question-proper`(×6), `testimony-is`(×3), `how-should-court-proceed`(×2), `admissibility-is`, `least-likely-admissible`, `governing-law-choice`, `directed-verdict-for-whom`. Difficulty bands: Foundation → Intermediate → Advanced.

## 5. California Distinctions — `caDist[]` (9 layers)

Where CA Evidence Code diverges from FRE. Shape `{layer, federal, ca, change, wrong, source}` (`change` = required structural edit, `wrong` = the common counterfeit, `source` = statute URL). Layers: Preliminary facts-hearings (104↔§402) · Conditional preliminary facts (104(b)↔§403) · Court preliminary facts (104(a)↔§405) · Judicial notice (201↔§§451-453) · Witness exclusion (615↔§777) · Credibility factors (607/608/613↔§780) · Specific-act credibility (608(b)↔§787) · Felony-conviction impeachment (609↔§788) · Hearsay-declarant impeachment (806↔§1202).

## 6. QA Rubric — `qaRubric[]` (10 ship gates)

Every slot must pass all 10 before shipping. Shape `{gate, req, reject, fix}`. Gates: Subtopic gate · Stem clarity · Parallel answers · Wrong-answer quality · Legal precision · California integrity · Difficulty calibration · Diagnostic tag · Explanation standard · Coverage control. (E.g. *Diagnostic tag*: every item must have a unique primary tension tag + ≥1 wrong-answer trap tag.)

## 7. Sample Audit — `sampleAudit[]` (38 rows)

Reference questions audited against the V3 build, driving slot specs. Shape `{q, focusAvg, correct, topWrong, pillar, ruleSpine, factSig, archetype, axis, wrongWork, consequence}`. `focusAvg` colored red ≤55% / green ≥80%. `wrongWork` names which taxonomy families the top wrong answer exercises (e.g. "decisionmaker inversion; surface doctrine overread").

---

## Why this matters

The single most reusable structural asset in the entire old codebase is this **44 tensions × 280-slot blueprint × 11 trap families × 10 QA gates** authoring system. It is subject-agnostic in *shape* — built out for Evidence, designed to extend to all 8 MBE subjects via the same `tensions/slots/taxonomy/qaRubric` contract. It directly realizes the TEAR method: tensions carry the Gold/Silver keys, the taxonomy is the counterfeit catalog, and the QA rubric enforces that every counterfeit is a real true-vs-responsive failure.
