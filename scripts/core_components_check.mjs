import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/lib/subjects.ts",
  "src/lib/api-client.ts",
  "src/lib/markdown.tsx",
  "src/lib/use-clerk-auth.ts",
  "src/lib/use-api.ts",
  "src/components/AuthGuard.tsx",
  "src/components/PageShell.tsx",
  "src/components/SectionRule.tsx",
  "src/components/SubjectBadge.tsx",
  "src/components/KeyCard.tsx",
  "src/components/EmptyState.tsx",
  "src/components/LoadingSpinner.tsx",
  "src/components/ErrorBoundary.tsx",
  "src/components/QuestionCard.tsx",
  "src/components/ForensicsPanel.tsx",
  "src/components/ConfidenceSelector.tsx",
  "src/components/TimerBar.tsx",
  "src/components/ProgressBar.tsx",
  "src/components/SubjectFilter.tsx",
  "src/components/TensionCard.tsx",
  "src/components/TrapCard.tsx",
  "src/components/TensionDetail.tsx",
  "src/components/TrapDetail.tsx",
  "src/components/DayPlanCard.tsx",
  "src/components/RepairTarget.tsx",
  "src/components/CoverageRing.tsx",
  "src/components/SubjectMasteryPanel.tsx",
  "src/components/PersonalMatrix.tsx",
  "src/components/RecentAttempts.tsx",
  "src/components/ZoneCard.tsx",
  "src/components/LessonCard.tsx",
  "src/components/DrillSetCard.tsx",
  "src/components/AccountStatus.tsx",
  "src/components/BillingPortalButton.tsx",
  "src/components/EnrollmentRecovery.tsx",
  "src/pages/Tensions.tsx",
  "src/pages/Traps.tsx",
  "src/pages/Mastery.tsx",
  "src/pages/Program.tsx",
  "src/pages/RedZones.tsx",
  "src/pages/Coach.tsx",
  "src/pages/Account.tsx",
];

const requiredRoutes = [
  "tensions",
  "tensions-detail",
  "traps",
  "traps-detail",
  "subjects",
  "subjects-detail",
  "about",
  "faq",
  "terms",
  "privacy",
  "refund",
  "webinar",
  "waitlist",
  "referral",
  "program",
  "program-lesson",
  "red-zones",
  "red-zone-detail",
  "coach",
  "mastery",
  "account",
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) failures.push(`missing file: ${file}`);
}

const typesPath = join(root, "src/types.ts");
const appPath = join(root, "src/App.tsx");
const authGuardPath = join(root, "src/components/AuthGuard.tsx");
const types = existsSync(typesPath) ? readFileSync(typesPath, "utf8") : "";
const app = existsSync(appPath) ? readFileSync(appPath, "utf8") : "";
const authGuard = existsSync(authGuardPath) ? readFileSync(authGuardPath, "utf8") : "";

for (const route of requiredRoutes) {
  if (!types.includes(`"${route}"`)) failures.push(`Route union missing: ${route}`);
}

if (!types.includes("slug?: string")) failures.push("Route state missing slug?: string");
if (!app.includes("parseHashRoute")) failures.push("App router missing slug-aware parseHashRoute");
if (!authGuard.includes("AUTH_GUARD_TIMEOUT_MS")) failures.push("AuthGuard missing Clerk-load timeout fallback");
for (const route of ["tensions", "traps", "program", "red-zones", "coach", "mastery", "account"]) {
  if (!app.includes(`"${route}"`)) failures.push(`App router missing route: ${route}`);
}

const srcText = requiredFiles
  .filter((file) => existsSync(join(root, file)))
  .map((file) => readFileSync(join(root, file), "utf8"))
  .join("\n");

if (/focus[-_\s]?group|pick[-_\s]?rate/i.test(srcText)) {
  failures.push("user-facing component source contains focus-group or pick-rate copy");
}

if (failures.length) {
  console.error(`core_components_check: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`core_components_check: all ${requiredFiles.length} files and ${requiredRoutes.length} routes present`);
