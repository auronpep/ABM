"""Honest ceiling for 'choices-only' prediction via 5-fold CV on a small feature
set derived ONLY from the four answer strings (never the stem). Also re-tests a
length-led stacked decoder and reports the trap-pull on the coin-flip band.
"""
from __future__ import annotations
import re, json
from pathlib import Path
from collections import Counter
import openpyxl

SRC = Path(r"C:\Users\JesusLovesMe\Documents\CrimL\Criminal LAw.xlsx")
OUT = Path(r"C:\ABM\work\criminal-law-pattern-analysis")
wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
ws = wb["Sheet1"]; rows = list(ws.iter_rows(min_row=1, values_only=True))
hdr = [str(c) for c in rows[0]]; idx = {h: i for i, h in enumerate(hdr)}
def g(r,k): return r[idx[k]] if idx.get(k) is not None and idx[k] < len(r) else None

QUAL = re.compile(r"\b(if|because|since|unless|only|provided|where|when)\b", re.I)
ABS  = re.compile(r"\b(always|never|all|none|cannot|must|any|every)\b", re.I)
def words(s): return len(re.findall(r"\w+", s))

data = []
for r in rows[1:]:
    qid = g(r,"barmatrix_question_id")
    if qid is None: continue
    ch = {L:str(g(r,f"answer_{L}") or "").strip() for L in "abcd"}
    if not any(ch.values()): continue
    cor = (str(g(r,"correct_answer") or "").strip().lower()+" ")[0]
    if cor not in "abcd": continue
    data.append((ch, cor))
N=len(data)

# choices-only features per letter -> we predict the letter
def feats(ch):
    f={}
    wl={L:words(ch[L]) for L in "abcd"}
    mx=max(wl.values()) or 1
    for L in "abcd":
        f[L]=[
            wl[L]/mx,                          # relative length
            len(QUAL.findall(ch[L])),          # qualifier count
            len(ABS.findall(ch[L])),           # absolute-word count
            1.0 if wl[L]==max(wl.values()) else 0.0,  # is-longest
            "abcd".index(L)/3,                 # position
            1.0 if re.search(r"\bguilty\b",ch[L],re.I) else 0.0,
            1.0 if re.search(r"\b(admissible|suppress|valid|reasonable)\b",ch[L],re.I) else 0.0,
        ]
    return f

try:
    from sklearn.linear_model import LogisticRegression
    import numpy as np
    # Build per-choice rows: features -> is this the correct letter (1/0); at predict
    # time pick letter with max P(correct). 5-fold by question.
    X=[]; y=[]; groups=[]
    for qi,(ch,cor) in enumerate(data):
        ff=feats(ch)
        for L in "abcd":
            X.append(ff[L]); y.append(1 if L==cor else 0); groups.append(qi)
    X=np.array(X); y=np.array(y); groups=np.array(groups)
    folds=5; order=list(range(N))
    # deterministic fold split (no RNG)
    fold_of={q:(i%folds) for i,q in enumerate(order)}
    hit=0
    for fk in range(folds):
        tr=np.array([fold_of[q]!=fk for q in groups])
        te_q=[q for q in range(N) if fold_of[q]==fk]
        clf=LogisticRegression(max_iter=1000,C=1.0)
        clf.fit(X[tr],y[tr])
        proba=clf.predict_proba(X)[:,1]
        for q in te_q:
            base=q*4
            scores={L:proba[base+i] for i,L in enumerate("abcd")}
            pred=max(scores,key=scores.get)
            if pred==data[q][1]: hit+=1
    print(f"Choices-only CV model (5-fold logistic) accuracy = {hit/N*100:.1f}%  (n={N})")
    clf=LogisticRegression(max_iter=1000).fit(X,y)
    names=["rel_len","qualifiers","absolutes","is_longest","position","has_guilty","has_remedy_word"]
    print("  learned weights:")
    for nme,w in sorted(zip(names,clf.coef_[0]),key=lambda t:-abs(t[1])):
        print(f"    {nme:16s} {w:+.3f}")
except ImportError:
    print("sklearn unavailable")

# Length-led stacked decoder
def longest(ch):
    wl={L:words(ch[L]) for L in "abcd"}; m=max(wl.values())
    cands=[L for L in "abcd" if wl[L]==m]; return cands[0] if len(cands)==1 else None
def position_c(ch): return "c"
hit=0
for ch,cor in data:
    pred=longest(ch) or position_c(ch)
    if pred==cor: hit+=1
print(f"\nLength-led decoder (longest else C) = {hit/N*100:.1f}%")

# Combine: longest among the top-2 longest, tie-break to C if C is one of them
hit=0
for ch,cor in data:
    wl={L:words(ch[L]) for L in "abcd"}
    top=sorted("abcd",key=lambda L:-wl[L])[:2]
    pred="c" if "c" in top else top[0]
    if pred==cor: hit+=1
print(f"Longest-or-C-within-top2 decoder = {hit/N*100:.1f}%")
