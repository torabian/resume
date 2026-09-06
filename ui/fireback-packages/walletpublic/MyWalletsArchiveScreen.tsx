import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { MyWalletsList } from "./MyWalletsList";
import { CommonArchiveManager } from "@fireback/ui-core/components/entity-manager/CommonArchiveManager";
import { MyWalletNavigation } from "./MyWalletNavigation";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";

// The "New wallet" button is always shown here - whether it's actually usable (
// getWalletCapabilities.allowUserCreateWallet) is decided on the create screen itself
// (MyWalletEntityManager), not here. useActions/useNewAction (ActionMenu.tsx) only
// registers this screen's action-menu entry once, at mount - gating this button behind
// an async capability query that resolves after that first render would leave it stuck
// showing whatever the loading-state value was, never updating once the real value
// arrived (a real bug in that shared registration hook, out of scope to fix here) - so
// this screen deliberately doesn't try to know the flag at all.
export const MyWalletsArchiveScreen = () => {
  const s = useS(strings);
  const router = useRouter();

  return (
    <>
      <CommonArchiveManager
        pageTitle={s.myWallets.archiveTitle}
        newEntityHandler={({ locale }) => {
          router.push(MyWalletNavigation.create(locale));
        }}
      >
        <MyWalletsList />
      </CommonArchiveManager>
    </>
  );
};
