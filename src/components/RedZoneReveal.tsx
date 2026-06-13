// Red-Zone reveal — funnel Screen 4 (doc 01) + checkout bridge (doc 05).
// Auto-runs the forensic analysis 800ms after load; user can replay.
import { useEffect, useMemo, useRef, useState } from "react";
import { synthesizeZones } from "../funnel/zones.ts";
import { apiClient } from "../lib/api-client.ts";
import { checkoutUrl, rememberCheckoutIntent } from "../lib/checkoutFlow.ts";
import { track } from "../lib/events.ts";
import { useClerkAuth } from "../lib/use-clerk-auth.ts";
import type { MissRecord } from "../funnel/types.ts";

interface RedZoneRevealProps {
  misses: MissRecord[];
  totalQuestions: number;
}

const STAGE_MS = [800, 1500, 2200, 2900, 3600];

type EnrollmentCheck = "anonymous" | "checking" | "enrolled" | "not-enrolled" | "unavailable";

export function RedZoneReveal({ misses, totalQuestions }: RedZoneRevealProps) {
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const [stage, setStage] = useState(0);
  const [enrollmentCheck, setEnrollmentCheck] = useState<EnrollmentCheck>("checking");
  const timersRef = useRef<number[]>([]);
  const { isLoaded: authLoaded, isSignedIn, getToken } = useClerkAuth();

  const { zones, singles } = useMemo(() => synthesizeZones(misses), [misses]);
  const survived = misses.length === 0;
  const correctCount = totalQuestions - misses.length;

  const run = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (reduced) {
      setStage(STAGE_MS.length);
      return;
    }
    setStage(0);
    STAGE_MS.forEach((ms, i) => {
      timersRef.current.push(window.setTimeout(() => setStage(i + 1), ms));
    });
  };

  useEffect(() => {
    run();
    return () => timersRef.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authLoaded) return;
    if (!isSignedIn) {
      setEnrollmentCheck("anonymous");
      return;
    }

    let cancelled = false;
    setEnrollmentCheck("checking");
    getToken()
      .then((token) => apiClient.account(token))
      .then((account) => {
        if (!cancelled) setEnrollmentCheck(account.enrolled ? "enrolled" : "not-enrolled");
      })
      .catch(() => {
        if (!cancelled) setEnrollmentCheck("unavailable");
      });

    return () => {
      cancelled = true;
    };
  }, [authLoaded, getToken, isSignedIn]);

  const startCheckout = (plan: "full" | "split") => {
    track("checkout_start", { plan, red_zones: zones.map((z) => z.name) });
    rememberCheckoutIntent({ plan, source: "diagnostic", after: "sign-up" });
    window.location.href = checkoutUrl({ plan, source: "diagnostic", after: "sign-up" });
  };

  const openDashboard = () => {
    track("diagnostic_enrolled_next_step", { red_zones: zones.map((z) => z.name) });
    window.location.href = "/dashboard";
  };

  return (
    <div className="rz-wrap" aria-live="polite">
      <div className="rz-eyebrow">▌ Your Red-Zone Verdict</div>
      <h1 className="display display-lg" style={{ margin: "0 0 16px", maxWidth: "20ch" }}>
        {survived ? "Nothing got past you this time." : "Your wrong answers are a map."}
      </h1>
      <div
        className="rz-score-row"
        style={{
          border: "1px solid var(--rule)",
          display: "inline-flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 18,
          padding: "8px 12px",
        }}
      >
        <span className="qmeta">Score:</span>
        <strong className="mono" style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {correctCount} of {totalQuestions} correct
        </strong>
      </div>

      {/* 1 — miss cards */}
      {!survived && (
        <div style={{ marginBottom: 18 }}>
          {misses.map((m) => (
            <div className="rz-miss-card" key={m.qid}>
              <div>
                <div className="qmeta">{m.qid} · {m.subject}</div>
                <div className="qtitle">{m.title}</div>
                <div className="qmeta">Your pick: {m.picked}</div>
                <div className="qmeta">
                  Correct answer: {m.correct}
                  {m.correctText ? <span> - {m.correctText}</span> : null}
                </div>
              </div>
              <span className="rz-trap-chip">{m.trapName}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <button className="btn-funnel" style={{ background: "var(--bm-ink)", color: "var(--bm-paper)", border: "none", borderRadius: 2, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 16px", cursor: "pointer" }} onClick={run}>
          {stage >= STAGE_MS.length ? "Replay forensic analysis" : "Running forensic analysis…"}
        </button>
      </div>

      {/* 2 — shared-architecture chips */}
      {stage >= 2 && !survived && (
        <div className={reduced ? "" : "bm-rise"}>
          {zones.map((z) => (
            <span className="rz-arch-chip bm-stamp" key={z.name}>
              {z.filter_broken.split("_").join("-")} · {z.mold.split("_").join(" ")} × {z.members.length}
            </span>
          ))}
          {singles.map((m) => (
            <span className="rz-arch-chip" key={m.qid} style={{ opacity: 0.7 }}>
              {m.filter_broken.split("_").join("-")} · {m.mold.split("_").join(" ")}
            </span>
          ))}
        </div>
      )}

      {/* 3 — nameplate(s) */}
      {stage >= 3 && (
        <div>
          {survived ? (
            <div className={`rz-nameplate survived${reduced ? "" : " bm-stamp"}`}>NO RED ZONES FOUND</div>
          ) : zones.length > 0 ? (
            zones.map((z) => (
              <div className={`rz-nameplate${reduced ? "" : " bm-stamp"}`} key={z.name} style={{ display: "block", maxWidth: "fit-content" }}>
                {z.name}
              </div>
            ))
          ) : (
            <div className={`rz-nameplate${reduced ? "" : " bm-stamp"}`}>SCATTERED COUNTERFEITS</div>
          )}
        </div>
      )}

      {/* 4 — verdict */}
      {stage >= 4 && (
        <div className={reduced ? "" : "bm-rise"}>
          {survived ? (
            <p className="rz-verdict">
              Eighteen questions, zero misses on these tested forms. Either you are further
              along than most takers, or the traps that catch you live in subjects this
              diagnostic sampled lightly. The full bank covers every subject and keeps
              watching for the pattern — repair is cheap when the map is current.
            </p>
          ) : (
            <>
              {zones.map((z) => (
                <p className="rz-verdict" key={z.name} style={{ marginBottom: 14 }}>
                  {z.verdict}
                </p>
              ))}
              {zones.length === 0 && (
                <p className="rz-verdict">
                  Your misses don&rsquo;t cluster on one architecture yet — they scatter
                  across {singles.length} different counterfeit molds. That usually means
                  the pattern needs more data to surface. The full bank keeps mapping until
                  the recurring trap shows itself.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* 5 — repair path + close + bridge */}
      {stage >= 5 && (
        <div className={reduced ? "" : "bm-rise"}>
          {!survived && (
            <div className="rz-repair">
              <div className="label">▌ The Repair Path</div>
              {misses
                .filter((m) => m.silverKeyMove)
                .slice(0, 3)
                .map((m) => (
                  <p className="move" key={m.qid}>“{m.silverKeyMove}”</p>
                ))}
              <p className="drill">
                Targeted drills are assigned per trap, then a timed retest on the same trap
                family — different questions, same architecture — until the repair holds.
              </p>
            </div>
          )}

          {!survived && (
            <p className="rz-close-line">
              That was {zones.length === 1 ? "1 red zone" : `${zones.length} red zones`}
              {singles.length > 0 ? ` and ${singles.length} scattered ${singles.length === 1 ? "trap" : "traps"}` : ""},
              found in {totalQuestions} questions. The full repair path covers every one.
            </p>
          )}

          {/* ——— Checkout bridge (doc 05) ——— */}
          <div className="bridge">
            <div className="eyebrow">YOUR REPAIR PATH IS BUILT</div>
            <h2>
              {enrollmentCheck === "enrolled"
                ? "Your enrolled repair path is ready."
                : "Every red zone above has a repair path waiting."}
            </h2>
            <p className="body">
              {enrollmentCheck === "enrolled"
                ? "The diagnostic found the patterns. Your paid BarMatrix access is already active, so continue into the dashboard and start the assigned repair path."
                : "The diagnostic found the patterns. The flagship repairs them: your full Red-Zone map across all seven subjects, wrong-answer forensics on every miss, targeted drills assigned per trap, timed retests until repaired patterns hold, and boot camps for the trap families that keep returning."}
            </p>
            <ul className="bridge-list">
              <li>RED-ZONE MAP</li>
              <li>WRONG ANSWER FORENSICS</li>
              <li>TARGETED DRILLS</li>
              <li>TIMED RETESTS</li>
              <li>BOOT CAMPS</li>
              <li>PATTERN MASTERY BOARD</li>
            </ul>
            {enrollmentCheck === "checking" && (
              <div className="bridge-price">
                <p className="line1">Checking your enrollment…</p>
                <p className="line2">If you just checked out, your dashboard will open next.</p>
              </div>
            )}
            {enrollmentCheck === "enrolled" && (
              <div className="bridge-buttons">
                <button className="btn-funnel" onClick={openDashboard}>
                  Open dashboard
                </button>
                <a className="btn-funnel alt" href="/account">
                  Account status
                </a>
              </div>
            )}
            {(enrollmentCheck === "anonymous" || enrollmentCheck === "not-enrolled") && (
              <>
                <div className="bridge-price">
                  <p className="line1">BarMatrix Flagship — $999</p>
                  <p className="line2">or $500 today + $499 in 30 days</p>
                  <p className="line3">Limited July-cycle cohort seats available.</p>
                </div>
                <div className="bridge-buttons">
                  <button className="btn-funnel" onClick={() => startCheckout("full")}>
                    Enroll — $999
                  </button>
                  <button className="btn-funnel alt" onClick={() => startCheckout("split")}>
                    Start with $500
                  </button>
                </div>
              </>
            )}
            {enrollmentCheck === "unavailable" && (
              <div className="bridge-buttons">
                <a className="btn-funnel" href="/account">
                  Check account access
                </a>
                <a className="btn-funnel alt" href="/dashboard">
                  Open dashboard
                </a>
              </div>
            )}
            <div className="trust-block">
              <p>You&rsquo;ve already seen the method work — it just read your answers back to you.</p>
              <p>The verdict above isn&rsquo;t a guess. It was built from your own answers, trap by trap.</p>
              <p>The diagnostic was free because the proof should come before the price.</p>
              <p>
                <a href="/refund.html" style={{ textDecoration: "underline" }}>Refund &amp; dispute policy</a> ·{" "}
                <a href="/privacy.html" style={{ textDecoration: "underline" }}>Privacy</a> ·{" "}
                <a href="/terms.html" style={{ textDecoration: "underline" }}>Terms</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
