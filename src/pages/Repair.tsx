// The first repair loop — P1 §2. Drills scoped to the buyer's #1 red zone,
// then a timed 3-question retest from the same trap family. Pass → the repair
// moment (vermilion → brass stamp) + a 4-day spaced retest scheduled. Miss →
// no shame state: the silver-key move again, two more drills, immediate
// re-offer. Sanctuary rules: no streaks, no guilt, no "falling behind".
import { useEffect, useMemo, useRef, useState } from "react";
import { brand } from "../content/brand.ts";
import { DrillPlayer, LETTERS, type DrillQuestion } from "../components/DrillPlayer.tsx";
import {
  RETEST_PASS_BAR,
  RETEST_SECONDS,
  SPACED_RETEST_DAYS,
  completeDrill,
  loadTrapIndex,
  readMap,
  readProgram,
  recordRetest,
  resumeDrills,
  spacedRetestDue,
  startProgram,
  startSpacedRetest,
  type ProgramState,
  type TrapIndexEntry,
} from "../program/repair.ts";
import { track } from "../lib/events.ts";
import type { PageProps } from "../types.ts";

type RetestStage = "intro" | "running" | "grading";

function fmtClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function useQuestion(qid: string | null): { question: DrillQuestion | null; error: string | null } {
  const [question, setQuestion] = useState<DrillQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setQuestion(null);
    setError(null);
    if (!qid) return;
    fetch(`/qdata/${qid}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<DrillQuestion>;
      })
      .then(setQuestion)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"));
    window.scrollTo(0, 0);
  }, [qid]);
  return { question, error };
}

export function Repair({ navigate }: PageProps) {
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const map = useMemo(readMap, []);
  const [trapIndex, setTrapIndex] = useState<TrapIndexEntry[] | null>(null);
  const [program, setProgram] = useState<ProgramState | null>(readProgram);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadTrapIndex()
      .then(setTrapIndex)
      .catch((e: unknown) => setLoadError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  // First visit with a map but no program → assemble the loop.
  useEffect(() => {
    if (!program && map && trapIndex) {
      setProgram(startProgram(map, trapIndex));
    }
  }, [program, map, trapIndex]);

  // ——— No diagnostic on record: route into it, framed as setup (P1 §3) ———
  if (!map && !program) {
    return (
      <RepairShell navigate={navigate}>
        <div className="eyebrow-red" style={{ marginBottom: 20 }}>▌ The First Repair</div>
        <h1 className="display display-lg" style={{ margin: "0 0 18px", maxWidth: "20ch" }}>
          First, we map you.
        </h1>
        <p className="body-lg" style={{ maxWidth: "44ch", marginBottom: 28 }}>
          18 questions, about 12 minutes — your wrong answers build the Red-Zone map your
          first repair is assigned from.
        </p>
        <button className="btn btn-lg red" onClick={() => navigate("diagnostic")}>
          Take your diagnostic <span className="arrow">→</span>
        </button>
      </RepairShell>
    );
  }

  if (loadError) {
    return (
      <RepairShell navigate={navigate}>
        <p className="body-lg">The repair loop could not load ({loadError}). Refresh to try again.</p>
      </RepairShell>
    );
  }

  if (!program || !trapIndex) {
    return (
      <RepairShell navigate={navigate}>
        <p className="mono" style={{ color: "var(--muted)" }}>Preparing your first repair…</p>
      </RepairShell>
    );
  }

  return (
    <RepairLoop
      navigate={navigate}
      program={program}
      setProgram={setProgram}
      trapIndex={trapIndex}
      reduced={reduced}
    />
  );
}

function RepairShell({
  navigate,
  children,
}: PageProps & { children: React.ReactNode }) {
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
          <button
            className="mono"
            style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}
            onClick={() => navigate("welcome")}
          >
            Exit ✕
          </button>
        </div>
      </div>
      <div className="diag-main">
        <div className="diag-card" style={{ maxWidth: 860 }}>{children}</div>
      </div>
    </div>
  );
}

interface LoopProps extends PageProps {
  program: ProgramState;
  setProgram: (p: ProgramState) => void;
  trapIndex: TrapIndexEntry[];
  reduced: boolean;
}

function RepairLoop({ navigate, program, setProgram, trapIndex, reduced }: LoopProps) {
  const zone = program.zone;

  // ——— Drill phase ———
  const currentDrillId =
    program.phase === "drills"
      ? (program.drillIds.find((id) => !program.drillsDone.includes(id)) ?? null)
      : null;
  const { question: drillQ, error: drillError } = useQuestion(currentDrillId);

  const finishDrill = () => {
    if (!currentDrillId) return;
    const isFirstEver = program.drillsDone.length === 0;
    const next = completeDrill(program, currentDrillId);
    if (isFirstEver) track("first_drill_complete", { zone: zone.name });
    setProgram(next);
    window.scrollTo(0, 0);
  };

  // ——— Retest phase ———
  const [retestStage, setRetestStage] = useState<RetestStage>("intro");
  const [retestQs, setRetestQs] = useState<DrillQuestion[] | null>(null);
  const [retestIdx, setRetestIdx] = useState(0);
  const [retestAnswers, setRetestAnswers] = useState<Record<string, string>>({});
  const [retestPicked, setRetestPicked] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RETEST_SECONDS);
  const deadlineRef = useRef<number | null>(null);
  const gradedRef = useRef(false);

  useEffect(() => {
    if (program.phase !== "retest") return;
    setRetestStage("intro");
    setRetestQs(null);
    setRetestIdx(0);
    setRetestAnswers({});
    setRetestPicked(null);
    setSecondsLeft(RETEST_SECONDS);
    gradedRef.current = false;
    Promise.all(
      program.retestIds.map((id) =>
        fetch(`/qdata/${id}.json`).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status} loading ${id}`);
          return r.json() as Promise<DrillQuestion>;
        }),
      ),
    )
      .then(setRetestQs)
      .catch(() => setRetestQs(null));
  }, [program.phase, program.retestIds]);

  const grade = (answers: Record<string, string>) => {
    if (gradedRef.current || !retestQs) return;
    gradedRef.current = true;
    const correctCount = retestQs.filter((q) => answers[q.id] === q.key).length;
    const passed = correctCount >= RETEST_PASS_BAR;
    if (program.attempt === 1) {
      track("first_retest_complete", { zone: zone.name, passed });
    }
    if (passed) track("zone_repaired", { zone: zone.name, attempt_n: program.attempt });
    setProgram(recordRetest(program, correctCount, trapIndex));
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (retestStage !== "running") return;
    const tick = window.setInterval(() => {
      const left = Math.max(0, Math.ceil(((deadlineRef.current ?? 0) - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) {
        window.clearInterval(tick);
        setRetestAnswers((answers) => {
          grade(answers);
          return answers;
        });
      }
    }, 250);
    return () => window.clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retestStage, retestQs]);

  // ——— Repaired stamp choreography ———
  const [stampStage, setStampStage] = useState(0);
  useEffect(() => {
    if (program.phase !== "repaired") return;
    if (reduced) {
      setStampStage(2);
      return;
    }
    setStampStage(0);
    const timers = [
      window.setTimeout(() => setStampStage(1), 700),
      window.setTimeout(() => setStampStage(2), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [program.phase, reduced]);

  const drillTotal = program.drillIds.length;
  const drillNum = Math.min(program.drillsDone.length + 1, drillTotal);

  // ============ RENDER ============

  if (program.phase === "drills") {
    if (drillError) {
      return (
        <RepairShell navigate={navigate}>
          <p className="body-lg">This drill could not load ({drillError}). Refresh to try again.</p>
        </RepairShell>
      );
    }
    return (
      <div className="container section drill-player">
        <div className="drill-player-top">
          <span className="rz-trap-chip">{zone.name}</span>
          <span className="mono drill-id">
            DRILL {drillNum} OF {drillTotal}
          </span>
        </div>
        {!drillQ ? (
          <p className="mono" style={{ color: "var(--muted)" }}>Loading {currentDrillId}…</p>
        ) : (
          <DrillPlayer
            key={drillQ.id}
            question={drillQ}
            footer={() => (
              <button className="btn red btn-lg" onClick={finishDrill}>
                {program.drillsDone.length + 1 < drillTotal
                  ? `Next drill (${drillNum + 1} of ${drillTotal})`
                  : "Start the timed retest"}{" "}
                <span className="arrow">→</span>
              </button>
            )}
          />
        )}
      </div>
    );
  }

  if (program.phase === "retest") {
    if (retestStage === "intro") {
      return (
        <RepairShell navigate={navigate}>
          <div className="eyebrow-red" style={{ marginBottom: 20 }}>▌ The Timed Retest</div>
          <h1 className="display display-lg" style={{ margin: "0 0 18px", maxWidth: "20ch" }}>
            Same trap. Different questions. On the clock.
          </h1>
          <p className="body-lg" style={{ maxWidth: "48ch", marginBottom: 12 }}>
            {program.retestIds.length} questions from the same trap family as {zone.name} —
            ones you haven&rsquo;t seen. {fmtClock(RETEST_SECONDS)} on the clock, no forensics
            between questions. This is how we know the repair took.
          </p>
          <p className="mono" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 28 }}>
            {RETEST_PASS_BAR} of {program.retestIds.length} keeps the point.
          </p>
          <button
            className="btn btn-lg red"
            disabled={!retestQs}
            style={{ opacity: retestQs ? 1 : 0.5 }}
            onClick={() => {
              deadlineRef.current = Date.now() + RETEST_SECONDS * 1000;
              setSecondsLeft(RETEST_SECONDS);
              setRetestStage("running");
            }}
          >
            {retestQs ? "Start the retest" : "Preparing your questions…"} <span className="arrow">→</span>
          </button>
        </RepairShell>
      );
    }

    const q = retestQs?.[retestIdx];
    if (!q) {
      return (
        <RepairShell navigate={navigate}>
          <p className="mono" style={{ color: "var(--muted)" }}>Loading…</p>
        </RepairShell>
      );
    }
    return (
      <div className="diag-wrap">
        <div className="diag-header">
          <div className="diag-header-inner">
            <span className="rz-trap-chip">{zone.name}</span>
            <div className="diag-progress">
              <div className="fill" style={{ width: `${((retestIdx + 1) / retestQs.length) * 100}%` }} />
            </div>
            <span className={`mono retest-clock${secondsLeft <= 60 ? " low" : ""}`}>
              {fmtClock(secondsLeft)}
            </span>
          </div>
        </div>
        <div className="diag-main">
          <div className="diag-card">
            <div className="diag-q-num">
              <span className="pill">
                {retestIdx + 1} / {retestQs.length}
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
                  className={`diag-choice${retestPicked === l ? " selected" : ""}`}
                  onClick={() => setRetestPicked(l)}
                >
                  <div className="letter">{l}</div>
                  <div>{q.choices[l]}</div>
                </button>
              ))}
            </div>
            <div className="diag-footer">
              <span className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--muted)", textTransform: "uppercase" }}>
                No forensics until the clock stops
              </span>
              <button
                className="btn btn-lg red"
                disabled={!retestPicked}
                style={{ opacity: retestPicked ? 1 : 0.4 }}
                onClick={() => {
                  if (!retestPicked) return;
                  const answers = { ...retestAnswers, [q.id]: retestPicked };
                  setRetestAnswers(answers);
                  setRetestPicked(null);
                  if (retestIdx + 1 < retestQs.length) {
                    setRetestIdx(retestIdx + 1);
                    window.scrollTo(0, 0);
                  } else {
                    grade(answers);
                  }
                }}
              >
                {retestIdx + 1 < retestQs.length ? "Lock it — next" : "Lock it — verdict"}{" "}
                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (program.phase === "repaired") {
    const due = spacedRetestDue(program);
    return (
      <RepairShell navigate={navigate}>
        <div className="eyebrow-red" style={{ marginBottom: 20 }}>▌ The Verdict</div>
        <div
          className={`rz-nameplate${stampStage >= 1 ? " survived" : ""}${
            stampStage === 1 && !reduced ? " bm-stamp" : ""
          }`}
        >
          {zone.name}
          {stampStage >= 1 ? " · REPAIRED" : ""}
        </div>
        {stampStage >= 2 && (
          <>
            <p className={`body-lg${reduced ? "" : " bm-rise"}`} style={{ maxWidth: "44ch", margin: "10px 0 8px" }}>
              Repaired — for now. We retest it again in {SPACED_RETEST_DAYS} days to make sure
              it holds.
            </p>
            {program.retestAt && (
              <p className={`mono${reduced ? "" : " bm-rise"}`} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 28 }}>
                Your retest is ready {fmtDate(program.retestAt)}. We&rsquo;ll keep it waiting — it
                doesn&rsquo;t expire.
              </p>
            )}
            <div className={reduced ? "" : "bm-rise"}>
              {due ? (
                <button
                  className="btn btn-lg red"
                  onClick={() => setProgram(startSpacedRetest(program, trapIndex))}
                >
                  Run the {SPACED_RETEST_DAYS}-day retest <span className="arrow">→</span>
                </button>
              ) : (
                <button className="btn btn-lg red" onClick={() => navigate("drills")}>
                  Keep going — open the drill bank <span className="arrow">→</span>
                </button>
              )}
            </div>
          </>
        )}
      </RepairShell>
    );
  }

  // ——— Miss path: still live, no shame (P1 §2) ———
  return (
    <RepairShell navigate={navigate}>
      <div className="eyebrow-red" style={{ marginBottom: 20 }}>▌ Still Live</div>
      <div className="rz-nameplate">{zone.name}</div>
      <p className="body-lg" style={{ maxWidth: "46ch", margin: "10px 0 16px" }}>
        Still live. Here&rsquo;s the move again:
      </p>
      {zone.silverKeyMove && (
        <p className="serif" style={{ fontStyle: "italic", fontSize: 18, lineHeight: 1.55, maxWidth: "48ch", marginBottom: 24 }}>
          “{zone.silverKeyMove}”
        </p>
      )}
      <p className="body-lg" style={{ maxWidth: "46ch", marginBottom: 28 }}>
        Two more drills, then the retest is waiting whenever you&rsquo;re ready. The trap
        doesn&rsquo;t get a vote on how many tries this takes.
      </p>
      <button
        className="btn btn-lg red"
        onClick={() => {
          setProgram(resumeDrills(program));
          window.scrollTo(0, 0);
        }}
      >
        Run the next two drills <span className="arrow">→</span>
      </button>
    </RepairShell>
  );
}

