import { useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useQueryUserRoleWorkspacesActionQuery } from "@fireback/ui-core/sdk/abac/QueryUserRoleWorkspacesAction";
import { useAuthentication } from "@fireback/auth-client";
import type { MArray } from "@fireback/js-remote-ctx/common/operators";
import { useS } from "../../hooks/useS";
import { strings } from "../strings/translations";
import type { MenuItem } from "../../types/MenuItem";
import { useRouter } from "../../hooks/useRouter";
import { BUILD_VARIABLES } from "../../hooks/build-variables";
import { useLocale } from "../../hooks/useLocale";
import { getTStringValue } from "../../types/TString";
import {
  getRememberedWorkspaceRoute,
  rememberWorkspaceRoute,
  workspaceRouteKey,
} from "./workspaceLastRoute";

export enum MacTagsColor {
  Green = "#00bd00",
  Red = "#ff0313",
  Orange = "#fa7a00",
  Yellow = "#f4b700",
  Blue = "#0072ff",
  Purple = "#ad41d1",
  Grey = "#717176",
}

/**
 * It computes the menu items related to the workspaces, and active role generally
 * used for the sidebar and returns them as MenuItem
 * @param param0
 * @returns
 */
export function useWorkspacesMenuPresenter() {
  const s = useS(strings);
  // Reactive (useSyncExternalStore-backed, see useLocale.ts) - unlike the plain
  // getLocale() this used to call directly, reading `locale` here makes this
  // component actually re-render when the user switches language elsewhere in
  // the app (personal-settings/InterfaceSettings.tsx). It also needs to be part
  // of recomputeKey below, since role names are resolved per-locale into the
  // memoized `menus` array itself.
  const { locale } = useLocale();
  const { selectedWorkspace, selectWorkspace, session } = useAuthentication();
  const { replace, asPath } = useRouter();
  const queryClient = useQueryClient();
  // `menus` below is memoized on `recomputeKey`, which doesn't change on
  // every navigation - so an onClick closure that captured `asPath`
  // directly would keep whatever path was current the *last time the menu
  // recomputed*, not the path the user is actually on when they click (that
  // recompute happens to be triggered by selectWorkspace() itself, so the
  // stale value only ever catches up one switch late - "leaving" a
  // workspace only remembered the right route starting from the *second*
  // time you left it). A ref always reads the latest value regardless of
  // when the closure was created.
  const asPathRef = useRef(asPath);
  asPathRef.current = asPath;

  const queryUrw = useQueryUserRoleWorkspacesActionQuery({
    enabled: !!session?.token,
  });

  const items = queryUrw.data?.data?.items || [];
  const recomputeKey =
    (items || []).map((item) => item.uniqueId).join("-") +
    "_" +
    selectedWorkspace?.roleId +
    "_" +
    selectedWorkspace?.workspaceId +
    "_" +
    locale;

  const menus: MenuItem[] = useMemo(() => {
    const workspacesAndRolesList: MenuItem[] = [];
    items.forEach((workspace) => {
      (workspace.roles as MArray<any>).get().forEach((role) => {
        // role.name and workspace.name are both complexes.TString now (a locale ->
        // text map) - resolve each to the viewer's own locale rather than
        // template-stringifying the raw {en, fa, ...} object into "[object
        // Object]".
        const roleName = getTStringValue(role.name, locale);
        const workspaceName = getTStringValue(workspace.name, locale);
        workspacesAndRolesList.push({
          key: `${role.uniqueId}_${workspace.uniqueId}`,
          label: `${workspaceName} (${roleName})`,
          children: [],
          forceActive:
            selectedWorkspace?.roleId === role.uniqueId &&
            selectedWorkspace?.workspaceId === workspace.uniqueId,
          color:
            workspace.uniqueId === "root"
              ? MacTagsColor.Orange
              : MacTagsColor.Green,
          onClick: () => {
            // Remember where we were before leaving the *current* workspace,
            // so switching back to it later can return here instead of
            // always landing on the default route.
            rememberWorkspaceRoute(
              workspaceRouteKey(
                selectedWorkspace?.roleId,
                selectedWorkspace?.workspaceId,
              ),
              asPathRef.current,
            );

            selectWorkspace({
              roleId: role.uniqueId,
              workspaceId: workspace.uniqueId,
            });

            // Workspace/role scoping (this menu's own useCteAppMenusActionQuery
            // included - see useRemoteMenuResolver) is applied purely through
            // request headers built from `selectedWorkspace`, never through the
            // query key itself. React Query has no way to know a cached
            // response is now for the *wrong* workspace, and nothing else
            // refetches it on its own (no route/component remount happens here,
            // and default staleTime is per-query, not "invalidate on this
            // unrelated state change") - so every query has to be explicitly
            // told its cached data is stale whenever the active workspace
            // changes. Invalidating everything rather than just the menu query,
            // since the exact same staleness applies to any other
            // workspace-scoped data (lists, entity reads, ...) currently
            // mounted elsewhere in the app.
            queryClient.invalidateQueries();

            // The page we're currently on may not exist, or may not be
            // accessible, in the newly selected workspace (different
            // capabilities/role, different data) - so switching workspace
            // sends the user to the last route we saw them on *in that
            // workspace*, if we've ever recorded one, and falls back to the
            // product's default route otherwise.
            const to =
              getRememberedWorkspaceRoute(
                workspaceRouteKey(role.uniqueId, workspace.uniqueId),
              ) ||
              BUILD_VARIABLES.DEFAULT_ROUTE ||
              "/";
            replace(to, to);
          },
        });
      });
    });

    return [
      {
        // Stable, locale-independent identity - Sidebar.tsx renders this group
        // fixed above the (drag-)sortable ones rather than folding it into
        // that list, but it's kept in case a future caller ever needs to
        // identify it without relying on the translated label text.
        key: "workspaces-switcher",
        label: s.workspacesSideTitle,
        children: workspacesAndRolesList.sort((a, b) =>
          a.key < b.key ? -1 : 1,
        ),
      },
    ];
  }, [recomputeKey]);

  return { menus };
}
