import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { PublicJoinKeyDto } from "@fireback/selfservice/sdk/abac/PublicJoinKeyDto";
import { useRolesQuerySource } from "@fireback/ui-core/hooks/useRolesQuerySource";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";

export const PublicJoinKeyEditForm = ({
  form,
  isEditing,
}: EntityFormProps<Partial<PublicJoinKeyDto>>) => {
  const { values, setValues, setFieldValue, errors } = form;
  const s = useS(strings);

  return (
    <>
      <FormSelect
        formEffect={{ field: PublicJoinKeyDto.Fields.role$, form }}
        querySource={useRolesQuerySource}
        label={s.roleFieldLabel}
        errorMessage={errors.roleId}
        // name is complexes.TString now (a locale -> text map) - resolve to the
        // viewer's own locale rather than handing React the raw {en, fa, ...} object.
        fnLabelFormat={(item) => getTStringValue(item.name, getLocale())}
        hint={s.roleFieldHint}
      />
    </>
  );
};
