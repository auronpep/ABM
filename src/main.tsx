import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { App } from "./App.tsx";
import { SyncRoot } from "./components/SyncRoot.tsx";
import { CLERK_PUBLISHABLE_KEY } from "./lib/clerk.ts";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} signInUrl="/#/sign-in" signUpUrl="/#/sign-up">
      <SyncRoot>
        <App />
      </SyncRoot>
    </ClerkProvider>
  </StrictMode>,
);
