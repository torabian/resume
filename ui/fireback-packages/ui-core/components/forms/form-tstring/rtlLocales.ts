// Shared by FormTString.tsx (the closed preview) and TStringEditModal.tsx
// (the per-locale edit fields) - a TString value holds several languages'
// text at once (that's the whole point of it being a locale->value map, not
// one plain string), so each locale's own text needs its own natural
// writing direction regardless of whatever direction the rest of the
// app/page happens to be in right now. Two locales in this app write
// right-to-left; extend this list if more are ever added.
export const RTL_LOCALES = ["fa", "ar"];

export function localeDir(locale: string): "rtl" | "ltr" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}
