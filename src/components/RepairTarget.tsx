import type { RedZone } from "../lib/api-client.ts";
import type { Route } from "../types.ts";
import { SubjectBadge } from "./SubjectBadge.tsx";

interface RepairTargetProps {
  zone: RedZone | null;
  onNavigate?: (route: Route) => void;
}

export function RepairTarget({ zone, onNavigate }: RepairTargetProps) {
  if (!zone) {
    return (
      <section className="component-card">
        <div className="dashboard-panel-label">Repair target</div>
        <p>No active repair targets. Keep practicing.</p>
      </section>
    );
  }
  return (
    <section className="component-card repair-target">
      <div className="dashboard-panel-label">Repair target</div>
      <SubjectBadge subject={zone.subject} />
      <h2>{zone.name}</h2>
      <p>{zone.proficiencyPct}% proficiency</p>
      {zone.lastMissSubject && <p className="mono">Last miss: {zone.lastMissSubject}</p>}
      {onNavigate && (
        <button className="btn red btn-sm" onClick={() => onNavigate(zone.route ?? "repair")}>
          Repair <span className="arrow">→</span>
        </button>
      )}
    </section>
  );
}
