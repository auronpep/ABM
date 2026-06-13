"""Term-level answer-choice signal: for each legal keyword, when it appears in a
choice, how often is that choice the KEY vs the TOP TRAP vs neutral? Gives the
founder concrete 'when you see this word in a choice' cues. Choices-only.
"""
from __future__ import annotations
import re, json
from pathlib import Path
from collections import defaultdict
import openpyxl

SRC = Path(r"C:\Users\JesusLovesMe\Documents\CrimL\Criminal LAw.xlsx")
OUT = Path(r"C:\ABM\work\criminal-law-pattern-analysis")
wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
ws = wb["Sheet1"]; rows=list(ws.iter_rows(min_row=1,values_only=True))
hdr=[str(c) for c in rows[0]]; idx={h:i for i,h in enumerate(hdr)}
def g(r,k): return r[idx[k]] if idx.get(k) is not None and idx[k]<len(r) else None

TERMS = ["guilty","not guilty","admissible","inadmissible","suppress","suppressed",
         "murder","manslaughter","voluntary manslaughter","involuntary","attempt",
         "conspiracy","solicitation","larceny","embezzlement","false pretenses",
         "robbery","burglary","arson","reasonable","unreasonable","valid","invalid",
         "warrant","probable cause","exigent","consent","custody","interrogation",
         "harmless","reverse","reversed","affirm","affirmed","dismiss","acquit",
         "self-defense","necessity","duress","insanity","intent","malice","specific intent",
         "always","never","cannot","must","only if","because","if","unless"]

stat=defaultdict(lambda:{"key":0,"trap":0,"present":0})
for r in rows[1:]:
    if g(r,"barmatrix_question_id") is None: continue
    ch={L:str(g(r,f"answer_{L}") or "").lower() for L in "abcd"}
    if not any(ch.values()): continue
    cor=(str(g(r,"correct_answer") or "").strip().lower()+" ")[0]
    trap=(str(g(r,"most_popular_wrong_answer") or "").strip().lower()+" ")[0]
    for t in TERMS:
        pat=re.compile(r"\b"+re.escape(t)+r"\b")
        for L in "abcd":
            if pat.search(ch[L]):
                stat[t]["present"]+=1
                if L==cor: stat[t]["key"]+=1
                elif L==trap: stat[t]["trap"]+=1

print(f"{'term':22s} {'n':>4} {'key%':>6} {'trap%':>6} {'lift':>6}")
print("-"*52)
rowsout=[]
for t in TERMS:
    s=stat[t]
    if s["present"]<12: continue
    keyp=s["key"]/s["present"]*100
    trapp=s["trap"]/s["present"]*100
    lift=keyp-trapp   # >0 = leans correct, <0 = leans trap
    rowsout.append((t,s["present"],keyp,trapp,lift))
for t,n,k,tr,l in sorted(rowsout,key=lambda x:-x[4]):
    flag = "  <- KEY-LEAN" if l>12 else ("  <- TRAP-LEAN" if l<-12 else "")
    print(f"{t:22s} {n:>4} {k:>5.1f}% {tr:>5.1f}% {l:>+5.1f}{flag}")

(OUT/"term_level_signal.json").write_text(json.dumps(
    [{"term":t,"n":n,"key_pct":k,"trap_pct":tr,"lift":l} for t,n,k,tr,l in
     sorted(rowsout,key=lambda x:-x[4])], indent=2))
print(f"\nNote: baseline if a term were neutral ~ key 25% / trap ~17% (since one key, ~one dominant trap per Q).")
