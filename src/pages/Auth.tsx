// #/sign-in and #/sign-up — Clerk components on the chromeless shell.
// Virtual routing keeps Clerk's internal steps out of our hash router.
// After auth, both land on /#/welcome: the next-action ladder takes over
// (a fresh account with no map is routed into the diagnostic as setup —
// signing up never requires having taken it).
import { SignIn, SignUp } from "@clerk/clerk-react";
import { brand } from "../content/brand.ts";
import type { PageProps } from "../types.ts";

const clerkAppearance = {
  variables: {
    colorPrimary: "#c8102e",
    borderRadius: "0px",
    fontFamily: '"IBM Plex Sans", sans-serif',
  },
};

function AuthShell({ navigate, children }: PageProps & { children: React.ReactNode }) {
  return (
    <div className="welcome-wrap">
      <div className="brand" style={{ marginBottom: 36, cursor: "pointer" }} onClick={() => navigate("home")}>
        <span className="mark">B</span>
        <span>
          {brand.name}
          <span className="dot" />
        </span>
      </div>
      {children}
    </div>
  );
}

export function SignInPage({ navigate }: PageProps) {
  return (
    <AuthShell navigate={navigate}>
      <SignIn
        routing="virtual"
        appearance={clerkAppearance}
        forceRedirectUrl="/#/welcome"
        signUpUrl="/#/sign-up"
      />
      <p className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted)", marginTop: 24 }}>
        Use the same email you enrolled with — that is how your seat is recognized.
      </p>
    </AuthShell>
  );
}

export function SignUpPage({ navigate }: PageProps) {
  return (
    <AuthShell navigate={navigate}>
      <SignUp
        routing="virtual"
        appearance={clerkAppearance}
        forceRedirectUrl="/#/welcome"
        signInUrl="/#/sign-in"
      />
      <p className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted)", marginTop: 24 }}>
        Enrolled already? Sign up with your checkout email and your seat follows you.
      </p>
    </AuthShell>
  );
}
