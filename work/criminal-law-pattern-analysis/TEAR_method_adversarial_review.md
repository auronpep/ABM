# TEAR Method — Adversarial Review (creed-compliant)

Reviewer: Claude · 2026-06-13 · per `C:\CCG\reasoning-creed-prompt.md`
Inputs: `Home.pdf` (landing), `Drills.pdf` (223-drill bank), `CM14957.md` (engine output),
and this session's empirical pass on the 945-question Criminal Law bank.

Method: **escrow the idea in its strongest form → confirm with proof → then try to
falsify my own favorable read, each objection paired with a replacement route.**

---

## 1. The idea, escrowed (strongest form, before any critique)

TEAR is **not a study method. It is a judgment-training method for people who already
know the law and lose points to their own virtues.**

- **T — Test the answer:** name what the choice actually claims; check it against the governing issue.
- **E — Expose the counterfeit:** find the half-rule / familiar word / plausible exception that pulled you.
- **A — Apply the rule:** return to the governing rule before emotion, familiarity, or moral weight takes over.
- **R — Repair the pattern:** route to drills tied to the trap behind the miss — "repair the pattern, not the pile."

The wedge is sharp and true: the MBE's deadliest distractors **exploit competence-adjacent
instincts** — your sense of justice, your nose for the incriminating, your instinct for
fairness. That is a real, underserved failure mode, and naming it is ownable. The C3
transform (Christian-themed, infinitely re-skinnable) makes the item bank **memorization-proof**,
which is a genuine moat. "Proof before price" (free diagnostic that reads your own answers
back to you) is honest go-to-market that matches the brand's stated value — *judge righteous
judgment*.

**This framing deserves to be built. The rest of this document is paranoia on the gaps, not doubt about the goal.**

---

## 2. Where the evidence already backs it (proof, not proxy)

This session's term-level analysis of the 945-Q bank **independently produces TEAR's
counterfeit thesis in a different vocabulary** — which is real corroboration:

| TEAR claim | Empirical confirmation (focus-group pick rates) |
|---|---|
| "a familiar word used the wrong way" | choices containing `suppress` (−23.5), `inadmissible` (−13.8), `reverse` (−15.4), `must` (−21.8), `never` (−19.3), `always` (**0% ever correct, 40% trap**) lean **trap** |
| "an answer that sounds righteous but misses the test" | the moral-gravity decoy: students over-pick suppression/reversal; `admissible` (+12.1) and `murder` (+18.8) lean **key** — students under-charge and over-suppress |
| "just enough truth to survive a quick glance" | CM14957's dominant trap D is a literal **two-of-three-gates** half-right answer (33% picked it) |
| "the same kind of answer keeps persuading you" | the counterfeit structures recur as nameable molds across the bank |

So the counterfeit thesis is not marketing. It is observable in the pick-rate data. **Good.**

---

## 3. Now — how to prove me (and the optimistic read) wrong

Five falsification angles. Each is genuine; each carries a replacement route.

### 3.1 The knowledge-floor problem — TEAR can't supply the rule it tells you to "Apply"

**Objection.** The **T** and **A** steps presuppose the student *knows the governing rule*.
"Test whether it fits the governing legal issue" and "Return to the actual governing rule"
are null instructions for a student who doesn't know that equitable subrogation needs three
gates. This session proved that **reading the choices alone caps at ~56%**; the climb to
75%+ is *stem + rule knowledge* TEAR cannot manufacture. TEAR amplifies discernment; it does
not build substance. The landing page's own Hebrews 5:14 — *"strong meat belongeth to them
of full age"* — quietly concedes this. The honest TAM is the **55–70% scorer who needs the
last ten points**, not the 40% scorer who lacks the law.

**Replacement route.** Make the diagnostic *classify each miss*: **knowledge-gap** (didn't
know the rule) vs **pattern-miss** (knew it, got pulled by the counterfeit). The data to do
this already exists in the engine — CM14957's `legal_leak_audit` literally separates
`student_accessible` from `anchor_assisted` from `lawyer_only`. Route gap-students to
substance first; sell TEAR drills to pattern-students. Selling TEAR as universal to all
bar-takers is the one positioning error that will generate refunds.

### 3.2 "Repair the pattern, not the pile" vs. **99 molds for one subject**

**Objection.** The promise is that misses collapse into a *few* repairable patterns. But it
took **99 named molds** (`trap-analysis-rounds.md`, 10 rounds) to cover the hard band of
**one of seven subjects**. At ~100 molds/subject that is ~700 patterns — the pile didn't
disappear, it **moved from 3,666 questions to ~700 molds**. The compression is real but far
weaker than "the pattern" (singular) implies.

**Replacement route.** Prove a **Pareto**, don't claim a singularity. The difficulty is
concentrated (the 40–49% coin-flip band = 171 Qs with ~29.5% trap-pull; only 1.2% of
questions are true "trap-wins"). Show that the **top ~15 lethal molds cover the majority of
hard-band misses**, lead the product with those 15, and treat the long tail as enrichment.
Change the claim from "repair the pattern" to **"repair the patterns that cost you the most
points."** That sentence is both true and still sells.

### 3.3 Inherited pick-rates may not survive the Christian transform

