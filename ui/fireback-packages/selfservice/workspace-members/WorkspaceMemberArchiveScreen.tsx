import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { WorkspaceMemberList } from "./WorkspaceMemberList";
import { CommonArchiveManager } from "@fireback/ui-core/components/entity-manager/CommonArchiveManager";

export const WorkspaceMemberArchiveScreen = () => {
  const s = useS(strings);

  return (
    <>
      <CommonArchiveManager pageTitle={s.menuTitle}>
        <WorkspaceMemberList />
      </CommonArchiveManager>
    </>
  );
};
