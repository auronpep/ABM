"""Build drill data for the BarMatrix site from C:\\CCG\\Finished\\CQ*.md.

Emits public/qdata/index.json plus one public/qdata/<CQID>.json per question.
Pick-rate percentages are used only to compute the dominant trap letter and are
never written to the public payloads (VISION_LOCK: no public pick rates).

Run: PYTHONUTF8=1 uv run --with pyyaml --no-project python scripts/build_qdata.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import yaml

SOURCE_DIR = Path("C:/CCG/Finished")
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "qdata"

SUBJECT_LABELS = {
    "CRIMINAL": "Criminal Law & Procedure",
    "EVIDENCE": "Evidence",
    "CONTRACTS": "Contracts",
    "TORTS": "Torts",
    "PROPERTY": "Real Property",
    "REAL": "Real Property",
    "CIVIL": "Civil Procedure",
    "CIVPRO": "Civil Procedure",
    "CONSTITUTIONAL": "Constitutional Law",
    "CONLAW": "Constitutional Law",
    "CONTRACT": "Contracts",
}


def clean_md(text: str) -> str:
    """Strip markdown emphasis/code markers, keep paragraph structure."""
    text = re.sub(r"^>\s?", "", text, flags=re.MULTILINE)
    text = text.replace("**", "")
    text = re.sub(r"(?<!\w)\*(?!\s)([^*\n]+?)(?<!\s)\*(?!\w)", r"\1", text)
    text = text.replace("`", "")
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    return "\n\n".join(paragraphs)


def section(md: str, name: str) -> str | None:
    """Return the body of the first heading whose text contains `name`."""
    pattern = re.compile(
        r"^#{1,5}[^\n#]*" + re.escape(name) + r"[^\n]*\n(.*?)(?=^#{1,5}\s|\Z)",
        re.MULTILINE | re.DOTALL | re.IGNORECASE,
    )
    m = pattern.search(md)
    return m.group(1).strip() if m else None


def first_yaml_block(md: str) -> dict | None:
    fallback: dict | None = None
    for m in re.finditer(r"```yaml\s*\n(.*?)```", md, re.DOTALL):
        data = parse_yaml_candidate(m.group(1))
        if data is None:
            continue
        if not isinstance(data, dict):
            continue
        # Some files wrap everything under a question_yaml: key — flatten it.
        if "barmatrix_row" not in data and isinstance(data.get("question_yaml"), dict):
            merged = dict(data)
            merged.update(data["question_yaml"])
            data = merged
        if "barmatrix_row" not in data and isinstance(data.get("question_yaml_v2"), dict):
            merged = dict(data)
            merged.update(data["question_yaml_v2"])
            data = merged
        if "barmatrix_row" in data:
            return data
        if fallback is None:
            fallback = data
    return fallback


def sanitize_yaml(source: str) -> str:
    out: list[str] = []
    for line in source.splitlines():
        trailing_comma = re.match(r'^(\s*(?:- |[A-Za-z_][A-Za-z0-9_]*: )".*"),\s*$', line)
        if trailing_comma:
            out.append(trailing_comma.group(1))
            continue
        after_quote = re.match(r'^(\s*(?:- )?[A-Za-z_][A-Za-z0-9_]*:)\s+"(.*)"(\s+\S.*)$', line)
        if after_quote:
            value = f"{after_quote.group(2)}{after_quote.group(3)}"
            out.append(f'{after_quote.group(1)} "{value.replace(chr(92), chr(92) + chr(92)).replace(chr(34), chr(92) + chr(34))}"')
            continue
        match = re.match(r"^(\s*(?:- )?[A-Za-z_][A-Za-z0-9_]*:)\s+([^'\"|>#\n].*: .*)$", line)
        if not match:
            out.append(line)
            continue
        value = match.group(2).strip()
        if re.fullmatch(r"[\d.]+", value):
            out.append(line)
        else:
            out.append(f'{match.group(1)} "{value.replace(chr(92), chr(92) + chr(92)).replace(chr(34), chr(92) + chr(34))}"')
    return "\n".join(out)


def repair_orphan_children(source: str) -> str:
    lines = source.splitlines()
    out: list[str] = []
    for i, line in enumerate(lines):
        match = re.match(r"^(\s*)([A-Za-z_][A-Za-z0-9_]*):\s+(\S.*)$", line)
        next_line = lines[i + 1] if i + 1 < len(lines) else ""
        indent = len(match.group(1)) if match else 0
        next_indent = len(re.match(r"^\s*", next_line).group(0)) if next_line else 0
        if match and next_line.strip() and next_indent > indent and re.match(r"^\s*[A-Za-z_-]", next_line) and ":" in next_line:
            out.append(f"{match.group(1)}{match.group(2)}:")
            out.append(f"{match.group(1)}  _value: {match.group(3)}")
        else:
            out.append(line)
    return "\n".join(out)


def parse_yaml_candidate(source: str) -> dict | None:
    attempts = [
        source,
        sanitize_yaml(source),
        repair_orphan_children(sanitize_yaml(source)),
    ]
    last_error: yaml.YAMLError | None = None
    for attempt in attempts:
        try:
            data = yaml.safe_load(attempt)
        except yaml.YAMLError as exc:
            last_error = exc
            continue
        return data if isinstance(data, dict) else None
    if last_error:
        print(f"  YAML parse failure: {last_error}", file=sys.stderr)
    return None


PCT_KEYS = re.compile(r"selection_percentages|pick_rates|percentages", re.IGNORECASE)


def wrong_choice_percentages(row: dict, key: str) -> dict[str, float]:
    """Find A–D pick percentages under whatever key name this file used."""
    for name, value in row.items():
        if not PCT_KEYS.search(str(name)) or not isinstance(value, dict):
            continue
        out: dict[str, float] = {}
        for k, v in value.items():
            m = re.match(r"^([A-D])(_|$)", str(k))
            if m and m.group(1) != key and isinstance(v, (int, float)):
                out[m.group(1)] = float(v)
        if out:
            return out
    return {}


PICKRATE_PAREN = re.compile(r"\s*\(\*?[^()]*pick rate[^()]*\*?\)\s*", re.IGNORECASE)


def md_choices(md: str) -> dict[str, str]:
    """Fallback: parse choices from the 'Final answer choices' section."""
    body = section(md, "answer choices")
    if not body:
        return {}
    out: dict[str, str] = {}
    for m in re.finditer(
        r"\*\*\s*([A-D])[.):]?\s*\*\*[.):]?\s*(.+?)(?=\n\s*[*\-]\s*\*\*\s*[A-D][.):]?\s*\*\*|\Z)",
        body,
        re.DOTALL,
    ):
        text = clean_md(PICKRATE_PAREN.sub(" ", m.group(2))).strip()
        if text and m.group(1) not in out:
            out[m.group(1)] = text
    return out


def md_key(md: str) -> str:
    body = section(md, "Correct answer")
    if body:
        m = re.search(r"\b([A-D])\b", body)
        if m:
            return m.group(1)
    return ""


def parse_wrong_explanations(body: str) -> dict[str, str]:
    out: dict[str, str] = {}
    if not body:
        return out
    parts = re.split(
        r"\*\*\s*(?:Choice\s+)?([A-D])[\s.):]*(?:is\s+)?(?:incorrect|wrong)\.?\s*\*\*",
        body,
        flags=re.IGNORECASE,
    )
    # parts: [pre, letter, text, letter, text, ...]
    for i in range(1, len(parts) - 1, 2):
        letter = parts[i]
        text = clean_md(parts[i + 1]).strip(" .\n")
        text = re.sub(r"^\s*[*\-]\s*", "", text)
        if text:
            out[letter] = text + ("" if text.endswith(".") else ".")
    return out


def parse_c3_walkthrough(body: str) -> list[dict[str, str]]:
    """Split the elimination walkthrough into labeled steps (CUT B, CLASH C vs D, ...)."""
    if not body:
        return []
    lead = re.compile(r"^\s*(?:[*\-]\s*)?\*\*([^*\n]{2,60}?)[.:]?\*\*[:.]?\s*", re.MULTILINE)
    matches = list(lead.finditer(body))
    steps: list[dict[str, str]] = []
    for i, m in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        text = clean_md(body[m.end() : end])
        if text:
            steps.append({"label": m.group(1).strip(), "text": text})
    if not steps:
        text = clean_md(body)
        if text:
            steps.append({"label": "Walkthrough", "text": text})
    return steps


def parse_recovery(body: str) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    if not body:
        return out
    for m in re.finditer(
        r"\*\*If you chose (?:Choice\s*)?([A-D])[^*]*\*\*:?\s*(.*?)(?=\n\s*[*\-]\s*\*\*If you chose|\Z)",
        body,
        re.DOTALL,
    ):
        out.append({"choice": m.group(1), "text": clean_md(m.group(2))})
    return out


def title_from_slug(qid: str, slug: str) -> str:
    m = re.match(r"^\d+[_\-](.+)$", str(slug or ""))
    if m:
        words = re.split(r"[_\-]+", m.group(1))
        return " ".join(w.capitalize() for w in words if w)
    return f"Question {qid}"


def subject_label(raw: str) -> str:
    token = re.split(r"[^A-Za-z]", str(raw or "").strip().upper())[0]
    return SUBJECT_LABELS.get(token, str(raw or "Mixed").title())


def keys_list(items: object) -> list[dict]:
    out = []
    if isinstance(items, list):
        for k in items:
            if isinstance(k, dict):
                out.append(
                    {
                        "id": k.get("id"),
                        "statement": k.get("statement"),
                        "trigger": k.get("trigger"),
                        "unlocks": k.get("unlocks") or k.get("navigates"),
                        "authority": k.get("authority"),
                    }
                )
    return out


# --- Lean frontmatter format (CQ218xx onward) -------------------------------
# These files carry a leading `---` YAML frontmatter block plus numbered,
# bold-titled sections ("1. **Final question**", "5. **Wrong-answer
# explanations**", ...). They lack the rich barmatrix_row machinery (gold keys,
# choice_walkthroughs/molds, C3 routing, remediation), so those fields come out
# empty — but the core drill (stem, call, choices, key, dominant trap, right and
# wrong explanations) is fully present.

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)


def frontmatter(md: str) -> dict | None:
    m = FRONTMATTER_RE.match(md)
    if not m:
        return None
    try:
        data = yaml.safe_load(m.group(1))
    except yaml.YAMLError:
        return None
    return data if isinstance(data, dict) else None


def numbered_section(md: str, name: str) -> str | None:
    """Body of the first numbered header whose text contains `name`.

    Handles the heading styles seen in the lean files:
    `## 2. Answer Choices A-D`, `2. **Answer choices A-D**`, and
    `**2. Answer Choices**`.
    """
    header = r"(?:#{1,5}\s*)?\*{0,2}\d+\.\s*\*{0,2}"
    pattern = re.compile(
        r"^" + header + r"[^*\n#]*" + re.escape(name) + r"[^*\n#]*\*{0,2}\s*$\n"
        r"(.*?)(?=^" + header + r"|\Z)",
        re.MULTILINE | re.DOTALL | re.IGNORECASE,
    )
    m = pattern.search(md)
    return m.group(1).strip() if m else None


def fm_lettered(body: str) -> dict[str, str]:
    """Parse `A. text` / `B. text` blocks (choices or wrong explanations)."""
    out: dict[str, str] = {}
    body = re.split(r"\*{0,2}\s*Correct answer", body, maxsplit=1)[0]
    for m in re.finditer(
        r"(?m)^\s*\*{0,2}([A-D])[.)]\*{0,2}\s+(.+?)(?=\n\s*\*{0,2}[A-D][.)]|\Z)",
        body,
        re.DOTALL,
    ):
        text = clean_md(PICKRATE_PAREN.sub(" ", m.group(2))).strip()
        if text and m.group(1) not in out:
            out[m.group(1)] = text
    return out


def build_one_frontmatter(md: str, cqid: str) -> tuple[dict, dict] | None:
    fm = frontmatter(md)
    if not fm or "subject" not in fm:
        return None

    choices_body = numbered_section(md, "answer choices")
    choices = fm_lettered(choices_body) if choices_body else {}
    key = ""
    if choices_body:
        m = re.search(r"Correct answer[:\s]*\*?\*?\s*([A-D])", choices_body, re.IGNORECASE)
        if m:
            key = m.group(1).upper()
    if not key:
        key = str(fm.get("key") or "").strip().upper()[:1]
    if len(choices) < 4 or key not in choices:
        print(f"  SKIP {cqid}: frontmatter missing choices/key", file=sys.stderr)
        return None

    q_body = numbered_section(md, "final question")
    if not q_body:
        print(f"  SKIP {cqid}: frontmatter no stem", file=sys.stderr)
        return None
    # Drop horizontal-rule separators (---, ***, ___) so they are not mistaken
    # for the call or padded into the stem.
    paras = [
        p.strip()
        for p in re.split(r"\n\s*\n", q_body)
        if p.strip() and not re.fullmatch(r"[-*_]{3,}", p.strip())
    ]
    call = clean_md(paras[-1]) if len(paras) > 1 else None
    stem = clean_md("\n\n".join(paras[:-1]) if len(paras) > 1 else (paras[0] if paras else ""))
    if not stem:
        print(f"  SKIP {cqid}: frontmatter empty stem", file=sys.stderr)
        return None

    right = numbered_section(md, "right-answer explanation")
    wrong_body = numbered_section(md, "wrong-answer explanation")
    wrong = {k: v for k, v in fm_lettered(wrong_body or "").items() if k != key}

    dominant = str(fm.get("dominant_trap") or "").strip().upper()[:1] or None
    if dominant == key:
        dominant = None

    qid = str(fm.get("qid") or fm.get("transformed_from") or cqid)
    title = title_from_slug(cqid.lstrip("CQ"), qid)
    subj = subject_label(fm.get("subject"))

    full = {
        "id": cqid,
        "title": title,
        "subject": subj,
        "topic": fm.get("topic"),
        "subtopic": fm.get("subtopic"),
        "difficulty": None,
        "tension": None,
        "stem": stem,
        "call": call,
        "choices": choices,
        "key": key,
        "dominantTrap": dominant,
        "rightExplanation": clean_md(right) if right else None,
        "wrongExplanations": wrong,
        "c3": [],
        "studentScript": None,
        "recoveryPaths": [],
        "choiceSignals": {},
        "goldKeys": [],
        "silverKeys": [],
        "remediation": None,
    }
    index_entry = {
        "id": cqid,
        "title": title,
        "subject": subj,
        "topic": fm.get("topic"),
        "subtopic": fm.get("subtopic"),
        "difficulty": None,
    }
    return full, index_entry


def build_one(path: Path) -> tuple[dict, dict] | None:
    md = path.read_text(encoding="utf-8", errors="replace")
    cqid = path.stem
    data = first_yaml_block(md)
    if not data or "barmatrix_row" not in data:
        lean = build_one_frontmatter(md, cqid)
        if lean is not None:
            return lean
        print(f"  SKIP {cqid}: no usable YAML", file=sys.stderr)
        return None
    row = data["barmatrix_row"]
    raw_choices = row.get("choices") or row.get("answer_choices") or row.get("transformed_choices") or row.get("final_choices")
    if isinstance(raw_choices, dict):
        choices = {}
        for k, v in raw_choices.items():
            raw_text = v.get("text") if isinstance(v, dict) else v
            choices[str(k)] = clean_md(PICKRATE_PAREN.sub(" ", str(raw_text))).strip()
    else:
        choices = {}
    if len(choices) < 4:
        choices = md_choices(md) or choices
    key = str(row.get("official_key") or "").strip().upper()[:1]
    if key not in choices:
        key = md_key(md)
    if not choices or key not in choices:
        print(f"  SKIP {cqid}: missing choices/key", file=sys.stderr)
        return None

    wrong_pcts = wrong_choice_percentages(row, key)
    dominant = max(wrong_pcts, key=wrong_pcts.get) if wrong_pcts else None

    stem_body = section(md, "Final Question")
    stem = clean_md(stem_body) if stem_body else clean_md(str(row.get("stem") or ""))
    if not stem:
        print(f"  SKIP {cqid}: no stem", file=sys.stderr)
        return None

    right = section(md, "Right-Answer Explanation")
    wrong = section(md, "Wrong-Answer Explanations")
    walkthrough = section(md, "C3 Elimination Walkthrough")
    script = section(md, "Final Student Script")
    if not script:
        cso = data.get("case_study_output")
        if isinstance(cso, dict):
            for k, v in cso.items():
                if "script" in str(k).lower() and isinstance(v, str) and v.strip():
                    script = v
                    break
    recovery = section(md, "Wrong-Answer Recovery Paths")

    routing = data.get("c3_routing") or {}
    remediation = data.get("remediation") or {}
    signals: dict[str, dict] = {}
    for letter, cw in (data.get("choice_walkthroughs") or {}).items():
        if isinstance(cw, dict):
            signals[str(letter)] = {
                "signal": cw.get("c3_signal"),
                "lawyer": cw.get("lawyer_confirmation"),
                "mold": cw.get("mold_code"),
            }

    qid = str(row.get("question_id") or row.get("qid") or cqid)
    title = title_from_slug(cqid.lstrip("CQ"), qid)
    subj = subject_label(row.get("subject"))

    full = {
        "id": cqid,
        "title": title,
        "subject": subj,
        "topic": row.get("topic"),
        "subtopic": row.get("subtopic"),
        "difficulty": routing.get("difficulty"),
        "tension": (data.get("program_elements") or {}).get("tension"),
        "stem": stem,
        "call": row.get("call") or row.get("transformed_call"),
        "choices": choices,
        "key": key,
        "dominantTrap": dominant,
        "rightExplanation": clean_md(right) if right else None,
        "wrongExplanations": parse_wrong_explanations(wrong or ""),
        "c3": parse_c3_walkthrough(walkthrough or ""),
        "studentScript": clean_md(script) if script else None,
        "recoveryPaths": parse_recovery(recovery or ""),
        "choiceSignals": signals,
        "goldKeys": keys_list(data.get("gold_keys")),
        "silverKeys": keys_list(data.get("silver_keys")),
        "remediation": {
            "title": remediation.get("title"),
            "signal": remediation.get("signal"),
            "studentMove": remediation.get("student_move"),
            "tinyRule": remediation.get("tiny_rule"),
            "trap": remediation.get("trap"),
        }
        if remediation
        else None,
    }
    index_entry = {
        "id": cqid,
        "title": title,
        "subject": subj,
        "topic": row.get("topic"),
        "subtopic": row.get("subtopic"),
        "difficulty": routing.get("difficulty"),
    }
    return full, index_entry


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    files = sorted(SOURCE_DIR.glob("CQ*.md"))
    index = []
    failures = 0
    for path in files:
        try:
            result = build_one(path)
        except Exception as exc:  # noqa: BLE001 - report and continue per file
            print(f"  ERROR {path.stem}: {exc}", file=sys.stderr)
            failures += 1
            continue
        if result is None:
            failures += 1
            continue
        full, entry = result
        (OUT_DIR / f"{full['id']}.json").write_text(
            json.dumps(full, ensure_ascii=False, indent=1), encoding="utf-8"
        )
        index.append(entry)
    index.sort(key=lambda e: (e["subject"], e["id"]))
    (OUT_DIR / "index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print(f"Built {len(index)} questions, {failures} skipped/failed, out={OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
