import type { FoundationsLesson } from "../lib/api-client.ts";

interface LessonCardProps {
  lesson: FoundationsLesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const pct = lesson.complete ? 100 : lesson.progressPct ?? 0;
  return (
    <div className={`lesson-card ${lesson.complete ? "complete" : pct > 0 ? "active" : ""}`}>
      <div className="mono">{lesson.part}</div>
      <h3>{lesson.title}</h3>
      <p>{lesson.drillCount} drills</p>
      <div className="track"><div className="fill" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
