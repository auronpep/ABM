"""Review Ledger — P2 Phase 1 (sale-one handoff).

Scans the transformed-question corpus and emits one row per question:
exactly which questions are attorney-approved and contract-valid.
`unknown` is treated as `pending`; nothing ships on inference.

Run:  PYTHONUTF8=1 uv run --no-project python scripts/review_ledger.py
Outputs: work/review_ledger.csv + work/review_ledger_summary.json
Founder workflow: edit work/review_decisions.csv (qid,decision,date);
decisions merge into the ledger on every run.

Read-only over the corpus. No database writes anywhere in this script.
"""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path

CORPUS_ROOTS = [Path(r"C:\CCG\Finished")]
SEED_FILE = Path(__file__).resolve().parent.parent / "src" / "funnel" / "questions.seed.json"
WORK_DIR = Path(__file__).resolve().parent.parent / "work"
DECISIONS_FILE = WORK_DIR / "review_decisions.csv"

FIELDNAMES = [
    "qid",
    "transformed_from",
    "subject",
    "topic",
    "subtopic",
    "source_path",
    "pass2_complete",
    "contract_valid",
    "pick_rate_provenance_ok",
    "christian_flavor_clean",
    "attorney_status",
    "review_evidence_path",
    "notes",
]


def yaml_scalar(block: str, key: str) -> str | None:
    """Extract a simple `key: value` scalar from raw YAML text."""
    m = re.search(rf'^\s*{re.escape(key)}:\s*"?([^"\n]+?)"?\s*$', block, re.MULTILINE)
    return m.group(1).strip() if m else None


