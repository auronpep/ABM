// /welcome — the buyer's home base. Day 1: first repair (P1 §1). Day 2–7:
// the next-action ladder (P1 §5) — overdue spaced retest → repair in
// progress → next zone → timed mixed set. Exactly ONE primary action per
// visit, plus the Red-Zone map's live state. A buyer with no diagnostic on
// record is routed into the diagnostic framed as setup.
import { useEffect, useMemo, useState } from "react";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/clerk-react";
import { brand } from "../content/brand.ts";
import { track } from "../lib/events.ts";
import {
  nextAction,
  zoneStatuses,
  type NextAction,
  type ZoneStatus,
} from "../program/plan.ts";
import {
  SPACED_RETEST_DAYS,
  readMap,
  readProgramSet,
  zoneMemberCount,
} from "../program/repair.ts";
import type { PageProps, Route } from "../types.ts";

function fmtDay(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

const STATUS_LABEL: Record<ZoneStatus["kind"], string> = {
  repaired: "REPAIRED · HOLDING",
  "retest-ready": "RETEST READY",
  "in-repair": "IN REPAIR",
  queued: "QUEUED",
};

const STATUS_COLOR: Record<ZoneStatus["kind"], string> = {
  repaired: "#8a6d1f", // brass — the repair stamp's resting color
  "retest-ready": "var(--red)",
  "in-repair": "var(--red)",
  queued: "var(--muted)",
};

function AccountRow({ navigate }: PageProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const mono: React.CSSProperties = {
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.08em",
    color: "var(--muted)",
  };
  return (
    <div style={{ ...mono, marginTop: 56, paddingTop: 14, borderTop: "1px solid var(--rule)", display: "flex", gap: 18, flexWrap: "wrap" }}>
      <SignedIn>
        <span>{user?.primaryEmailAddress?.emailAddress ?? "Signed in"} — progress follows your account</span>
        <button style={{ ...mono, textDecoration: "underline", color: "var(--ink)" }} onClick={() => void signOut()}>
          Sign out
        </button>
      </SignedIn>
      <SignedOut>
        <span>Progress is saved in this browser.</span>
        <button style={{ ...mono, textDecoration: "underline", color: "var(--ink)" }} onClick={() => navigate("sign-in")}>
          Sign in
        </button>
        <button style={{ ...mono, textDecoration: "underline", color: "var(--ink)" }} onClick={() => navigate("sign-up")}>
          Create an account — take it to any device
        </button>
      </SignedOut>
    </div>
  );
}

export function Welcome({ navigate }: PageProps) {
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const map = useMemo(readMap, []);
  const set = useMemo(readProgramSet, []);
  const action: NextAction = useMemo(() => nextAction(set, map), [set, map]);
  const statuses: ZoneStatus[] = useMemo(() => zoneStatuses(set, map), [set, map]);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    track("first_login", { has_map: map !== null });
    if (action.kind === "spaced_retest") {
      track("retest_overdue_shown", { zone: action.program.zone.name });
    }
    if (reduced) {
      setStage(3);
      return;
    }
    const timers = [
      window.setTimeout(() => setStage(1), 600),
      window.setTimeout(() => setStage(2), 1400),
      window.setTimeout(() => setStage(3), 2200),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ——— The one primary action (P1 §1, §5) ———
  const nameplate =
    action.kind === "spaced_retest" || action.kind === "continue_repair"
      ? action.program.zone.name
      : action.kind === "start_zone"
        ? action.zone.name
        : statuses[0]?.zone.name ?? null;

  let statusLine: string;
  let cta: { label: string; to: Route };
  switch (action.kind) {
    case "diagnostic":
      statusLine = "";
      cta = { label: "Take your diagnostic", to: "diagnostic" };
      break;
    case "spaced_retest":
      statusLine = `${action.program.zone.name} was repaired — the ${SPACED_RETEST_DAYS}-day retest is ready. Three questions, timed, to prove it held.`;
      cta = { label: `Run the ${SPACED_RETEST_DAYS}-day retest`, to: "repair" };
      break;
    case "continue_repair":
      statusLine = `${action.program.zone.name} — repair in progress. Pick up where you left off.`;
      cta = { label: "Continue the repair", to: "repair" };
      break;
    case "start_zone": {
      const drills = map ? Math.max(4, Math.min(6, zoneMemberCount(map, action.zone) * 2)) : 4;
      statusLine =
        action.ordinal === 1
          ? `Your first repair starts with ${action.zone.name}. ${drills} drills, then a timed retest. About 20 minutes.`
          : `${action.zone.name} is next on your map. ${drills} drills, then a timed retest — the same loop that repaired your last zone.`;
      cta = {
        label: action.ordinal === 1 ? "Start the first repair" : "Start the next repair",
        to: "repair",
      };
      break;
    }
    case "mixed_set":
      statusLine =
        statuses.length > 0
          ? "Every mapped zone is repaired and holding. Today's work: a timed mixed set — questions drawn across your trap families, on the clock."
          : "Your map came back clean on the sampled questions. Your first session is a timed mixed set — the bank keeps watching for the pattern.";
      cta = { label: "Start a timed mixed set", to: "repair" };
      break;
  }

  return (
    <div className="welcome-wrap">
      <div className="brand" style={{ marginBottom: 40, cursor: "pointer" }} onClick={() => navigate("home")}>
        <span className="mark">B</span>
        <span>
          {brand.name}
          <span className="dot" />
        </span>
      </div>

      <h1 className={`welcome-in${reduced ? "" : " bm-rise"}`}>You&rsquo;re in.</h1>
      <div className="welcome-cohort">July 2026 cohort</div>

      {action.kind === "diagnostic" ? (
        stage >= 1 && (
          <div className={reduced ? "" : "bm-rise"}>
            <p className="body-lg" style={{ maxWidth: "44ch", marginBottom: 28 }}>
              First, we map you. 18 questions, about 12 minutes — your wrong answers build
              the Red-Zone map everything else is assigned from.
            </p>
            <button className="btn btn-lg red" onClick={() => navigate("diagnostic")}>
              Take your diagnostic <span className="arrow">→</span>
            </button>
          </div>
        )
      ) : (
        <>
          {stage >= 1 && nameplate && (
            <div className={`rz-nameplate${reduced ? "" : " bm-stamp"}`}>{nameplate}</div>
          )}
          {stage >= 2 && (
            <p className={`body-lg${reduced ? "" : " bm-rise"}`} style={{ maxWidth: "44ch", margin: "10px 0 28px" }}>
              {statusLine}
            </p>
          )}
          {stage >= 3 && (
            <div className={reduced ? "" : "bm-rise"}>
              <button className="btn btn-lg red" onClick={() => navigate(cta.to)}>
                {cta.label} <span className="arrow">→</span>
              </button>
            </div>
          )}

          {/* ——— The map's live state: every zone, one line each ——— */}
          {stage >= 3 && statuses.length > 0 && (
            <div className={reduced ? "" : "bm-rise"} style={{ marginTop: 48, maxWidth: 560 }}>
              <div
                className="mono"
                style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}
              >
                ▌ Your Red-Zone map
              </div>
              {statuses.map((s) => (
                <div
                  key={`${s.zone.filter_broken}|${s.zone.mold}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 16,
                    padding: "10px 0",
                    borderTop: "1px solid var(--rule)",
                  }}
                >
                  <span className="serif" style={{ fontWeight: 600, fontSize: 15 }}>
                    {s.zone.name}
                  </span>
                  <span
                    className="mono"
                    style={{ fontSize: 10, letterSpacing: "0.12em", fontWeight: 700, whiteSpace: "nowrap", color: STATUS_COLOR[s.kind] }}
                  >
                    {STATUS_LABEL[s.kind]}
                    {s.kind === "repaired" && s.retestAt ? ` · RETEST ${fmtDay(s.retestAt).toUpperCase()}` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {stage >= 3 && <AccountRow navigate={navigate} />}
    </div>
  );
}
