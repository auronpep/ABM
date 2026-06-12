import { AuthGuard } from "../components/AuthGuard.tsx";
import { DayPlanCard } from "../components/DayPlanCard.tsx";
import { DrillSetCard } from "../components/DrillSetCard.tsx";
import { EmptyState } from "../components/EmptyState.tsx";
import { LessonCard } from "../components/LessonCard.tsx";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";
import { PageShell } from "../components/PageShell.tsx";
import { SectionRule } from "../components/SectionRule.tsx";
import { apiClient } from "../lib/api-client.ts";
import { useApi } from "../lib/use-api.ts";
import { useClerkAuth } from "../lib/use-clerk-auth.ts";
import type { PageProps } from "../types.ts";

export function Program(props: PageProps) {
  return (
    <AuthGuard requireEnrolled>
      <ProgramInner {...props} />
    </AuthGuard>
  );
}

function ProgramInner({ navigate }: PageProps) {
  const { isLoaded, getToken } = useClerkAuth();
  const { data, loading, error } = useApi(async () => apiClient.dashboard(await getToken()), [isLoaded]);

  return (
    <PageShell>
      <SectionRule label="Program" index={1} />
      <h1 className="display display-lg">The assigned path.</h1>
      {loading && <LoadingSpinner label="Loading program" />}
      {error && <EmptyState title="Program data is not available." body={error} cta={{ label: "Dashboard", route: "dashboard" }} onNavigate={navigate} />}
      {data?.dayPlan && <DayPlanCard step={data.dayPlan} onNavigate={navigate} />}
      <div className="knowledge-grid">
        {(data?.lessons ?? []).map((lesson) => <LessonCard key={lesson.slug} lesson={lesson} />)}
      </div>
      <DrillSetCard drillSet={{ name: "Prescribed repair set", count: 6, route: "repair" }} onNavigate={navigate} />
    </PageShell>
  );
}
