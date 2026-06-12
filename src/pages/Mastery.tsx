import { AuthGuard } from "../components/AuthGuard.tsx";
import { CoverageRing } from "../components/CoverageRing.tsx";
import { EmptyState } from "../components/EmptyState.tsx";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";
import { PageShell } from "../components/PageShell.tsx";
import { PersonalMatrix } from "../components/PersonalMatrix.tsx";
import { SectionRule } from "../components/SectionRule.tsx";
import { apiClient } from "../lib/api-client.ts";
import { useApi } from "../lib/use-api.ts";
import { useClerkAuth } from "../lib/use-clerk-auth.ts";
import type { PageProps } from "../types.ts";

export function Mastery(props: PageProps) {
  return (
    <AuthGuard requireEnrolled>
      <MasteryInner {...props} />
    </AuthGuard>
  );
}

function MasteryInner({ navigate }: PageProps) {
  const { isLoaded, getToken } = useClerkAuth();
  const { data, loading, error } = useApi(async () => apiClient.c3(await getToken()), [isLoaded]);
  return (
    <PageShell>
      <SectionRule label="Mastery" index={1} />
      <h1 className="display display-lg">Your personal matrix.</h1>
      {loading && <LoadingSpinner label="Loading mastery" />}
      {error && <EmptyState title="Mastery data is not available." body={error} cta={{ label: "Dashboard", route: "dashboard" }} onNavigate={navigate} />}
      {data && <CoverageRing percent={data.coverage.pct} />}
      {data && <PersonalMatrix matrix={data.matrix} onHotCell={() => navigate("repair")} />}
    </PageShell>
  );
}
