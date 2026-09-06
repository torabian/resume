import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormCheckbox } from "@fireback/ui-core/components/forms/form-switch/FormSwitch";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { useS } from "@fireback/ui-core/hooks/useS";
import { WalletProviderConfigDto } from "./sdk/WalletProviderConfigDto";
import { FormJsonField } from "./FormJsonField";
import { strings } from "./strings/translations";

export const WalletProviderConfigEditForm = ({
  form,
  isEditing,
}: EntityFormProps<Partial<WalletProviderConfigDto>>) => {
  const { values, setFieldValue, errors } = form;
  const s = useS(strings);

  return (
    <>
      <FormText
        value={values.providerType}
        onChange={(value) =>
          setFieldValue(WalletProviderConfigDto.Fields.providerType, value, false)
        }
        autoFocus={!isEditing}
        errorMessage={errors.providerType as string}
        label={s.walletProviderConfigs.providerType}
        hint={s.walletProviderConfigs.providerTypeHint}
      />
      <FormText
        value={values.region}
        onChange={(value) =>
          setFieldValue(WalletProviderConfigDto.Fields.region, value, false)
        }
        errorMessage={errors.region as string}
        label={s.walletProviderConfigs.region}
        hint={s.walletProviderConfigs.regionHint}
      />
      <FormJsonField
        value={values.config}
        onChange={(value) =>
          setFieldValue(WalletProviderConfigDto.Fields.config, value, false)
        }
        errorMessage={errors.config as string}
        label={s.walletProviderConfigs.config}
        hint={s.walletProviderConfigs.configHint}
      />
      <FormCheckbox
        value={values.isEnabled}
        onChange={(value) =>
          setFieldValue(WalletProviderConfigDto.Fields.isEnabled, value, false)
        }
        errorMessage={errors.isEnabled as string}
        label={s.walletProviderConfigs.isEnabled}
      />
    </>
  );
};
