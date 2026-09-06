import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { WalletGatewayList } from "./WalletGatewayList";
import { CommonArchiveManager } from "@fireback/ui-core/components/entity-manager/CommonArchiveManager";
import { WalletGatewayNavigation } from "./WalletNavigation";

export const WalletGatewayArchiveScreen = () => {
  const s = useS(strings);

  return (
    <CommonArchiveManager
      pageTitle={s.walletGateways.archiveTitle}
      newEntityHandler={({ locale, router }) => {
        router.push(WalletGatewayNavigation.create());
      }}
    >
      <WalletGatewayList />
    </CommonArchiveManager>
  );
};
