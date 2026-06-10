// Repair Drills — the live question library + TEAR forensics player.
// Question payloads are built from the finished CQ bank by scripts/build_qdata.py
// and served from /qdata/*.json. Pick-rate percentages are never exposed (VISION_LOCK).
import { useEffect, useMemo, useState } from "react";
import type { PageProps } from "../types.ts";

interface DrillIndexEntry {
  id: string;
  title: string;
  subject: string;
  topic: string | null;
  subtopic: string | null;
  difficulty: number | null;
}

interface KeyCard {
  id: string | null;
  statement: string | null;
  trigger: string | null;
  unlocks: string | null;
  authority?: string | null;
}

interface ChoiceSignal {
  signal: string | null;
  lawyer: string | null;
  mold: string | null;
}

interface DrillQuestion extends DrillIndexEntry {
  tension: string | null;
  stem: string;
  call: string | null;
  choices: Record<string, string>;
  key: string;
  dominantTrap: string | null;
  rightExplanation: string | null;
  wrongExplanations: Record<string, string>;
  c3: { label: string; text: string }[];
  studentScript: string | null;
  recoveryPaths: { choice: string; text: string }[];
  choiceSignals: Record<string, ChoiceSignal>;
  goldKeys: KeyCard[];
  silverKeys: KeyCard[];
  remediation: {
    title: string | null;
    signal: string | null;
    studentMove: string | null;
    tinyRule: string | null;
    trap: string | null;
  } | null;
}

const LETTERS = ["A", "B", "C", "D"] as const;

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}

