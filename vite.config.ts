import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static marketing site for BarMatrix.
// Builds to dist/ for zero-config static hosting on the existing Vercel project.
// Plumbing pages (checkout.html, lp-*.html, campaign/emails) live in public/ and
// are copied verbatim into the build output.
export default defineConfig({
  plugins: [react()],
  // The Vercel project still carries env vars under the old app's
  // NEXT_PUBLIC_ prefix (PostHog key/host, Clerk publishable key). All
  // NEXT_PUBLIC_ values are public-by-design, so exposing the prefix is safe.
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
