import { readStoredValue, writeStoredValue } from "@fireback/auth-client";

/**
 * localStorage key the per-workspace "last route" map is persisted under.
 * A single JSON object (workspace key -> path) rather than one key per
 * workspace, so it doesn't leave one stray localStorage entry behind per
 * workspace a user has ever visited.
 */
const WORKSPACE_LAST_ROUTE_STORAGE_KEY = "nima_ui_workspace_last_route";

type WorkspaceLastRouteMap = Record<string, string>;

/**
 * Same `${roleId}_${workspaceId}` shape `useWorkspacesMenuPresenter` already
 * keys its menu items with - kept as a helper here so both call sites stay
 * in sync instead of hand-building the string twice.
 */
export function workspaceRouteKey(roleId?: string, workspaceId?: string) {
  return roleId && workspaceId ? `${roleId}_${workspaceId}` : undefined;
}

/** Remembers `path` as the last route visited while `key`'s workspace was active. */
export function rememberWorkspaceRoute(
  key: string | undefined,
  path: string,
) {
  if (!key || !path) return;
  const map = readStoredValue<WorkspaceLastRouteMap>(
    WORKSPACE_LAST_ROUTE_STORAGE_KEY,
  ) ?? {};
  map[key] = path;
  writeStoredValue(WORKSPACE_LAST_ROUTE_STORAGE_KEY, map);
}

/** The last route remembered for `key`'s workspace, if any was ever recorded. */
export function getRememberedWorkspaceRoute(
  key: string | undefined,
): string | undefined {
  if (!key) return undefined;
  const map = readStoredValue<WorkspaceLastRouteMap>(
    WORKSPACE_LAST_ROUTE_STORAGE_KEY,
  );
  return map?.[key];
}
