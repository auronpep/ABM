// Pricing — numbers preserved from the current site; framing rebuilt diagnostic-first.

export const pricing = {
  flagshipPrice: 999,
  plan: { today: 500, day30: 499 },

  eyebrow: "Investment",
  headline: "Diagnose first. Pay for repair only if the pattern is real.",

  // Short voice (hero/pricing teaser).
  short:
    "Fear is a poor reason to buy bar prep. Wisdom is a better one. Start with the diagnostic. If all you need is more questions, buy the cheaper book. If the same counterfeit answer keeps taking your points, you need repair.",

  // Long voice (pricing page).
  long:
    "BarMatrix shows whether your wrong answers are random misses or recurring trap patterns before asking you to enter the paid Repair Path. A fifty-dollar question bank can give you more questions; it cannot tell you why the same kind of answer keeps persuading you. The price is for diagnosis, forensics, targeted repair, and Christian fellowship ordered under Christ.",

  includes: [
    "Start with the free diagnostic",
    "Your Trap Map, built from your own misses",
    "Wrong-answer Forensics with the TEAR breakdown",
    "Repair Briefs and targeted Repair Drills",
    "Timed retests on the patterns that keep costing points",
    "Be Strong Fellowship — prayer, study, and accountability",
  ],

  planLine: "Or pay in two: $500 today, $499 in 30 days.",
  honesty: "MBE wrong-answer diagnosis and repair. Not a full bar course, and not a pass guarantee.",
} as const;
