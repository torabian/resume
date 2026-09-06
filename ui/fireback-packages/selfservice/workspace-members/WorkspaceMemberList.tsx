import { useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@fireback/overlay";
import { commonDialogs } from "@fireback/overlay/dom";
import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { createUdfBrowseQueryHook } from "@fireback/ui-core/hooks/useUdfBrowseQuery";
import { useS } from "@fireback/ui-core/hooks/useS";
import { httpErrorHanlder } from "@fireback/ui-core/hooks/api";
import { Toast } from "@fireback/ui-core/hooks/toast";
import { strings as coreStrings } from "@fireback/ui-core/components/strings/translations";
import { strings } from "./strings/translations";
import { columns } from "./WorkspaceMemberColumns";
import {
  useBrowseWorkspaceMembersActionQuery,
  type BrowseWorkspaceMembersActionResType as WorkspaceMemberDto,
} from "@fireback/selfservice/sdk/abac/BrowseWorkspaceMembersAction";
import {
  useRemoveWorkspaceMemberAction,
  RemoveWorkspaceMemberActionReq,
} from "@fireback/selfservice/sdk/abac/RemoveWorkspaceMemberAction";
import {
  useChangeWorkspaceMemberRoleAction,
  ChangeWorkspaceMemberRoleActionReq,
} from "@fireback/selfservice/sdk/abac/ChangeWorkspaceMemberRoleAction";
import { WorkspaceMemberChangeRoleDrawer } from "./WorkspaceMemberChangeRoleDrawer";

const invalidateMembers = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries("*fireback.UserWorkspaceEntity");
  queryClient.invalidateQueries("*fireback.WorkspaceRoleEntity");
};

export const WorkspaceMemberList = () => {
  const s = useS(strings);
  const cs = useS(coreStrings);
  const { confirmModal } = commonDialogs();
  const { openDrawer } = useOverlay();
  const queryClient = useQueryClient();

  const { mutateAsync: removeMember } = useRemoveWorkspaceMemberAction({});
  const { mutateAsync: changeRole } = useChangeWorkspaceMemberRoleAction({});

  const onRemove = (member: WorkspaceMemberDto) => {
    confirmModal({
      title: s.member.removeConfirmTitle,
      description: s.member.removeConfirmDescription,
      confirmLabel: s.member.remove,
    })
      .promise.then((result) => {
        if (result.type !== "resolved") return;
        return removeMember(
          RemoveWorkspaceMemberActionReq.with({ userId: member.userId }),
        ).then(() => {
          Toast(s.member.removeSuccess, { type: "success" });
          invalidateMembers(queryClient);
        });
      })
      .catch((err) => httpErrorHanlder(err, cs));
  };

  const onChangeRole = (member: WorkspaceMemberDto) => {
    openDrawer<string>((props) => (
      <WorkspaceMemberChangeRoleDrawer {...props} />
    ))
      .promise.then(({ type, data: roleId }) => {
        if (type !== "resolved" || !roleId) return;
        return changeRole(
          ChangeWorkspaceMemberRoleActionReq.with({
            userId: member.userId,
            roleId,
          }),
        ).then(() => {
          Toast(s.member.changeRoleSuccess, { type: "success" });
          invalidateMembers(queryClient);
        });
      })
      .catch((err) => httpErrorHanlder(err, cs));
  };

  return (
    <>
      <CommonListManager
        columns={columns(s, onRemove, onChangeRole)}
        queryHook={createUdfBrowseQueryHook(useBrowseWorkspaceMembersActionQuery)}
      ></CommonListManager>
    </>
  );
};
