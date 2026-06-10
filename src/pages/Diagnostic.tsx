import { useState } from "react";
import { diagnosticQuestions, trapMap } from "../content/diagnostic.ts";
import { brand } from "../content/brand.ts";
import { scripture } from "../content/scripture.ts";
import type { PageProps } from "../types.ts";

type Phase = "intro" | "q" | "result";

export function Diagnostic({ navigate }: PageProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const total = diagnosticQuestions.length;
  const q = diagnosticQuestions[index];
  const selected = q ? answers[q.id] : undefined;

  const select = (letter: string) => setAnswers((a) => ({ ...a, [q.id]: letter }));

  const next = () => {
    if (index + 1 < total) setIndex(index + 1);
    else setPhase("result");
  };

  return (
    <div className="diag-wrap">
      <div className="diag-header">
        <div className="diag-header-inner">
          <div className="brand" style={{ fontSize: 20 }} onClick={() => navigate("home")}>
            <span className="mark" style={{ width: 24, height: 24, fontSize: 16 }}>B</span>
            <span>
              {brand.name}
              <span className="dot" />
            </span>
          </div>
          {phase === "q" && (
            <div className="diag-progress">
              <div className="fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
            </div>
          )}
          <button className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }} onClick={() => navigate("home")}>
            Exit ✕
          </button>
        </div>
      </div>

      <div className="diag-main">
        <div className="diag-card">
          {phase === "intro" && (
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 20 }}>▌ The Diagnostic · Free</div>
              <h1 className="display display-lg" style={{ margin: "0 0 24px", maxWidth: "18ch" }}>
                Find the pattern behind your misses.
              </h1>
              <p className="body-lg" style={{ marginBottom: 16 }}>
                A short set of questions. We are not counting how many you get right — we are watching{" "}
                <em>which kind of wrong answer</em> keeps pulling you in. At the end you get Your Trap
                Map: the recurring patterns to repair first.
              </p>
              <p className="serif" style={{ fontStyle: "italic", color: "var(--muted)", marginBottom: 32 }}>
                “{scripture.hero.text}” — {scripture.hero.ref}
              </p>
              <button className="btn btn-lg red" onClick={() => setPhase("q")}>
                Begin the Diagnostic <span className="arrow">→</span>
              </button>
            </div>
          )}

          {phase === "q" && q && (
            <div>
              <div className="diag-q-num">
                <span className="pill">
                  {index + 1} / {total}
                </span>
                <span>{q.subject} · {q.subtopic}</span>
              </div>
              <p className="diag-stem">{q.stem}</p>
              <div className="diag-choices">
                {q.choices.map((c) => (
                  <div
                    key={c.letter}
                    className={`diag-choice${selected === c.letter ? " selected" : ""}`}
                    onClick={() => select(c.letter)}
                  >
                    <div className="letter">{c.letter}</div>
                    <div>{c.text}</div>
                  </div>
                ))}
              </div>
              <div className="diag-footer">
                <span className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--muted)", textTransform: "uppercase" }}>
                  Pick the answer you would choose under pressure
                </span>
                <button className="btn btn-lg red" disabled={!selected} onClick={next} style={{ opacity: selected ? 1 : 0.4 }}>
                  {index + 1 < total ? "Next" : "See My Trap Map"} <span className="arrow">→</span>
                </button>
              </div>
            </div>
          )}

          {phase === "result" && (
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 20 }}>▌ Your Trap Map</div>
              <h1 className="display display-lg" style={{ margin: "0 0 16px", maxWidth: "20ch" }}>
                These are the patterns to repair first.
              </h1>
              <p className="body-lg" style={{ marginBottom: 32 }}>
                Your misses are not random. They cluster on a few recurring trap patterns — the
                counterfeits that keep taking your points. The Repair Path drills these in order.
              </p>
              <div className="trap-list">
                {trapMap.map((t) => (
                  <div className="trap-row" key={t.rank}>
                    <div className="rank">{t.rank}</div>
                    <div>
                      <div className="name">{t.name}</div>
                      <div className="meta">{t.subject} · {t.drillCount} Repair Drills</div>
                    </div>
                    <div className={`severity ${t.severity}`}>{t.severity}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap" }}>
                <button className="btn btn-lg red" onClick={() => navigate("pricing")}>
                  Enter the Repair Path <span className="arrow">→</span>
                </button>
                <button className="btn btn-lg ghost" onClick={() => navigate("how-it-works")}>
                  See the TEAR Method
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
