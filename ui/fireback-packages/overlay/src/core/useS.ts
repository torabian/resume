/**
 * Locale-aware string picker.
 *
 * Mirrors the `useS` convention used across the rest of fireback's UI: a
 * translation object carries its default (English) strings as normal keys,
 * plus optional per-locale overrides nested under a `"$" + locale` key
 * (e.g. `{ close: "Close", $fr: { close: "Fermer" } }`). `useS` returns the
 * override object for the current locale when one exists, or the object
 * unchanged otherwise.
 *
 * This package's copy is a plain, stateless function rather than a hook
 * backed by app context/router/localStorage (unlike ui-core's `useS`,
 * which reads locale from `useLocale()`) so that:
 *  - it has zero dependencies beyond the object and locale you pass it,
 *  - it stays safe to publish standalone and use outside this monorepo,
 *  - it works identically whether bundled into the `core` or `dom` entry
 *    point (no shared React context to accidentally duplicate across
 *    bundles).
 *
 * The host app is expected to pass its own current locale (however it
 * tracks that) into `<OverlayProvider locale="...">`, which threads it down
 * to every overlay alongside `translations`.
 */
export function useS<T>(v: T, locale?: string): T {
  if (!locale || locale === "en") {
    return v;
  }
  const override = (v as any)["$" + locale];
  return override ? (override as T) : v;
}
