import { lazy, Suspense, useEffect, useState } from "react";
import { Nav } from "./components/Nav.tsx";
import { Footer } from "./components/Footer.tsx";
import { Home } from "./pages/Home.tsx";
import { captureUtm } from "./lib/events.ts";
import type { Route } from "./types.ts";

// Only the home page (the funnel's cold-traffic landing spot) loads eagerly.
// Every other route is its own chunk, fetched on navigation.
const HowItWorks = lazy(() => import("./pages/HowItWorks.tsx").then((m) => ({ default: m.HowItWorks })));
const Pricing = lazy(() => import("./pages/Pricing.tsx").then((m) => ({ default: m.Pricing })));
const Diagnostic = lazy(() => import("./pages/Diagnostic.tsx").then((m) => ({ default: m.Diagnostic })));
const Drill = lazy(() => import("./pages/Drill.tsx").then((m) => ({ default: m.Drill })));
const Practice = lazy(() => import("./pages/Practice.tsx").then((m) => ({ default: m.Practice })));
const Welcome = lazy(() => import("./pages/Welcome.tsx").then((m) => ({ default: m.Welcome })));
const Repair = lazy(() => import("./pages/Repair.tsx").then((m) => ({ default: m.Repair })));
const PrayerChain = lazy(() => import("./pages/PrayerChain.tsx").then((m) => ({ default: m.PrayerChain })));
const SignInPage = lazy(() => import("./pages/Auth.tsx").then((m) => ({ default: m.SignInPage })));
const SignUpPage = lazy(() => import("./pages/Auth.tsx").then((m) => ({ default: m.SignUpPage })));

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
];

function routeFromHash(): Route {
  // Strip query params inside the hash (Clerk appends ?redirect_url=… on auth routes).
  const hash = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return (ROUTES as string[]).includes(hash) ? (hash as Route) : "home";
}

export function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);

  const navigate = (next: Route) => {
    window.location.hash = next === "home" ? "/" : `/${next}`;
    setRoute(next);
  };

  useEffect(() => {
    captureUtm();
    const onHashChange = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
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
      <Suspense fallback={null}>
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
      </Suspense>
      {!chromeless && <Footer navigate={navigate} />}
    </>
  );
}
