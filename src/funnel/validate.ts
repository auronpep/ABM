// Contract validator — funnel task A-1. Rejects any question that does not
// conform to the doc 03 renderer contract. Used by the build-time contract
// check and by components in dev.

import type { ChoiceId, FunnelQuestion } from "./types.ts";

const CHOICE_IDS: ChoiceId[] = ["A", "B", "C", "D"];
const INSTINCTS = ["JUSTICE", "SUSPICION", "FAIRNESS"];
const FILTERS = ["NOT_TRUE", "NOT_RESPONSIVE"];
const PROVENANCE = ["inherited_original", "predicted"];

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function validateQuestion(input: unknown): ValidationResult {
  const errors: string[] = [];
  const fail = (msg: string) => errors.push(msg);

  if (typeof input !== "object" || input === null) {
    return { ok: false, errors: ["question is not an object"] };
  }
  const q = input as Record<string, unknown>;
  const label = isNonEmptyString(q.qid) ? (q.qid as string) : "<no qid>";

  if (!isNonEmptyString(q.qid)) fail(`${label}: missing qid`);
  if (!isNonEmptyString(q.title)) fail(`${label}: missing title`);
  if (!isNonEmptyString(q.subject)) fail(`${label}: missing subject`);
  if (!Array.isArray(q.stem) || q.stem.length === 0 || !q.stem.every(isNonEmptyString)) {
    fail(`${label}: stem must be a non-empty array of paragraphs`);
  }
  if (!isNonEmptyString(q.call)) fail(`${label}: missing call`);

  if (!Array.isArray(q.choices) || q.choices.length !== 4) {
    fail(`${label}: choices must be an array of exactly 4`);
  } else {
    const seen = new Set<string>();
    for (const c of q.choices as Array<Record<string, unknown>>) {
      if (!CHOICE_IDS.includes(c.id as ChoiceId)) fail(`${label}: choice id ${String(c.id)} invalid`);
      else if (seen.has(c.id as string)) fail(`${label}: duplicate choice id ${String(c.id)}`);
      seen.add(c.id as string);
      if (!isNonEmptyString(c.text)) fail(`${label}: choice ${String(c.id)} missing text`);
      if (c.pct !== null && (typeof c.pct !== "number" || c.pct < 0 || c.pct > 100)) {
        fail(`${label}: choice ${String(c.id)} pct must be null or 0-100`);
      }
      if (!PROVENANCE.includes(c.provenance as string)) {
        fail(`${label}: choice ${String(c.id)} provenance must be one of ${PROVENANCE.join("/")}`);
      }
    }
  }

  if (!CHOICE_IDS.includes(q.key as ChoiceId)) fail(`${label}: key must be A-D`);

  const trap = q.trap as Record<string, unknown> | undefined;
  if (typeof trap !== "object" || trap === null) {
    fail(`${label}: missing trap`);
  } else {
    if (!CHOICE_IDS.includes(trap.choice as ChoiceId)) fail(`${label}: trap.choice must be A-D`);
    if (trap.choice === q.key) fail(`${label}: trap.choice cannot equal key`);
    if (typeof trap.pct !== "number") fail(`${label}: trap.pct must be a number`);
    if (!isNonEmptyString(trap.name)) fail(`${label}: trap.name missing`);
    if (!INSTINCTS.includes(trap.instinct as string)) fail(`${label}: trap.instinct must be one of ${INSTINCTS.join("/")}`);
    if (!FILTERS.includes(trap.filter_broken as string)) fail(`${label}: trap.filter_broken must be one of ${FILTERS.join("/")}`);
    if (!isNonEmptyString(trap.mold)) fail(`${label}: trap.mold missing`);
  }

  const forensics = q.forensics as Record<string, unknown> | undefined;
  if (typeof forensics !== "object" || forensics === null) {
    fail(`${label}: missing forensics`);
  } else {
    for (const id of CHOICE_IDS) {
      if (!isNonEmptyString(forensics[id])) fail(`${label}: forensics.${id} missing`);
    }
  }

  if (!isNonEmptyString(q.silver_key_move)) fail(`${label}: missing silver_key_move`);
  if (!isNonEmptyString(q.review_truth)) fail(`${label}: missing review_truth`);
  if (!Array.isArray(q.drill_seeds)) fail(`${label}: drill_seeds must be an array`);
  if (!Array.isArray(q.crossovers)) fail(`${label}: crossovers must be an array`);

  return { ok: errors.length === 0, errors };
}

export function assertValidQuestions(input: unknown): FunnelQuestion[] {
  if (!Array.isArray(input)) throw new Error("seed data must be an array");
  const all: string[] = [];
  for (const item of input) {
    const r = validateQuestion(item);
    if (!r.ok) all.push(...r.errors);
  }
  if (all.length > 0) {
    throw new Error(`funnel seed contract violations:\n${all.join("\n")}`);
  }
  return input as FunnelQuestion[];
}
