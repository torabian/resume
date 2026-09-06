import { type RJSFSchema, type UiSchema } from "@rjsf/utils";
import { TStringField } from "@/components/entity-manager/VirtualEntityManager/fields/TStringField";

// Shared helpers for every *Routes.tsx in this module (and
// ../materialized/), factoring out the schema-patching boilerplate
// ../../../nima/ui/src/modules/musicalwork/{Person,Instrument,MusicalWork}
// Routes.tsx each hand-roll per entity (see e.g. PersonRoutes.tsx's own
// comment on *why* this patch is needed: the emi js/json-schema compiler
// has no representation for `complex` fields - a `complex: TString`
// property comes through with no `type` at all, which rjsf can't render).
// Resume.emi.yml's own top-of-file note lists which fields on each entity
// are `complex: TString` - pass exactly that list here.

/** Patches `fields` on `schema` to `{ type: "object", format: "tstring" }`
 * (the shape TStringField/schemaCasting.ts expect - see PersonRoutes.tsx's
 * own PERSON_FORM_BASE_SCHEMA comment) and returns both the patched schema
 * and the matching uiSchema fragment (`{ [field]: { "ui:field": "tstring" } }`)
 * together, so a call site never has to keep the two lists in sync by hand.
 *
 * Deliberately does NOT touch `resume`/`company` relation (`one`/`one?`)
 * fields - those come through with no `type` either, but for a different
 * reason (they're OneNullable selectors, not TString), and are left
 * unpatched here the same way MusicalWorkRoutes.tsx leaves its own
 * `musicalContext: one?` field alone: VirtualEntityManager has no relation-
 * picker widget yet, so create/update through these generic forms can't
 * set a resume selector today - a known gap, not something this pass
 * solves. Every *Routes.tsx below still wires create/update, since Get/
 * Browse/single-view/delete all work fully regardless.
 */
export function withTStringFields(
  schema: RJSFSchema,
  fields: string[],
): { schema: RJSFSchema; uiSchema: UiSchema } {
  const properties = { ...(schema.properties as any) };
  const uiSchema: UiSchema = {
    "ui:options": { label: false },
    "ui:description": "",
  };

  for (const field of fields) {
    if (!properties[field]) continue;
    properties[field] = {
      ...properties[field],
      type: "object",
      format: "tstring",
    };
    uiSchema[field] = { "ui:field": "tstring" };
  }

  return {
    schema: { ...schema, properties } as RJSFSchema,
    uiSchema,
  };
}

export const TSTRING_RJSF_FIELDS = { tstring: TStringField };

/** Generic beforeSetValues: normalizes every non-required property's `null`
 * to `undefined`. Every optional (`?`) scalar field's Go zero value
 * serializes as JSON `null` (never omitted), and ajv rejects `null` against
 * a `type: "string"`/etc. schema outright regardless of `required` (see
 * PersonRoutes.tsx's personBeforeSetValues, which hand-lists the same fix
 * per field) - this covers every entity's optional fields at once instead
 * of listing them by name per *Routes.tsx.
 */
export function stripNullOptionalValues(schema: RJSFSchema) {
  const required = new Set(schema.required ?? []);
  const properties = Object.keys((schema.properties as any) ?? {});

  return (data: Record<string, any>) => {
    const out = { ...data };
    for (const key of properties) {
      if (!required.has(key) && out[key] === null) {
        out[key] = undefined;
      }
    }
    return out;
  };
}
