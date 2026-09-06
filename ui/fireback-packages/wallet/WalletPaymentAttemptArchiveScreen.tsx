import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { WalletPaymentAttemptList } from "./WalletPaymentAttemptList";
import { CommonArchiveManager } from "@fireback/ui-core/components/entity-manager/CommonArchiveManager";

export const WalletPaymentAttemptArchiveScreen = () => {
  const s = useS(strings);

  return (
    <CommonArchiveManager pageTitle={s.walletPaymentAttempts.archiveTitle}>
      <WalletPaymentAttemptList />
    </CommonArchiveManager>
  );
};
