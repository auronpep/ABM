"""FALSIFICATION TEST for the TEAR/C3 'counterfeit' thesis.

Claim under test: the dominant trap (most-popular-wrong-answer) is a DOCTRINAL
counterfeit that requires legal reasoning to see. If instead the dominant trap is
predictable from pure SURFACE features (length, absolute words, position) with no
doctrine, the counterfeit-naming apparatus is decoration and the thesis is falsified.

Decision rule:
  - Among the 3 wrong choices, random pick of the dominant trap = 33.3%.
  - If a surface-only model predicts the dominant trap >> 33% (say >55%), the trap is
    mechanical -> thesis WEAKENED/falsified.
  - If surface is near 33%, the trap is doctrinal -> thesis SURVIVES.
We restrict to graded questions where a single dominant wrong answer is identifiable.
"""
from __future__ import annotations
import re
from pathlib import Path
from collections import Counter
import openpyxl

SRC = Path(r"C:\Users\JesusLovesMe\Documents\CrimL\Criminal LAw.xlsx")
wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
ws = wb["Sheet1"]; rows=list(ws.iter_rows(min_row=1,values_only=True))
hdr=[str(c) for c in rows[0]]; idx={h:i for i,h in enumerate(hdr)}
def g(r,k): return r[idx[k]] if idx.get(k) is not None and idx[k]<len(r) else None
ABS=re.compile(r"\b(always|never|all|none|cannot|must|any|every)\b",re.I)
MORAL=re.compile(r"\b(guilty|murder|suppress|inadmissible|reverse|liable|convicted)\b",re.I)
def words(s): return len(re.findall(r"\w+",s))

data=[]
for r in rows[1:]:
    if g(r,"barmatrix_question_id") is None: continue
    ch={L:str(g(r,f"answer_{L}") or "").strip() for L in "abcd"}
    if not all(ch[L] for L in "abcd"): continue
    cor=(str(g(r,"correct_answer") or "").strip().lower()+" ")[0]
    trap=(str(g(r,"most_popular_wrong_answer") or "").strip().lower()+" ")[0]
    if cor not in "abcd" or trap not in "abcd" or trap==cor: continue
    data.append((ch,cor,trap))
N=len(data)
wrongs=lambda cor: [L for L in "abcd" if L!=cor]

def score(name,pick):
    hit=0
    for ch,cor,trap in data:
        cand=wrongs(cor)
        p=pick(ch,cor,cand)
        if p==trap: hit+=1
    print(f"  {name:48s} {hit/N*100:5.1f}%   (n={N}, baseline 33.3%)")
    return hit/N

print(f"Falsification test on {N} questions with an identifiable dominant trap.\n")
print("Surface-only predictors of the DOMINANT TRAP (among the 3 wrong choices):")
score("longest wrong choice", lambda ch,cor,cand: max(cand,key=lambda L:words(ch[L])))
score("shortest wrong choice", lambda ch,cor,cand: min(cand,key=lambda L:words(ch[L])))
score("most absolute-words wrong choice",
      lambda ch,cor,cand: max(cand,key=lambda L:(len(ABS.findall(ch[L])),words(ch[L]))))
score("most moral-gravity-words wrong choice",
      lambda ch,cor,cand: max(cand,key=lambda L:(len(MORAL.findall(ch[L])),words(ch[L]))))
score("choice closest in length to the KEY",
      lambda ch,cor,cand: min(cand,key=lambda L:abs(words(ch[L])-words(ch[cor]))))
score("first wrong choice (position A>B>C>D)", lambda ch,cor,cand: cand[0])

# Combined surface model: longest-or-most-moral, tie to closest-length-to-key
def combo(ch,cor,cand):
    return max(cand,key=lambda L:(words(ch[L]) - 3*abs(words(ch[L])-words(ch[cor]))*0 + len(MORAL.findall(ch[L]))*2))
score("combo: moral-weight + length", combo)

# How often is the dominant trap literally the longest of ALL four choices?
long_all=sum(1 for ch,cor,trap in data if trap==max("abcd",key=lambda L:words(ch[L])))
print(f"\n  dominant trap == longest of all 4 choices: {long_all/N*100:.1f}%")
# How often is the KEY the longest? (for contrast)
key_long=sum(1 for ch,cor,trap in data if cor==max("abcd",key=lambda L:words(ch[L])))
print(f"  key            == longest of all 4 choices: {key_long/N*100:.1f}%")

# Length ordering: is the trap usually the 2nd-longest (key longest)?
ranks=Counter()
for ch,cor,trap in data:
    order=sorted("abcd",key=lambda L:-words(ch[L]))
    ranks[order.index(trap)+1]+=1
print(f"\n  Dominant-trap length rank (1=longest..4=shortest): "
      + ", ".join(f"#{k}={v} ({v/N*100:.0f}%)" for k,v in sorted(ranks.items())))
