import React, { type ReactNode, useMemo } from "react";
import { BUILD_VARIABLES } from "@fireback/ui-core/hooks/build-variables";
import { useWasmServer } from "./useWasmServer";
import { wasmFetchOverride } from "./wasmServer";
import type {
  WasmDownloadProgress,
  WasmServerOptions,
  WasmBootStage,
} from "./wasmServer";
import { WasmFetchOverrideContext } from "./WasmFetchContext";

// WithWasmServer — wraps the app's essential router (see App.tsx) and, when
// BUILD_VARIABLES.USE_WASM_SERVER ("VITE_USE_WASM_SERVER" in
// src/apps/*/build-variables/*.json) is on, holds off mounting `children`
// until an entire fireback backend, compiled to wasm (cmd/fireback-wasm),
// has downloaded and booted inside the tab, backed by an in-browser Postgres
// (pglite). enterprise-shell's WithFireback picks up the resulting
// wasm-backed FetchxContext automatically (it checks the same build
// variable), so nothing downstream — the router, the generated SDK actions —
// has to know the backend it's calling is running in the same tab instead of
// over the network.
//
// When the flag is off this is a pure passthrough: children mount
// immediately and wasmServer.ts/pgliteBridge.ts are never even touched.
//
//   <WithWasmServer>
//     <EssentialApp ApplicationRoutes={ApplicationRoutes} />
//   </WithWasmServer>
export function WithWasmServer({
  children,
  options,
  fallback,
}: {
  children: ReactNode;
  /** Passed straight through to startWasmServer/useWasmServer. */
  options?: WasmServerOptions;
  /** Replaces the default boot/error screens below. */
  fallback?: { booting?: ReactNode; error?: (error: Error) => ReactNode };
}) {
  if (BUILD_VARIABLES.USE_WASM_SERVER !== "true") {
    return <>{children}</>;
  }

  return (
    <WasmServerGate options={options} fallback={fallback}>
      {children}
    </WasmServerGate>
  );
}

// Split into its own component so useWasmServer (which starts the boot as a
// side effect) is only ever invoked while the feature is enabled — a plain
// `if` around a hook call inside one component would break the rules of
// hooks the moment the flag changed between renders.
function WasmServerGate({
  children,
  options,
  fallback,
}: {
  children: ReactNode;
  options?: WasmServerOptions;
  fallback?: { booting?: ReactNode; error?: (error: Error) => ReactNode };
}) {
  const { ready, error, progress, stage } = useWasmServer(options);
  // Stable across renders (useWasmServer's own boot is memoized too - see
  // startWasmServer) - provided once ready so WithFireback (via
  // WasmFetchContext.ts) can pick it up without ever importing this package
  // directly. See that file's own doc comment for why that indirection exists.
  const fetchOverride = useMemo(() => wasmFetchOverride(), []);

  if (error) {
    return (
      <>
        {fallback?.error?.(error) ?? (
          <div style={{ padding: "2rem", fontFamily: "monospace" }}>
            Failed to start the in-browser server: {error.message}
          </div>
        )}
      </>
    );
  }

  if (!ready) {
    return (
      <>
        {fallback?.booting ?? (
          <DefaultBootingScreen progress={progress} stage={stage} />
        )}
      </>
    );
  }

  return (
    <WasmFetchOverrideContext.Provider value={fetchOverride}>
      {children}
    </WasmFetchOverrideContext.Provider>
  );
}

const BYTES_PER_MB = 1024 * 1024;

// Every stage's user-facing label, in boot order - also doubles as the
// progress bar's step count (see STAGE_INDEX below), so the bar advances
// once per stage instead of sitting still (or, worse, filling up on the
// .wasm download and then looking frozen again) through the multi-second
// gap between the download finishing and `ready` actually flipping true -
// DB connect, then two full AutoMigrate passes, all silent until now (see
// WasmBootStage's own doc comment in wasmServer.ts for why this list isn't
// exhaustive forever).
const STAGE_LABELS: Record<WasmBootStage, string> = {
  "installing-database": "Setting up local database…",
  "loading-runtime": "Loading runtime…",
  downloading: "Downloading server…",
  instantiating: "Starting server…",
  "connecting-database": "Connecting to database…",
  "migrating-core": "Setting up your workspace…",
  "migrating-interface-tools": "Preparing menus & settings…",
  ready: "Ready…",
};

const STAGE_ORDER = Object.keys(STAGE_LABELS) as WasmBootStage[];

function DefaultBootingScreen({
  progress,
  stage,
}: {
  progress: WasmDownloadProgress | null;
  stage: WasmBootStage | null;
}) {
  // Index-based, not byte-based: computing the bar's width from the .wasm
  // download's byte progress during "downloading" and then switching to a
  // coarser per-stage measure for everything after would make the bar jump
  // backwards the moment the download hits 100% and "instantiating" begins.
  // One monotonically increasing measure across the whole boot, even though
  // it's coarse, reads better than a precise one that visibly rewinds.
  const stageIndex = stage ? STAGE_ORDER.indexOf(stage) : 0;
  const percent = Math.round(
    (Math.max(stageIndex, 0) / (STAGE_ORDER.length - 1)) * 100,
  );
  const bytePercent =
    progress?.total != null
      ? Math.min(100, Math.round((progress.loaded / progress.total) * 100))
      : null;

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <div>{(stage && STAGE_LABELS[stage]) || "Starting in-browser server…"}</div>

      <div style={{ marginTop: "0.75rem" }}>
        <div
          style={{
            width: 240,
            height: 8,
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(128, 128, 128, 0.25)",
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              background: "currentColor",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* Byte-level detail only makes sense while the download itself is
            the active stage - once it's done this space is better spent on
            the stage label above, which by then is describing DB/migration
            work the byte counter has nothing to say about. */}
        {stage === "downloading" && progress && progress.loaded > 0 && (
          <div style={{ marginTop: "0.25rem", fontSize: "0.85em" }}>
            {bytePercent != null
              ? `${mb(progress.loaded)} / ${mb(progress.total!)} MB (${bytePercent}%)`
              : `${mb(progress.loaded)} MB downloaded`}
          </div>
        )}
      </div>
    </div>
  );
}

function mb(bytes: number): string {
  return (bytes / BYTES_PER_MB).toFixed(1);
}

export default WithWasmServer;
