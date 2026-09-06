import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormTString } from "@fireback/ui-core/components/forms/form-tstring/FormTString";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { useS } from "@fireback/ui-core/hooks/useS";
import { strings as coreStrings } from "@fireback/ui-core/components/strings/translations";
import { strings } from "./strings/translations";
import { WorkspaceDto } from "@fireback/manage/sdk/abac/WorkspaceDto";
import { useWorkspacesQuerySource } from "./useWorkspacesQuerySource";
import { useWorkspaceTypesQuerySource } from "./useWorkspaceTypesQuerySource";
import { type WorkspaceTypeDto } from "@fireback/manage/sdk/abac/WorkspaceTypeDto";
import { type UseRemoteQuery } from "@fireback/ui-core/types/remoteQuery";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";

// The uniqueId fireback bootstraps its own root workspace with (RepairTheWorkspaces,
// WorkspaceActions.go) and the uniqueId the "root" WorkspaceType is seeded under
// (same file) - not a coincidence, WorkspaceCreateAction now rejects any *other*
// workspace that tries to use the root type, and rejects a workspace literally
// named "root" that tries to use anything else.
const ROOT_VAR = "root";

export const WorkspaceEditForm = ({
  form,
  isEditing,
}: EntityFormProps<Partial<WorkspaceDto>>) => {
  const { values, setFieldValue, errors } = form;
  const s = useS(strings);
  const cs = useS(coreStrings);
  // A workspace can never be its own parent (see WorkspaceUpdateAction/
  // WorkspaceCreateAction's own ParentCannotBeSelf check, WorkspaceActions.go) -
  // filtering it out of the option list here is a UX nicety on top of that
  // server-side rule, not a substitute for it. On create, values.uniqueId is only
  // known once the caller has typed a custom one into the "Unique id" field above;
  // until then there's nothing to filter, since an auto-generated id can't collide.
  const workspacesQuerySource = (params?: UseRemoteQuery) => {
    const source = useWorkspacesQuerySource(params);
    const items = values.uniqueId
      ? source.items.filter((item) => item.uniqueId !== values.uniqueId)
      : source.items;
    return { ...source, items };
  };

  // The root workspace type must never be offered here unless the workspace being
  // created/edited is literally "root" itself (see WorkspaceCreateAction's own
  // check, WorkspaceActions.go) - filtering it out of the option list is a UX nicety
  // on top of that server-side rule, not a substitute for it.
  const canChooseRootType = values.uniqueId === ROOT_VAR;
  const workspaceTypesQuerySource = (params?: UseRemoteQuery) => {
    const source = useWorkspaceTypesQuerySource(params);
    const items = canChooseRootType
      ? source.items
      : source.items.filter(
          (item: WorkspaceTypeDto) => item.uniqueId !== ROOT_VAR,
        );
    return { ...source, items };
  };

  return (
    <>
      {/* name is complexes.TString now (a locale -> text map) - FormTString edits
          every configured language at once instead of a single plain string, same
          as WorkspaceTypeEditForm.tsx's own title field. The closed field is a
          button, not a text input (see FormTString's own doc comment), so there's
          no autoFocus prop to carry over from the old FormText here - same as
          WorkspaceTypeEditForm.tsx's own title field. */}
      <FormTString
        value={values.name}
        onChange={(value) =>
          setFieldValue(WorkspaceDto.Fields.name, value, false)
        }
        errorMessage={errors.name}
        label={s.workspaceName}
        hint={s.workspaceNameHint}
      />

      <FormSelect
        querySource={workspaceTypesQuerySource}
        formEffect={{
          form,
          field: WorkspaceDto.Fields.typeId,
          beforeSet(item) {
            return item?.uniqueId ?? null;
          },
        }}
        // title is complexes.TString now (a locale -> text map) - resolve to the
        // viewer's own locale rather than handing React the raw {en, fa, ...} object.
        fnLabelFormat={(item) => getTStringValue(item?.title, getLocale())}
        errorMessage={errors.typeId}
        label={s.workspaceType}
        hint={s.workspaceTypeHint}
      />

      <FormSelect
        querySource={workspacesQuerySource}
        formEffect={{
          form,
          field: WorkspaceDto.Fields.parentId,
          beforeSet(item) {
            return item?.uniqueId ?? null;
          },
        }}
        // name is complexes.TString now (a locale -> text map) - resolve to the
        // viewer's own locale rather than handing React the raw {en, fa, pl} object
        // (React can't render an object as a child at all), same as the
        // workspaceTypesQuerySource picker's title above.
        fnLabelFormat={(item) => getTStringValue(item?.name, getLocale())}
        errorMessage={errors.parentId as string | undefined}
        label={cs.common.parent}
        hint={cs.common.parentHint}
      />

      {/* The unique id can only ever be chosen once, at creation - editing it
          afterwards would silently break every existing reference to this
          workspace (WorkspaceUpdateAction, in fact, never even reads a uniqueId
          out of its request body - see WorkspaceActions.go). Left entirely out of
          the form once isEditing is true, rather than just disabled, so there's
          nothing on screen suggesting it's still changeable. */}
      {!isEditing && (
        <FormText
          value={values.uniqueId ?? ""}
          // FormTString's own closed field is a button, not a text input (see its
          // doc comment), so it can't carry autoFocus the way the old plain-string
          // name field used to - moved here instead, same as
          // WorkspaceTypeEditForm.tsx's own uniqueId field.
          autoFocus={!isEditing}
          onChange={(value) =>
            setFieldValue(WorkspaceDto.Fields.uniqueId, value, false)
          }
          errorMessage={errors.uniqueId as string | undefined}
          label={s.workspaceUniqueId}
          hint={s.workspaceUniqueIdHint}
        />
      )}
    </>
  );
};
