# Criminal Law and Procedure Pattern Analysis

Source workbook: `C:\Users\JesusLovesMe\Documents\CrimL\Criminal LAw.xlsx`

Generated: 2026-06-13

## Scope

This is a bottom-up pattern pass across the Criminal Law workbook. It does not rely on prior CQ tags, outline codes, or transformed item metadata. The goal is to identify repeated bar-exam trap structures, answer-choice patterns, and doctrine tension points that can become BarMatrix diagnostics and repair modules.

## Workbook Facts

- Total question rows: 945
- Rows with `percent_correct`: 772
- Average percent correct: 58.5
- Median percent correct: 60.0
- Lowest percent correct: 10.0
- Highest percent correct: 96.0
- Questions below 50 percent correct: 181
- Questions below 45 percent correct: 48

Answer-letter distribution should be treated as a data artifact, not a student strategy:

- Correct answer counts: C = 435, A = 218, B = 184, D = 108
- Most popular wrong answer counts: A = 524, B = 202, C = 126, D = 93

The strongest answer-letter signal is that A is frequently the attractive trap, while C is frequently correct. This is useful for auditing item construction, but answer-letter position should not become a product-facing rule because it may reflect this bank's transformation/order history.

## Heuristic Doctrine Coverage

The workbook has no subtopic or outline-code columns, so these categories were inferred from stems, answer choices, correct explanations, wrong explanations, and additional notes.

| Heuristic family | Rows | Avg % correct | Below 50 |
|---|---:|---:|---:|
| Sentencing / Eighth / appeal / habeas | 12 | 52.0 | 7 |
| Sixth Amendment / trial rights | 94 | 54.5 | 28 |
| Assault / battery / sex crimes / kidnapping | 29 | 55.2 | 10 |
| Fifth Amendment / Miranda / confessions | 91 | 55.4 | 25 |
| Exclusion / double jeopardy / due process | 19 | 55.6 | 5 |
| Defenses / justification / excuse | 87 | 59.2 | 13 |
| Theft and property crimes | 152 | 59.3 | 29 |
| Mens rea / actus reus / causation | 62 | 59.4 | 9 |
| Homicide | 156 | 59.5 | 30 |
| Inchoate crimes | 65 | 60.3 | 6 |
| Fourth Amendment search and seizure | 164 | 60.8 | 19 |
| Accomplice / party liability | 14 | 65.4 | 0 |

The hardest broad areas are not the famous substantive crimes. The hardest areas are criminal procedure threshold/remedy questions: Sixth Amendment, Miranda/confessions, appeal/habeas/sentencing, and due process review.

## Main Finding

Your hypothesis is directionally right, but the precise version is:

Students can often get more than half of Criminal Law/Procedure questions by reading the answer choices as an issue map, not by ignoring the stem.

The answer choices often reveal the legal axis:

- charge ladder: murder vs manslaughter vs attempt vs lesser offense
- property label menu: larceny vs embezzlement vs false pretenses vs robbery
- procedure remedy menu: suppress vs admissible vs harmless error vs automatic reversal
- right-trigger menu: Fifth/Miranda vs Sixth/right to counsel vs Due Process
- threshold menu: warrant, probable cause, reasonable suspicion, custody, interrogation, attachment

The stem then supplies the one breaker fact: timing, status, attachment, possession/title, mental state, or remedy consequence.

## Answer-Choice-Only Signals

Detected workbook-wide:

- Short answer-choice menu rows: 240
- Charge/legal-label menu rows: 150
- Common answer-choice terms:
  - guilty: 120
  - murder: 110
  - not guilty: 99
  - warrant: 97
  - manslaughter: 84
  - larceny: 83
  - attempt: 80
  - Miranda: 74
  - robbery: 67
  - probable cause: 64
  - suppress: 55
  - admissible: 53
  - burglary: 45
  - conspiracy: 45
  - embezzlement: 35
  - false pretenses: 31

When answer choices are legal labels, the BarMatrix move should be:

1. Name the menu.
2. Find the axis separating the labels.
3. Go back to the stem for the one fact that decides that axis.

This is stronger than "read the answers only." It is a repeatable diagnostic skill.

## Core Trap Families

### 1. The Right Has Not Attached Yet

Common in Sixth Amendment, counsel, identification, and interrogation questions.

Wrong instinct:
Students see "lawyer," "indictment," "police questioning," "lineup," or "photo array" and overapply a right.

