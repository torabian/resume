import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { FormCheckbox } from "@fireback/ui-core/components/forms/form-switch/FormSwitch";
import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormTString } from "@fireback/ui-core/components/forms/form-tstring/FormTString";
import { createQuerySource } from "@fireback/ui-core/hooks/useAsQuery";
import type { TString } from "@fireback/ui-core/types/TString";
import type { EnumOptionsType, WidgetProps } from "@rjsf/utils";
import { useMemo } from "react";
import { EntityRelationWidget } from "./EntityRelationWidget";

/**
 * RJSF's default core theme renders every field with its own bare HTML
 * `<input>`/`<select>`, so a schema-driven form (this whole @fireback/jsf
 * package) looks nothing like a hand-built one using ui-core's own
 * FormText/FormCheckbox/FormSelect - different spacing, no shared
 * label/hint/error chrome (see BaseFormElement, which every one of those
 * already wraps itself in), different focus/invalid states.
 *
 * Rather than re-implementing that chrome, this file maps RJSF's widget
 * slots straight onto the real components: RJSF drives *what* field to show
 * (from the schema) via `<Form widgets={rjsfWidgets} />`, ui-core drives
 * *how* it looks - the same division every hand-built EditForm in this repo
 * already has between its Formik values and its FormX components. A field
 * rendered by a compiled schema is then visually and behaviourally
 * identical to one written by hand, and any future change to
 * BaseFormElement's own styling applies here for free too.
 *
 * Only text/number/checkbox/select are mapped - the widget kinds that
 * already have a direct ui-core equivalent. Anything else (arrays, nested
 * objects, the unconstrained any/complex/relation fields) still goes through
 * RJSF's own default rendering; see RjsfShowcaseDemo.tsx's own header
 * comment for why relation fields are left unconstrained in the first place.
 */

function errorMessage(rawErrors?: string[]): string | undefined {
  return rawErrors && rawErrors.length > 0 ? rawErrors.join(", ") : undefined;
}

function TextWidget(props: WidgetProps) {
  const { id, value, onChange, onBlur, onFocus, label, placeholder, disabled, readonly, rawErrors, schema, options } =
    props;

  let type: "text" | "password" | "email" = "text";
  if (schema.format === "email") {
    type = "email";
  } else if (options.inputType === "password") {
    type = "password";
  }

  return (
    <FormText
      id={id}
      label={label}
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      disabled={disabled || readonly}
      hint={schema.description}
      errorMessage={errorMessage(rawErrors)}
      onChange={(next) => onChange(next === "" ? undefined : next)}
      onBlur={() => onBlur(id, value)}
      onFocus={() => onFocus(id, value)}
    />
  );
}

function NumberWidget(props: WidgetProps) {
  const { id, value, onChange, onBlur, onFocus, label, placeholder, disabled, readonly, rawErrors, schema } = props;

  return (
    <FormText
      id={id}
      label={label}
      type="number"
      value={value ?? ""}
      placeholder={placeholder}
      disabled={disabled || readonly}
      hint={schema.description}
      errorMessage={errorMessage(rawErrors)}
      onChange={(next) => onChange(next === "" || Number.isNaN(next) ? undefined : next)}
      onBlur={() => onBlur(id, value)}
      onFocus={() => onFocus(id, value)}
    />
  );
}

function CheckboxWidget(props: WidgetProps) {
  const { id, value, onChange, label, disabled, readonly, rawErrors, schema } = props;

  return (
    <FormCheckbox
      id={id}
      label={label}
      value={!!value}
      disabled={disabled || readonly}
      hint={schema.description}
      errorMessage={errorMessage(rawErrors)}
      onChange={(next) => onChange(next)}
    />
  );
}

function SelectWidget(props: WidgetProps) {
  const { id, value, onChange, label, disabled, readonly, rawErrors, options, schema } = props;
  const enumOptions: EnumOptionsType[] = options.enumOptions ?? [];

  // FormSelect is built for entity/async lists (its `querySource` normally comes
  // from a react-query hook); createQuerySource(items) is ui-core's own adapter
  // for handing it a plain static array instead (the same helper hand-built
  // EditForms use for a fixed dropdown - see e.g. GsmProviderForm.tsx), so this
  // gets the exact same combobox the rest of the app uses for a fixed option
  // list, not a re-implementation of it.
  const querySource = useMemo(() => createQuerySource(enumOptions), [enumOptions]);
  const selected = enumOptions.find((option) => option.value === value) ?? null;

  return (
    <FormSelect
      id={id}
      label={label}
      value={selected}
      querySource={querySource}
      keyExtractor={(option: EnumOptionsType) => option.value}
      fnLabelFormat={(option: EnumOptionsType) => option.label}
      disabled={disabled || readonly}
      hint={schema.description}
      errorMessage={errorMessage(rawErrors)}
      onChange={(option: EnumOptionsType | null) => onChange(option ? option.value : undefined)}
    />
  );
}

// An Emi `complex` field (WidgetJson - see widget.go's own doc comment on
// WidgetOneRelation/WidgetJson) compiles to an unconstrained `{}` schema no
// matter which complex type it names: the compiler only ever sees
// `field.Complex != ""`, never which complex is actually behind it. So -
// same reasoning as EntityRelationWidget.tsx for `one`/`collection` - there
// is nothing in the compiled schema to auto-select this widget from; the
// consuming form has to opt a field into it explicitly via
// `ui:widget: "tstring"` (see RjsfShowcaseDemo.tsx's displayName field,
// `complex: TString` in the dto).
function TStringWidget(props: WidgetProps) {
  const { id, value, onChange, label, disabled, readonly, rawErrors, schema, options } = props;

  return (
    <FormTString
      id={id}
      label={label}
      value={(value as TString) ?? null}
      disabled={disabled || readonly}
      hint={schema.description}
      errorMessage={errorMessage(rawErrors)}
      // See FormTString.tsx's own doc comment - opt a field into a
      // multi-line editor with
      // `uiSchema: { <field>: { "ui:widget": "tstring", "ui:options": { multiline: true, rows: 5 } } }`.
      // Unlike TStringField.tsx (a rjsf Field, not a Widget), `options` here
      // is already the merged `ui:options`/`ui:<optionName>` rjsf hands every
      // widget - no getUiOptions call needed.
      multiline={options.multiline as boolean | undefined}
      rows={options.rows as number | undefined}
      onChange={(next) => onChange(next)}
    />
  );
}

/** Pass as `<Form widgets={rjsfWidgets} />`. */
export const rjsfWidgets = {
  TextWidget,
  EmailWidget: TextWidget,
  PasswordWidget: TextWidget,
  URLWidget: TextWidget,
  UpDownWidget: NumberWidget,
  RangeWidget: NumberWidget,
  CheckboxWidget,
  SelectWidget,
  // For Emi `one`/`collection` relation fields - see EntityRelationWidget.tsx
  // for why this one needs an explicit `ui:widget: "entityRelation"` +
  // `ui:options.querySource` from the consuming form instead of being
  // auto-selected from the schema like the widgets above.
  entityRelation: EntityRelationWidget,
  // For Emi `complex` fields - see TStringWidget's own doc comment above for
  // why this also needs an explicit `ui:widget: "tstring"` opt-in.
  tstring: TStringWidget,
};
