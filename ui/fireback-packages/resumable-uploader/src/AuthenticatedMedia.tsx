import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { HeaderProvider } from "./types";

async function resolveHeaders(
  headers?: HeaderProvider,
): Promise<Record<string, string>> {
  if (!headers) return {};
  if (typeof headers === "function") {
    return (await headers()) || {};
  }
  return headers;
}

/** Which tag to render the fetched blob as, once resolved. */
export type MediaKind = "image" | "video" | "audio" | "pdf";

/**
 * mimeStartsWith("image/") -> "image", etc. Returns null for anything this
 * component has no renderer for (a caller-supplied `kind` is the way to
 * force one anyway; this is only the auto-detection path).
 */
export function mediaKindFromMimeType(mimeType?: string | null): MediaKind | null {
  if (!mimeType) return null;
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  return null;
}

/**
 * Fetches `src` via `fetch()` with explicit headers (instead of a plain
 * `<img src>`/`<video src>`, neither of which lets the browser attach a
 * custom header at all), then renders the resulting blob as an <img>,
 * <video>, <audio> or <iframe> depending on `kind` - the same fetch-then-
 * createObjectURL workaround AuthenticatedThumbnail already used, just
 * generalized to every media type FilePreview already knows how to show for
 * a freshly-picked local File, so a *stored* value (no local File object,
 * just a download URL - see FileUploader's ExistingValueRow) gets the same
 * real preview instead of always falling back to a generic file icon.
 *
 * Needed for any thumbnail/download URL that requires an Authorization
 * header - e.g. an owned upload from the storage module (see
 * storage/README.md §6's "embedding an owned file" caveat).
 */
export function AuthenticatedMedia({
  src,
  kind,
  alt,
  className,
  style,
  headers,
  onError,
}: {
  src: string;
  kind: MediaKind;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  headers?: HeaderProvider;
  onError?: () => void;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    let revokeUrl: string | null = null;
    let cancelled = false;

    setObjectUrl(null);

    (async () => {
      try {
        const resolvedHeaders = await resolveHeaders(headers);
        const resp = await fetch(src, { headers: resolvedHeaders });
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }
        const blob = await resp.blob();
        if (cancelled) return;
        revokeUrl = URL.createObjectURL(blob);
        setObjectUrl(revokeUrl);
      } catch {
        if (!cancelled) onError?.();
      }
    })();

    return () => {
      cancelled = true;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- headers is
    // read at fetch time from the render that triggered this effect; it
    // deliberately isn't a dep, or an inline `headers={() => ({...})}`
    // (a fresh function identity every render) would refetch on every
    // parent re-render instead of only when the media itself changes.
  }, [src, kind]);

  if (!objectUrl) {
    return null;
  }

  switch (kind) {
    case "image":
      return <img src={objectUrl} alt={alt} className={className} style={style} />;
    case "video":
      return (
        <video
          src={objectUrl}
          controls
          className={className}
          style={style}
          onError={() => onError?.()}
        />
      );
    case "audio":
      return (
        <audio
          src={objectUrl}
          controls
          className={className}
          style={style}
          onError={() => onError?.()}
        />
      );
    case "pdf":
      return (
        <iframe src={objectUrl} title={alt} className={className} style={style} />
      );
  }
}
