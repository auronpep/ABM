# TRUE / RESPONSIVE Mechanical Choices-Only Pass

Source workbook: `C:\Users\JesusLovesMe\Documents\CrimL\Criminal LAw.xlsx`

Generated: 2026-06-13

## Pivot

The prior analysis drifted toward doctrine families. This pass treats the task mechanically:

> Pick the answer that is most likely TRUE and RESPONSIVE from answer-choice text alone.

The C3 control vocabulary defines the target cleanly:

- Correct answer: breaks neither `NOT_TRUE` nor `NOT_RESPONSIVE`.
- Wrong answers fail by `NOT_TRUE` molds: overclaim, falsity, distortion.
- Wrong answers fail by `NOT_RESPONSIVE` molds: misfit, bait doctrine, wrong element.

This pass does not use stems, explanations, outline codes, or doctrine labels.

## Tested Mechanics

Answer-choice-only proxies:

- length: longer answers tend to contain the full reason, not just a conclusion.
- bare-result penalty: naked "yes/no/guilty/not guilty" answers are less likely to be fully responsive.
- overclaim penalty: always, never, any, every, automatically, necessarily.
- limited-language cue: if, unless, where, when, except.
- reason-coupling cue: because, since, therefore.

## Best Rule

The strongest teachable rule is:

> Pick the longest answer unless D is the unique longest or there is a length tie; then pick C.

File label: `longest_A/B/C_else_C`

Performance:

| Set | Accuracy |
|---|---:|
| All 945 questions | 58.3% |
| 772 questions with percent-correct data | 66.2% |
| 181 critical questions below 50% | 65.2% |

This beats raw longest-choice:

| Rule | All-question accuracy |
|---|---:|
| Longest by word count | 55.3% |
| Longest by character count | 56.5% |
| Unique longest else C | 56.6% |
| Longest A/B/C else C | 58.3% |

## Why The D Exception Matters

Unique-longest buckets:

| Unique longest | Count | Most common correct answer |
|---|---:|---|
| A | 163 | A, 102 correct |
| B | 189 | B, 88 correct |
| C | 350 | C, 268 correct |
| D | 122 | C, 43 correct; D only 27 correct |

So "longest" works for A/B/C, but unique-longest D is often a trap. Mechanically:

> D as the longest answer often looks like the fully lawyerly answer, but in this workbook C beats it.

This may be bank-specific, so the safer public-facing lesson is not "avoid D." The safer internal heuristic is:

> Length is signal; D-longest needs suspicion.

## TRUE / RESPONSIVE Score Test

A simple TRUE/RESPONSIVE score was tested:

```text
 length / reason density
 limited language
 reason coupling
- absolutes / overclaims
- bare-result answers
```

Result:

| Rule | All accuracy | Graded accuracy | Critical accuracy |
|---|---:|---:|---:|
| Longest A/B/C else C | 58.3% | 66.2% | 65.2% |
| Cross-validated TRUE/RESPONSIVE grid | 57.6% | n/a | n/a |
| Handwritten TRUE/RESPONSIVE v1 | 52.6% | 59.3% | 59.1% |

The cross-validated grid repeatedly selected:

```text
 strong length reward
- overclaim / absolute penalty
- bare-result penalty
```

It did **not** consistently reward "because" or limited language once length was already counted. That means because-clauses matter mostly because they make an answer longer and more reasoned, not because the word "because" itself is magic.

## Key Mechanical Findings

### 1. Length Is A Proxy For Responsiveness

The longest answer is often the one that contains both:

- the result, and
- the reason that answers the call.

This fits TRUE/RESPONSIVE better than "longest answer trick."

### 2. Bare Results Are Weak

Choices that only say a result without a reason are mechanically weak. They may be true, but they are less likely to be fully responsive.

Student-facing move:

> Prefer the answer that explains why, not merely the answer that states what.

### 3. Overclaim Language Is Suspicious

Absolute words are visible `NOT_TRUE` risk:

```text
always
never
any
every
automatically
necessarily
under any circumstances
```

The grid search repeatedly kept an overclaim penalty.

Student-facing move:

> Extreme words have to earn trust.

### 4. Top-2 Length Is A Real Ceiling Signal

The correct answer is in the two longest choices 72.8% of the time.

The correct answer is in the three longest choices 88.5% of the time.

That suggests a two-stage student move:

1. Use length to identify the finalists.
2. Use TRUE/RESPONSIVE to cut overclaim, bare-result, wrong-element, and nonresponsive answers.

### 5. Critical Items Are More Mechanically Exploitable

On questions below 50% correct, the best simple mechanic scored 65.2%.

That matters. The harder the item is for students, the more the credited answer may be hiding in the answer-choice architecture rather than in recall.

## Practical TEAR-Style Choice-Only Algorithm

Use this as the mechanical draft:

1. **T - Truth risk:** Cut answers with visible overclaim or internal overbreadth.
2. **E - Explanation density:** Prefer answers that give the result plus the reason.
3. **A - Answer the call:** Penalize bare legal facts or labels that do not explain the result.
4. **R - Residual:** If length identifies A/B/C, follow it; if D is the only longest or there is a tie, suspect C as the residual.

If the exact internal TEAR expansion differs, keep the tested mechanics and rename the letters later.

## Best Honest Product Claim

Do not claim students should blindly choose the longest answer.

Better claim:

> In this Criminal Law/Procedure bank, the credited answer is usually the answer that looks most fully true and responsive. Length is the strongest visible proxy: a simple length-led rule gets 58.3% overall and 65.2% on critical low-score questions.

## Files

- `mechanical_choices_only_evaluator.py`
- `mechanical_choices_only_results.json`
- `mechanical_choices_only_rule_scoreboard.csv`
- `mechanical_choices_only_menu_breakdown.csv`
- `true_responsive_choices_only.py`
- `true_responsive_choices_only_results.json`
- `true_responsive_choices_only_scoreboard.csv`
- `true_responsive_choices_only_buckets.csv`

