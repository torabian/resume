import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { FormCheckbox } from "@fireback/ui-core/components/forms/form-switch/FormSwitch";
import { createQuerySource } from "@fireback/ui-core/hooks/useAsQuery";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { useS } from "@fireback/ui-core/hooks/useS";
import { WalletCurrencyDto } from "./sdk/WalletCurrencyDto";
import { strings } from "./strings/translations";

export const WalletCurrencyEditForm = ({
  form,
  isEditing,
}: EntityFormProps<Partial<WalletCurrencyDto>>) => {
  const { values, setFieldValue, errors } = form;
  const s = useS(strings);

  const kindSource = createQuerySource([
    { name: s.walletCurrencies.kindFiat, uniqueId: "fiat" },
    { name: s.walletCurrencies.kindCrypto, uniqueId: "crypto" },
  ]);

  return (
    <>
      <FormText
        value={values.code}
        onChange={(value) =>
          setFieldValue(WalletCurrencyDto.Fields.code, value, false)
        }
        autoFocus={!isEditing}
        errorMessage={errors.code as string}
        label={s.walletCurrencies.code}
        hint={s.walletCurrencies.codeHint}
      />
      <FormText
        value={values.name}
        onChange={(value) =>
          setFieldValue(WalletCurrencyDto.Fields.name, value, false)
        }
        errorMessage={errors.name as string}
        label={s.walletCurrencies.name}
      />
      <FormSelect
        querySource={kindSource}
        keyExtractor={(v: any) => v.uniqueId}
        fnLabelFormat={(v: any) => v.name}
        value={values.kind}
        onChange={(item: any) =>
          setFieldValue(
            WalletCurrencyDto.Fields.kind,
            item ? item.uniqueId : undefined,
            false,
          )
        }
        errorMessage={errors.kind as string}
        label={s.walletCurrencies.kind}
      />
      <FormText
        type="number"
        value={values.decimals}
        onChange={(value) =>
          setFieldValue(WalletCurrencyDto.Fields.decimals, value, false)
        }
        errorMessage={errors.decimals as string}
        label={s.walletCurrencies.decimals}
        hint={s.walletCurrencies.decimalsHint}
      />
      <FormText
        value={values.symbol}
        onChange={(value) =>
          setFieldValue(WalletCurrencyDto.Fields.symbol, value, false)
        }
        errorMessage={errors.symbol as string}
        label={s.walletCurrencies.symbol}
        hint={s.walletCurrencies.symbolHint}
      />
      <FormCheckbox
        value={values.isActive}
        onChange={(value) =>
          setFieldValue(WalletCurrencyDto.Fields.isActive, value, false)
        }
        errorMessage={errors.isActive as string}
        label={s.walletCurrencies.isActive}
        hint={s.walletCurrencies.isActiveHint}
      />
    </>
  );
};
