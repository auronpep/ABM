// /prayer-chain — Exam-Day Prayer Chain, July 28–29 (P4).
// Public page; ministry first. Signups persist locally in this build — the
// shared backend + confirmation email are founder-gated (see APPROVALS_NEEDED).
import { useMemo, useState } from "react";
import { VerseLine } from "../components/VerseLine.tsx";
import { track } from "../lib/events.ts";
import type { PageProps } from "../types.ts";

const STORAGE_KEY = "bm_prayer_chain_local";

// Exam days: July 28–29, 2026. Slots 7:00 AM – 6:00 PM Pacific, 15 minutes each.
const DAYS = [
  { label: "Tuesday, July 28", utcDay: 28 },
  { label: "Wednesday, July 29", utcDay: 29 },
];
const START_MIN = 7 * 60;
const END_MIN = 18 * 60;
const STEP = 15;
const PDT_OFFSET_HOURS = 7; // July = Pacific Daylight Time, UTC-7

interface Commitment {
  first: string;
  lastInitial: string;
  email: string;
}

type Signups = Record<string, Commitment[]>;

function slotId(day: number, min: number): string {
  return `${day}-${min}`;
}

function formatPt(min: number): string {
  const h24 = Math.floor(min / 60);
  const m = min % 60;
  const h12 = ((h24 + 11) % 12) + 1;
  const ampm = h24 < 12 ? "AM" : "PM";
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function localEquivalent(day: number, min: number): string | null {
  const utcMs = Date.UTC(2026, 6, DAYS[day].utcDay, Math.floor(min / 60) + PDT_OFFSET_HOURS, min % 60);
  const local = new Date(utcMs);
  const localStr = local.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const ptStr = formatPt(min);
  return localStr.replace(/ /g, " ") === ptStr ? null : localStr;
}

function readSignups(): Signups {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Signups) : {};
  } catch {
    return {};
  }
}

function coverageLabel(list: Commitment[] | undefined): string {
  if (!list || list.length === 0) return "Open";
  const first = `${list[0].first} ${list[0].lastInitial}.`;
  if (list.length === 1) return first;
  return `${first} and ${list.length - 1} other${list.length > 2 ? "s" : ""}`;
}

const SLOT_MINUTES: number[] = [];
for (let m = START_MIN; m < END_MIN; m += STEP) SLOT_MINUTES.push(m);

