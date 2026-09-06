/**
 * Front-end mirror of complexes.TString (modules/fireback/complexes/TString.go):
 * a locale -> text map, e.g. {"en": "Home", "fa": "خانه"}, JSON-marshaled as a flat
 * object. Shared by every place that edits or filters one - FormTString
 * (forms/form-tstring/FormTString.tsx) and DataGridList's "tstring" column filter
 * (data-grid-list/TStringFilterDrawer.tsx) - so they agree on the same shape instead
 * of each declaring their own `Record<string, string>` alias.
 */
export type TString = Record<string, string>;

// DefaultLocale mirrors complexes.TString's own Go constant (TString.go) - the locale
// getTStringValue falls back to before giving up and grabbing whatever's there.
const DEFAULT_LOCALE = "en";

/**
 * Resolves a TString down to a single display string for `locale`, mirroring
 * complexes.TString.Get exactly: `locale`, then DEFAULT_LOCALE ("en"), then
 * whichever locale happens to have a value, then "". Use this anywhere a TString
 * value (e.g. CapabilityDto.name/description) needs to render as plain text - a
 * bare `{value}` on an unresolved TString throws ("Objects are not valid as a
 * React child"), and `${value}` string-templates it into "[object Object]".
 */
export function getTStringValue(
  value: TString | null | undefined,
  locale: string,
): string {
  if (!value) {
    return "";
  }
  // A fetched TString field isn't always the plain {locale: value} record
  // this file's own `TString` type describes - an emi Dto setter for a
  // `complex: TString` field (see e.g. InstrumentOptionalDto's `name`)
  // wraps it in a real @fireback/complexes TString class instance instead,
  // whose data lives behind a private `values` field rather than as the
  // instance's own enumerable locale keys. Falling through to the
  // bracket/Object.values access below on one of those doesn't find the
  // locale keys and ends up handing back the whole private record object
  // instead of a string - which React then throws on ("Objects are not
  // valid as a React child") wherever this return value is rendered
  // directly (an archive column, GeneralEntityView, ...). Duck-typed
  // (`.get` being a function) rather than `instanceof` against that class,
  // since this package doesn't otherwise depend on @fireback/complexes.
  if (typeof (value as any).get === "function") {
    return (value as any).get(locale) ?? "";
  }
  if (value[locale]) {
    return value[locale];
  }
  if (value[DEFAULT_LOCALE]) {
    return value[DEFAULT_LOCALE];
  }
  const first = Object.values(value).find((v) => v);
  return first ?? "";
}
