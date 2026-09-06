import { Route } from "react-router-dom";
import { WorkspaceMemberNavigation } from "@fireback/ui-core/sdk/navigation/AbacNavigation";
import { WorkspaceMemberArchiveScreen } from "./WorkspaceMemberArchiveScreen";

// List-only: unlike role/user-invitation/etc., a membership row has no standalone
// create/edit/single screen here - a member is added via the invite flow
// (WorkspaceInvite), not created directly from this list.
export function useWorkspaceMemberRoutes() {
  return (
    <>
      <Route
        element={<WorkspaceMemberArchiveScreen />}
        path={WorkspaceMemberNavigation.Rquery}
      ></Route>
    </>
  );
}
