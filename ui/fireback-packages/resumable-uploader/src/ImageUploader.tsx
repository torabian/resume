import type { ComponentProps } from "react";
import { FileUploader } from "./FileUploader";
import { convertImageFile } from "./imageConversion";
import type { ConvertBeforeUpload } from "./imageConversion";
import { createKindPreviewer } from "./Previewer";

// Built once - createKindPreviewer's own result never depends on anything
// per-call, and every ImageUploader instance can share the same component.
const imagePreviewer = createKindPreviewer("image");

export interface ImageUploaderProps
  extends Omit<ComponentProps<typeof FileUploader>, "beforeUpload"> {
  /**
   * Re-encodes every picked/dropped image into this format before it's
   * queued for upload, e.g. convertBeforeUpload="jpg" to normalize
   * arbitrary camera/screenshot formats to a single format the backend
   * always expects, or convertBeforeUpload={{ format: "webp", quality: 0.8 }}
   * for finer control. Leave unset to upload images as picked, unconverted.
   */
  convertBeforeUpload?: ConvertBeforeUpload;
}

/**
 * FileUploader specialized for images: rejects any non-image file (as an
 * "error" item, same as a validateFile failure) regardless of whether
 * convertBeforeUpload is set, and optionally re-encodes every accepted
 * image into a specific format first via convertBeforeUpload.
 *
 * Defaults `previewer` to one that always previews an existing/stored value
 * as an image (see createKindPreviewer) rather than sniffing its mimeType -
 * a value read back from a typical backend often only carries the stored
 * file id, no mimeType, which the generic mimeType-sniffing default
 * (DefaultPreviewer) has nothing to go on after a page refresh even though
 * this field can only ever hold an image anyway. Still overridable by
 * passing your own `previewer`.
 *
 * Must still be rendered inside an <UploaderConfigProvider> - it only adds
 * the image-only + convert + preview behavior on top of FileUploader, it
 * doesn't replace the shared endpoint/headers/etc. configuration.
 */
export function ImageUploader({
  convertBeforeUpload,
  previewer = imagePreviewer,
  ...props
}: ImageUploaderProps) {
  const beforeUpload = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/")) {
      throw new Error(`"${file.name}" is not an image file`);
    }
    return convertBeforeUpload
      ? convertImageFile(file, convertBeforeUpload)
      : file;
  };

  return (
    <FileUploader {...props} beforeUpload={beforeUpload} previewer={previewer} />
  );
}
