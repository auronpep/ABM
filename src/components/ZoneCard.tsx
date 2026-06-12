import type { RedZone } from "../lib/api-client.ts";
import type { Route } from "../types.ts";
import { SubjectBadge } from "./SubjectBadge.tsx";

interface ZoneCardProps {
  zone: RedZone;
  onNavigate?: (route: Route) => void;
}

export function ZoneCard({ zone, onNavigate }: ZoneCardProps) {
  return (
    <div className="knowledge-card">
      <div className="knowledge-card-top">
        <SubjectBadge subject={zone.subject} size="sm" />
        <span className="mono">{zone.proficiencyPct}%</span>
      </div>
      <h3>{zone.name}</h3>
      <p>{zone.highConfidenceMisses ?? 0} high-confidence misses</p>
      {onNavigate && (
        <button className="btn ghost btn-sm" onClick={() => onNavigate(zone.route ?? "repair")}>
          Open repair
        </button>
      )}
    </div>
  );
}
