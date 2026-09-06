import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { WalletCurrencyList } from "./WalletCurrencyList";
import { CommonArchiveManager } from "@fireback/ui-core/components/entity-manager/CommonArchiveManager";
import { WalletCurrencyNavigation } from "./WalletNavigation";

export const WalletCurrencyArchiveScreen = () => {
  const s = useS(strings);

  return (
    <CommonArchiveManager
      pageTitle={s.walletCurrencies.archiveTitle}
      newEntityHandler={({ locale, router }) => {
        router.push(WalletCurrencyNavigation.create());
      }}
    >
      <WalletCurrencyList />
    </CommonArchiveManager>
  );
};
