import { useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState.tsx";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";
import { PageShell } from "../components/PageShell.tsx";
import { SectionRule } from "../components/SectionRule.tsx";
import { SubjectFilter } from "../components/SubjectFilter.tsx";
import { TrapCard } from "../components/TrapCard.tsx";
import { TrapDetail } from "../components/TrapDetail.tsx";
import { apiClient, type TrapSummary } from "../lib/api-client.ts";
import { normalizeSubject, type Subject } from "../lib/subjects.ts";
import { useApi } from "../lib/use-api.ts";
import type { PageProps } from "../types.ts";

export function Traps({ navigate, slug }: PageProps & { slug?: string }) {
  if (slug) return <TrapDetailRoute navigate={navigate} slug={slug} />;
  return <TrapList navigate={navigate} />;
}

function TrapList({ navigate }: PageProps) {
  const [subject, setSubject] = useState<Subject | "all">("all");
  const { data, loading, error } = useApi(() => apiClient.traps(), []);
  const traps = [...(data?.traps ?? []), ...(data?.architecture ?? []), ...(data?.misconception ?? [])];
  const filtered = useMemo(
    () => subject === "all" ? traps : traps.filter((t) => normalizeSubject(t.subject) === subject),
    [subject, traps],
  );

  return (
    <PageShell>
      <SectionRule label="Traps" index={1} />
      <h1 className="display display-lg">The wrong answers that keep surviving.</h1>
      <p className="body-lg">Traps name the recurring counterfeit mechanics behind missed MBE points.</p>
      <SubjectFilter value={subject} onChange={setSubject} />
      {loading && <LoadingSpinner label="Loading traps" />}
      {error && <EmptyState title="Traps are not available here." body={error} cta={{ label: "Run repair", route: "repair" }} onNavigate={navigate} />}
      {!loading && !error && filtered.length === 0 && <EmptyState title="No traps found." body="Try a different subject filter." />}
      <div className="knowledge-grid">
        {filtered.map((trap: TrapSummary) => (
          <TrapCard key={trap.slug} trap={trap} onOpen={(nextSlug) => navigate("traps-detail", nextSlug)} />
        ))}
      </div>
    </PageShell>
  );
}

function TrapDetailRoute({ navigate, slug }: PageProps & { slug: string }) {
  const { data, loading, error } = useApi(() => apiClient.trap(slug), [slug]);
  return (
    <PageShell narrow>
      {loading && <LoadingSpinner label="Loading trap" />}
      {error && <EmptyState title="This trap is not available." body={error} cta={{ label: "All traps", route: "traps" }} onNavigate={navigate} />}
      {data && <TrapDetail trap={data} onNavigate={navigate} />}
    </PageShell>
  );
}
