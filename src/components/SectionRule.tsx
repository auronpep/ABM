interface SectionRuleProps {
  label: string;
  index?: number;
}

export function SectionRule({ label, index }: SectionRuleProps) {
  return (
    <div className="section-rule">
      <span className="label">
        ▌ {label}
        {index ? ` · ${String(index).padStart(2, "0")}` : ""}
      </span>
    </div>
  );
}
