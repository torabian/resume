import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  outDir: "dist",
  format: ["esm", "cjs"],
  // See @fireback/overlay's tsup.config.ts for why this is needed on this
  // repo's installed TypeScript version - scoped to just the dts step so
  // tsconfig.json itself (shared with `tsc --noEmit`/editors) stays
  // untouched.
  dts: { compilerOptions: { ignoreDeprecations: "6.0" } },
  sourcemap: true,
  clean: true,
  treeshake: true,
  // @ffmpeg/ffmpeg and @ffmpeg/util are optional peer dependencies (see
  // package.json) - videoConversion.ts only ever reaches them via a runtime
  // import(), so they must stay external rather than get bundled in. A
  // consumer that never renders <VideoUploader> never even resolves these
  // module specifiers, let alone downloads ffmpeg-core.
  external: ["react", "@ffmpeg/ffmpeg", "@ffmpeg/util"],
  // FileUploader.tsx/FilePreview.tsx import "./resumable-uploader.css" as a
  // side effect - fine for the raw-source-consumed-by-app's-own-bundler
  // case this started as, but a prebuilt entry (unlike a source file) can't
  // rely on a downstream bundler picking that import up; by default esbuild
  // just extracts it to a disconnected dist/index.css nothing re-imports.
  // injectStyle makes the built JS inject the CSS into <head> itself at
  // runtime instead, so consumers get working styles with a plain
  // `import { FileUploader } from "@fireback/resumable-uploader"` - no
  // second CSS import to remember.
  injectStyle: true,
});
