import {
  buttonId,
  canExpand,
  descriptionId,
  getTemplate,
  getUiOptions,
  titleId,
  type ObjectFieldTemplateProps,
} from "@rjsf/utils";

/**
 * A drop-in replacement for RJSF core's own ObjectFieldTemplate
 * (@rjsf/core/lib/components/templates/ObjectFieldTemplate.js), identical
 * except every level of object nesting below the root gets wrapped in a
 * `paddingInlineStart: 20px` div - so `employment.headquarters.geo.accuracy`
 * (4 levels deep) reads visually as 4 levels deep, each one indented 20px
 * further than its parent.
 *
 * `fieldPathId.path` is the field's full path from the root as a segment
 * array (`[]` for the root object itself, `['employment']`, `['employment',
 * 'headquarters']`, ...) - its length is exactly the nesting depth, with no
 * need to thread a depth counter through props by hand. This naturally
 * covers an array-of-objects item's own object fields too (e.g.
 * `employment.history[0]`, path `['employment', 'history', 0]`) since an
 * array item with an object schema goes through this same template.
 *
 * `paddingInlineStart` (not `paddingLeft`) so the indent grows from the
 * correct edge in both directions - the start edge in a Persian (RTL) form
 * is the *right*, matching every other direction-aware choice already made
 * in this package (see ArrayFieldItemTemplate.tsx's own doc comment).
 *
 * One more difference from upstream: when the object being rendered is one
 * item of an array (`fieldPathId.path`'s last segment is a numeric index -
 * e.g. `employment.history[0]`, `emergencyContacts[0]`), its own properties
 * lay out in a wrapping flex row instead of upstream's one-property-per-row
 * stack - a handful of short fields (year/role, name/phone/relationship)
 * reads far more like one record that way, and it's what "next to each
 * other, not a new row" for an array's item fields means in practice. A
 * top-level nested object (address, employment itself, ...) keeps the
 * one-per-row stack, since those mix short and long fields where forcing a
 * row would just wrap unpredictably.
 */
export function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  const {
    className,
    description,
    disabled,
    fieldPathId,
    formData,
    onAddProperty,
    optionalDataControl,
    properties,
    readonly,
    registry,
    required,
    schema,
    title,
    uiSchema,
  } = props;
  const options = getUiOptions(uiSchema);
  const TitleFieldTemplate = getTemplate("TitleFieldTemplate", registry, options);
  const DescriptionFieldTemplate = getTemplate("DescriptionFieldTemplate", registry, options);

  // For "pure union" schemas (oneOf/anyOf without properties), skip rendering the empty fieldset wrapper -
  // same as upstream.
  const isPureUnionSchema = (schema.oneOf || schema.anyOf) && !schema.properties && properties.length === 0;
  if (isPureUnionSchema) {
    return null;
  }

  const showOptionalDataControlInTitle = !readonly && !disabled;
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  const lastPathSegment = fieldPathId.path[fieldPathId.path.length - 1];
  const isArrayItem = typeof lastPathSegment === "number";

  const propertyContent = isArrayItem ? (
    <div className="d-flex flex-wrap" style={{ gap: "0 16px" }}>
      {properties.map((prop) => (
        <div key={prop.name} style={{ flex: "1 1 160px", minWidth: 0 }}>
          {prop.content}
        </div>
      ))}
    </div>
  ) : (
    properties.map((prop) => prop.content)
  );

  const fieldset = (
    <fieldset className={className} id={fieldPathId.$id}>
      {title && (
        <TitleFieldTemplate
          id={titleId(fieldPathId)}
          title={title}
          required={required}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
          optionalDataControl={showOptionalDataControlInTitle ? optionalDataControl : undefined}
        />
      )}
      {description && (
        <DescriptionFieldTemplate
          id={descriptionId(fieldPathId)}
          description={description}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      {!showOptionalDataControlInTitle ? optionalDataControl : undefined}
      {propertyContent}
      {canExpand(schema, uiSchema, formData) && (
        <AddButton
          id={buttonId(fieldPathId, "add")}
          className="rjsf-object-property-expand"
          onClick={onAddProperty}
          disabled={disabled || readonly}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
    </fieldset>
  );

  const depth = fieldPathId.path.length;
  return depth > 0 ? <div style={{ paddingInlineStart: 20 }}>{fieldset}</div> : fieldset;
}

export default ObjectFieldTemplate;
