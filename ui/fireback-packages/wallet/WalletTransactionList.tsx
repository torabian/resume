import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { useWalletTransactionBrowseActionQuery } from "./sdk/WalletTransactionBrowseAction";
import { useS } from "@fireback/ui-core/hooks/useS";
import { columns } from "./WalletTransactionColumns";
import { strings } from "./strings/translations";
import { WalletTransactionNavigation } from "./WalletNavigation";

// No deleteHook - walletTransaction is append-only (see the entity's own doc comment
// in Wallet.emi.yml), there is no AwareDelete action generated for it at all.
export const WalletTransactionList = () => {
  const s = useS(strings);

  return (
    <CommonListManager
      columns={columns(s)}
      queryHook={useWalletTransactionBrowseActionQuery}
      uniqueIdHrefHandler={(uniqueId: string) =>
        WalletTransactionNavigation.single(uniqueId)
      }
      help={s.help.walletTransactions}
    ></CommonListManager>
  );
};
