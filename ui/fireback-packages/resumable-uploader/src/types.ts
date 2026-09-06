export type UploadStatus =
  | "converting"
  | "queued"
  | "uploading"
  | "paused"
  | "offline-paused"
  | "completed"
  | "error"
  | "canceled";

export interface FileValidationRule {
  mimeStartsWith?: string; // e.g. 'image/', 'application/pdf'
  extension?: string; // e.g. '.jpg', '.docx'
  maxSize?: number; // bytes
}

export interface UploadItem {
  id: string;
  /**
   * Identifies which <FileUploader> instance added this item, so multiple
   * uploaders sharing one <UploaderConfigProvider> (e.g. several fields on
   * the same form) each only see and react to their own uploads instead of
   * the entire shared queue.
   */
  ownerId: string;
  file: File;
  fileId?: string;
  status: UploadStatus;
  bytesUploaded: number;
  bytesTotal: number;
  uploadUrl: string | null;
  error: string | null;
  previewUrl: string | null;
  /**
   * 0-100 progress of an in-progress beforeUpload transform (e.g.
   * VideoUploader's ffmpeg re-encode), only meaningful while status is
   * "converting". A transform that never reports progress (ImageUploader's
   * canvas conversion, which is effectively instant) just leaves this
   * undefined - FileUploader renders an indeterminate bar in that case.
   */
  conversionProgress?: number;
}

/**
 * Optional per-call hook into addFiles: given the raw picked File, returns
 * the File to actually queue (e.g. ImageUploader's format-converted copy,
 * VideoUploader's ffmpeg re-encode), or throws/rejects to reject the pick
 * outright (surfaced as an "error" item with the thrown message, same as a
 * validateFile failure). While it's running, the item shows status
 * "converting"; the optional onProgress callback (0-100) drives that item's
 * conversionProgress - a transform that never calls it just leaves the item
 * showing an indeterminate bar for however long it takes.
 */
export type FileTransform = (
  file: File,
  onProgress?: (percent: number) => void,
) => Promise<File>;

export type UploaderLocale = "en" | "fa" | "pl";

export type HeaderProvider =
  | Record<string, string>
  | (() => Record<string, string> | Promise<Record<string, string>>);

export interface UploadTranslations {
  attachFile: string;
  dropHere: string;
  browse: string;
  converting: string;
  queued: string;
  uploading: string;
  paused: string;
  offlinePaused: string;
  completed: string;
  failed: string;
  canceled: string;
  pause: string;
  resume: string;
  retry: string;
  remove: string;
  clear: string;
  replace: string;
  currentFile: string;
  offlineNotice: string;
  onlineResuming: string;
  fileTooLarge: (maxMB: number) => string;
  fileTypeNotAllowed: string;
  maxSizeLabel: (size: string) => string;
}

export interface UploaderConfig {
  /** tus server endpoint, e.g. "http://localhost:4500/storage/files" */
  endpoint: string;
  /** static headers, or a (sync/async) function evaluated before every request - useful for tokens that can expire mid-upload */
  headers?: HeaderProvider;
  metadata?: Record<string, string>;
  /**
   * Bytes sent per PATCH request. Defaults to 6 MiB (not tus-js-client's own
   * Infinity default, which sends the entire file as one PATCH) so that a
   * stalled/timed-out request only has to be retried for one chunk instead
   * of restarting arbitrarily large files from scratch. See also
   * `minChunkSize`, which this backs off towards on repeated failures.
   */
  chunkSize?: number;
  /**
   * Floor `chunkSize` is halved towards (see `maxAutoRetries`) after
   * repeated failures on the same upload, on the theory that a flaky
   * connection may still get a smaller request through. Defaults to 512 KiB.
   */
  minChunkSize?: number;
  /**
   * How many times an upload automatically restarts itself (resuming from
   * its last confirmed offset, via `findPreviousUploads`) with a halved
   * `chunkSize` after tus-js-client's own in-request retries (`retryDelays`)
   * are exhausted, before finally surfacing as a user-visible error.
   * Defaults to 3.
   */
  maxAutoRetries?: number;
  /**
   * Per-request timeout (ms) applied to every PATCH/POST/HEAD the uploader
   * makes. tus-js-client's default XHR transport never times out a stalled
   * request on its own (a dropped connection with no error just hangs
   * indefinitely) - this is what turns that into a normal request failure,
   * which flows into the retry behavior above instead of hanging until the
   * user manually aborts and restarts. Defaults to 60000 (60s).
   */
  requestTimeout?: number;
  retryDelays?: number[];
  validateFile?: FileValidationRule[];
  /** Selects the built-in translation set ("en", "fa" or "pl"). Ignored for keys overridden in `translations`. */
  locale?: UploaderLocale;
  translations?: Partial<UploadTranslations>;
  /**
   * Given the value previously stored for this field (the tus upload id/URL
   * returned from a past upload), returns a URL the backend serves a
   * thumbnail/preview image from. Used to render a preview when a form is
   * reopened later with an existing value but no local File object.
   */
  getThumbnailUrl?: (value: string) => string;
}
