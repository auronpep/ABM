// The Forty Days — a dated devotional countdown to the July 28–29 exam.
// One KJV verse (public domain), one short devotion tied to the day's work,
// one charge. Surfaces on /welcome as the daily-bread card; becomes the daily
// devotional email when the email provider is activated (APPROVALS_NEEDED §7).
// Outside the 40-day window the card falls back to the date-seeded daily
// verse from the rotation bank.

export interface DevotionalEntry {
  /** Days until the first exam day (July 28). 40 → 1, then 0 and -1 for the exam days. */
  daysLeft: number;
  ref: string;
  text: string;
  devotion: string;
  charge: string;
}

// First exam day, local time.
export const EXAM_YEAR = 2026;
export const EXAM_MONTH_INDEX = 6; // July
export const EXAM_DAY = 28;

/** Whole days from the start of today (local) until the first exam day. */
export function daysToExam(now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const exam = new Date(EXAM_YEAR, EXAM_MONTH_INDEX, EXAM_DAY);
  return Math.round((exam.getTime() - today.getTime()) / 86_400_000);
}

/** Today's entry, or null when outside the window (caller falls back to the daily verse). */
export function devotionalForToday(now: Date = new Date()): DevotionalEntry | null {
  const left = daysToExam(now);
  return FORTY_DAYS.find((e) => e.daysLeft === left) ?? null;
}

