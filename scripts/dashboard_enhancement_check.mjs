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

function assertNotIncludes(file, needle, message) {
  const text = read(file);
  if (text.includes(needle)) {
    throw new Error(`${message}\nUnexpected in ${file}: ${needle}`);
  }
}

assertIncludes("src/types.ts", '| "dashboard"', "Dashboard must be a first-class route type.");
assertIncludes("src/App.tsx", '"dashboard"', "Dashboard route must be registered in the SPA router.");
assertIncludes(
  "src/App.tsx",
  'route === "dashboard" && <Welcome navigate={navigate} mode="dashboard" />',
  "Dashboard route must render the dashboard-mode Welcome spine.",
);
assertIncludes(
  "src/components/Nav.tsx",
  'navigate("dashboard")',
  "Signed-in nav dashboard CTA must open the canonical dashboard route.",
);
assertIncludes(
  "src/content/dashboard.ts",
  "export const DASHBOARD_COPY",
  "Dashboard labels and explanations must live in a content module.",
);
assertIncludes(
  "src/pages/Welcome.tsx",
  "DASHBOARD_COPY",
  "Welcome/dashboard spine must consume stable dashboard copy.",
);
assertIncludes(
  "src/pages/Welcome.tsx",
  "groupZoneStatuses",
  "Red-zone map must be grouped by dashboard status.",
);
assertIncludes(
  "src/pages/Welcome.tsx",
  "TodayCard",
  "Dashboard must include a compact Today card.",
);
assertIncludes(
  "src/pages/Welcome.tsx",
  "ProgressMirror",
  "Dashboard must include read-only local progress mirrors.",
);
assertNotIncludes(
  "src/pages/Practice.tsx",
  "could not load ({outlineError})",
  "Practice library must not expose raw fetch errors in the user-facing fallback.",
);

console.log("dashboard_enhancement_check: all checks passed");
