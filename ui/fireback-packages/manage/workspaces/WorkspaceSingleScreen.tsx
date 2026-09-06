import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { useS } from "@fireback/ui-core/hooks/useS";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { strings } from "./strings/translations";
import { useWorkspaceGetActionQuery } from "@fireback/manage/sdk/abac/WorkspaceGetAction";
import { WorkspaceNavigation } from "@fireback/ui-core/sdk/navigation/AbacNavigation";

export const WorkspaceSingleScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const uniqueId = router.query.uniqueId as string;
  const { locale } = useLocale();

  const getSingleHook = useWorkspaceGetActionQuery({ params: { uniqueId } });
  var d: any | undefined = getSingleHook.data?.data?.item;
  // d.name is complexes.TString now (a locale -> text map) - resolve to the
  // viewer's own locale rather than handing React the raw {en, fa, ...} object
  // (React can't render an object as a child at all), same as
  // CapabilitySingleScreen.tsx's own name field.
  const name = getTStringValue(d?.name, locale);
  usePageTitle(name);

  return (
    <>
      <CommonSingleManager
        editEntityHandler={() => {
          router.push(WorkspaceNavigation.edit(uniqueId));
        }}
        getSingleHook={getSingleHook}
      >
        <GeneralEntityView
          entity={d}
          fields={[
            {
              label: s.name,
              elem: name,
            },
          ]}
        />
      </CommonSingleManager>
    </>
  );
};
