import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { usePrepaidBrowseActionQuery } from "./sdk/PrepaidBrowseAction";
import { usePrepaidAwareDeleteAction } from "./sdk/PrepaidAwareDeleteAction";
import { useS } from "@fireback/ui-core/hooks/useS";
import { columns } from "./PrepaidColumns";
import { strings } from "./strings/translations";
import { PrepaidNavigation } from "./WalletNavigation";

export const PrepaidList = () => {
  const s = useS(strings);

  return (
    <CommonListManager
      columns={columns(s)}
      queryHook={usePrepaidBrowseActionQuery}
      uniqueIdHrefHandler={(uniqueId: string) => PrepaidNavigation.single(uniqueId)}
      deleteHook={usePrepaidAwareDeleteAction}
      help={s.help.prepaids}
    ></CommonListManager>
  );
};
