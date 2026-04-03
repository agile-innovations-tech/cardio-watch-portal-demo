import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    css: false,
    reporters: ["verbose", "junit"],
    outputFile: {
      junit: "./test-results/junit.xml",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
