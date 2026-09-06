import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { createUdfBrowseQueryHook } from "@fireback/ui-core/hooks/useUdfBrowseQuery";
import { useMyWalletsActionQuery } from "./sdk/MyWalletsAction";
import { columns } from "./MyWalletsColumns";
import { strings } from "./strings/translations";
import { MyWalletNavigation } from "./MyWalletNavigation";

// The caller's own user-owned wallets (MyWalletsAction - see WalletPublic.emi.yml). No
// delete/create here - wallets the caller doesn't already have are auto-provisioned by
// MyWalletsAction itself from walletConfig.defaultUserWallets (see
// MyWalletsImplementation.go), so there is always at least the root-mandated default
// set to show, and nothing self-service to remove.
export const MyWalletsList = () => {
  const s = useS(strings);
  const router = useRouter();

  return (
    <CommonListManager
      columns={columns(s, (walletId) =>
        router.push(MyWalletNavigation.topup(walletId)),
      )}
      queryHook={createUdfBrowseQueryHook(useMyWalletsActionQuery)}
      uniqueIdHrefHandler={(uniqueId: string) =>
        MyWalletNavigation.single(uniqueId)
      }
      help={s.help.myWallets}
    ></CommonListManager>
  );
};
