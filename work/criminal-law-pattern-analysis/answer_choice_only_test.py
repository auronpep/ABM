"""Empirically test the founder hypothesis: can structural heuristics that read
ONLY the answer choices (never the stem) beat 50% on Criminal Law/Procedure MBE?

Outputs per-heuristic accuracy, a stacked "decoder" accuracy, and the lethal-trap
quantification (aggregate focus-group points lost to each detectable pattern).
"""
from __future__ import annotations
import re, json, statistics
from pathlib import Path
import openpyxl

SRC = Path(r"C:\Users\JesusLovesMe\Documents\CrimL\Criminal LAw.xlsx")
OUT = Path(r"C:\ABM\work\criminal-law-pattern-analysis")

wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
ws = wb["Sheet1"]
rows = list(ws.iter_rows(min_row=1, values_only=True))
hdr = [str(c) for c in rows[0]]
idx = {h: i for i, h in enumerate(hdr)}

def g(r, k):
    v = r[idx[k]] if idx.get(k) is not None and idx[k] < len(r) else None
    return v

records = []
for r in rows[1:]:
    qid = g(r, "barmatrix_question_id")
    if qid is None:
        continue
    choices = {L: (g(r, f"answer_{L}") or "") for L in "abcd"}
    if not any(choices.values()):
        continue
    correct = (g(r, "correct_answer") or "").strip().lower()
    correct = correct[0] if correct else ""
    pc = g(r, "percent_correct")
    rec = {
        "qid": str(qid),
        "choices": {L: str(choices[L]).strip() for L in "abcd"},
        "correct": correct if correct in "abcd" else "",
        "popular_wrong": (str(g(r, "most_popular_wrong_answer") or "").strip().lower()[:1]),
        "pc": float(pc) if isinstance(pc, (int, float)) else None,
        "pct": {L: g(r, f"percent_{L}") for L in "abcd"},
    }
    records.append(rec)

valid = [r for r in records if r["correct"] in "abcd"]
N = len(valid)
print(f"Loaded {len(records)} rows, {N} with usable correct-letter.\n")

# ---- Heuristics that look ONLY at the four choice strings ----
QUALIFIERS = re.compile(r"\b(if|because|since|unless|only|provided|where|when|"
                        r"as long as|so long as)\b", re.I)
ABSOLUTES = re.compile(r"\b(always|never|all|none|cannot|must|any|every|no\b)\b", re.I)

def words(s): return len(re.findall(r"\w+", s))

def h_longest(c):
    return max("abcd", key=lambda L: words(c[L]))

def h_shortest(c):
    return min("abcd", key=lambda L: words(c[L]))

def h_most_qualified(c):
    # choice with the most conditional language ("if/because/unless")
    sc = {L: len(QUALIFIERS.findall(c[L])) for L in "abcd"}
    best = max(sc.values())
    if best == 0: return None
    cands = [L for L in "abcd" if sc[L] == best]
    return cands[0] if len(cands) == 1 else None

def h_least_absolute(c):
    # avoid the choice with the most absolute words; pick the one with fewest (and some text)
    sc = {L: len(ABSOLUTES.findall(c[L])) for L in "abcd"}
    cands = sorted("abcd", key=lambda L: (sc[L], -words(c[L])))
    return cands[0]

def h_guilty_default(c):
    # in charge questions, the qualified "guilty if/because" beats bare "not guilty"
    g_if = [L for L in "abcd" if re.search(r"\bguilty\b", c[L], re.I)
            and QUALIFIERS.search(c[L])]
    return g_if[0] if len(g_if) == 1 else None

def h_position_c(c):
    return "c"

def h_odd_one_out(c):
    # 3 choices share a head-noun, 1 differs -> the lone differing label is often the key
    heads = {}
    for L in "abcd":
        m = re.match(r"\s*\W*(\w+)", c[L])
        heads[L] = (m.group(1).lower() if m else "")
    from collections import Counter
    cnt = Counter(heads.values())
    odd = [L for L in "abcd" if cnt[heads[L]] == 1]
    return odd[0] if len(odd) == 1 else None

HEUR = {
    "position_C (baseline bias)": h_position_c,
    "longest_choice": h_longest,
    "shortest_choice": h_shortest,
    "most_qualified (if/because/unless)": h_most_qualified,
    "least_absolute (avoid always/never)": h_least_absolute,
    "guilty-if over bare-not-guilty": h_guilty_default,
    "odd-one-out head noun": h_odd_one_out,
}

print("=== Single-heuristic accuracy (answer-choices-only) ===")
results = {}
for name, fn in HEUR.items():
    hit = att = 0
    for r in valid:
        pred = fn(r["choices"])
        if pred is None:
            continue
        att += 1
        if pred == r["correct"]:
            hit += 1
    acc = hit / att if att else 0
    cov = att / N
    results[name] = (acc, cov, att)
    print(f"  {name:42s} acc={acc*100:5.1f}%  coverage={cov*100:5.1f}%  (n={att})")

