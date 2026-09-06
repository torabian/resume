// rjsf field adapter for a `complex: TString` property (see
// @fireback/complexes/TString.ts / fireback-packages/ui-core/types/TString.ts) -
// a locale -> value map (e.g. { en: "Hello", fa: "سلام" }), not a plain string,
// so the default per-`type` rjsf field can't render it.
//
// Reuses the app's existing FormTString (fireback-packages/ui-core/components/
// forms/form-tstring/FormTString.tsx - the same modal editor used elsewhere for
// TString values) rather than a bespoke widget, so this stays visually and
// behaviorally consistent with every other TString field in the app.
//
// Register on a VirtualEntityManager via `rjsfFields={{ tstring: TStringField }}`
// and point the property at it with
// `uiSchema: { <field>: { "ui:field": "tstring" } }` - see ApplicationRoutes.tsx's
// person form for a real wiring. Schema type for that property should be
// `object` (a TString's actual wire shape), not `string`.
//
// `ui:field` replaces the schema-type-driven Field entirely (ObjectField, for
// `type: "object"`) - which is also what would otherwise render the title/
// description/required-asterisk, so this renders its own label from
// `schema.title` via FormTString's own `label` prop instead of relying on
// rjsf's default wrapping.
//
// Bug fix: onChange's 2nd argument is the field's own path, not optional -
// rjsf's Form.onChange (see @rjsf/core's Form.js) treats `''`/`[]` there as
// "set the *root* form data", not "this field". Passing `[]` replaced the
// entire Person form data with just this field's `{locale: value}` object on
// every name/bio edit - which looked like the whole form got wiped/
// resubmitted, since every other field vanished from Formik's values.
// `fieldPathId.path` is this field's actual path (e.g. ["name"]).
import { type FieldProps } from "@rjsf/utils";
import { FormTString } from "@fireback/ui-core/components/forms/form-tstring/FormTString";
import { type TString } from "@fireback/ui-core/types/TString";

export function TStringField({
  formData,
  onChange,
  disabled,
  required,
  schema,
  fieldPathId,
}: FieldProps<TString>) {
  const label = schema.title
    ? `${schema.title}${required ? " *" : ""}`
    : undefined;

  return (
    <FormTString
      label={label}
      hint={schema.description as string | undefined}
      value={formData}
      disabled={disabled}
      onChange={(value) => onChange(value, fieldPathId.path)}
    />
  );
}
