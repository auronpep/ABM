// Mini-diagnostic — funnel Screens 1–2 (handoff docs 01–03).
// Data-driven: renders any conforming question JSON, zero hardcoded stems.
// Motion honors prefers-reduced-motion (all stages render immediately).
import { useEffect, useMemo, useRef, useState } from "react";
import seedData from "../funnel/questions.seed.json";
import { assertValidQuestions } from "../funnel/validate.ts";
import { conscienceVerdict, pickRatePhrase } from "../funnel/zones.ts";
import { track } from "../lib/events.ts";
import type { ChoiceId, FunnelQuestion, Instinct, MiniResult } from "../funnel/types.ts";

const QUESTIONS: FunnelQuestion[] = assertValidQuestions(seedData);

export const MINI_RESULT_KEY = "bm_mini_result";

type QPhase = "answering" | "locked" | "revealed";
type Stage = "questions" | "synthesis";

interface MiniDiagnosticProps {
  onCta: (result: MiniResult) => void;
}

function useReducedMotion(): boolean {
  return useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
}

export function MiniDiagnostic({ onCta }: MiniDiagnosticProps) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>("questions");
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<QPhase>("answering");
  const [picks, setPicks] = useState<Partial<Record<string, ChoiceId>>>({});
  const [synthStep, setSynthStep] = useState(0);
  const startedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const q = QUESTIONS[index];
  const picked = picks[q?.qid ?? ""];

  const misses = QUESTIONS.filter((question) => {
    const pick = picks[question.qid];
    return pick !== undefined && pick !== question.key;
  });
  const missedInstincts: Instinct[] = misses
    .filter((m) => picks[m.qid] === m.trap.choice)
    .map((m) => m.trap.instinct);
  const score = QUESTIONS.length - misses.length;

  const later = (fn: () => void, ms: number) => {
    if (reduced) {
      fn();
      return;
    }
    timersRef.current.push(window.setTimeout(fn, ms));
  };

  const choose = (id: ChoiceId) => {
    if (phase !== "answering") return;
    if (!startedRef.current) {
      startedRef.current = true;
      track("mini_diag_start", {});
    }
    setPicks((prev) => ({ ...prev, [q.qid]: id }));
    setPhase("locked");
    // Lock beat: 700ms pause between pick and first reveal element (doc 02).
    later(() => setPhase("revealed"), 700);
  };

  const advance = () => {
    if (index + 1 < QUESTIONS.length) {
      setIndex(index + 1);
      setPhase("answering");
    } else {
      setStage("synthesis");
      setSynthStep(0);
      // Staged synthesis at ~1.2s / 2.3s / 3.5s (doc 01).
      later(() => setSynthStep(1), 1200);
      later(() => setSynthStep(2), 2300);
      later(() => setSynthStep(3), 3500);
    }
  };

  const handleCta = () => {
    const result: MiniResult = { score, missedInstincts };
    try {
      sessionStorage.setItem(MINI_RESULT_KEY, JSON.stringify(result));
    } catch {
      // storage unavailable — handoff degrades gracefully
    }
    onCta(result);
  };

  if (stage === "synthesis") {
    const survived = misses.length === 0;
    return (
      <div className="mini-diag" aria-live="polite">
        <div className="mini-diag-head">
          <span className="eyebrow">▌ The Verdict</span>
          <span className="count">3 / 3</span>
        </div>

        {synthStep >= 1 && (
          <div className={`mini-chips${reduced ? "" : " bm-rise"}`}>
            {QUESTIONS.map((question) => {
              const pick = picks[question.qid];
              const missed = pick !== question.key;
              const trapped = pick === question.trap.choice;
              return (
                <span key={question.qid} className={`mini-chip${missed ? " trap" : ""}`}>
                  {missed ? `TRAP: ${trapped ? question.trap.instinct : question.trap.name}` : "SURVIVED"}
                </span>
              );
            })}
          </div>
        )}

        {synthStep >= 2 && (
          <div className={`pattern-stamp${survived ? " survived" : ""}${reduced ? "" : " bm-stamp"}`}>
            {survived ? "SURVIVED — ALL THREE" : "CONSCIENCE TRAPS"}
          </div>
        )}

        {synthStep >= 3 && (
          <div className={reduced ? "" : "bm-rise"}>
            <p className="mini-verdict">{conscienceVerdict(missedInstincts)}</p>
            <div className="mini-next-row" style={{ justifyContent: "flex-start" }}>
              <button className="btn-funnel" onClick={handleCta}>
                Map every trap you fall for — free 12-minute diagnostic →
              </button>
            </div>
            <p className="mini-cta-sub">
              18 questions. Your full Red-Zone map. See everything before you pay a dollar.
            </p>
          </div>
        )}
      </div>
    );
  }

  const revealed = phase === "revealed";
  const correct = revealed && picked === q.key;
  const pickedDominantTrap = revealed && picked === q.trap.choice;

  return (
    <div className="mini-diag">
      <div className="mini-diag-head">
        <span className="eyebrow">▌ Three Questions · Free</span>
        <span className="count">{index + 1} / {QUESTIONS.length}</span>
      </div>

      <h3 className="mini-title">{q.title}</h3>
      <div className="mini-subject">{q.subject}</div>

      <div className="mini-stem">
        {q.stem.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <p className="mini-call">{q.call}</p>

      <div className="mini-choices">
        {q.choices.map((c) => {
          const isPicked = picked === c.id;
          const cls = ["mini-choice"];
          if (phase === "answering") {
            // all active
          } else if (revealed) {
            if (c.id === q.key) cls.push("is-key");
            else if (isPicked) cls.push("is-trap-pick");
            else cls.push("dimmed");
          } else {
            // locked beat: picked outlined ink, others dim to 38% (doc 01)
            if (isPicked) cls.push("picked");
            else cls.push("dimmed");
          }
          return (
            <button
              key={c.id}
              className={cls.join(" ")}
              disabled={phase !== "answering"}
              onClick={() => choose(c.id)}
            >
              <span className="letter">{c.id}</span>
              <span>{c.text}</span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {revealed && (
          <>
            <div className={`nameplate${correct ? " survived" : ""}${reduced ? "" : " bm-stamp"}`}>
              {correct
                ? "SURVIVED"
                : pickedDominantTrap
                  ? `THE TRAP — ${q.trap.pct}% FALL HERE`
                  : "COUNTERFEIT"}
            </div>
            {!correct && pickedDominantTrap && (
              <div className="mini-subject" style={{ marginBottom: 0 }}>
                {pickRatePhrase(q.trap.pct)}
              </div>
            )}
            <p className={`mini-forensic${reduced ? "" : " bm-rise"}`}>
              {picked ? q.forensics[picked] : null}
            </p>
            <div className="mini-next-row">
              <button className="btn-funnel" onClick={advance}>
                {index + 1 < QUESTIONS.length ? `Question ${index + 2} →` : "See your verdict →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
