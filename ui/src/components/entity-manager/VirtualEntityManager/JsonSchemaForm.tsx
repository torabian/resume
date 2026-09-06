import Form from "@rjsf/core";
import {
  type RJSFSchema,
  type UiSchema,
  type RegistryFieldsType,
  type RegistryWidgetsType,
} from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { toRjsfExtraErrors } from "./errorMapping";
import { TEXT_BUTTON_TEMPLATES } from "./TextButtonTemplates";

/**
 * Builds a JSON-Schema-driven create/edit form component, for
 * CommonEntityManager's `Form` slot (the same slot UserEditForm plugs into -
 * see UserEntityManager.tsx). That slot's signature is fixed to
 * EntityFormProps<T> (form/isEditing/initialData), so schema/uiSchema -
 * per-entity config, not per-render props - are baked in via closure here
 * rather than threaded through as extra props.
 *
 * `tagName="div"` keeps rjsf's Form from rendering its own nested <form>
 * inside CommonEntityManager's own Formik <form>, and the default submit
 * button is hidden the same way, since CommonEntityManager already owns
 * submission (its own hidden submit button, triggered by the action-menu's
 * save action).
 *
 * `extraErrors` feeds back the per-field backend validation errors
 * CommonEntityManager's onSubmit sets on `form.errors` on a failed create/
 * update (see errorMapping.ts's own doc comment) - without it those errors
 * only ever showed as the one generic top-level message ErrorsView renders
 * above this Form, the same way every field's `errorMessage={errors?.x}`
 * would otherwise have to be wired by hand per hand-written entity form.
 */
export function makeJsonSchemaForm<T>(
  schema: RJSFSchema,
  uiSchema?: UiSchema,
  fields?: RegistryFieldsType,
  widgets?: RegistryWidgetsType,
) {
  return function JsonSchemaForm({ form }: EntityFormProps<Partial<T>>) {
    return (
      <Form
        schema={schema}
        uiSchema={{
          ...uiSchema,
          "ui:submitButtonOptions": { norender: true },
        }}
        fields={fields}
        widgets={widgets}
        // See TextButtonTemplates.tsx's own doc comment - @rjsf/core's
        // default array add/remove/move/copy buttons render Bootstrap 3
        // glyphicons with no text fallback, which this app (Bootstrap 5,
        // no glyphicon font) rendered completely blank.
        templates={{ ButtonTemplates: TEXT_BUTTON_TEMPLATES }}
        validator={validator}
        tagName="div"
        liveValidate
        noHtml5Validate
        formData={form.values}
        extraErrors={toRjsfExtraErrors(form.errors as Record<string, any>)}
        onChange={(e) => form.setValues(e.formData, false)}
      />
    );
  };
}
