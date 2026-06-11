// The drill player + TEAR forensics surface, extracted from pages/Drill.tsx so
// the library page and the first-repair loop render the identical experience.
// Pick-rate percentages are never exposed (VISION_LOCK).
import { useState, type ReactNode } from "react";

export interface DrillIndexEntry {
  id: string;
  title: string;
  subject: string;
  topic: string | null;
  subtopic: string | null;
  difficulty: number | null;
}

export interface KeyCard {
  id: string | null;
  statement: string | null;
  trigger: string | null;
  unlocks: string | null;
  authority?: string | null;
}

export interface ChoiceSignal {
  signal: string | null;
  lawyer: string | null;
  mold: string | null;
}

export interface DrillQuestion extends DrillIndexEntry {
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

export const LETTERS = ["A", "B", "C", "D"] as const;

export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}

export function Difficulty({ level }: { level: number | null }) {
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

interface DrillPlayerProps {
  question: DrillQuestion;
  /** Fires once when the answer is locked. */
  onLock?: (correct: boolean) => void;
  /** Navigation row rendered at the end of the forensics block. */
  footer: (state: { correct: boolean }) => ReactNode;
}

/** Mount with key={question.id} so picked/locked state resets per question. */
export function DrillPlayer({ question: q, onLock, footer }: DrillPlayerProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const revealed = locked && picked !== null;
  const correct = revealed && picked === q.key;
  const pickedDominant = revealed && q.dominantTrap !== null && picked === q.dominantTrap;
  const pickedSignal = picked ? q.choiceSignals[picked] : undefined;
  const wrongLetters = LETTERS.filter((l) => l !== q.key && q.choices[l]);

  return (
    <>
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
            onClick={() => {
              setLocked(true);
              if (picked) onLock?.(picked === q.key);
            }}
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

          <div className="drill-next-row">{footer({ correct })}</div>
        </div>
      )}
    </>
  );
}
