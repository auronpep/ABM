// Practice Library — enrolled self-serve practice against the full DB bank.
//
// A separate opt-in surface (nav-linked): the led daily spine on #/welcome
// keeps its one primary action; this is the library next to it. Three ways in:
//   1. Subject grid  — fresh set from one subject (kind: "subject")
//   2. Outline browse — official 8-digit outline tree    (kind: "outline")
//   3. Code entry    — paste/type any valid outline code  (kind: "outline")
//
// Server rules this UI leans on: questions are served WITHOUT answers; every
// answer posts an attempt (the shared no-repeat ledger — a question seen here
// never comes back anywhere); forensics arrive only after the attempt.

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  apiFetch,
  ApiError,
  type AttemptResponse,
  type DrillStartResponse,
  type ForensicsPayload,
  type OutlinePayload,
  type PracticeQuestion,
} from "../lib/api.ts";
import { track } from "../lib/events.ts";
import { createAttemptRecorder } from "../lib/attemptTelemetry.ts";
import { VerseLine } from "../components/VerseLine.tsx";
import type { PageProps } from "../types.ts";

const SET_SIZE = 10;
const DEFAULT_CONFIDENCE = 3;

type StartBody =
  | { kind: "subject"; subject: string; size: number }
  | { kind: "outline"; outline_code: string; size: number };

interface RunState {
  drill: DrillStartResponse & { drill_id: string };
  label: string;
  mode: "subject" | "outline";
  index: number;
  correctCount: number;
}

function fmtCount(n: number): string {
  return n === 1 ? "1 question" : `${n} questions`;
}

