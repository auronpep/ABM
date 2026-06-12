// Daily-bread card for /welcome. Inside the 40-day window it serves the dated
// Forty Days entry (src/content/devotional.ts); outside it, the date-seeded
// daily verse. A mirror, not a task — no streaks, nothing to complete.
import { useMemo } from "react";
import { daysToExam, devotionalForToday } from "../content/devotional.ts";
import { dailyVerse } from "../lib/verses.ts";

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: 14,
};

export function DevotionalCard() {
  const entry = useMemo(() => devotionalForToday(), []);
  const left = useMemo(() => daysToExam(), []);
  const fallback = useMemo(() => (entry ? null : dailyVerse()), [entry]);

  if (entry) {
    const dayNumber = 40 - entry.daysLeft + 1; // 1..40 through the countdown
    const label =
      entry.daysLeft > 0
        ? `▌ The Forty Days · Day ${dayNumber} of 40`
        : "▌ The Forty Days · Exam Day";
    return (
      <div style={{ marginTop: 48, maxWidth: 560 }}>
        <div className="mono" style={labelStyle}>{label}</div>
        <blockquote className="pc-quote" style={{ margin: "0 0 14px" }}>
          {entry.text}
          <span className="ref">{entry.ref} · KJV</span>
        </blockquote>
        <p className="serif" style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 10px", maxWidth: "52ch" }}>
          {entry.devotion}
        </p>
        <p className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--bm-brass)", margin: 0 }}>
          {entry.charge}
        </p>
      </div>
    );
  }

  // Outside the window: the daily verse, same for every visitor today.
  return (
    <div style={{ marginTop: 48, maxWidth: 560 }}>
      <div className="mono" style={labelStyle}>
        ▌ Daily Bread{left > 40 ? ` · The Forty Days begin ${left - 40} day${left - 40 === 1 ? "" : "s"} from now` : ""}
      </div>
      <blockquote className="pc-quote" style={{ margin: 0 }}>
        {fallback!.text}
        <span className="ref">{fallback!.ref} · KJV</span>
      </blockquote>
    </div>
  );
}
