import { useEffect, useState } from "react";
import { Nav } from "./components/Nav.tsx";
import { Footer } from "./components/Footer.tsx";
import { EmptyState } from "./components/EmptyState.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { PageShell } from "./components/PageShell.tsx";
import { Home } from "./pages/Home.tsx";
import { HowItWorks } from "./pages/HowItWorks.tsx";
import { Pricing } from "./pages/Pricing.tsx";
import { Diagnostic } from "./pages/Diagnostic.tsx";
import { Drill } from "./pages/Drill.tsx";
import { Practice } from "./pages/Practice.tsx";
import { Welcome } from "./pages/Welcome.tsx";
import { Repair } from "./pages/Repair.tsx";
import { PrayerChain } from "./pages/PrayerChain.tsx";
import { SignInPage, SignUpPage } from "./pages/Auth.tsx";
import { Account } from "./pages/Account.tsx";
import { Coach } from "./pages/Coach.tsx";
import { Mastery } from "./pages/Mastery.tsx";
import { Program } from "./pages/Program.tsx";
import { RedZones } from "./pages/RedZones.tsx";
import { Tensions } from "./pages/Tensions.tsx";
import { Traps } from "./pages/Traps.tsx";
import { captureUtm } from "./lib/events.ts";
import type { PageProps, Route, RouteState } from "./types.ts";

const ROUTES: Route[] = [
  "home",
  "how-it-works",
  "pricing",
  "diagnostic",
  "drills",
  "practice",
  "dashboard",
  "welcome",
  "repair",
  "prayer-chain",
  "sign-in",
  "sign-up",
  "tensions",
  "tensions-detail",
  "traps",
  "traps-detail",
  "subjects",
  "subjects-detail",
  "about",
  "faq",
  "terms",
  "privacy",
  "refund",
  "webinar",
  "waitlist",
  "referral",
  "program",
  "program-lesson",
  "red-zones",
  "red-zone-detail",
  "coach",
  "mastery",
  "account",
];

const SLASH_ROUTE_MAP: Record<string, Route> = {
  "": "home",
  "diagnostic": "diagnostic",
  "pricing": "pricing",
  "sign-in": "sign-in",
  "sign-up": "sign-up",
  "account": "account",
  "dashboard": "dashboard",
};

const SLASH_ROUTES = new Set<Route>(Object.values(SLASH_ROUTE_MAP));

function routeFromPathname(): RouteState | null {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (!path && window.location.hash) return null;
  if (path === "checkout" || path === "checkout/success" || path.endsWith(".html")) return null;
  const route = SLASH_ROUTE_MAP[path];
  return route ? { route } : null;
}

