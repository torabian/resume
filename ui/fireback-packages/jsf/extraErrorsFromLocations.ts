import type { ErrorSchema } from "@rjsf/utils";

/**
 * One field error the way a real fireback action actually returns it on a
 * failed request - `PublicFieldError` (modules/fireback/ferror/Error.go):
 * `location` a dotted/bracketed path exactly like the ones
 * CommonStructValidatorPointer/SliceValidator build server-side
 * ("fullName", "address.city", "emergencyContacts[0].phone", ...), `message`
 * already the text to show. This is the *server's* validation - checks a
 * compiled JSON Schema can't express at all (uniqueness, cross-field
 * business rules, ...) - not a duplicate of the client-side one
 * transformErrors/translateValidationErrors handles.
 */
export interface LocationError {
  location: string;
  message: string;
}

/** Splits a `location` string ("emergencyContacts[0].phone") into RJSF path segments (["emergencyContacts", 0, "phone"]). */
function parseLocation(location: string): (string | number)[] {
  return location
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean)
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));
}

/**
 * Converts a flat list of server field errors into the `ErrorSchema` shape
 * RJSF's `<Form extraErrors={...}>` expects - a tree keyed by property name
 * (array indices included), each leaf holding a `__errors: string[]`. This
 * is the exact same shape @rjsf/utils' own `toErrorSchema` builds from
 * client-side validation errors (see ErrorSchemaBuilder), so a server error
 * on `employment.company.headquarters.geo.lat` highlights that field - 4
 * levels of nesting deep - exactly the same way a client-side one would.
 *
 * Multiple errors on the same field append into the same `__errors` array
 * rather than overwriting each other.
 */
export function extraErrorsFromLocations(errors: LocationError[]): ErrorSchema {
  const root: any = {};

  for (const { location, message } of errors) {
    let node = root;
    const path = parseLocation(location);

    path.forEach((segment, index) => {
      const key = String(segment);
      node[key] ??= {};
      if (index === path.length - 1) {
        node[key].__errors = [...(node[key].__errors ?? []), message];
      } else {
        node = node[key];
      }
    });
  }

  return root;
}
