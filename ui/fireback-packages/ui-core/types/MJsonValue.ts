/**
 * Front-end mirror of complexes.MJson (modules/fireback/complexes/JsonDataType.go):
 * arbitrary raw JSON - an object, array, string, number, boolean, or null,
 * held as-is. Shared by every place that needs the raw value back out of a
 * `complex: MJson` Dto field (e.g. RoleDto.capabilitiesListId), mirroring
 * types/TString.ts's own getTStringValue for the same reason.
 */

/**
 * Unwraps a `complex: MJson` field down to the plain value it holds.
 *
 * A fetched field isn't always a bare value the way this file's own name
 * might suggest - an emi Dto setter for a `complex: MJson` field (see e.g.
 * RoleDto.capabilitiesListId) wraps it in a real @fireback/complexes MJson
 * class instance instead, whose data lives behind a private field rather
 * than being the value itself (Array.isArray/`typeof`/etc. checks against
 * the instance directly always fail, even when the value it's holding is
 * exactly the array/object/etc. being checked for). Duck-typed (`.get`
 * being a function) rather than `instanceof`, same reasoning as
 * getTStringValue: this package doesn't otherwise depend on
 * @fireback/complexes, and it tolerates a plain already-unwrapped value
 * (or null/undefined) passing straight through unchanged either way.
 */
export function getMJsonValue(value: unknown): unknown {
  if (value != null && typeof (value as any).get === "function") {
    return (value as any).get();
  }
  return value;
}
