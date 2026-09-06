import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormSelectMultiple } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { FormCheckbox } from "@fireback/ui-core/components/forms/form-switch/FormSwitch";
import { PageSection } from "@fireback/ui-core/components/page-section/PageSection";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { useS } from "@fireback/ui-core/hooks/useS";
import { WalletConfigDto } from "./sdk/WalletConfigDto";
import { useWalletCurrenciesQuerySource } from "./AdminCreateWalletQuerySources";
import { strings } from "./strings/translations";

// `values.defaultUserWallets` is kept, purely as an editing convenience, as a flat
// array of currency objects - not the wire shape ([{currency: {...}}]) - see
// WalletConfigEntityManager's beforeSetValues/beforeSubmit, which convert at the
// boundary. That's what this form's multi-select actually reads/writes.
export const WalletConfigForm = ({
  form,
}: EntityFormProps<
  Partial<WalletConfigDto> & { defaultUserWallets?: any[] }
>) => {
  const { values, setFieldValue, errors } = form;
  const s = useS(strings);

  return (
    <>
      <PageSection
        title={s.walletConfigs.limitsSectionTitle}
        description={s.walletConfigs.limitsSectionDescription}
      >
        <FormText
          type="number"
          value={values.maxWalletsPerUser}
          onChange={(value) =>
            setFieldValue(WalletConfigDto.Fields.maxWalletsPerUser, value, false)
          }
          errorMessage={errors.maxWalletsPerUser as string}
          label={s.walletConfigs.maxWalletsPerUser}
          hint={s.walletConfigs.maxWalletsPerUserHint}
        />
        <FormText
          type="number"
          value={values.maxWalletsPerWorkspace}
          onChange={(value) =>
            setFieldValue(
              WalletConfigDto.Fields.maxWalletsPerWorkspace,
              value,
              false,
            )
          }
          errorMessage={errors.maxWalletsPerWorkspace as string}
          label={s.walletConfigs.maxWalletsPerWorkspace}
          hint={s.walletConfigs.maxWalletsPerWorkspaceHint}
        />
        <FormText
          type="number"
          value={values.maxWalletsPerUserPerCurrency}
          onChange={(value) =>
            setFieldValue(
              WalletConfigDto.Fields.maxWalletsPerUserPerCurrency,
              value,
              false,
            )
          }
          errorMessage={errors.maxWalletsPerUserPerCurrency as string}
          label={s.walletConfigs.maxWalletsPerUserPerCurrency}
          hint={s.walletConfigs.maxWalletsPerUserPerCurrencyHint}
        />
        <FormText
          type="number"
          value={values.maxWalletsPerWorkspacePerCurrency}
          onChange={(value) =>
            setFieldValue(
              WalletConfigDto.Fields.maxWalletsPerWorkspacePerCurrency,
              value,
              false,
            )
          }
          errorMessage={errors.maxWalletsPerWorkspacePerCurrency as string}
          label={s.walletConfigs.maxWalletsPerWorkspacePerCurrency}
          hint={s.walletConfigs.maxWalletsPerWorkspacePerCurrencyHint}
        />
      </PageSection>

      <PageSection
        title={s.walletConfigs.selfServiceSectionTitle}
        description={s.walletConfigs.selfServiceSectionDescription}
      >
        <FormCheckbox
          value={values.allowUserCreateWallet}
          onChange={(value) =>
            setFieldValue(
              WalletConfigDto.Fields.allowUserCreateWallet,
              value,
              false,
            )
          }
          errorMessage={errors.allowUserCreateWallet as string}
          label={s.walletConfigs.allowUserCreateWallet}
          hint={s.walletConfigs.allowUserCreateWalletHint}
        />
        <FormSelectMultiple
          querySource={useWalletCurrenciesQuerySource}
          keyExtractor={(item: any) => item?.uniqueId ?? item?.currency?.uniqueId}
          fnLabelFormat={(item: any) => {
            // Defensive: item is normally already a flat currency object (see
            // WalletConfigEntityManager's own beforeSetValues), but render correctly
            // either way rather than "undefined undefined" if a still-nested
            // {currency: {...}} row or an unwrapped MOne ever slips through here.
            const c = item?.get ? item.get() : (item?.currency ?? item);
            return c ? `${c.name} (${c.code})` : "";
          }}
          value={values.defaultUserWallets || []}
          onChange={(items: any) =>
            setFieldValue("defaultUserWallets", items || [], false)
          }
          errorMessage={errors.defaultUserWallets as any}
          label={s.walletConfigs.defaultUserWallets}
          hint={s.walletConfigs.defaultUserWalletsHint}
        />
      </PageSection>
    </>
  );
};
