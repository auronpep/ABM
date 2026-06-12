import { AccountStatus } from "../components/AccountStatus.tsx";
import { AuthGuard } from "../components/AuthGuard.tsx";
import { BillingPortalButton } from "../components/BillingPortalButton.tsx";
import { EmptyState } from "../components/EmptyState.tsx";
import { EnrollmentRecovery } from "../components/EnrollmentRecovery.tsx";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";
import { PageShell } from "../components/PageShell.tsx";
import { SectionRule } from "../components/SectionRule.tsx";
import { apiClient } from "../lib/api-client.ts";
import { useApi } from "../lib/use-api.ts";
import { useClerkAuth } from "../lib/use-clerk-auth.ts";
import type { PageProps } from "../types.ts";

export function Account({ navigate }: PageProps) {
  return (
    <AuthGuard>
      <AccountInner navigate={navigate} />
    </AuthGuard>
  );
}

function AccountInner({ navigate }: PageProps) {
  const { isLoaded, getToken } = useClerkAuth();
  const { data, loading, error } = useApi(async () => apiClient.account(await getToken()), [isLoaded]);
  return (
    <PageShell narrow>
      <SectionRule label="Account" index={1} />
      <h1 className="display display-lg">Account.</h1>
      <EnrollmentRecovery />
      {loading && <LoadingSpinner label="Loading account" />}
      {error && <EmptyState title="Account status is not available." body={error} cta={{ label: "Dashboard", route: "dashboard" }} onNavigate={navigate} />}
      {data && <AccountStatus status={data} />}
      <BillingPortalButton />
    </PageShell>
  );
}
