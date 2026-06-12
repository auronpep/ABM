interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = total <= 0 ? 0 : Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="progress-bar">
      <div className="progress-meta mono">
        <span>{label ?? "Progress"}</span>
        <span>
          {current} of {total}
        </span>
      </div>
      <div className="track">
        <div className="fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
