interface KeyCardProps {
  kind: "gold" | "silver";
  text: string;
  label?: string;
}

export function KeyCard({ kind, text, label }: KeyCardProps) {
  return (
    <div className={`key-card ${kind}`}>
      <div className="key-card-badge">
        {kind === "gold" ? "Gold Key" : "Silver Key"}
        {label ? ` · ${label}` : ""}
      </div>
      <p>{text}</p>
    </div>
  );
}
