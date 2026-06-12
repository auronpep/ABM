const CONFIDENCE_LABELS: Record<number, string> = {
  1: "Guessing",
  2: "Unsure",
  3: "Felt it",
  4: "Confident",
  5: "Certain",
};

interface ConfidenceSelectorProps {
  value: number | null;
  onChange: (n: number) => void;
}

export function ConfidenceSelector({ value, onChange }: ConfidenceSelectorProps) {
  return (
    <div className="confidence-row">
      <span className="label">Confidence</span>
      <div className="confidence-pips" role="radiogroup" aria-label="Confidence">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`conf-pip${value === n ? " selected" : ""}`}
            aria-checked={value === n}
            role="radio"
            title={`${n} · ${CONFIDENCE_LABELS[n]}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <span className="mono confidence-label">{value ? CONFIDENCE_LABELS[value] : "Pick after answering"}</span>
    </div>
  );
}
