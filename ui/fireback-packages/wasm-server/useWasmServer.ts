import { useEffect, useState } from "react";
import {
  startWasmServer,
  wasmFetchOverride,
  onWasmDownloadProgress,
  onWasmBootStage,
  type WasmServerOptions,
  type WasmDownloadProgress,
  type WasmBootStage,
} from "./wasmServer";
import { FetchxContext } from "@fireback/js-remote-ctx/common/fetchx";

export interface UseWasmServerResult {
  /** true once window.handleWasmRequest is live and ctx is safe to use. */
  ready: boolean;
  /** Set if downloading/booting the wasm server failed. */
  error: Error | null;
  /**
   * Byte progress of the .wasm download, or null before the download has
   * started (or once boot is well past it, e.g. an old memory-only reload).
   */
  progress: WasmDownloadProgress | null;
  /**
   * The current boot phase (see WasmBootStage) - null before boot has
   * reported anything yet. Covers the stretch progress alone doesn't: once
   * the .wasm download finishes, main() still has to connect to the
   * database and run its migrations before `ready` flips true, which is
   * silent and can take a few seconds - this is what a booting screen
   * should show during that gap instead of a frozen progress bar.
   */
  stage: WasmBootStage | null;
  /**
   * A FetchxContext wired to route through the in-browser server. Pass it as
   * fetchx()'s third argument (or via FetchxProvider) the same way you'd use
   * a context pointed at a real API base URL — calls just no-op/reject until
   * `ready` flips true.
   */
  ctx: FetchxContext;
}

/**
 * Downloads and boots cmd/fireback-wasm's compiled server (see
 * wasmServer.ts) on mount, and returns a FetchxContext that routes through it
 * once ready. One boot is shared across every component that calls this hook
 * (see startWasmServer's memoization) — mounting it twice doesn't download or
 * start a second server.
 *
 * Most apps won't call this directly — see WithWasmServer.tsx, which wraps
 * it behind the VITE_USE_WASM_SERVER build variable.
 */
export function useWasmServer(opts?: WasmServerOptions): UseWasmServerResult {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<WasmDownloadProgress | null>(null);
  const [stage, setStage] = useState<WasmBootStage | null>(null);
  const [ctx] = useState(
    () => new FetchxContext("", {}, undefined, undefined, wasmFetchOverride()),
  );

  useEffect(() => {
    // Subscribed independently of who actually triggers the boot below —
    // onWasmDownloadProgress replays the latest known progress to a late
    // subscriber, so this works whether this component started the boot or
    // another one already in flight did.
    return onWasmDownloadProgress(setProgress);
  }, []);

  useEffect(() => {
    // Same late-subscriber replay behavior as onWasmDownloadProgress above.
    return onWasmBootStage(setStage);
  }, []);

  useEffect(() => {
    let cancelled = false;
    startWasmServer(opts)
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err);
      });
    return () => {
      cancelled = true;
    };
    // opts is intentionally read once — startWasmServer boots a single
    // shared instance, changing options after boot wouldn't do anything.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ready, error, progress, stage, ctx };
}
