# @fireback/resumable-uploader

Standalone resumable file upload widget for React. It does not import from
`@fireback/ui-core` or any other fireback package - `npm install
@fireback/resumable-uploader` and use it in any React project. Dependency-free
besides `tus-js-client`, with one exception: `VideoUploader`'s optional
client-side quality conversion needs `@ffmpeg/ffmpeg` + `@ffmpeg/util`
installed separately (see [Video uploads with client-side quality
conversion](#video-uploads-with-client-side-quality-conversion) below) - skip
that if you only need `FileUploader`/`ImageUploader`.

Uses the [tus protocol](https://tus.io) for uploads, same as
`modules/storage/upload-test/index.js` in the fireback backend, which means
uploads survive page reloads and network drops - the server tracks how many
bytes it has already received, and the client resumes from that offset
instead of starting over.

## Install

```sh
npm install @fireback/resumable-uploader
```

## Building / publishing

```sh
npm run build   # tsup -> dist/index.{js,cjs,d.ts}
npm publish
```

## Files

- `types.ts` - `UploaderConfig`, `UploadItem`, `UploadTranslations`, etc.
- `translations.ts` - default English strings + `mergeTranslations()`.
- `fileValidation.ts` - accept-string / max-size / mime-type helpers.
- `UploaderConfigContext.tsx` - `UploaderConfigProvider` + `useUploaderConfig()`.
  Owns the upload queue and all tus `Upload` instances, and is the only place
  that talks to `tus-js-client`.
- `FilePreview.tsx` - renders an inline preview (image/video/audio/pdf/text/
  generic icon) for a freshly-picked local `File`.
- `FileUploader.tsx` - the component you actually render: drop zone, file
  picker, per-file progress/pause/resume/retry/remove/clear controls, and the
  "current file" row shown when reopening a form with an existing value.
- `ImageUploader.tsx` / `imageConversion.ts` - `FileUploader` specialized for
  images: rejects non-image files, and optionally re-encodes every picked
  image into a specific format via native Canvas APIs (no dependency). See
  [Image uploads with format conversion](#image-uploads-with-format-conversion).
- `VideoUploader.tsx` / `videoConversion.ts` - `FileUploader` specialized for
  video: rejects non-video files, and optionally re-encodes every picked
  video (format/resolution/quality) via `ffmpeg.wasm`, entirely client-side.
  See [Video uploads with client-side quality
  conversion](#video-uploads-with-client-side-quality-conversion).
- `resumable-uploader.css` - every style used by this feature, in one file.
  `FileUploader.tsx` and `FilePreview.tsx` import it as a side effect and only
  ever set `className`; the sections inside are commented with which
  component/element they belong to. The one exception is the progress bar's
  fill width, which is data (current upload progress) rather than a style
  choice - it's passed in via the `--ru-progress` CSS custom property instead
  of a hardcoded rule.

## Multiple fields, one provider

Several `<FileUploader>`s can share a single `<UploaderConfigProvider>` (one
form with a video field and a sheet field, say) - each instance auto-generates
a stable owner id via `useId()` and only ever shows/reacts to the items it
personally added, even though they all sit in the same shared upload queue:

```tsx
<UploaderConfigProvider config={uploaderConfig}>
  <FileUploader value={values.videoFileId} onChange={(id) => setFieldValue("videoFileId", id)} />
  <FileUploader value={values.sheetFileId} onChange={(id) => setFieldValue("sheetFileId", id)} />
</UploaderConfigProvider>
```

Only pass the `fieldKey` prop yourself if that exact widget needs to unmount
and remount elsewhere while picking back up its own in-progress upload -
`useId()`'s auto-generated id doesn't survive an unmount/remount, since
React assigns a fresh one each time the component instance is recreated.

## Basic usage

```tsx
import { UploaderConfigProvider, FileUploader } from "@fireback/resumable-uploader";

function Page() {
  return (
    <UploaderConfigProvider config={{ endpoint: "https://api.example.com/storage/files" }}>
      <FileUploader />
    </UploaderConfigProvider>
  );
}
```

Mount `UploaderConfigProvider` once, reasonably high in the tree. Its upload
queue lives in that provider's React state, not in `FileUploader` - as long as
the provider stays mounted, uploads keep running (and pausing/resuming on
connectivity changes) even if the `FileUploader` view showing them is
unmounted, e.g. the user navigates to another tab/route while a large file is
still uploading.

## Configuring the tus endpoint

The tus server URL is the one required config field:

```tsx
<UploaderConfigProvider config={{ endpoint: "https://api.example.com/storage/files" }}>
```

To point at a different environment, just pass a different `endpoint` -
nothing else needs to change. A few other request-shaping options:

```ts
interface UploaderConfig {
  endpoint: string;

  // Static headers, or a function (sync or async) re-evaluated before every
  // request - use the function form for auth tokens that can expire mid-upload.
  headers?: Record<string, string> | (() => Record<string, string> | Promise<Record<string, string>>);

  // Extra tus metadata sent with every upload, merged with { filename, filetype }.
  metadata?: Record<string, string>;

  chunkSize?: number;         // bytes per PATCH request
  retryDelays?: number[];     // defaults to [0, 1000, 3000, 5000, 10000]
}
```

Example with an auth header and workspace metadata (mirrors what
`DriveTools.tsx`'s `useFileUploader` does internally, but with zero
dependency on it):

```tsx
<UploaderConfigProvider
  config={{
    endpoint: "https://api.example.com/storage/files",
    headers: () => ({
      authorization: session.token,
      "workspace-id": selectedUrw?.workspaceId,
    }),
    metadata: { path: "/database/users" },
  }}
>
```

## File size limits and allowed types

Pass `validateFile` as a list of rules; the first rule whose
`mimeStartsWith` matches the picked file applies:

```ts
config.validateFile = [
  { mimeStartsWith: "image/", maxSize: 5 * 1024 * 1024 },   // images up to 5MB
  { mimeStartsWith: "video/", maxSize: 200 * 1024 * 1024 }, // videos up to 200MB
  { extension: ".pdf", maxSize: 20 * 1024 * 1024 },
];
```

- A file that fails validation is added to the list with `status: "error"`
  and a translated message (`fileTooLarge` / `fileTypeNotAllowed`) instead of
  being uploaded.
- The drop zone shows an upfront hint with the largest configured limit
  (`t.maxSizeLabel`, e.g. "Max file size: 200MB").
- Each row in the list shows that file's own size next to the limit that
  applies to it, e.g. `1,204 KB / 5MB max`.
- `validateFile` also drives the file picker's `accept` attribute.

If `validateFile` is omitted, any file/size is accepted.

## Previewing an existing value when a form reopens later

`FileUploader` only ever holds the original `File` object for uploads picked
*in the current session* - once a form is closed and reopened later, all you
have is whatever value you stored (the tus upload id/URL), not the file
itself. To still show a preview in that case, configure `getThumbnailUrl` and
pass the stored value in as `value`:

```tsx
<UploaderConfigProvider
  config={{
    endpoint: "https://api.example.com/storage/files",
    getThumbnailUrl: (uploadId) => `https://api.example.com/storage/thumbnail/${uploadId}`,
  }}
>
  <FileUploader
    value={record.avatarUploadId /* e.g. "a1b2c3d4e5" from a prior upload */}
    onChange={(file) => setRecord({ ...record, avatarUploadId: file?.id ?? null })}
  />
</UploaderConfigProvider>
```

`getThumbnailUrl` is expected to point at a backend endpoint that returns a
preview image for that id regardless of the original file's type (images,
generated video frame, PDF first page, etc.) - the component just renders
whatever image comes back, and falls back to a generic file icon if the
request fails (e.g. 404). It's fetched via `AuthenticatedThumbnail`
(`AuthenticatedThumbnail.tsx`) using the same `config.headers` the tus
uploads themselves use, rather than a plain `<img src>` - a plain `<img>`
can't attach an `Authorization` header, so it would 403 against a storage
module download URL for an owned (non-anonymous) upload. `getThumbnailUrl`
can point straight at an owned upload's URL without any extra plumbing.

`AuthenticatedThumbnail` is also exported standalone (`headers` as a plain
prop, no `<UploaderConfigProvider>` required) for anywhere else in an app
that needs to render an owned download behind a normal `<img>`-shaped
component - e.g. a read-only detail view showing a previously-uploaded
photo, with no upload widget on the page at all.

The "current file" row is shown whenever `value` is set and no file has been
picked yet in this session; as soon as a new file is picked (or dropped), it
is replaced by that file's own upload row/preview.

## Using it as a controlled form field (value / onChange / Clear)

This mirrors the `value`/`onChange` shape of `FormXFile.tsx`, without
depending on it:

```tsx
<FileUploader
  value={form.avatarUploadId}
  onChange={(file) => form.setAvatarUploadId(file?.id ?? null)}
/>
```

- `onChange(file)` fires once, automatically, when a picked file finishes
  uploading, with a `ComplexFile` - store `file.id` (a bare upload id, e.g.
  `"a1b2c3d4e5"`, extracted from the full upload URL tus hands back) if all
  the field needs is the id; `file` itself also carries `filesize`/
  `filename`/`mimeType`/`thumbnail` if the record wants to keep those too.
  `value` accepts either shape back - a bare id string (the common case) or
  a full upload URL - both resolve to the same `.id` internally.
- Every row then also gets a **Clear** button (in addition to **Remove**),
  which explicitly calls `onChange(null)` - use this to let the user
  deliberately blank out the field, as opposed to **Remove**, which just
  removes that entry from the visible queue/cancels its upload without
  touching the bound value.
- The **Replace** button on the "current file" row simply opens the file
  picker so a new upload can start over the existing value.

If you don't pass `onChange`, `FileUploader` still works as a plain
multi-file uploader (queue + progress only, no Clear button, no controlled
value).

## Image uploads with format conversion

`ImageUploader` renders exactly like `FileUploader` (same props, same
drop zone/queue/preview UI) but rejects any non-image file and, if
`convertBeforeUpload` is set, re-encodes every picked image into that format
first - e.g. normalizing arbitrary camera/screenshot formats (heic, png,
whatever) to a single jpg the backend always expects:

```tsx
import { UploaderConfigProvider, ImageUploader } from "@fireback/resumable-uploader";

<UploaderConfigProvider config={{ endpoint: "https://api.example.com/storage/files" }}>
  <ImageUploader
    convertBeforeUpload="jpg"
    // or the object form for finer control:
    // convertBeforeUpload={{ format: "webp", quality: 0.8 }}
    onChange={(file) => setFieldValue("photoUploadId", file?.id ?? null)}
  />
</UploaderConfigProvider>
```

- `convertBeforeUpload?: "jpg" | "jpeg" | "png" | "webp" | { format, quality? }`
  - `quality` is 0-1, only meaningful for the lossy formats (jpg/webp).
    Defaults to 0.92.
  - Omit it entirely to still get the image-only rejection with no
    conversion.
  - A file already in the target format is passed through unchanged - no
    pointless canvas round-trip.
- Conversion runs via the browser's own `<canvas>`/`Image`/`createImageBitmap`
  APIs - no dependency, works everywhere `FileUploader` does.
- A non-image file, or an image the browser can't decode/encode, shows up as
  a normal `status: "error"` item with the reason as `error` - same shape a
  `validateFile` failure produces.

## Video uploads with client-side quality conversion

`VideoUploader` is the same idea for video, but the actual re-encoding needs
a real video codec, which the browser doesn't expose natively - it uses
[`ffmpeg.wasm`](https://ffmpegwasm.netlify.app) (a WebAssembly build of
ffmpeg) to do it, running entirely in the user's browser. That's a
genuinely heavy piece of software (the core is tens of MB), so it is kept
**out** of this package's own dependency tree - install it yourself only if
you're actually using `VideoUploader`'s conversion:

```sh
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

They're declared as *optional* peer dependencies - `FileUploader`/
`ImageUploader`-only consumers never resolve, download, or bundle them
(`videoConversion.ts` only ever reaches them via a runtime `import()`, and
that only actually happens the first time a `<VideoUploader
convertBeforeUpload={...}>` really converts a file).

```tsx
import { UploaderConfigProvider, VideoUploader } from "@fireback/resumable-uploader";

<UploaderConfigProvider config={{ endpoint: "https://api.example.com/storage/files" }}>
  <VideoUploader
    convertBeforeUpload={{ format: "mp4", resolution: "720p", crf: 26 }}
    onChange={(file) => setFieldValue("videoUploadId", file?.id ?? null)}
  />
</UploaderConfigProvider>
```

- `convertBeforeUpload?: { format?: "mp4" | "webm"; resolution?: "2160p" | "1440p" | "1080p" | "720p" | "480p" | "360p"; crf?: number; audioBitrate?: string }`
  - `format` defaults to `"mp4"` (h264/aac); `"webm"` gets vp9/opus.
  - `resolution` caps the output height to that preset, scaling down only -
    a smaller source is never upscaled. Omit it to keep the source
    resolution.
  - `crf` is the encoder's own quality knob (lower = higher quality/bigger
    file; libx264 and libvpx-vp9 don't share a scale, so don't compare a
    number across formats). Defaults to 23 (mp4) / 32 (webm).
  - Omit `convertBeforeUpload` entirely to still get the video-only
    rejection with no conversion.
- While a file is converting, its row shows `status: "converting"` with a
  **real** progress percentage (from ffmpeg.wasm's own progress events) -
  this is not instant like image conversion. On the default single-threaded
  core, a sizeable clip can take anywhere from tens of seconds to several
  minutes, entirely CPU-bound (no hardware acceleration).
- A non-video file, a file ffmpeg can't decode, or an encoder failure shows
  up as a normal `status: "error"` item with the reason as `error`.

### Self-hosting ffmpeg-core (recommended beyond a demo)

By default `VideoUploader` loads `ffmpeg-core.js`/`ffmpeg-core.wasm` from
unpkg's CDN. For anything beyond trying this out, self-host those two files
(they ship inside `@ffmpeg/core`'s own `dist/umd` folder - copy them into
your app's static assets) and point at them instead:

```tsx
<VideoUploader
  convertBeforeUpload={{ format: "mp4" }}
  ffmpegCoreBaseURL="/assets/ffmpeg-core"
/>
```

Two independent reasons this matters in production: depending on a
third-party CDN being reachable on the critical path of a user-facing
conversion is a real availability risk, and some deployments' CSP won't
permit loading from unpkg at all. Only the *first* `VideoUploader` that
actually runs a conversion in a given page session's `ffmpegCoreBaseURL`
takes effect - the core, once loaded, is reused for every conversion after
that, so keep this consistent across every `VideoUploader` in the app.

### Single-threaded vs multi-threaded core

`VideoUploader` uses ffmpeg.wasm's regular single-threaded core, which works
anywhere with no special deployment requirements. ffmpeg.wasm also ships a
multi-threaded core (`@ffmpeg/core-mt`) that's substantially faster, but it
needs `SharedArrayBuffer`, which browsers only expose to a page whose
response carries:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

That's a deployment-wide header change (everything the page loads has to be
COEP-compatible too), not something this component can turn on by itself -
switching to it means pointing `ffmpegCoreBaseURL` at a self-hosted
`@ffmpeg/core-mt` build *and* making that header change together.

## Translations

All user-facing strings are configurable via `config.translations` (a
partial override merged over `defaultUploadTranslations`):

```ts
config.translations = {
  attachFile: "Ajouter un fichier",
  dropHere: "Déposez vos fichiers ici, ou cliquez pour parcourir",
  maxSizeLabel: (size) => `Taille max : ${size}`,
  fileTooLarge: (maxMB) => `Fichier trop volumineux. Taille max : ${maxMB}MB.`,
  // ...any subset of UploadTranslations
};
```

See `types.ts` for the full `UploadTranslations` shape.

## Pause / resume on connectivity loss

- The provider listens for the browser's `offline`/`online` events.
- On `offline`, every upload currently in flight is aborted (not canceled -
  its progress is preserved server-side) and marked `"offline-paused"`.
- On `online`, every `"offline-paused"` upload that the user didn't
  *manually* pause is automatically restarted on the same `tus-js-client`
  `Upload` instance, which resumes from the last acknowledged byte offset
  rather than re-uploading from scratch.
- Manual pause (`Pause` button) is tracked separately, so reconnecting won't
  override a pause the user chose deliberately - only `Resume` restarts it.
- Because the browser's default tus `urlStorage` persists upload URLs in
  `localStorage`, retrying the *same file* (e.g. via `Retry` after an error,
  or literally reloading the page and re-picking the same file) also resumes
  from where it left off rather than re-uploading.
