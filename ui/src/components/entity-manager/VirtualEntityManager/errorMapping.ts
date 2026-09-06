// mutationErrorsToFormik (see @fireback/ui-core/hooks/api.ts) builds a flat
// object keyed by each backend validation error's `location` - a plain field
// name ("firstName") or a dotted path into a nested field
// ("primaryAddress.city") - plus a top-level "form" key for the envelope's
// own message. CommonEntityManager.tsx sets that object as Formik's `errors`
// on a failed create/update (see its onSubmit) and separately renders
// `errors.form` above the Form slot via ErrorsView - but never anything
// field-specific. Every hand-written entity form (e.g. UserEditForm.tsx)
// wires that in itself, one `errorMessage={errors?.fieldName}` per input;
// this does the generic equivalent for the JSON-Schema form by translating
// the same flat/dotted object into rjsf's `extraErrors` shape (a tree
// mirroring the schema, each level optionally carrying `__errors: string[]`).
export function toRjsfExtraErrors(
  errors: Record<string, any> | undefined | null,
): Record<string, any> | undefined {
  if (!errors) return undefined;

  const extraErrors: Record<string, any> = {};

  for (const [path, message] of Object.entries(errors)) {
    // "form" is the envelope-level message, already shown by
    // CommonEntityManager's own ErrorsView above the Form slot - surfacing
    // it again as a field error here would just double it up.
    if (!message || path === "form") continue;

    const segments = path.split(".");
    let node = extraErrors;
    segments.forEach((segment, i) => {
      node[segment] = node[segment] || {};
      if (i === segments.length - 1) {
        node[segment].__errors = [
          ...(node[segment].__errors || []),
          String(message),
        ];
      } else {
        node = node[segment];
      }
    });
  }

  return Object.keys(extraErrors).length ? extraErrors : undefined;
}
