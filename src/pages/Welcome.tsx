// /welcome — Day-1 buyer experience, first 60 seconds (P1 §1).
// Reads the diagnostic Red-Zone map carried in this browser; a buyer with no
// diagnostic on record is routed into the diagnostic framed as setup.
import { useEffect, useMemo, useState } from "react";
import { brand } from "../content/brand.ts";
import { track } from "../lib/events.ts";
import type { PageProps } from "../types.ts";

const REDZONE_MAP_KEY = "bm_redzone_map";

interface StoredMap {
  ts: number;
  total: number;
  score: number;
  misses: Array<{ qid: string; title: string; subject: string; trapName: string }>;
  zones: Array<{ name: string; members: string[] }>;
}

function readMap(): StoredMap | null {
  try {
    const raw = localStorage.getItem(REDZONE_MAP_KEY);
    return raw ? (JSON.parse(raw) as StoredMap) : null;
  } catch {
    return null;
  }
}

export function Welcome({ navigate }: PageProps) {
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const map = useMemo(readMap, []);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    track("first_login", { has_map: map !== null });
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
  }, [map, reduced]);

  const topZone = map?.zones[0]?.name ?? map?.misses[0]?.trapName ?? null;
  const drillCount = map ? Math.max(4, Math.min(6, (map.zones[0]?.members.length ?? 1) * 2)) : 0;

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

      {map === null ? (
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
          {stage >= 1 && topZone && (
            <div className={`rz-nameplate${reduced ? "" : " bm-stamp"}`}>{topZone}</div>
          )}
          {stage >= 2 && (
            <p className={`body-lg${reduced ? "" : " bm-rise"}`} style={{ maxWidth: "44ch", margin: "10px 0 28px" }}>
              {topZone
                ? `Your first repair starts with ${topZone}. ${drillCount} drills, then a timed retest. About 20 minutes.`
                : `Your map came back clean on the sampled questions. Your first session is a timed mixed set — the bank keeps watching for the pattern.`}
            </p>
          )}
          {stage >= 3 && (
            <div className={reduced ? "" : "bm-rise"}>
              <button className="btn btn-lg red" onClick={() => navigate("drills")}>
                Start the first repair <span className="arrow">→</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
