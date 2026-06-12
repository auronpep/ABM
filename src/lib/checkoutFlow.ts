import type { Route } from "../types.ts";

export const CHECKOUT_INTENT_KEY = "bm_checkout_intent_v1";

export type CheckoutPlan = "full" | "split";

interface CheckoutUrlOptions {
  plan: CheckoutPlan;
  source: string;
  after?: Route;
}

function routeFromMaybe(value: string | null | undefined): Route {
  const allowed: Route[] = ["sign-up", "welcome", "diagnostic", "pricing", "home"];
  return allowed.includes(value as Route) ? (value as Route) : "sign-up";
}

function paramsFromIntent({ plan, source, after = "sign-up" }: CheckoutUrlOptions): URLSearchParams {
  const params = new URLSearchParams();
  params.set("plan", plan);
  params.set("source", source);
  params.set("after", after);
  return params;
}

export function rememberCheckoutIntent(options: CheckoutUrlOptions): void {
  try {
    window.localStorage.setItem(
      CHECKOUT_INTENT_KEY,
      JSON.stringify({ ...options, after: options.after ?? "sign-up", ts: Date.now() }),
    );
  } catch {
    // Checkout must still work if storage is blocked.
  }
}

export function readCheckoutIntent(): CheckoutUrlOptions {
  try {
    const raw = window.localStorage.getItem(CHECKOUT_INTENT_KEY);
    if (!raw) return { plan: "full", source: "checkout", after: "sign-up" };
    const parsed = JSON.parse(raw) as Partial<CheckoutUrlOptions>;
    return {
      plan: parsed.plan === "split" ? "split" : "full",
      source: typeof parsed.source === "string" && parsed.source ? parsed.source : "checkout",
      after: routeFromMaybe(parsed.after),
    };
  } catch {
    return { plan: "full", source: "checkout", after: "sign-up" };
  }
}

export function checkoutUrl(options: CheckoutUrlOptions): string {
  return `/checkout.html?${paramsFromIntent(options).toString()}`;
}

export function checkoutSuccessUrl(options: CheckoutUrlOptions): string {
  const params = paramsFromIntent(options);
  params.set("purchase", "success");
  return `/checkout.html?${params.toString()}`;
}

export function checkoutCancelUrl(options: CheckoutUrlOptions): string {
  const params = paramsFromIntent(options);
  params.set("cancelled", "1");
  return `/checkout.html?${params.toString()}`;
}
