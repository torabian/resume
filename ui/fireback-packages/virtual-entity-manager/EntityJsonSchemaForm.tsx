import {
  type RJSFSchema,
  type UiSchema,
  type RegistryFieldsType,
} from "@rjsf/utils";
import { VirtualForm } from "@fireback/jsf";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { toRjsfExtraErrors } from "./errorMapping";

// @fireback/jsf's VirtualForm only carries translated chrome/error text for
// these three locales (see fireback-packages/jsf/locales/
// rjsfShowcaseFormLocales.ts) - the app itself recognizes more (see
// localeStore.ts's KNOWN_LOCALES), so any locale outside this set falls back
// to English here rather than VirtualForm's locale-keyed lookups (e.g.
// `errorMessages[locale]`) throwing on an unlisted key.
const JSF_LOCALES = ["en", "fa", "pl"] as const;
type JsfLocale = (typeof JSF_LOCALES)[number];

function toJsfLocale(locale: string): JsfLocale {
  return (JSF_LOCALES as readonly string[]).includes(locale)
    ? (locale as JsfLocale)
    : "en";
}

/**
 * Builds a JSON-Schema-driven create/edit form component, for
 * CommonEntityManager's `Form` slot (the same slot UserEditForm plugs into -
 * see UserEntityManager.tsx). That slot's signature is fixed to
 * EntityFormProps<T> (form/isEditing/initialData), so schema/uiSchema -
 * per-entity config, not per-render props - are baked in via closure here
 * rather than threaded through as extra props.
 *
 * Rendering itself is all @fireback/jsf's VirtualForm (see its own doc
 * comment) - the ui-core-styled widgets/templates, translated chrome/error
 * text and the entity-relation/TString widget wiring all live there now, so
 * this file only adapts VirtualForm to CommonEntityManager's Formik-shaped
 * `form` prop: `formData`/`onChange` come from `form.values`/
 * `form.setValues`, and `extraErrors` from `form.errors` (CommonEntityManager's
 * own onSubmit sets that on a failed create/update - see errorMapping.ts's
 * own doc comment for why that needs translating into rjsf's `extraErrors`
 * shape).
 */
export function makeJsonSchemaForm<T>(
  schema: RJSFSchema,
  uiSchema?: UiSchema,
  fields?: RegistryFieldsType,
) {
  return function JsonSchemaForm({ form }: EntityFormProps<Partial<T>>) {
    const { locale } = useLocale();

    return (
      <VirtualForm
        schema={schema}
        uiSchema={uiSchema}
        fields={fields}
        formData={form.values}
        extraErrors={toRjsfExtraErrors(form.errors as Record<string, any>)}
        locale={toJsfLocale(locale)}
        onChange={(next) => form.setValues(next, false)}
        // CommonEntityManager already renders its own <form> (and owns
        // submission via its own hidden submit button, triggered by the
        // action-menu's save action) - tagName="div" keeps VirtualForm's
        // rjsf <Form> from nesting a second <form> inside it, same as the
        // old @rjsf/core-direct JsonSchemaForm.tsx did.
        tagName="div"
      />
    );
  };
}
