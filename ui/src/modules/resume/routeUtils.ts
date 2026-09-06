import { type RJSFSchema, type UiSchema } from "@rjsf/utils";
import { TStringField } from "@fireback/virtual-entity-manager";

/** Strips `uniqueId` out of `schema` entirely - it's a server-assigned
 * identifier (gorm's AutoMigrate column default `gen_random_uuid()` on
 * every generated *Entity, e.g. TargetPositionEntity.go's own `UniqueId`
 * field), never something a create/edit form should ask the user to fill
 * in or let them change on an existing row. Every *Routes.tsx below applies
 * this to its own BASE_SCHEMA before any other patch.
 *
 * Safe regardless of where in this module's pipeline it runs:
 * withTStringFields/withXDateFields only ever touch the field names they're
 * explicitly given (never "uniqueId"), and the archive/single-view casts in
 * @fireback/virtual-entity-manager's schemaCasting.ts
 * (columnsFromSchema/fieldsFromSchema) already special-case/exclude
 * "uniqueId" themselves independently of what's in `schema.properties` - so
 * this only ever affects the create/edit form actually rendered from
 * `schema`, not the archive grid's own "Unique Id" column or the
 * single-view screen.
 */
export function withoutUniqueId(schema: RJSFSchema): RJSFSchema {
  const { uniqueId, ...properties } = (schema.properties as any) ?? {};
  return {
    ...schema,
    properties,
    required: (schema.required as string[] | undefined)?.filter(
      (key) => key !== "uniqueId",
    ),
  } as RJSFSchema;
}

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
 * `multilineFields` (a subset of `fields`) additionally sets
 * `"ui:options": { multiline: true }` on those - TStringField reads that via
 * rjsf's own getUiOptions and renders a `<textarea>` per locale instead of a
 * single-line `<input>` (see TStringField.tsx's own doc comment on the
 * `@fireback/virtual-entity-manager` side). Use it for actual free-text
 * prose (a summary/description), not short labels (a headline, a location).
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
  multilineFields: string[] = [],
): { schema: RJSFSchema; uiSchema: UiSchema } {
  const properties = { ...(schema.properties as any) };
  const uiSchema: UiSchema = {
    "ui:options": { label: false },
    "ui:description": "",
  };
  const multilineFieldSet = new Set(multilineFields);

  for (const field of fields) {
    if (!properties[field]) continue;
    properties[field] = {
      ...properties[field],
      type: "object",
      format: "tstring",
    };
    uiSchema[field] = multilineFieldSet.has(field)
      ? { "ui:field": "tstring", "ui:options": { multiline: true } }
      : { "ui:field": "tstring" };
  }

  return {
    schema: { ...schema, properties } as RJSFSchema,
    uiSchema,
  };
}

export const TSTRING_RJSF_FIELDS = { tstring: TStringField };

/** Patches `fields` on `schema` to `{ type: "string", format: "date" }` -
 * the shape rjsf's built-in date widget expects, and exactly what
 * ../../../nima/ui/src/modules/musicalwork/PersonRoutes.tsx's own
 * birthDate/deathDate patch does (see its comment for why: `complex: XDate`
 * comes through with no `type` at all, same gap as TString, but XDate really
 * is just a "YYYY-MM-DD" string on the wire - see complexes/XDateType.go -
 * so unlike TString it needs no custom field/widget, just the type/format
 * rjsf already knows how to render). No uiSchema fragment needed, unlike
 * withTStringFields.
 */
export function withXDateFields(schema: RJSFSchema, fields: string[]) {
  const properties = { ...(schema.properties as any) };

  for (const field of fields) {
    if (!properties[field]) continue;
    properties[field] = {
      ...properties[field],
      type: "string",
      format: "date",
    };
  }

  return { schema: { ...schema, properties } as RJSFSchema };
}

/** Generic beforeSetValues: normalizes every non-required property's `null`
 * to `undefined`. Every optional (`?`) scalar field's Go zero value
 * serializes as JSON `null` (never omitted), and ajv rejects `null` against
 * a `type: "string"`/etc. schema outright regardless of `required` (see
 * PersonRoutes.tsx's personBeforeSetValues, which hand-lists the same fix
 * per field) - this covers every entity's optional fields at once instead
 * of listing them by name per *Routes.tsx.
 *
 * `emptyStringFields` additionally normalizes `""` to `undefined` for the
 * listed fields, required or not - needed for optional XDate fields
 * specifically: their Go zero value is `""` (not `null`, unlike every other
 * optional scalar), and ajv's `format: "date"` rejects `""` outright too
 * (see PersonRoutes.tsx's personBeforeSetValues hitting the exact same
 * issue for birthDate/deathDate). Every other optional field's legitimate
 * empty string (e.g. an unset `website`) is left alone - only pass the
 * XDate fields here.
 */
export function stripNullOptionalValues(
  schema: RJSFSchema,
  emptyStringFields: string[] = [],
) {
  const required = new Set(schema.required ?? []);
  const properties = Object.keys((schema.properties as any) ?? {});
  const emptyStringFieldSet = new Set(emptyStringFields);

  return (data: Record<string, any>) => {
    const out = { ...data };
    for (const key of properties) {
      if (!required.has(key) && out[key] === null) {
        out[key] = undefined;
      }
      if (emptyStringFieldSet.has(key) && out[key] === "") {
        out[key] = undefined;
      }
    }
    return out;
  };
}
