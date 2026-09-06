import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { createQuerySource } from "@fireback/ui-core/hooks/useAsQuery";
import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import {
  useUsersQuerySource,
  useWorkspacesQuerySource,
  useWalletCurrenciesQuerySource,
} from "./AdminCreateWalletQuerySources";
import type { EntityFormProps } from "@fireback/ui-core/types/EntityManagement";

// Not a generic entity form (wallet has no update action - see Wallet.emi.yml's
// features override on the wallet entity) - this only ever backs a create screen for
// AdminCreateWalletAction, admin-only, targeting any user or workspace rather than the
// caller themselves (walletpublic's owner-facing createWallet).
export const AdminCreateWalletForm = ({ form }: EntityFormProps<any>) => {
  const { values, setFieldValue, errors } = form;
  const s = useS(strings);

  const ownerTypeSource = createQuerySource([
    { name: s.wallets.ownerUser, uniqueId: "user" },
    { name: s.wallets.ownerWorkspace, uniqueId: "workspace" },
    { name: s.wallets.ownerWorkspaceUser, uniqueId: "workspaceUser" },
  ]);

  return (
    <>
      <FormSelect
        querySource={ownerTypeSource}
        keyExtractor={(v: any) => v.uniqueId}
        fnLabelFormat={(v: any) => v.name}
        value={values.ownerType}
        onChange={(item: any) => {
          setFieldValue("ownerType", item ? item.uniqueId : undefined, false);
          // Clear whichever target field no longer applies, so a stale
          // userId/workspaceId from a prior selection can't sneak through.
          setFieldValue("userId", undefined, false);
          setFieldValue("workspaceId", undefined, false);
        }}
        errorMessage={errors.ownerType as string}
        label={s.wallets.ownerType}
        hint={s.wallets.ownerTypeHint}
      />

      {values.ownerType === "workspace" ? (
        <FormSelect
          querySource={useWorkspacesQuerySource}
          keyExtractor={(item: any) => item.uniqueId}
          fnLabelFormat={(item: any) => item.name}
          value={values.workspaceId}
          onChange={(item: any) =>
            setFieldValue("workspaceId", item ? item.uniqueId : undefined, false)
          }
          errorMessage={errors.workspaceId as string}
          label={s.wallets.workspace}
          placeholder={s.wallets.selectWorkspace}
        />
      ) : values.ownerType === "workspaceUser" ? (
        <>
          <FormSelect
            querySource={useUsersQuerySource}
            keyExtractor={(item: any) => item.uniqueId}
            fnLabelFormat={(item: any) =>
              [item.firstName, item.lastName].filter(Boolean).join(" ") ||
              item.uniqueId
            }
            value={values.userId}
            onChange={(item: any) =>
              setFieldValue("userId", item ? item.uniqueId : undefined, false)
            }
            errorMessage={errors.userId as string}
            label={s.wallets.user}
            placeholder={s.wallets.selectUser}
          />
          <FormSelect
            querySource={useWorkspacesQuerySource}
            keyExtractor={(item: any) => item.uniqueId}
            fnLabelFormat={(item: any) => item.name}
            value={values.workspaceId}
            onChange={(item: any) =>
              setFieldValue(
                "workspaceId",
                item ? item.uniqueId : undefined,
                false,
              )
            }
            errorMessage={errors.workspaceId as string}
            label={s.wallets.workspace}
            hint={s.wallets.workspaceUserHint}
            placeholder={s.wallets.selectWorkspace}
          />
        </>
      ) : (
        <FormSelect
          querySource={useUsersQuerySource}
          keyExtractor={(item: any) => item.uniqueId}
          fnLabelFormat={(item: any) =>
            [item.firstName, item.lastName].filter(Boolean).join(" ") ||
            item.uniqueId
          }
          value={values.userId}
          onChange={(item: any) =>
            setFieldValue("userId", item ? item.uniqueId : undefined, false)
          }
          errorMessage={errors.userId as string}
          label={s.wallets.user}
          placeholder={s.wallets.selectUser}
        />
      )}

      <FormSelect
        querySource={useWalletCurrenciesQuerySource}
        keyExtractor={(item: any) => item.code}
        fnLabelFormat={(item: any) => `${item.name} (${item.code})`}
        value={values.currency}
        onChange={(item: any) =>
          setFieldValue("currency", item ? item.code : undefined, false)
        }
        errorMessage={errors.currency as string}
        label={s.wallets.currency}
        hint={s.wallets.currencyHint}
        placeholder={s.wallets.selectCurrency}
      />

      <FormText
        id="wallet-label-input"
        value={values.label}
        onChange={(value) => setFieldValue("label", value, false)}
        errorMessage={errors.label as string}
        label={s.wallets.label}
        hint={s.wallets.labelHint}
      />
    </>
  );
};
