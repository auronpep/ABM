import { useEffect, useState } from "react";
import { Nav } from "./components/Nav.tsx";
import { Footer } from "./components/Footer.tsx";
import { Home } from "./pages/Home.tsx";
import { HowItWorks } from "./pages/HowItWorks.tsx";
import { Pricing } from "./pages/Pricing.tsx";
import { Diagnostic } from "./pages/Diagnostic.tsx";
import { Drill } from "./pages/Drill.tsx";
import { Welcome } from "./pages/Welcome.tsx";
import { Repair } from "./pages/Repair.tsx";
import { PrayerChain } from "./pages/PrayerChain.tsx";
import { captureUtm } from "./lib/events.ts";
import type { Route } from "./types.ts";

const ROUTES: Route[] = [
  "home",
  "how-it-works",
  "pricing",
  "diagnostic",
  "drills",
  "welcome",
  "repair",
  "prayer-chain",
];

function routeFromHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, "");
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

  const chromeless = route === "diagnostic" || route === "welcome" || route === "repair";

  return (
    <>
      {!chromeless && <Nav navigate={navigate} route={route} />}
      {route === "home" && <Home navigate={navigate} />}
      {route === "how-it-works" && <HowItWorks navigate={navigate} />}
      {route === "pricing" && <Pricing navigate={navigate} />}
      {route === "diagnostic" && <Diagnostic navigate={navigate} />}
      {route === "drills" && <Drill navigate={navigate} />}
      {route === "welcome" && <Welcome navigate={navigate} />}
      {route === "repair" && <Repair navigate={navigate} />}
      {route === "prayer-chain" && <PrayerChain navigate={navigate} />}
      {!chromeless && <Footer navigate={navigate} />}
    </>
  );
}
