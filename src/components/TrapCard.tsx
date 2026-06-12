import type { TrapSummary } from "../lib/api-client.ts";
import { SubjectBadge } from "./SubjectBadge.tsx";

interface TrapCardProps {
  trap: TrapSummary;
  onOpen: (slug: string) => void;
}

export function TrapCard({ trap, onOpen }: TrapCardProps) {
  return (
    <button className="knowledge-card" onClick={() => onOpen(trap.slug)}>
      <div className="knowledge-card-top">
        <SubjectBadge subject={trap.subject} size="sm" />
        <span className="mono">{trap.kind}</span>
      </div>
      <h3>{trap.name ?? trap.slug}</h3>
      <p>{trap.pullCount} observed pulls in the bank.</p>
      <span className="knowledge-card-cta">Open trap <span className="arrow">→</span></span>
    </button>
  );
}