**Objection.** CM14957 carries `pick_rates: inherited` — every drill's difficulty dots and
"dominant trap = D" are **assumed to transfer from the original question through a total
rewrite of all four choices.** But this session proved **choice length is the single
strongest predictor of the key** (weight +1.63; longest-choice alone = 54.7%). The transform
rewrites every choice; if it shifts relative choice lengths or adds a salient name, the
inherited dominant-trap and difficulty rating can be **wrong on the item actually shown**.
A drill that displays "★★ difficulty, trap = D" on numbers it never measured is a quiet
honesty leak in a brand whose whole equity is honesty.

**Replacement route.** (a) Enforce **choice-length parity** in the transform (the engine
already claims `substance: kept` — extend that to *length kept*). (b) Label inherited numbers
as **"projected"** in-product until measured. (c) Validate a sample of transformed drills
against fresh pick data. This is the **most checkable technical risk** and the cheapest to de-risk.

### 3.4 Confirmation hazard — I am partly marking my own homework

**Objection (the governor, turned on myself).** My §2 "proof" and TEAR were mined from the
**same bank**. My "suppress = trap" finding and TEAR's "familiar word used the wrong way" are
the *same observation in two vocabularies* — convergence from one dataset is **consistency,
not independent proof**. The genuinely novel and still-**unproven** claim is a *training*
claim: that **naming the counterfeit improves future accuracy**. NCBE already builds
distractors to be attractive; that they are attractive is not news. That BarMatrix's
name-and-repair loop *moves a score* is the valuable assertion, and it has not been established.

**Replacement route.** Make "proof before price" literal: instrument **pre/post accuracy on
held-out, same-mold items.** If a student who repairs Mold-X then beats a fresh Mold-X item at
a higher rate than a control, the training claim is proven *and* becomes the best marketing
asset you have. Build this measurement **before** scaling ad spend — it is the difference
between a thesis and a product.

### 3.5 A three-question diagnostic cannot establish a "pattern"

**Objection.** The free hook is **3 questions** (Home p1). Three misses cannot statistically
separate "random miss" from "recurring trap pattern" — the copy ("find out whether your wrong
answers are random misses or recurring trap patterns") promises an inference the sample size
can't support.

**Replacement route.** Keep the free 3-question hook **descriptive** — *name the exact
counterfeit you fell for on each* (true, and devastating as a hook). **Gate the predictive
"recurring pattern" verdict behind the paid N≥~12 diagnostic.** Under-claiming on the free tier
protects the brand's core asset — credibility — and makes the paid upgrade the thing that
*earns* the word "pattern."

---

## 4. Synthesis — wild core, conservative shell

- **Wild core (keep, protect, double down):** the counterfeit-naming engine + memorization-proof
  C3 transform + "trained to judge rightly" positioning. This is differentiated and defensible.
- **Conservative shell (pin every other variable to safe):**
  1. Segment **knowledge-gap vs pattern-miss**; sell TEAR to the cohort it actually helps (§3.1).
  2. Reframe to **"the patterns that cost you the most points"** + a Pareto of ~15 lethal molds (§3.2).
  3. **Measured, not inherited**, difficulty/trap labels on transformed drills (§3.3).
  4. **Instrument pre/post on held-out same-mold items** before scaling spend (§3.4).
  5. Free tier **descriptive**, predictive "pattern" claim gated behind sufficient N (§3.5).

**Bottom line.** TEAR is right about the disease and right about the patient. The five risks
are not reasons to shrink it — they are the conditions to engineer so the claim survives
contact with a paying, skeptical, possibly-failing-the-bar customer. The one thing that would
actually falsify the whole method — *does naming the counterfeit move the score?* — is also
the one thing the product is uniquely built to measure. Measure it first.

---

## 5. The decisive falsification test (`falsify_counterfeit.py`, n=925)

**Hypothesis to kill:** if the dominant trap is predictable from pure SURFACE features
(length, absolute words, moral-gravity words, position), the counterfeit is mechanical and
the "expose the counterfeit / name the mold / Gold Key" apparatus is decoration.

**Result — the method survived:**

| Surface-only predictor of dominant trap | Accuracy (baseline 33.3%) |
|---|---:|
| longest wrong choice | 42.7% |
| most absolute-words wrong choice | 40.8% |
| most moral-gravity-words wrong choice | 41.4% |
| closest length to key | 39.7% |
| **first wrong choice (position)** | **68.3%** |
| dominant trap == longest of all 4 | 21.3% (key == longest = 54.2%) |

- **Semantic surface features only reach ~40% (a +7pp noise-grade nudge).** You cannot dodge
  the trap by counting words. The dominant trap is length-, absolute-, and moral-word-neutral
  → **it is genuinely doctrinal.** This is the strongest evidence *for* C3/TEAR found so far:
  I tried to mechanize the counterfeit away and could not. "Expose the counterfeit" is doing
  real, non-decorative work.
- **The lone strong surface predictor — position (68.3%) — is a provenance artifact, not a
  trap mechanism.** The dominant trap is the earliest non-key letter (mostly A), the mirror of
  "C is usually correct." It is a scar of how this transformed bank was ordered, **and C3's own
  choice-shuffle destroys it** (CM14957 moved the key D→C). It will not transfer to a
  position-randomized real MBE.

**What this proves wrong:** not the *method* (it held), but the *inherited difficulty/dominant-trap
metadata* on transformed drills — they ride a 68% positional confound that the transform itself
dismantles. This is §3.3, now demonstrated rather than asserted. Verdict: **measure trap/difficulty
on the transformed item; never inherit the dominant-trap letter through a shuffle.**
