import type { Subject } from "../lib/subjects.ts";
import { SubjectBadge } from "./SubjectBadge.tsx";

interface PersonalMatrixProps {
  matrix: { cols: string[]; rows: Array<{ subject: Subject | string; heat: number[] }> };
  onHotCell?: (subject: Subject | string, col: string) => void;
}

export function PersonalMatrix({ matrix, onHotCell }: PersonalMatrixProps) {
  return (
    <section className="component-card personal-matrix">
      <div className="dashboard-panel-label">Personal matrix</div>
      <div className="personal-matrix-grid" style={{ gridTemplateColumns: `140px repeat(${matrix.cols.length}, minmax(42px, 1fr))` }}>
        <div />
        {matrix.cols.map((col) => <div className="col" key={col}>{col}</div>)}
        {matrix.rows.map((row) => (
          <>
            <div className="row-label" key={`${row.subject}-label`}><SubjectBadge subject={row.subject} size="sm" /></div>
            {matrix.cols.map((col, i) => {
              const heat = Math.max(0, Math.min(5, row.heat[i] ?? 0));
              return (
                <button
                  key={`${row.subject}-${col}`}
                  className={`matrix-cell h${heat}`}
                  onClick={() => heat >= 3 && onHotCell?.(row.subject, col)}
                  title={`${row.subject} · ${col} · ${heat}`}
                >
                  {heat}
                </button>
              );
            })}
          </>
        ))}
      </div>
    </section>
  );
}
