import type { QueryUserRoleWorkspacesActionRes } from "@fireback/ui-core/sdk/abac/QueryUserRoleWorkspacesAction";
import { CapabilityDto } from "@fireback/ui-core/sdk/abac/CapabilityDto";
import type { MArray } from "@fireback/js-remote-ctx/common/operators";

/**
 * Whether one granted capability string satisfies a required permission
 * key, using the backend's own wildcard convention (`"*"` = full
 * access, `"<prefix>.*"` = anything under prefix - see
 * modules/abac/Permissions.go's MeetsCheck) rather than treating the
 * capability as a real regex.
 *
 * A blank/empty capability never grants anything here. That matters because
 * it's a real, actively-occurring value, not just a hypothetical: a bare
 * workspace member (no real WorkspaceRoleEntity row, e.g. a workspace
 * created without a typeId) still gets one row back from
 * GetUserAccessLevels/GetWorkspaceAndUserAccesses's `LEFT JOIN LATERAL`,
 * with a NULL capability_id that arrives here as `""` - see
 * [[fireback-blank-capability-permission-bypass]]. The backend's own
 * MeetsCheck has a matching bug where that blank entry satisfies every
 * permission check (`strings.Contains(x, "")` is always true) - not fixed
 * there (a large chunk of modules/abac/tests relies on the gap on purpose),
 * but there's no such constraint here: menu-item visibility filtering has
 * every reason to treat "no real capability" as "no access", not "access to
 * everything".
 */
function capabilityGrants(capability: string | undefined, perm: string): boolean {
  if (!capability) {
    return false;
  }
  if (capability === perm || capability === "*") {
    return true;
  }
  return capability.endsWith(".*") && perm.includes(capability.replace("*", ""));
}

function anyCapabilityGrants(
  capabilities: (string | undefined)[] | undefined,
  perm: string,
): boolean {
  return (capabilities || []).some((c) => capabilityGrants(c, perm));
}

export function userMeetsAccess(urw: any, perm: string): boolean {
  return anyCapabilityGrants(
    ((urw?.role?.capabilities || []) as CapabilityDto[]).map(
      (item) => item.uniqueId,
    ),
    perm,
  );
}

export function userMeetsAccess2(
  state: { roleId: string; workspaceId: string },
  urw: QueryUserRoleWorkspacesActionRes[],
  perm: string,
): boolean {
  if (!state) {
    return false;
  }

  const workspace = urw.find((item) => item.uniqueId === state.workspaceId);

  // If there is no workspace, then there is no chance that user meets any permission there
  if (!workspace) {
    return false;
  }

  const workspaceMeets = anyCapabilityGrants(workspace.capabilities, perm);

  const role = ((workspace.roles as MArray<any>).get() || []).find(
    (role) => role.uniqueId === state.roleId,
  );

  // If there is not role, means there is no chance.
  if (!role) {
    return false;
  }

  const roleMeets = anyCapabilityGrants(role.capabilities, perm);

  return workspaceMeets && roleMeets;
}
