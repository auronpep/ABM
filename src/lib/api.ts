// Authed fetch wrapper for api.barmatrix.app (Express + Clerk + MariaDB).
// First consumer: the Practice Library (#/practice). The Clerk session token
// rides as a Bearer header; the API resolves identity server-side and never
// trusts a client-supplied student id.

export const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string | undefined) || "https://api.barmatrix.app";

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH";
    token?: string | null;
    body?: unknown;
  } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = (await res.json()) as { error?: unknown };
      if (typeof data.error === "string") message = data.error;
    } catch {
      // non-JSON error body — keep the status message
    }
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

// ── Practice Library payload shapes (mirror the API routes) ────────────────

export interface OutlineSubjectInfo {
  code: string;
  label: string;
  question_count: number;
}

export interface OutlineSubtopicInfo {
  ab: string;
  subject_code: string;
  subject_label: string;
  name: string;
  question_count: number;
  verified_count: number;
}

export interface OutlineNodeInfo {
  code: string;
  ab: string;
  level: number;
  parent_code: string | null;
  label: string;
  path: string;
  question_count: number;
}

export interface OutlinePayload {
  subjects: OutlineSubjectInfo[];
  subtopics: OutlineSubtopicInfo[];
  nodes: OutlineNodeInfo[];
}

export interface DrillStartResponse {
  drill_id: string | null;
  question_ids: string[];
  size: number;
  requested: number;
  partial: boolean;
  drill_name: string;
}

export interface PracticeChoice {
  choice_id: string;
  letter: "A" | "B" | "C" | "D";
  choice_text: string;
}

export interface PracticeQuestion {
  question_id: string;
  external_id: string | null;
  subject: string;
  topic: string | null;
  subtopic: string | null;
  fact_pattern: string;
  question_stem: string;
  call_of_question: string | null;
  choices: PracticeChoice[];
}

export interface AttemptResponse {
  attempt_id: string;
  correct: boolean;
  correct_answer: "A" | "B" | "C" | "D" | null;
  forensics_url: string;
}

export interface ForensicsPayload {
  correct: boolean;
  why_correct?: string;
  trap_name?: string;
  why_attractive?: string;
  why_wrong?: string;
  future_cue?: string;
}

export interface UsageSubjectRow {
  subject: string;
  subject_code: string | null;
  attempts: number;
  questions_seen: number;
  correct: number;
  accuracy: number | null;
  time_seconds: number;
  last_attempted_at: string | null;
}

export interface UsagePayload {
  totals: {
    attempts: number;
    questions_seen: number;
    correct: number;
    time_seconds: number;
    accuracy: number | null;
  };
  by_subject: UsageSubjectRow[];
  by_day: Array<{ day: string; attempts: number; correct: number; time_seconds: number }>;
}
