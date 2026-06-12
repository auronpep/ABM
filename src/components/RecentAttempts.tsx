import type { RecentAttempt } from "../lib/api-client.ts";
import { SubjectBadge } from "./SubjectBadge.tsx";

interface RecentAttemptsProps {
  attempts: RecentAttempt[];
}

export function RecentAttempts({ attempts }: RecentAttemptsProps) {
  return (
    <section className="component-card">
      <div className="dashboard-panel-label">Recent attempts</div>
      {attempts.length === 0 ? <p>No attempts yet.</p> : attempts.map((attempt) => (
        <div className="attempt-row" key={attempt.id}>
          <SubjectBadge subject={attempt.subject} size="sm" />
          <span className={attempt.correct ? "correct" : "wrong"}>{attempt.correct ? "Correct" : "Wrong"}</span>
          <span className="mono">{attempt.timeSpentSec}s</span>
          <span>{attempt.preview}</span>
        </div>
      ))}
    </section>
  );
}
