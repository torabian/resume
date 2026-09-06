import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { useWalletCurrencyBrowseActionQuery } from "./sdk/WalletCurrencyBrowseAction";
import { useWalletCurrencyAwareDeleteAction } from "./sdk/WalletCurrencyAwareDeleteAction";
import { useS } from "@fireback/ui-core/hooks/useS";
import { columns } from "./WalletCurrencyColumns";
import { strings } from "./strings/translations";
import { WalletCurrencyNavigation } from "./WalletNavigation";

export const WalletCurrencyList = () => {
  const s = useS(strings);

  return (
    <CommonListManager
      columns={columns(s)}
      queryHook={useWalletCurrencyBrowseActionQuery}
      uniqueIdHrefHandler={(uniqueId: string) =>
        WalletCurrencyNavigation.single(uniqueId)
      }
      deleteHook={useWalletCurrencyAwareDeleteAction}
      help={s.help.walletCurrencies}
    ></CommonListManager>
  );
};