Correct axis:
Ask what right is being invoked and whether its trigger has happened.

Signals:

- Sixth Amendment right to counsel requires formal adversarial proceedings.
- Sixth Amendment is offense-specific.
- Photo arrays are not corporeal confrontations requiring counsel.
- Miranda/Fifth counsel is custody/interrogation based and not offense-specific in the same way.

Recommended BarMatrix tag:
`right_trigger_attachment`

Repair module:
"Name the right before applying the right."

### 2. Remedy Is Not Automatic

This is one of the most important Criminal Procedure patterns.

Wrong instinct:
If police/prosecution/court made a mistake, the answer must be suppression, reversal, or exclusion.

Correct axis:
Separate the right from the remedy.

Signals:

- Miranda violation does not always suppress physical fruits.
- Some errors receive harmless-error review.
- Brady requires suppression, favorability, and materiality.
- Due process misconduct requires prejudice/material effect, not just bad conduct.
- Habeas and appeal have procedural gates.

Recommended BarMatrix tag:
`remedy_not_automatic`

Repair module:
"Violation, remedy, prejudice: three different questions."

### 3. Status at the Exact Moment

This is a cross-subtopic pattern, not only a single doctrine.

Wrong instinct:
Students use the overall story's moral direction instead of checking the legal status at the decisive moment.

Correct axis:
At the legally relevant moment, what was the status?

Signals:

- Was property still stolen when received?
- Had the arrest/probable cause happened before the search?
- Was the force used during the taking or only after?
- Was conspiracy already complete at agreement?
- Had the right attached before the police conduct?

Recommended BarMatrix tag:
`status_at_decisive_moment`

Repair module:
"Freeze the frame."

### 4. Missing Element Despite Bad Conduct

This is a major substantive-crime pattern.

Wrong instinct:
Bad facts plus bad purpose equals liability.

Correct axis:
Find the missing element.

Signals:

- False pretenses needs a false statement of present or past fact, not merely a future promise.
- Forgery needs apparent legal significance.
- Common-law arson requires actual charring.
- Robbery needs force/intimidation in the course of the taking.
- False pretenses vs larceny by trick turns on title vs possession.
- Embezzlement turns on lawful possession of the specific property converted.

Recommended BarMatrix tag:
`bad_facts_missing_element`

Repair module:
"Ugly facts do not replace elements."

### 5. Mental-State Gradient

This dominates homicide, attempt, mayhem, statutory rape, and defenses.

Wrong instinct:
Students collapse intent, knowledge, recklessness, negligence, malice, and strict liability into one blameworthiness bucket.

Correct axis:
Identify the mental state for this offense or defense.

Signals:

- Attempt requires specific intent, even where the completed offense may be strict liability.
- Imperfect self-defense can reduce murder to voluntary manslaughter rather than acquit.
- Voluntary manslaughter is not defeated just because the defendant intended to kill.
- Murder does not always require specific intent to kill.
- Common-law mayhem is not merely recklessness.

Recommended BarMatrix tag:
`mental_state_ladder`

Repair module:
"Do not rank blame. Match the mens rea."

### 6. Lesser/Greater Offense Ladder

This appears heavily in homicide, property crimes, assaultive crimes, and double jeopardy.

Wrong instinct:
Pick the biggest crime that sounds emotionally appropriate.

Correct axis:
Ask whether the facts satisfy each additional element in the greater offense.

Signals:

- Murder vs voluntary manslaughter vs involuntary manslaughter.
- Robbery vs larceny vs attempted robbery.
- Attempt vs completed offense.
- Lesser-included offense under Blockburger.
- Assaultive offense merging or not merging with greater offense.

Recommended BarMatrix tag:
`lesser_greater_ladder`

Repair module:
"Climb only as high as the proven element."

### 7. Scope and Merger

Important in conspiracy, attempt, accomplice liability, double jeopardy, and Sixth Amendment.

Wrong instinct:
Same facts means same legal offense.

Correct axis:
Legal identity and scope, not factual overlap.

Signals:

- Conspiracy does not merge.
- Attempt merges into the completed crime.
- Withdrawal does not erase a completed conspiracy, but can cut off later Pinkerton liability.
- Sixth Amendment counsel is offense-specific.
- Double jeopardy turns on elements, not same transaction.

Recommended BarMatrix tag:
`scope_merger_identity`

