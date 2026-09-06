import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { useS } from "@fireback/ui-core/hooks/useS";
import { type WalletViewDto } from "./sdk/WalletViewDto";
import { useWalletCurrenciesQuerySource } from "./MyWalletQuerySources";
import { strings } from "./strings/translations";

// Self-service create form: currency + an optional label only - ownerType is always
// "user" here (see MyWalletEntityManager.tsx), unlike the admin AdminCreateWalletForm,
// which also picks a target user/workspace and ownerType. Whether this form is even
// reachable at all is decided one level up, by MyWalletsArchiveScreen's own
// allowUserCreateWallet capability check - createWallet itself re-enforces the same
// flag server-side regardless.
export const MyWalletCreateForm = ({
  form,
}: EntityFormProps<Partial<WalletViewDto>>) => {
  const { values, setFieldValue, errors } = form;
  const s = useS(strings);

  return (
    <>
      <FormSelect
        querySource={useWalletCurrenciesQuerySource}
        keyExtractor={(item: any) => item?.code}
        fnLabelFormat={(item: any) => `${item?.name} (${item?.code})`}
        value={(values as any).currencySelection}
        onChange={(item: any) => {
          setFieldValue("currencySelection", item || undefined, false);
          setFieldValue(
            "currency",
            item ? item.code : undefined,
            false,
          );
        }}
        errorMessage={errors.currency as string}
        label={s.myWallets.currency}
      />
      <FormText
        value={values.label}
        onChange={(value) => setFieldValue("label", value, false)}
        errorMessage={errors.label as string}
        label={s.myWallets.label}
      />
    </>
  );
};
