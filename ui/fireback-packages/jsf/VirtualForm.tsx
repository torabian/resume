import Form, { type FormProps } from "@rjsf/core";
import type { ErrorSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { useMemo, type ReactNode } from "react";
import { ArrayFieldItemTemplate } from "./ArrayFieldItemTemplate";
import { labelledButtonTemplates } from "./ButtonTemplates";
import { DescriptionBelowFieldTemplate } from "./DescriptionBelowFieldTemplate";
import { dropSpuriousDispatchTypeErrors, ensureDispatchableWidgetTypes } from "./ensureDispatchableWidgetTypes";
import { makeTranslateString, translateValidationErrors } from "./locales/rjsfShowcaseFormLocales";
import type { SupportedLocale } from "./locales/rjsfShowcaseLocales";
import { ObjectFieldTemplate } from "./ObjectFieldTemplate";
import { rjsfWidgets } from "./RjsfWidgets";

// Everything VirtualForm already decides for the caller - the rest of
// @rjsf/core's own FormProps (id, className, disabled, readonly, onSubmit,
// onError, onBlur, onFocus, formContext, omitExtraData, idPrefix, ...) is
// still available, spread straight through - see VirtualFormProps/`...rest`
// below.
type OwnedFormProps =
  | "schema"
  | "uiSchema"
  | "formData"
  | "onChange"
  | "extraErrors"
  | "validator"
  | "templates"
  | "widgets"
  | "translateString"
  | "transformErrors"
  | "liveValidate"
  | "noHtml5Validate"
  | "children";

export interface VirtualFormProps extends Omit<FormProps<any, any, any>, OwnedFormProps> {
  /** A compiled JSON Schema (typically `emi js:rjsf` output) - already locale-overlaid by the caller if needed, see e.g. RjsfShowcaseDemo.tsx's own localizeSchema call. */
  schema: any;
  /**
   * Field-level wiring the schema alone can't carry - `ui:widget`/`ui:options` for relation
   * (`one`/`collection`) and `complex` fields in particular; see EntityRelationWidget.tsx and
   * RjsfWidgets.tsx's TStringWidget for why those need it. VirtualForm patches the schema for
   * dispatch (ensureDispatchableWidgetTypes) and strips the resulting spurious `type` errors
   * (dropSpuriousDispatchTypeErrors) using this same value, so it only has to be supplied once.
   */
  uiSchema?: UiSchema;
  formData: any;
  onChange: (formData: any) => void;
  /** Server-side field errors already in RJSF's ErrorSchema shape - see extraErrorsFromLocations.ts to build one from a flat backend error list. */
  extraErrors?: ErrorSchema;
  /** Selects both RJSF's own built-in chrome text (Add/Remove/Move buttons, the "Errors" heading, ...) and ajv validation message wording - see rjsfShowcaseFormLocales.ts. */
  locale: SupportedLocale;
  /** Rendered where RJSF would otherwise put its own default Submit button - omit to render nothing (the common case: the host page supplies its own submit control, driven by its own `formData`/`onChange` state, same as RjsfShowcaseDemo.tsx's "Simulate POST" button). */
  children?: ReactNode;
}

/**
 * The reusable half of what RjsfShowcaseDemo.tsx used to wire up inline
 * every time: every @fireback/jsf template/widget/error-translation piece
 * (DescriptionBelowFieldTemplate, ObjectFieldTemplate,
 * ArrayFieldItemTemplate, labelledButtonTemplates, rjsfWidgets,
 * translateString, transformErrors, ensureDispatchableWidgetTypes,
 * dropSpuriousDispatchTypeErrors) bundled behind one component, so any page
 * that wants "a JSON Schema rendered to look and behave like this repo's own
 * FormText/FormSelect/FormCheckbox forms, in EN/FA/PL" just supplies
 * `schema`/`uiSchema` and a controlled `formData`/`onChange` - the same
 * division a hand-built EditForm already has between Formik and its FormX
 * components (see RjsfWidgets.tsx's own doc comment). What's specific to one
 * dto - which schema, which locale content, which fields get which custom
 * widget, the sample data, the submit button and what it does - stays with
 * the caller; see RjsfShowcaseDemo.tsx for all of that.
 *
 * Any other prop the underlying `@rjsf/core` `<Form>` accepts (`id`,
 * `className`, `disabled`, `readonly`, `onSubmit`, `onError`, `formContext`,
 * `omitExtraData`, ...) can still be passed straight through and is spread
 * onto it as-is - VirtualForm only fixes the handful listed on
 * `OwnedFormProps` above; everything else is exactly the real `<Form>`.
 */
export function VirtualForm({
  schema,
  uiSchema,
  formData,
  onChange,
  extraErrors,
  locale,
  children,
  ...formProps
}: VirtualFormProps) {
  const translateString = useMemo(() => makeTranslateString(locale), [locale]);

  const dispatchableSchema = useMemo(
    () => ensureDispatchableWidgetTypes(schema, uiSchema ?? {}),
    [schema, uiSchema],
  );

  return (
    <Form
      schema={dispatchableSchema}
      uiSchema={uiSchema}
      validator={validator}
      formData={formData}
      extraErrors={extraErrors}
      templates={{
        FieldTemplate: DescriptionBelowFieldTemplate,
        ButtonTemplates: labelledButtonTemplates,
        ArrayFieldItemTemplate,
        ObjectFieldTemplate,
      }}
      widgets={rjsfWidgets}
      translateString={translateString}
      transformErrors={(errors) =>
        translateValidationErrors(dropSpuriousDispatchTypeErrors(errors, uiSchema ?? {}), locale)
      }
      liveValidate
      noHtml5Validate
      onChange={(e) => onChange(e.formData)}
      {...formProps}
    >
      {children ?? <></>}
    </Form>
  );
}

export default VirtualForm;
