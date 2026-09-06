import type { CSSProperties } from "react";
import { AuthenticatedMedia } from "./AuthenticatedMedia";
import type { HeaderProvider } from "./types";

/**
 * An <img> whose source is fetched via `fetch()` with explicit headers.
 * Thin, image-only wrapper kept for backward compatibility - new code
 * showing a stored value of unknown/mixed type should use
 * {@link AuthenticatedMedia} directly (see its own doc comment), which picks
 * the right tag (<img>/<video>/<audio>/<iframe>) instead of assuming image.
 */
export function AuthenticatedThumbnail({
  src,
  alt,
  className,
  style,
  headers,
  onError,
}: {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  headers?: HeaderProvider;
  onError?: () => void;
}) {
  return (
    <AuthenticatedMedia
      src={src}
      kind="image"
      alt={alt}
      className={className}
      style={style}
      headers={headers}
      onError={onError}
    />
  );
}