function Difficulty({ level }: { level: number | null }) {
  if (!level) return null;
  return (
    <span className="drill-difficulty" title={`Difficulty ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= level ? "on" : ""}>
          ▮
        </span>
      ))}
    </span>
  );
}

function KeyCards({ kind, cards }: { kind: "Gold" | "Silver"; cards: KeyCard[] }) {
  if (!cards.length) return null;
  return (
    <div className="drill-keys">
      {cards.map((k, i) => (
        <div className={`drill-key ${kind.toLowerCase()}`} key={k.id ?? i}>
          <div className="drill-key-head">
            <span className="glyph">{kind === "Gold" ? "🗝" : "⚿"}</span>
            <span>
              {kind} Key{k.id ? ` · ${k.id}` : ""}
            </span>
          </div>
          {k.statement && <p className="statement">{k.statement}</p>}
          {k.trigger && (
            <p className="meta">
              <strong>Trigger:</strong> {k.trigger}
            </p>
          )}
          {k.unlocks && (
            <p className="meta">
              <strong>Unlocks:</strong> {k.unlocks}
            </p>
          )}
          {k.authority && <p className="meta authority">{k.authority}</p>}
        </div>
      ))}
    </div>
  );
}

export function Drill({ navigate }: PageProps) {
  const [index, setIndex] = useState<DrillIndexEntry[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [question, setQuestion] = useState<DrillQuestion | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

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
    setPicked(null);
    setLocked(false);
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

  const q = question;
  const revealed = locked && picked !== null;
  const correct = revealed && picked === q.key;
  const pickedDominant = revealed && q.dominantTrap !== null && picked === q.dominantTrap;
  const pickedSignal = picked ? q.choiceSignals[picked] : undefined;
  const wrongLetters = LETTERS.filter((l) => l !== q.key && q.choices[l]);

  return (
    <div className="container section drill-player">
      <div className="drill-player-top">
        <button className="mono drill-back" onClick={() => setActiveId(null)}>
          ← All drills
        </button>
        <span className="mono drill-id">{q.id}</span>
      </div>

      <div className="drill-meta-strip">
        <div>
          <div className="k">Subject</div>
          <div className="v">{q.subject}</div>
        </div>
        {q.subtopic && (
          <div>
            <div className="k">Subtopic</div>
            <div className="v">{q.subtopic}</div>
          </div>
        )}
        {q.tension && (
          <div>
            <div className="k">Tension</div>
            <div className="v">{q.tension}</div>
          </div>
        )}
        {q.difficulty != null && (
          <div>
            <div className="k">Difficulty</div>
            <div className="v">
              <Difficulty level={q.difficulty} />
            </div>
          </div>
        )}
      </div>

      <h1 className="display display-md drill-title">{q.title}</h1>

      <div className="drill-stem serif">
        <Paragraphs text={q.stem} />
      </div>

      <div className="drill-choices">
        {LETTERS.filter((l) => q.choices[l]).map((l) => {
          const isPicked = picked === l;
          const cls = ["drill-choice"];
          if (revealed) {
            if (l === q.key) cls.push("correct");
            else if (isPicked) cls.push("picked-wrong");
            else cls.push("dim");
          } else if (isPicked) {
            cls.push("picked");
          }
          return (
            <button
              key={l}
              className={cls.join(" ")}
              onClick={() => {
                if (!locked) setPicked(l);
              }}
            >
              <span className="letter">{l}</span>
              <span className="text">{q.choices[l]}</span>
              {revealed && l === q.key && <span className="verdict mono">CREDITED</span>}
              {revealed && isPicked && l !== q.key && (
                <span className="verdict mono red">YOUR PICK</span>
              )}
            </button>
          );
        })}
      </div>

      {!revealed && (
        <div className="drill-lock-row">
          <span className="mono hint">Pick the answer you would trust under exam pressure</span>
          <button
            className="btn btn-lg red"
            disabled={!picked}
            style={{ opacity: picked ? 1 : 0.4 }}
            onClick={() => setLocked(true)}
          >
            Lock my answer <span className="arrow">→</span>
          </button>
        </div>
      )}

      {revealed && (
        <div className="drill-forensics">
          <div className={`drill-verdict ${correct ? "good" : "bad"}`}>
            <div className="mono label">▌ The Verdict</div>
            <div className="line">
              {correct
                ? "True and responsive. You kept the point."
                : pickedDominant
                  ? "You picked the counterfeit — the same one that takes the most points on this question."
                  : "You picked a counterfeit. Here is how it persuaded you."}
            </div>
          </div>

          {!correct && pickedSignal && (
            <div className="drill-block">
              <div className="mono block-label red">▌ Why {picked} almost worked</div>
              {pickedSignal.signal && <p className="serif lead">{pickedSignal.signal}</p>}
              {pickedSignal.lawyer && <p className="lawyer">{pickedSignal.lawyer}</p>}
            </div>
          )}

          {q.c3.length > 0 && (
            <div className="drill-block">
              <div className="mono block-label">▌ The Elimination — Cut · Clash · Call</div>
              <div className="drill-c3">
                {q.c3.map((s, i) => (
                  <div className="row" key={i}>
                    <div className="step mono">{s.label}</div>
                    <div className="txt">{s.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {q.rightExplanation && (
            <div className="drill-block">
              <div className="mono block-label good">▌ Why {q.key} is credited</div>
              <div className="prose">
                <Paragraphs text={q.rightExplanation} />
              </div>
            </div>
          )}

          <div className="drill-block">
            <div className="mono block-label red">▌ The counterfeits, one by one</div>
            {wrongLetters.map((l) => {
              const expl = q.wrongExplanations[l];
              const sig = q.choiceSignals[l];
              const body = expl ?? sig?.lawyer ?? sig?.signal;
              if (!body) return null;
              return (
                <div className="drill-wrong" key={l}>
                  <div className="head">
                    <span className="letter">{l}</span>
                    {q.dominantTrap === l && <span className="tag red">▸ The Dominant Trap</span>}
                    {sig?.mold && <span className="tag">{sig.mold.split("_").join(" ")}</span>}
                  </div>
                  <div className="prose">
                    <Paragraphs text={body} />
                  </div>
                </div>
              );
            })}
          </div>

          <KeyCards kind="Gold" cards={q.goldKeys} />
          <KeyCards kind="Silver" cards={q.silverKeys} />

          {q.remediation?.title && (
            <div className="drill-remediation">
              <div className="mono rem-label">REPAIR CARD · {q.remediation.title}</div>
              {q.remediation.signal && (
                <div className="rem-row">
                  <span className="k mono">Signal</span>
                  <span>{q.remediation.signal}</span>
                </div>
              )}
              {q.remediation.studentMove && (
                <div className="rem-row">
                  <span className="k mono">Move</span>
                  <span>{q.remediation.studentMove}</span>
                </div>
              )}
              {q.remediation.tinyRule && (
                <div className="rem-row">
                  <span className="k mono">Tiny rule</span>
                  <span>{q.remediation.tinyRule}</span>
                </div>
              )}
              {q.remediation.trap && (
                <div className="rem-row">
                  <span className="k mono">The trap</span>
                  <span>{q.remediation.trap}</span>
                </div>
              )}
            </div>
          )}

          {q.studentScript && (
            <div className="drill-block">
              <div className="mono block-label">▌ Say it like this on exam day</div>
              <p className="serif script">“{q.studentScript}”</p>
            </div>
          )}

          {q.recoveryPaths.length > 0 && (
            <div className="drill-block">
              <div className="mono block-label">▌ Recovery paths</div>
              {q.recoveryPaths.map((r) => (
                <p key={r.choice} className="prose">
                  <strong>If you chose {r.choice}:</strong> {r.text}
                </p>
              ))}
            </div>
          )}

          <div className="drill-next-row">
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
          </div>
        </div>
      )}
    </div>
  );
}
