// Per-question interaction recorder. Mirrors the server contract in
// barmatrix-api src/lib/attempt-telemetry.ts: closed event vocabulary,
// ms offsets from question render, stream ends at submit.
// Telemetry must never break answering — all entry points are pure array
// pushes; the caller wraps the POST itself.

export type ChoiceLetter = "A" | "B" | "C" | "D";

export type InteractionEvent =
  | { t: number; ev: "shown" }
  | { t: number; ev: "scroll_stem" }
  | { t: number; ev: "select"; letter: ChoiceLetter }
  | { t: number; ev: "submit"; letter: ChoiceLetter };

const MAX_EVENTS = 200;
const SCROLL_DEBOUNCE_MS = 1000;

export interface AttemptRecorder {
  /** Reset for a newly rendered question. */
  markShown: () => void;
  recordSelect: (letter: ChoiceLetter) => void;
  /** Debounced to at most one event per second. */
  recordScrollStem: () => void;
  /** Final stream ending with the submit event. */
  snapshot: (submittedLetter: ChoiceLetter) => InteractionEvent[];
}

export function createAttemptRecorder(now: () => number = Date.now): AttemptRecorder {
  let shownAt = now();
  let events: InteractionEvent[] = [{ t: 0, ev: "shown" }];
  let lastScrollAt = -Infinity;

  const offset = () => Math.max(0, now() - shownAt);
  const push = (e: InteractionEvent) => {
    if (events.length < MAX_EVENTS - 1) events.push(e); // reserve room for submit
  };

  return {
    markShown: () => {
      shownAt = now();
      events = [{ t: 0, ev: "shown" }];
      lastScrollAt = -Infinity;
    },
    recordSelect: (letter) => push({ t: offset(), ev: "select", letter }),
    recordScrollStem: () => {
      const t = offset();
      if (t - lastScrollAt < SCROLL_DEBOUNCE_MS) return;
      lastScrollAt = t;
      push({ t, ev: "scroll_stem" });
    },
    snapshot: (submittedLetter) => [
      ...events,
      { t: offset(), ev: "submit", letter: submittedLetter },
    ],
  };
}
