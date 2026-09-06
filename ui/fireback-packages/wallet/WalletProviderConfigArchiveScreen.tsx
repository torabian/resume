import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { WalletProviderConfigList } from "./WalletProviderConfigList";
import { CommonArchiveManager } from "@fireback/ui-core/components/entity-manager/CommonArchiveManager";
import { WalletProviderConfigNavigation } from "./WalletNavigation";

export const WalletProviderConfigArchiveScreen = () => {
  const s = useS(strings);

  return (
    <CommonArchiveManager
      pageTitle={s.walletProviderConfigs.archiveTitle}
      newEntityHandler={({ locale, router }) => {
        router.push(WalletProviderConfigNavigation.create());
      }}
    >
      <WalletProviderConfigList />
    </CommonArchiveManager>
  );
};
