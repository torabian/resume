/**
 * Walks a JSON Schema compiled with translation keys - emi's
 * `formgen.BuildJSONSchemaWithTranslationKeys`, embedded as `static
 * JsonSchema` on a dto class compiled with `--tags json-schema` (see e.g.
 * generated/RjsfShowcaseDto.ts) - and resolves every title/description/
 * enum-option string through `translations`: the dto class's own `static
 * DefaultTranslations` for its source language, or a translated counterpart
 * with the exact same keys (typed `{Dto}Translations`, so TypeScript flags a
 * translation missing a key) for any other locale.
 *
 * Key naming (see lib/formgen/jsonschema.go's own doc comment in the emi
 * repo): "$title"/"$description" for the schema root, "<field>.title"/
 * "<field>.description" for a top-level field, ".properties.<child>"
 * appended per level into a nested object, ".items.properties.<child>" into
 * an array item's own field, ".enum.<value>" per enum option - each key
 * reconstructable just by reading the compiled schema's own shape.
 *
 * A key with no matching entry in `translations` is left exactly as it is
 * (the raw key string, not blanked out) rather than throwing - lets a
 * caller resolve against a partial/in-progress translation without the
 * whole form breaking, at the cost of a literal key showing as a label
 * until that entry is filled in.
 */
export function resolveSchemaTranslations(node: any, translations: Record<string, string>): any {
  if (!node || typeof node !== "object") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((item) => resolveSchemaTranslations(item, translations));
  }

  const resolved: any = { ...node };

  if (typeof resolved.title === "string" && translations[resolved.title] !== undefined) {
    resolved.title = translations[resolved.title];
  }
  if (typeof resolved.description === "string" && translations[resolved.description] !== undefined) {
    resolved.description = translations[resolved.description];
  }

  if (Array.isArray(resolved.oneOf)) {
    resolved.oneOf = resolved.oneOf.map((option: any) =>
      option && typeof option.title === "string" && translations[option.title] !== undefined
        ? { ...option, title: translations[option.title] }
        : option,
    );
  }

  if (resolved.properties && typeof resolved.properties === "object") {
    resolved.properties = Object.fromEntries(
      Object.entries(resolved.properties).map(([key, value]) => [
        key,
        resolveSchemaTranslations(value, translations),
      ]),
    );
  }

  if (resolved.items) {
    resolved.items = resolveSchemaTranslations(resolved.items, translations);
  }

  if (resolved.additionalProperties && typeof resolved.additionalProperties === "object") {
    resolved.additionalProperties = resolveSchemaTranslations(resolved.additionalProperties, translations);
  }

  return resolved;
}

export default resolveSchemaTranslations;
