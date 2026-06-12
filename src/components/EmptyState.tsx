import type { Route } from "../types.ts";

interface EmptyStateProps {
  title: string;
  body?: string;
  cta?: { label: string; route: Route };
  onNavigate?: (route: Route) => void;
}

export function EmptyState({ title, body, cta, onNavigate }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      {body && <p>{body}</p>}
      {cta && onNavigate && (
        <button className="btn red btn-sm" onClick={() => onNavigate(cta.route)}>
          {cta.label} <span className="arrow">→</span>
        </button>
      )}
    </div>
  );
}
