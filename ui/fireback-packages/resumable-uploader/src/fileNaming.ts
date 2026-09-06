/** Swaps a filename's extension, e.g. withExtension("clip.mov", "mp4") -> "clip.mp4". */
export function withExtension(filename: string, ext: string): string {
  const base = filename.replace(/\.[^./\\]+$/, "");
  return `${base}.${ext}`;
}

/** The filename's own extension, dot included (e.g. ".mov"), or "" if it has none. */
export function extname(filename: string): string {
  const match = /\.[^./\\]+$/.exec(filename);
  return match ? match[0] : "";
}
