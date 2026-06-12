// Rotating encouragement verse — picks once per mount from the no-repeat
// cycle in lib/verses.ts and renders in the existing fellowship-scripture
// treatment. Structural verses stay in ScriptureBand; this is the living layer.
import { useState } from "react";
import type { CSSProperties } from "react";
import { pickVerse } from "../lib/verses.ts";
import type { VerseTheme } from "../content/verse-bank.ts";

interface VerseLineProps {
  theme?: VerseTheme;
  style?: CSSProperties;
}

export function VerseLine({ theme, style }: VerseLineProps) {
  const [verse] = useState(() => pickVerse(theme));
  return (
    <p className="fellowship-scripture" style={style}>
      “{verse.text}”
      <span className="ref">{verse.ref} · KJV</span>
    </p>
  );
}
