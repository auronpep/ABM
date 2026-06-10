// Scripture system — verses are structural, not decorative (VISION_LOCK).
// KJV text (public domain). Each entry pairs a reference with a concise application caption.

export interface Verse {
  ref: string;
  text: string;
  caption: string;
}

export const scripture = {
  hero: {
    ref: "John 7:24",
    text: "Judge not according to the appearance, but judge righteous judgment.",
    caption:
      "The wrong answer wins on appearance. Discernment is learning to judge by the governing rule instead.",
  },
  method: {
    ref: "Hebrews 5:14",
    text:
      "But strong meat belongeth to them that are of full age, even those who by reason of use have their senses exercised to discern both good and evil.",
    caption: "Discernment is trained by practice — repetition aimed at the pattern, not the pile.",
  },
  work: {
    ref: "Colossians 3:23",
    text: "And whatsoever ye do, do it heartily, as to the Lord, and not unto men.",
    caption: "Disciplined study is worship when it is offered before the Lord.",
  },
  community: {
    ref: "Joshua 1:9",
    text:
      "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",
    caption: "",
  },
  support: {
    ref: "Galatians 6:2",
    text: "Bear ye one another's burdens, and so fulfil the law of Christ.",
    caption: "",
  },
  pricing: {
    ref: "Proverbs 4:7",
    text:
      "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding.",
    caption: "",
  },
  anxiety: {
    ref: "Matthew 11:28",
    text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
    caption: "",
  },
  finalCta: {
    ref: "Hebrews 12:1-2",
    text:
      "Let us run with patience the race that is set before us, looking unto Jesus the author and finisher of our faith.",
    caption: "",
  },
} as const satisfies Record<string, Verse>;
