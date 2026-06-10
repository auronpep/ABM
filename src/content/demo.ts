// Hero demo — CQ14586 "The Barnabas Trap".
// Source (read-only, attorney review pending before public deploy):
//   \\Praisejesus\c\CCG\Finished\CQ14586.md
// Official key = B. Dominant trap = A. Pick-rate percentages are intentionally NOT exposed.

export interface DemoChoice {
  letter: "A" | "B" | "C" | "D";
  text: string;
  correct: boolean;
  trapTag?: string;
}

export interface TearRow {
  step: "Test" | "Expose" | "Apply" | "Repair";
  text: string;
}

export interface ForensicsQuestion {
  id: string;
  label: string;
  subject: string;
  subtopic: string;
  tension: string;
  difficulty: string;
  stem: string;
  choices: DemoChoice[];
  autoPick: DemoChoice["letter"];
  trapNames: string[];
  whyAlmost: string;
  correctSummary: string;
  tear: TearRow[];
  repairBrief: string;
}

export const barnabasDemo: ForensicsQuestion = {
  id: "CQ14586",
  label: "The Barnabas Trap",
  subject: "Criminal Procedure",
  subtopic: "5th Am. · Act of Production",
  tension: "Voluntary creation × compelled authentication",
  difficulty: "Hard",
  stem:
    "Barnabas, an associate pastor, keeps a private handwritten prayer journal in which he allegedly recorded disputed financial dates. A federal grand jury issues a subpoena ordering him to hand over the physical journal; the subpoena requires no testimony, only the journal itself. Barnabas refuses and asserts his Fifth Amendment privilege.\n\nUnder what circumstances, if any, may the grand jury compel production of the journal?",
  choices: [
    {
      letter: "A",
      text:
        "It may compel production without granting immunity, because Barnabas was not compelled by the government to write the entries in the journal.",
      correct: false,
      trapTag: "Half-Truth Override",
    },
    {
      letter: "B",
      text:
        "It may compel production only if Barnabas is granted use and derivative-use immunity regarding the act of production.",
      correct: true,
    },
    {
      letter: "C",
      text:
        "It may compel production only if Barnabas is granted transactional immunity regarding the underlying conspiracy.",
      correct: false,
      trapTag: "Overclaim of Range",
    },
    {
      letter: "D",
      text:
        "It may not compel production of an intimate, private religious journal under any circumstances.",
      correct: false,
      trapTag: "Sacred Detail Override",
    },
  ],
  autoPick: "A",
  trapNames: ["Creation / Production Collapse", "Half-Truth Override"],
  whyAlmost:
    "Choice A tells part of the truth: Barnabas was not forced to write the journal, so its contents are not protected. But it quietly skips the second issue: handing the journal over under subpoena is itself testimony that the journal exists, is in his possession, and is authentic.",
  correctSummary:
    "B is correct. The act of production is compelled and testimonial, so it may be compelled only with use and derivative-use immunity for that act.",
  tear: [
    { step: "Test", text: "Is A answering the whole call, or only the part about who wrote the journal?" },
    { step: "Expose", text: "A fixes on voluntary creation and ignores the compelled act of producing the document." },
    { step: "Apply", text: "Producing the journal authenticates it, which is a testimonial act requiring use/derivative-use immunity." },
    { step: "Repair", text: "Drill the pattern: half-true answers that skip the decisive legal condition." },
  ],
  repairBrief: "Repair Brief: Subpoenas vs. Act-of-Production Immunity",
};
