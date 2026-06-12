import { AuthGuard } from "../components/AuthGuard.tsx";
import { EmptyState } from "../components/EmptyState.tsx";
import { PageShell } from "../components/PageShell.tsx";
import { SectionRule } from "../components/SectionRule.tsx";
import type { PageProps } from "../types.ts";

export function Coach({ navigate }: PageProps) {
  return (
    <AuthGuard requireEnrolled>
      <PageShell narrow>
        <SectionRule label="Coach" index={1} />
        <h1 className="display display-lg">Coach queue.</h1>
        <EmptyState
          title="The next coached move comes from your repair target."
          body="Open the assigned repair loop to keep the program spine clean."
          cta={{ label: "Open repair", route: "repair" }}
          onNavigate={navigate}
        />
      </PageShell>
    </AuthGuard>
  );
}
