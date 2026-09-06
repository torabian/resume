import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { useWalletPaymentAttemptBrowseActionQuery } from "./sdk/WalletPaymentAttemptBrowseAction";
import { useS } from "@fireback/ui-core/hooks/useS";
import { columns } from "./WalletPaymentAttemptColumns";
import { strings } from "./strings/translations";
import { WalletPaymentAttemptNavigation } from "./WalletNavigation";

export const WalletPaymentAttemptList = () => {
  const s = useS(strings);

  return (
    <CommonListManager
      columns={columns(s)}
      queryHook={useWalletPaymentAttemptBrowseActionQuery}
      uniqueIdHrefHandler={(uniqueId: string) =>
        WalletPaymentAttemptNavigation.single(uniqueId)
      }
      help={s.help.walletPaymentAttempts}
    ></CommonListManager>
  );
};
