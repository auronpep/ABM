// Analytics events util — doc 04. Five funnel events plus page extensions.
// UTM is captured on first touch and attached to every event. No PII may
// enter event properties: blocked keys throw (funnel task A-3 acceptance).

export type FunnelEvent =
  | "mini_diag_start"
  | "full_diag_start"
  | "diag_complete"
  | "checkout_start"
  | "prayer_chain_signup"
  | "first_login";

type Props = Record<string, string | number | boolean | null | string[]>;

const UTM_STORAGE_KEY = "bm_utm";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

// Doc 04 rule 3: no PII in event properties — no answer text, no email, no names.
const BLOCKED_PROP_KEYS = ["email", "name", "first_name", "last_name", "phone", "answer_text"];

declare global {
  interface Window {
    __bmEvents?: Array<{ event: string; props: Props; ts: number }>;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/** Capture UTM params on first touch; later visits keep the stored values. */
export function captureUtm(): void {
  try {
    if (localStorage.getItem(UTM_STORAGE_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) utm[key] = value;
    }
    if (Object.keys(utm).length > 0) {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    }
  } catch {
    // storage unavailable (private mode) — events still fire without UTM
  }
}

export function getUtm(): Record<string, string> {
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function deviceType(): string {
  return window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";
}

export function track(event: FunnelEvent, props: Props = {}): void {
  for (const key of Object.keys(props)) {
    if (BLOCKED_PROP_KEYS.includes(key.toLowerCase())) {
      throw new Error(`track(): blocked PII property "${key}" on event "${event}"`);
    }
  }

  const payload: Props = {
    ...getUtm(),
    referrer: document.referrer || null,
    device: deviceType(),
    ...props,
  };

  window.__bmEvents = window.__bmEvents ?? [];
  window.__bmEvents.push({ event, props: payload, ts: Date.now() });
  window.dataLayer?.push({ event, ...payload });

  const posthogKey = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const posthogHost = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? "https://us.i.posthog.com";
  if (posthogKey) {
    void fetch(`${posthogHost}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        api_key: posthogKey,
        event,
        properties: { ...payload, distinct_id: getAnonId() },
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // analytics must never break the funnel
    });
  } else if (import.meta.env.DEV) {
    console.debug(`[bm-event] ${event}`, payload);
  }
}

const ANON_ID_KEY = "bm_anon_id";

function getAnonId(): string {
  try {
    let id = localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id = `anon_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    return "anon_ephemeral";
  }
}
