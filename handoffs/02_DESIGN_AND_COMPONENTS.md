# 02 — DESIGN TOKENS AND REFERENCE COMPONENTS

## Tokens (authoritative for the funnel)

```css
--bm-oxblood:      #5E1916;  /* brand primary, correct-answer bars, CTAs */
--bm-oxblood-deep: #48120F;  /* share card / dark surfaces */
--bm-trap:         #C8401F;  /* RESERVED: trap elements only — bars, nameplates, miss chips */
--bm-ink:          #1C1614;  /* text, hard rules, secondary buttons */
--bm-paper:        #FAF7F2;  /* card surface */
--bm-bone:         #EDE6DA;  /* page background, inactive bars */
--bm-bone-line:    #DCD2C2;  /* hairline borders */
--bm-brass:        #8F742F;  /* RESERVED: survived/correct accents, repair-path labels */
--bm-faded:        #6E6258;  /* metadata, captions */
```

Semantic rule: **trap vermilion appears nowhere except trap meaning** —
by the time the nameplate stamps, the color must already mean "trap."
Brass likewise reserved for survived/repair. Violations are design bugs.

Type: `Source Serif 4` (display + body; weights 400/600/700) and
`IBM Plex Mono` (eyebrows, evidence-tag chrome, pick rates, chips;
letter-spacing .06–.18em, sizes 10–13px). Self-host or next/font — do not
ship the Google Fonts @import from the prototypes to production.

Geometry: border-radius 2px everywhere. No pills, no rounded cards.
Hairline 1–1.5px borders; 2px solid ink rule under card headers; 2.5px
trap-vermilion frame on nameplates. Card shadow:
`0 1px 0 rgba(28,22,20,.06), 0 16px 40px rgba(28,22,20,.10)`.

## Motion vocabulary

- `stamp`: scale 1.22 → .97 → 1.0, opacity 0 → 1, 500ms
  cubic-bezier(.2,.9,.3,1.2). Nameplates and verdict chips only.
- `rise`: translateY(10px) → 0 + fade, 500ms ease. Paragraphs/blocks.
- bar draw: width 0 → pct over 1.1s cubic-bezier(.25,.8,.3,1).
- Lock beat: 700–900ms pause between pick and first reveal element.
- `prefers-reduced-motion: reduce` → all animation off, all stages render
  immediately. This is implemented in the prototypes; preserve it.

## Reference components (in this bundle)

- `mini-diagnostic.jsx` — Screen 1–2. Closest to production-ready.
- `red-zone-reveal.jsx` — Screen 4 treatment.
- `manna-cafe-demo-card.jsx` — single-question card; post-launch use.

These are working prototypes, not drop-ins. Adaptation requirements:
1. Convert inline styles to the app's Tailwind/CSS-module conventions using
   the tokens above. Keep the exact visual output.
2. Extract ALL question content into data (doc 03 contract). Components
   must render any conforming question JSON — zero hardcoded stems.
3. Replace placeholder CTAs with real routes + event firing (doc 04).
4. The mini-diagnostic `Frame` component currently re-mounts per screen;
   restructure so animations don't replay on re-render.
5. Escape-sequence literals (`\u201C` etc.) in prototype strings should
   become plain UTF-8 in source.
6. Accessibility floor: keyboard-operable choices (they are buttons —
   keep), visible :focus-visible outlines (implemented — keep), aria-live
   ="polite" on reveal containers (ADD), chart bars need text equivalents
   (pcts are rendered as text — keep).

## What NOT to restyle

Do not modernize, soften, or "friendly up" the aesthetic. No gradients, no
rounded corners, no emoji in UI, no illustration packs. The forensic
editorial austerity is the brand. When in doubt, remove decoration.
