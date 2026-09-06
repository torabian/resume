import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { useTreasuryBrowseActionQuery } from "./sdk/TreasuryBrowseAction";
import { useTreasuryAwareDeleteAction } from "./sdk/TreasuryAwareDeleteAction";
import { useS } from "@fireback/ui-core/hooks/useS";
import { columns } from "./TreasuryColumns";
import { strings } from "./strings/translations";
import { TreasuryNavigation } from "./WalletNavigation";

export const TreasuryList = () => {
  const s = useS(strings);

  return (
    <CommonListManager
      columns={columns(s)}
      queryHook={useTreasuryBrowseActionQuery}
      uniqueIdHrefHandler={(uniqueId: string) =>
        TreasuryNavigation.single(uniqueId)
      }
      deleteHook={useTreasuryAwareDeleteAction}
      help={s.help.treasuries}
    ></CommonListManager>
  );
};
