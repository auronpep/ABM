// Verse rotation engine — docs/superpowers/specs/2026-06-12-verse-rotation-design.md.
// One global shuffled cycle persisted per browser: no verse repeats until the
// whole bank has been seen, and never twice in close succession even across
// cycle boundaries. Structural verses (scripture.ts, VISION_LOCK) are not in
// the bank, so a page never shows the same verse twice.

import { VERSE_BANK, type BankVerse, type VerseTheme } from "../content/verse-bank.ts";

const STORAGE_KEY = "bm_verse_rotation_v1";
const RECENT_CAP = 8;

interface RotationState {
  size: number; // bank size at save time — a changed bank discards the cycle
  remaining: number[];
  recent: number[];
}

// In-memory fallback when localStorage is unavailable (private mode).
let memoryState: RotationState | null = null;

function shuffle(indices: number[]): number[] {
  const out = [...indices];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function freshDeck(excluding: number[]): number[] {
  const skip = new Set(excluding);
  return shuffle(VERSE_BANK.map((_, i) => i).filter((i) => !skip.has(i)));
}

function validState(s: unknown): s is RotationState {
  if (typeof s !== "object" || s === null) return false;
  const c = s as RotationState;
  return (
    c.size === VERSE_BANK.length &&
    Array.isArray(c.remaining) &&
    Array.isArray(c.recent) &&
    [...c.remaining, ...c.recent].every(
      (i) => Number.isInteger(i) && i >= 0 && i < VERSE_BANK.length,
    )
  );
}

function loadState(): RotationState {
  if (memoryState) return memoryState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (validState(parsed)) return parsed;
    }
  } catch {
    // storage unavailable or corrupt — fall through to a fresh cycle
  }
  return { size: VERSE_BANK.length, remaining: freshDeck([]), recent: [] };
}

function saveState(s: RotationState): void {
  memoryState = s;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // private mode — memoryState carries the cycle for this session
  }
}

/**
 * Pick the next verse in the cycle, preferring the given theme. The deck
 * reshuffles (excluding recent picks) when it runs dry or has no themed match.
 */
export function pickVerse(theme?: VerseTheme): BankVerse {
  const state = loadState();
  const matches = (i: number) => !theme || VERSE_BANK[i].themes.includes(theme);

  let at = state.remaining.findIndex(matches);
  if (at === -1) {
    state.remaining = freshDeck(state.recent);
    at = state.remaining.findIndex(matches);
  }
  if (at === -1) {
    // Theme exists only among recent picks — allow the least-recent match.
    const fallback = state.recent.find(matches) ?? 0;
    state.recent = [...state.recent.filter((i) => i !== fallback), fallback].slice(-RECENT_CAP);
    saveState(state);
    return VERSE_BANK[fallback];
  }

  const [picked] = state.remaining.splice(at, 1);
  state.recent = [...state.recent, picked].slice(-RECENT_CAP);
  saveState(state);
  return VERSE_BANK[picked];
}

/**
 * Date-seeded verse — deterministic per day, same for every visitor. Used
 * where a stable verse is wanted (Footer). Stride is kept coprime with the
 * bank size so consecutive days walk the whole bank before repeating.
 */
export function dailyVerse(now: number = Date.now()): BankVerse {
  const len = VERSE_BANK.length;
  let stride = 37;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  while (gcd(stride, len) !== 1) stride += 1;
  const day = Math.floor(now / 86_400_000);
  return VERSE_BANK[(day * stride) % len];
}
