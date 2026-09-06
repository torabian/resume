import { type RJSFSchema } from "@rjsf/utils";

// emi's `js:module --tags json-schema` compiler emits each Dto's
// `static JsonSchema` with every title/description already replaced by a
// stable translation *key* (root: "$title"/"$description"; a field: its
// snake_cased name + "_title"/"_description"; nested - "_properties_<child>",
// "_items_properties_<child>", "_enum_<value>" - see emi's
// lib/formgen/jsonschema.go, BuildJSONSchemaWithTranslationKeys' own doc
// comment), plus a same-shaped `static DefaultTranslations` mapping each key
// back to the real (English) text. Older emi output instead baked literal
// English text straight into JsonSchema and shipped a separate
// `SchemaLocales.default` bucket alongside it - a format the compiler no
// longer produces (the emission was dropped from
// lib/js/js-common-object-class.go without any consumer migration, which is
// exactly what broke this at runtime: every *Routes.tsx below used to read
// `XDto.SchemaLocales.default`, which no longer exists on any generated Dto,
// so `.default` threw "Cannot read properties of undefined").
//
// This resolves a key-based schema against a translations map instead:
// `translations` for the default locale is `XDto.DefaultTranslations` (needs
// no hand-authoring - it's a straight mirror of the entity's own field
// `description:`), with a hand-maintained locale bucket (e.g. `fa`, using the
// exact same key scheme) spread over it for locales emi has no way to
// translate on its own. Walks the *whole* schema tree - not just top-level
// properties - and replaces any string sitting in a `title`/`description`
// slot with `translations[thatString]` when the key exists there, leaving it
// untouched otherwise (so a schema can be localized incrementally, one
// key/locale at a time, and nothing needs its own nesting-aware unwrapping:
// whatever the compiler's key scheme produces already lines up 1:1 with
// where `title`/`description` actually sit in the schema, including array
// `items` and `oneOf` enum options).
export function localizeSchema(
  schema: RJSFSchema,
  translations: Record<string, string>,
): RJSFSchema {
  if (!translations) return schema;
  return resolveTranslationKeys(schema, translations);
}

function resolveTranslationKeys(
  node: unknown,
  translations: Record<string, string>,
): any {
  if (Array.isArray(node)) {
    return node.map((item) => resolveTranslationKeys(item, translations));
  }
  if (node && typeof node === "object") {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(node)) {
      if (
        (key === "title" || key === "description") &&
        typeof value === "string" &&
        Object.prototype.hasOwnProperty.call(translations, value)
      ) {
        result[key] = translations[value];
      } else {
        result[key] = resolveTranslationKeys(value, translations);
      }
    }
    return result;
  }
  return node;
}
