import { useState } from "react";
import { apiClient } from "../lib/api-client.ts";
import { useClerkAuth } from "../lib/use-clerk-auth.ts";

export function BillingPortalButton() {
  const { getToken } = useClerkAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPortal = async () => {
    setBusy(true);
    setError(null);
    try {
      const token = await getToken();
      const session = await apiClient.createBillingPortalSession(token);
      const url = session.portal_url ?? session.url;
      if (!url) throw new Error("Billing portal did not return a URL");
      window.location.href = url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not open billing");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="component-card">
      <div className="dashboard-panel-label">Billing</div>
      <button className="btn red btn-sm" disabled={busy} onClick={() => void openPortal()}>
        {busy ? "Opening…" : "Open billing portal"}
      </button>
      {error && <p className="mono error-text">{error}</p>}
    </div>
  );
}
