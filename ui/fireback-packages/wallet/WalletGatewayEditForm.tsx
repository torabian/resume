import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import {
  FormSelect,
  FormSelectMultiple,
} from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { FormCheckbox } from "@fireback/ui-core/components/forms/form-switch/FormSwitch";
import { createQuerySource } from "@fireback/ui-core/hooks/useAsQuery";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { useS } from "@fireback/ui-core/hooks/useS";
import { WalletGatewayDto } from "./sdk/WalletGatewayDto";
import { useWalletCurrenciesQuerySource } from "./AdminCreateWalletQuerySources";
import { FormJsonField } from "./FormJsonField";
import { strings } from "./strings/translations";

export const WalletGatewayEditForm = ({
  form,
  isEditing,
}: EntityFormProps<Partial<WalletGatewayDto>>) => {
  const { values, setFieldValue, errors } = form;
  const s = useS(strings);

  const kindSource = createQuerySource([
    { name: s.walletCurrencies.kindFiat, uniqueId: "fiat" },
    { name: s.walletCurrencies.kindCrypto, uniqueId: "crypto" },
  ]);

  // supportedCurrencies is stored on the wire as a bare JSON array of currency codes
  // (e.g. ["USD","EUR"]) - the multi-select below works in terms of full currency
  // objects (so it can show a real label, not a bare code), converting to/from that
  // array of codes on read/write. Resolving codes back to the full matching item here
  // (rather than passing bare {code} stand-ins) is required for the multi-select to
  // render a real label for an already-selected chip - it only auto-resolves a single,
  // non-array value against its own options.
  const { items: currencyItems } = useWalletCurrenciesQuerySource();
  const supportedCodes: string[] = Array.isArray(values.supportedCurrencies)
    ? (values.supportedCurrencies as any)
    : [];
  const supportedCurrencyItems = supportedCodes
    .map((code) => currencyItems.find((item) => item.code === code))
    .filter(Boolean);

  return (
    <>
      <FormText
        value={values.code}
        onChange={(value) =>
          setFieldValue(WalletGatewayDto.Fields.code, value, false)
        }
        autoFocus={!isEditing}
        errorMessage={errors.code as string}
        label={s.walletGateways.code}
        hint={s.walletGateways.codeHint}
      />
      <FormText
        value={values.name}
        onChange={(value) =>
          setFieldValue(WalletGatewayDto.Fields.name, value, false)
        }
        errorMessage={errors.name as string}
        label={s.walletGateways.name}
      />
      <FormSelect
        querySource={kindSource}
        keyExtractor={(v: any) => v.uniqueId}
        fnLabelFormat={(v: any) => v.name}
        value={values.kind}
        onChange={(item: any) =>
          setFieldValue(
            WalletGatewayDto.Fields.kind,
            item ? item.uniqueId : undefined,
            false,
          )
        }
        errorMessage={errors.kind as string}
        label={s.walletGateways.kind}
      />
      <FormSelectMultiple
        querySource={useWalletCurrenciesQuerySource}
        keyExtractor={(item: any) => item.code}
        fnLabelFormat={(item: any) => `${item.name} (${item.code})`}
        value={supportedCurrencyItems}
        onChange={(items: any) =>
          setFieldValue(
            WalletGatewayDto.Fields.supportedCurrencies,
            (items || []).map((item: any) => item.code),
            false,
          )
        }
        errorMessage={errors.supportedCurrencies as string}
        label={s.walletGateways.supportedCurrencies}
        hint={s.walletGateways.supportedCurrenciesHint}
      />
      <FormJsonField
        value={values.config}
        onChange={(value) =>
          setFieldValue(WalletGatewayDto.Fields.config, value, false)
        }
        errorMessage={errors.config as string}
        label={s.walletGateways.config}
        hint={s.walletGateways.configHint}
      />
      <FormCheckbox
        value={values.isActive}
        onChange={(value) =>
          setFieldValue(WalletGatewayDto.Fields.isActive, value, false)
        }
        errorMessage={errors.isActive as string}
        label={s.walletGateways.isActive}
      />
    </>
  );
};
