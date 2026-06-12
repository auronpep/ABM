// One encouraging verse, picked once per mount from the rotation engine
// (src/lib/verses.ts) and themed to the emotional moment of the surface.
// Renders with the existing .pc-quote styling — no new CSS.
import { useState } from "react";
import type { VerseTheme } from "../content/verse-bank.ts";
import { pickVerse } from "../lib/verses.ts";

export function VerseLine({
  theme,
  style,
}: {
  theme?: VerseTheme;
  style?: React.CSSProperties;
}) {
  const [verse] = useState(() => pickVerse(theme));
  return (
    <blockquote className="pc-quote" style={style}>
      {verse.text}
      <span className="ref">{verse.ref} · KJV</span>
    </blockquote>
  );
}
