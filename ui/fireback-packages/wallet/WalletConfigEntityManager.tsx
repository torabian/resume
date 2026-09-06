import {
  CommonEntityManager,
  type DtoEntity,
} from "@fireback/ui-core/components/entity-manager/CommonEntityManager";
import { useCommonEntityManager } from "@fireback/ui-core/hooks/useCommonEntityManager";
import { useS } from "@fireback/ui-core/hooks/useS";
import { useGetWalletConfigActionQuery } from "./sdk/GetWalletConfigAction";
import { useUpdateWalletConfigAction } from "./sdk/UpdateWalletConfigAction";
import { WalletConfigDto } from "./sdk/WalletConfigDto";
import { WalletConfigForm } from "./WalletConfigEditForm";
import { strings } from "./strings/translations";

// MOne's own toJSON() only emits the bare, fully-populated object when its operation
// is "replace" - a GET response's own currency sub-object comes back some other way
// (still an MOne instance with .get() rather than a plain object) even after
// CommonEntityManager's JSON.parse(JSON.stringify(rawItem)) roundtrip, the same
// "unwrap MOne/MArray when reading nested one/array fields" gotcha fixed elsewhere
// this session (see PrepaidSingleScreen.tsx's own unwrapOne, WalletConfigSingleScreen's
// defaultUserWallets fix) - without this, WalletConfigForm's multi-select rendered
// "undefined undefined" for every row despite the API response itself carrying the
// currency's name/code just fine.
function unwrapOne(value: any): any {
  return value && typeof value.get === "function" ? value.get() : value;
}

// walletConfig is a single, root-only settings row (see Wallet.emi.yml's
// features.actions:false override) - same shape as WorkspaceConfigEntityManager/
// MessagingConfigEntityManager: forceEdit (there is no separate create screen), no
// uniqueId in the route, get+update only.
export const WalletConfigEntityManager = ({
  data,
}: DtoEntity<WalletConfigDto>) => {
  const s = useS(strings);
  const { router, locale } = useCommonEntityManager<Partial<WalletConfigDto>>({
    data,
  });

  const getSingleHook = useGetWalletConfigActionQuery({});
  const patchHook = useUpdateWalletConfigAction({});

  return (
    <CommonEntityManager
      patchHook={patchHook}
      getSingleHook={getSingleHook}
      disableOnGetFailed
      forceEdit
      onCancel={() => {
        router.goBackOrDefault("../wallet-config");
      }}
      onFinishUriResolver={() => "../wallet-config"}
      customClass="w-100"
      Form={WalletConfigForm}
      // beforeSetValues: the GET response's defaultUserWallets is
      // [{currency: {...fully populated currency...}}] (see
      // WalletConfigDtoDefaultUserWallets on the Go side) - flatten it to a plain
      // array of currency objects, which is what the multi-select in
      // WalletConfigEditForm actually reads.
      beforeSetValues={(item: any) => ({
        ...item,
        defaultUserWallets: (item?.defaultUserWallets || []).map(
          (row: any) => unwrapOne(row.currency),
        ),
      })}
      // beforeSubmit: the reverse, at the PATCH boundary - a flat array of currency
      // objects back into the [{currency: {__operation:"select", __selector:
      // uniqueId}}] shape UpdateWalletConfigAction's defaultUserWallets field expects
      // (see WalletConfigImplementation.go/updateWalletConfigDefaultUserWallets - only
      // "select" by uniqueId is supported, never an inline value).
      beforeSubmit={(data: any) => ({
        ...data,
        defaultUserWallets: Array.isArray(data?.defaultUserWallets)
          ? data.defaultUserWallets.map((currency: any) => ({
              currency: {
                __operation: "select",
                __selector: currency?.uniqueId,
              },
            }))
          : data?.defaultUserWallets,
      })}
      onEditTitle={s.walletConfigs.editWalletConfig}
      data={data}
    />
  );
};
