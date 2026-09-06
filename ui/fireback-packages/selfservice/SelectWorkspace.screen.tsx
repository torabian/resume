import { useAuthentication } from "@fireback/auth-client";
import type { MArray } from "@fireback/js-remote-ctx/common/operators";
import { useQueryUserRoleWorkspacesActionQuery } from "@fireback/selfservice/sdk/abac/QueryUserRoleWorkspacesAction";
import { QueryErrorView } from "@fireback/ui-core/components/error-view/QueryError";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { usePresenter } from "./SelectWorkspace.presenter";

export const SelectWorkspaceScreen = () => {
  const { s } = usePresenter();
  const queryUrw = useQueryUserRoleWorkspacesActionQuery({});

  const items = queryUrw.data?.data?.items || [];
  const { selectWorkspace } = useAuthentication();

  return (
    <div className="signin-form-container">
      <div className="mb-4">
        <h1 className="h3">{s.selectWorkspaceTitle}</h1>
        <p className="text-muted">{s.selectWorkspace}</p>
      </div>

      {/* Previously nothing at all rendered here on failure - just a blank
          screen below the title, with no indication anything had gone
          wrong and no way to retry short of a full page reload. Same
          error box + Retry button every other screen in this app gets via
          CommonListManager/CommonSingleManager/CommonEntityManager - this
          screen is none of those (a plain useQuery, no entity-manager
          wrapper), so QueryErrorView is wired in directly instead. */}
      <QueryErrorView query={queryUrw} />

      {(items || []).map((workspace) => (
        <div key={workspace.uniqueId} className="mb-4">
          {/* workspace.name is complexes.TString now (a locale -> text map) -
              resolve to the viewer's own locale rather than handing React the
              raw {en, fa, ...} object (React can't render an object as a
              child at all), same as role.name just below. */}
          <h2 className="h5">{getTStringValue(workspace.name, getLocale())}</h2>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {(workspace.roles as MArray<any>).get().map((role) => (
              <button
                key={role.uniqueId}
                className="btn btn-outline-primary w-100"
                onClick={() =>
                  selectWorkspace({
                    workspaceId: workspace.uniqueId,
                    roleId: role.uniqueId,
                  })
                }
              >
                {/* role.name is complexes.TString now (a locale -> text map) -
                    resolve to the viewer's own locale rather than handing React
                    the raw {en, fa, ...} object. */}
                {s.select} ({getTStringValue(role.name, getLocale())})
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