function parseHashRoute(): RouteState | null {
  // Strip query params inside the hash (Clerk appends ?redirect_url=… on auth routes).
  const hash = window.location.hash.replace(/^#\/?/, "").split("?")[0].replace(/^\/+|\/+$/g, "");
  if (!hash) return null;
  const [head, slug] = hash.split("/");
  if (head === "tensions" && slug) return { route: "tensions-detail", slug };
  if (head === "traps" && slug) return { route: "traps-detail", slug };
  if (head === "red-zones" && slug) return { route: "red-zone-detail", slug };
  if (head === "program" && slug) return { route: "program-lesson", slug };
  if (head === "subjects" && slug) return { route: "subjects-detail", slug };
  return (ROUTES as string[]).includes(head) ? { route: head as Route } : { route: "home" };
}

function parseLocationRoute(): RouteState {
  return routeFromPathname() ?? parseHashRoute() ?? { route: "home" };
}

function routePath(route: Route, slug?: string): string {
  if (route === "home") return "/";
  if (route === "tensions-detail") return `/tensions/${slug ?? ""}`;
  if (route === "traps-detail") return `/traps/${slug ?? ""}`;
  if (route === "red-zone-detail") return `/red-zones/${slug ?? ""}`;
  if (route === "program-lesson") return `/program/${slug ?? ""}`;
  if (route === "subjects-detail") return `/subjects/${slug ?? ""}`;
  return `/${route}`;
}

function hrefForRoute(route: Route, slug?: string): string {
  const path = routePath(route, slug);
  return SLASH_ROUTES.has(route) ? path : `/#${path}`;
}

function checkoutRedirectTarget(): string | null {
  const path = window.location.pathname.replace(/\/+$/g, "") || "/";
  if (path !== "/checkout" && path !== "/checkout/success") return null;
  const params = new URLSearchParams(window.location.search);
  if (path === "/checkout/success") params.set("purchase", "success");
  const query = params.toString();
  return `/checkout.html${query ? `?${query}` : ""}`;
}

export function App() {
  const redirect = checkoutRedirectTarget();
  const [state, setState] = useState<RouteState>(parseLocationRoute);
  const route = state.route;

  useEffect(() => {
    if (redirect) window.location.replace(redirect);
  }, [redirect]);

  if (redirect) return null;

  const navigate: PageProps["navigate"] = (next, slug) => {
    const href = hrefForRoute(next, slug);
    if (href.startsWith("/#")) {
      window.location.hash = href.slice(1);
    } else {
      window.history.pushState(null, "", href);
    }
    setState({ route: next, slug });
  };

  useEffect(() => {
    captureUtm();
    const onRouteChange = () => setState(parseLocationRoute());
    window.addEventListener("popstate", onRouteChange);
    window.addEventListener("hashchange", onRouteChange);
    return () => {
      window.removeEventListener("popstate", onRouteChange);
      window.removeEventListener("hashchange", onRouteChange);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const chromeless =
    route === "diagnostic" ||
    route === "dashboard" ||
    route === "welcome" ||
    route === "repair" ||
    route === "sign-in" ||
    route === "sign-up";

  return (
    <>
      {!chromeless && <Nav navigate={navigate} route={route} />}
      <ErrorBoundary key={`${route}:${state.slug ?? ""}`}>
        {route === "home" && <Home navigate={navigate} />}
        {route === "how-it-works" && <HowItWorks navigate={navigate} />}
        {route === "pricing" && <Pricing navigate={navigate} />}
        {route === "diagnostic" && <Diagnostic navigate={navigate} />}
        {route === "drills" && <Drill navigate={navigate} />}
        {route === "practice" && <Practice navigate={navigate} />}
        {route === "dashboard" && <Welcome navigate={navigate} mode="dashboard" />}
        {route === "welcome" && <Welcome navigate={navigate} />}
        {route === "repair" && <Repair navigate={navigate} />}
        {route === "prayer-chain" && <PrayerChain navigate={navigate} />}
        {route === "sign-in" && <SignInPage navigate={navigate} />}
        {route === "sign-up" && <SignUpPage navigate={navigate} />}
        {(route === "tensions" || route === "tensions-detail") && <Tensions navigate={navigate} slug={state.slug} />}
        {(route === "traps" || route === "traps-detail") && <Traps navigate={navigate} slug={state.slug} />}
        {(route === "program" || route === "program-lesson") && <Program navigate={navigate} />}
        {(route === "red-zones" || route === "red-zone-detail") && <RedZones navigate={navigate} />}
        {route === "coach" && <Coach navigate={navigate} />}
        {route === "mastery" && <Mastery navigate={navigate} />}
        {route === "account" && <Account navigate={navigate} />}
        {(
          route === "subjects" ||
          route === "subjects-detail" ||
          route === "about" ||
          route === "faq" ||
          route === "terms" ||
          route === "privacy" ||
          route === "refund" ||
          route === "webinar" ||
          route === "waitlist" ||
          route === "referral"
        ) && <StaticRoute route={route} navigate={navigate} />}
      </ErrorBoundary>
      {!chromeless && <Footer navigate={navigate} />}
    </>
  );
}

function StaticRoute({ route, navigate }: PageProps & { route: Route }) {
  const title = route
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
  return (
    <PageShell narrow>
      <EmptyState
        title={title}
        body="This route is registered in the app shell. The detailed surface can be filled from static copy or API data without changing the router."
        cta={{ label: "Back home", route: "home" }}
        onNavigate={navigate}
      />
    </PageShell>
  );
}
