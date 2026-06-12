import type { TensionDetail as TensionDetailData } from "../lib/api-client.ts";
import type { Route } from "../types.ts";
import { Markdown } from "../lib/markdown.tsx";
import { SubjectBadge } from "./SubjectBadge.tsx";

interface TensionDetailProps {
  tension: TensionDetailData;
  onNavigate: (route: Route) => void;
}

export function TensionDetail({ tension, onNavigate }: TensionDetailProps) {
  return (
    <article className="knowledge-detail">
      <div className="knowledge-card-top">
        <SubjectBadge subject={tension.subject} />
        <span className="mono">{tension.questionCount} questions</span>
      </div>
      <h1 className="display display-md">{tension.headline}</h1>
      <p className="body-lg">{tension.official}</p>
      <Markdown text={tension.collision} />
      <section>
        <h2>Example questions</h2>
        {tension.examples.length === 0 ? (
          <p>No examples are published for this tension yet.</p>
        ) : (
          tension.examples.map((q) => <p key={q.id} className="knowledge-row">{q.title}</p>)
        )}
      </section>
      <button className="btn red btn-lg" onClick={() => onNavigate(tension.assignedDrillRoute ?? "repair")}>
        Run assigned drill <span className="arrow">→</span>
      </button>
    </article>
  );
}