# ---- Stacked decoder: ordered rule list, first that fires wins ----
ORDER = [h_guilty_default, h_most_qualified, h_odd_one_out, h_least_absolute, h_position_c]
hit = 0
for r in valid:
    pred = None
    for fn in ORDER:
        pred = fn(r["choices"])
        if pred is not None:
            break
    if pred == r["correct"]:
        hit += 1
print(f"\n=== Stacked decoder (guilty-if -> qualified -> odd-out -> least-absolute -> C) ===")
print(f"  accuracy over ALL {N} questions = {hit/N*100:.1f}%")

# ---- Bayesian ceiling: best single letter per "menu signature" ----
# If you could only see choices, the theoretical ceiling = always pick the most
# likely correct letter given choice-count and presence of charge labels.
from collections import Counter, defaultdict
buckets = defaultdict(Counter)
for r in valid:
    n_choices = sum(1 for L in "abcd" if r["choices"][L])
    has_guilty = bool(re.search(r"\bguilty\b", " ".join(r["choices"].values()), re.I))
    sig = (n_choices, has_guilty)
    buckets[sig][r["correct"]] += 1
ceil_hit = sum(cnt.most_common(1)[0][1] for cnt in buckets.values())
print(f"\n=== Structural ceiling (oracle picks best letter per menu-signature) ===")
print(f"  ceiling = {ceil_hit/N*100:.1f}%  (this is the max any choices-only rule can reach here)")

# ---- Letter distribution + trap-letter confirm ----
corr = Counter(r["correct"] for r in valid)
pop = Counter(r["popular_wrong"] for r in valid if r["popular_wrong"] in "abcd")
print(f"\n=== Letter signal ===")
print(f"  correct:        {dict(corr)}")
print(f"  popular wrong:  {dict(pop)}")

# ---- Lethal-trap quantification: focus-group points lost ----
graded = [r for r in valid if r["pc"] is not None]
band = lambda lo, hi: [r for r in graded if lo <= r["pc"] < hi]
print(f"\n=== Difficulty bands (n with pc = {len(graded)}) ===")
for lo, hi, lbl in [(0,25,"BRUTAL <25"),(25,40,"HARD 25-39"),(40,50,"COIN-FLIP 40-49"),
                    (50,65,"MEDIUM 50-64"),(65,101,"EASY 65+")]:
    b = band(lo, hi)
    avg_pop = statistics.mean(
        [r["pct"][r["popular_wrong"]] for r in b
         if r["popular_wrong"] in "abcd" and isinstance(r["pct"].get(r["popular_wrong"]),(int,float))]
        or [0])
    print(f"  {lbl:16s} n={len(b):3d}   avg top-distractor pull={avg_pop:4.1f}%")

# Where the single most popular wrong answer beats the correct answer (true traps)
flipped = [r for r in graded if r["popular_wrong"] in "abcd"
           and isinstance(r["pct"].get(r["popular_wrong"]),(int,float))
           and isinstance(r["pct"].get(r["correct"]),(int,float))
           and r["pct"][r["popular_wrong"]] > r["pct"][r["correct"]]]
print(f"\n=== 'Trap wins' — questions where more students picked the trap than the key ===")
print(f"  count = {len(flipped)} of {len(graded)} graded ({len(flipped)/len(graded)*100:.1f}%)")
top = sorted(flipped, key=lambda r: r["pc"])[:25]
print("  deadliest 25 (qid, pc, key->key%, trap->trap%):")
for r in top:
    print(f"    {r['qid']:8s} pc={r['pc']:4.0f}  key {r['correct'].upper()}={r['pct'][r['correct']]:>4}  "
          f"trap {r['popular_wrong'].upper()}={r['pct'][r['popular_wrong']]:>4}")

# Save machine-readable summary
summary = {
    "n_total": len(records), "n_valid": N,
    "single_heuristics": {k: {"acc": v[0], "coverage": v[1], "n": v[2]} for k,v in results.items()},
    "stacked_decoder_acc": hit/N,
    "structural_ceiling_acc": ceil_hit/N,
    "letters_correct": dict(corr), "letters_popwrong": dict(pop),
    "trap_wins": len(flipped), "graded": len(graded),
    "deadliest": [{"qid": r["qid"], "pc": r["pc"], "key": r["correct"],
                   "key_pct": r["pct"][r["correct"]], "trap": r["popular_wrong"],
                   "trap_pct": r["pct"][r["popular_wrong"]]} for r in top],
}
(OUT / "answer_choice_only_results.json").write_text(json.dumps(summary, indent=2))
print(f"\nSaved -> {OUT/'answer_choice_only_results.json'}")
