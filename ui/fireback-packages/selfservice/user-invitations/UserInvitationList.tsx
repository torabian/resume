import { useS } from "@fireback/ui-core/hooks/useS";
import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { strings } from "./strings/translations";
import { userInvitationColumns } from "./UserInvitationColumns";

import { commonDialogs } from "@fireback/overlay/dom";
import { type UserInvitationsActionResType as UserInvitationsQueryColumns } from "@fireback/selfservice/sdk/abac/UserInvitationsAction";
import {
  useAcceptInviteAction,
  AcceptInviteActionReq,
} from "@fireback/selfservice/sdk/abac/AcceptInviteAction";
import { useUserInvitationsActionQuery } from "@fireback/selfservice/sdk/abac/UserInvitationsAction";
import { createUdfBrowseQueryHook } from "@fireback/ui-core/hooks/useUdfBrowseQuery";

export const UserInvitationList = () => {
  const s = useS(strings);

  const { confirmModal } = commonDialogs();

  const mutation = useAcceptInviteAction();

  const onAccept = (dto: UserInvitationsQueryColumns) => {
    confirmModal({
      title: s.confirmAcceptTitle,
      description: s.confirmAcceptDescription,
      confirmLabel: s.acceptBtn,
    }).promise.then((result) => {
      if (result.type !== "resolved") return;

      return mutation
        .mutateAsync(
          new AcceptInviteActionReq({ invitationUniqueId: dto.uniqueId }),
        )
        .then((res) => {
          alert(s.successful);
        });
    });
  };

  const onReject = (dto: UserInvitationsQueryColumns) => {
    confirmModal({
      title: s.confirmRejectTitle,
      description: s.confirmRejectDescription,
      confirmLabel: s.acceptBtn,
    });
  };

  return (
    <>
      <CommonListManager
        columns={userInvitationColumns(s, onAccept, onReject)}
        queryHook={createUdfBrowseQueryHook(useUserInvitationsActionQuery)}
      ></CommonListManager>
    </>
  );
};
