import type { CSSProperties } from "react";
import { SUBJECT_COLORS, SUBJECT_LABELS, normalizeSubject, type Subject } from "../lib/subjects.ts";

interface SubjectBadgeProps {
  subject: Subject | string;
  size?: "sm" | "md";
}

export function SubjectBadge({ subject, size = "md" }: SubjectBadgeProps) {
  const normalized = normalizeSubject(subject);
  const colors = normalized ? SUBJECT_COLORS[normalized] : { accent: "var(--muted)", bg: "var(--bg-alt)" };
  const label = normalized ? SUBJECT_LABELS[normalized] : subject;
  return (
    <span
      className={`subject-badge ${size}`}
      style={{ "--subject-accent": colors.accent, "--subject-bg": colors.bg } as CSSProperties}
    >
      {label}
    </span>
  );
}
