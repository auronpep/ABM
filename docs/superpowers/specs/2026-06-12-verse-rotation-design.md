# Verse Rotation System — Design

Date: 2026-06-12

## Problem

The site's scripture layer is 8 fixed verses in `src/content/scripture.ts`, each
hard-wired to one slot. A daily user sees the identical verses on every visit,
and the product surfaces (Welcome, Repair, Drill library, Diagnostic verdict,
Prayer Chain, Footer) carry little or no encouragement at all.

## Goals

- Encouraging KJV verses on every major surface of the site and product.
- No verse repeats until the entire bank has been seen by that browser.
- Verses matched to the emotional moment (courage on a miss, victory on a
  repair, diligence in the drill library, rest around the diagnostic).
- Structural verses stay fixed — the John 7:24 hero, Hebrews 5:14 method band,
  and the other VISION_LOCK slots in `scripture.ts` are load-bearing copy and
  are NOT rotated.

## Design

### 1. Verse bank — `src/content/verse-bank.ts`

~60 KJV verses (public domain, matching the site's KJV convention), each:

```ts
interface BankVerse {
  ref: string;
  text: string;
  themes: VerseTheme[];
}
type VerseTheme =
  | "courage" | "perseverance" | "diligence" | "wisdom"
  | "rest" | "victory" | "fellowship" | "hope";
```

Verses already used structurally in `scripture.ts` are excluded from the bank
so a page never shows the same verse twice.

### 2. Rotation engine — `src/lib/verses.ts`

- One global shuffled cycle persisted in `localStorage`
  (`bm_verse_rotation_v1`): `{ remaining: number[], recent: number[] }`.
- `pickVerse(theme?)` takes the first index in `remaining` whose verse matches
  the theme (any verse if no theme), removes it, and records it in `recent`
  (capped). When `remaining` runs dry — or has no match for the theme — the
  deck reshuffles excluding `recent`, so a verse can never appear twice in
  close succession even across cycle boundaries.
- If the bank size changes between deploys, stored state is discarded and the
  cycle restarts (validated on load).
- `dailyVerse()` is date-seeded (`floor(now/86400000) * stride % length`,
  stride coprime with the bank size) — deterministic per day, same for every
  visitor, used where a stable verse is wanted (Footer).
- localStorage failures (private mode) degrade to in-memory state.

### 3. Display — `src/components/VerseLine.tsx`

Small component that picks once per mount (`useState(() => pickVerse(theme))`)
and renders using the existing `.fellowship-scripture` styling. No new CSS.

### 4. Wire-in points

| Surface | Moment | Theme |
|---|---|---|
| Welcome | below the action ladder | hope |
| Repair — repaired verdict | with the brass stamp | victory |
| Repair — miss path ("Still Live") | no-shame encouragement | perseverance |
| Repair — timed retest intro | before the clock starts | courage |
| Drill library | under the header copy | diligence |
| Diagnostic — verdict | after the Red-Zone reveal | rest |
| Prayer Chain | page body | fellowship |
| Footer | daily verse line | any (date-seeded) |

## Alternatives considered

1. More fixed verses per page — no rotation; a daily user still sees the same
   text every visit.
2. Pure random per render — repeats possible back-to-back; no full-bank
   coverage guarantee.
3. Shuffled persistent cycle (chosen) — full-bank coverage before any repeat,
   themed, deterministic where it should be.

## Testing

- `npx tsc --noEmit` and `vite build` green.
- Manual: load pages, confirm verses render and differ across re-mounts;
  confirm `localStorage` state advances; confirm structural verses unchanged.
