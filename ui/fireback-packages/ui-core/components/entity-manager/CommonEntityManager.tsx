import "./CommonSingleManager.css";
import { mutationErrorsToFormik } from "../../hooks/api";
import { Toast } from "../../hooks/toast";
import { useCommonEntityManager } from "../../hooks/useCommonEntityManager";
import { useS } from "../../hooks/useS";
import { strings } from "../strings/translations";
import { Formik, type FormikHelpers, type FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";

import { useBackButton, useCommonCrudActions } from "../action-menu/ActionMenu";
import { getQueryErrorString } from "../error-view/QueryError";
import { usePageTitle } from "../page-title/PageTitle";
import { useAuthentication } from "@fireback/auth-client";
import { get, set } from "lodash";
import type { GResponse } from "@fireback/js-remote-ctx/envelopes";
import { ErrorsView } from "../error-view/ErrorView";
import { KeyboardAction } from "../../hooks/useExportTools";

// Shared by getSingleHook/postHook/patchHook below - all three are the raw
// emi-generated useXxxGetActionQuery/useXxxCreateAction/useXxxUpdateAction
// result (no nested `.query`/`.mutation`, unlike what this file used to
// read - see CommonSingleManager.tsx's own doc comment on the same bug).
// Same "resolve, don't reject" gap those two work around: a backend-
// returned failure still resolves rather than rejecting (ResponseDto always
// instantiates its own Error object, even on a fully successful response -
// see onSubmit's "Bug fix" comment below), so isError/data.error.messageTranslated
// alone (getQueryErrorString's own checks) can miss a failure that only set
// .message or field-level .errors[] - the same three-way check onSubmit's
// formik-error logic already relies on, kept in lockstep here so the toast
// and the per-field form errors never disagree about whether this was a
// failure. Also checks the raw HTTP response for a non-2xx status with no
// parsed envelope at all (e.g. a raw `--unstable`-style 500).
function mutationErrorMessage(hook: any, s: typeof strings): string | undefined {
  if (!hook) return undefined;
  const resp = hook.response;
  if (resp && resp.ok === false) {
    return getQueryErrorString(s, hook) || `${s.table.errorTitle} (${resp.status})`;
  }
  if (hook.isError) {
    return getQueryErrorString(s, hook) || s.table.errorTitle;
  }
  const errorInfo = hook.data?.error?.toJSON?.() ?? hook.data?.error;
  if (errorInfo?.message || errorInfo?.messageTranslated || errorInfo?.errors?.length) {
    return errorInfo.messageTranslated || errorInfo.message || s.table.errorTitle;
  }
  return undefined;
}

export interface CommonEntityManagerProps<T> {
  data?: T | null;
  Form?: any;
  getSingleHook?: any;
  setInnerRef?: (ref: FormikProps<Partial<T>>) => void;
  postHook?: any;
  forceEdit?: boolean;
  disableOnGetFailed?: boolean;
  patchHook?: any;
  onlyOnRoot?: boolean;
  onEditTitle?: string;
  beforeSetValues?: (data: Partial<T>) => Partial<T>;
  customClass?: string;
  onCreateTitle?: string;
  onCancel?: () => void;
  beforeSubmit?: (data: T) => T;
  onSuccessPatchOrPost?: (response: GResponse<any>) => void;
  onFinishUriResolver?: (response: GResponse<any>, locale: string) => string;
  // Locks the whole form read-only (in addition to - not instead of - formWorking's
  // own loading-state disable below), regardless of loading state. Used by
  // per-entity managers (WorkspaceEntityManager/WorkspaceTypeEntityManager/
  // RoleEntityManager) to disable editing the seeded "root" record: the server
  // rejects that update outright (see e.g. WorkspaceUpdateAction's own uniqueId ==
  // ROOT_VAR check, WorkspaceActions.go), so the form is locked here too rather
  // than letting a caller fill it out only to have Save fail.
  disabled?: boolean;
}

export interface DtoEntity<T, V = null> {
  data?: Partial<T> | null;
  setInnerRef?: (ref: FormikProps<Partial<T>>) => void;
  enabledFields?: Partial<V>;
  onSuccess?: (response: GResponse<T>) => void;
  showSubmit?: boolean;
  Form?: any;
}

export const CommonEntityManager = ({
  data,
  Form,
  getSingleHook,
  postHook,
  onCancel,
  onFinishUriResolver,
  disableOnGetFailed,
  patchHook,
  onCreateTitle,
  onEditTitle,
  setInnerRef,
  beforeSetValues,
  forceEdit,
  onlyOnRoot,
  customClass,
  beforeSubmit,
  onSuccessPatchOrPost,
  disabled,
}: CommonEntityManagerProps<any>) => {
  const [initialData, setInitialData] = useState();
  const { router, isEditing, locale, formik } = useCommonEntityManager<
    Partial<any>
  >({
    data,
  });
  const s = useS(strings);

  const touchedData = useRef({});

  useBackButton(onCancel, KeyboardAction.CommonBack);
  const { selectedWorkspace } = useAuthentication();
  usePageTitle((isEditing || forceEdit ? onEditTitle : onCreateTitle) || "");

  const getQuery = getSingleHook;

  useEffect(() => {
    const rawItem = getQuery?.data?.data?.item;
    // Bug fix: rawItem's DTO classes (e.g. UserDto) use real ES private (#) fields, and
    // their toJSON() only plainifies the top level - a nested object-type field (e.g.
    // UserDto.primaryAddress) is handed back as-is, still an instance of its own private-
    // fielded sub-class (see UserDto.ts's generated toJSON()). Formik/lodash's internal
    // clone() (used by setFieldValue for every dotted path, e.g.
    // "primaryAddress.city") can't shallow-copy such an instance - reading or writing a
    // private field on the clone throws "Cannot read/write private member ... from an
    // object whose class did not declare it" - which is exactly why editing a nested
    // field like the user's address silently failed. `JSON.parse(JSON.stringify(...))`
    // recurses into every nested toJSON() (that's how JSON.stringify itself works), so
    // it comes out fully plain at every depth, not just the top level.
    const item = rawItem ? JSON.parse(JSON.stringify(rawItem)) : undefined;
    if (item) {
      formik.current?.setValues(
        beforeSetValues ? beforeSetValues({ ...item }) : { ...item },
      );

      setInitialData(item);
    }
  }, [getQuery?.data]);

  useEffect(() => {
    formik.current?.setSubmitting(postHook?.isPending || patchHook?.isPending);
  }, [postHook?.isPending, patchHook?.isPending]);

  const onSubmit = (p: Partial<any>, d: FormikHelpers<Partial<any>>) => {
    let values: any = touchedData.current;
    values.uniqueId = p.uniqueId;
    if (beforeSubmit) {
      values = beforeSubmit(values);
    }

    const op =
      isEditing || forceEdit
        ? patchHook?.mutateAsync(JSON.stringify(values), d)
        : postHook?.mutateAsync(JSON.stringify(values), d);

    op.then((response: GResponse<unknown>) => {
      if (response.data?.item) {
        if (onSuccessPatchOrPost) {
          onSuccessPatchOrPost(response);
        } else if (onFinishUriResolver) {
          router.goBackOrDefault(onFinishUriResolver(response, locale));
        } else {
          Toast(s.components.done, { type: "success" });
        }
      }
      // Bug fix: response.error is never actually undefined/null - ResponseDto's
      // constructor (#lateInitFields, see the generated envelope class) always
      // instantiates a ResponseDto.Error, even on a fully successful response, so
      // `if (response.error)` was always true. The real signal that the request
      // failed is whether that error object actually carries content. Also,
      // mutationErrorsToFormik (see hooks/api.ts) expects the shape it's usually
      // called with elsewhere - `{ error: { message, messageTranslated, errors } }` -
      // but response.error.toJSON() IS already that inner `error` object, one level
      // unwrapped too many. Passed directly, mutationErrorsToFormik's own
      // `errors.error.errors`/`errors.error.messageTranslated` lookups always missed,
      // so per-field errors (mainSenderNumber/type/etc. - every entity form's
      // required-field validation) never reached the form, and the untranslated
      // "$"-code (e.g. "ValidationFailedOnSomeFields") showed instead of the
      // resolved message.
      const errorInfo = response.error?.toJSON?.() ?? response.error;
      if (
        errorInfo?.message ||
        errorInfo?.messageTranslated ||
        errorInfo?.errors?.length
      ) {
        formik.current.setErrors(mutationErrorsToFormik({ error: errorInfo }));
      }
      // Toasting for this (resolved-with-an-error-body) case happens via the
      // postFailure/patchFailure effects below, not here - they're driven
      // off postHook/patchHook's own state (mutationErrorMessage), which by
      // the time this .then() runs has already been updated with this exact
      // response, so there's nothing this branch needs to add on top of the
      // formik field errors it's already setting.
    }).catch(() => {
      // mutateAsync rejects on a genuinely thrown/rejected fetch (offline,
      // CORS, ...) in addition to updating postHook/patchHook.isError - the
      // postFailure/patchFailure effects below already toast for that same
      // isError, so this exists only to keep the rejection from surfacing as
      // an unhandled promise rejection.
    });
  };

  // getSingleHook is a query (isLoading is valid there); postHook/patchHook
  // are mutations - react-query v5 dropped isLoading for those in favor of
  // isPending (this used to read postHook?.query?.isLoading/
  // patchHook?.query?.isLoading, which was doubly wrong: no `.query`
  // nesting on either hook, and isLoading doesn't exist on a mutation
  // result even unwrapped - so the form never actually disabled itself
  // while a save was in flight).
  const formWorking =
    getSingleHook?.isLoading || postHook?.isPending || patchHook?.isPending;

  const getFailureMessage = mutationErrorMessage(getSingleHook, s);
  const postFailureMessage = mutationErrorMessage(postHook, s);
  const patchFailureMessage = mutationErrorMessage(patchHook, s);

  // Toast on a failed load/create/update. Keyed on the *message string*
  // itself, not some underlying hook field - response's own identity is the
  // obvious choice (CommonListManager/CommonSingleManager both use it) but
  // it's wrong for postHook/patchHook specifically: a genuinely thrown/
  // rejected fetch (the "server is down" case - offline, connection
  // refused, ...) never reaches the generated hook's own setResponse(...)
  // call at all (fetchx() rejects before a Response ever exists), so
  // `response` never changes and the toast silently never fired. Queries
  // have errorUpdatedAt for exactly this (bumped on a thrown fetch
  // regardless of whether a Response exists), but mutations have no
  // equivalent field to key off instead - the message string itself is
  // always right for both shapes, and Toast() already de-dupes an identical
  // back-to-back message on its own (see hooks/toast.ts), so keying on it
  // costs nothing.
  useEffect(() => {
    if (getFailureMessage) {
      Toast(getFailureMessage, { type: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFailureMessage]);

  useEffect(() => {
    if (postFailureMessage) {
      Toast(postFailureMessage, { type: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postFailureMessage]);

  useEffect(() => {
    if (patchFailureMessage) {
      Toast(patchFailureMessage, { type: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patchFailureMessage]);

  useCommonCrudActions({
    // onCancel: onCancel,
    onSave() {
      formik.current?.submitForm();
    },
  });

  if (onlyOnRoot && selectedWorkspace.workspaceId !== "root") {
    return <div>{s.onlyOnRoot}</div>;
  }

  return (
    <Formik
      innerRef={(r) => {
        if (r) {
          formik.current = r;
          setInnerRef && setInnerRef(r);
        }
      }}
      initialValues={{}}
      onSubmit={onSubmit}
    >
      {(form: FormikProps<Partial<any>>) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.submitForm();
          }}
          className={
            customClass == undefined
              ? "headless-form-entity-manager"
              : customClass
          }
        >
          {/* <pre>{JSON.stringify(form.values, null, 2)}</pre> */}
          <ErrorsView errors={form.errors} />
          {/* postHook/patchHook failures already surface as the toast above
              plus per-field formik errors (onSubmit's own setErrors, right
              above ErrorsView) - a banner here would just repeat the same
              thing a third time. getSingleHook gets the banner because
              nothing else shows it: there's no form field to attach a load
              failure to, and unlike CommonListManager's grid, the Form below
              has no content of its own to fall back to and keep visible. */}
          {getFailureMessage && (
            <div className="single-manager-error-banner">
              <span className="single-manager-error-banner__message">
                {getFailureMessage}
              </span>
              <button
                type="button"
                className="single-manager-error-banner__reload"
                onClick={() => getSingleHook.refetch()}
                disabled={getSingleHook?.isFetching}
              >
                {s.components.retry}
              </button>
            </div>
          )}
          <fieldset disabled={formWorking || disabled}>
            {disableOnGetFailed === true && !!getFailureMessage ? null : (
              <Form
                isEditing={isEditing}
                initialData={initialData}
                form={{
                  ...form,

                  setValues: (
                    values: React.SetStateAction<any>,
                    shouldValidate?: boolean,
                  ) => {
                    for (const key in values) {
                      set(touchedData.current, key, values[key]);
                    }

                    return form.setValues(values);
                  },

                  setFieldValue: (
                    field: string,
                    value: any,
                    shouldValidate?: boolean,
                  ) => {
                    // In case of having a nested object, we touch the entire nested for safety.
                    // This is completely correct for json fields for example, but might not be
                    // most efficient for object or embed types in fireback.
                    if (field.includes(".")) {
                      const v = field.split(".")[0];
                      set(touchedData.current, v, get(form.values, v));
                    }

                    set(touchedData.current, field, value);

                    return form.setFieldValue(field, value, shouldValidate);
                  },
                }}
              />
            )}
            <button type="submit" className="d-none" />
          </fieldset>
        </form>
      )}
    </Formik>
  );
};
