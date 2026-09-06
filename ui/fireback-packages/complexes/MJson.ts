/**
 * TypeScript counterpart of modules/fireback/complexes/JsonDataType.go.
 *
 * Go's `type MJson json.RawMessage` is arbitrary raw JSON - whatever value
 * (object, array, string, number, boolean, null) a field holds, marshaled
 * through as-is. This wraps that same "any JSON value" shape, purely so a
 * generated Dto's `new MJson(value)` / `value instanceof MJson` (see e.g.
 * RoleDto.ts's capabilitiesListId, a `complex: MJson` field - every
 * generated complex field gets exactly this constructor/instanceof pair,
 * see TString.ts's own doc comment for the general pattern) has a real,
 * importable class to construct and check against.
 *
 * Named "MJson", not "JSON" - the Go type itself is plain `JSON`, but that
 * name collides with the browser/Node's own built-in `JSON` global the
 * instant anything in the same module scope needs `JSON.parse`/
 * `JSON.stringify` (a local `class JSON` shadows it silently, no compile
 * error, just very confusing runtime failures) - "MJson" avoids that
 * collision entirely, at both ends (this Go type's own name and this class).
 */

export type MJsonInput = unknown;

export class MJson {
  private data: unknown;

  constructor(input?: MJsonInput) {
    this.data = MJson.normalize(input);
  }

  private static normalize(input: MJsonInput): unknown {
    if (input === undefined) {
      return null;
    }
    if (input instanceof MJson) {
      return input.data;
    }
    if (typeof input === "string") {
      // Tolerates an already JSON-encoded string (the shape a CLI flag or
      // other raw-text source hands Go's own UnmarshalText) the same way an
      // already-parsed value passes straight through - falls back to the
      // literal string as-is if it isn't valid JSON, rather than throwing.
      try {
        return JSON.parse(input);
      } catch {
        return input;
      }
    }
    return input;
  }

  /** Same as `new MJson(input)`, useful in functional/pipe-style code. */
  static from(input: MJsonInput): MJson {
    return new MJson(input);
  }

  /** The wrapped value, as-is - an object, array, string, number, boolean, or null. */
  get(): unknown {
    return this.data;
  }

  isEmpty(): boolean {
    return this.data == null;
  }

  /** So JSON.stringify(entity) sends the same raw value Go's own MarshalJSON passes through. */
  toJSON(): unknown {
    return this.data;
  }

  toString(): string {
    try {
      return JSON.stringify(this.data) ?? "";
    } catch {
      return "";
    }
  }
}
