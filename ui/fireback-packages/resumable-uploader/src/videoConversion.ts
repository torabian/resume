// Video re-encoding via ffmpeg.wasm (https://ffmpegwasm.netlify.app). Unlike
// imageConversion.ts, there's no native browser API that does this - so
// `@ffmpeg/ffmpeg` and `@ffmpeg/util` are OPTIONAL peer dependencies of this
// package (see package.json), imported here only via dynamic import(). A
// consumer that never renders <VideoUploader> never downloads them; one that
// does must `npm install @ffmpeg/ffmpeg @ffmpeg/util` itself first - see this
// package's README for the full explanation of that trade-off (a real
// ffmpeg build is tens of MB, there's no way around installing it somewhere
// if the conversion is going to run in the browser at all).
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { extname, withExtension } from "./fileNaming";

export type VideoFormat = "mp4" | "webm";

/** Caps output height to this preset's pixels, scaling down only - never upscales a smaller source. */
const RESOLUTION_HEIGHT: Record<string, number> = {
  "2160p": 2160,
  "1440p": 1440,
  "1080p": 1080,
  "720p": 720,
  "480p": 480,
  "360p": 360,
};
export type VideoResolution = keyof typeof RESOLUTION_HEIGHT;

export interface ConvertVideoOptions {
  /** Output container/codec pair: mp4 (h264/aac) or webm (vp9/opus). Defaults to "mp4". */
  format?: VideoFormat;
  /** Caps the output height to this preset - omit to keep the source resolution. */
  resolution?: VideoResolution;
  /**
   * Encoder CRF (lower = higher quality/larger file; each codec has its own
   * scale, they are not comparable). Defaults to 23 for mp4 (libx264's own
   * default), 32 for webm (a reasonable libvpx-vp9 default - vp9 doesn't
   * default to a CRF at all).
   */
  crf?: number;
  /** Audio bitrate, e.g. "128k". Defaults to "128k". */
  audioBitrate?: string;
}

export interface FfmpegSourceConfig {
  /**
   * Directory containing ffmpeg-core.js and ffmpeg-core.wasm (trailing
   * slash optional). Defaults to unpkg's CDN build of the single-threaded
   * `@ffmpeg/core`. Self-host these two files (they ship in
   * `@ffmpeg/core`'s own `dist/umd`) and point here for anything beyond a
   * demo - depending on a public CDN for a ~25MB asset that's on the
   * critical path of a user-facing conversion isn't something to leave on
   * its default in production, and some deployments' CSP won't allow it at
   * all.
   */
  coreBaseURL?: string;
}

const DEFAULT_CORE_BASE_URL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";

// One ffmpeg-core load (the ~25MB download + wasm instantiation) is shared
// across every conversion for the life of the page, however many
// <VideoUploader>s or files are converted - loading it again per file (or
// per uploader instance) would be needlessly slow. Note this means whichever
// VideoUploader's conversion runs *first* decides the effective
// coreBaseURL for the whole page session; later, differently-configured
// instances just reuse the already-loaded core.
let ffmpegPromise: Promise<FFmpeg> | null = null;

async function getFfmpeg(source?: FfmpegSourceConfig): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
        import("@ffmpeg/ffmpeg"),
        import("@ffmpeg/util"),
      ]);
      const base = (source?.coreBaseURL ?? DEFAULT_CORE_BASE_URL).replace(/\/$/, "");
      const [coreURL, wasmURL] = await Promise.all([
        toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
        toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
      ]);
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({ coreURL, wasmURL });
      return ffmpeg;
    })().catch((err) => {
      // A failed load must not "stick" - the next conversion attempt (e.g.
      // after a transient network error, or the user fixing a bad
      // coreBaseURL) should retry the load instead of forever replaying the
      // same rejected promise.
      ffmpegPromise = null;
      throw err;
    });
  }
  return ffmpegPromise;
}

