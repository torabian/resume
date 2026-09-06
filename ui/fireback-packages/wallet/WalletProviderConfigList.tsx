import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { useWalletProviderConfigBrowseActionQuery } from "./sdk/WalletProviderConfigBrowseAction";
import { useWalletProviderConfigAwareDeleteAction } from "./sdk/WalletProviderConfigAwareDeleteAction";
import { useS } from "@fireback/ui-core/hooks/useS";
import { columns } from "./WalletProviderConfigColumns";
import { strings } from "./strings/translations";
import { WalletProviderConfigNavigation } from "./WalletNavigation";

export const WalletProviderConfigList = () => {
  const s = useS(strings);

  return (
    <CommonListManager
      columns={columns(s)}
      queryHook={useWalletProviderConfigBrowseActionQuery}
      uniqueIdHrefHandler={(uniqueId: string) =>
        WalletProviderConfigNavigation.single(uniqueId)
      }
      deleteHook={useWalletProviderConfigAwareDeleteAction}
      help={s.help.walletProviderConfigs}
    ></CommonListManager>
  );
};
