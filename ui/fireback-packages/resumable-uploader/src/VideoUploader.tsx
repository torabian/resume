import type { ComponentProps } from "react";
import { FileUploader } from "./FileUploader";
import { convertVideoFile } from "./videoConversion";
import type { ConvertVideoOptions, FfmpegSourceConfig } from "./videoConversion";
import { createKindPreviewer } from "./Previewer";

// Built once - createKindPreviewer's own result never depends on anything
// per-call, and every VideoUploader instance can share the same component.
const videoPreviewer = createKindPreviewer("video");

export interface VideoUploaderProps
  extends Omit<ComponentProps<typeof FileUploader>, "beforeUpload"> {
  /**
   * Re-encodes every picked/dropped video via ffmpeg.wasm before it's
   * queued for upload - format/resolution/quality, e.g.
   * convertBeforeUpload={{ format: "mp4", resolution: "720p", crf: 26 }}.
   * Leave unset to upload videos as picked, unconverted (still video-only
   * enforced regardless of whether this is set).
   *
   * Requires `@ffmpeg/ffmpeg` and `@ffmpeg/util` to be installed - these are
   * optional peer dependencies of this package specifically so that
   * FileUploader/ImageUploader-only consumers never pay for ffmpeg-core's
   * ~25MB download. See this package's README for the full explanation,
   * including why the single-threaded core (the one used by default) is
   * noticeably slower than a native/server encoder but needs no special
   * response headers, unlike the faster multi-threaded core.
   */
  convertBeforeUpload?: ConvertVideoOptions;
  /**
   * Where to load ffmpeg-core.js/.wasm from. Defaults to unpkg's CDN build -
   * fine for a demo, but self-host these two files (they ship inside
   * `@ffmpeg/core`'s own `dist/umd`) and point here for production, both to
   * not depend on a third-party CDN being up on the critical path of a
   * user-facing conversion and because some deployments' CSP won't allow
   * loading from unpkg at all. Only the first VideoUploader to actually run
   * a conversion in a given page session's setting takes effect - ffmpeg-
   * core, once loaded, is reused for every conversion after that.
   */
  ffmpegCoreBaseURL?: string;
}

/**
 * FileUploader specialized for video: rejects any non-video file (as an
 * "error" item, same as a validateFile failure), and optionally re-encodes
 * every accepted video into a specific format/resolution/quality first via
 * convertBeforeUpload, entirely client-side via ffmpeg.wasm. The item shows
 * status "converting" (with a real percentage, from ffmpeg.wasm's own
 * progress events) for however long that takes - it can be anywhere from a
 * few seconds to several minutes for a large clip on the single-threaded
 * core, so there is always something on screen for that whole span.
 *
 * Defaults `previewer` to one that always previews an existing/stored value
 * as a video (see createKindPreviewer) rather than sniffing its mimeType -
 * a value read back from a typical backend often only carries the stored
 * file id, no mimeType, which the generic mimeType-sniffing default
 * (DefaultPreviewer) has nothing to go on after a page refresh even though
 * this field can only ever hold a video anyway. Still overridable by
 * passing your own `previewer`.
 *
 * Must still be rendered inside an <UploaderConfigProvider> - it only adds
 * the video-only + convert + preview behavior on top of FileUploader, it
 * doesn't replace the shared endpoint/headers/etc. configuration.
 */
export function VideoUploader({
  convertBeforeUpload,
  ffmpegCoreBaseURL,
  previewer = videoPreviewer,
  ...props
}: VideoUploaderProps) {
  const beforeUpload = async (
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<File> => {
    if (!file.type.startsWith("video/")) {
      throw new Error(`"${file.name}" is not a video file`);
    }
    if (!convertBeforeUpload) return file;

    const source: FfmpegSourceConfig | undefined = ffmpegCoreBaseURL
      ? { coreBaseURL: ffmpegCoreBaseURL }
      : undefined;
    return convertVideoFile(file, convertBeforeUpload, onProgress, source);
  };

  return (
    <FileUploader {...props} beforeUpload={beforeUpload} previewer={previewer} />
  );
}
