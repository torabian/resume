/**
 * TypeScript counterpart of modules/abac/abaccomplexes/PlainTime.go.
 *
 * PlainTime is a genuine Go *alias* for time.Time (not a wrapper type - see
 * PlainTime.go's own doc comment on why), so on the wire it's exactly what a
 * plain time.Time serializes to: an RFC3339(Nano) timestamp string, e.g.
 * "2024-01-15T10:30:00.123456789Z". A real `Date` already parses and
 * stringifies that shape natively, so unlike TString/XDate/TMoney in this
 * same package (which each wrap a plain value), PlainTime just *is* a Date
 * subclass - every normal Date method (getTime, toLocaleString,
 * toISOString, ...) works on it as-is. The only addition is a tolerant
 * constructor accepting the same range of input shapes those other
 * complexes accept (a bare string/number off the wire, a real Date, another
 * PlainTime, or null/undefined for an unset value), so a generated Dto
 * setter can `new PlainTime(value)` unconditionally the same way it does
 * `new TString(value)`/`new XDate(value)`, instead of throwing on anything
 * that isn't already an instance.
 */

export type PlainTimeInput = string | number | Date | PlainTime | null | undefined;

export class PlainTime extends Date {
  constructor(input?: PlainTimeInput) {
    if (input == null || input === "") {
      // An "unset" PlainTime is an Invalid Date, the same way XDate.ts
      // represents an unset value as "" - Date's own toJSON() already
      // returns null for this rather than throwing or serializing garbage,
      // and isEmpty() below gives callers an explicit check instead of
      // making them reach for Number.isNaN(x.getTime()) themselves.
      super(NaN);
    } else if (input instanceof Date) {
      super(input.getTime());
    } else {
      super(input);
    }
  }

  /** Same as `new PlainTime(input)`, useful in functional/pipe-style code. */
  static from(input: PlainTimeInput): PlainTime {
    return new PlainTime(input);
  }

  /** Same as `new PlainTime()` (the current moment), spelled out for parity with Go's time.Now(). */
  static now(): PlainTime {
    return new PlainTime();
  }

  isEmpty(): boolean {
    return Number.isNaN(this.getTime());
  }

  // toJSON()/toString() are deliberately not overridden - Date.prototype's
  // own versions already do exactly the right thing here: toJSON() returns
  // this.toISOString() (or null for an invalid/unset date, never throws),
  // matching Go's time.Time MarshalJSON precisely; toString() gives the
  // usual human-readable Date representation.
}
