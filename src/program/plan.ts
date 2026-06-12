// Day 2–7 next-action engine — P1 §5, client-local. Strict priority ladder:
// (1) overdue spaced retest → (2) repair in progress → (3) next zone repair
// → (4) timed mixed set. Exactly ONE primary action per visit. Mirrors the
// shape of the server-side /api/me/day-plan engine so reconnecting after the
// Clerk/linkage session is a swap, not a rewrite.
// Sanctuary rules: spaced retests invite, they never shame.

import { CURATED_DIAGNOSTIC_IDS } from "../content/curated-diagnostic.ts";
import type { MissRecord } from "../funnel/types.ts";
import {
  spacedRetestDue,
  zoneFamilyId,
  type ProgramSet,
  type ProgramState,
  type ProgramZone,
  type StoredMap,
  type TrapIndexEntry,
} from "./repair.ts";

export type NextAction =
  | { kind: "diagnostic" }
  | { kind: "spaced_retest"; program: ProgramState }
  | { kind: "continue_repair"; program: ProgramState }
  | { kind: "start_zone"; zone: ProgramZone; ordinal: number }
  | { kind: "mixed_set" };

/**
 * The full ranked zone queue from the buyer's map: synthesized zones first
 * (largest first, as the map orders them), then singleton trap families by
 * recurrence. Deduped by trap family.
 */
export function zoneQueue(map: StoredMap): ProgramZone[] {
  const queue: ProgramZone[] = [];
  const seen = new Set<string>();

  for (const z of map.zones) {
    const member = map.misses.find((m) => z.members.includes(m.qid));
    if (!member) continue;
    const zone: ProgramZone = {
      name: z.name,
      filter_broken: member.filter_broken,
      mold: member.mold,
      silverKeyMove: member.silverKeyMove ?? null,
    };
    const id = zoneFamilyId(zone);
    if (!seen.has(id)) {
      seen.add(id);
      queue.push(zone);
    }
  }

  const families = new Map<string, MissRecord[]>();
  for (const miss of map.misses) {
    const key = `${miss.filter_broken}|${miss.mold}`;
    if (seen.has(key)) continue;
    families.set(key, [...(families.get(key) ?? []), miss]);
  }
  const singles = [...families.values()].sort((a, b) => b.length - a.length);
  for (const members of singles) {
    const lead = members[0];
    const zone: ProgramZone = {
      name: lead.trapName,
      filter_broken: lead.filter_broken,
      mold: lead.mold,
      silverKeyMove: lead.silverKeyMove ?? null,
    };
    seen.add(zoneFamilyId(zone));
    queue.push(zone);
  }
  return queue;
}

export function allUsedIds(set: ProgramSet): string[] {
  return [...new Set(set.programs.flatMap((p) => p.usedIds))];
}

export function nextAction(set: ProgramSet, map: StoredMap | null): NextAction {
  if (map === null && set.programs.length === 0) return { kind: "diagnostic" };

  const due = set.programs.find(spacedRetestDue);
  if (due) return { kind: "spaced_retest", program: due };

  const live = set.programs.find(
    (p) => p.phase === "drills" || p.phase === "retest" || p.phase === "missed",
  );
  if (live) return { kind: "continue_repair", program: live };

  if (map) {
    const started = new Set(set.programs.map((p) => zoneFamilyId(p.zone)));
    const next = zoneQueue(map).find((z) => !started.has(zoneFamilyId(z)));
    if (next) return { kind: "start_zone", zone: next, ordinal: set.programs.length + 1 };
  }

  return { kind: "mixed_set" };
}

// ——— Zone map state for /welcome ———

export type ZoneStatusKind = "repaired" | "retest-ready" | "in-repair" | "queued";

export interface ZoneStatus {
  zone: ProgramZone;
  kind: ZoneStatusKind;
  /** Scheduled spaced-retest time, when the zone is repaired and waiting. */
  retestAt: number | null;
}

export function zoneStatuses(set: ProgramSet, map: StoredMap | null): ZoneStatus[] {
  const out: ZoneStatus[] = [];
  const seen = new Set<string>();
  for (const p of set.programs) {
    const kind: ZoneStatusKind = spacedRetestDue(p)
      ? "retest-ready"
      : p.phase === "repaired"
        ? "repaired"
        : "in-repair";
    out.push({ zone: p.zone, kind, retestAt: p.phase === "repaired" ? p.retestAt : null });
    seen.add(zoneFamilyId(p.zone));
  }
  if (map) {
    for (const z of zoneQueue(map)) {
      if (!seen.has(zoneFamilyId(z))) out.push({ zone: z, kind: "queued", retestAt: null });
    }
  }
  return out;
}

// ——— Timed mixed set ———

export const MIXED_SET_SIZE = 6;
export const MIXED_SET_SECONDS = 720; // 6 questions, timed: 2 min each

const MIXED_RESULTS_KEY = "bm_mixed_v1";

export interface MixedResult {
  ts: number;
  total: number;
  correct: number;
}

export function readMixedResults(): MixedResult[] {
  try {
    const raw = localStorage.getItem(MIXED_RESULTS_KEY);
    return raw ? (JSON.parse(raw) as MixedResult[]) : [];
  } catch {
    return [];
  }
}

export function recordMixedResult(correct: number, total: number): void {
  try {
    const results = [...readMixedResults(), { ts: Date.now(), total, correct }];
    localStorage.setItem(MIXED_RESULTS_KEY, JSON.stringify(results));
  } catch {
    // ignore
  }
}

/**
 * Mixed-set selection: round-robin across the buyer's trap families
 * (hottest first), unseen questions first, easiest first within a family.
 * Falls back to any unseen question, then allows reuse once the bank is dry.
 */
export function selectMixedSet(
  set: ProgramSet,
  map: StoredMap | null,
  index: TrapIndexEntry[],
): string[] {
  const used = new Set<string>([...CURATED_DIAGNOSTIC_IDS, ...allUsedIds(set)]);
  const byDifficulty = (a: TrapIndexEntry, b: TrapIndexEntry) =>
    (a.difficulty ?? 3) - (b.difficulty ?? 3);

  const families = zoneStatuses(set, map).map((s) => s.zone);
  const pools = families.map((z) =>
    index.filter((e) => !used.has(e.id) && e.molds.includes(z.mold)).sort(byDifficulty),
  );

  const picked: string[] = [];
  let added = true;
  while (picked.length < MIXED_SET_SIZE && added) {
    added = false;
    for (const pool of pools) {
      if (picked.length >= MIXED_SET_SIZE) break;
      const next = pool.find((e) => !picked.includes(e.id));
      if (next) {
        picked.push(next.id);
        added = true;
      }
    }
  }
  if (picked.length < MIXED_SET_SIZE) {
    const fresh = index
      .filter((e) => !used.has(e.id) && !picked.includes(e.id))
      .sort(byDifficulty);
    for (const e of fresh) {
      if (picked.length >= MIXED_SET_SIZE) break;
      picked.push(e.id);
    }
  }
  if (picked.length < MIXED_SET_SIZE) {
    for (const e of index) {
      if (picked.length >= MIXED_SET_SIZE) break;
      if (!picked.includes(e.id)) picked.push(e.id);
    }
  }
  return picked;
}
