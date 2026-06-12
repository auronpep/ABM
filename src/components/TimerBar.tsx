import { useEffect, useRef, useState } from "react";

interface TimerBarProps {
  totalSeconds: number;
  onExpire: () => void;
}

function fmtClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function TimerBar({ totalSeconds, onExpire }: TimerBarProps) {
  const [left, setLeft] = useState(totalSeconds);
  const deadlineRef = useRef(Date.now() + totalSeconds * 1000);
  const expiredRef = useRef(false);

  useEffect(() => {
    deadlineRef.current = Date.now() + totalSeconds * 1000;
    setLeft(totalSeconds);
    expiredRef.current = false;
  }, [totalSeconds]);

  useEffect(() => {
    const tick = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setLeft(next);
      if (next <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire();
      }
    }, 250);
    return () => window.clearInterval(tick);
  }, [onExpire]);

  const pct = totalSeconds <= 0 ? 0 : (left / totalSeconds) * 100;
  return (
    <div className="timer-bar">
      <div className="track">
        <div className="fill" style={{ width: `${pct}%` }} />
      </div>
      <span className={`mono clock${left <= 60 ? " low" : ""}`}>{fmtClock(left)}</span>
    </div>
  );
}
