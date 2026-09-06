import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { CommonArchiveManager } from "@fireback/ui-core/components/entity-manager/CommonArchiveManager";
import { WalletList } from "./WalletList";
import { WalletNavigation } from "./WalletNavigation";

export const WalletArchiveScreen = () => {
  const s = useS(strings);
  return (
    <CommonArchiveManager
      pageTitle={s.wallets.archiveTitle}
      newEntityHandler={({ locale, router }) => {
        router.push(WalletNavigation.create());
      }}
    >
      <WalletList />
    </CommonArchiveManager>
  );
};
