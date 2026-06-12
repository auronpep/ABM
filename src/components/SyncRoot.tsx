// Mounts inside ClerkProvider. Signed in: pull the account snapshot once
// (re-keying children so pages re-read storage), then debounce-push on every
// state change and on tab hide. Signed out or Clerk unreachable: renders
// children untouched — the app behaves exactly as before accounts existed.
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { STATE_EVENT, pullSnapshot, pushSnapshot } from "../lib/sync.ts";

const PUSH_DEBOUNCE_MS = 1500;

export function SyncRoot({ children }: { children: React.ReactNode }) {
  const { isLoaded, user } = useUser();
  const [epoch, setEpoch] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    if (pullSnapshot(user)) setEpoch((e) => e + 1);
    void pushSnapshot(user); // reconcile any unsynced local work

    const onChange = () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        void pushSnapshot(user);
      }, PUSH_DEBOUNCE_MS);
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") void pushSnapshot(user);
    };
    window.addEventListener(STATE_EVENT, onChange);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener(STATE_EVENT, onChange);
      document.removeEventListener("visibilitychange", onHide);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]);

  return <div key={epoch} style={{ display: "contents" }}>{children}</div>;
}
