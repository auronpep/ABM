import type { TrapDetail as TrapDetailData } from "../lib/api-client.ts";
import type { Route } from "../types.ts";
import { Markdown } from "../lib/markdown.tsx";
import { SubjectBadge } from "./SubjectBadge.tsx";

interface TrapDetailProps {
  trap: TrapDetailData;
  onNavigate: (route: Route) => void;
}

export function TrapDetail({ trap, onNavigate }: TrapDetailProps) {
  return (
    <article className="knowledge-detail">
      <div className="knowledge-card-top">
        <SubjectBadge subject={trap.subject} />
        <span className="mono">{trap.kind}</span>
      </div>
      <h1 className="display display-md">{trap.name ?? trap.slug}</h1>
      <section>
        <h2>Why it pulls</h2>
        <Markdown text={trap.whyItPulls} />
      </section>
      <section>
        <h2>Failure mode</h2>
        <Markdown text={trap.failureMode} />
      </section>
      <section>
        <h2>Example wrong answers</h2>
        {trap.exampleWrongAnswers.length === 0 ? (
          <p>No examples are published for this trap yet.</p>
        ) : (
          trap.exampleWrongAnswers.map((answer) => <p key={answer} className="knowledge-row">{answer}</p>)
        )}
      </section>
      <button className="btn red btn-lg" onClick={() => onNavigate(trap.assignedDrillRoute ?? "repair")}>
        Run assigned drill <span className="arrow">→</span>
      </button>
    </article>
  );
}
