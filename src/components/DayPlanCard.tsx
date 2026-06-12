import type { DayPlanStep } from "../lib/api-client.ts";
import type { Route } from "../types.ts";

interface DayPlanCardProps {
  step: DayPlanStep;
  onNavigate?: (route: Route) => void;
}

export function DayPlanCard({ step, onNavigate }: DayPlanCardProps) {
  return (
    <section className="dashboard-today component-card">
      <div className="dashboard-panel-label">Today's step</div>
      <h2>{step.title}</h2>
      {step.reason && <p>{step.reason}</p>}
      <div className="dashboard-today-meta">
        <span>{step.kind}</span>
        {step.estimate && <span>{step.estimate}</span>}
      </div>
      {onNavigate && (
        <button className="btn red btn-lg" onClick={() => onNavigate(step.route)}>
          Resume <span className="arrow">→</span>
        </button>
      )}
    </section>
  );
}
