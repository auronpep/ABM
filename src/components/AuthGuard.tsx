import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner.tsx";

interface AuthGuardProps {
  children: ReactNode;
  requireEnrolled?: boolean;
}

const AUTH_GUARD_TIMEOUT_MS = 3000;

function SignInPrompt() {
  return (
    <div className="auth-guard-panel">
      <div className="eyebrow-red">▌ Account Required</div>
      <h1 className="display display-md">Sign in to continue.</h1>
      <p className="body-lg">This page follows your enrolled work and needs your account session.</p>
      <a className="btn red btn-lg" href="/sign-in?after=dashboard&source=guard">
        Sign in <span className="arrow">→</span>
      </a>
    </div>
  );
}

function EnrollPrompt() {
  return (
    <div className="auth-guard-panel">
      <div className="eyebrow-red">▌ Enrollment Required</div>
      <h1 className="display display-md">This is for enrolled students.</h1>
      <p className="body-lg">Use the program checkout email, or enroll before opening this surface.</p>
      <a className="btn red btn-lg" href="/pricing">
        See pricing <span className="arrow">→</span>
      </a>
    </div>
  );
}

export function AuthGuard({ children, requireEnrolled = false }: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if ((isLoaded && userLoaded) || timedOut) return;
    const id = window.setTimeout(() => setTimedOut(true), AUTH_GUARD_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [isLoaded, timedOut, userLoaded]);

  if (!timedOut && (!isLoaded || !userLoaded)) return <LoadingSpinner label="Checking account access" />;
  if (!isSignedIn) return <SignInPrompt />;

  const metadata = user?.publicMetadata as Record<string, unknown> | undefined;
  const enrolled = metadata?.enrolled === true || typeof metadata?.plan === "string";
  if (requireEnrolled && !enrolled) return <EnrollPrompt />;

  return <>{children}</>;
}