Repair module:
"Same story is not the same offense."

### 8. Exception Stack

This is strongest in Fourth Amendment and confession questions.

Wrong instinct:
Students learn one exception and stop.

Correct axis:
Check the whole exception stack and the exception's preconditions.

Signals:

- Search incident to arrest can be valid when probable cause existed before search and arrest follows as one encounter.
- Warrant needs both probable cause and particularity.
- Exigency requires particularized probable cause, not a generalized hunch.
- Seibert limits deliberate two-step Miranda tactics.
- Elstad and Patane prevent overbroad "fruit of Miranda" reasoning.
- Independent source, inevitable discovery, attenuation, and good faith are separate gates.

Recommended BarMatrix tag:
`exception_stack`

Repair module:
"Exception names are not enough. Test the preconditions."

### 9. Student-Facing "Moral Gravity" Trap

This appears across almost everything.

Wrong instinct:
Choose the answer matching the worst actor or most serious harm.

Correct axis:
The bar often makes all choices morally bad, then rewards the legally cleanest distinction.

Signals:

- Guilty-looking defendant but wrong constitutional trigger.
- Serious harm but wrong mens rea.
- Bad police conduct but no remedy.
- Fraudulent behavior but wrong property-crime label.
- Violence but no robbery force at the right moment.

Recommended BarMatrix tag:
`moral_gravity_decoy`

Repair module:
"The ugliest story is often bait."

## High-Value Doctrine Tensions

These should become reusable Criminal Law/Procedure tension cards.

| Tension | Student wrong instinct | Correct move |
|---|---|---|
| Fifth/Miranda counsel vs Sixth counsel | Treat all lawyer facts the same | Identify source, trigger, and scope |
| Violation vs remedy | Any violation means suppression/reversal | Ask remedy, prejudice, and exception |
| Factual impossibility vs legal impossibility | Any impossibility defeats attempt | Completed-as-believed test |
| Attempt vs completed strict-liability crime | Completed offense mental state controls attempt | Attempt always requires specific intent |
| Murder vs manslaughter | Intent to kill always means murder | Check provocation/EED/imperfect defense/malice |
| Larceny by trick vs false pretenses | Fraud is fraud | Possession vs title |
| Larceny vs embezzlement | Entrusted property always embezzlement | Was this specific property lawfully possessed? |
| Robbery vs larceny | Any later force makes robbery | Force must be in the course of taking |
| Conspiracy withdrawal | Withdrawal erases conspiracy | Conspiracy complete at agreement; withdrawal affects later liability |
| Same transaction vs same offense | Same facts means same offense | Apply legal element identity |

## Priority Repair Modules

Build or tag items around these modules first:

1. `Name the Right`
   - Distinguishes Fourth, Fifth, Sixth, Due Process, Brady, Double Jeopardy, Eighth.

2. `Freeze the Frame`
   - Timing/status at the decisive moment.

3. `Violation to Remedy`
   - Suppression, admissibility, reversal, harmless error, habeas, appeal.

4. `Element Ladder`
   - Greater/lesser offenses and missing-element traps.

5. `Mens Rea Ladder`
   - Purpose, knowledge, recklessness, negligence, malice, strict liability, specific intent.

6. `Property Crime Switchboard`
   - Title, possession, custody, entrustment, force timing, legal significance.

7. `Conspiracy Scope`
   - Agreement, overt act, withdrawal, Pinkerton, merger.

8. `Answer Menu Decoder`
   - Reads answer choices as issue maps before returning to the stem.

## What To Do Next

For ChatGPT Project analysis, upload:

- `C:\Users\JesusLovesMe\Documents\CrimL\Criminal LAw.xlsx`
- `C:\ABM\work\criminal-law-pattern-analysis\criminal_law_pattern_index.csv`
- `C:\ABM\work\criminal-law-pattern-analysis\criminal_law_lowest_75_compact.csv`
- `C:\ABM\work\outline-code-lookup\outline_code_lookup.xlsx`

Then ask for three passes:

1. Bottom-up trap clustering across all 945 rows.
2. Critical-item analysis limited to rows below 50 percent correct.
3. Answer-choice-only analysis: infer the legal axis from choices before reading stems.

The key product move is to convert each repeated pattern into:

- diagnostic tag
- repair module
- student-facing rule card
- representative item set
- answer-choice recognition cue

---

# EMPIRICAL ENHANCEMENT (Claude — 2026-06-12)

