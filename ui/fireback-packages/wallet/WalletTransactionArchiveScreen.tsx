import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { WalletTransactionList } from "./WalletTransactionList";
import { CommonArchiveManager } from "@fireback/ui-core/components/entity-manager/CommonArchiveManager";

// No newEntityHandler - walletTransaction rows are only ever created by the wallet
// engine itself (purchase/adjustBalance/a topup's gatewayWebhook), never directly by an
// admin.
export const WalletTransactionArchiveScreen = () => {
  const s = useS(strings);

  return (
    <CommonArchiveManager pageTitle={s.walletTransactions.archiveTitle}>
      <WalletTransactionList />
    </CommonArchiveManager>
  );
};
