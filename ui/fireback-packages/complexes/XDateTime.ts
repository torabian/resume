/**
 * TypeScript counterpart of modules/fireback/complexes/XDateTimeType.go.
 *
 * XDateTime is XDate's sibling for a full date *and* time-of-day value:
 * `type XDateTime string`, MarshalJSON'd/UnmarshalJSON'd as a plain RFC3339
 * string (see XDateTime.String()/MarshalJSON() there), e.g.
 * "2024-01-15T10:30:00Z". Structured identically to XDate.ts on purpose -
 * same wrapped-string shape, same tolerant constructor, same
 * from/isEmpty/toJSON/toString/valueOf - just without truncating down to a
 * bare "YYYY-MM-DD" date, since XDateTime's whole reason to exist (unlike
 * XDate) is keeping the time-of-day component.
 */

export type XDateTimeInput = string | Date | XDateTime | null | undefined;

export class XDateTime {
  private value: string;

  constructor(input?: XDateTimeInput) {
    this.value = XDateTime.toDateTimeString(input);
  }

  /** Normalizes any accepted input shape into an RFC3339 string. */
  private static toDateTimeString(input: XDateTimeInput): string {
    if (input == null || input === "") {
      return "";
    }
    if (input instanceof XDateTime) {
      return input.value;
    }
    if (input instanceof Date) {
      return Number.isNaN(input.getTime()) ? "" : input.toISOString();
    }
    // Already a valid Date-parseable string (what the API actually sends,
    // and the common case for anything a caller hands in directly) passes
    // through re-parsed/re-serialized so it's always a real ISO string
    // rather than whatever exact format happened to be typed - same
    // fallback Go's own dateparse-backed XDateTimeFromString applies
    // server-side.
    const parsed = new Date(input);
    return Number.isNaN(parsed.getTime()) ? String(input) : parsed.toISOString();
  }

  /** Same as `new XDateTime(input)`, useful in functional/pipe-style code. */
  static from(input: XDateTimeInput): XDateTime {
    return new XDateTime(input);
  }

  /** Same as `new XDateTime()` (the current moment), spelled out for parity with Go's time.Now(). */
  static now(): XDateTime {
    return new XDateTime(new Date());
  }

  /** The RFC3339 string, or "" if unset. */
  toDateTimeString(): string {
    return this.value;
  }

  /** Parses the stored string into a real Date, or null if unset/invalid. */
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

  /** So JSON.stringify(entity) sends the same RFC3339 string as Go. */
  toJSON(): string {
    return this.value;
  }

  /** So template strings / string concatenation use the plain RFC3339 string. */
  toString(): string {
    return this.value;
  }

  valueOf(): string {
    return this.value;
  }
}
