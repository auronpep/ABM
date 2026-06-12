import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export function PageShell({ children, className = "", narrow = false }: PageShellProps) {
  return (
    <main className={`page-shell ${narrow ? "narrow" : ""} ${className}`.trim()}>
      {children}
    </main>
  );
}