export function Practice({ navigate }: PageProps) {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [outline, setOutline] = useState<OutlinePayload | null>(null);
  const [outlineError, setOutlineError] = useState<string | null>(null);
  const [openAb, setOpenAb] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [startError, setStartError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [run, setRun] = useState<RunState | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    apiFetch<OutlinePayload>("/api/outline")
      .then(setOutline)
      .catch((e: unknown) =>
        setOutlineError(e instanceof Error ? e.message : "Failed to load the outline"),
      );
  }, [isLoaded, isSignedIn]);

  const subtopicsBySubject = useMemo(() => {
    const groups = new Map<string, OutlinePayload["subtopics"]>();
    (outline?.subtopics ?? []).forEach((s) => {
      const list = groups.get(s.subject_code) ?? [];
      groups.set(s.subject_code, [...list, s]);
    });
    return groups;
  }, [outline]);

  const startSet = async (body: StartBody, label: string) => {
    setStartError(null);
    if (!isSignedIn) {
      navigate("sign-in");
      return;
    }
    setStarting(true);
    try {
      const token = await getToken();
      const drill = await apiFetch<DrillStartResponse>("/api/drills/start", {
        method: "POST",
        token,
        body,
      });
      if (!drill.drill_id || drill.question_ids.length === 0) {
        setStartError(
          "Nothing fresh left here — you have answered every question in this slice. New bank loads land regularly.",
        );
        return;
      }
      track("practice_set_start", {
        mode: body.kind,
        target: body.kind === "subject" ? body.subject : body.outline_code,
        size: drill.question_ids.length,
      });
      setRun({
        drill: { ...drill, drill_id: drill.drill_id },
        label,
        mode: body.kind,
        index: 0,
        correctCount: 0,
      });
      window.scrollTo(0, 0);
    } catch (e: unknown) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        setStartError(
          "The Practice Library is part of the paid program. Sign in with the email you enrolled with.",
        );
      } else {
        setStartError(e instanceof Error ? e.message : "Could not start the set");
      }
    } finally {
      setStarting(false);
    }
  };

  const submitCode = () => {
    const raw = codeInput.trim();
    if (!/^\d{2}(\d{2}){0,3}$/.test(raw)) {
      setStartError("Enter a 2, 4, 6, or 8 digit outline code (e.g. 61020305).");
      return;
    }
    const known =
      outline === null ||
      outline.nodes.some((n) => n.code.startsWith(raw.padEnd(raw.length, ""))
        && n.code.slice(0, raw.length) === raw) ||
      outline.subtopics.some((s) => s.ab === raw.slice(0, 2));
    if (!known) {
      setStartError(`No outline entry starts with ${raw}. Check the code against the tree below.`);
      return;
    }
    const node = outline?.nodes.find((n) => n.code === raw.padEnd(8, "0"));
    void startSet(
      { kind: "outline", outline_code: raw, size: SET_SIZE },
      node ? node.label : `Outline ${raw}`,
    );
  };

  if (run) {
    return (
      <PracticeRunner
        run={run}
        getToken={getToken}
        onAdvance={(correct) =>
          setRun((r) =>
            r
              ? { ...r, index: r.index + 1, correctCount: r.correctCount + (correct ? 1 : 0) }
              : r,
          )
        }
        onExit={() => setRun(null)}
      />
    );
  }

  // ——— Library hub ———
  return (
    <div className="container section drill-library">
      <div className="eyebrow-red" style={{ marginBottom: 18 }}>
        ▌ Practice Library
      </div>
      <h1 className="display display-lg" style={{ margin: "0 0 18px", maxWidth: "24ch" }}>
        The full bank, on your terms.
      </h1>
      <p className="body-lg" style={{ maxWidth: "62ch", marginBottom: 8 }}>
        Pick a subject for a fresh set, walk the official outline, or jump straight to an
        outline code. Every question you answer is recorded once — you will never be served
        a repeat unless we choose to retest you.
      </p>
      <VerseLine theme="diligence" style={{ maxWidth: "56ch", margin: "10px 0 18px" }} />

      {startError && (
        <p className="mono" style={{ color: "var(--bm-red, #b3261e)", maxWidth: "62ch" }}>
          {startError}{" "}
          {startError.includes("paid program") && (
            <button className="btn ghost btn-sm" onClick={() => navigate("pricing")}>
              See the program
            </button>
          )}
        </p>
      )}

      {/* 1 — subjects */}
      <div className="section-rule">
        <span className="label">Practice one subject</span>
      </div>
      {!isLoaded && !outline && !outlineError && (
        <PracticeUnavailable
          title="Checking account access."
          body="If account access is slow here, keep using the dashboard assignment. The library only opens after the enrolled index is available."
          primaryLabel="Open dashboard"
          onPrimary={() => navigate("dashboard")}
          onDashboard={() => navigate("dashboard")}
        />
      )}
      {isLoaded && !isSignedIn && (
        <PracticeUnavailable
          title="Sign in to open the full bank."
          body="The dashboard still leads with one assigned task. The Practice Library is optional paid-program work after that spine is clear."
          primaryLabel="Sign in"
          onPrimary={() => navigate("sign-in")}
          onDashboard={() => navigate("dashboard")}
        />
      )}
      {outlineError && isSignedIn && (
        <PracticeUnavailable
          title="The full-bank index is not available here."
          body="Use today's dashboard assignment for now. The library will reopen when the enrolled index responds."
          primaryLabel="Open dashboard"
          onPrimary={() => navigate("dashboard")}
          onDashboard={() => navigate("dashboard")}
        />
      )}
      {!outline && !outlineError && isSignedIn && (
        <p className="mono" style={{ color: "var(--muted)" }}>
          Loading the bank…
        </p>
      )}
      {outline && (
        <div className="drill-grid">
          {outline.subjects.map((s) => (
            <button
              key={s.code}
              className="drill-card"
              disabled={starting || s.question_count === 0}
              onClick={() =>
                void startSet({ kind: "subject", subject: s.code, size: SET_SIZE }, s.label)
              }
            >
              <div className="drill-card-top">
                <span className="mono id">{s.code.slice(0, 4)}</span>
              </div>
              <div className="drill-card-title">{s.label}</div>
              <div className="drill-card-meta">{fmtCount(s.question_count)} in the bank</div>
              <div className="drill-card-cta">
                Fresh set of {SET_SIZE} <span className="arrow">→</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 2 — outline code entry */}
      {outline && (
        <>
          <div className="section-rule" style={{ marginTop: 28 }}>
            <span className="label">Drill by outline code</span>
          </div>
          <p className="body-lg" style={{ maxWidth: "62ch" }}>
            Every line of the official MBE outline carries an 8-digit code. Enter one to drill
            exactly that line (shorter prefixes widen the net: <span className="mono">61</span> is
            all of Negligence).
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <input
              className="mono"
              style={{ padding: "10px 14px", fontSize: 16, width: "14ch" }}
              inputMode="numeric"
              maxLength={8}
              placeholder="61020305"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitCode();
              }}
            />
            <button className="btn red btn-sm" disabled={starting} onClick={submitCode}>
              Drill this code
            </button>
          </div>

          {/* 3 — outline browser */}
          <div className="section-rule" style={{ marginTop: 28 }}>
            <span className="label">Browse the outline</span>
          </div>
          {outline.subjects.map((subj) => (
          <div key={subj.code} className="drill-subject-block">
            <div className="section-rule">
              <span className="label">{subj.label}</span>
            </div>
            {(subtopicsBySubject.get(subj.code) ?? []).map((sub) => {
              const deepNodes = outline.nodes.filter(
                (n) => n.ab === sub.ab && n.question_count > 0,
              );
              const open = openAb === sub.ab;
              return (
                <div key={sub.ab} style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                    <button
                      className="mono"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      onClick={() => setOpenAb(open ? null : sub.ab)}
                      aria-expanded={open}
                    >
                      {open ? "▾" : "▸"} <span className="id">{sub.ab}</span> {sub.name}
                      <span style={{ color: "var(--muted)" }}> · {fmtCount(sub.question_count)}</span>
                    </button>
                    {sub.question_count > 0 && (
                      <button
                        className="btn ghost btn-sm"
                        disabled={starting}
                        onClick={() =>
                          void startSet(
                            { kind: "outline", outline_code: sub.ab, size: SET_SIZE },
                            sub.name,
                          )
                        }
                      >
                        Drill
                      </button>
                    )}
                  </div>
                  {open && (
                    <div style={{ margin: "6px 0 10px 22px" }}>
                      {deepNodes.length === 0 ? (
                        <p className="mono" style={{ color: "var(--muted)", fontSize: 13 }}>
                          Fine-grained codes for this subtopic are still being classified —
                          drill the whole subtopic above, or enter a code once it goes live.
                        </p>
                      ) : (
                        deepNodes.map((n) => (
                          <div
                            key={n.code}
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "baseline",
                              marginLeft: (n.level - 1) * 18,
                            }}
                          >
                            <span className="mono id">{n.code}</span>
                            <span>{n.label}</span>
                            <span className="mono" style={{ color: "var(--muted)" }}>
                              {fmtCount(n.question_count)}
                            </span>
                            <button
                              className="btn ghost btn-sm"
                              disabled={starting}
                              onClick={() =>
                                void startSet(
                                  { kind: "outline", outline_code: n.code, size: SET_SIZE },
                                  n.label,
                                )
                              }
                            >
                              Drill
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          ))}
        </>
      )}
    </div>
  );
}

function PracticeUnavailable({
  body,
  onDashboard,
  onPrimary,
  primaryLabel,
  title,
}: {
  body: string;
  onDashboard: () => void;
  onPrimary: () => void;
  primaryLabel: string;
  title: string;
}) {
  return (
    <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 18, maxWidth: 620 }}>
      <p className="body-lg" style={{ margin: "0 0 8px", fontWeight: 600 }}>
        {title}
      </p>
      <p className="mono" style={{ color: "var(--muted)", maxWidth: "58ch", lineHeight: 1.6 }}>
        {body}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn red btn-sm" onClick={onPrimary}>
          {primaryLabel}
        </button>
        <button className="btn ghost btn-sm" onClick={onDashboard}>
          Back to dashboard
        </button>
      </div>
    </div>
  );
}

// ── set runner ──────────────────────────────────────────────────────────────

interface RunnerProps {
  run: RunState;
  getToken: () => Promise<string | null>;
  onAdvance: (correct: boolean) => void;
  onExit: () => void;
}

function PracticeRunner({ run, getToken, onAdvance, onExit }: RunnerProps) {
  const total = run.drill.question_ids.length;
  const finished = run.index >= total;
  const qid = finished ? null : run.drill.question_ids[run.index];

  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [picked, setPicked] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [attempt, setAttempt] = useState<AttemptResponse | null>(null);
  const [forensics, setForensics] = useState<ForensicsPayload | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const shownAt = useRef<number>(Date.now());
  const recorder = useRef(createAttemptRecorder());
  const forensicsShownAt = useRef<number | null>(null);
  const dwellSent = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!qid) return;
    setQuestion(null);
    setPicked(null);
    setAttempt(null);
    setForensics(null);
    setLoadError(null);
    apiFetch<PracticeQuestion>(`/api/questions/${qid}`)
      .then((q) => {
        setQuestion(q);
        shownAt.current = Date.now();
        recorder.current.markShown();
        forensicsShownAt.current = null;
        dwellSent.current = false;
      })
      .catch((e: unknown) =>
        setLoadError(e instanceof Error ? e.message : "Failed to load the question"),
      );
    window.scrollTo(0, 0);
  }, [qid]);

  useEffect(() => {
    let maxY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > maxY) {
        maxY = y;
      } else if (maxY - y > 200) {
        recorder.current.recordScrollStem();
        maxY = y; // re-arm from the new position
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [qid]);

  useEffect(() => {
    if (!finished || completedRef.current) return;
    completedRef.current = true;
    track("practice_set_complete", {
      mode: run.mode,
      total,
      correct: run.correctCount,
    });
    void (async () => {
      try {
        const token = await getToken();
        await apiFetch(`/api/drills/${run.drill.drill_id}/complete`, {
          method: "POST",
          token,
        });
      } catch {
        // completion bookkeeping must never block the student
      }
    })();
  }, [finished, getToken, run, total]);

  const choose = async (letter: "A" | "B" | "C" | "D") => {
    if (!question || picked || submitting) return;
    setSubmitting(true);
    setPicked(letter);
    const timeSeconds = Math.max(0, Math.round((Date.now() - shownAt.current) / 1000));
    const interactionLog = recorder.current.snapshot(letter);
    try {
      const token = await getToken();
      const result = await apiFetch<AttemptResponse>("/api/attempts", {
        method: "POST",
        token,
        body: {
          question_id: question.question_id,
          selected_letter: letter,
          confidence: DEFAULT_CONFIDENCE,
          time_seconds: timeSeconds,
          platform: "web",
          set_id: run.drill.drill_id,
          interaction_log: interactionLog,
        },
      });
      setAttempt(result);
      forensicsShownAt.current = Date.now();
      apiFetch<ForensicsPayload>(result.forensics_url)
        .then(setForensics)
        .catch(() => setForensics(null));
    } catch (e: unknown) {
      setPicked(null);
      setLoadError(e instanceof Error ? e.message : "Could not record the answer");
    } finally {
      setSubmitting(false);
    }
  };

  const sendDwell = (attemptResult: AttemptResponse | null) => {
    if (!attemptResult || dwellSent.current || forensicsShownAt.current === null) return;
    dwellSent.current = true;
    const dwellMs = Math.max(0, Date.now() - forensicsShownAt.current);
    if (!attemptResult.correct && dwellMs < 3000) {
      track("forensics_skipped", { subject: question?.subject ?? "unknown" });
    }
    void (async () => {
      try {
        const token = await getToken();
        await apiFetch(`/api/attempts/${attemptResult.attempt_id}/forensics-dwell`, {
          method: "PATCH",
          token,
          body: { dwell_ms: dwellMs },
        });
      } catch {
        // dwell is best-effort; absence reads as skipped, which is honest
      }
    })();
  };

  if (finished) {
    return (
      <div className="container section">
        <div className="eyebrow-red" style={{ marginBottom: 18 }}>
          ▌ Practice Library · {run.label}
        </div>
        <h1 className="display display-lg" style={{ maxWidth: "24ch" }}>
          Set complete: {run.correctCount} of {total}.
        </h1>
        <p className="body-lg" style={{ maxWidth: "62ch" }}>
          Every question in this set is now on your record — none of them will be served to
          you again. Misses feed your red zones and tomorrow's prescription.
        </p>
        <button className="btn red btn-lg" onClick={onExit}>
          Back to the library
        </button>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="container section">
        <p className="body-lg">({loadError})</p>
        <button className="btn ghost btn-lg" onClick={onExit}>
          Back to the library
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container section">
        <p className="mono" style={{ color: "var(--muted)" }}>
          Loading question {run.index + 1} of {total}…
        </p>
      </div>
    );
  }

  const isCorrect = attempt?.correct === true;

  return (
    <div className="container section drill-player">
      <div className="drill-player-top">
        <button
          className="mono drill-back"
          onClick={() => {
            sendDwell(attempt);
            track("set_abandoned", {
              set_type: run.mode,
              position: run.index + 1,
              total,
            });
            onExit();
          }}
        >
          ← Library
        </button>
        <span className="mono drill-id">
          {run.label} · {run.index + 1} / {total}
        </span>
      </div>

      <div className="body-lg" style={{ whiteSpace: "pre-wrap", maxWidth: "70ch" }}>
        {question.fact_pattern}
      </div>
      {question.call_of_question && (
        <p className="body-lg" style={{ fontWeight: 600, maxWidth: "70ch" }}>
          {question.call_of_question}
        </p>
      )}

      <div style={{ display: "grid", gap: 10, maxWidth: "70ch", margin: "16px 0" }}>
        {question.choices.map((c) => {
          const chosen = picked === c.letter;
          const revealCorrect = attempt && attempt.correct_answer === c.letter;
          return (
            <button
              key={c.letter}
              className="drill-card"
              style={{
                textAlign: "left",
                outline: revealCorrect
                  ? "2px solid var(--bm-brass, #8f742f)"
                  : chosen && attempt && !isCorrect
                    ? "2px solid var(--bm-red, #b3261e)"
                    : undefined,
              }}
              disabled={picked !== null}
              onClick={() => void choose(c.letter)}
            >
              <span className="mono id">{c.letter}</span> {c.choice_text}
            </button>
          );
        })}
      </div>

      {attempt && (
        <div style={{ maxWidth: "70ch" }}>
          <div className="eyebrow-red" style={{ marginBottom: 8 }}>
            {isCorrect ? "▌ True and responsive." : `▌ Counterfeit${forensics?.trap_name ? ` — ${forensics.trap_name}` : ""}`}
          </div>
          {forensics && isCorrect && forensics.why_correct && (
            <p className="body-lg">{forensics.why_correct}</p>
          )}
          {forensics && !isCorrect && (
            <>
              {forensics.why_attractive && (
                <p className="body-lg">
                  <strong>Why it pulled you:</strong> {forensics.why_attractive}
                </p>
              )}
              {forensics.why_wrong && (
                <p className="body-lg">
                  <strong>Why it fails:</strong> {forensics.why_wrong}
                </p>
              )}
              {forensics.future_cue && (
                <p className="body-lg">
                  <strong>Next time:</strong> {forensics.future_cue}
                </p>
              )}
            </>
          )}
          <button
            className="btn red btn-lg"
            onClick={() => {
              sendDwell(attempt);
              onAdvance(isCorrect);
            }}
          >
            {run.index + 1 < total ? (
              <>
                Next question <span className="arrow">→</span>
              </>
            ) : (
              "Finish the set"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
