import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { strings } from "./strings/translations";
import { useWorkspaceTypeGetActionQuery } from "@fireback/manage/sdk/abac/WorkspaceTypeGetAction";
import { WorkspaceTypeNavigation } from "@fireback/ui-core/sdk/navigation/AbacNavigation";

export const WorkspaceTypeSingleScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const uniqueId = router.query.uniqueId as string;

  const getSingleHook = useWorkspaceTypeGetActionQuery({
    params: { uniqueId },
  });

  var d = getSingleHook.data?.data?.item;
  // d.title is complexes.TString now (a locale -> text map) - resolve to the
  // viewer's own locale rather than string-templating the raw object into
  // "[object Object]" (same as CapabilitySingleScreen.tsx's own name field).
  usePageTitle(getTStringValue(d?.title, getLocale()));

  return (
    <>
      <CommonSingleManager
        editEntityHandler={() => {
          router.push(WorkspaceTypeNavigation.edit(uniqueId));
        }}
        getSingleHook={getSingleHook}
      >
        <GeneralEntityView
          entity={d}
          fields={[
            {
              label: s.slug,
              elem: d?.slug,
            },
          ]}
        />
      </CommonSingleManager>
    </>
  );
};
