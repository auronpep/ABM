// Verse rotation engine — one global shuffled cycle persisted in localStorage
// so no encouragement verse repeats until the whole bank has been seen in this
// browser. Structural verses (content/scripture.ts) never rotate.
import { VERSE_BANK, type BankVerse, type VerseTheme } from "../content/verse-bank.ts";

const STORAGE_KEY = "bm_verse_rotation_v1";
const RECENT_CAP = 8;
const DAILY_STRIDE = 37; // coprime with the bank size — walks the bank, not the calendar order

interface RotationState {
  remaining: number[];
  recent: number[];
}

// Private-mode / quota failures degrade to an in-memory cycle for the session.
let memoryState: RotationState | null = null;

function shuffle(indices: number[]): number[] {
  const out = [...indices];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function freshDeck(exclude: number[]): number[] {
  const excluded = new Set(exclude);
  const all = VERSE_BANK.map((_, i) => i);
  const deck = shuffle(all.filter((i) => !excluded.has(i)));
  // The excluded (recently seen) verses rejoin at the back of the new cycle.
  return [...deck, ...shuffle(exclude)];
}

function isValidState(value: unknown): value is RotationState {
  if (typeof value !== "object" || value === null) return false;
  const s = value as RotationState;
  const okList = (xs: unknown): xs is number[] =>
    Array.isArray(xs) && xs.every((n) => Number.isInteger(n) && n >= 0 && n < VERSE_BANK.length);
  return okList(s.remaining) && okList(s.recent);
}

function loadState(): RotationState {
  if (memoryState) return memoryState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      // A bank-size change between deploys invalidates stored indices — reset.
      if (isValidState(parsed)) return parsed;
    }
  } catch {
    // fall through to a fresh deck
  }
  return { remaining: freshDeck([]), recent: [] };
}

function saveState(state: RotationState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    memoryState = null;
  } catch {
    memoryState = state;
  }
}

function takeAt(state: RotationState, pos: number): { verse: BankVerse; next: RotationState } {
  const idx = state.remaining[pos];
  const recent = [idx, ...state.recent].slice(0, RECENT_CAP);
  return {
    verse: VERSE_BANK[idx],
    next: { remaining: state.remaining.filter((_, p) => p !== pos), recent },
  };
}

/** Next unseen verse for the theme (any theme if omitted). Repeats only after
 *  the whole bank has cycled, and never within the last few picks. */
export function pickVerse(theme?: VerseTheme): BankVerse {
  let state = loadState();
  const matches = (pos: number) =>
    !theme || VERSE_BANK[state.remaining[pos]].themes.includes(theme);

  let pos = state.remaining.findIndex((_, p) => matches(p));
  if (pos === -1) {
    state = { remaining: freshDeck(state.recent), recent: state.recent };
    pos = state.remaining.findIndex((_, p) => matches(p));
    if (pos === -1) pos = 0; // theme absent from the bank — serve anything rather than nothing
  }
  const { verse, next } = takeAt(state, pos);
  saveState(next);
  return verse;
}

/** Deterministic verse of the day — same for every visitor, changes daily. */
export function dailyVerse(): BankVerse {
  const day = Math.floor(Date.now() / 86_400_000);
  return VERSE_BANK[(day * DAILY_STRIDE) % VERSE_BANK.length];
}
