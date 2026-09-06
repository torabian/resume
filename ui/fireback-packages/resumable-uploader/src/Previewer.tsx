import { useState } from "react";
import type { ComponentType } from "react";
import { AuthenticatedMedia, mediaKindFromMimeType } from "./AuthenticatedMedia";
import type { MediaKind } from "./AuthenticatedMedia";
import { FilePreview, fileExtensionLabel } from "./FilePreview";
import type { HeaderProvider } from "./types";

/**
 * Everything a Previewer might need to render one file, whichever of the two
 * shapes it comes in:
 *  - a fresh, still-in-session pick (`file` set - a real File object plus
 *    the blob `localPreviewUrl` the upload queue already created for it), or
 *  - an already-stored value with nothing local to show (`remoteUrl` set -
 *    an authenticated download/thumbnail URL FileUploader's own
 *    `config.getThumbnailUrl` resolved instead).
 * Exactly one of `file`/`remoteUrl` is set for any given call.
 */
export interface PreviewProps {
  mimeType?: string | null;
  filename?: string | null;
  file?: File;
  localPreviewUrl?: string | null;
  remoteUrl?: string | null;
  headers?: HeaderProvider;
  /**
   * Forces the remote-preview kind instead of sniffing it from `mimeType` -
   * see createKindPreviewer's own doc comment for why this matters: a score/
   * record read back from the backend routinely carries only the stored
   * file id, no mimeType at all (only a *freshly uploaded* File, still in
   * this session's memory, has one to sniff), so a field that structurally
   * only ever holds one kind of file (ImageUploader/VideoUploader) is
   * better off just asserting that kind than depending on metadata that may
   * never come back from the server.
   */
  kind?: MediaKind;
  /** Only meaningful for the `remoteUrl` case - the fetch itself can fail (403, network, ...). */
  onError?: () => void;
}

/** A previewer is a real component (not a plain render function) so it gets its own state/lifecycle - see RemotePreview's own `failed` state below for why that matters. */
export type Previewer = ComponentType<PreviewProps>;

/**
 * Renders the authenticated-fetch-then-<img>/<video>/<audio>/<iframe> a
 * stored value needs (see AuthenticatedMedia's own doc comment on why a
 * plain `<img src=...>` doesn't work for an owned file), falling back to a
 * generic file-extension box up front for a type AuthenticatedMedia has no
 * renderer for, or after the fetch itself fails.
 */
function RemotePreview({
  remoteUrl,
  mimeType,
  filename,
  headers,
  kind: forcedKind,
  onError,
}: PreviewProps) {
  const kind = forcedKind ?? mediaKindFromMimeType(mimeType);
  const [failed, setFailed] = useState(false);

  if (!remoteUrl || !kind || failed) {
    return (
      <div className="ru-preview-generic">{fileExtensionLabel(filename || "")}</div>
    );
  }

  // ru-existing-row__thumbnail is a small (48x48) crop, right for an <img> -
  // video/audio/pdf get their own real-size classes (same ones FilePreview
  // uses for a local pick) instead, since a full <video controls> squeezed
  // into a 48px box wouldn't be usable. ru-existing-row's flex layout just
  // grows to fit whichever one this ends up being.
  const kindClassName: Record<typeof kind, string> = {
    image: "ru-existing-row__thumbnail",
    video: "ru-preview-video",
    audio: "ru-preview-audio",
    pdf: "ru-preview-pdf",
  };

  return (
    <AuthenticatedMedia
      src={remoteUrl}
      kind={kind}
      alt={filename || undefined}
      className={kindClassName[kind]}
      headers={headers}
      onError={() => {
        setFailed(true);
        onError?.();
      }}
    />
  );
}

/**
 * FileUploader's default `previewer`: a local pick (queued/uploading/
 * completed within this session, still holding its original File object)
 * goes through the existing FilePreview - which already dispatches by type
 * for a File - unchanged; an already-stored value with only a download URL
 * goes through RemotePreview above.
 *
 * Pass a different `previewer` to FileUploader/ImageUploader/VideoUploader
 * to fully replace this per-field, e.g. a viewer with its own chrome for a
 * specific file kind - it receives the exact same PreviewProps shape either
 * way.
 */
export function DefaultPreviewer({
  file,
  localPreviewUrl,
  remoteUrl,
  mimeType,
  filename,
  headers,
  kind,
  onError,
}: PreviewProps) {
  if (file) {
    return <FilePreview file={file} previewUrl={localPreviewUrl ?? null} />;
  }

  return (
    <RemotePreview
      remoteUrl={remoteUrl}
      mimeType={mimeType}
      filename={filename}
      headers={headers}
      kind={kind}
      onError={onError}
    />
  );
}

/**
 * Builds a previewer for a field that structurally only ever holds one kind
 * of file - what ImageUploader/VideoUploader use themselves as their own
 * default `previewer` (see FileUploader's `previewer` prop). Forces `kind`
 * for the remote-value case regardless of the value's own `mimeType` (which,
 * for a value read back from a typical backend, is routinely just missing -
 * see this file's own PreviewProps.kind doc comment); a local, freshly-
 * picked File is unaffected either way, since FilePreview already reads the
 * real `file.type` client-side, and beforeUpload already rejected anything
 * of the wrong kind before it was ever queued.
 */
export function createKindPreviewer(kind: MediaKind): Previewer {
  return function KindPreviewer(props: PreviewProps) {
    return <DefaultPreviewer {...props} kind={props.kind ?? kind} />;
  };
}
