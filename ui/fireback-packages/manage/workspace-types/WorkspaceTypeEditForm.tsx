import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormTString } from "@fireback/ui-core/components/forms/form-tstring/FormTString";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { WorkspaceTypeDto } from "@fireback/manage/sdk/abac/WorkspaceTypeDto";

import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { useRolesQuerySource } from "@fireback/ui-core/hooks/useRolesQuerySource";
import { FormRichText } from "@fireback/ui-core/components/forms/form-richtext/FormRichText";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";

export const WorkspaceTypeEditForm = ({
  form,
  isEditing,
}: EntityFormProps<Partial<WorkspaceTypeDto>>) => {
  const { values, setValues } = form;
  const s = useS(strings);

  return (
    <>
      <FormText
        value={values.uniqueId}
        onChange={(value) =>
          form.setFieldValue(WorkspaceTypeDto.Fields.uniqueId, value, false)
        }
        errorMessage={form.errors.uniqueId}
        label={s.workspaceTypeUniqueId}
        autoFocus={!isEditing}
        hint={s.workspaceTypeUniqueIdHint}
      />
      {/* title is complexes.TString now (a locale -> text map) - FormTString edits
          every configured language at once instead of a single plain string, same
          as CapabilityForm.tsx's own name/description fields. */}
      <FormTString
        value={values.title}
        onChange={(value) =>
          form.setFieldValue(WorkspaceTypeDto.Fields.title, value, false)
        }
        errorMessage={form.errors.title}
        label={s.workspaceTypeTitle}
        hint={s.workspaceTypeTitleHint}
      />
      <FormText
        value={values.slug}
        onChange={(value) =>
          form.setFieldValue(WorkspaceTypeDto.Fields.slug, value, false)
        }
        dir="ltr"
        errorMessage={form.errors.slug}
        label={s.workspaceTypeSlug}
        hint={s.workspaceTypeSlugHint}
      />
      {/* Bug fix: formEffect.field was "role" (a virtual field never actually present
          on the dto), not "roleId" - on change that happened to still work, since
          FormSelect additionally writes formEffect.field + "Id" (i.e. "roleId") into
          the form values whenever the selected item has a uniqueId. But on load,
          FormSelect preselects by reading get(values, formEffect.field) - "role" was
          never set from the API response (only roleId ever comes back), so it read
          undefined and nothing showed as selected even though values.roleId was
          populated. Same "field" + beforeSet(item.uniqueId) pattern
          WorkspaceEditForm.tsx's typeId/parentId pickers already use. */}
      <FormSelect
        label={s.roleFieldLabel}
        hint={s.roleFieldHint}
        // name is complexes.TString now (a locale -> text map) - resolve to the
        // viewer's own locale rather than handing React the raw {en, fa, pl} object
        // (React can't render an object as a child at all).
        fnLabelFormat={(role) => getTStringValue(role.name, getLocale())}
        querySource={useRolesQuerySource}
        formEffect={{
          form,
          field: WorkspaceTypeDto.Fields.roleId,
          beforeSet(item) {
            return item?.uniqueId ?? null;
          },
        }}
        errorMessage={form.errors.roleId}
      />

      <FormRichText
        value={values.description}
        onChange={(value) =>
          form.setFieldValue(WorkspaceTypeDto.Fields.description, value, false)
        }
        errorMessage={form.errors.description}
        label={s.typeDescription}
        hint={s.typeDescriptionHint}
      />
    </>
  );
};
