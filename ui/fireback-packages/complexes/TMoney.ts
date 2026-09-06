/**
 * TypeScript counterpart of modules/fireback/complexes/TMoney.go.
 *
 * A "multi-currency price": a currency -> amount map, e.g.
 * { USD: 19.99, EUR: 17.99, IRR: 500000 }, serialized to/from the API as
 * either that object or, if the caller doesn't care about multiple
 * currencies, a bare number - which is always read as DEFAULT_CURRENCY's
 * amount. Amounts are the currency's own major unit (dollars, not cents),
 * mirroring the Go side exactly. This mirrors TString.ts's shape/API 1:1,
 * just currency->amount instead of locale->text.
 */

export const DEFAULT_CURRENCY = "USD";

export type TMoneyInput =
  | number
  | Record<string, number>
  | TMoney
  | null
  | undefined;

export class TMoney {
  private values: Record<string, number>;

  constructor(input?: TMoneyInput) {
    this.values = TMoney.toRecord(input);
  }

  /** Normalizes any accepted input shape into a plain currency->amount record. */
  private static toRecord(input: TMoneyInput): Record<string, number> {
    if (input == null) {
      return {};
    }
    if (typeof input === "number") {
      return { [DEFAULT_CURRENCY]: input };
    }
    if (input instanceof TMoney) {
      return { ...input.values };
    }
    const normalized: Record<string, number> = {};
    for (const [currency, amount] of Object.entries(input)) {
      normalized[currency.toUpperCase()] = amount;
    }
    return normalized;
  }

  /** Same as `new TMoney(input)`, useful in functional/pipe-style code. */
  static from(input: TMoneyInput): TMoney {
    return new TMoney(input);
  }

  /**
   * Returns the amount for `currency`, falling back to DEFAULT_CURRENCY,
   * then to any single value present, then undefined.
   */
  get(currency: string = DEFAULT_CURRENCY): number | undefined {
    const code = currency.toUpperCase();
    if (code in this.values) {
      return this.values[code];
    }
    if (DEFAULT_CURRENCY in this.values) {
      return this.values[DEFAULT_CURRENCY];
    }
    return Object.values(this.values)[0];
  }

  /** Sets currency's amount and returns `this`, so calls can be chained. */
  set(currency: string, amount: number): this {
    this.values[currency.toUpperCase()] = amount;
    return this;
  }

  has(currency: string): boolean {
    return currency.toUpperCase() in this.values;
  }

  /** Every currency code that currently has an amount set. */
  currencies(): string[] {
    return Object.keys(this.values);
  }

  /** Same shape TMoney.Go's Value()/MarshalJSON produce - a plain object. */
  toRecord(): Record<string, number> {
    return { ...this.values };
  }

  /** So JSON.stringify(entity) sends the same {currency: amount} shape as Go. */
  toJSON(): Record<string, number> {
    return this.toRecord();
  }

  /** Locale-aware "<amount> <currency-symbol>" display, e.g. "19.99 $". */
  format(currency: string = DEFAULT_CURRENCY, locale = "en-US"): string {
    const amount = this.get(currency);
    if (amount === undefined) return "";
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(amount);
    } catch {
      return `${amount} ${currency.toUpperCase()}`;
    }
  }

  toString(): string {
    return this.format(DEFAULT_CURRENCY);
  }

  isEmpty(): boolean {
    return Object.keys(this.values).length === 0;
  }
}
