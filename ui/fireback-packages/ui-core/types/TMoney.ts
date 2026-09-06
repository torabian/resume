/**
 * Front-end mirror of complexes.TMoney (modules/fireback/complexes/TMoney.go):
 * a currency -> amount map, e.g. {"USD": 19.99, "EUR": 17.99}, JSON-marshaled
 * as a flat object. Shared by FormMoney (forms/form-money/FormMoney.tsx) and
 * anywhere else that edits or filters one, mirroring types/TString.ts exactly
 * (currency->amount instead of locale->text).
 */
export type TMoney = Record<string, number>;

// DefaultCurrency mirrors complexes.TMoney's own Go constant (TMoney.go) -
// the currency getTMoneyValue falls back to before giving up and grabbing
// whatever's there.
const DEFAULT_CURRENCY = "USD";

/**
 * Resolves a TMoney down to a single amount for `currency`, mirroring
 * complexes.TMoney.Get exactly: `currency`, then DEFAULT_CURRENCY ("USD"),
 * then whichever currency happens to have a price, then undefined. Use this
 * anywhere a TMoney value needs to render as a single price.
 */
export function getTMoneyValue(
  value: TMoney | null | undefined,
  currency: string,
): number | undefined {
  if (!value) {
    return undefined;
  }
  // A fetched TMoney field isn't always the plain {currency: amount} record
  // this file's own `TMoney` type describes - an emi Dto setter for a
  // `complex: TMoney` field wraps it in a real @fireback/complexes TMoney
  // class instance instead (see WalletProductDto.price's setter), whose
  // data lives behind a private `values` field rather than as the
  // instance's own enumerable currency keys - same duck-typed fallback
  // types/TString.ts's getTStringValue uses for the same reason.
  if (typeof (value as any).get === "function") {
    return (value as any).get(currency);
  }
  const code = currency.toUpperCase();
  if (value[code] != null) {
    return value[code];
  }
  if (value[DEFAULT_CURRENCY] != null) {
    return value[DEFAULT_CURRENCY];
  }
  return Object.values(value).find((v) => v != null);
}
