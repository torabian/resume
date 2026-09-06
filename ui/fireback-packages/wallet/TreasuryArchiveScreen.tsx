import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { TreasuryList } from "./TreasuryList";
import { CommonArchiveManager } from "@fireback/ui-core/components/entity-manager/CommonArchiveManager";
import { TreasuryNavigation } from "./WalletNavigation";

export const TreasuryArchiveScreen = () => {
  const s = useS(strings);

  return (
    <CommonArchiveManager
      pageTitle={s.treasuries.archiveTitle}
      newEntityHandler={({ locale, router }) => {
        router.push(TreasuryNavigation.create(locale));
      }}
    >
      <TreasuryList />
    </CommonArchiveManager>
  );
};
