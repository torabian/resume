import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { PrepaidList } from "./PrepaidList";
import { CommonArchiveManager } from "@fireback/ui-core/components/entity-manager/CommonArchiveManager";
import { PrepaidNavigation } from "./WalletNavigation";

export const PrepaidArchiveScreen = () => {
  const s = useS(strings);

  return (
    <CommonArchiveManager
      pageTitle={s.prepaids.archiveTitle}
      newEntityHandler={({ locale, router }) => {
        router.push(PrepaidNavigation.create());
      }}
    >
      <PrepaidList />
    </CommonArchiveManager>
  );
};
