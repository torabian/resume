import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useCommonEntityManager } from "@fireback/ui-core/hooks/useCommonEntityManager";
import { useS } from "@fireback/ui-core/hooks/useS";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { useCapabilityGetActionQuery } from "@fireback/manage/sdk/abac/CapabilityGetAction";
import { CapabilityDto } from "@fireback/manage/sdk/abac/CapabilityDto";
import { CapabilityNavigation } from "@fireback/ui-core/sdk/navigation/AbacNavigation";
import { strings } from "./strings/translations";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";

export const CapabilitySingleScreen = () => {
  const { uniqueId } = useCommonEntityManager<Partial<any>>({});
  const getSingleHook = useCapabilityGetActionQuery({ params: { uniqueId } });
  var d = getSingleHook.data?.data?.item;

  const t = useS(strings);
  // d.name is complexes.TString now (a locale -> text map) - resolve to the
  // viewer's own locale rather than string-templating the raw object into
  // "[object Object]".
  const name = getTStringValue(d?.name, getLocale());
  usePageTitle(name);
  return (
    <>
      <CommonSingleManager
        editEntityHandler={({ locale, router }) => {
          router.push(CapabilityNavigation.edit(uniqueId));
        }}
        getSingleHook={getSingleHook}
      >
        <GeneralEntityView
          entity={d}
          fields={[
            {
              elem: name,
              label: t.capabilities.name,
            },
            {
              elem: getTStringValue(d?.description, getLocale()),
              label: t.capabilities.description,
            },
          ]}
        />
      </CommonSingleManager>
    </>
  );
};
