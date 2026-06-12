import type { AccountStatus as AccountStatusData } from "../lib/api-client.ts";

interface AccountStatusProps {
  status: AccountStatusData;
}

export function AccountStatus({ status }: AccountStatusProps) {
  return (
    <section className="component-card">
      <div className="dashboard-panel-label">Enrollment</div>
      <h2>{status.enrolled ? "Enrolled" : "Not enrolled"}</h2>
      <p>{status.plan ? `Plan: ${status.plan}` : "No active plan is attached to this account."}</p>
      {status.nextPayment && <p className="mono">Next payment: {status.nextPayment}</p>}
    </section>
  );
}