def parse_corpus_file(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8", errors="replace")
    row = {name: "" for name in FIELDNAMES}
    row["source_path"] = str(path)
    notes: list[str] = []

    yaml_match = re.search(r"```yaml\n(.*?)```", text, re.DOTALL)
    yaml_block = yaml_match.group(1) if yaml_match else ""
    if not yaml_match:
        notes.append("no yaml block")

    row["qid"] = yaml_scalar(yaml_block, "question_id") or path.stem
    row["transformed_from"] = yaml_scalar(yaml_block, "transformed_from") or ""
    if not row["transformed_from"]:
        m = re.search(r"transformed_from[\"':\s]+(\d+)", text)
        row["transformed_from"] = m.group(1) if m else ""
    row["subject"] = yaml_scalar(yaml_block, "subject") or ""
    row["topic"] = yaml_scalar(yaml_block, "topic") or ""
    row["subtopic"] = yaml_scalar(yaml_block, "subtopic") or ""

    # PASS-2 completeness: the five output blocks (doc: yaml + case study + 3 json)
    has_yaml = bool(yaml_match)
    has_case_study = bool(re.search(r"choice_by_choice_walkthrough|choice-by-choice", text, re.IGNORECASE))
    has_c3_annotation = "c3_annotation" in text
    has_program_elements = "program_elements" in text
    has_program_intelligence = "program_intelligence" in text
    blocks = [has_yaml, has_case_study, has_c3_annotation, has_program_elements, has_program_intelligence]
    row["pass2_complete"] = "true" if all(blocks) else "false"
    if not all(blocks):
        missing = [
            name
            for name, ok in zip(
                ["yaml", "case_study", "c3_annotation", "program_elements", "program_intelligence"], blocks
            )
            if not ok
        ]
        notes.append("missing blocks: " + "+".join(missing))

    # Contract validity (doc 03 renderer contract, structural approximation):
    # stem, call, four choices, official key, and trap metadata present.
    has_stem = yaml_scalar(yaml_block, "stem") is not None or "stem:" in yaml_block
    has_call = yaml_scalar(yaml_block, "call") is not None
    has_key = yaml_scalar(yaml_block, "official_key") is not None
    choice_count = len(re.findall(r"^\s{4}([ABCD]):\s", yaml_block, re.MULTILINE))
    walkthrough_filters = len(re.findall(r"filter_broken", yaml_block))
    molds = len(re.findall(r"mold_code", yaml_block))
    contract_ok = has_stem and has_call and has_key and choice_count >= 4 and walkthrough_filters >= 3 and molds >= 3
    row["contract_valid"] = "true" if contract_ok else "false"
    if not contract_ok:
        notes.append(
            f"contract gaps: stem={has_stem} call={has_call} key={has_key} "
            f"choices={choice_count} filters={walkthrough_filters} molds={molds}"
        )

    provenance = yaml_scalar(yaml_block, "provenance")
    row["pick_rate_provenance_ok"] = "true" if provenance else "false"
    if not provenance:
        notes.append("no pick-rate provenance field")

    qc = re.search(r"quality_control:(.*?)(?:\n\w|\Z)", yaml_block, re.DOTALL)
    flavor = ""
    if qc:
        flavor_m = re.search(r"(christian|flavor|names[_ ]and[_ ]setting)[^\n]*:\s*(\S+)", qc.group(1), re.IGNORECASE)
        flavor = flavor_m.group(2).strip('"') if flavor_m else ""
    row["christian_flavor_clean"] = flavor or "unverified"

    row["attorney_status"] = "unknown"
    row["notes"] = "; ".join(notes)
    return row


def seed_rows() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    if not SEED_FILE.exists():
        return rows
    for q in json.loads(SEED_FILE.read_text(encoding="utf-8")):
        row = {name: "" for name in FIELDNAMES}
        row["qid"] = q["qid"]
        row["transformed_from"] = q["qid"].replace("Q-", "")
        row["subject"] = q["subject"]
        row["source_path"] = str(SEED_FILE)
        row["pass2_complete"] = "n/a (funnel seed, doc 03 contract)"
        row["contract_valid"] = "true"
        row["pick_rate_provenance_ok"] = "true"
        row["christian_flavor_clean"] = "unverified"
        row["attorney_status"] = "unknown"
        row["notes"] = "funnel mini-diagnostic seed — founder gate L-2 applies before public deploy"
        rows.append(row)
    return rows


def load_decisions() -> dict[str, tuple[str, str]]:
    decisions: dict[str, tuple[str, str]] = {}
    if not DECISIONS_FILE.exists():
        return decisions
    with DECISIONS_FILE.open(encoding="utf-8", newline="") as fh:
        for rec in csv.DictReader(fh):
            qid = (rec.get("qid") or "").strip()
            decision = (rec.get("decision") or "").strip().lower()
            date = (rec.get("date") or "").strip()
            if qid and decision in {"approved", "rejected", "pending"}:
                decisions[qid] = (decision, date)
    return decisions


def main() -> None:
    WORK_DIR.mkdir(exist_ok=True)
    rows: list[dict[str, str]] = []
    parse_failures: list[str] = []

    for root in CORPUS_ROOTS:
        if not root.exists():
            parse_failures.append(f"root missing: {root}")
            continue
        for path in sorted(root.glob("*.md")):
            try:
                rows.append(parse_corpus_file(path))
            except Exception as exc:  # noqa: BLE001 — parse failures are listed, not dropped
                parse_failures.append(f"{path}: {exc}")

    rows.extend(seed_rows())

    decisions = load_decisions()
    for row in rows:
        decision = decisions.get(row["qid"])
        if decision:
            row["attorney_status"] = decision[0]
            row["review_evidence_path"] = f"work/review_decisions.csv ({decision[1]})"

    ledger_path = WORK_DIR / "review_ledger.csv"
    with ledger_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)

    # Founder summary: counts by subject × attorney_status (unknown counts as pending).
    summary: dict[str, dict[str, int]] = {}
    gaps: list[str] = []
    for row in rows:
        status = row["attorney_status"]
        effective = "pending" if status == "unknown" else status
        subject = row["subject"] or "(unknown subject)"
        summary.setdefault(subject, {})
        summary[subject][effective] = summary[subject].get(effective, 0) + 1
        if row["contract_valid"] != "true" or row["pass2_complete"] == "false":
            gaps.append(f"{row['qid']}: {row['notes']}")

    shippable = sum(
        1 for row in rows if row["attorney_status"] == "approved" and row["contract_valid"] == "true"
    )
    summary_payload = {
        "total_questions": len(rows),
        "shippable_now (approved AND contract_valid)": shippable,
        "by_subject_x_status (unknown counted as pending)": summary,
        "gap_list": gaps,
        "parse_failures": parse_failures,
        "note": "Nothing ships on inference. Attorney sign-off is the founder's act; this ledger only records and routes it.",
    }
    summary_path = WORK_DIR / "review_ledger_summary.json"
    summary_path.write_text(json.dumps(summary_payload, indent=2, ensure_ascii=False), encoding="utf-8")

    if not DECISIONS_FILE.exists():
        DECISIONS_FILE.write_text("qid,decision,date\n", encoding="utf-8")

    print(f"ledger: {len(rows)} rows -> {ledger_path}")
    print(f"shippable now (approved + contract_valid): {shippable}")
    print(f"gaps: {len(gaps)} · parse failures: {len(parse_failures)}")
    print(f"summary -> {summary_path}")


if __name__ == "__main__":
    main()
