// Brand voice constants — locked by VISION_LOCK 2026-06-10.
// All user-facing brand copy flows from here so it can be voice-audited in one place.

export const brand = {
  name: "BarMatrix",
  domain: "barmatrix.app",
  positioning: "MBE wrong-answer diagnosis for Christian bar takers learning to judge rightly.",

  hero: {
    eyebrow: "MBE WRONG-ANSWER INTELLIGENCE",
    headline: "Stop trusting the answer that almost tells the truth.",
    subhead:
      "BarMatrix diagnoses the recurring MBE trap patterns behind your wrong answers and trains Christian bar takers to judge rightly.",
    ctaPrimary: "Start the Free Diagnostic",
    ctaSecondary: "See the Barnabas Trap",
  },

  // The creative thesis — the counterfeit frame.
  thesis: {
    label: "The Counterfeit",
    headline: "More questions never repaired a single judgment pattern.",
    body:
      "The MBE rarely tempts you with nonsense. It tempts you with a counterfeit — a half-true rule, a familiar word used the wrong way, a plausible exception, an answer that sounds righteous but misses the governing test. It carries just enough truth to survive a quick glance. You do not need a bigger pile of questions. You need to know why the same kind of answer keeps persuading you, and exactly what to repair next.",
  },

  // Closing conviction line (footer / encouragement).
  closingLine:
    "The bar is not your identity. The law is not your savior. But your preparation still belongs to Christ.",
} as const;

export const nav = {
  links: [
    { route: "home", label: "Home" },
    { route: "how-it-works", label: "The Method" },
    { route: "pricing", label: "Pricing" },
  ],
  ctaGhost: "See the Barnabas Trap",
  ctaPrimary: "Start the Free Diagnostic",
} as const;
