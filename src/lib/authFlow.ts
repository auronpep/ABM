import type { Route } from "../types.ts";

export const AUTH_INTENT_KEY = "bm_auth_intent_v1";

const AUTH_RETURN_ROUTES: Route[] = [
  "welcome",
  "practice",
  "repair",
  "diagnostic",
  "pricing",
  "home",
];

type AuthMode = "sign-in" | "sign-up";

interface AuthIntent {
  after: Route;
  mode: AuthMode;
  source: string;
  ts: number;
}

function hashParams(): URLSearchParams {
  const query = window.location.hash.split("?")[1] ?? "";
  return new URLSearchParams(query);
}

function routeFromMaybe(value: string | null | undefined): Route {
  if (!value) return "welcome";
  return AUTH_RETURN_ROUTES.includes(value as Route) ? (value as Route) : "welcome";
}

function readAuthIntent(): AuthIntent | null {
  try {
    const raw = window.localStorage.getItem(AUTH_INTENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthIntent>;
    return {
      after: routeFromMaybe(parsed.after),
      mode: parsed.mode === "sign-up" ? "sign-up" : "sign-in",
      source: typeof parsed.source === "string" && parsed.source ? parsed.source : "auth",
      ts: typeof parsed.ts === "number" ? parsed.ts : Date.now(),
    };
  } catch {
    return null;
  }
}

function routeHref(route: Route): string {
  return route === "home" ? "/#/" : `/#/${route}`;
}

export function rememberAuthIntent(mode: AuthMode): AuthIntent {
  const params = hashParams();
  const intent: AuthIntent = {
    after: routeFromMaybe(params.get("after")),
    mode,
    source: params.get("source") || "auth",
    ts: Date.now(),
  };

  try {
    window.localStorage.setItem(AUTH_INTENT_KEY, JSON.stringify(intent));
  } catch {
    // Private browsing/storage failures should not block Clerk.
  }

  return intent;
}

export function resolveAuthReturnRoute(): Route {
  const params = hashParams();
  const explicit = params.get("after");
  const stored = readAuthIntent();

  try {
    window.localStorage.removeItem(AUTH_INTENT_KEY);
  } catch {
    // Nothing to clean up.
  }

  return routeFromMaybe(explicit || stored?.after);
}

export function authRedirectUrl(intent: AuthIntent): string {
  return routeHref(intent.after);
}
