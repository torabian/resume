import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { useWalletEventBrowseActionQuery } from "./sdk/WalletEventBrowseAction";
import { useS } from "@fireback/ui-core/hooks/useS";
import { columns } from "./WalletEventColumns";
import { strings } from "./strings/translations";
import { WalletEventNavigation } from "./WalletNavigation";

export const WalletEventList = () => {
  const s = useS(strings);

  return (
    <CommonListManager
      columns={columns(s)}
      queryHook={useWalletEventBrowseActionQuery}
      uniqueIdHrefHandler={(uniqueId: string) =>
        WalletEventNavigation.single(uniqueId)
      }
      help={s.help.walletEvents}
    ></CommonListManager>
  );
};
