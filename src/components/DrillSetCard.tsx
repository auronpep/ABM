import type { Route } from "../types.ts";

interface DrillSetCardProps {
  drillSet: { name: string; count: number; zone?: string; route: Route };
  onNavigate?: (route: Route) => void;
}

export function DrillSetCard({ drillSet, onNavigate }: DrillSetCardProps) {
  return (
    <div className="knowledge-card">
      <div className="knowledge-card-top">
        <span className="mono">{drillSet.count} questions</span>
        {drillSet.zone && <span className="mono">{drillSet.zone}</span>}
      </div>
      <h3>{drillSet.name}</h3>
      {onNavigate && (
        <button className="btn red btn-sm" onClick={() => onNavigate(drillSet.route)}>
          Start <span className="arrow">→</span>
        </button>
      )}
    </div>
  );
}
