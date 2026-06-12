export const SUBJECTS = [
  "civil-procedure",
  "constitutional-law",
  "contracts",
  "criminal-law",
  "criminal-procedure",
  "evidence",
  "real-property",
  "torts",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const SUBJECT_LABELS: Record<Subject, string> = {
  "civil-procedure": "Civ Pro",
  "constitutional-law": "Con Law",
  contracts: "Contracts",
  "criminal-law": "Crim Law",
  "criminal-procedure": "Crim Pro",
  evidence: "Evidence",
  "real-property": "Property",
  torts: "Torts",
};

export const SUBJECT_COLORS: Record<Subject, { accent: string; bg: string }> = {
  "civil-procedure": { accent: "#7a1420", bg: "#f7e7ea" },
  "constitutional-law": { accent: "#1f5f8b", bg: "#e6f0f7" },
  contracts: { accent: "#8a6d1f", bg: "#f5efd5" },
  "criminal-law": { accent: "#5b2b71", bg: "#efe5f4" },
  "criminal-procedure": { accent: "#8b3f12", bg: "#f6e7dc" },
  evidence: { accent: "#236b4e", bg: "#e4f1eb" },
  "real-property": { accent: "#4f5f24", bg: "#edf2d9" },
  torts: { accent: "#b3261e", bg: "#f9e3e1" },
};

const SUBJECT_ALIASES: Record<string, Subject> = {
  civpro: "civil-procedure",
  "civ pro": "civil-procedure",
  civil_procedure: "civil-procedure",
  "civil procedure": "civil-procedure",
  conlaw: "constitutional-law",
  "con law": "constitutional-law",
  constitutional_law: "constitutional-law",
  "constitutional law": "constitutional-law",
  contracts: "contracts",
  crimlaw: "criminal-law",
  "crim law": "criminal-law",
  criminal_law: "criminal-law",
  "criminal law": "criminal-law",
  crimpro: "criminal-procedure",
  "crim pro": "criminal-procedure",
  criminal_procedure: "criminal-procedure",
  "criminal procedure": "criminal-procedure",
  evidence: "evidence",
  property: "real-property",
  real_property: "real-property",
  "real property": "real-property",
  torts: "torts",
};

export function isSubject(value: string): value is Subject {
  return (SUBJECTS as readonly string[]).includes(value);
}

export function normalizeSubject(value: string | null | undefined): Subject | null {
  if (!value) return null;
  const key = value.trim().toLowerCase().replace(/\s+/g, " ");
  if (isSubject(key)) return key;
  return SUBJECT_ALIASES[key] ?? SUBJECT_ALIASES[key.replace(/-/g, "_")] ?? null;
}

export function labelSubject(value: string | null | undefined): string {
  const subject = normalizeSubject(value);
  return subject ? SUBJECT_LABELS[subject] : value || "Subject";
}
