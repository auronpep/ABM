// Funnel renderer contract — doc 03 §1 (sale-one handoff, 2026-06-10).
// Every funnel component consumes this shape; zero hardcoded stems.

export type ChoiceId = "A" | "B" | "C" | "D";

export type Instinct = "JUSTICE" | "SUSPICION" | "FAIRNESS";

export type FilterBroken = "NOT_TRUE" | "NOT_RESPONSIVE";

export interface FunnelChoice {
  id: ChoiceId;
  text: string;
  /** INTERNAL ONLY — focus-group pick rate. Never displayed; used for ranking/calibration. */
  pct: number | null;
  provenance: "inherited_original" | "predicted";
}

export interface FunnelTrap {
  choice: ChoiceId;
  /** INTERNAL ONLY — focus-group pick rate. Null in the shipped seed; canonical values live in internal-pickrates.json (not bundled). */
  pct: number | null;
  /** Cohort placeholder — % of past cohorts who fell here. Null until real cohort data exists; the UI slot renders only when non-null. */
  cohortPct?: number | null;
  name: string;
  instinct: Instinct;
  filter_broken: FilterBroken;
  mold: string;
}

export interface DrillSeed {
  type: string;
  prompt: string;
}

export interface FunnelQuestion {
  qid: string;
  title: string;
  subject: string;
  stem: string[];
  call: string;
  choices: FunnelChoice[];
  key: ChoiceId;
  trap: FunnelTrap;
  forensics: Record<ChoiceId, string>;
  silver_key_move: string;
  review_truth: string;
  drill_seeds: DrillSeed[];
  crossovers: string[];
}

/** A single miss carried into zone synthesis (mini or full diagnostic). */
export interface MissRecord {
  qid: string;
  title: string;
  subject: string;
  picked: ChoiceId;
  correct: ChoiceId;
  correctText: string;
  trapName: string;
  instinct: Instinct | null;
  filter_broken: FilterBroken;
  mold: string;
  silverKeyMove: string | null;
}

export interface RedZone {
  name: string;
  filter_broken: FilterBroken;
  mold: string;
  members: MissRecord[];
  verdict: string;
}

/** Mini → full diagnostic handoff payload (doc 04 rule 4). */
export interface MiniResult {
  score: number;
  missedInstincts: Instinct[];
}
