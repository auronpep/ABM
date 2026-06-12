import { SUBJECTS, type Subject } from "../lib/subjects.ts";
import { SubjectBadge } from "./SubjectBadge.tsx";

interface SubjectFilterProps {
  value: Subject | "all";
  onChange: (v: Subject | "all") => void;
}

export function SubjectFilter({ value, onChange }: SubjectFilterProps) {
  return (
    <div className="subject-filter">
      <button className={value === "all" ? "active" : ""} onClick={() => onChange("all")}>
        All
      </button>
      {SUBJECTS.map((subject) => (
        <button key={subject} className={value === subject ? "active" : ""} onClick={() => onChange(subject)}>
          <SubjectBadge subject={subject} size="sm" />
        </button>
      ))}
    </div>
  );
}
