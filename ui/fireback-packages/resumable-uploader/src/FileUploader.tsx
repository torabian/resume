import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties, DragEvent } from "react";
import { useUploaderConfig } from "./UploaderConfigContext";
import {
  buildAcceptString,
  getApplicableMaxSize,
  getOverallMaxSizeHint,
  formatMB,
} from "./fileValidation";
import type { FileTransform, UploadItem, UploadStatus } from "./types";
import { ComplexFile } from "./ComplexFile";
import type { ComplexFileInput } from "./ComplexFile";
import { DefaultPreviewer } from "./Previewer";
import type { Previewer } from "./Previewer";
import "./resumable-uploader.css";

function formatBytes(bytes: number): string {
  if (!bytes) return "0 KB";
  return `${Math.round(bytes / 1024)} KB`;
}

function statusLabel(
  status: UploadStatus,
  t: ReturnType<typeof useUploaderConfig>["translations"],
) {
  switch (status) {
    case "converting":
      return t.converting;
    case "queued":
      return t.queued;
    case "uploading":
      return t.uploading;
    case "paused":
      return t.paused;
    case "offline-paused":
      return t.offlinePaused;
    case "completed":
      return t.completed;
    case "error":
      return t.failed;
    case "canceled":
      return t.canceled;
  }
}

