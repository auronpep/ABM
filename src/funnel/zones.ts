// Red-Zone synthesis — doc 03 §3. Misses group by (filter_broken, mold);
// groups of 2+ become named zones, singletons render as individual trap cards.

import type { FilterBroken, Instinct, MissRecord, RedZone } from "./types.ts";

interface ZoneDef {
  name: string;
  verdict: (n: number, m: number, subjects: string[]) => string;
}

const zoneKey = (filter: FilterBroken, mold: string) => `${filter}|${mold}`;

function subjectList(subjects: string[]): string {
  const unique = [...new Set(subjects)];
  if (unique.length <= 1) return unique[0] ?? "this subject";
  return `${unique.slice(0, -1).join(", ")} and ${unique[unique.length - 1]}`;
}

// Zone-name table (doc 03 §3, extended for the live diagnostic's trap molds).
export const ZONE_TABLE: Record<string, ZoneDef> = {
  [zoneKey("NOT_RESPONSIVE", "wrong_element")]: {
    name: "THE TRUE-BUT-WRONG PICK",
    verdict: (n, m, subjects) =>
      `You don't have a ${subjectList(subjects)} problem. You buy answers because they're true — not because they answer the call. ${n} of your ${m} misses were real, damning, satisfying facts that proved the wrong thing. This pattern recurs across subjects. It is repairable, and the repair is one move.`,
  },
  [zoneKey("NOT_TRUE", "fabricated_rule")]: {
    name: "THE INVENTED RULE",
    verdict: (n, m) =>
      `You trust rules that sound official — even when no such rule exists. ${n} of your ${m} misses bought a requirement, threshold, or ban the law never wrote. Invented rules sound careful; that is their whole disguise. The repair is one demand: make every rule cite itself.`,
  },
  [zoneKey("NOT_RESPONSIVE", "bait_doctrine")]: {
    name: "THE BORROWED DOCTRINE",
    verdict: (n, m) =>
      `You reach for the right area of law and the wrong tool inside it. ${n} of your ${m} misses applied a true rule from the neighboring doctrine — close enough to feel safe, far enough to lose the point. The repair: name the precise doctrine the call invokes before touching the choices.`,
  },
  [zoneKey("NOT_TRUE", "backwards")]: {
    name: "THE REVERSED DECISIONMAKER",
    verdict: (n, m) =>
      `You know the law — you run it in the wrong direction. ${n} of your ${m} misses handed the decision to the wrong actor or flipped a burden. The repair is mechanical: before you pick, say out loud who decides and who must prove.`,
  },
  [zoneKey("NOT_TRUE", "tiered_absolute")]: {
    name: "THE CATEGORICAL OVERCLAIM",
    verdict: (n, m) =>
      `"Always" and "never" are doing your thinking for you. ${n} of your ${m} misses bought an absolute where the law keeps exceptions. Absolutes feel safe under pressure; that is exactly why they are traps. Make every absolute earn it.`,
  },
  [zoneKey("NOT_TRUE", "colloquialism")]: {
    name: "THE FAIRNESS OVERRIDE",
    verdict: (n, m) =>
      `You substitute what feels fair for what the test demands. ${n} of your ${m} misses picked the answer that spared the sympathetic party instead of the one the rule compels. The exam knows your conscience and prices it. The repair: when an answer feels fair, demand the rule that does the sparing.`,
  },
  [zoneKey("NOT_RESPONSIVE", "misfit")]: {
    name: "THE ANSWER TO A DIFFERENT QUESTION",
    verdict: (n, m) =>
      `You answer the question you studied for, not the one on the page. ${n} of your ${m} misses were true law aimed at the wrong call. The repair: restate the call in your own words before reading a single choice.`,
  },
};

export function synthesizeZones(misses: MissRecord[]): { zones: RedZone[]; singles: MissRecord[] } {
  const groups = new Map<string, MissRecord[]>();
  for (const miss of misses) {
    const key = zoneKey(miss.filter_broken, miss.mold);
    groups.set(key, [...(groups.get(key) ?? []), miss]);
  }

  const zones: RedZone[] = [];
  const singles: MissRecord[] = [];
  for (const [key, members] of groups) {
    const def = ZONE_TABLE[key];
    if (members.length >= 2 && def) {
      zones.push({
        name: def.name,
        filter_broken: members[0].filter_broken,
        mold: members[0].mold,
        members,
        verdict: def.verdict(members.length, misses.length, members.map((x) => x.subject)),
      });
    } else {
      singles.push(...members);
    }
  }
  zones.sort((a, b) => b.members.length - a.members.length);
  return { zones, singles };
}

// Conscience synthesis (mini-diagnostic) — doc 03 §3 instinct phrase map.
const INSTINCT_PHRASES: Record<Instinct, string> = {
  JUSTICE: "your sense of justice",
  SUSPICION: "your nose for the incriminating",
  FAIRNESS: "your instinct for fairness",
};

export function conscienceVerdict(missedInstincts: Instinct[]): string {
  if (missedInstincts.length === 0) {
    return "Three traps, each aimed at something good in you — your sense of justice, your nose for the incriminating, your instinct for fairness. None of them landed. That puts you in rare company on these tested forms. The full diagnostic finds the traps that do land — everyone has them.";
  }
  const phrases = [...new Set(missedInstincts)].map((i) => INSTINCT_PHRASES[i]);
  const joined =
    phrases.length === 1 ? phrases[0] : `${phrases.slice(0, -1).join(", ")} and ${phrases[phrases.length - 1]}`;
  const converted = phrases.length === 1 ? "it" : "each one";
  return `The exam aimed at ${joined} — and converted ${converted} into a wrong answer. These were not knowledge failures. They were conscience traps: the wrong answer recruited what is best in you and walked it past the rule. That is a pattern, and patterns are repairable.`;
}

/**
 * Cohort pick-rate phrase — renders only when real cohort data exists.
 * Focus-group pct is internal-only and must never feed this line; pass trap.cohortPct.
 * The "tested form" qualifier is mandatory when a phrase is shown.
 */
export function cohortPhrase(cohortPct: number | null | undefined): string | null {
  if (cohortPct === null || cohortPct === undefined) return null;
  return `${cohortPct}% of past cohorts fell here on this question's tested form`;
}
