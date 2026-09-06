import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { createQuerySource } from "@fireback/ui-core/hooks/useAsQuery";
import { useS } from "@fireback/ui-core/hooks/useS";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { RegionalContentDto } from "@fireback/messaging/sdk/messaging/RegionalContentDto";
import { RegionalContentDefinitionList } from "./RegionalContentDefinitionList";
import { strings } from "./strings/translations";

export const RegionalContentForm = ({
  form,
  isEditing,
}: EntityFormProps<RegionalContentDto>) => {
  const { values, setFieldValue, errors } = form;
  const s = useS(strings);

  // Mirrors the enum values declared on regionalContent's own keyGroup field (see
  // Messaging.emi.yml).
  const keyGroupSource = createQuerySource([
    { value: "SMS_OTP", label: s.regionalContents.keyGroupSmsOtp },
    { value: "EMAIL_OTP", label: s.regionalContents.keyGroupEmailOtp },
  ]);

  return (
    <>
      <FormSelect
        keyExtractor={(t) => t.value}
        fnLabelFormat={(t) => t.label}
        formEffect={{
          form,
          field: RegionalContentDto.Fields.keyGroup,
          beforeSet(item) {
            return item.value;
          },
        }}
        querySource={keyGroupSource}
        errorMessage={errors.keyGroup}
        label={s.regionalContents.keyGroup}
        hint={s.regionalContents.keyGroupHint}
      />
      <FormText
        value={values.region}
        onChange={(value) =>
          setFieldValue(RegionalContentDto.Fields.region, value, false)
        }
        errorMessage={errors.region}
        label={s.regionalContents.region}
        hint={s.regionalContents.regionHint}
      />

      {/* Each language variant of this region+keyGroup's content is its own
          regionalContentDefinition row, managed through its own create/read/update/
          delete endpoints (see Messaging.emi.yml and RegionalContentDefinitionActions.go)
          - only available once this record actually has a uniqueId to attach
          definitions to, i.e. while editing an existing regionalContent, not while
          still creating a brand new one. */}
      {isEditing && values.uniqueId ? (
        <RegionalContentDefinitionList
          regionalContentId={values.uniqueId}
          keyGroup={values.keyGroup}
        />
      ) : null}
    </>
  );
};
