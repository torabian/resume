// Native Canvas/Image-based re-encoding - deliberately no image library
// dependency, to keep this package dependency-free besides tus-js-client
// (see package.json's own description).

import { withExtension } from "./fileNaming";

export type ImageFormat = "jpg" | "jpeg" | "png" | "webp";

export interface ConvertImageOptions {
  format: ImageFormat;
  /**
   * 0-1 encoder quality, only meaningful for the lossy formats (jpg/webp) -
   * ignored for png, which is always lossless. Defaults to 0.92.
   */
  quality?: number;
}

/** Either a bare format ("jpg") or the full options object. */
export type ConvertBeforeUpload = ImageFormat | ConvertImageOptions;

const FORMAT_TO_MIME: Record<ImageFormat, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function normalizeOptions(options: ConvertBeforeUpload): ConvertImageOptions {
  return typeof options === "string" ? { format: options } : options;
}

/**
 * Decodes a File into something <canvas> can draw. Prefers
 * createImageBitmap (doesn't need a DOM element or object URL bookkeeping);
 * falls back to a plain <img> for browsers/inputs where that rejects (e.g.
 * Safari has historically been pickier about createImageBitmap inputs than
 * a plain Image element).
 */
async function loadImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // fall through to the <img> path below
    }
  }

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to decode "${file.name}" as an image`));
    };
    img.src = url;
  });
}

function bitmapSize(bitmap: ImageBitmap | HTMLImageElement): {
  width: number;
  height: number;
} {
  return bitmap instanceof HTMLImageElement
    ? { width: bitmap.naturalWidth, height: bitmap.naturalHeight }
    : { width: bitmap.width, height: bitmap.height };
}

/**
 * Re-encodes an image File into the given format via an off-screen canvas.
 * Rejects (throws) for anything that isn't an `image/*` file, or that the
 * browser can't decode/encode. Returns the original File unchanged if it's
 * already the target format - no pointless round-trip through canvas.
 */
export async function convertImageFile(
  file: File,
  options: ConvertBeforeUpload,
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`"${file.name}" is not an image file`);
  }

  const { format, quality = 0.92 } = normalizeOptions(options);
  const targetMime = FORMAT_TO_MIME[format];
  if (!targetMime) {
    throw new Error(`Unsupported convertBeforeUpload format: "${format}"`);
  }
  if (file.type === targetMime) return file;

  const bitmap = await loadImage(file);
  try {
    const { width, height } = bitmapSize(bitmap);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");

    // jpg has no alpha channel - transparent pixels would otherwise come
    // out black instead of the white a viewer expects.
    if (targetMime === "image/jpeg") {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(bitmap, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, targetMime, quality),
    );
    if (!blob) {
      throw new Error(`Failed to encode "${file.name}" as ${format}`);
    }

    return new File([blob], withExtension(file.name, format === "jpeg" ? "jpg" : format), {
      type: targetMime,
      lastModified: file.lastModified,
    });
  } finally {
    if (!(bitmap instanceof HTMLImageElement)) bitmap.close();
  }
}
