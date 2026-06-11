// Repair Drills — the live question library. The player + TEAR forensics
// surface lives in components/DrillPlayer.tsx (shared with the first-repair
// loop). Question payloads are built from the finished CQ bank by
// scripts/build_qdata.py and served from /qdata/*.json.
import { useEffect, useMemo, useState } from "react";
import {
  Difficulty,
  DrillPlayer,
  type DrillIndexEntry,
  type DrillQuestion,
} from "../components/DrillPlayer.tsx";
import type { PageProps } from "../types.ts";

export function Drill({ navigate }: PageProps) {
  const [index, setIndex] = useState<DrillIndexEntry[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [question, setQuestion] = useState<DrillQuestion | null>(null);

  useEffect(() => {
    fetch("/qdata/index.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setIndex)
      .catch((e: unknown) => setLoadError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  useEffect(() => {
    if (!activeId) {
      setQuestion(null);
      return;
    }
    setQuestion(null);
    fetch(`/qdata/${activeId}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setQuestion)
      .catch((e: unknown) => setLoadError(e instanceof Error ? e.message : "Failed to load"));
    window.scrollTo(0, 0);
  }, [activeId]);

  const bySubject = useMemo(() => {
    const groups = new Map<string, DrillIndexEntry[]>();
    (index ?? []).forEach((e) => {
      const list = groups.get(e.subject) ?? [];
      groups.set(e.subject, [...list, e]);
    });
    return [...groups.entries()];
  }, [index]);

  const nextId = useMemo(() => {
    if (!index || !activeId) return null;
    const i = index.findIndex((e) => e.id === activeId);
    return i >= 0 && i + 1 < index.length ? index[i + 1].id : null;
  }, [index, activeId]);

  if (loadError) {
    return (
      <div className="container section">
        <div className="eyebrow-red">▌ Repair Drills</div>
        <h1 className="display display-lg">The drill library could not load.</h1>
        <p className="body-lg">({loadError}) Refresh the page to try again.</p>
      </div>
    );
  }

  // ——— Library view ———
  if (!activeId) {
    return (
      <div className="container section drill-library">
        <div className="eyebrow-red" style={{ marginBottom: 18 }}>
          ▌ Repair Drills · The Live Bank
        </div>
        <h1 className="display display-lg" style={{ margin: "0 0 18px", maxWidth: "22ch" }}>
          Every drill ends in a verdict: true and responsive, or counterfeit.
        </h1>
        <p className="body-lg" style={{ maxWidth: "62ch", marginBottom: 14 }}>
          Real MBE mechanics, set in the world you actually live in. Answer under pressure, then
          run the TEAR forensics: see exactly which counterfeit almost persuaded you, the keys
          that break it, and the repair that keeps the point next time.
        </p>
        {index === null ? (
          <p className="mono" style={{ color: "var(--muted)" }}>
            Loading the drill bank…
          </p>
        ) : (
          <>
            <p className="mono drill-count">
              {index.length} drills · {bySubject.length} subjects
            </p>
            {bySubject.map(([subject, entries]) => (
              <div key={subject} className="drill-subject-block">
                <div className="section-rule">
                  <span className="label">
                    {subject} · {entries.length}
                  </span>
                </div>
                <div className="drill-grid">
                  {entries.map((e) => (
                    <button key={e.id} className="drill-card" onClick={() => setActiveId(e.id)}>
                      <div className="drill-card-top">
                        <span className="mono id">{e.id}</span>
                        <Difficulty level={e.difficulty} />
                      </div>
                      <div className="drill-card-title">{e.title}</div>
                      <div className="drill-card-meta">
                        {[e.topic, e.subtopic].filter(Boolean).join(" · ")}
                      </div>
                      <div className="drill-card-cta">
                        Run the drill <span className="arrow">→</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  // ——— Player view ———
  if (!question) {
    return (
      <div className="container section">
        <p className="mono" style={{ color: "var(--muted)" }}>
          Loading {activeId}…
        </p>
      </div>
    );
  }

  return (
    <div className="container section drill-player">
      <div className="drill-player-top">
        <button className="mono drill-back" onClick={() => setActiveId(null)}>
          ← All drills
        </button>
        <span className="mono drill-id">{question.id}</span>
      </div>

      <DrillPlayer
        key={question.id}
        question={question}
        footer={() => (
          <>
            <button className="btn ghost btn-lg" onClick={() => setActiveId(null)}>
              Back to the library
            </button>
            {nextId && (
              <button className="btn red btn-lg" onClick={() => setActiveId(nextId)}>
                Next drill <span className="arrow">→</span>
              </button>
            )}
            <button className="btn ghost btn-lg" onClick={() => navigate("pricing")}>
              Enter the Repair Path
            </button>
          </>
        )}
      />
    </div>
  );
}
