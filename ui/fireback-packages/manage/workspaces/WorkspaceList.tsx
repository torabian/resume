import { useWorkspaceAwareDeleteAction } from "@fireback/manage/sdk/abac/WorkspaceAwareDeleteAction";
import { useWorkspaceBrowseActionQuery } from "@fireback/manage/sdk/abac/WorkspaceBrowseAction";
import { strings as uiStrings } from "@fireback/ui-core/components/strings/translations";
import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";

import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { createUdfBrowseQueryHook } from "@fireback/ui-core/hooks/useUdfBrowseQuery";
import { WorkspaceNavigation } from "@fireback/ui-core/sdk/navigation/AbacNavigation";
import { columns } from "./WorkspaceColumns";

export const WorkspaceList = () => {
  const s = useS(strings);
  const uiS = useS(uiStrings);
  const uniqueIdHrefHandler = (uniqueId: string) =>
    WorkspaceNavigation.single(uniqueId);

  return (
    <>
      <CommonListManager
        columns={columns(s, uiS)}
        queryHook={createUdfBrowseQueryHook(useWorkspaceBrowseActionQuery)}
        deleteHook={useWorkspaceAwareDeleteAction}
        onRecordsDeleted={({ queryClient }) => {
          queryClient.invalidateQueries("*fireback.UserRoleWorkspace");
          queryClient.invalidateQueries("*fireback.WorkspaceEntity");
        }}
        uniqueIdHrefHandler={uniqueIdHrefHandler}
      ></CommonListManager>
    </>
  );
};
