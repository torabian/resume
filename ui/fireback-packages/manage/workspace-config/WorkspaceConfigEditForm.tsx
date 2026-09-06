import { FormCheckbox } from "@fireback/ui-core/components/forms/form-switch/FormSwitch";
import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { useS } from "@fireback/ui-core/hooks/useS";
import { WorkspaceConfigDto } from "@fireback/manage/sdk/abac/WorkspaceConfigDto";
import { strings } from "./strings/translations";
import { PageSection } from "@fireback/ui-core/components/page-section/PageSection";
import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { useEmailProvidersQuerySource } from "@fireback/ui-core/hooks/useEmailProvidersQuerySource";
import { useGsmProvidersQuerySource } from "@fireback/ui-core/hooks/useGsmProvidersQuerySource";
import { useRegionalContentsQuerySource } from "@fireback/ui-core/hooks/useRegionalContentsQuerySource";
import { type RegionalContentDto } from "@fireback/manage/sdk/messaging/RegionalContentDto";

// Bug fix: this used to be `${e.title})` - a stray closing paren with no matching
// open. regionalContent no longer carries content/title/languageId itself - each is
// its own regionalContentDefinition row now (see Messaging.emi.yml), so all a
// regionalContent row can identify itself by here is keyGroup + region.
function regionalContentOptionLabel(item: RegionalContentDto) {
  return `${item.keyGroup} - ${item.region}`;
}

export const WorkspaceConfigForm = ({
  form,
  isEditing,
}: EntityFormProps<WorkspaceConfigDto>) => {
  const { values, setValues, setFieldValue, errors } = form;
  const s = useS(strings);
  return (
    <>
      <PageSection
        title={s.workspaceConfigs.recaptchaSectionTitle}
        description={s.workspaceConfigs.recaptchaSectionDescription}
      >
        <FormCheckbox
          value={values.enableRecaptcha2}
          onChange={(value) =>
            setFieldValue(
              WorkspaceConfigDto.Fields.enableRecaptcha2,
              value,
              false,
            )
          }
          errorMessage={errors.enableRecaptcha2}
          label={s.workspaceConfigs.enableRecaptcha2}
          hint={s.workspaceConfigs.enableRecaptcha2Hint}
        />

        <FormText
          value={values.recaptcha2ServerKey}
          disabled={!values.enableRecaptcha2}
          onChange={(value) =>
            setFieldValue(
              WorkspaceConfigDto.Fields.recaptcha2ServerKey,
              value,
              false,
            )
          }
          errorMessage={errors.recaptcha2ServerKey}
          label={s.workspaceConfigs.recaptcha2ServerKey}
          hint={s.workspaceConfigs.recaptcha2ServerKeyHint}
        />
        <FormText
          value={values.recaptcha2ClientKey}
          disabled={!values.enableRecaptcha2}
          onChange={(value) =>
            setFieldValue(
              WorkspaceConfigDto.Fields.recaptcha2ClientKey,
              value,
              false,
            )
          }
          errorMessage={errors.recaptcha2ClientKey}
          label={s.workspaceConfigs.recaptcha2ClientKey}
          hint={s.workspaceConfigs.recaptcha2ClientKeyHint}
        />
      </PageSection>

      <PageSection
        title={s.workspaceConfigs.otpSectionTitle}
        description={s.workspaceConfigs.otpSectionDescription}
      >
        <FormCheckbox
          value={values.enableOtp}
          onChange={(value) =>
            setFieldValue(WorkspaceConfigDto.Fields.enableOtp, value, false)
          }
          errorMessage={errors.enableOtp}
          label={s.workspaceConfigs.enableOtp}
          hint={s.workspaceConfigs.enableOtpHint}
        />

        <FormCheckbox
          value={values.requireOtpOnSignup}
          onChange={(value) =>
            setFieldValue(
              WorkspaceConfigDto.Fields.requireOtpOnSignup,
              value,
              false,
            )
          }
          errorMessage={errors.requireOtpOnSignup}
          label={s.workspaceConfigs.requireOtpOnSignup}
          hint={s.workspaceConfigs.requireOtpOnSignupHint}
        />

        <FormCheckbox
          value={values.requireOtpOnSignin}
          onChange={(value) =>
            setFieldValue(
              WorkspaceConfigDto.Fields.requireOtpOnSignin,
              value,
              false,
            )
          }
          errorMessage={errors.requireOtpOnSignin}
          label={s.workspaceConfigs.requireOtpOnSignin}
          hint={s.workspaceConfigs.requireOtpOnSigninHint}
        />
      </PageSection>
      <PageSection
        title={s.workspaceConfigs.totpSectionTitle}
        description={s.workspaceConfigs.totpSectionDescription}
      >
        <FormCheckbox
          value={values.enableTotp}
          onChange={(value) =>
            setFieldValue(WorkspaceConfigDto.Fields.enableTotp, value, false)
          }
          errorMessage={errors.enableTotp}
          label={s.workspaceConfigs.enableTotp}
          hint={s.workspaceConfigs.enableTotpHint}
        />

        <FormCheckbox
          value={values.forceTotp}
          onChange={(value) =>
            setFieldValue(WorkspaceConfigDto.Fields.forceTotp, value, false)
          }
          errorMessage={errors.forceTotp}
          label={s.workspaceConfigs.forceTotp}
          hint={s.workspaceConfigs.forceTotpHint}
        />
      </PageSection>
      <PageSection
        title={s.workspaceConfigs.passwordSectionTitle}
        description={s.workspaceConfigs.passwordSectionDescription}
      >
        <FormCheckbox
          value={values.forcePasswordOnPhone}
          onChange={(value) =>
            setFieldValue(
              WorkspaceConfigDto.Fields.forcePasswordOnPhone,
              value,
              false,
            )
          }
          errorMessage={errors.forcePasswordOnPhone}
          label={s.workspaceConfigs.forcePasswordOnPhone}
          hint={s.workspaceConfigs.forcePasswordOnPhoneHint}
        />

        <FormCheckbox
          value={values.forcePersonNameOnPhone}
          onChange={(value) =>
            setFieldValue(
              WorkspaceConfigDto.Fields.forcePersonNameOnPhone,
              value,
              false,
            )
          }
          errorMessage={errors.forcePersonNameOnPhone}
          label={s.workspaceConfigs.forcePersonNameOnPhone}
          hint={s.workspaceConfigs.forcePersonNameOnPhoneHint}
        />
      </PageSection>
    </>
  );
};
