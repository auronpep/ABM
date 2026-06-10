// Homepage section copy. Voice-locked terms only (VISION_LOCK say/avoid lists).

export const tearMethod = {
  eyebrow: "The TEAR Method",
  line: "The wrong answer usually carries just enough truth to survive a quick glance. The TEAR Method teaches you to tear it apart before it takes another point.",
  steps: [
    {
      glyph: "T",
      title: "Test the answer",
      body: "Do not stop at what sounds right. Identify what the answer is actually claiming, and test whether it fits the governing legal issue.",
    },
    {
      glyph: "E",
      title: "Expose the counterfeit",
      body: "The wrong answer usually contains enough truth to feel safe. See which fact, phrase, exception, or half-rule pulled you off the correct analysis.",
    },
    {
      glyph: "A",
      title: "Apply the rule",
      body: "Return to the actual governing rule — before emotion, familiarity, or moral weight takes over. This is the attorney-grade step.",
    },
    {
      glyph: "R",
      title: "Repair the pattern",
      body: "Get routed to targeted drills tied to the trap pattern behind the miss, so the next study hour is focused instead of scattered.",
    },
  ],
} as const;

export const productSystem = {
  eyebrow: "The System",
  headline: "Diagnose once. Repair the pattern, not the symptom.",
  nodes: [
    { step: "01", title: "The Diagnostic", body: "A focused diagnostic finds the wrong-answer patterns behind your misses before you enter any paid path." },
    { step: "02", title: "Your Trap Map", body: "Your misses are named and mapped, so the recurring traps that keep costing points become obvious." },
    { step: "03", title: "Forensics", body: "Each wrong answer is broken down to show exactly why the counterfeit persuaded you." },
    { step: "04", title: "Repair Path", body: "Targeted Repair Drills and timed retests tied to the trap pattern behind the miss." },
  ],
} as const;

export const worldBuilding = {
  eyebrow: "Built into the question world",
  headline: "Familiar Christian life. Attorney-grade law.",
  body: "The fact patterns are set in the world you actually live in — pastors, bookstores, Bible studies, congregations. The names are always protagonists or neutral. The legal mechanics are exactly what the bar tests. The faith is substantive, not a verse pasted in the corner.",
  scenes: [
    {
      scene: "Barnabas, an associate pastor, is subpoenaed for his private prayer journal and asserts the Fifth Amendment.",
      name: "Barnabas",
      area: "Criminal Procedure · Act of Production",
    },
    {
      scene: "Lydia, who runs a Christian bookstore, accepts a supplier's order on her own conflicting terms.",
      name: "Lydia",
      area: "Contracts · Battle of the Forms",
    },
    {
      scene: "Ruth writes a note moments after a collision; the court must decide who rules on the excited-utterance foundation.",
      name: "Ruth",
      area: "Evidence · Hearsay Foundation",
    },
  ],
} as const;

export const whoItsFor = {
  eyebrow: "Who It's For",
  headline: "For Christian bar takers preparing to judge rightly.",
  items: [
    "You are tired of narrowing it to two answers and trusting the wrong one.",
    "You want to know why the tempting answer worked — not just that it was wrong.",
    "You want attorney-grade MBE preparation that takes your faith seriously.",
    "You believe diligence, wisdom, prayer, and disciplined study belong together.",
    "You need courage for the exam and a focused path for the work.",
    "You are preparing for a profession where truth, judgment, justice, and courage matter.",
  ],
} as const;

export const fellowship = {
  eyebrow: "The Community",
  name: "Be Strong Fellowship",
  tagline: "Courage for the exam. Wisdom for the work. Christ above both.",
  body: "Be Strong Fellowship is the community inside BarMatrix for Christian bar takers preparing under pressure. We pray, study, examine our misses honestly, repair the patterns that keep costing points, and remember that the exam is serious — but it is not sovereign. Christ is.",
} as const;

export const encouragement = {
  line: "The exam is serious. It is not sovereign.",
  sub: "The bar is not your identity. The law is not your savior. But your preparation still belongs to Christ.",
} as const;

export const finalCta = {
  eyebrow: "Start Here",
  headline: "Start with the diagnostic.",
  body: "Find out whether your wrong answers are random misses or recurring trap patterns — before you spend a dollar on repair.",
  cta: "Start the Free Diagnostic",
} as const;
