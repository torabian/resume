import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { useWalletGatewayBrowseActionQuery } from "./sdk/WalletGatewayBrowseAction";
import { useWalletGatewayAwareDeleteAction } from "./sdk/WalletGatewayAwareDeleteAction";
import { useS } from "@fireback/ui-core/hooks/useS";
import { columns } from "./WalletGatewayColumns";
import { strings } from "./strings/translations";
import { WalletGatewayNavigation } from "./WalletNavigation";

export const WalletGatewayList = () => {
  const s = useS(strings);

  return (
    <CommonListManager
      columns={columns(s)}
      queryHook={useWalletGatewayBrowseActionQuery}
      uniqueIdHrefHandler={(uniqueId: string) =>
        WalletGatewayNavigation.single(uniqueId)
      }
      deleteHook={useWalletGatewayAwareDeleteAction}
      help={s.help.walletGateways}
    ></CommonListManager>
  );
};
