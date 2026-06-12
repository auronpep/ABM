import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { brand, nav } from "../content/brand.ts";
import type { PageProps, Route } from "../types.ts";

export function Nav({ navigate, route }: PageProps & { route: Route }) {
  return (
    <>
      <div className="tape-strip" />
      <nav className="nav">
        <div className="nav-inner">
          <div className="brand" onClick={() => navigate("home")}>
            <span className="mark">B</span>
            <span>
              {brand.name}
              <span className="dot" />
            </span>
          </div>

          <div className="nav-links">
            {nav.links.map((l) => (
              <button
                key={l.route}
                className={route === l.route ? "active" : ""}
                onClick={() => navigate(l.route as Route)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="nav-cta">
            <SignedOut>
              <a className="btn ghost btn-sm" href="/#/sign-in?after=welcome&source=nav">
                Sign in
              </a>
            </SignedOut>
            <SignedIn>
              <button className="btn ghost btn-sm" onClick={() => navigate("dashboard")}>
                Dashboard
              </button>
            </SignedIn>
            <button className="btn red btn-sm" onClick={() => navigate("diagnostic")}>
              {nav.ctaPrimary}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
