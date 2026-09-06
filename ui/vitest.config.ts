import { defineConfig } from "vitest/config";

// Separate from vite.config.ts on purpose: that file drives the real app
// build (build variables, conditional compilation) and none of that applies
// to unit tests, so keep this minimal instead of risking the build config.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
