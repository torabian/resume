import { type RJSFSchema } from "@rjsf/utils";
import { type DatatableColumn } from "@fireback/ui-core/types/DatatableColumn";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { type VirtualEntityManagerProps } from "./types";

export const defaultKeyExtractor = (m: any) => m?.uniqueId;

function schemaProperties(schema?: RJSFSchema): Array<[string, any]> {
  const props = (schema as any)?.properties;
  if (!props) return [];
  return Object.entries(props).filter(([key]) => key !== "uniqueId");
}

// e.g. "birthDate" -> "birth_date" - the default gorm naming strategy every
// emi entity's own DB columns follow, and so what ApplyQueryFilter/
// jsonlogic2sql expects a filter's field name to be (see DatatableColumn's
// own `filterKey` doc comment - UserColumns.tsx hand-writes this same
// conversion per column today, e.g. filterKey: "first_name").
function camelToSnakeCase(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

// Only a property whose value a backend filter can actually make sense of
// gets marked filterable - a plain string, an XDate (format: "date"), or a
// TString (format: "tstring", handled by its own per-language
// TStringFilterDrawer - see DatatableColumn's own doc comment). Everything
// else (nested objects, arrays, relations, ...) is left unfilterable rather
// than offering a text box no backend filter would understand.
function filterTypeForDef(def: any): DatatableColumn["filterType"] | undefined {
  if (def?.format === "tstring") return "tstring";
  if (def?.format === "date") return "date";
  if (def?.type === "string") return "string";
  return undefined;
}

// Objects that actually implement their own toString() (a TString instance,
// say - see @fireback/complexes/TString.ts's toString(), or any other class
// with one) should render as that, not a raw JSON dump - JSON.stringify is
// only the fallback for a plain object/array with nothing better, where
// toString() would otherwise fall through to Object.prototype's own useless
// "[object Object]" (an array's default toString joins its *elements'* own
// toString with commas, so an array of plain objects hits the same "[object
// Object]" problem one level down - checked with `includes`, not `===`, to
// catch that too).
function stringifyObject(value: object): string {
  const asString = String(value);
  if (!asString.includes("[object Object]")) {
    return asString;
  }
  return JSON.stringify(value);
}

// A field's JSON Schema `format` (the same slot `format: "date"` already
// uses for an XDate field - see ApplicationRoutes.tsx's PERSON_FORM_BASE_SCHEMA)
// doubles as a hint for which of these values need type-specific display
// logic instead of the generic object/array fallback below. "tstring" - a
// `complex: TString` field (@fireback/complexes/TString.ts, a locale ->
// value map) - is the only one so far: what the get/browse actions hand
// back is a *plain* `{locale: value}` object (JSON deserialized straight off
// the wire, not run through `new TString(...)`), so it has no `toString()`
// override of its own for stringifyObject below to find - resolving it
// needs the same locale-fallback lookup FormTString/TStringEditModal use
// (getTStringValue), not a generic string coercion.
function formatByFieldFormat(
  value: any,
  format: string | undefined,
  locale: string,
): string | undefined {
  if (format === "tstring" && value && typeof value === "object") {
    return getTStringValue(value, locale);
  }
  return undefined;
}

function formatCellValue(value: any, format: string | undefined, locale: string): any {
  if (value === undefined || value === null) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const byFormat = formatByFieldFormat(value, format, locale);
  if (byFormat !== undefined) return byFormat;
  if (typeof value === "object") return stringifyObject(value);
  return String(value);
}

// Unlike formatCellValue, leaves booleans/null/undefined untouched -
// GeneralEntityView already special-cases those (renders Yes/No/"is null"
// for them, see GeneralEntityView.tsx) and would double-render otherwise.
// Only objects/arrays (not valid as a raw React child) need coercing here.
export function formatFieldValue(
  value: any,
  format?: string,
  locale: string = "en",
): any {
  const byFormat = formatByFieldFormat(value, format, locale);
  if (byFormat !== undefined) return byFormat;
  if (value !== null && typeof value === "object") {
    return stringifyObject(value);
  }
  return value;
}

/** Casts a JSON Schema's root properties into archive DatatableColumns. */
export function columnsFromSchema(
  schema: RJSFSchema | undefined,
  locale: string,
): DatatableColumn[] {
  return [
    { name: "uniqueId", title: "Unique Id", width: 100 },
    ...schemaProperties(schema).map(([key, def]): DatatableColumn => {
      const filterType = filterTypeForDef(def);
      return {
        name: key,
        title: def?.title || key,
        width: 160,
        getCellValue: (row: any) => formatCellValue(row?.[key], def?.format, locale),
        ...(filterType
          ? { filterable: true, filterType, filterKey: camelToSnakeCase(key) }
          : {}),
      };
    }),
  ];
}

/** Casts a JSON Schema's root properties into GeneralEntityView fields. */
export function fieldsFromSchema(
  schema: RJSFSchema | undefined,
  fields: VirtualEntityManagerProps["fields"],
) {
  const list = fields ?? schemaProperties(schema).map(([key, def]) => ({
    key,
    label: def?.title || key,
    format: def?.format as string | undefined,
  }));

  return list.map(({ key, label, format }: any) => ({ key, label, format }));
}
