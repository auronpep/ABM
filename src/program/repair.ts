// The first repair loop — P1 §2, client-local program v1 (decision logged in
// PROGRESS.md 2026-06-11). Drill set + timed retest are assembled from the
// qdata bank, scoped to the buyer's #1 red zone by (filter_broken, mold),
// excluding questions already seen in the diagnostic. State persists per
// browser in localStorage; the spaced retest is a stored date, not a cron.

import { CURATED_DIAGNOSTIC_IDS, filterForMold } from "../content/curated-diagnostic.ts";
import type { FilterBroken, MissRecord } from "../funnel/types.ts";

export interface TrapIndexEntry {
  id: string;
  title: string;
  subject: string;
  difficulty: number | null;
  molds: string[];
}

export interface ProgramZone {
  name: string;
  filter_broken: FilterBroken;
  mold: string;
  silverKeyMove: string | null;
}

export type ProgramPhase = "drills" | "retest" | "repaired" | "missed";

export interface ProgramState {
  v: 1;
  startedAt: number;
  zone: ProgramZone;
  drillIds: string[];
  retestIds: string[];
  drillsDone: string[];
  phase: ProgramPhase;
  /** Retest attempt number; 1 on the first run, +1 after each miss path. */
  attempt: number;
  /** Epoch ms of the scheduled 4-day spaced retest (set on pass). */
  retestAt: number | null;
  repairedAt: number | null;
  /** Every qid ever assigned in this program — never re-served while fresh questions remain. */
  usedIds: string[];
}

export interface StoredMap {
  ts: number;
  total: number;
  score: number;
  misses: MissRecord[];
  zones: Array<{ name: string; members: string[] }>;
}

export const REDZONE_MAP_KEY = "bm_redzone_map";
export const PROGRAM_KEY = "bm_program_v1";

export const RETEST_SIZE = 3;
export const RETEST_PASS_BAR = 2; // of 3 — "repaired for now", re-verified at day 4
export const RETEST_SECONDS = 360; // 3 questions, timed: 2 min each
export const SPACED_RETEST_DAYS = 4;
export const MISS_PATH_EXTRA_DRILLS = 2;

export function readMap(): StoredMap | null {
  try {
    const raw = localStorage.getItem(REDZONE_MAP_KEY);
    return raw ? (JSON.parse(raw) as StoredMap) : null;
  } catch {
    return null;
  }
}

