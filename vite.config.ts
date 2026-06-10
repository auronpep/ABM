import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static marketing site for BarMatrix.
// Builds to dist/ for zero-config static hosting on the existing Vercel project.
// Plumbing pages (checkout.html, lp-*.html, campaign/emails) live in public/ and
// are copied verbatim into the build output.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
