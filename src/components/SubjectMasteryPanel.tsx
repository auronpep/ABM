import type { Subject } from "../lib/subjects.ts";
import { SubjectBadge } from "./SubjectBadge.tsx";

interface SubjectMasteryPanelProps {
  subjects: Array<{ subject: Subject | string; pct: number; delta: number }>;
  onOpenSubject?: (subject: Subject | string) => void;
}

export function SubjectMasteryPanel({ subjects, onOpenSubject }: SubjectMasteryPanelProps) {
  return (
    <section className="component-card">
      <div className="dashboard-panel-label">Subject mastery</div>
      {subjects.map((row) => (
        <button className="mastery-row" key={row.subject} onClick={() => onOpenSubject?.(row.subject)}>
          <SubjectBadge subject={row.subject} size="sm" />
          <span>{Math.round(row.pct)}%</span>
          <span className={row.delta >= 0 ? "trend up" : "trend down"}>{row.delta >= 0 ? "↑" : "↓"} {Math.abs(row.delta)}</span>
        </button>
      ))}
    </section>
  );
}