Everything above is structural/heuristic. This section **tests the founder's core
hypothesis against the data** and converts the qualitative molds into quantified,
focus-group-backed signals. Scripts and machine-readable outputs:

- `answer_choice_only_test.py` → `answer_choice_only_results.json`
- `choices_only_ceiling.py` (5-fold cross-validated)
- `term_level_signal.py` → `term_level_signal.json`

All 945 rows have a usable correct-letter; 772 have focus-group `percent_correct`.

## 1. The founder hypothesis is TRUE — but only in a precise, refined form

> "In a perfect world you could read just the answer choices and get more than half right."

**Tested verdict: confirmed at ~56%, and the entire edge comes from ONE construction artifact.**

| Choices-only strategy (never reads the stem) | Accuracy |
|---|---:|
| Guess C (most common correct letter) | 46.0% |
| Pick the **shortest** choice | 12.5% |
| Pick the **longest / most legally-complete** choice | **54.7%** |
| Length-led decoder (longest, else C) | **56.4%** |
| 5-fold cross-validated model on choice-only features | **56.3%** |

A blind reader who **always picks the longest, most fully-stated choice and breaks
ties toward C clears ~56%** — meaningfully above half. But pure choices-only **caps
near 56% here**; to go higher you *must* return to the stem for the breaker fact.
That is exactly the "name the menu → find the axis → get the breaker fact" move. The
two analyses converge: the answer choices get you *over the line*; the stem-return is
the *skill*.

## 2. The two universal, letter-blind "tells" (learned weights)

The cross-validated model's weights are the whole game:

| Feature in a choice | Weight | Meaning |
|---|---:|---|
| **is the longest choice** | **+1.63** | the complete-rule statement is usually the key |
| **contains an absolute word** (always/never/all/none/cannot/must) | **−1.45** | absolute-language choices are usually WRONG |
| relative length | +0.71 | longer leans correct |
| contains a remedy word (admissible/valid/reasonable) | +0.28 | mild key-lean |
| contains a qualifier (if/because/unless) | −0.24 | qualifiers appear in *traps* too — not a reliable tell |
| later position | −0.22 | weak |

**Two teachable blind rules, in priority order:**

1. **ELIMINATE any choice containing `always / never / all / none / cannot / must`.**
   This is the single strongest *elimination* signal. (See §3: a choice with **"always"
   was correct 0% of the time** and was the trap 40% of the time.)
2. **Among survivors, favor the longest, most legally-complete statement.**

These two rules alone reproduce the ~56% blind ceiling. They are the concrete engine
behind the report's `Answer Menu Decoder` module.

## 3. Term-level answer-menu cues (what a word *inside* a choice predicts)

For each keyword: when it appears in a choice, how often is that choice the **key**
vs. the **top trap**. `lift = key% − trap%`. Neutral baseline ≈ +8. Strong cues:

**KEY-LEAN (the choice with this word leans correct):**

| Term | n | key% | trap% | lift |
|---|--:|--:|--:|--:|
| specific intent | 14 | 71.4 | 21.4 | **+50.0** |
| necessity | 14 | 50.0 | 14.3 | +35.7 |
| murder | 197 | 36.5 | 17.8 | +18.8 |
| self-defense | 33 | 33.3 | 15.2 | +18.2 |
| reasonable | 108 | 44.4 | 26.9 | +17.6 |
| intent | 103 | 42.7 | 26.2 | +16.5 |
| **admissible** | 58 | 25.9 | 13.8 | +12.1 |

**TRAP-LEAN (the choice with this word leans wrong):**

| Term | n | key% | trap% | lift |
|---|--:|--:|--:|--:|
| **always** | 80 | **0.0** | 40.0 | **−40.0** |
| suppress | 17 | 11.8 | 35.3 | −23.5 |
| malice | 13 | 30.8 | 53.8 | −23.1 |
| must | 55 | 12.7 | 34.5 | −21.8 |
| never | 145 | 4.1 | 23.4 | −19.3 |
| reverse | 13 | 15.4 | 30.8 | −15.4 |
| inadmissible | 29 | 13.8 | 27.6 | −13.8 |
| manslaughter | 130 | 17.7 | 30.8 | −13.1 |

Two of these clusters **independently confirm the qualitative molds with numbers**:

