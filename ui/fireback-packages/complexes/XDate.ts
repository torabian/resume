/**
 * TypeScript counterpart of modules/fireback/complexes/XDateType.go.
 *
 * A calendar date with no time-of-day/timezone component: `type XDate
 * string`, MarshalJSON'd/UnmarshalJSON'd as a plain "YYYY-MM-DD" string (see
 * XDate.String()/MarshalJSON() there) - Go's FromString normalizes whatever
 * it's given (including a Persian/Iranian calendar date, when the parsed
 * year is < 1500) down to that same "2006-01-02" layout before it's ever
 * serialized. Mirrors TString.ts in this same package: a thin wrapper a
 * generated Dto setter can `new XDate(value)` unconditionally on anything
 * that isn't already an instance, tolerating every shape that setter might
 * hand it (a bare string off the wire, a real Date, another XDate, or
 * null/undefined for an unset value) instead of throwing.
 */

export type XDateInput = string | Date | XDate | null | undefined;

export class XDate {
  private value: string;

  constructor(input?: XDateInput) {
    this.value = XDate.toDateString(input);
  }

  /** Normalizes any accepted input shape into a "YYYY-MM-DD" string. */
  private static toDateString(input: XDateInput): string {
    if (input == null || input === "") {
      return "";
    }
    if (input instanceof XDate) {
      return input.value;
    }
    if (input instanceof Date) {
      return Number.isNaN(input.getTime())
        ? ""
        : input.toISOString().slice(0, 10);
    }
    // Already-formatted "YYYY-MM-DD" (what the API actually sends) passes
    // straight through - only reparsed as a last resort for anything else
    // (e.g. a full ISO timestamp), same fallback Go's own dateparse-backed
    // FromString applies server-side.
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return input;
    }
    const parsed = new Date(input);
    return Number.isNaN(parsed.getTime())
      ? String(input)
      : parsed.toISOString().slice(0, 10);
  }

  /** Same as `new XDate(input)`, useful in functional/pipe-style code. */
  static from(input: XDateInput): XDate {
    return new XDate(input);
  }

  /** The "YYYY-MM-DD" string, or "" if unset. */
  toDateString(): string {
    return this.value;
  }

  /** Parses the stored date string into a real Date, or null if unset/invalid. */
  toDate(): Date | null {
    if (!this.value) {
      return null;
    }
    const parsed = new Date(this.value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  isEmpty(): boolean {
    return this.value === "";
  }

  /** So JSON.stringify(entity) sends the same "YYYY-MM-DD" string as Go. */
  toJSON(): string {
    return this.value;
  }

  /** So template strings / string concatenation use the plain date string. */
  toString(): string {
    return this.value;
  }

  valueOf(): string {
    return this.value;
  }
}
