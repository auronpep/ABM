import { AuthGuard } from "../components/AuthGuard.tsx";
import { EmptyState } from "../components/EmptyState.tsx";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";
import { PageShell } from "../components/PageShell.tsx";
import { RepairTarget } from "../components/RepairTarget.tsx";
import { SectionRule } from "../components/SectionRule.tsx";
import { ZoneCard } from "../components/ZoneCard.tsx";
import { apiClient } from "../lib/api-client.ts";
import { useApi } from "../lib/use-api.ts";
import { useClerkAuth } from "../lib/use-clerk-auth.ts";
import type { PageProps } from "../types.ts";

export function RedZones(props: PageProps) {
  return (
    <AuthGuard requireEnrolled>
      <RedZonesInner {...props} />
    </AuthGuard>
  );
}

function RedZonesInner({ navigate }: PageProps) {
  const { isLoaded, getToken } = useClerkAuth();
  const { data, loading, error } = useApi(async () => apiClient.dashboard(await getToken()), [isLoaded]);
  return (
    <PageShell>
      <SectionRule label="Red Zones" index={1} />
      <h1 className="display display-lg">Repair targets.</h1>
      {loading && <LoadingSpinner label="Loading red zones" />}
      {error && <EmptyState title="Red zones are not available." body={error} cta={{ label: "Diagnostic", route: "diagnostic" }} onNavigate={navigate} />}
      {data && <RepairTarget zone={data.repairTarget} onNavigate={navigate} />}
      <div className="knowledge-grid">
        {(data?.redZones ?? []).map((zone) => <ZoneCard key={zone.slug} zone={zone} onNavigate={navigate} />)}
      </div>
    </PageShell>
  );
}
