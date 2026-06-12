import { useEffect, useState } from "react";
import { Nav } from "./components/Nav.tsx";
import { Footer } from "./components/Footer.tsx";
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
import { captureUtm } from "./lib/events.ts";
import type { Route } from "./types.ts";

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
      {!chromeless && <Footer navigate={navigate} />}
    </>
  );
}
