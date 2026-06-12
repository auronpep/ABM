import { apiFetch } from "./api.ts";
import type { Route } from "../types.ts";
import type { Subject } from "./subjects.ts";

export type Letter = "A" | "B" | "C" | "D";
export type TrapKind = "forensic" | "misconception";

export interface TensionSummary {
  id: string;
  slug: string;
  subject: Subject | string;
  headline: string;
  official: string;
  questionCount: number;
}

export interface TensionDetail extends TensionSummary {
  collision: string;
  examples: Array<{ id: string; title: string; route?: Route }>;
  assignedDrillRoute?: Route;
}

export interface TrapSummary {
  id: string;
  slug: string;
  subject: Subject | string;
  kind: TrapKind;
  name?: string;
  pullCount: number;
}

export interface TrapDetail extends TrapSummary {
  whyItPulls: string;
  failureMode: string;
  exampleWrongAnswers: string[];
  assignedDrillRoute?: Route;
}

export interface DayPlanStep {
  title: string;
  kind: "lesson" | "drill" | "repair";
  reason?: string;
  estimate?: string;
  route: Route;
}

export interface RedZone {
  slug: string;
  name: string;
  subject: Subject | string;
  proficiencyPct: number;
  lastMissSubject?: string | null;
  highConfidenceMisses?: number;
  route?: Route;
}

export interface RecentAttempt {
  id: string;
  subject: Subject | string;
  correct: boolean;
  timeSpentSec: number;
  preview: string;
}

export interface FoundationsLesson {
  slug: string;
  title: string;
  part: string;
  complete: boolean;
  drillCount: number;
  progressPct?: number;
}

export interface AccountStatus {
  enrolled: boolean;
  plan: string | null;
  nextPayment: string | null;
}

export interface DashboardData {
  enrolled: boolean;
  account: AccountStatus;
  dayPlan: DayPlanStep | null;
  repairTarget: RedZone | null;
  coveragePct: number;
  subjects: Array<{ subject: Subject | string; pct: number; delta: number }>;
  recentAttempts: RecentAttempt[];
  redZones: RedZone[];
  lessons: FoundationsLesson[];
}

export interface C3Mastery {
  coverage: { pct: number };
  matrix: { cols: string[]; rows: Array<{ subject: Subject | string; heat: number[] }> };
}

export interface BillingPortalSession {
  portal_url?: string;
  url?: string;
}

export interface CheckoutStatus {
  fulfilled: boolean;
  purchaseId?: string;
  enrollmentStatus?: string;
}

export const apiClient = {
  tensions: () => apiFetch<{ tensions: TensionSummary[] }>("/api/tensions"),
  tension: (slug: string) => apiFetch<TensionDetail>(`/api/tensions/${encodeURIComponent(slug)}`),
  traps: () => apiFetch<{ architecture?: TrapSummary[]; misconception?: TrapSummary[]; traps?: TrapSummary[] }>("/api/traps"),
  trap: (slug: string) => apiFetch<TrapDetail>(`/api/traps/${encodeURIComponent(slug)}`),
  dashboard: (token: string | null) => apiFetch<DashboardData>("/api/me/dashboard", { token }),
  c3: (token: string | null) => apiFetch<C3Mastery>("/api/me/c3", { token }),
  account: (token: string | null) => apiFetch<AccountStatus>("/api/me/account", { token }),
  createBillingPortalSession: (token: string | null) =>
    apiFetch<BillingPortalSession>("/api/billing/create-portal-session", {
      method: "POST",
      token,
      body: { return_url: `${window.location.origin}/#/account` },
    }),
  checkoutStatus: (sessionId: string) =>
    apiFetch<CheckoutStatus>(`/api/checkout/${encodeURIComponent(sessionId)}/status`),
  recoverCheckout: (sessionId: string) =>
    apiFetch<CheckoutStatus>(`/api/checkout/${encodeURIComponent(sessionId)}/recover`, {
      method: "POST",
    }),
};
