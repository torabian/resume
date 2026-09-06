import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { WalletEventList } from "./WalletEventList";
import { CommonArchiveManager } from "@fireback/ui-core/components/entity-manager/CommonArchiveManager";

export const WalletEventArchiveScreen = () => {
  const s = useS(strings);

  return (
    <CommonArchiveManager pageTitle={s.walletEvents.archiveTitle}>
      <WalletEventList />
    </CommonArchiveManager>
  );
};