export function readProgram(): ProgramState | null {
  try {
    const raw = localStorage.getItem(PROGRAM_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as ProgramState;
    if (state.v !== 1) return null;
    // Earlier v1 payloads predate the usedIds ledger — backfill from what we know.
    if (!Array.isArray(state.usedIds)) {
      state.usedIds = [...state.drillIds, ...state.retestIds];
    }
    return state;
  } catch {
    return null;
  }
}

export function writeProgram(state: ProgramState): void {
  try {
    localStorage.setItem(PROGRAM_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — the loop still runs in memory for this visit
  }
}

export function clearProgram(): void {
  try {
    localStorage.removeItem(PROGRAM_KEY);
  } catch {
    // ignore
  }
}

/**
 * The buyer's #1 zone: the largest synthesized zone if one exists, otherwise
 * the most recurrent (filter, mold) family among singleton misses.
 */
export function deriveTargetZone(map: StoredMap): ProgramZone | null {
  const topZone = map.zones[0];
  if (topZone) {
    const member = map.misses.find((m) => topZone.members.includes(m.qid));
    if (member) {
      return {
        name: topZone.name,
        filter_broken: member.filter_broken,
        mold: member.mold,
        silverKeyMove: member.silverKeyMove ?? null,
      };
    }
  }
  if (map.misses.length === 0) return null;
  const counts = new Map<string, MissRecord[]>();
  for (const miss of map.misses) {
    const key = `${miss.filter_broken}|${miss.mold}`;
    counts.set(key, [...(counts.get(key) ?? []), miss]);
  }
  const [, members] = [...counts.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  const lead = members[0];
  return {
    name: lead.trapName,
    filter_broken: lead.filter_broken,
    mold: lead.mold,
    silverKeyMove: lead.silverKeyMove ?? null,
  };
}

/**
 * Family-scoped question selection, easiest first. Primary pool: questions
 * carrying the zone's exact mold. Fallback (thin molds — the bank has
 * families with as few as 1–2 questions): same broken filter, any mold.
 * Final fallback: any unseen question. Diagnostic questions are excluded.
 */
function selectFromBank(
  index: TrapIndexEntry[],
  zone: ProgramZone,
  exclude: Set<string>,
  count: number,
): string[] {
  const byDifficulty = (a: TrapIndexEntry, b: TrapIndexEntry) =>
    (a.difficulty ?? 3) - (b.difficulty ?? 3);

  const unseen = index.filter((e) => !exclude.has(e.id));
  const exact = unseen.filter((e) => e.molds.includes(zone.mold)).sort(byDifficulty);
  const sameFilter = unseen
    .filter(
      (e) => !e.molds.includes(zone.mold) && e.molds.some((m) => filterForMold(m) === zone.filter_broken),
    )
    .sort(byDifficulty);
  const rest = unseen
    .filter((e) => !exact.includes(e) && !sameFilter.includes(e))
    .sort(byDifficulty);

  return [...exact, ...sameFilter, ...rest].slice(0, count).map((e) => e.id);
}

/** Drill count mirrors /welcome's promise: 2 per zone member, clamped 4–6. */
export function drillCountForMap(map: StoredMap): number {
  const members = map.zones[0]?.members.length ?? 1;
  return Math.max(4, Math.min(6, members * 2));
}

export function startProgram(map: StoredMap, index: TrapIndexEntry[]): ProgramState | null {
  const zone = deriveTargetZone(map);
  if (!zone) return null;

  const exclude = new Set<string>(CURATED_DIAGNOSTIC_IDS);
  const drillIds = selectFromBank(index, zone, exclude, drillCountForMap(map));
  drillIds.forEach((id) => exclude.add(id));
  const retestIds = selectFromBank(index, zone, exclude, RETEST_SIZE);

  const state: ProgramState = {
    v: 1,
    startedAt: Date.now(),
    zone,
    drillIds,
    retestIds,
    drillsDone: [],
    phase: "drills",
    attempt: 1,
    retestAt: null,
    repairedAt: null,
    usedIds: [...drillIds, ...retestIds],
  };
  writeProgram(state);
  return state;
}

export function completeDrill(state: ProgramState, qid: string): ProgramState {
  if (state.drillsDone.includes(qid)) return state;
  const drillsDone = [...state.drillsDone, qid];
  const allDone = state.drillIds.every((id) => drillsDone.includes(id));
  const next: ProgramState = {
    ...state,
    drillsDone,
    phase: allDone ? "retest" : state.phase,
  };
  writeProgram(next);
  return next;
}

export function recordRetest(
  state: ProgramState,
  correctCount: number,
  index: TrapIndexEntry[],
): ProgramState {
  if (correctCount >= RETEST_PASS_BAR) {
    const next: ProgramState = {
      ...state,
      phase: "repaired",
      repairedAt: Date.now(),
      retestAt: Date.now() + SPACED_RETEST_DAYS * 24 * 60 * 60 * 1000,
    };
    writeProgram(next);
    return next;
  }

  // Miss path — no shame state: 2 more drills from the family, fresh retest.
  const exclude = new Set<string>([...CURATED_DIAGNOSTIC_IDS, ...state.usedIds]);
  const extraDrills = selectFromBank(index, state.zone, exclude, MISS_PATH_EXTRA_DRILLS);
  extraDrills.forEach((id) => exclude.add(id));
  let retestIds = selectFromBank(index, state.zone, exclude, RETEST_SIZE);
  if (retestIds.length < RETEST_SIZE) {
    // Bank exhausted for unseen questions — reuse the prior retest set.
    retestIds = [...retestIds, ...state.retestIds].slice(0, RETEST_SIZE);
  }
  const next: ProgramState = {
    ...state,
    phase: "missed",
    attempt: state.attempt + 1,
    drillIds: [...state.drillIds, ...extraDrills],
    retestIds,
    usedIds: [...new Set([...state.usedIds, ...extraDrills, ...retestIds])],
  };
  writeProgram(next);
  return next;
}

/** Re-enter the drill phase from the miss path ("run it again"). */
export function resumeDrills(state: ProgramState): ProgramState {
  const remaining = state.drillIds.filter((id) => !state.drillsDone.includes(id));
  const next: ProgramState = {
    ...state,
    phase: remaining.length > 0 ? "drills" : "retest",
  };
  writeProgram(next);
  return next;
}

/** The day-4 spaced retest: fresh family questions, same pass bar. */
export function startSpacedRetest(state: ProgramState, index: TrapIndexEntry[]): ProgramState {
  const exclude = new Set<string>([...CURATED_DIAGNOSTIC_IDS, ...state.usedIds]);
  let retestIds = selectFromBank(index, state.zone, exclude, RETEST_SIZE);
  if (retestIds.length < RETEST_SIZE) {
    retestIds = [...retestIds, ...state.retestIds].slice(0, RETEST_SIZE);
  }
  const next: ProgramState = {
    ...state,
    phase: "retest",
    retestIds,
    usedIds: [...new Set([...state.usedIds, ...retestIds])],
  };
  writeProgram(next);
  return next;
}

export function spacedRetestDue(state: ProgramState): boolean {
  return state.phase === "repaired" && state.retestAt !== null && Date.now() >= state.retestAt;
}

export async function loadTrapIndex(): Promise<TrapIndexEntry[]> {
  const res = await fetch("/qdata/trap-index.json");
  if (!res.ok) throw new Error(`HTTP ${res.status} loading trap-index.json`);
  return (await res.json()) as TrapIndexEntry[];
}
