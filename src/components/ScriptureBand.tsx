// Scripture as section architecture (not decoration).
import type { Verse } from "../content/scripture.ts";

interface Props {
  verse: Verse;
  caption?: string;
}

export function ScriptureBand({ verse, caption }: Props) {
  const cap = caption ?? verse.caption;
  return (
    <section className="section scripture">
      <div className="container">
        <div className="scripture-band">
          <div className="rule-mark" />
          <div className="ref">{verse.ref} · KJV</div>
          <p className="verse">“{verse.text}”</p>
          {cap && <p className="caption">{cap}</p>}
        </div>
      </div>
    </section>
  );
}

export function ScriptureInline({ verse }: Props) {
  return (
    <div className="scripture-inline">
      <span className="ref">{verse.ref}</span>
      <p className="verse">“{verse.text}”</p>
    </div>
  );
}
