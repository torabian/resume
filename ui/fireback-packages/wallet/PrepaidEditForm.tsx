import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { FormCheckbox } from "@fireback/ui-core/components/forms/form-switch/FormSwitch";
import { createQuerySource } from "@fireback/ui-core/hooks/useAsQuery";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { useS } from "@fireback/ui-core/hooks/useS";
import { PrepaidDto } from "./sdk/PrepaidDto";
import {
  useWalletCurrenciesQuerySource,
  useWorkspacesQuerySource,
  useTreasuriesQuerySource,
} from "./AdminCreateWalletQuerySources";
import { FormJsonField } from "./FormJsonField";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { strings } from "./strings/translations";

export const PrepaidEditForm = ({
  form,
  isEditing,
}: EntityFormProps<Partial<PrepaidDto>>) => {
  const { values, setFieldValue, errors } = form;
  const s = useS(strings);

  const statusSource = createQuerySource([
    { name: s.prepaids.statusActive, uniqueId: "active" },
    { name: s.prepaids.statusRedeemed, uniqueId: "redeemed" },
    { name: s.prepaids.statusDisabled, uniqueId: "disabled" },
  ]);

  return (
    <>
      <FormText
        value={values.amount}
        onChange={(value) =>
          setFieldValue(PrepaidDto.Fields.amount, value, false)
        }
        autoFocus={!isEditing}
        errorMessage={errors.amount as string}
        label={s.prepaids.amount}
        hint={s.prepaids.amountHint}
      />
      <FormSelect
        querySource={useWalletCurrenciesQuerySource}
        keyExtractor={(item: any) => item.code}
        fnLabelFormat={(item: any) => `${item.name} (${item.code})`}
        value={values.currency}
        onChange={(item: any) =>
          setFieldValue(
            PrepaidDto.Fields.currency,
            item ? item.code : undefined,
            false,
          )
        }
        errorMessage={errors.currency as string}
        label={s.prepaids.currency}
      />
      {isEditing ? (
        <FormText
          value={values.redeemKey}
          disabled
          label={s.prepaids.redeemKey}
          hint={s.prepaids.redeemKeyHint}
        />
      ) : (
        <FormText
          value={values.redeemKey}
          onChange={(value) =>
            setFieldValue(PrepaidDto.Fields.redeemKey, value, false)
          }
          errorMessage={errors.redeemKey as string}
          label={s.prepaids.redeemKey}
          hint={s.prepaids.redeemKeyCreateHint}
        />
      )}
      <FormSelect
        querySource={statusSource}
        keyExtractor={(v: any) => v.uniqueId}
        fnLabelFormat={(v: any) => v.name}
        value={values.status}
        onChange={(item: any) =>
          setFieldValue(
            PrepaidDto.Fields.status,
            item ? item.uniqueId : undefined,
            false,
          )
        }
        errorMessage={errors.status as string}
        label={s.prepaids.status}
      />
      <FormCheckbox
        value={values.isExchangeable}
        onChange={(value) =>
          setFieldValue(PrepaidDto.Fields.isExchangeable, value, false)
        }
        errorMessage={errors.isExchangeable as string}
        label={s.prepaids.isExchangeable}
        hint={s.prepaids.isExchangeableHint}
      />
      <FormJsonField
        value={values.locations}
        onChange={(value) =>
          setFieldValue(PrepaidDto.Fields.locations, value, false)
        }
        errorMessage={errors.locations as string}
        label={s.prepaids.locations}
        hint={s.prepaids.locationsHint}
        rows={3}
      />
      <FormSelect
        querySource={useWorkspacesQuerySource}
        keyExtractor={(item: any) => item.uniqueId}
        fnLabelFormat={(item: any) => item.name}
        value={values.workspaceId}
        onChange={(item: any) =>
          setFieldValue(
            PrepaidDto.Fields.workspaceId,
            item ? item.uniqueId : undefined,
            false,
          )
        }
        nullable
        errorMessage={errors.workspaceId as string}
        label={s.prepaids.workspaceId}
        hint={s.prepaids.workspaceIdHint}
        placeholder={s.prepaids.selectWorkspace}
      />
      <FormSelect
        querySource={useTreasuriesQuerySource}
        keyExtractor={(item: any) => item.uniqueId}
        fnLabelFormat={(item: any) => getTStringValue(item.name, getLocale())}
        value={(values as any).treasury}
        onChange={(item: any) =>
          setFieldValue("treasury", item || undefined, false)
        }
        nullable
        errorMessage={errors.treasury as any}
        label={s.prepaids.treasury}
        hint={s.prepaids.treasuryHint}
        placeholder={s.prepaids.selectTreasury}
      />
      <FormJsonField
        value={values.metadata}
        onChange={(value) =>
          setFieldValue(PrepaidDto.Fields.metadata, value, false)
        }
        errorMessage={errors.metadata as string}
        label={s.prepaids.metadata}
        hint={s.prepaids.metadataHint}
      />
    </>
  );
};
