// Builds public/qdata/trap-index.json — a lightweight map of every bank
// question's wrong-choice trap molds, so the repair loop can assemble a
// (filter, mold)-scoped drill set without fetching all 81 question payloads.
// Runs as part of `npm run build`; reads only files already in public/qdata.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const qdataDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "qdata");

const entries = [];
for (const file of readdirSync(qdataDir).sort()) {
  if (!/^CQ\d+\.json$/.test(file)) continue;
  const q = JSON.parse(readFileSync(join(qdataDir, file), "utf8"));
  const molds = new Set();
  for (const [letter, signal] of Object.entries(q.choiceSignals ?? {})) {
    if (letter !== q.key && signal?.mold) molds.add(signal.mold);
  }
  entries.push({
    id: q.id,
    title: q.title,
    subject: q.subject,
    difficulty: q.difficulty ?? null,
    molds: [...molds].sort(),
  });
}

if (entries.length === 0) {
  console.error("build_trap_index: no CQ*.json files found — refusing to write an empty index");
  process.exit(1);
}

writeFileSync(join(qdataDir, "trap-index.json"), JSON.stringify(entries));
console.log(`build_trap_index: wrote trap-index.json (${entries.length} questions)`);
