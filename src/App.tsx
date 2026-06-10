import { useEffect, useState } from "react";
import { Nav } from "./components/Nav.tsx";
import { Footer } from "./components/Footer.tsx";
import { Home } from "./pages/Home.tsx";
import { HowItWorks } from "./pages/HowItWorks.tsx";
import { Pricing } from "./pages/Pricing.tsx";
import { Diagnostic } from "./pages/Diagnostic.tsx";
import { Drill } from "./pages/Drill.tsx";
import type { Route } from "./types.ts";

export function App() {
  const [route, setRoute] = useState<Route>("home");

  const navigate = (next: Route) => setRoute(next);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const chromeless = route === "diagnostic";

  return (
    <>
      {!chromeless && <Nav navigate={navigate} route={route} />}
      {route === "home" && <Home navigate={navigate} />}
      {route === "how-it-works" && <HowItWorks navigate={navigate} />}
      {route === "pricing" && <Pricing navigate={navigate} />}
      {route === "diagnostic" && <Diagnostic navigate={navigate} />}
      {route === "drills" && <Drill navigate={navigate} />}
      {!chromeless && <Footer navigate={navigate} />}
    </>
  );
}
