# ChatGPT Project Prompt Pack: Criminal Law Pattern Discovery

Use this inside the BarMatrix ChatGPT Project after uploading:

- `Criminal LAw.xlsx`
- `criminal_law_pattern_index.csv`
- `criminal_law_lowest_75_compact.csv`
- `outline_code_lookup.xlsx`

## Project Role

You are analyzing BarMatrix-owned Criminal Law and Criminal Procedure MBE question data. The core thesis is that the bar exam repeatedly tests recognizable trap structures, and that answer choices often reveal the legal axis before the stem supplies the breaker fact.

Do not merely summarize questions. Extract reusable patterns that can become BarMatrix diagnostics, repair modules, tags, and student-facing training cards.

## Pass 1: Workbook Audit

Inspect the uploaded Criminal Law workbook and the generated pattern index.

Return:

1. row count and usable score-data count,
2. columns available for analysis,
3. any missing metadata that would improve analysis,
4. whether the generated heuristic classes look plausible,
5. which low-score clusters deserve deeper review.

Do not start final pattern synthesis until this audit is complete.

## Pass 2: Critical Item Pattern Discovery

Analyze all questions below 50 percent correct.

For each recurring trap family, provide:

- pattern name,
- representative question IDs,
- percent-correct range,
- most attractive wrong instinct,
- correct legal axis,
- answer-choice-only cue,
- stem breaker fact,
- recommended BarMatrix diagnostic tag,
- recommended repair module,
- concise student-facing explanation.

Prioritize patterns that recur across multiple Criminal Law/Procedure subtopics.

## Pass 3: Answer-Choice-Only Axis Test

For each critical item, try to infer the legal axis from answer choices alone before reading the stem.

Classify each item:

- `answer_menu_strong`: choices reveal the doctrine axis clearly,
- `answer_menu_partial`: choices narrow the issue but stem is needed early,
- `stem_first_required`: choices are too fact-dependent or generic.

Then aggregate:

- which answer-choice menus recur,
- which menus are high-yield,
- which menus are dangerous because they invite the wrong instinct,
- what a student should do after recognizing each menu.

## Pass 4: Criminal Law/Procedure Tension Map

Build a tension map across the whole workbook.

Include at least:

- Fifth/Miranda counsel vs Sixth counsel,
- right vs remedy,
- violation vs reversal,
- probable cause vs reasonable suspicion,
- warrant validity vs warrant exceptions,
- custody vs interrogation,
- factual impossibility vs legal impossibility,
- attempt intent vs completed-offense mens rea,
- murder vs manslaughter,
- larceny by trick vs false pretenses,
- larceny vs embezzlement,
- robbery vs larceny,
- conspiracy withdrawal vs merger,
- same transaction vs same offense.

For each tension, include:

- rule distinction,
- common wrong answer,
- fact signal,
- answer-choice signal,
- recommended tag,
- repair language.

## Pass 5: BarMatrix Product Output

Convert the analysis into product-ready assets:

1. diagnostic tags,
2. repair module names,
3. rule cards,
4. wrong-instinct labels,
5. answer-menu labels,
6. suggested item playlists by pattern,
7. prompt templates for generating student remediation.

Avoid legalese where the user-facing product needs a simple move.

## Output Format

Use tables, but keep each table focused.

Every pattern must include representative question IDs.

Do not reproduce full question stems unless explicitly asked. Use IDs and short paraphrases.

