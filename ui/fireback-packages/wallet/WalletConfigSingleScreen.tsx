import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useS } from "@fireback/ui-core/hooks/useS";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { strings } from "./strings/translations";
import { useGetWalletConfigActionQuery } from "./sdk/GetWalletConfigAction";

export const WalletConfigSingleScreen = () => {
  const router = useRouter();
  const getSingleHook = useGetWalletConfigActionQuery({});
  const d = getSingleHook.data?.data?.item;

  const s = useS(strings);

  return (
    <CommonSingleManager
      editEntityHandler={() => {
        router.push("../wallet-config/edit");
      }}
      noBack
      disableOnGetFailed
      getSingleHook={getSingleHook}
    >
      <GeneralEntityView
        title={s.walletConfigs.title}
        description={s.walletConfigs.description}
        entity={d}
        fields={[
          {
            elem: d?.maxWalletsPerUser,
            label: s.walletConfigs.maxWalletsPerUser,
          },
          {
            elem: d?.maxWalletsPerWorkspace,
            label: s.walletConfigs.maxWalletsPerWorkspace,
          },
          {
            elem: d?.maxWalletsPerUserPerCurrency,
            label: s.walletConfigs.maxWalletsPerUserPerCurrency,
          },
          {
            elem: d?.maxWalletsPerWorkspacePerCurrency,
            label: s.walletConfigs.maxWalletsPerWorkspacePerCurrency,
          },
          {
            elem: d?.allowUserCreateWallet,
            label: s.walletConfigs.allowUserCreateWallet,
          },
          {
            // defaultUserWallets comes back wrapped in MArray (see
            // sdk/sdk/common/operators.ts) - .get() unwraps it to the plain T[] every
            // other array field on this page's fields already implicitly gets via
            // GeneralEntityView's own d?.field reads. Array.isArray guards a bare array
            // too, in case a caller already round-tripped it through JSON (which
            // MArray's own toJSON makes equivalent to a plain array).
            elem: (Array.isArray(d?.defaultUserWallets)
              ? d?.defaultUserWallets
              : (d?.defaultUserWallets as any)?.get?.() || []
            )
              .map((row: any) => row?.currency?.code)
              .filter(Boolean)
              .join(", "),
            label: s.walletConfigs.defaultUserWallets,
          },
        ]}
      />
    </CommonSingleManager>
  );
};
