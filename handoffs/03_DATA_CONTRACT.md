# 03 — DATA CONTRACT, SYNTHESIS LOGIC, SEED QUESTIONS

## 1. Renderer contract

Every funnel component consumes this shape. It maps 1:1 onto C3 PASS-2
output; the transform from PASS-2 YAML → this JSON is mechanical.

```json
{
  "qid": "Q-14621",
  "title": "The Manna Café Bookmaker",
  "subject": "CRIM PRO",
  "stem": ["paragraph 1", "paragraph 2"],
  "call": "Should the court grant the motion?",
  "choices": [
    { "id": "A", "text": "...", "pct": 66, "provenance": "inherited_original" }
  ],
  "key": "A",
  "trap": {
    "choice": "C",
    "pct": 31,
    "name": "VIOLATION ≠ REMEDY",
    "instinct": "JUSTICE",
    "filter_broken": "NOT_RESPONSIVE",
    "mold": "wrong_element"
  },
  "forensics": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "silver_key_move": "\u201CThis proves a violation. Does it prove dismissal?\u201D",
  "review_truth": "one-sentence share-card body",
  "drill_seeds": [ { "type": "CALL FOCUS", "prompt": "..." } ],
  "crossovers": ["EVIDENCE", "CONSTITUTIONAL_LAW"]
}
```

Field sources from PASS-2: `trap.filter_broken`/`trap.mold` ←
choice_walkthroughs[dominant].filter_broken/mold_code; `forensics` ←
wrong_answer architecture "why_a_student_picks_this" + gold/silver keys,
rewritten to the copy rubric (§5); `review_truth` ← Review Truth block;
`silver_key_move` ← silver_keys[0], phrased as a spoken move.

## 2. Mini-diagnostic question set (launch)

Q-14621 (instinct JUSTICE), Q-14734 (SUSPICION), Q-14609 (FAIRNESS) — full
seed data is embedded in `mini-diagnostic.jsx` in this bundle; extract it
verbatim into `questions.seed.json` as the contract above. Founder must
confirm attorney-review status of all three before public deploy (doc 00
gate 5).

## 3. Red-Zone synthesis logic (results page)

Input: the session's missed questions with trap metadata.

```
group misses by (trap.filter_broken, trap.mold)
for each group with count >= 2:
    emit RedZone {
        name: ZONE_NAMES[(filter, mold)],   // see table
        members: [qids],
        verdict: VERDICT_TEMPLATES[(filter, mold)]
    }
misses not in any group >= 2 → render as individual trap cards (no zone)
if zero misses → survivor verdict variant
```

Zone-name table (extend as data grows):

| filter_broken | mold | Zone name | Verdict template key |
|---|---|---|---|
| NOT_RESPONSIVE | wrong_element | THE TRUE-BUT-WRONG PICK | true_but_wrong |
| NOT_TRUE | fabricated_rule | THE INVENTED RULE | invented_rule |
| NOT_RESPONSIVE | bait_doctrine | THE BORROWED DOCTRINE | borrowed_doctrine |

`true_but_wrong` verdict template:
> "You don't have a {subject} problem. **You buy answers because they're
> true — not because they answer the call.** {N} of your {M} misses were
> real, damning, satisfying facts that proved the wrong thing. This pattern
> recurs across {crossover subjects}. It is repairable, and the repair is
> one move."

Conscience synthesis (mini-diagnostic): when ≥1 missed trap carries an
`instinct` tag, verdict reads: "The exam aimed at {instinct phrases joined
with 'and'} — and converted {each one|it} into a wrong answer." Instinct
phrase map: JUSTICE → "your sense of justice"; SUSPICION → "your nose for
the incriminating"; FAIRNESS → "your instinct for fairness".

## 4. Provenance-honest stat wording (compliance — strict)

Pick rates are inherited from source items (`provenance:
inherited_original*`). Permitted public phrasings:
- "{pct}% fall here on this question's tested form"
- "Roughly 1 in 3 takers pick C on the tested form"
FORBIDDEN: "of our students", "our focus group chose", or any phrasing
implying the stat was measured on the transformed question. Add a unit test
that fails if a stat renders without the tested-form qualifier.

## 5. Forensics copy rubric (for any new question entering the funnel)

Each per-choice forensics string: second person; sentence 1 names the
instinct/reflex that pulled them; states the controlling rule declaratively
(Gold Key); ends with an imperative recovery move where space allows;
≤ 95 words; zero hedging; no case names in funnel surfaces (case authority
stays inside the paid product).
