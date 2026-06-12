import { useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState.tsx";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";
import { PageShell } from "../components/PageShell.tsx";
import { SectionRule } from "../components/SectionRule.tsx";
import { SubjectFilter } from "../components/SubjectFilter.tsx";
import { TensionCard } from "../components/TensionCard.tsx";
import { TensionDetail } from "../components/TensionDetail.tsx";
import { apiClient, type TensionSummary } from "../lib/api-client.ts";
import { normalizeSubject, type Subject } from "../lib/subjects.ts";
import { useApi } from "../lib/use-api.ts";
import type { PageProps } from "../types.ts";

export function Tensions({ navigate, slug }: PageProps & { slug?: string }) {
  if (slug) return <TensionDetailRoute navigate={navigate} slug={slug} />;
  return <TensionList navigate={navigate} />;
}

function TensionList({ navigate }: PageProps) {
  const [subject, setSubject] = useState<Subject | "all">("all");
  const { data, loading, error } = useApi(() => apiClient.tensions(), []);
  const tensions = data?.tensions ?? [];
  const filtered = useMemo(
    () => subject === "all" ? tensions : tensions.filter((t) => normalizeSubject(t.subject) === subject),
    [subject, tensions],
  );

  return (
    <PageShell>
      <SectionRule label="Tensions" index={1} />
      <h1 className="display display-lg">Where true rules collide.</h1>
      <p className="body-lg">Tension points are the places where a good answer has to choose the legally responsive truth.</p>
      <SubjectFilter value={subject} onChange={setSubject} />
      {loading && <LoadingSpinner label="Loading tensions" />}
      {error && <EmptyState title="Tensions are not available here." body={error} cta={{ label: "Run repair", route: "repair" }} onNavigate={navigate} />}
      {!loading && !error && filtered.length === 0 && <EmptyState title="No tensions found." body="Try a different subject filter." />}
      <div className="knowledge-grid">
        {filtered.map((tension: TensionSummary) => (
          <TensionCard key={tension.slug} tension={tension} onOpen={(nextSlug) => navigate("tensions-detail", nextSlug)} />
        ))}
      </div>
    </PageShell>
  );
}

function TensionDetailRoute({ navigate, slug }: PageProps & { slug: string }) {
  const { data, loading, error } = useApi(() => apiClient.tension(slug), [slug]);
  return (
    <PageShell narrow>
      {loading && <LoadingSpinner label="Loading tension" />}
      {error && <EmptyState title="This tension is not available." body={error} cta={{ label: "All tensions", route: "tensions" }} onNavigate={navigate} />}
      {data && <TensionDetail tension={data} onNavigate={navigate} />}
    </PageShell>
  );
}
