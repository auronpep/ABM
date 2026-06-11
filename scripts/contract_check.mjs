// Contract + stat-provenance checks — funnel tasks A-1 and QA-4.
// 1. Every seed question passes the doc 03 renderer contract; a question
//    missing trap.filter_broken is rejected (negative case asserted).
// 2. Any rendered pick-rate stat carries the "tested form" qualifier
//    (doc 03 §4 — provenance-honest wording).
// 3. Every curated diagnostic qid has a question file in public/qdata.
import { readFileSync, existsSync } from "node:fs";
import process from "node:process";

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error("  FAIL: " + msg);
};

// — 1. seed contract (mirror of src/funnel/validate.ts, runnable without a TS toolchain)
const seeds = JSON.parse(readFileSync("src/funnel/questions.seed.json", "utf-8"));
const CHOICES = ["A", "B", "C", "D"];
const INSTINCTS = ["JUSTICE", "SUSPICION", "FAIRNESS"];
const FILTERS = ["NOT_TRUE", "NOT_RESPONSIVE"];

function validate(q) {
  const errs = [];
  const need = (cond, msg) => {
    if (!cond) errs.push(`${q.qid ?? "<no qid>"}: ${msg}`);
  };
  need(typeof q.qid === "string" && q.qid, "missing qid");
  need(typeof q.title === "string" && q.title, "missing title");
  need(typeof q.subject === "string" && q.subject, "missing subject");
  need(Array.isArray(q.stem) && q.stem.length > 0, "missing stem");
  need(typeof q.call === "string" && q.call, "missing call");
  need(Array.isArray(q.choices) && q.choices.length === 4, "choices must be 4");
  for (const c of q.choices ?? []) {
    need(CHOICES.includes(c.id), `bad choice id ${c.id}`);
    need(typeof c.text === "string" && c.text, `choice ${c.id} missing text`);
    need(c.pct === null || (typeof c.pct === "number" && c.pct >= 0 && c.pct <= 100), `choice ${c.id} bad pct`);
    need(["inherited_original", "predicted"].includes(c.provenance), `choice ${c.id} bad provenance`);
  }
  need(CHOICES.includes(q.key), "bad key");
  need(q.trap && typeof q.trap === "object", "missing trap");
  if (q.trap) {
    need(CHOICES.includes(q.trap.choice), "trap.choice bad");
    need(q.trap.choice !== q.key, "trap.choice equals key");
    need(typeof q.trap.pct === "number", "trap.pct missing");
    need(typeof q.trap.name === "string" && q.trap.name, "trap.name missing");
    need(INSTINCTS.includes(q.trap.instinct), "trap.instinct bad");
    need(FILTERS.includes(q.trap.filter_broken), "trap.filter_broken bad");
    need(typeof q.trap.mold === "string" && q.trap.mold, "trap.mold missing");
  }
  need(q.forensics && CHOICES.every((id) => typeof q.forensics[id] === "string" && q.forensics[id]), "forensics incomplete");
  need(typeof q.silver_key_move === "string" && q.silver_key_move, "missing silver_key_move");
  need(typeof q.review_truth === "string" && q.review_truth, "missing review_truth");
  need(Array.isArray(q.drill_seeds), "drill_seeds must be array");
  need(Array.isArray(q.crossovers), "crossovers must be array");
  return errs;
}

if (!Array.isArray(seeds) || seeds.length !== 3) fail("seed file must contain exactly 3 questions");
for (const q of seeds) {
  for (const err of validate(q)) fail(err);
}

// Negative case: the validator must reject a question missing trap.filter_broken.
const broken = JSON.parse(JSON.stringify(seeds[0]));
delete broken.trap.filter_broken;
if (validate(broken).length === 0) fail("validator accepted a question missing trap.filter_broken");

// — 2. stat-provenance: rendered pick rates must carry the tested-form qualifier
const zones = readFileSync("src/funnel/zones.ts", "utf-8");
if (!/pickRatePhrase[\s\S]{0,200}tested form/.test(zones)) {
  fail("pickRatePhrase in zones.ts lost the \"tested form\" qualifier");
}
const mini = readFileSync("src/components/MiniDiagnostic.tsx", "utf-8");
if (mini.includes("FALL HERE") && !mini.includes("pickRatePhrase")) {
  fail("MiniDiagnostic renders a pick-rate stat without the pickRatePhrase qualifier");
}

// — 3. curated diagnostic files exist
const curated = readFileSync("src/content/curated-diagnostic.ts", "utf-8");
const ids = [...curated.matchAll(/"(CQ\d+)"/g)].map((m) => m[1]);
if (ids.length !== 18) fail(`expected 18 curated qids, found ${ids.length}`);
for (const id of ids) {
  if (!existsSync(`public/qdata/${id}.json`)) fail(`curated question missing: public/qdata/${id}.json`);
}

if (failures > 0) {
  console.error(`contract check: ${failures} failure(s)`);
  process.exit(1);
}
console.log(`contract check: clean (${seeds.length} seeds, ${ids.length} curated)`);
