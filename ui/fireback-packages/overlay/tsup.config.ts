import { defineConfig } from "tsup";

export default defineConfig([
  {
    // "." export - the render-target-agnostic core (state machine, types,
    // useS). `src/index.ts` just re-exports `src/core`.
    name: "core",
    entry: { index: "src/index.ts" },
    outDir: "dist",
    format: ["esm", "cjs"],
    // The `dts` (declaration-bundling) step resolves tsconfig separately
    // from a plain `tsc` run and, with this repo's installed TypeScript,
    // errors on `paths` implying an unset `baseUrl` unless told to ignore
    // that specific (spuriously strict for a rollup-style dts build)
    // deprecation. Scoped to just this step so `tsconfig.json` itself
    // (shared with `tsc --noEmit`/editors) stays untouched.
    dts: { compilerOptions: { ignoreDeprecations: "6.0" } },
    sourcemap: true,
    clean: true,
    treeshake: true,
    external: ["react"],
  },
  {
    // "./dom" export - web (DOM) wrapper components.
    name: "dom",
    entry: { index: "src/dom/index.ts" },
    outDir: "dist/dom",
    format: ["esm", "cjs"],
    // The `dts` (declaration-bundling) step resolves tsconfig separately
    // from a plain `tsc` run and, with this repo's installed TypeScript,
    // errors on `paths` implying an unset `baseUrl` unless told to ignore
    // that specific (spuriously strict for a rollup-style dts build)
    // deprecation. Scoped to just this step so `tsconfig.json` itself
    // (shared with `tsc --noEmit`/editors) stays untouched.
    dts: { compilerOptions: { ignoreDeprecations: "6.0" } },
    sourcemap: true,
    clean: false,
    treeshake: true,
    // Crucial: the dom entry imports shared code (types, useS,
    // OverlayProvider/context) from "@fireback/overlay" itself rather than
    // relative "../core" paths, and that import is kept external here
    // rather than inlined. Bundling a second copy of OverlayProvider.tsx
    // into this chunk would create a second `createContext` instance, so
    // `useOverlay()` called via the "." entry could never see a
    // `<DomOverlayProvider>` mounted via the "./dom" entry.
    external: ["react", "react-dom", "@fireback/overlay"],
  },
]);
