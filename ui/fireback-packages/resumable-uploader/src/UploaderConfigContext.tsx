import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { Upload } from "tus-js-client";
import { validateFileAgainstRules } from "./fileValidation";
import { TimeoutHttpStack } from "./TimeoutHttpStack";
import { defaultUploadTranslations, mergeTranslations } from "./translations";
import type {
  FileTransform,
  UploaderConfig,
  UploadItem,
  UploadTranslations,
} from "./types";

const DEFAULT_CHUNK_SIZE = 6 * 1024 * 1024; // 6 MiB
const DEFAULT_MIN_CHUNK_SIZE = 512 * 1024; // 512 KiB
const DEFAULT_MAX_AUTO_RETRIES = 3;
const DEFAULT_REQUEST_TIMEOUT = 60_000; // 60s

interface UploaderContextValue {
  config: UploaderConfig;
  translations: UploadTranslations;
  items: UploadItem[];
  isOnline: boolean;
  addFiles: (files: File[], ownerId: string, beforeUpload?: FileTransform) => void;
  pauseItem: (id: string) => void;
  resumeItem: (id: string) => void;
  retryItem: (id: string) => void;
  cancelItem: (id: string) => void;
  removeItem: (id: string) => void;
}

const UploaderConfigContext = createContext<UploaderContextValue | null>(null);

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function makeErrorItem(file: File, ownerId: string, message: string): UploadItem {
  return {
    id: makeId(),
    ownerId,
    file,
    status: "error",
    bytesUploaded: 0,
    bytesTotal: file.size,
    uploadUrl: null,
    error: message,
    previewUrl: null,
  };
}

function buildQueuedItem(id: string, ownerId: string, file: File): UploadItem {
  return {
    id,
    ownerId,
    file,
    status: "queued",
    bytesUploaded: 0,
    bytesTotal: file.size,
    uploadUrl: null,
    error: null,
    previewUrl: isPreviewable(file.type) ? URL.createObjectURL(file) : null,
  };
}

function isPreviewable(mime: string): boolean {
  return (
    mime.startsWith("image/") ||
    mime.startsWith("video/") ||
    mime.startsWith("audio/") ||
    mime === "application/pdf"
  );
}

async function resolveHeaders(
  config: UploaderConfig,
): Promise<Record<string, string>> {
  if (!config.headers) return {};
  if (typeof config.headers === "function") {
    return (await config.headers()) || {};
  }
  return config.headers;
}

