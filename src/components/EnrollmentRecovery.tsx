import { useEffect, useMemo, useState } from "react";
import { apiClient, type CheckoutStatus } from "../lib/api-client.ts";

export function EnrollmentRecovery() {
  const sessionId = useMemo(() => new URLSearchParams(window.location.search).get("checkout_session_id"), []);
  const [status, setStatus] = useState<CheckoutStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    apiClient.checkoutStatus(sessionId).then(setStatus).catch((e: unknown) => setError(e instanceof Error ? e.message : "Could not check checkout"));
  }, [sessionId]);

  if (!sessionId) return null;

  const recover = async () => {
    setRecovering(true);
    setError(null);
    try {
      setStatus(await apiClient.recoverCheckout(sessionId));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not recover enrollment");
    } finally {
      setRecovering(false);
    }
  };

  return (
    <section className="component-card">
      <div className="dashboard-panel-label">Enrollment recovery</div>
      {status?.fulfilled ? (
        <p>Checkout is fulfilled. Sign in with the checkout email to continue.</p>
      ) : (
        <>
          <p>If payment succeeded but the seat is not visible yet, recover the checkout session.</p>
          <button className="btn red btn-sm" disabled={recovering} onClick={() => void recover()}>
            {recovering ? "Recovering…" : "Recover enrollment"}
          </button>
        </>
      )}
      {error && <p className="mono error-text">{error}</p>}
    </section>
  );
}
