import type { RJSFValidationError, UiSchema } from "@rjsf/utils";

/**
 * RJSF picks which *Field* component renders a property (StringField,
 * ObjectField, ArrayField, ...) from `schema.type` alone, before it ever
 * looks at `uiSchema[...]['ui:widget']` - see @rjsf/core's own
 * SchemaField.js:getFieldComponent. A relation (`one`/`collection`) or
 * `complex` field's compiled schema is deliberately just `{title,
 * description}` with no `type` at all (formgen has no way to know its real
 * shape - see EntityRelationWidget.tsx/RjsfWidgets.tsx's TStringWidget), so
 * for those getFieldComponent finds no matching Field and falls back to
 * FallbackField/UnsupportedFieldTemplate - which never consults `ui:widget`
 * at all. The result: a field wired up with `ui:widget: "entityRelation"` (or
 * "tstring") simply doesn't render, silently, no error - `ui:widget` is
 * correct but never reached.
 *
 * (Array-typed relation fields, e.g. a `collection` field - already compiled
 * with `type: "array"` - don't hit this: ArrayField has its own explicit
 * `isCustomWidget(uiSchema)` check that already respects `ui:widget`
 * regardless of `items` being empty.)
 *
 * The fix: give a typeless field that opts into a custom widget a `type` -
 * `"string"` always works, since StringField (@rjsf/core's StringField.js)
 * unconditionally renders `getWidget(schema, uiOptions.widget, widgets)`,
 * with no further validation against the schema's actual shape. This is
 * purely a dispatch signal for RJSF's own Field selection - the field was
 * unconstrained before and stays exactly as unconstrained after (the type
 * is never used for AJV validation of anything beyond "is this JSON", so no
 * validation behavior actually changes), and the widget itself keeps
 * getting the same raw `value`/`onChange` it always did.
 *
 * Call after any other schema post-processing (e.g. resolveSchemaTranslations)
 * with the same `uiSchema` passed to `<Form>`, since it only patches fields
 * that `uiSchema` actually names.
 */
export function ensureDispatchableWidgetTypes(schema: any, uiSchema: UiSchema): any {
  if (!schema?.properties) {
    return schema;
  }

  const properties: Record<string, any> = { ...schema.properties };
  let changed = false;

  for (const key of Object.keys(uiSchema)) {
    const fieldUiSchema = uiSchema[key];
    if (!fieldUiSchema || typeof fieldUiSchema !== "object" || !("ui:widget" in fieldUiSchema)) {
      continue;
    }

    const property = properties[key];
    if (property && property.type === undefined) {
      properties[key] = { ...property, type: "string" };
      changed = true;
    }
  }

  return changed ? { ...schema, properties } : schema;
}

/**
 * Companion to ensureDispatchableWidgetTypes: strips the one category of AJV
 * error that patch can introduce - `type` errors on exactly the fields it
 * patched. A field ensureDispatchableWidgetTypes touches was unconstrained
 * (no `type` at all, so AJV imposed nothing) before the patch; giving it
 * `type: "string"` purely to reach a widget can now make AJV flag a
 * `displayName` (a TString - an *object*, `{en: "...", ...}`) as "must be
 * string", or a `null` `sponsorWallet` (nullable, no value picked yet) the
 * same way - a validation complaint about a constraint this dto never
 * actually declared. Every other error keeps flowing through untouched, so
 * pair with `translateValidationErrors` (or your own transformErrors), e.g.:
 *
 *   transformErrors={(errors) =>
 *     translateValidationErrors(dropSpuriousDispatchTypeErrors(errors, customWidgetUiSchema), locale)
 *   }
 */
export function dropSpuriousDispatchTypeErrors(
  errors: RJSFValidationError[],
  uiSchema: UiSchema,
): RJSFValidationError[] {
  const patchedFieldNames = new Set(Object.keys(uiSchema));

  return errors.filter((error) => {
    if (error.name !== "type") {
      return true;
    }
    const topLevelField = (error.property ?? "").replace(/^\./, "").split(/[.[]/)[0];
    return !patchedFieldNames.has(topLevelField);
  });
}
