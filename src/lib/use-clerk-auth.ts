import { useAuth } from "@clerk/clerk-react";

export interface ClerkAuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  getToken: () => Promise<string | null>;
}

export function useClerkAuth(): ClerkAuthState {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  return {
    isLoaded,
    isSignedIn: Boolean(isSignedIn),
    getToken: isLoaded ? getToken : async () => null,
  };
}