function codecArgs(format: VideoFormat, crf: number, audioBitrate: string): string[] {
  return format === "mp4"
    ? [
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", String(crf),
        "-pix_fmt", "yuv420p", // some source formats decode to a pixel format libx264 can't encode directly (e.g. 10-bit) - force back to the standard one
        "-c:a", "aac",
        "-b:a", audioBitrate,
        "-movflags", "+faststart", // moov atom up front, so the upload is playable while still streaming in rather than only after the very last byte
      ]
    : [
        "-c:v", "libvpx-vp9",
        "-crf", String(crf),
        "-b:v", "0", // "-crf N -b:v 0" is libvpx-vp9's own documented constant-quality mode; a nonzero -b:v would instead cap it to a target bitrate
        "-c:a", "libopus",
        "-b:a", audioBitrate,
      ];
}

/**
 * Re-encodes a video File via ffmpeg.wasm, running entirely in the browser -
 * see the module doc comment above for the `@ffmpeg/ffmpeg`/`@ffmpeg/util`
 * dependency this needs installed. Rejects (throws) for anything that isn't
 * a `video/*` file. Reports 0-100 progress via onProgress if given -
 * ffmpeg.wasm's progress is only accurate when the input and output have the
 * same duration, which re-encoding (as opposed to trimming) always does.
 */
export async function convertVideoFile(
  file: File,
  options: ConvertVideoOptions,
  onProgress?: (percent: number) => void,
  source?: FfmpegSourceConfig,
): Promise<File> {
  if (!file.type.startsWith("video/")) {
    throw new Error(`"${file.name}" is not a video file`);
  }

  const { format = "mp4", resolution, audioBitrate = "128k" } = options;
  const crf = options.crf ?? (format === "mp4" ? 23 : 32);

  const ffmpeg = await getFfmpeg(source);
  const { fetchFile } = await import("@ffmpeg/util");

  const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const inputName = `in-${unique}${extname(file.name) || ".mp4"}`;
  const outputName = `out-${unique}.${format}`;

  const onFfmpegProgress = ({ progress }: { progress: number }) => {
    // Transiently reports slightly outside [0, 1] right at the start/end -
    // clamp rather than pass that straight through to a progress bar.
    onProgress?.(Math.round(Math.min(1, Math.max(0, progress)) * 100));
  };
  ffmpeg.on("progress", onFfmpegProgress);

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    const args = ["-i", inputName];
    if (resolution) {
      // -2 keeps width even (required by most encoders) while preserving
      // aspect ratio; min(H,ih) caps the *height* to the preset without
      // ever scaling a smaller source up.
      args.push("-vf", `scale=-2:'min(${RESOLUTION_HEIGHT[resolution]},ih)'`);
    }
    args.push(...codecArgs(format, crf, audioBitrate), outputName);

    const exitCode = await ffmpeg.exec(args);
    if (exitCode !== 0) {
      throw new Error(`ffmpeg exited with code ${exitCode} while converting "${file.name}"`);
    }

    const data = await ffmpeg.readFile(outputName);
    // Re-wrapped through a fresh Uint8Array: readFile's return type allows
    // an ArrayBufferLike backing (SharedArrayBuffer, in the multi-threaded
    // core), which File's BlobPart doesn't accept directly.
    const bytes = new Uint8Array(
      typeof data === "string" ? new TextEncoder().encode(data) : data,
    );
    const mime = format === "mp4" ? "video/mp4" : "video/webm";

    return new File([bytes], withExtension(file.name, format), {
      type: mime,
      lastModified: file.lastModified,
    });
  } finally {
    ffmpeg.off("progress", onFfmpegProgress);
    // Best-effort cleanup of ffmpeg's in-memory FS - a failure here (e.g.
    // the file was never actually written before an earlier step threw)
    // shouldn't mask whatever error/result the caller is already getting.
    await Promise.allSettled([ffmpeg.deleteFile(inputName), ffmpeg.deleteFile(outputName)]);
  }
}