- **"Remedy is not automatic" is visible at the choice level.** `admissible` / `valid`
  lean KEY; `suppress` / `inadmissible` / `reverse` / `suppressed` lean TRAP. When the
  menu is *suppress vs. admissible*, the blind guess is **admissible** — students
  systematically over-apply suppression and reversal. (Confirms Core Trap Family #2 and
  Molds 9, 27, 25, 26.)
- **The charge ladder runs the wrong way for students.** `murder` leans KEY (+18.8)
  while `manslaughter` / `voluntary manslaughter` lean TRAP (−13.1 / −8.7). Students
  **climb down** the ladder to the "less harsh" charge when the facts support staying up.
  (Confirms Core Trap Family #6 and Mold 12 — voluntary-manslaughter-as-catch-all.)
- **`specific intent` is a near-tell (+50, 71% key).** When a choice resolves on
  "specific intent," it's usually right — the bar rewards naming the precise mens rea.
  (Confirms Molds 6 and 22.)

## 4. Difficulty is CONCENTRATED — reframing the product target

The bank is not uniformly trappy. In the focus group, the plurality already lands on
the correct answer in the overwhelming majority of questions:

| Band (% correct) | n | avg top-distractor pull |
|---|--:|--:|
| BRUTAL <25 | 4 | 37.5% |
| HARD 25–39 | 6 | 39.5% |
| COIN-FLIP 40–49 | 171 | 29.5% |
| MEDIUM 50–64 | 413 | 23.8% |
| EASY 65+ | 178 | 14.2% |

**"Trap wins" — questions where MORE students picked the trap than the key — number
just 9 of 772 (1.2%).** The lethal molds dominate a thin set; the *product-valuable*
mass is the **171-question COIN-FLIP band (40–49%)**, where the correct answer wins by
only ~15 points and a single trigger fact decides it. That band — not the famous
substantive crimes — is where BarMatrix diagnostics convert the most students. Build
and tag the COIN-FLIP band first.

## 5. The deadliest 9 cross-validate Codex's molds (no circularity)

The empirically deadliest trap-wins, mined here purely from focus-group numbers, land
on the *same* questions Codex named from doctrine — independent confirmation:

| QID | %correct | key→% | trap→% | Maps to mold |
|---|--:|--|--|---|
| 21601 | 10 | A→10 | C→60 | M1 Ritual-Sequence (search vs. arrest) |
| 20881 | 12 | C→12 | B→48 | M2 Permanent-Invocation (Edwards/Shatzer) |
| 14619 | 22 | B→21 | A→37 | M4 Element-vs-Affirmative-Defense burden |
| 14596 | 28 | B→28 | C→43 | M4 (insanity reform burden) |
| 14615 | 30 | B→30 | D→54 | M7 Fifth-vs-Sixth conflation |
| 14625 | 34 | A→34 | C→46 | Acquitted-Predicate (collateral estoppel) |
| 14641 | 36 | D→36 | A→47 | M6 Attempt-Inherits-Specific-Intent |
| 14569 | 40 | D→40 | B→52 | Police-directed search ≠ T.L.O. school standard (state-action/threshold family, Molds 23–27) |
| 14650 | 43 | B→18 | A→28 | **DUAL-KEY artifact** — NCBE accepted A *and* B; intoxication negates attempted-murder (specific intent) not assault (M22). Exclude from trap tagging. |

## 6. Concretized product spec — the "Answer Menu Decoder"

The decoder is now a **two-pass instrument**, not a slogan:

**Pass 1 — Blind (choices only), ~56% expected:**
1. Cross out every choice with `always / never / all / none / cannot / must`.
2. If the menu is a remedy menu, distrust `suppress / inadmissible / reverse`; lean `admissible / valid`.
3. If the menu is a charge ladder, do **not** auto-downgrade to manslaughter.
4. Among survivors, pick the longest, most legally-complete statement.

**Pass 2 — Stem-return (the skill that beats 56%):**
5. Name the axis the surviving choices disagree on (timing, status, possession/title,
   mens rea, attachment, remedy/prejudice).
6. Find the **one breaker fact** in the stem that decides that axis (the "Freeze the
   Frame" / "Name the Right" moves).

Teach Pass 1 as the **floor** (a guessing student should never score below ~56%) and
Pass 2 as the **ceiling move**. Every COIN-FLIP-band item should ship with: the blind
tells it triggers, the axis, the breaker fact, and which TRAP-LEAN word baited the field.

