import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { useS } from "@fireback/ui-core/hooks/useS";
import { useWalletBrowseActionQuery } from "./sdk/WalletBrowseAction";
import { useWalletAwareDeleteAction } from "./sdk/WalletAwareDeleteAction";
import { columns } from "./WalletColumns";
import { strings } from "./strings/translations";
import { WalletNavigation } from "./WalletNavigation";

// Admin/root view over every wallet, across every owner - see WalletBrowseAction (root
// permission-gated on the Go side, WalletBrowseAction/WalletAdminImplementation.go).
// There is no per-row edit here (wallet has no update action) - clicking a row opens
// the read-only WalletSingleScreen (which itself links into adjustBalance) instead.
export const WalletList = () => {
  const s = useS(strings);

  return (
    <CommonListManager
      columns={columns(s)}
      queryHook={useWalletBrowseActionQuery}
      uniqueIdHrefHandler={(uniqueId: string) =>
        WalletNavigation.single(uniqueId)
      }
      deleteHook={useWalletAwareDeleteAction}
      help={s.help.wallets}
    ></CommonListManager>
  );
};
