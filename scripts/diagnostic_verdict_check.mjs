import { readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function assertIncludes(file, needle, message) {
  const text = read(file);
  if (!text.includes(needle)) {
    throw new Error(`${message}\nMissing in ${file}: ${needle}`);
  }
}

assertIncludes(
  "src/funnel/types.ts",
  "correct: ChoiceId;",
  "Miss records must preserve the correct answer letter for diagnostic verdict review.",
);
assertIncludes(
  "src/funnel/types.ts",
  "correctText: string;",
  "Miss records must preserve the correct answer text for diagnostic verdict review.",
);
assertIncludes(
  "src/pages/Diagnostic.tsx",
  "correct: question.key",
  "Diagnostic finish must carry the qdata answer key into every miss record.",
);
assertIncludes(
  "src/pages/Diagnostic.tsx",
  "correctText: question.choices[question.key]",
  "Diagnostic finish must carry the qdata correct answer text into every miss record.",
);
assertIncludes(
  "src/components/RedZoneReveal.tsx",
  "const correctCount = totalQuestions - misses.length;",
  "Red-Zone verdict must compute and display the user's right-answer count.",
);
assertIncludes(
  "src/components/RedZoneReveal.tsx",
  "{correctCount} of {totalQuestions} correct",
  "Red-Zone verdict must render an explicit score denominator.",
);
assertIncludes(
  "src/components/RedZoneReveal.tsx",
  "Correct answer: {m.correct}",
  "Each wrong-answer card must render the correct answer letter.",
);
assertIncludes(
  "src/components/RedZoneReveal.tsx",
  "{m.correctText}",
  "Each wrong-answer card must render the correct answer text.",
);

console.log("diagnostic_verdict_check: all checks passed");
