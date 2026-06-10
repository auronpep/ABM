// The Barnabas Trap — interactive wrong-answer forensics demo.
// Autoplays the dominant trap (A), reveals the credited answer (B), then runs the
// TEAR breakdown. Pick-rate percentages are deliberately never shown (VISION_LOCK).
import { useEffect, useState } from "react";
import { barnabasDemo } from "../content/demo.ts";

type Phase = "stem" | "picking" | "revealed" | "forensics";

interface Props {
  autoplay?: boolean;
}

export function ForensicsDemo({ autoplay = true }: Props) {
  const q = barnabasDemo;
  const [phase, setPhase] = useState<Phase>("stem");
  const [picked, setPicked] = useState<string | null>(null);
  const [visibleTearCount, setVisibleTearCount] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    const timers = [
      setTimeout(() => {
        setPhase("picking");
        setPicked(q.autoPick);
      }, 2000),
      setTimeout(() => setPhase("revealed"), 3400),
      setTimeout(() => setPhase("forensics"), 4800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [autoplay, q.autoPick]);

  // Sequential reveal animation for the TEAR steps
  useEffect(() => {
    if (phase === "forensics") {
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setVisibleTearCount(count);
        if (count >= 4) clearInterval(interval);
      }, 800);
      return () => clearInterval(interval);
    } else {
      setVisibleTearCount(0);
    }
  }, [phase]);

  const handlePick = (letter: string) => {
    if (phase !== "stem" && phase !== "picking") return;
    setPicked(letter);
    setPhase("revealed");
    setTimeout(() => setPhase("forensics"), 700);
  };

  const replay = () => {
    setPhase("stem");
    setPicked(null);
    setVisibleTearCount(0);
    if (autoplay) {
      setTimeout(() => {
        setPhase("picking");
        setPicked(q.autoPick);
        setTimeout(() => setPhase("revealed"), 1300);
        setTimeout(() => setPhase("forensics"), 2600);
      }, 400);
    }
  };

  const showResult = phase === "revealed" || phase === "forensics";
  const showForensics = phase === "forensics";
  const pickedChoice = picked ? q.choices.find((c) => c.letter === picked) : null;
  const pickedWrong = pickedChoice && !pickedChoice.correct;

  const meta: [string, string][] = [
    ["Subject", q.subject],
    ["Subtopic", q.subtopic],
    ["Tension", q.tension],
    ["Difficulty", q.difficulty],
  ];

  return (
    <div className="barnabas-demo-wrap">
      <div className="barnabas-demo-header">
        <span>
          <span className="live-dot" /> Live Forensics · Demo
        </span>
        <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span>{q.id}</span>
          <button
            onClick={replay}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--bg)",
              opacity: 0.6,
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "3px 8px",
            }}
          >
            ↻ Replay
          </button>
        </span>
      </div>

      <div className="barnabas-demo-body">
        <div className="q-meta">
          {meta.map(([k, v]) => (
            <div key={k}>
              <div className="k">{k}</div>
              <div className="v">{v}</div>
            </div>
          ))}
        </div>

        <p className="q-stem">{q.stem}</p>

        <div className="choices">
          {q.choices.map((c) => {
            const isPicked = picked === c.letter;
            const cls = ["choice"];
            if (showResult) {
              if (c.correct) cls.push("correct");
              else if (isPicked) cls.push("picked");
              else cls.push("dim");
            } else if (isPicked) {
              cls.push("picked");
            }
            return (
              <div key={c.letter} className={cls.join(" ")} onClick={() => handlePick(c.letter)}>
                <div className="letter">{c.letter}</div>
                <div className="text">{c.text}</div>
              </div>
            );
          })}
        </div>

        {showForensics && pickedWrong && (
          <div
            style={{
              marginTop: 24,
              borderTop: "2px solid var(--red)",
              paddingTop: 22,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--red)",
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              ▌ Why this answer almost worked
            </div>

            <div className="tags-row" style={{ marginBottom: 16 }}>
              {pickedChoice?.trapTag && <span className="tag red">▸ {pickedChoice.trapTag}</span>}
              {q.trapNames.map((t) => (
                <span key={t} className="tag" style={{ borderColor: "rgba(255,255,255,0.3)", color: "rgba(246,243,236,0.8)" }}>
                  {t}
                </span>
              ))}
            </div>

            <p
              style={{
                fontFamily: "var(--serif)",
                fontSize: 15,
                lineHeight: 1.55,
                color: "rgba(246,243,236,0.9)",
                margin: "0 0 18px",
              }}
            >
              {q.whyAlmost}
            </p>

            <div className="tear-breakdown">
              {q.tear.map((row, i) => {
                const isVisible = i < visibleTearCount;
                return (
                  <div
                    className="row"
                    key={row.step}
                    style={{
                      opacity: isVisible ? 1 : 0.05,
                      transform: isVisible ? "translateY(0)" : "translateY(8px)",
                      transition: "opacity 500ms ease, transform 500ms ease",
                    }}
                  >
                    <div className="step">{row.step}</div>
                    <div className="txt">{row.text}</div>
                  </div>
                );
              })}
            </div>

            <p
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 14,
                lineHeight: 1.5,
                color: "rgba(246,243,236,0.7)",
                margin: "18px 0 0",
              }}
            >
              {q.correctSummary}
            </p>

            <div className="repair-cta" style={{ marginTop: 20 }}>
              <div>
                <div className="label">Assigned Repair</div>
                <div className="drill-name">{q.repairBrief}</div>
              </div>
              <div className="arrow">→</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