export function UploaderConfigProvider({
  config,
  children,
}: {
  config: UploaderConfig;
  children: ReactNode;
}) {
  const translations = useMemo(
    () => mergeTranslations(config.translations, config.locale),
    [config.translations, config.locale],
  );

  const [items, setItems] = useState<UploadItem[]>([]);
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  // Keep a mutable mirror of `items` so the online/offline handlers (attached
  // once) always see the latest list without having to re-subscribe.
  const itemsRef = useRef<UploadItem[]>(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // tus Upload instances live outside React state: they are stateful objects
  // with their own internal offset tracking, which is what lets us call
  // .abort() / .start() again on the very same instance to pause/resume.
  const uploadsRef = useRef<Map<string, Upload>>(new Map());
  const manuallyPausedRef = useRef<Set<string>>(new Set());
  const configRef = useRef(config);
  configRef.current = config;

  // Per-item chunkSize (shrunk on repeated failures, see startUpload's
  // onError) and consecutive-failure count, keyed by item id. Kept outside
  // React state for the same reason uploadsRef is: purely internal retry
  // bookkeeping that nothing renders off of.
  const chunkSizesRef = useRef<Map<string, number>>(new Map());
  const failureCountsRef = useRef<Map<string, number>>(new Map());

  const updateItem = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    );
  }, []);

  const startUpload = useCallback(
    async (item: UploadItem) => {
      const cfg = configRef.current;
      const minChunkSize = cfg.minChunkSize ?? DEFAULT_MIN_CHUNK_SIZE;
      const maxAutoRetries = cfg.maxAutoRetries ?? DEFAULT_MAX_AUTO_RETRIES;

      // The effective chunk size for *this* attempt: the configured/default
      // size the first time an item is uploaded, or whatever it was last
      // shrunk to by a previous failed attempt (see onError below) on
      // retry/resume.
      const chunkSize =
        chunkSizesRef.current.get(item.id) ??
        cfg.chunkSize ??
        DEFAULT_CHUNK_SIZE;
      chunkSizesRef.current.set(item.id, chunkSize);

      const upload = new Upload(item.file, {
        endpoint: cfg.endpoint,
        // tus-js-client merges options via `{ ...defaultOptions, ...options }`,
        // so an explicit `chunkSize: undefined` key here would override its
        // own Infinity default instead of falling back to it, then get cast
        // via `Number(undefined)` into NaN - which silently breaks the
        // browser file source's slice() bounds (every chunk reads back empty
        // without ever reporting "done", so the upload spins forever sending
        // 0-byte PATCH requests with no error). Must always resolve to a
        // real, finite number - chunkSize above already guarantees that.
        chunkSize,
        retryDelays: cfg.retryDelays ?? [0, 1000, 3000, 5000, 10000],
        // Default XHR requests never time out on their own - a request whose
        // connection has gone silent (not errored, just silent) never fires
        // onload or onerror, so tus-js-client has no failure to retry and the
        // upload just hangs until the user manually aborts and restarts. This
        // turns that silence into a normal, retryable request failure after
        // requestTimeout ms. See TimeoutHttpStack's own doc comment.
        httpStack: new TimeoutHttpStack(
          cfg.requestTimeout ?? DEFAULT_REQUEST_TIMEOUT,
        ),
        metadata: {
          filename: item.file.name,
          filetype: item.file.type || "application/octet-stream",
          ...cfg.metadata,
        },
        // Bug fix: this used to *also* pass a `headers` option here (a
        // snapshot resolved once up front), on top of onBeforeRequest below
        // re-resolving and re-applying the same headers again for every
        // request tus-js-client makes - including this same upload's very
        // first creation POST, which goes through both addRequiredHeaders
        // (the static `headers` option) and onBeforeRequest on the same
        // underlying XMLHttpRequest. XMLHttpRequest.setRequestHeader()
        // *appends*, comma-joined, when called twice for the same header
        // name rather than overwriting - so e.g. "authorization" arrived at
        // the server as "<token>, <token>", which the backend's token
        // lookup obviously can't match to a real session, 401ing every
        // upload for any config that set an authorization header (i.e. any
        // authenticated use of this module at all). onBeforeRequest alone
        // already covers every request, so the static option was not just
        // redundant but actively wrong - removed instead of deduplicated.
        onBeforeRequest: async (req) => {
          const freshHeaders = await resolveHeaders(configRef.current);
          for (const [key, value] of Object.entries(freshHeaders)) {
            req.setHeader(key, value);
          }
        },
        onProgress: (bytesSent, bytesTotal) => {
          updateItem(item.id, { bytesUploaded: bytesSent, bytesTotal });
        },
        onSuccess: () => {
          uploadsRef.current.delete(item.id);
          chunkSizesRef.current.delete(item.id);
          failureCountsRef.current.delete(item.id);
          updateItem(item.id, {
            status: "completed",
            uploadUrl: upload.url,
            fileId: extractHash(upload.url),
          });
        },
        onError: (error) => {
          // A disconnect surfaces here as a request error. If we are already
          // offline, treat it as a pause rather than a failure - the
          // online-listener below will restart this same instance later.
          const offline = typeof navigator !== "undefined" && !navigator.onLine;
          if (offline) {
            updateItem(item.id, { status: "offline-paused" });
            return;
          }

          // This fires only once tus-js-client's own in-request retries
          // (retryDelays) are exhausted for the current chunk - so the
          // connection isn't just flaky, it's failing outright. Rather than
          // surface that straight to the user, back off: halve the chunk
          // size (a smaller request has a better chance of completing over a
          // bad connection) and transparently restart this same item, up to
          // maxAutoRetries times. startUpload resumes from the last
          // confirmed offset via findPreviousUploads, so nothing already
          // uploaded is resent.
          const failures = (failureCountsRef.current.get(item.id) ?? 0) + 1;
          failureCountsRef.current.set(item.id, failures);

          const currentChunkSize =
            chunkSizesRef.current.get(item.id) ?? chunkSize;
          const canShrink = currentChunkSize > minChunkSize;

          if (failures <= maxAutoRetries && canShrink) {
            uploadsRef.current.delete(item.id);
            chunkSizesRef.current.set(
              item.id,
              Math.max(minChunkSize, Math.floor(currentChunkSize / 2)),
            );
            void startUpload(item);
            return;
          }

          updateItem(item.id, {
            status: "error",
            error: error.message ?? String(error),
          });
        },
      });

      uploadsRef.current.set(item.id, upload);
      updateItem(item.id, { status: "uploading", error: null });

      try {
        const previousUploads = await upload.findPreviousUploads();
        if (previousUploads.length > 0) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }
      } catch {
        // URL storage lookup failing (e.g. localStorage unavailable) just
        // means we start a fresh upload instead of resuming one.
      }

      upload.start();
    },
    [updateItem],
  );

  const addFiles = useCallback(
    (files: File[], ownerId: string, beforeUpload?: FileTransform) => {
      const run = async () => {
        for (const file of files) {
          let workingFile = file;

          // beforeUpload lets a wrapper like ImageUploader/VideoUploader
          // swap in a converted File (or reject the pick outright, e.g. a
          // non-image file) before it ever reaches validateFileAgainstRules
          // below. Unlike the plain path, this gets its item into the list
          // immediately as "converting" - a real transform (ffmpeg re-
          // encoding a video) can take anywhere from seconds to minutes, so
          // there has to be *something* on screen for that whole span
          // rather than the UI looking frozen until it resolves.
          if (beforeUpload) {
            const id = makeId();
            setItems((prev) => [
              ...prev,
              {
                id,
                ownerId,
                file,
                status: "converting",
                bytesUploaded: 0,
                bytesTotal: file.size,
                uploadUrl: null,
                error: null,
                previewUrl: null,
                conversionProgress: 0,
              },
            ]);

            try {
              workingFile = await beforeUpload(file, (percent) =>
                updateItem(id, { conversionProgress: percent }),
              );
            } catch (err) {
              updateItem(id, {
                status: "error",
                error: err instanceof Error ? err.message : String(err),
              });
              continue;
            }

            const failure = validateFileAgainstRules(
              workingFile,
              configRef.current.validateFile,
            );
            if (failure) {
              updateItem(id, {
                status: "error",
                error:
                  failure.code === "size"
                    ? translations.fileTooLarge(
                        Math.round(failure.maxSize / 1024 / 1024),
                      )
                    : translations.fileTypeNotAllowed,
                file: workingFile,
                bytesTotal: workingFile.size,
              });
              continue;
            }

            const item = buildQueuedItem(id, ownerId, workingFile);
            updateItem(id, item);
            void startUpload(item);
            continue;
          }

          const failure = validateFileAgainstRules(
            workingFile,
            configRef.current.validateFile,
          );
          if (failure) {
            const message =
              failure.code === "size"
                ? translations.fileTooLarge(
                    Math.round(failure.maxSize / 1024 / 1024),
                  )
                : translations.fileTypeNotAllowed;
            setItems((prev) => [
              ...prev,
              makeErrorItem(workingFile, ownerId, message),
            ]);
            continue;
          }

          const item = buildQueuedItem(makeId(), ownerId, workingFile);
          setItems((prev) => [...prev, item]);
          void startUpload(item);
        }
      };
      void run();
    },
    [startUpload, translations, updateItem],
  );

  const pauseItem = useCallback(
    (id: string) => {
      manuallyPausedRef.current.add(id);
      uploadsRef.current.get(id)?.abort();
      updateItem(id, { status: "paused" });
    },
    [updateItem],
  );

  const resumeItem = useCallback(
    (id: string) => {
      manuallyPausedRef.current.delete(id);
      const upload = uploadsRef.current.get(id);
      if (upload) {
        upload.start();
        updateItem(id, { status: "uploading" });
      }
    },
    [updateItem],
  );

  const retryItem = useCallback(
    (id: string) => {
      manuallyPausedRef.current.delete(id);
      // A manual retry gets a fresh budget of auto shrink-and-retry attempts
      // (startUpload's onError) - but keeps whatever chunk size the last
      // attempt had shrunk down to, since that's presumably still the size
      // more likely to get through.
      failureCountsRef.current.delete(id);
      const item = itemsRef.current.find((it) => it.id === id);
      if (item) void startUpload(item);
    },
    [startUpload],
  );

  const cancelItem = useCallback(
    (id: string) => {
      uploadsRef.current.get(id)?.abort();
      uploadsRef.current.delete(id);
      manuallyPausedRef.current.delete(id);
      chunkSizesRef.current.delete(id);
      failureCountsRef.current.delete(id);
      updateItem(id, { status: "canceled" });
    },
    [updateItem],
  );

  const removeItem = useCallback((id: string) => {
    const item = itemsRef.current.find((it) => it.id === id);
    if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
    uploadsRef.current.get(id)?.abort();
    uploadsRef.current.delete(id);
    manuallyPausedRef.current.delete(id);
    chunkSizesRef.current.delete(id);
    failureCountsRef.current.delete(id);
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  // Connectivity handling: pause in-flight uploads the moment the browser
  // reports "offline" (rather than waiting for requests to time out), and
  // transparently resume every auto-paused upload once back "online" - this
  // is what lets an upload keep going across a network drop without the
  // user having to do anything.
  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
      for (const item of itemsRef.current) {
        if (item.status === "uploading") {
          uploadsRef.current.get(item.id)?.abort();
          updateItem(item.id, { status: "offline-paused" });
        }
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      for (const item of itemsRef.current) {
        if (
          item.status === "offline-paused" &&
          !manuallyPausedRef.current.has(item.id)
        ) {
          const upload = uploadsRef.current.get(item.id);
          if (upload) {
            upload.start();
            updateItem(item.id, { status: "uploading" });
          } else {
            void startUpload(item);
          }
        }
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [startUpload, updateItem]);

  const value: UploaderContextValue = {
    config,
    translations,
    items,
    isOnline,
    addFiles,
    pauseItem,
    resumeItem,
    retryItem,
    cancelItem,
    removeItem,
  };

  return (
    <UploaderConfigContext.Provider value={value}>
      {children}
    </UploaderConfigContext.Provider>
  );
}

export function useUploaderConfig(): UploaderContextValue {
  const ctx = useContext(UploaderConfigContext);
  if (!ctx) {
    throw new Error(
      "useUploaderConfig must be used within a <UploaderConfigProvider>",
    );
  }
  return ctx;
}

export { defaultUploadTranslations };

function extractHash(url: string): string | null {
  try {
    const { pathname } = new URL(url);
    return pathname.split("/").filter(Boolean).pop() ?? null;
  } catch {
    return null;
  }
}