function UploadRow({
  item,
  onClear,
  Previewer,
}: {
  item: UploadItem;
  onClear?: (id: string) => void;
  Previewer: Previewer;
}) {
  const {
    config,
    translations: t,
    pauseItem,
    resumeItem,
    retryItem,
    removeItem,
  } = useUploaderConfig();
  const pct = item.bytesTotal
    ? Math.round((item.bytesUploaded / item.bytesTotal) * 100)
    : 0;
  const maxSize = getApplicableMaxSize(item.file, config.validateFile);
  const isPaused = item.status === "paused" || item.status === "offline-paused";

  return (
    <div className="ru-upload-row">
      <div className="ru-upload-row__preview">
        <Previewer
          file={item.file}
          localPreviewUrl={item.previewUrl}
          mimeType={item.file.type}
          filename={item.file.name}
        />
      </div>

      <div className="ru-upload-row__body">
        <div className="ru-upload-row__header">
          <strong className="ru-upload-row__filename">{item.file.name}</strong>
          <span className="ru-upload-row__size">
            {formatBytes(item.bytesTotal)}
            {maxSize ? ` / ${formatMB(maxSize)} max` : null}
          </span>
        </div>

        <div className="ru-upload-row__status">
          {statusLabel(item.status, t)}
          {item.error ? ` — ${item.error}` : null}
        </div>

        {item.status === "converting" && (
          <div className="ru-upload-row__progress-track">
            <div
              className={`ru-upload-row__progress-bar ru-upload-row__progress-bar--converting ${
                item.conversionProgress == null
                  ? "ru-upload-row__progress-bar--indeterminate"
                  : ""
              }`}
              style={
                { "--ru-progress": `${item.conversionProgress ?? 0}%` } as CSSProperties
              }
            />
          </div>
        )}

        {(item.status === "uploading" || isPaused) && (
          <div className="ru-upload-row__progress-track">
            <div
              className={`ru-upload-row__progress-bar ${
                item.status === "uploading"
                  ? "ru-upload-row__progress-bar--uploading"
                  : "ru-upload-row__progress-bar--paused"
              }`}
              style={{ "--ru-progress": `${pct}%` } as CSSProperties}
            />
          </div>
        )}

        <div className="ru-upload-row__actions">
          {item.status === "uploading" && (
            <button className="ru-btn" type="button" onClick={() => pauseItem(item.id)}>
              {t.pause}
            </button>
          )}
          {isPaused && (
            <button className="ru-btn" type="button" onClick={() => resumeItem(item.id)}>
              {t.resume}
            </button>
          )}
          {item.status === "error" && (
            <button className="ru-btn" type="button" onClick={() => retryItem(item.id)}>
              {t.retry}
            </button>
          )}
          <button className="ru-btn" type="button" onClick={() => removeItem(item.id)}>
            {t.remove}
          </button>
          {onClear && (
            <button className="ru-btn" type="button" onClick={() => onClear(item.id)}>
              {t.clear}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a value that was uploaded in a previous session (e.g. a form
 * reopened for editing) where we only have the stored id/URL, not the
 * original File object. The preview itself comes entirely from `Previewer`
 * (defaulting to DefaultPreviewer, which fetches `config.getThumbnailUrl`'s
 * URL and picks img/video/audio/iframe by `value.mimeType`).
 */
function ExistingValueRow({
  value,
  onClear,
  onReplace,
  Previewer,
}: {
  value: ComplexFile;
  onClear: () => void;
  onReplace: () => void;
  Previewer: Previewer;
}) {
  const { config, translations: t } = useUploaderConfig();
  // Prefer a thumbnail already carried on the value itself (e.g. the
  // backend returned it alongside the record) over asking config to build
  // one from just the id.
  const thumbnailUrl = value.thumbnail || config.getThumbnailUrl?.(value.id);

  return (
    <div className="ru-existing-row">
      <Previewer
        remoteUrl={thumbnailUrl}
        mimeType={value.mimeType}
        filename={value.filename}
        headers={config.headers}
      />

      <div className="ru-existing-row__body">
        <div className="ru-existing-row__label">{t.currentFile}</div>
        <div className="ru-existing-row__actions">
          <button className="ru-btn" type="button" onClick={onReplace}>
            {t.replace}
          </button>
          <button className="ru-btn" type="button" onClick={onClear}>
            {t.clear}
          </button>
        </div>
      </div>
    </div>
  );
}

export function FileUploader({
  multiple = true,
  className,
  value,
  onChange,
  fieldKey,
  beforeUpload,
  previewer: Previewer = DefaultPreviewer,
}: {
  multiple?: boolean;
  className?: string;
  /**
   * The value stored from a previous upload (e.g. when a form is reopened
   * for editing) - a plain file id, or a richer object/ComplexFile carrying
   * whatever metadata the backend also returned (filesize, thumbnail, ...).
   * Normalized into a ComplexFile and rendered via its own `thumbnail`, or
   * `config.getThumbnailUrl`, until a new file is picked in this session.
   */
  value?: ComplexFileInput | null;
  /**
   * Called with a ComplexFile once a file finishes uploading, and
   * explicitly called with `null` when the user hits "Clear" - lets this
   * component be wired up as a controlled form field, mirroring how
   * FormXFile's onChange/value pair works.
   */
  onChange?: (value: ComplexFile | null) => void;
  /**
   * Stable identity for this uploader, used to tell its uploads apart from
   * any other <FileUploader> sharing the same <UploaderConfigProvider> (e.g.
   * several file fields on one form). Defaults to an auto-generated id that
   * stays stable for as long as this component instance is mounted; only
   * pass your own if this exact widget needs to be unmounted and remounted
   * elsewhere while still picking up its own in-progress uploads.
   */
  fieldKey?: string;
  /**
   * Runs on every picked/dropped file before it's queued, so a wrapper like
   * ImageUploader can swap in a converted File or reject the pick outright
   * (throw/reject - surfaces as an "error" item, same as a validateFile
   * failure). Not meant to be passed directly by app code; ImageUploader
   * sets it internally.
   */
  beforeUpload?: FileTransform;
  /**
   * Component used to render every file preview this uploader shows - both a
   * freshly-picked local File (still in this session's queue) and an
   * already-stored value (only a download URL, no local File - see
   * Previewer.tsx's own doc comment on the two shapes it's called with).
   * Defaults to DefaultPreviewer, which already picks img/video/audio/iframe
   * by mime type either way; pass your own to fully replace how a
   * particular field previews (e.g. a richer viewer for one specific kind of
   * file). ImageUploader/VideoUploader forward this straight through.
   */
  previewer?: Previewer;
}) {
  const {
    config,
    translations: t,
    items,
    isOnline,
    addFiles,
    removeItem,
  } = useUploaderConfig();
  const generatedFieldKey = useId();
  const ownerId = fieldKey ?? generatedFieldKey;
  const myItems = useMemo(
    () => items.filter((item) => item.ownerId === ownerId),
    [items, ownerId],
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const notifiedRef = useRef<Set<string>>(new Set());
  const maxSizeHint = getOverallMaxSizeHint(config.validateFile);
  const complexValue = useMemo(
    () => (value != null ? new ComplexFile(value) : null),
    [value],
  );
  const showExistingValue = !!complexValue && myItems.length === 0;

  useEffect(() => {
    if (!onChange) return;
    for (const item of myItems) {
      if (
        item.status === "completed" &&
        item.uploadUrl &&
        !notifiedRef.current.has(item.id)
      ) {
        notifiedRef.current.add(item.id);
        console.log(5, item);
        onChange(
          new ComplexFile({
            id: item.uploadUrl,
            filesize: item.bytesTotal,
            filename: item.file.name,
            mimeType: item.file.type,
            thumbnail: config.getThumbnailUrl?.(item.uploadUrl),
          }),
        );
      }
    }
  }, [myItems, onChange, config]);

  const handleClear = (id: string) => {
    removeItem(id);
    onChange?.(null);
  };

  const openFileDialog = () => inputRef.current?.click();

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) addFiles(multiple ? files : [files[0]], ownerId, beforeUpload);
  };

  return (
    <div className={`ru-uploader ${className || ""}`.trim()}>
      {!isOnline && (
        <div className="ru-uploader__offline-banner">{t.offlineNotice}</div>
      )}

      {showExistingValue && complexValue && (
        <ExistingValueRow
          value={complexValue}
          onClear={() => onChange?.(null)}
          onReplace={openFileDialog}
          Previewer={Previewer}
        />
      )}

      <div
        onClick={openFileDialog}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        className={`ru-uploader__dropzone ${isDragOver ? "ru-uploader__dropzone--active" : ""}`.trim()}
      >
        {t.dropHere}
        {maxSizeHint && (
          <div className="ru-uploader__max-size-hint">
            {t.maxSizeLabel(maxSizeHint)}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={buildAcceptString(config.validateFile)}
          className="ru-uploader__hidden-input"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length) addFiles(files, ownerId, beforeUpload);
            e.target.value = "";
          }}
        />
      </div>

      {myItems.length > 0 && (
        <div className="ru-uploader__list">
          {myItems.map((item) => (
            <UploadRow
              key={item.id}
              item={item}
              onClear={onChange ? handleClear : undefined}
              Previewer={Previewer}
            />
          ))}
        </div>
      )}
    </div>
  );
}
