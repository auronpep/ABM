// #/sign-in and #/sign-up — Clerk's modal flows over the chromeless shell.
// Modals are router-agnostic (no path/hash routing to fight our hash router).
// After auth, return to the route that asked for auth. Checkout and login set
// this explicitly; otherwise the welcome next-action ladder takes over.
import { useEffect } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { brand } from "../content/brand.ts";
import { authRedirectUrl, rememberAuthIntent, resolveAuthReturnRoute } from "../lib/authFlow.ts";
import type { PageProps } from "../types.ts";

const clerkAppearance = {
  variables: {
    colorPrimary: "#c8102e",
    borderRadius: "0px",
    fontFamily: '"IBM Plex Sans", sans-serif',
  },
};

function AuthShell({
  navigate,
  mode,
}: PageProps & { mode: "sign-in" | "sign-up" }) {
  const clerk = useClerk();
  const { isLoaded, isSignedIn } = useUser();

  const open = () => {
    const intent = rememberAuthIntent(mode);
    const afterAuth = authRedirectUrl(intent);
    const options = {
      appearance: clerkAppearance,
      forceRedirectUrl: afterAuth,
      signInForceRedirectUrl: afterAuth,
      signUpForceRedirectUrl: afterAuth,
    };
    if (mode === "sign-in") clerk.openSignIn(options);
    else clerk.openSignUp(options);
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      navigate(resolveAuthReturnRoute());
      return;
    }
    open();
    return () => {
      try {
        if (mode === "sign-in") clerk.closeSignIn();
        else clerk.closeSignUp();
      } catch {
        // already closed
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, mode]);

  return (
    <div className="welcome-wrap">
      <div className="brand" style={{ marginBottom: 36, cursor: "pointer" }} onClick={() => navigate("home")}>
        <span className="mark">B</span>
        <span>
          {brand.name}
          <span className="dot" />
        </span>
      </div>
      <p className="body-lg" style={{ maxWidth: "44ch", marginBottom: 24 }}>
        {mode === "sign-in"
          ? "Sign in and your Red-Zone map and repair work follow you — any device, any browser."
          : "Create your account and your Red-Zone map and repair work follow you — any device, any browser."}
      </p>
      <p className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 28 }}>
        {mode === "sign-in"
          ? "Use the same email you enrolled with — that is how your seat is recognized."
          : "Use the exact email from checkout. That is how your seat and dashboard are recognized."}
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <button className="btn btn-lg red" onClick={open}>
          {mode === "sign-in" ? "Sign in" : "Create your account"} <span className="arrow">→</span>
        </button>
        <button className="btn btn-lg ghost" onClick={() => navigate(resolveAuthReturnRoute())}>
          Continue without switching account
        </button>
      </div>
    </div>
  );
}

export function SignInPage({ navigate }: PageProps) {
  return <AuthShell navigate={navigate} mode="sign-in" />;
}

export function SignUpPage({ navigate }: PageProps) {
  return <AuthShell navigate={navigate} mode="sign-up" />;
}
