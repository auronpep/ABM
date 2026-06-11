// Drift-control scan — funnel task QA-2 (handoff docs 00 + 03 §4).
// Fails the build on any blocked string or forbidden stat phrasing in
// marketing surfaces. Question content (qdata) is legal subject matter and
// is exempt — a contracts question may lawfully discuss a "discount."
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import process from "node:process";

const BLOCKED = [
  "$899",
  "discount",
  "coupon",
  "early bird",
  "save $100",
  "first 250",
  "guaranteed pass",
  "guaranteed score",
  "ncbe-approved",
  "state bar-approved",
  "official mbe prep",
  // forbidden stat phrasings (doc 03 §4)
  "of our students",
  "our focus group",
];

const SCAN_ROOTS = ["src", "index.html"];
const PUBLIC_HTML = "public"; // *.html marketing surfaces only — qdata exempt
const EXTS = new Set([".ts", ".tsx", ".css", ".html", ".json", ".md", ".mjs"]);

function* walk(path) {
  const st = statSync(path);
  if (st.isFile()) {
    yield path;
    return;
  }
  for (const entry of readdirSync(path)) {
    if (entry === "node_modules" || entry === "qdata") continue;
    yield* walk(join(path, entry));
  }
}

const hits = [];
const targets = [...SCAN_ROOTS, PUBLIC_HTML];
for (const root of targets) {
  for (const file of walk(root)) {
    if (!EXTS.has(extname(file))) continue;
    const text = readFileSync(file, "utf-8");
    const lower = text.toLowerCase();
    for (const term of BLOCKED) {
      let pos = lower.indexOf(term);
      while (pos !== -1) {
        const line = text.slice(0, pos).split("\n").length;
        hits.push(`${file}:${line}: blocked string "${term}"`);
        pos = lower.indexOf(term, pos + 1);
      }
    }
  }
}

if (hits.length > 0) {
  console.error("DRIFT SCAN FAILED:");
  for (const hit of hits) console.error("  " + hit);
  process.exit(1);
}
console.log("drift scan: clean");
