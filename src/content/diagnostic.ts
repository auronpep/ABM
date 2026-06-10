// Diagnostic flow — ported from the prior site's data.js (fact patterns already use
// biblical names). Result framing relabeled Red-Zone -> Trap Map per VISION_LOCK.

export interface DiagChoice {
  letter: "A" | "B" | "C" | "D";
  text: string;
  correct: boolean;
  trapTag: string | null;
}

export interface DiagQuestion {
  id: string;
  subject: string;
  subtopic: string;
  stem: string;
  choices: DiagChoice[];
}

export const diagnosticQuestions: DiagQuestion[] = [
  {
    id: "POE-CALMAP-001",
    subject: "Evidence",
    subtopic: "Roles of judge and jury",
    stem: "In a federal civil trial, Moses offers a note written by Ruth shortly after a collision, stating, “The blue truck ran the red light.” Moses argues the note is an excited utterance. To prove Ruth was still under stress when she wrote it, Moses offers the judge a sworn statement from an EMT who is not present at trial. Rebekah objects that the sworn statement is hearsay.\n\nWho should decide whether Ruth’s note qualifies as an excited utterance, and may the sworn statement be considered for that purpose?",
    choices: [
      { letter: "A", text: "The jury should decide the foundation issue, and it may consider the sworn statement.", correct: false, trapTag: "decisionmaker-inversion" },
      { letter: "B", text: "The jury should decide the foundation issue, but it may not consider the sworn statement.", correct: false, trapTag: "wrong-decisionmaker" },
      { letter: "C", text: "The judge should decide the foundation issue, and may consider the sworn statement.", correct: true, trapTag: null },
      { letter: "D", text: "The judge should decide the foundation issue, but may not consider the sworn statement.", correct: false, trapTag: "categorical-error" },
    ],
  },
  {
    id: "POE-CALMAP-002",
    subject: "Evidence",
    subtopic: "Authentication",
    stem: "In a federal robbery trial, the prosecutor offers a surveillance video that allegedly shows Aaron entering a store five minutes before the robbery. The store manager testifies that the camera automatically records the entrance, that the video came from that camera, and that the timestamp matches the store’s system. Aaron argues the video might have been edited and should not go to the jury unless the judge first finds it authentic by a preponderance.\n\nHow should the court rule?",
    choices: [
      { letter: "A", text: "Exclude the video unless the judge finds by a preponderance that it is authentic.", correct: false, trapTag: "decisionmaker-inversion" },
      { letter: "B", text: "Admit the video if there is evidence sufficient for a reasonable juror to find it is what the prosecutor claims.", correct: true, trapTag: null },
      { letter: "C", text: "Admit the video only if Aaron first cross-examines the person who installed the camera.", correct: false, trapTag: "rules-bound-trap" },
      { letter: "D", text: "Exclude the video because any possibility of editing makes authentication impossible.", correct: false, trapTag: "categorical-error" },
    ],
  },
  {
    id: "POE-CALMAP-003",
    subject: "Evidence",
    subtopic: "Preliminary questions",
    stem: "In a federal burglary prosecution, the government plans to call an officer to testify that Samuel confessed after arrest. Before the officer testifies, Samuel objects that he was interrogated without Miranda warnings and asks for a hearing outside the jury’s presence.\n\nHow should the court proceed?",
    choices: [
      { letter: "A", text: "Deny the request because a confession by a party-opponent is not hearsay.", correct: false, trapTag: "non-responsive" },
      { letter: "B", text: "Grant the request because the admissibility of the confession must be determined outside the jury’s hearing.", correct: true, trapTag: null },
      { letter: "C", text: "Allow the officer to testify and instruct the jury to disregard the confession if it finds no warnings were given.", correct: false, trapTag: "rules-bound-trap" },
      { letter: "D", text: "Submit the Miranda issue to the jury because voluntariness is always a jury question.", correct: false, trapTag: "categorical-error" },
    ],
  },
  {
    id: "POE-CALMAP-004",
    subject: "Evidence",
    subtopic: "Expert qualification",
    stem: "In a products-liability case, Sarah offers Deborah as an expert on brake design. Deborah’s résumé shows twenty years designing commercial braking systems. Isaac objects that the résumé contains hearsay and that the jury, not the judge, should decide whether Deborah is qualified.\n\nWho decides whether Deborah is qualified to testify as an expert?",
    choices: [
      { letter: "A", text: "The judge decides qualification and may consider the résumé for that preliminary purpose.", correct: true, trapTag: null },
      { letter: "B", text: "The judge decides qualification but may consider only evidence admissible under the hearsay rules.", correct: false, trapTag: "wrong-decisionmaker" },
      { letter: "C", text: "The jury decides qualification because expert credibility is always for the jury.", correct: false, trapTag: "rules-bound-trap" },
      { letter: "D", text: "The jury decides qualification unless both parties agree the judge may decide it.", correct: false, trapTag: "categorical-error" },
    ],
  },
  {
    id: "POE-CALMAP-005",
    subject: "Evidence",
    subtopic: "Witness competency",
    stem: "In a federal assault trial, the prosecution calls Miriam, age seven, who says she saw David strike Peter. Before she testifies, defense counsel asks the court to determine whether Miriam understands the duty to tell the truth. The court questions her outside the jury’s hearing and finds she can answer simple questions and understands that lying is wrong.\n\nShould Miriam be permitted to testify?",
    choices: [
      { letter: "A", text: "No, because children under ten are incompetent as a matter of law.", correct: false, trapTag: "categorical-error" },
      { letter: "B", text: "No, because the jury, not the judge, must decide witness competency.", correct: false, trapTag: "wrong-decisionmaker" },
      { letter: "C", text: "Yes, if the judge finds she has sufficient capacity and personal knowledge; the jury may then weigh her credibility.", correct: true, trapTag: null },
      { letter: "D", text: "Yes, but only if her testimony is corroborated by an adult witness.", correct: false, trapTag: "categorical-error" },
    ],
  },
];

// Trap Map surfaced after the diagnostic (formerly "Red-Zone Map").
export interface TrapMapEntry {
  rank: number;
  name: string;
  subject: string;
  drillCount: number;
  severity: "high" | "med";
}

export const trapMap: TrapMapEntry[] = [
  { rank: 1, name: "Decisionmaker Inversion", subject: "Evidence", drillCount: 11, severity: "high" },
  { rank: 2, name: "Half-Truth Override", subject: "Criminal Procedure", drillCount: 9, severity: "high" },
  { rank: 3, name: "Stale Common-Law Default", subject: "Contracts × Property", drillCount: 8, severity: "med" },
  { rank: 4, name: "Categorical Overclaim", subject: "Con Law", drillCount: 7, severity: "med" },
  { rank: 5, name: "Rules-Bound Trap", subject: "Evidence", drillCount: 6, severity: "med" },
];
