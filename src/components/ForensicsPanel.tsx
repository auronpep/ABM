import { KeyCard } from "./KeyCard.tsx";

export interface ForensicsPayload {
  correct: boolean;
  selected?: string | null;
  correctAnswer?: string | null;
  resultLabel?: string | null;
  counterfeit?: string | null;
  whyAttractive?: string | null;
  whyWrong?: string | null;
  whyCorrect?: string | null;
  futureCue?: string | null;
  key?: { kind: "gold" | "silver"; text: string; label?: string } | null;
  repairLogged?: boolean;
  cohortPct?: number | null;
}

interface ForensicsPanelProps {
  forensics: ForensicsPayload;
  onNext: () => void;
  isLast: boolean;
}

export function ForensicsPanel({ forensics, onNext, isLast }: ForensicsPanelProps) {
  const key =
    forensics.key ??
    (forensics.futureCue
      ? { kind: "silver" as const, text: forensics.futureCue, label: "Next time" }
      : null);

  return (
    <section className="forensics-panel">
      <div className={`forensics-result ${forensics.correct ? "good" : "bad"}`}>
        <div className="mono label">1 · Test</div>
        <p>
          {forensics.resultLabel ??
            (forensics.correct
              ? "True and responsive. You kept the point."
              : "A counterfeit pulled the answer off course.")}
        </p>
      </div>

      <div className="forensics-stage">
        <div className="mono label">2 · Expose</div>
        {forensics.cohortPct !== null && forensics.cohortPct !== undefined && (
          <p className="mono cohort-slot">{Math.round(forensics.cohortPct)}% of prior cohorts chose this answer.</p>
        )}
        {forensics.counterfeit && <h3>{forensics.counterfeit}</h3>}
        {forensics.whyAttractive && <p>{forensics.whyAttractive}</p>}
        {forensics.whyWrong && <p>{forensics.whyWrong}</p>}
        {forensics.whyCorrect && <p>{forensics.whyCorrect}</p>}
      </div>

      <div className="forensics-stage">
        <div className="mono label">3 · Apply</div>
        {key ? (
          <KeyCard kind={key.kind} text={key.text} label={key.label} />
        ) : (
          <p>The controlling move is logged with this attempt.</p>
        )}
      </div>

      <div className="forensics-stage">
        <div className="mono label">4 · Repair</div>
        <p>
          {forensics.repairLogged === false
            ? "This attempt is visible now; repair logging will sync when the account is available."
            : "Pattern logged. Take the next assigned step from the dashboard spine."}
        </p>
        <button className="btn red btn-lg" onClick={onNext}>
          {isLast ? "Finish" : "Next"} <span className="arrow">→</span>
        </button>
      </div>
    </section>
  );
}
