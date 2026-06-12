import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(path) {
  const abs = join(root, path);
  if (!existsSync(abs)) {
    throw new Error(`Missing expected file: ${path}`);
  }
  return readFileSync(abs, "utf8");
}

function assertIncludes(file, text, label) {
  const body = read(file);
  if (!body.includes(text)) {
    throw new Error(`${label}\nExpected ${file} to include:\n${text}`);
  }
}

function assertNotIncludes(file, text, label) {
  const body = read(file);
  if (body.includes(text)) {
    throw new Error(`${label}\nExpected ${file} not to include:\n${text}`);
  }
}

const checks = [
  () => assertIncludes("src/lib/authFlow.ts", "export const AUTH_INTENT_KEY", "auth intent key is centralized"),
  () => assertIncludes("src/lib/authFlow.ts", "export function rememberAuthIntent", "auth intent can be persisted before Clerk opens"),
  () => assertIncludes("src/lib/authFlow.ts", "export function resolveAuthReturnRoute", "auth return route is resolved after Clerk completes"),
  () => assertIncludes("src/lib/authFlow.ts", "export function authRedirectUrl", "Clerk redirect URL is built from intent"),
  () => assertIncludes("src/lib/checkoutFlow.ts", "export const CHECKOUT_INTENT_KEY", "checkout intent key is centralized"),
  () => assertIncludes("src/lib/checkoutFlow.ts", "export function checkoutUrl", "checkout URL builder exists"),
  () => assertIncludes("src/lib/checkoutFlow.ts", "export function checkoutSuccessUrl", "checkout success URL builder exists"),
  () => assertIncludes("src/pages/Auth.tsx", "rememberAuthIntent", "auth page records intent before modal open"),
  () => assertIncludes("src/pages/Auth.tsx", "resolveAuthReturnRoute", "auth page navigates to preserved return route"),
  () => assertIncludes("src/pages/Pricing.tsx", "checkoutUrl({ plan: \"full\", source: \"pricing\"", "pricing uses full-plan checkout URL builder"),
  () => assertIncludes("src/components/RedZoneReveal.tsx", "checkoutUrl({ plan, source: \"diagnostic\"", "diagnostic bridge preserves checkout source"),
  () => assertIncludes("public/checkout.html", "purchaseSuccess", "checkout detects purchase success returns"),
  () => assertIncludes("public/checkout.html", "SuccessScreen", "checkout renders a success screen"),
  () => assertIncludes("public/checkout.html", "/checkout.html?purchase=success", "Stripe success returns to checkout success screen first"),
  () => assertIncludes("public/checkout.html", "source=checkout_success", "checkout success creates account with source context"),
  () => assertIncludes("public/checkout.html", "diagnostic_id", "checkout forwards diagnostic metadata when available"),
  () => assertIncludes("public/checkout.html", "previewOrigin", "checkout warns local/preview testers about live-origin payment limits"),
  () => assertIncludes("public/login.html", "/#/sign-in?after=welcome&source=login", "login sign-in link preserves dashboard intent"),
  () => assertIncludes("public/login.html", "/#/sign-up?after=welcome&source=login", "login sign-up link preserves dashboard intent"),
  () => assertIncludes("src/components/Nav.tsx", "SignedOut", "nav hides sign-in CTA when already signed in"),
  () => assertIncludes("src/pages/Welcome.tsx", "purchaseSuccess", "welcome handles legacy purchase-success returns"),
  () => assertIncludes("src/pages/Welcome.tsx", "ApiError", "welcome shows enrollment mismatch errors instead of hiding every API failure"),
  () => assertNotIncludes("src/components/Nav.tsx", "href=\"/login.html\"", "nav uses SPA auth route instead of static login detour"),
  () => assertNotIncludes("src/components/Footer.tsx", "href=\"/login.html\"", "footer uses SPA auth route instead of static login detour"),
];

for (const check of checks) {
  check();
}

console.log(`auth_checkout_flow_test: ${checks.length} checks passed`);
