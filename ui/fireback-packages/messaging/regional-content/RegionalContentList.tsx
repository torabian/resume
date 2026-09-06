import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { useRegionalContentBrowseActionQuery } from "@fireback/messaging/sdk/messaging/RegionalContentBrowseAction";
import { useRegionalContentAwareDeleteAction } from "@fireback/messaging/sdk/messaging/RegionalContentAwareDeleteAction";
import { useS } from "@fireback/ui-core/hooks/useS";
import { RegionalContentDto } from "@fireback/messaging/sdk/messaging/RegionalContentDto";
import { RegionalContentNavigation } from "@fireback/ui-core/sdk/navigation/MessagingNavigation";
import { columns } from "./RegionalContentColumns";
import { strings } from "./strings/translations";
import { createUdfBrowseQueryHook } from "@fireback/ui-core/hooks/useUdfBrowseQuery";
export const RegionalContentList = () => {
  const s = useS(strings);
  return (
    <>
      <CommonListManager
        columns={columns(s)}
        queryHook={createUdfBrowseQueryHook(
          useRegionalContentBrowseActionQuery,
        )}
        uniqueIdHrefHandler={(uniqueId: string) =>
          RegionalContentNavigation.single(uniqueId)
        }
        deleteHook={useRegionalContentAwareDeleteAction}
      ></CommonListManager>
    </>
  );
};
