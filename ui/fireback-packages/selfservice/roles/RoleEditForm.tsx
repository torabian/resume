import { FormTString } from "@fireback/ui-core/components/forms/form-tstring/FormTString";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { RoleDto } from "@fireback/selfservice/sdk/abac/RoleDto";
import { RolePermissionTree } from "./RolePermissionTree";
import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";

/**
 * Server does not return capabilities list id, because it's used only on post/patch
 * this function casts it regardless to array<string> so form would work.
 */
const normalize = (caps: any, capList: any) => {
  if (caps?.length && !capList?.length) {
    return caps.map((t: any) => t.uniqueId);
  }

  return capList || [];
};

export const RoleEditForm = ({
  form,
  isEditing,
}: EntityFormProps<Partial<RoleDto>>) => {
  const { values, setFieldValue, errors } = form;
  const s = useS(strings);
  return (
    <>
      {/* name is complexes.TString now (a locale -> text map) - FormTString edits
          every configured language at once instead of a single plain string, same
          as CapabilityForm.tsx's own name/description fields. */}
      <FormTString
        value={values.name}
        onChange={(value) => setFieldValue(RoleDto.Fields.name, value, false)}
        errorMessage={errors.name}
        label={s.inviteRoleLabel}
        hint={s.inviteRoleHint}
      />

      <RolePermissionTree
        onChange={(value) =>
          setFieldValue(RoleDto.Fields.capabilitiesListId, value, false)
        }
        value={normalize(values.capabilities, values.capabilitiesListId)}
      />
    </>
  );
};
