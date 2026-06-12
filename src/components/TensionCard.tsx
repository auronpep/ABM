import type { TensionSummary } from "../lib/api-client.ts";
import { SubjectBadge } from "./SubjectBadge.tsx";

interface TensionCardProps {
  tension: TensionSummary;
  onOpen: (slug: string) => void;
}

export function TensionCard({ tension, onOpen }: TensionCardProps) {
  return (
    <button className="knowledge-card" onClick={() => onOpen(tension.slug)}>
      <div className="knowledge-card-top">
        <SubjectBadge subject={tension.subject} size="sm" />
        <span className="mono">{tension.questionCount} questions</span>
      </div>
      <h3>{tension.headline}</h3>
      <p>{tension.official}</p>
      <span className="knowledge-card-cta">Open tension <span className="arrow">→</span></span>
    </button>
  );
}
