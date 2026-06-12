// /welcome — the buyer's home base. Day 1: first repair (P1 §1). Day 2–7:
// the next-action ladder (P1 §5) — overdue spaced retest → repair in
// progress → next zone → timed mixed set. Exactly ONE primary action per
// visit, plus the Red-Zone map's live state. A buyer with no diagnostic on
// record is routed into the diagnostic framed as setup.
import { useEffect, useMemo, useState } from "react";
import { SignedIn, SignedOut, useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { ApiError, apiFetch, type UsagePayload } from "../lib/api.ts";
import { brand } from "../content/brand.ts";
import { DASHBOARD_COPY } from "../content/dashboard.ts";
import { track } from "../lib/events.ts";
import {
  allUsedIds,
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
import { VerseLine } from "../components/VerseLine.tsx";
import type { PageProps, Route } from "../types.ts";

type WelcomeMode = "welcome" | "dashboard";

function fmtDay(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

const STATUS_COLOR: Record<ZoneStatus["kind"], string> = {
  repaired: "#8a6d1f", // brass — the repair stamp's resting color
  "retest-ready": "var(--red)",
  "in-repair": "var(--red)",
  queued: "var(--muted)",
};

const STATUS_GROUP_ORDER = ["in-repair", "retest-ready", "repaired", "queued"] as const;

function groupZoneStatuses(statuses: ZoneStatus[]) {
  return STATUS_GROUP_ORDER.map((kind) => ({
    kind,
    label: DASHBOARD_COPY.statuses[kind].group,
    help: DASHBOARD_COPY.statuses[kind].help,
    items: statuses.filter((s) => s.kind === kind),
  })).filter((group) => group.items.length > 0);
}

interface TodayDetails {
  title: string;
  reason: string;
  estimate: string;
  unlock: string;
}

function todayDetails(
  action: NextAction,
  map: ReturnType<typeof readMap>,
  statuses: ZoneStatus[],
): TodayDetails {
  switch (action.kind) {
    case "diagnostic":
      return {
        title: "Map the first repair target",
        reason:
          "The program needs your wrong-answer pattern before it can assign drills. The diagnostic creates the map.",
        estimate: "18 questions · about 12 minutes",
        unlock: "Unlocks your first Red-Zone repair loop.",
      };
    case "spaced_retest":
      return {
        title: `Hold check: ${action.program.zone.name}`,
        reason: `${action.program.zone.name} was repaired; the ${SPACED_RETEST_DAYS}-day retest is now due and outranks new work.`,
        estimate: "3 questions · timed",
        unlock: "A pass keeps the zone in holding and moves the dashboard forward.",
      };
    case "continue_repair":
      return {
        title: `Continue: ${action.program.zone.name}`,
        reason: "A repair loop is already open. Finishing it is more valuable than starting a new slice.",
        estimate:
          action.program.phase === "retest"
            ? "Timed retest ready"
            : `${Math.max(0, action.program.drillIds.length - action.program.drillsDone.length)} drills left`,
        unlock: "Completion schedules the hold check and updates the map.",
      };
    case "start_zone": {
      const drills = map ? Math.max(4, Math.min(6, zoneMemberCount(map, action.zone) * 2)) : 4;
      return {
        title: action.ordinal === 1 ? `First repair: ${action.zone.name}` : `Next repair: ${action.zone.name}`,
        reason:
          action.ordinal === 1
            ? "This is the highest-priority pattern from your diagnostic map."
            : "Earlier zones are either repaired, holding, or waiting on retest; this is the next live pattern.",
        estimate: `${drills} drills · timed retest · about 20 minutes`,
        unlock: "A pass marks this zone repaired for now and schedules the spaced retest.",
      };
    }
    case "mixed_set":
      return {
        title: "Timed mixed set",
        reason:
          statuses.length > 0
            ? "Every mapped zone is repaired or holding, so the next proof is mixed pressure."
            : "No sampled red zone is active, so the bank keeps watching under timed pressure.",
        estimate: "6 questions · 12 minutes",
        unlock: DASHBOARD_COPY.todayDefaultUnlock,
      };
  }
}

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
    <div className="dashboard-account-row" style={mono}>
      <div className="dashboard-panel-label">{DASHBOARD_COPY.accountLabel}</div>
      <SignedIn>
        <span>{user?.primaryEmailAddress?.emailAddress ?? "Signed in"} — progress follows your account</span>
        <button style={{ ...mono, textDecoration: "underline", color: "var(--ink)" }} onClick={() => void signOut()}>
          Sign out
        </button>
      </SignedIn>
      <SignedOut>
        <span>If you just enrolled, create or sign into the account that uses your checkout email. Browser-only progress is still saved here.</span>
        <button style={{ ...mono, textDecoration: "underline", color: "var(--ink)" }} onClick={() => navigate("sign-in")}>
          Sign in
        </button>
        <button style={{ ...mono, textDecoration: "underline", color: "var(--ink)" }} onClick={() => navigate("sign-up")}>
          Create with checkout email
        </button>
      </SignedOut>
    </div>
  );
}

export function Welcome({ navigate, mode = "welcome" }: PageProps & { mode?: WelcomeMode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const map = useMemo(readMap, []);
  const set = useMemo(readProgramSet, []);
  const action: NextAction = useMemo(() => nextAction(set, map), [set, map]);
  const statuses: ZoneStatus[] = useMemo(() => zoneStatuses(set, map), [set, map]);
  const today = useMemo(() => todayDetails(action, map, statuses), [action, map, statuses]);
  const purchaseSuccess = useMemo(
    () => new URLSearchParams(window.location.search).get("purchase") === "success",
    [],
  );
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

  let cta: { label: string; to: Route };
  switch (action.kind) {
    case "diagnostic":
      cta = { label: "Take your diagnostic", to: "diagnostic" };
      break;
    case "spaced_retest":
      cta = { label: `Run the ${SPACED_RETEST_DAYS}-day retest`, to: "repair" };
      break;
    case "continue_repair":
      cta = { label: "Continue the repair", to: "repair" };
      break;
    case "start_zone":
      cta = {
        label: action.ordinal === 1 ? "Start the first repair" : "Start the next repair",
        to: "repair",
      };
      break;
    case "mixed_set":
      cta = { label: "Start a timed mixed set", to: "repair" };
      break;
  }

  const shell = (
    <div className="welcome-wrap">
      <div className="brand" style={{ marginBottom: 40, cursor: "pointer" }} onClick={() => navigate("home")}>
        <span className="mark">B</span>
        <span>
          {brand.name}
          <span className="dot" />
        </span>
      </div>

      <h1 className={`welcome-in${reduced ? "" : " bm-rise"}`}>
        {mode === "dashboard" ? DASHBOARD_COPY.dashboardTitle : DASHBOARD_COPY.welcomeTitle}
      </h1>
      <div className="welcome-cohort">{DASHBOARD_COPY.cohort}</div>

      {mode === "welcome" && purchaseSuccess && (
        <div
          className={reduced ? "" : "bm-rise"}
          style={{ maxWidth: 560, border: "1px solid var(--rule)", padding: 18, margin: "24px 0", background: "var(--paper)" }}
        >
          <p className="mono" style={{ margin: 0, fontSize: 11, letterSpacing: "0.08em", color: "var(--muted)", lineHeight: 1.6 }}>
            {DASHBOARD_COPY.purchaseSuccess}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
            <button className="btn red btn-sm" onClick={() => navigate("sign-up")}>Create account</button>
            <button className="btn ghost btn-sm" onClick={() => navigate("sign-in")}>Sign in</button>
          </div>
        </div>
      )}

      {action.kind === "diagnostic" ? (
        stage >= 1 && (
          <div className={reduced ? "" : "bm-rise"}>
            <TodayCard
              cta={cta}
              details={today}
              navigate={navigate}
              showOptionalLibrary={false}
            />
          </div>
        )
      ) : (
        <>
          {stage >= 1 && nameplate && (
            <div className={`rz-nameplate${reduced ? "" : " bm-stamp"}`}>{nameplate}</div>
          )}
          {stage >= 2 && (
            <TodayCard
              cta={cta}
              details={today}
              navigate={navigate}
              showOptionalLibrary={mode === "dashboard"}
            />
          )}

          {stage >= 3 && <ZoneMap statuses={statuses} />}
        </>
      )}

      {stage >= 3 && <ProgressMirror set={set} statuses={statuses} />}
      {stage >= 3 && <UsageMirror />}
      {stage >= 3 && (
        <div className={reduced ? "" : "bm-rise"} style={{ marginTop: 48, maxWidth: 560 }}>
          <VerseLine theme="hope" />
        </div>
      )}
      {stage >= 3 && <AccountRow navigate={navigate} />}
    </div>
  );

  if (mode === "dashboard" && !isSignedIn) {
    return <DashboardAuthGate checking={!isLoaded} navigate={navigate} />;
  }

  return shell;
}

function DashboardAuthGate({ checking, navigate }: PageProps & { checking: boolean }) {
  return (
    <div className="welcome-wrap">
      <div className="brand" style={{ marginBottom: 40, cursor: "pointer" }} onClick={() => navigate("home")}>
        <span className="mark">B</span>
        <span>
          {brand.name}
          <span className="dot" />
        </span>
      </div>
      <h1 className="welcome-in">{DASHBOARD_COPY.authTitle}</h1>
      <p className="body-lg" style={{ maxWidth: "44ch", marginBottom: 24 }}>
        {checking ? "Checking dashboard access…" : DASHBOARD_COPY.authBody}
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn red btn-lg" onClick={() => navigate("sign-in")}>
          Sign in <span className="arrow">→</span>
        </button>
        <button className="btn ghost btn-lg" onClick={() => navigate("sign-up")}>
          Create account
        </button>
      </div>
    </div>
  );
}

function TodayCard({
  cta,
  details,
  navigate,
  showOptionalLibrary,
}: {
  cta: { label: string; to: Route };
  details: TodayDetails;
  navigate: PageProps["navigate"];
  showOptionalLibrary: boolean;
}) {
  return (
    <section className="dashboard-today">
      <div className="dashboard-panel-label">{DASHBOARD_COPY.todayLabel}</div>
      <h2>{details.title}</h2>
      <p>{details.reason}</p>
      <div className="dashboard-today-meta">
        <span>{details.estimate}</span>
        <span>{details.unlock}</span>
      </div>
      <div className="dashboard-actions">
        <button className="btn btn-lg red" onClick={() => navigate(cta.to)}>
          {cta.label} <span className="arrow">→</span>
        </button>
        {showOptionalLibrary && (
          <button className="btn ghost btn-sm" onClick={() => navigate("practice")}>
            {DASHBOARD_COPY.optionalLibraryLabel}
          </button>
        )}
      </div>
      {showOptionalLibrary && <p className="dashboard-note">{DASHBOARD_COPY.optionalLibraryNote}</p>}
    </section>
  );
}

function ZoneMap({ statuses }: { statuses: ZoneStatus[] }) {
  if (statuses.length === 0) {
    return (
      <section className="dashboard-panel">
        <div className="dashboard-panel-label">{DASHBOARD_COPY.mapLabel}</div>
        <p className="dashboard-note">{DASHBOARD_COPY.mapEmpty}</p>
      </section>
    );
  }

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-label">{DASHBOARD_COPY.mapLabel}</div>
      {groupZoneStatuses(statuses).map((group) => (
        <div className="dashboard-map-group" key={group.kind}>
          <div className="dashboard-map-group-head">
            <span>{group.label}</span>
            <span>{group.help}</span>
          </div>
          {group.items.map((s) => (
            <div className="dashboard-map-row" key={`${s.zone.filter_broken}|${s.zone.mold}`}>
              <span className="serif">{s.zone.name}</span>
              <span className="mono" style={{ color: STATUS_COLOR[s.kind] }}>
                {DASHBOARD_COPY.statuses[s.kind].label}
                {s.kind === "repaired" && s.retestAt ? ` · RETEST ${fmtDay(s.retestAt).toUpperCase()}` : ""}
              </span>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

function ProgressMirror({
  set,
  statuses,
}: {
  set: ReturnType<typeof readProgramSet>;
  statuses: ZoneStatus[];
}) {
  const repaired = statuses.filter((s) => s.kind === "repaired").length;
  const retestReady = statuses.filter((s) => s.kind === "retest-ready").length;
  const used = allUsedIds(set).length;
  const keyMoves = new Set(statuses.map((s) => s.zone.silverKeyMove).filter(Boolean)).size;

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-label">{DASHBOARD_COPY.progressLabel}</div>
      <div className="dashboard-mirror-grid">
        <div>
          <span>{statuses.length}</span>
          <p>mapped zones</p>
        </div>
        <div>
          <span>{repaired}</span>
          <p>holding</p>
        </div>
        <div>
          <span>{retestReady}</span>
          <p>retests ready</p>
        </div>
        <div>
          <span>{used}</span>
          <p>questions in ledger</p>
        </div>
      </div>
      <div className="dashboard-insight">
        <div className="dashboard-panel-label">{DASHBOARD_COPY.insightsLabel}</div>
        <p>
          {keyMoves > 0
            ? `${keyMoves} recovery ${keyMoves === 1 ? "move is" : "moves are"} already tied to your map. Earned truths and keys stay read-only here; they never become another picker.`
            : "Earned truths, keys, and misconception patterns will appear here as you complete assigned work."}
        </p>
      </div>
    </section>
  );
}

// ——— Usage mirror: a quiet glass panel, not a task. Renders only when the
// signed-in student is enrolled AND has server-recorded practice. Counts,
// accuracy, and time only — no streaks, no percentiles (maps and mirrors).
function UsageMirror() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [usage, setUsage] = useState<UsagePayload | null>(null);
  const [enrollmentIssue, setEnrollmentIssue] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const payload = await apiFetch<UsagePayload>("/api/me/usage", { token });
        if (!cancelled && payload.totals.attempts > 0) setUsage(payload);
      } catch (error) {
        if (error instanceof ApiError && error.status === 403) setEnrollmentIssue(true);
        // Network and empty-account states keep the mirror quiet.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, getToken]);

  if (enrollmentIssue) {
    return (
      <div style={{ marginTop: 48, maxWidth: 560, borderTop: "1px solid var(--rule)", paddingTop: 18 }}>
        <div
          className="mono"
          style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--red)", marginBottom: 10 }}
        >
          ▌ Enrollment not found for this account
        </div>
        <p className="mono" style={{ fontSize: 12, color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
          Use the exact email from checkout, or send the receipt email to support@barmatrix.app so the seat can be matched.
        </p>
      </div>
    );
  }

  if (!usage) return null;

  return (
    <div style={{ marginTop: 48, maxWidth: 560 }}>
      <div
        className="mono"
        style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}
      >
        ▌ Your work, mirrored
      </div>
      <p className="mono" style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 10px" }}>
        {usage.totals.questions_seen} questions faced ·{" "}
        {usage.totals.accuracy !== null ? `${Math.round(usage.totals.accuracy * 100)}% held` : ""} ·{" "}
        {Math.round(usage.totals.time_seconds / 60)} min under pressure
      </p>
      {usage.by_subject.map((s) => (
        <div
          key={s.subject}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 16,
            padding: "8px 0",
            borderTop: "1px solid var(--rule)",
          }}
        >
          <span className="serif" style={{ fontWeight: 600, fontSize: 14 }}>
            {s.subject_code
              ? s.subject_code.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())
              : s.subject}
          </span>
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", whiteSpace: "nowrap", color: "var(--muted)" }}>
            {s.questions_seen} SEEN
            {s.accuracy !== null ? ` · ${Math.round(s.accuracy * 100)}% HELD` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
