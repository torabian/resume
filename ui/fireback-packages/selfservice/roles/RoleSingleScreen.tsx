import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { PageSection } from "@fireback/ui-core/components/page-section/PageSection";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { RoleNavigation } from "@fireback/ui-core/sdk/navigation/AbacNavigation";
import { useEffect, useState } from "react";
import { RolePermissionTree } from "./RolePermissionTree";
import { useRoleGetActionQuery } from "@fireback/selfservice/sdk/abac/RoleGetAction";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { getMJsonValue } from "@fireback/ui-core/types/MJsonValue";

export const RoleSingleScreen = () => {
  const router = useRouter();
  const uniqueId = router.query.uniqueId as string;
  const s = useS(strings);
  const [value, setValue] = useState<string[]>([]);

  const getSingleHook = useRoleGetActionQuery({
    params: { uniqueId },
  });

  var d = getSingleHook.data?.data.item;
  // d.name is complexes.TString now (a locale -> text map) - resolve to the
  // viewer's own locale rather than string-templating the raw object into
  // "[object Object]" (same as CapabilitySingleScreen.tsx's own name field).
  const name = getTStringValue(d?.name, getLocale());
  usePageTitle(name);

  useEffect(() => {
    // Bug fix: d.capabilitiesListId is a real complexes.MJson instance now
    // that @fireback/complexes actually exports MJson correctly (see
    // Abac.emi.yml's complexes: block) - it used to be effectively
    // unreachable code (RoleDto's setter threw "Right-hand side of
    // 'instanceof' is not callable" the moment any role was fetched, taking
    // down this whole screen), so this never got to run against the real
    // shape. Array.isArray on the wrapper itself is always false;
    // getMJsonValue unwraps to the raw value it's actually holding.
    const capabilitiesListId = getMJsonValue(d?.capabilitiesListId);
    if (Array.isArray(capabilitiesListId)) {
      setValue(capabilitiesListId);
    }
  }, [d?.capabilitiesListId]);

  return (
    <>
      <CommonSingleManager
        editEntityHandler={() => {
          router.push(RoleNavigation.edit(uniqueId));
        }}
        getSingleHook={getSingleHook}
      >
        <GeneralEntityView
          entity={d}
          fields={[
            {
              label: s.role.name,
              elem: name,
            },
          ]}
        />

        <PageSection title={s.role.permissions} className="mt-3">
          <RolePermissionTree value={value} />
        </PageSection>
      </CommonSingleManager>
    </>
  );
};