export function PrayerChain({ navigate }: PageProps) {
  const [signups, setSignups] = useState<Signups>(readSignups);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [first, setFirst] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [email, setEmail] = useState("");
  const [coverHour, setCoverHour] = useState(false);
  const [confirmed, setConfirmed] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalCommitted = useMemo(
    () => Object.values(signups).reduce((n, list) => n + list.length, 0),
    [signups],
  );

  const toggle = (id: string) => {
    setConfirmed(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandSelection = (): string[] => {
    if (!coverHour) return [...selected];
    const expanded = new Set(selected);
    for (const id of selected) {
      const [dayStr, minStr] = id.split("-");
      const day = Number(dayStr);
      const hourStart = Math.floor(Number(minStr) / 60) * 60;
      for (let m = hourStart; m < hourStart + 60; m += STEP) {
        if (m >= START_MIN && m < END_MIN) expanded.add(slotId(day, m));
      }
    }
    return [...expanded];
  };

  const submit = () => {
    setError(null);
    const f = first.trim();
    const li = lastInitial.trim().replace(/\.$/, "");
    const em = email.trim().toLowerCase();
    const slots = expandSelection();
    if (!f || !li || !em.includes("@") || slots.length === 0) {
      setError("First name, last initial, a working email, and at least one slot.");
      return;
    }

    const next: Signups = { ...signups };
    let added = 0;
    for (const id of slots) {
      const list = next[id] ?? [];
      if (list.some((c) => c.email === em)) continue; // duplicate signup, same slot — kept once
      next[id] = [...list, { first: f, lastInitial: li.toUpperCase(), email: em }];
      added += 1;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable — the commitment still shows for this session
    }
    setSignups(next);
    // Aggregate only — no names or emails in events (P4 + doc 04 rule 3).
    track("prayer_chain_signup", { slot_count: slots.length, newly_covered: added });

    const labels = slots
      .sort()
      .map((id) => {
        const [dayStr, minStr] = id.split("-");
        return `${DAYS[Number(dayStr)].label} · ${formatPt(Number(minStr))} PT`;
      });
    setConfirmed(labels);
    setSelected(new Set());
  };

  return (
    <main>
      <section className="hero" style={{ paddingBottom: 32 }}>
        <div className="container">
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>▌ Real Ministry · Free to Join</div>
          <h1 className="display display-xl" style={{ maxWidth: "20ch" }}>
            The Exam-Day Prayer Chain — July 28–29.
          </h1>
          <p className="lede" style={{ maxWidth: "52ch" }}>
            Two days. Every fifteen minutes covered. Students prayed for by name, by the
            clock.
          </p>
          <blockquote className="pc-quote">
            Two are better than one; because they have a good reward for their labour. For
            if they fall, the one will lift up his fellow: but woe to him that is alone when
            he falleth; for he hath not another to help him up.
            <span className="ref">Ecclesiastes 4:9–10 · KJV</span>
          </blockquote>
          {totalCommitted > 0 && (
            <p className="mono" style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--bm-brass)" }}>
              {totalCommitted} commitment{totalCommitted === 1 ? "" : "s"} on the chain so far
            </p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {DAYS.map((day, di) => (
            <div key={day.label}>
              <div className="section-rule">
                <span className="label">▌ {day.label} · 7:00 AM – 6:00 PM Pacific</span>
              </div>
              <div className="pc-grid">
                {SLOT_MINUTES.map((m) => {
                  const id = slotId(di, m);
                  const list = signups[id];
                  const isSel = selected.has(id);
                  const local = localEquivalent(di, m);
                  return (
                    <button
                      key={id}
                      className={`pc-slot${list?.length ? " covered" : ""}${isSel ? " selected" : ""}`}
                      onClick={() => toggle(id)}
                      aria-pressed={isSel}
                    >
                      <span className="time">
                        {formatPt(m)} PT
                        {local ? ` · ${local}` : ""}
                      </span>
                      <span className="cover">{isSel ? "Selected" : coverageLabel(list)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pc-form">
            <div className="section-rule" style={{ marginBottom: 4 }}>
              <span className="label">▌ Join the chain</span>
            </div>
            <p className="serif" style={{ fontSize: 14, color: "var(--bm-faded)", margin: "10px 0 0" }}>
              Pick your slot(s) above, then sign here. Unlimited people per slot — the goal
              is depth, not scarcity.
            </p>
            <label htmlFor="pc-first">First name</label>
            <input id="pc-first" type="text" value={first} onChange={(e) => setFirst(e.target.value)} autoComplete="given-name" />
            <label htmlFor="pc-li">Last initial</label>
            <input id="pc-li" type="text" maxLength={2} value={lastInitial} onChange={(e) => setLastInitial(e.target.value)} />
            <label htmlFor="pc-email">Email (for your slot confirmation only)</label>
            <input id="pc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, textTransform: "none", letterSpacing: 0, fontSize: 13, fontFamily: "var(--serif)", color: "var(--bm-ink)" }}>
              <input type="checkbox" checked={coverHour} onChange={(e) => setCoverHour(e.target.checked)} />
              Cover the whole hour of each slot I picked
            </label>
            <div style={{ marginTop: 18 }}>
              <button className="btn btn-lg red" onClick={submit}>
                Commit to pray <span className="arrow">→</span>
              </button>
            </div>
            {error && (
              <p className="mono" style={{ color: "var(--red)", fontSize: 12, marginTop: 12 }}>{error}</p>
            )}
            {confirmed && (
              <div style={{ marginTop: 16 }} aria-live="polite">
                <div className="nameplate survived bm-stamp">ON THE CHAIN</div>
                <p className="serif" style={{ fontSize: 14, marginTop: 8 }}>
                  Your slot{confirmed.length === 1 ? "" : "s"}: {confirmed.join(" · ")}.
                  Write them down — and thank you.
                </p>
              </div>
            )}
            <p className="pc-promise">
              Your email is used for chain logistics only: your slot confirmation, an
              optional day-before reminder, and one thank-you after results day. Nothing
              else, ever. We pray for peace, clarity, and faithfulness for every examinee.
            </p>
          </div>

          <div style={{ marginTop: 48, maxWidth: 560 }}>
            <div className="section-rule">
              <span className="label">▌ Carrying something yourself?</span>
            </div>
            <VerseLine theme="fellowship" style={{ marginTop: 18 }} />
            <button className="btn red" onClick={() => navigate("prayer")}>
              Bring a prayer request <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
