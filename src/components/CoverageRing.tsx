interface CoverageRingProps {
  percent: number;
  label?: string;
}

export function CoverageRing({ percent, label = "TEAR coverage" }: CoverageRingProps) {
  const safe = Math.max(0, Math.min(100, percent));
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (safe / 100) * circumference;
  return (
    <div className="coverage-ring" aria-label={`${label}: ${Math.round(safe)}%`}>
      <svg viewBox="0 0 100 100" role="img">
        <circle cx="50" cy="50" r="42" className="bg" />
        <circle cx="50" cy="50" r="42" className="fg" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div>
        <strong>{Math.round(safe)}%</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
