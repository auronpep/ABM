// /prayer — prayer requests and the Ebenezer (answered-prayer) wall.
// Private by default: a request stays between the student, the team, and the
// Lord unless they choose to share it with the cohort. Requests persist
// locally in this build — the shared store, founder prayer-list delivery, and
// moderation pass before cross-user visibility are founder-gated
// (APPROVALS_NEEDED §10), the same precedent as the Prayer Chain stub.
import { useMemo, useState } from "react";
import { VerseLine } from "../components/VerseLine.tsx";
import { scripture } from "../content/scripture.ts";
import { track } from "../lib/events.ts";
import type { PageProps } from "../types.ts";

const STORAGE_KEY = "bm_prayer_requests_local";

interface PrayerRequest {
  id: string;
  ts: number;
  text: string;
  shared: boolean;
  prayedCount: number;
  answered: boolean;
  answeredTs?: number;
  testimony?: string;
}

function readRequests(): PrayerRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PrayerRequest[]) : [];
  } catch {
    return [];
  }
}

function persist(requests: PrayerRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // storage unavailable — the request still shows for this session
  }
}

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { month: "long", day: "numeric" });
}

export function Prayer({ navigate }: PageProps) {
  const [requests, setRequests] = useState<PrayerRequest[]>(readRequests);
  const [draft, setDraft] = useState("");
  const [shareDraft, setShareDraft] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [testimonyDraft, setTestimonyDraft] = useState("");

  const open = useMemo(() => requests.filter((r) => !r.answered), [requests]);
  const answered = useMemo(
    () => [...requests.filter((r) => r.answered)].sort((a, b) => (b.answeredTs ?? 0) - (a.answeredTs ?? 0)),
    [requests],
  );

  const update = (next: PrayerRequest[]) => {
    persist(next);
    setRequests(next);
  };

  const submit = () => {
    setError(null);
    setJustSubmitted(false);
    const text = draft.trim();
    if (!text) {
      setError("Write the request first — a sentence is plenty.");
      return;
    }
    const req: PrayerRequest = {
      id: `pr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      ts: Date.now(),
      text,
      shared: shareDraft,
      prayedCount: 0,
      answered: false,
    };
    update([req, ...requests]);
    // Aggregate only — no request text or names in events (doc 04 rule 3).
    track("prayer_request_submitted", { shared: req.shared });
    setDraft("");
    setShareDraft(false);
    setJustSubmitted(true);
  };

  const interceded = (id: string) => {
    update(requests.map((r) => (r.id === id ? { ...r, prayedCount: r.prayedCount + 1 } : r)));
    track("prayer_interceded", {});
  };

  const markAnswered = (id: string) => {
    const testimony = testimonyDraft.trim();
    update(
      requests.map((r) =>
        r.id === id
          ? { ...r, answered: true, answeredTs: Date.now(), testimony: testimony || undefined }
          : r,
      ),
    );
    track("prayer_request_answered", { has_testimony: testimony.length > 0 });
    setAnsweringId(null);
    setTestimonyDraft("");
  };

  return (
    <main>
      <section className="hero" style={{ paddingBottom: 32 }}>
        <div className="container">
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>▌ Prayer Requests</div>
          <h1 className="display display-xl" style={{ maxWidth: "20ch" }}>
            Bring it before the Lord. We&rsquo;ll carry it with you.
          </h1>
          <p className="lede" style={{ maxWidth: "52ch" }}>
            Bar season carries more than law — failed attempts, family weight, money,
            fear. Write it down. Private by default: between you, us, and the Lord,
            unless you choose to share it with the cohort.
          </p>
          <blockquote className="pc-quote">
            {scripture.support.text}
            <span className="ref">{scripture.support.ref} · KJV</span>
          </blockquote>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* ——— Submit a request ——— */}
          <div className="pc-form">
            <div className="section-rule" style={{ marginBottom: 4 }}>
              <span className="label">▌ The request</span>
            </div>
            <label htmlFor="pr-text">What should we pray for?</label>
            <textarea
              id="pr-text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                border: "1px solid var(--bm-bone-line)",
                borderRadius: 2,
                background: "white",
                fontFamily: "var(--serif)",
                fontSize: 15,
                lineHeight: 1.55,
                padding: "10px 12px",
                color: "var(--bm-ink)",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, textTransform: "none", letterSpacing: 0, fontSize: 13, fontFamily: "var(--serif)", color: "var(--bm-ink)" }}>
              <input type="checkbox" checked={shareDraft} onChange={(e) => setShareDraft(e.target.checked)} />
              Share this with the cohort so others can pray over it too
            </label>
            <div style={{ marginTop: 18 }}>
              <button className="btn btn-lg red" onClick={submit}>
                Lift it up <span className="arrow">→</span>
              </button>
            </div>
            {error && (
              <p className="mono" style={{ color: "var(--red)", fontSize: 12, marginTop: 12 }}>{error}</p>
            )}
            {justSubmitted && (
              <div style={{ marginTop: 16 }} aria-live="polite">
                <div className="nameplate survived bm-stamp">LIFTED UP</div>
                <p className="serif" style={{ fontSize: 14, marginTop: 8 }}>
                  It&rsquo;s on the list. When the Lord answers, come back and mark it —
                  the Ebenezer below is built out of those stones.
                </p>
              </div>
            )}
            <p className="pc-promise">
              Requests are never quoted in marketing, never attached to your name
              publicly, and never used for anything but prayer. Shared requests will be
              read by a moderator before the cohort sees them.
            </p>
          </div>

          {/* ——— Open requests ——— */}
          {open.length > 0 && (
            <div style={{ marginTop: 48, maxWidth: 640 }}>
              <div className="section-rule">
                <span className="label">▌ On the list · {open.length}</span>
              </div>
              {open.map((r) => (
                <div key={r.id} style={{ padding: "16px 0", borderBottom: "1px solid var(--bm-bone-line)" }}>
                  <p className="serif" style={{ fontSize: 15, lineHeight: 1.55, margin: "0 0 8px", maxWidth: "56ch" }}>
                    {r.text}
                  </p>
                  <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: r.shared ? "var(--bm-brass)" : "var(--bm-faded)" }}>
                      {fmtDate(r.ts)} · {r.shared ? "Shared with the cohort" : "Private"}
                      {r.prayedCount > 0 ? ` · Prayed over ×${r.prayedCount}` : ""}
                    </span>
                    {r.shared && (
                      <button
                        className="mono"
                        style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "underline", color: "var(--bm-ink)" }}
                        onClick={() => interceded(r.id)}
                      >
                        I prayed over this
                      </button>
                    )}
                    <button
                      className="mono"
                      style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "underline", color: "var(--bm-ink)" }}
                      onClick={() => {
                        setAnsweringId(answeringId === r.id ? null : r.id);
                        setTestimonyDraft("");
                      }}
                    >
                      Mark answered
                    </button>
                  </div>
                  {answeringId === r.id && (
                    <div style={{ marginTop: 12, maxWidth: 480 }}>
                      <label
                        htmlFor={`pr-testimony-${r.id}`}
                        className="mono"
                        style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--bm-faded)", marginBottom: 4 }}
                      >
                        How did He answer? (optional — this becomes a stone in the Ebenezer)
                      </label>
                      <textarea
                        id={`pr-testimony-${r.id}`}
                        value={testimonyDraft}
                        onChange={(e) => setTestimonyDraft(e.target.value)}
                        rows={2}
                        style={{ width: "100%", border: "1px solid var(--bm-bone-line)", borderRadius: 2, background: "white", fontFamily: "var(--serif)", fontSize: 14, padding: "8px 10px", color: "var(--bm-ink)", boxSizing: "border-box", resize: "vertical" }}
                      />
                      <button className="btn red" style={{ marginTop: 10 }} onClick={() => markAnswered(r.id)}>
                        Set the stone <span className="arrow">→</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ——— The Ebenezer: answered prayers ——— */}
          <div style={{ marginTop: 56, maxWidth: 640 }}>
            <div className="section-rule">
              <span className="label">▌ The Ebenezer · Answered{answered.length > 0 ? ` · ${answered.length}` : ""}</span>
            </div>
            <blockquote className="pc-quote" style={{ marginTop: 18 }}>
              Then Samuel took a stone, and set it between Mizpeh and Shen, and called
              the name of it Ebenezer, saying, Hitherto hath the LORD helped us.
              <span className="ref">1 Samuel 7:12 · KJV</span>
            </blockquote>
            {answered.length === 0 ? (
              <p className="serif" style={{ fontSize: 14, color: "var(--bm-faded)", maxWidth: "52ch" }}>
                No stones set yet. When a request above is answered, mark it — this wall
                is the record that hitherto hath the LORD helped us.
              </p>
            ) : (
              answered.map((r) => (
                <div key={r.id} style={{ padding: "16px 0", borderBottom: "1px solid var(--bm-bone-line)" }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--bm-brass)", marginBottom: 6 }}>
                    Answered{r.answeredTs ? ` · ${fmtDate(r.answeredTs)}` : ""}
                  </div>
                  <p className="serif" style={{ fontSize: 15, lineHeight: 1.55, margin: 0, maxWidth: "56ch" }}>
                    {r.text}
                  </p>
                  {r.testimony && (
                    <p className="serif" style={{ fontSize: 14, fontStyle: "italic", lineHeight: 1.55, margin: "8px 0 0", maxWidth: "56ch", color: "var(--bm-faded)" }}>
                      “{r.testimony}”
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* ——— Cross-link to the exam-day chain ——— */}
          <div style={{ marginTop: 56, maxWidth: 640 }}>
            <div className="section-rule">
              <span className="label">▌ Exam-day coverage</span>
            </div>
            <VerseLine theme="fellowship" style={{ marginTop: 18 }} />
            <p className="serif" style={{ fontSize: 15, lineHeight: 1.55, maxWidth: "52ch", margin: "0 0 18px" }}>
              On July 28–29 the Prayer Chain covers both exam days in fifteen-minute
              slots — students prayed for by name, by the clock.
            </p>
            <button className="btn red" onClick={() => navigate("prayer-chain")}>
              Take a slot on the chain <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
