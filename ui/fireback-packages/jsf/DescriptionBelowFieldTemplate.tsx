import { getTemplate, getUiOptions, type FieldTemplateProps } from "@rjsf/utils";

/**
 * A drop-in replacement for RJSF core's own FieldTemplate
 * (@rjsf/core/lib/components/templates/FieldTemplate/FieldTemplate.js).
 *
 * Upstream always renders label, description, `children` (the actual input)
 * and errors as four separate pieces around whatever widget is in use. That
 * makes sense for RJSF's own bare `<input>` widgets, which render nothing but
 * the input itself - but RjsfWidgets.tsx's replacements for every leaf
 * scalar type (string/number/integer/boolean) are ui-core's own
 * FormText/FormCheckbox/FormSelect, and those already render their *own*
 * label, hint (fed the schema description - see RjsfWidgets.tsx) and error
 * text via BaseFormElement, to look like every hand-built EditForm in this
 * repo. Leaving this template's own label/description/errors in too would
 * just duplicate all three under/over the widget's own copy.
 *
 * So for exactly those leaf types this template renders `children` alone -
 * the widget is the whole field. Everything else (object/array groups,
 * relation/any/complex fields left to RJSF's own default rendering - see
 * RjsfShowcaseDemo.tsx) keeps the original four-piece layout, only
 * reordering description to after children instead of before it, since none
 * of those have a widget of their own to own that chrome.
 *
 * Pass via `<Form templates={{ FieldTemplate: DescriptionBelowFieldTemplate }} />`.
 */
// Copied verbatim from @rjsf/core's own FieldTemplate/Label.js (not part of
// @rjsf/core's public exports, so it can't just be imported) - the small
// <label>/required-asterisk markup FieldTemplate normally renders above the
// input.
function FieldLabel({ label, required, id }: { label?: string; required?: boolean; id: string }) {
  if (!label) {
    return null;
  }
  return (
    <label className="control-label" htmlFor={id}>
      {label}
      {required && <span className="required">*</span>}
    </label>
  );
}

const LEAF_SCHEMA_TYPES = new Set(["string", "number", "integer", "boolean"]);

export function DescriptionBelowFieldTemplate(props: FieldTemplateProps) {
  const { id, label, children, errors, help, description, hidden, required, displayLabel, registry, uiSchema, schema } =
    props;
  const uiOptions = getUiOptions(uiSchema);
  const WrapIfAdditionalTemplate = getTemplate("WrapIfAdditionalTemplate", registry, uiOptions);

  if (hidden) {
    return <div className="hidden">{children}</div>;
  }

  // A leaf scalar always goes through one of RjsfWidgets.tsx's ui-core-backed
  // widgets (TextWidget/NumberWidget/CheckboxWidget/SelectWidget), which
  // already render their own label/hint/error - see this file's own doc
  // comment.
  if (typeof schema.type === "string" && LEAF_SCHEMA_TYPES.has(schema.type)) {
    return <WrapIfAdditionalTemplate {...props}>{children}</WrapIfAdditionalTemplate>;
  }

  const isCheckbox = uiOptions.widget === "checkbox";

  return (
    <WrapIfAdditionalTemplate {...props}>
      {displayLabel && !isCheckbox && <FieldLabel label={label} required={required} id={id} />}
      {children}
      {displayLabel && description ? description : null}
      {errors}
      {help}
    </WrapIfAdditionalTemplate>
  );
}

export default DescriptionBelowFieldTemplate;
