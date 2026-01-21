import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
  },

  // 🔥 KEY FIX → ώστε ΟΛΑ τα routes (/analysis /hotlist /shortlist) να φορτώνουν σωστά
  build: {
    outDir: "dist",
  },

  // Για να παίζει SPA routing
  resolve: {
    alias: {},
  }
});