export const FORTY_DAYS: readonly DevotionalEntry[] = [
  // ———— Week one: number the days (40–34) ————
  {
    daysLeft: 40,
    ref: "Psalm 90:12",
    text: "So teach us to number our days, that we may apply our hearts unto wisdom.",
    devotion:
      "Forty days is enough — if each one is numbered. The map already knows today's work; wisdom is doing that work and nothing else.",
    charge: "Run today's assigned repair. Nothing extra.",
  },
  {
    daysLeft: 39,
    ref: "Proverbs 16:9",
    text: "A man's heart deviseth his way: but the LORD directeth his steps.",
    devotion:
      "You plan the study; He orders the steps. Hold the schedule with open hands and the next action with a firm one.",
    charge: "Take the one step in front of you.",
  },
  {
    daysLeft: 38,
    ref: "Psalm 119:11",
    text: "Thy word have I hid in mine heart, that I might not sin against thee.",
    devotion:
      "Hiding a rule in the heart is the same labor as hiding the Word there: repetition until it answers before you ask.",
    charge: "Say today's governing rules out loud, from memory.",
  },
  {
    daysLeft: 37,
    ref: "Luke 14:28",
    text:
      "For which of you, intending to build a tower, sitteth not down first, and counteth the cost, whether he have sufficient to finish it?",
    devotion:
      "The Lord commends the builder who counts before he builds. Forty days, one map, a known cost — you have counted it. Now build.",
    charge: "Look at the Red-Zone map once, then work it.",
  },
  {
    daysLeft: 36,
    ref: "Proverbs 6:6",
    text: "Go to the ant, thou sluggard; consider her ways, and be wise.",
    devotion:
      "The ant has no supervisor and no scoreboard — only the next load carried to the right place. Small, faithful loads win exams.",
    charge: "Carry today's load. Drills, then the retest.",
  },
  {
    daysLeft: 35,
    ref: "1 Corinthians 9:25",
    text:
      "And every man that striveth for the mastery is temperate in all things. Now they do it to obtain a corruptible crown; but we an incorruptible.",
    devotion:
      "Athletes are temperate for a wreath that wilts. You study before the Lord — temperance in sleep, food, and phone is training, not deprivation.",
    charge: "Guard tonight's sleep like it's on the syllabus.",
  },
  {
    daysLeft: 34,
    ref: "Psalm 1:2-3",
    text:
      "But his delight is in the law of the LORD; and in his law doth he meditate day and night. And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season.",
    devotion:
      "Fruit comes in its season, not on demand. Roots by the river — daily, unhurried, planted — are what hold when the season arrives.",
    charge: "Meditate on one rule until it feels obvious.",
  },

  // ———— Week two: the mind to work (33–27) ————
  {
    daysLeft: 33,
    ref: "Proverbs 21:31",
    text: "The horse is prepared against the day of battle: but safety is of the LORD.",
    devotion:
      "You prepare the horse; the outcome is His. That division of labor is freedom — your job today is preparation, not prediction.",
    charge: "Prepare the horse. Leave the verdict to Him.",
  },
  {
    daysLeft: 32,
    ref: "Nehemiah 4:6",
    text:
      "So built we the wall; and all the wall was joined together unto the half thereof: for the people had a mind to work.",
    devotion:
      "Nehemiah's wall rose under mockery because the people had a mind to work. Half-built is not failed — it's half-built. Keep laying stones.",
    charge: "Lay today's stones. Ignore the noise.",
  },
  {
    daysLeft: 31,
    ref: "Proverbs 14:23",
    text: "In all labour there is profit: but the talk of the lips tendeth only to penury.",
    devotion:
      "Talking about studying, reading about studying, planning to study — penury. The drill you actually run is the only one that pays.",
    charge: "Less review of the plan; more reps inside it.",
  },
  {
    daysLeft: 30,
    ref: "Psalm 127:1",
    text:
      "Except the LORD build the house, they labour in vain that build it: except the LORD keep the city, the watchman waketh but in vain.",
    devotion:
      "Thirty days out, ask Him to build the house you're laboring on. The same hours, offered, stop being anxious hours.",
    charge: "Open today's session with one sentence of prayer.",
  },
  {
    daysLeft: 29,
    ref: "Ecclesiastes 7:8",
    text:
      "Better is the end of a thing than the beginning thereof: and the patient in spirit is better than the proud in spirit.",
    devotion:
      "The end of this thing will be better than its beginning — that's a promise about patience, not talent. Patience today looks like one more drill.",
    charge: "One more drill than you felt like doing.",
  },
  {
    daysLeft: 28,
    ref: "Isaiah 50:7",
    text:
      "For the Lord GOD will help me; therefore shall I not be confounded: therefore have I set my face like a flint, and I know that I shall not be ashamed.",
    devotion:
      "Four weeks out. Set your face like flint — not gritted teeth, but settled direction. Help is promised to the one who keeps walking.",
    charge: "Set the schedule for the week and keep it.",
  },
  {
    daysLeft: 27,
    ref: "Psalm 37:23",
    text: "The steps of a good man are ordered by the LORD: and he delighteth in his way.",
    devotion:
      "Ordered steps — not ordered leaps. The ladder gives you one step per visit on purpose. He delights in the walking, not just the arriving.",
    charge: "Take the one ordered step. Don't skip ahead.",
  },

  // ———— Week three: exercised thereby (26–20) ————
  {
    daysLeft: 26,
    ref: "Proverbs 24:10",
    text: "If thou faint in the day of adversity, thy strength is small.",
    devotion:
      "Adversity is the gym where strength is measured — and built. A hard set today is the day of adversity in miniature, on your terms.",
    charge: "Run the timed set you've been avoiding.",
  },
  {
    daysLeft: 25,
    ref: "2 Corinthians 4:8-9",
    text:
      "We are troubled on every side, yet not distressed; we are perplexed, but not in despair; persecuted, but not forsaken; cast down, but not destroyed.",
    devotion:
      "Perplexed is allowed. Despair is not the next step after perplexed — another rep is. Cast down and destroyed are different words on purpose.",
    charge: "Miss, read the forensics, go again.",
  },
  {
    daysLeft: 24,
    ref: "Hebrews 12:11",
    text:
      "Now no chastening for the present seemeth to be joyous, but grievous: nevertheless afterward it yieldeth the peaceable fruit of righteousness unto them which are exercised thereby.",
    devotion:
      "\"Exercised thereby\" — the grief of a wrong answer is the exercise, not the verdict. The peaceable fruit comes afterward, to the trained.",
    charge: "Let today's misses train you, not judge you.",
  },
  {
    daysLeft: 23,
    ref: "Psalm 126:5",
    text: "They that sow in tears shall reap in joy.",
    devotion:
      "Some study days are sowing in tears. The promise isn't that sowing stops hurting — it's that this kind of sowing is the kind that reaps.",
    charge: "Sow today's hour even if it's a heavy one.",
  },
  {
    daysLeft: 22,
    ref: "Isaiah 42:3",
    text:
      "A bruised reed shall he not break, and the smoking flax shall he not quench: he shall bring forth judgment unto truth.",
    devotion:
      "Feeling bruised three weeks out is common and survivable. He does not break bruised reeds — and neither does this program. No shame; next drill.",
    charge: "Be gentle with yourself and strict with the schedule.",
  },
  {
    daysLeft: 21,
    ref: "Proverbs 4:25-26",
    text:
      "Let thine eyes look right on, and let thine eyelids look straight before thee. Ponder the path of thy feet, and let all thy ways be established.",
    devotion:
      "Three weeks. Eyes straight ahead — not sideways at other people's progress, not backward at old misses. Ponder your path; walk your map.",
    charge: "No comparing. Your map, your next zone.",
  },
  {
    daysLeft: 20,
    ref: "Psalm 18:32",
    text: "It is God that girdeth me with strength, and maketh my way perfect.",
    devotion:
      "Halfway through the forty. The strength for the back half isn't stored in you — it's girded onto you, day by day, as needed.",
    charge: "Ask for today's strength. Just today's.",
  },

  // ———— Week four: as thy days (19–13) ————
  {
    daysLeft: 19,
    ref: "Deuteronomy 33:25",
    text: "Thy shoes shall be iron and brass; and as thy days, so shall thy strength be.",
    devotion:
      "As thy days — not as thy weeks. Strength is issued daily, like manna. Today's portion is enough for today's drills, and that's the whole deal.",
    charge: "Spend today's strength on today's work only.",
  },
  {
    daysLeft: 18,
    ref: "Psalm 119:18",
    text: "Open thou mine eyes, that I may behold wondrous things out of thy law.",
    devotion:
      "A prayer written for students of law. Ask it literally before you read today: opened eyes see the governing rule the trap is hiding.",
    charge: "Pray this verse, verbatim, before the first question.",
  },
  {
    daysLeft: 17,
    ref: "Joshua 1:8",
    text:
      "This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night, that thou mayest observe to do according to all that is written therein: for then thou shalt make thy way prosperous, and then thou shalt have good success.",
    devotion:
      "Meditate, observe, do — then good success. The order matters: success in Scripture follows obedience in the reps, not the other way around.",
    charge: "Mouth the rules as you work. Out loud is allowed.",
  },
  {
    daysLeft: 16,
    ref: "Matthew 7:24-25",
    text:
      "Therefore whosoever heareth these sayings of mine, and doeth them, I will liken him unto a wise man, which built his house upon a rock: and the rain descended, and the floods came, and the winds blew, and beat upon that house; and it fell not: for it was founded upon a rock.",
    devotion:
      "The storm is scheduled — July 28, rain guaranteed. The house that stands isn't the one that dreads the storm; it's the one built on doing, not just hearing.",
    charge: "Do one thing today you've only read about.",
  },
  {
    daysLeft: 15,
    ref: "Psalm 112:7",
    text: "He shall not be afraid of evil tidings: his heart is fixed, trusting in the LORD.",
    devotion:
      "A fixed heart isn't fearless by temperament — it's fixed by decision, renewed daily. Fix it this morning and the day's tidings lose their vote.",
    charge: "Decide once this morning; don't re-decide all day.",
  },
  {
    daysLeft: 14,
    ref: "2 Corinthians 12:9",
    text:
      "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness.",
    devotion:
      "Two weeks out, the weak spots feel loud. Good — His strength is made perfect exactly there. Weak zones repaired under grace hold better than easy ones.",
    charge: "Go straight at your weakest zone today.",
  },
  {
    daysLeft: 13,
    ref: "Psalm 143:8",
    text:
      "Cause me to hear thy lovingkindness in the morning; for in thee do I trust: cause me to know the way wherein I should walk; for I lift up my soul unto thee.",
    devotion:
      "Morning is when the day's tone is set — lovingkindness first, then the way to walk. Take the first ten minutes before the first question.",
    charge: "Word before work, even five minutes of it.",
  },

  // ———— Final stretch: quietness and confidence (12–6) ————
  {
    daysLeft: 12,
    ref: "Isaiah 30:15",
    text:
      "For thus saith the Lord GOD, the Holy One of Israel; In returning and rest shall ye be saved; in quietness and in confidence shall be your strength.",
    devotion:
      "From here on, frantic adds nothing. Quietness and confidence are not the absence of effort — they are effort without panic in it.",
    charge: "Work the plan at a walking pace. No cramming sprints.",
  },
  {
    daysLeft: 11,
    ref: "Psalm 62:6",
    text: "He only is my rock and my salvation: he is my defence; I shall not be moved.",
    devotion:
      "\"I shall not be moved\" is about the rock, not the climber. Your footing these last days is His character, not your last practice score.",
    charge: "Stand on the rock, not on yesterday's numbers.",
  },
  {
    daysLeft: 10,
    ref: "Proverbs 3:24",
    text:
      "When thou liest down, thou shalt not be afraid: yea, thou shalt lie down, and thy sleep shall be sweet.",
    devotion:
      "Ten days out, sleep is study. Sweet sleep is promised to the one who lies down — late-night cramming trades tomorrow's clarity for tonight's anxiety.",
    charge: "Hard stop tonight. In bed on time.",
  },
  {
    daysLeft: 9,
    ref: "John 16:33",
    text:
      "These things I have spoken unto you, that in me ye might have peace. In the world ye shall have tribulation: but be of good cheer; I have overcome the world.",
    devotion:
      "Tribulation is promised and so is peace — in the same sentence. The exam is in the world; your peace is in Him. Both facts can hold at once.",
    charge: "Be of good cheer on purpose today.",
  },
  {
    daysLeft: 8,
    ref: "Psalm 138:8",
    text:
      "The LORD will perfect that which concerneth me: thy mercy, O LORD, endureth for ever: forsake not the works of thine own hands.",
    devotion:
      "This season concerns you, so it concerns Him. He finishes what He starts — including the work of these forty days.",
    charge: "Trust the finished reps. Run today's retests.",
  },
  {
    daysLeft: 7,
    ref: "Exodus 33:14",
    text: "And he said, My presence shall go with thee, and I will give thee rest.",
    devotion:
      "One week. The promise for this week isn't a score — it's company. His presence goes with you into the room, both days, all six hours.",
    charge: "Light review only. Let the repairs hold.",
  },
  {
    daysLeft: 6,
    ref: "Psalm 5:3",
    text:
      "My voice shalt thou hear in the morning, O LORD; in the morning will I direct my prayer unto thee, and will look up.",
    devotion:
      "Rehearse the exam-morning liturgy now: voice up, prayer directed, eyes up. Practice the looking-up the way you practiced the questions.",
    charge: "Do tomorrow morning's routine today, as a dress rehearsal.",
  },

  // ———— Exam week (5–1) ————
  {
    daysLeft: 5,
    ref: "Isaiah 26:4",
    text: "Trust ye in the LORD for ever: for in the LORD JEHOVAH is everlasting strength.",
    devotion:
      "Everlasting strength — older than the bar exam, unbothered by it. Five days out you are not generating strength; you are drawing on it.",
    charge: "Spaced retests and rest. The heavy lifting is done.",
  },
  {
    daysLeft: 4,
    ref: "Psalm 20:7",
    text:
      "Some trust in chariots, and some in horses: but we will remember the name of the LORD our God.",
    devotion:
      "Some trust in outlines, and some in flashcards. Use the tools; trust the Name. The difference will be visible in your shoulders on Tuesday.",
    charge: "Pack your exam-day bag today, prayerfully and once.",
  },
  {
    daysLeft: 3,
    ref: "Psalm 121:8",
    text:
      "The LORD shall preserve thy going out and thy coming in from this time forth, and even for evermore.",
    devotion:
      "Going out and coming in — the drive there, the walk in, the breaks, the walk out. Every transition of both days is already covered.",
    charge: "Confirm logistics — route, ID, timing — then close the books early.",
  },
  {
    daysLeft: 2,
    ref: "Deuteronomy 31:8",
    text:
      "And the LORD, he it is that doth go before thee; he will be with thee, he will not fail thee, neither forsake thee: fear not, neither be dismayed.",
    devotion:
      "He goes before — into the exam room, ahead of you, tonight. The room is not neutral territory by the time you arrive.",
    charge: "No new material. Walk, eat well, sleep long.",
  },
  {
    daysLeft: 1,
    ref: "2 Thessalonians 3:3",
    text: "But the Lord is faithful, who shall stablish you, and keep you from evil.",
    devotion:
      "The eve. You are established — forty days of stones laid, zones repaired, prayers banked. Tonight the only assignment is to be kept.",
    charge: "Books closed by dinner. The Prayer Chain has tomorrow covered.",
  },

  // ———— The exam days ————
  {
    daysLeft: 0,
    ref: "Psalm 118:24",
    text: "This is the day which the LORD hath made; we will rejoice and be glad in it.",
    devotion:
      "Day one. This exact day was made — and you were made ready for it. People are praying for you by name, by the clock, right now.",
    charge: "Judge righteous judgment, one question at a time.",
  },
  {
    daysLeft: -1,
    ref: "Isaiah 41:13",
    text:
      "For I the LORD thy God will hold thy right hand, saying unto thee, Fear not; I will help thee.",
    devotion:
      "Day two. The hand that fills in the answers is being held. Finish the race that is set before you — the chain is still praying.",
    charge: "Strong to the last question. Then rest.",
  },
];
