// The full diagnostic — funnel Screen 3 (existing flow, instrumented) feeding
// Screen 4 (Red-Zone reveal). Questions come from the live curated bank.
import { useEffect, useRef, useState } from "react";
import { brand } from "../content/brand.ts";
import { scripture } from "../content/scripture.ts";
import {
  CURATED_DIAGNOSTIC_IDS,
  filterForMold,
  trapLabelForMold,
} from "../content/curated-diagnostic.ts";
import { MINI_RESULT_KEY } from "../components/MiniDiagnostic.tsx";
import { RedZoneReveal } from "../components/RedZoneReveal.tsx";
import { VerseLine } from "../components/VerseLine.tsx";
import { synthesizeZones } from "../funnel/zones.ts";
import { track } from "../lib/events.ts";
import { markStateChanged } from "../lib/sync.ts";
import type { MiniResult, MissRecord } from "../funnel/types.ts";
import type { PageProps } from "../types.ts";

type Phase = "intro" | "q" | "result";

interface DiagChoiceSignal {
  mold: string | null;
}

interface DiagQuestion {
  id: string;
  title: string;
  subject: string;
  stem: string;
  call: string | null;
  choices: Record<string, string>;
  key: string;
  choiceSignals: Record<string, DiagChoiceSignal | null>;
  silverKeys: Array<{ statement: string | null }>;
}

const LETTERS = ["A", "B", "C", "D"] as const;

export const REDZONE_MAP_KEY = "bm_redzone_map";

function readMiniResult(): MiniResult | null {
  try {
    const raw = sessionStorage.getItem(MINI_RESULT_KEY);
    return raw ? (JSON.parse(raw) as MiniResult) : null;
  } catch {
    return null;
  }
}

export function Diagnostic({ navigate }: PageProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<DiagQuestion[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [misses, setMisses] = useState<MissRecord[]>([]);
  const startedAtRef = useRef<number | null>(null);
  const startEventFiredRef = useRef(false);

  useEffect(() => {
    Promise.all(
      CURATED_DIAGNOSTIC_IDS.map((id) =>
        fetch(`/qdata/${id}.json`).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status} loading ${id}`);
          return r.json() as Promise<DiagQuestion>;
        }),
      ),
    )
      .then(setQuestions)
      .catch((e: unknown) =>
        setLoadError(e instanceof Error ? e.message : "Failed to load the diagnostic"),
      );
  }, []);

  const total = CURATED_DIAGNOSTIC_IDS.length;
  const q = questions?.[index];
  const selected = q ? answers[q.id] : undefined;

  useEffect(() => {
    if (phase === "q" && q && !startEventFiredRef.current) {
      startEventFiredRef.current = true;
      startedAtRef.current = Date.now();
      const mini = readMiniResult();
      track("full_diag_start", {
        mini_score: mini ? mini.score : null,
        mini_missed_instincts: mini ? mini.missedInstincts : [],
      });
    }
  }, [phase, q]);

  const select = (letter: string) => {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: letter }));
  };

  const finish = (finalAnswers: Record<string, string>) => {
    if (!questions) return;
    const missRecords: MissRecord[] = questions
      .filter((question) => finalAnswers[question.id] !== question.key)
      .map((question) => {
        const picked = finalAnswers[question.id] as MissRecord["picked"];
        const mold = question.choiceSignals?.[picked]?.mold ?? "unclassified";
        return {
          qid: question.id,
          title: question.title,
          subject: question.subject,
          picked,
          trapName: trapLabelForMold(mold),
          instinct: null,
          filter_broken: filterForMold(mold),
          mold,
          silverKeyMove: question.silverKeys?.[0]?.statement ?? null,
        };
      });

    const { zones } = synthesizeZones(missRecords);
    const durationSec = startedAtRef.current
      ? Math.round((Date.now() - startedAtRef.current) / 1000)
      : 0;
    track("diag_complete", {
      score: questions.length - missRecords.length,
      red_zones: zones.map((z) => z.name),
      duration_sec: durationSec,
    });

    try {
      localStorage.setItem(
        REDZONE_MAP_KEY,
        JSON.stringify({
          ts: Date.now(),
          total: questions.length,
          score: questions.length - missRecords.length,
          misses: missRecords,
          zones: zones.map((z) => ({ name: z.name, members: z.members.map((m) => m.qid) })),
        }),
      );
    } catch {
      // storage unavailable — /welcome falls back to the take-your-diagnostic path
    }
    markStateChanged();

    setMisses(missRecords);
    setPhase("result");
  };

  const next = () => {
    if (!q || !selected) return;
    if (index + 1 < total) setIndex(index + 1);
    else finish(answers);
  };

  return (
    <div className="diag-wrap">
      <div className="diag-header">
        <div className="diag-header-inner">
          <div className="brand" style={{ fontSize: 20, cursor: "pointer" }} onClick={() => navigate("home")}>
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
        <div className="diag-card" style={phase === "result" ? { maxWidth: 860 } : undefined}>
          {phase === "intro" && (
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 20 }}>▌ The Diagnostic · Free</div>
              <h1 className="display display-lg" style={{ margin: "0 0 24px", maxWidth: "18ch" }}>
                Find the pattern behind your misses.
              </h1>
              <p className="body-lg" style={{ marginBottom: 16 }}>
                18 questions, about 12 minutes. We are not counting how many you get right —
                we are watching <em>which kind of wrong answer</em> keeps pulling you in. At
                the end you get your Red-Zone verdict: the recurring trap architecture to
                repair first, built from your own answers.
              </p>
              <p className="serif" style={{ fontStyle: "italic", color: "var(--muted)", marginBottom: 32 }}>
                “{scripture.hero.text}” — {scripture.hero.ref}
              </p>
              {loadError ? (
                <p className="mono" style={{ color: "var(--red)" }}>
                  The diagnostic could not load ({loadError}). Refresh the page to try again.
                </p>
              ) : (
                <button
                  className="btn btn-lg red"
                  disabled={!questions}
                  style={{ opacity: questions ? 1 : 0.5 }}
                  onClick={() => setPhase("q")}
                >
                  {questions ? "Begin the Diagnostic" : "Preparing your questions…"} <span className="arrow">→</span>
                </button>
              )}
            </div>
          )}

          {phase === "q" && q && (
            <div>
              <div className="diag-q-num">
                <span className="pill">
                  {index + 1} / {total}
                </span>
                <span>{q.subject} · {q.title}</span>
              </div>
              <div className="diag-stem">
                {q.stem.split(/\n\n+/).map((p, i) => (
                  <p key={i} style={{ margin: i === 0 ? 0 : "12px 0 0" }}>{p}</p>
                ))}
              </div>
              <div className="diag-choices">
                {LETTERS.filter((l) => q.choices[l]).map((l) => (
                  <button
                    key={l}
                    className={`diag-choice${selected === l ? " selected" : ""}`}
                    onClick={() => select(l)}
                  >
                    <div className="letter">{l}</div>
                    <div>{q.choices[l]}</div>
                  </button>
                ))}
              </div>
              <div className="diag-footer">
                <span className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--muted)", textTransform: "uppercase" }}>
                  Pick the answer you would choose under pressure
                </span>
                <button className="btn btn-lg red" disabled={!selected} onClick={next} style={{ opacity: selected ? 1 : 0.4 }}>
                  {index + 1 < total ? "Next" : "See My Verdict"} <span className="arrow">→</span>
                </button>
              </div>
            </div>
          )}

          {phase === "result" && (
            <>
              <RedZoneReveal misses={misses} totalQuestions={total} />
              <VerseLine theme="rest" style={{ marginTop: 32 }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
