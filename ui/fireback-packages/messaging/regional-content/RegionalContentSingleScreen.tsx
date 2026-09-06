import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useCommonEntityManager } from "@fireback/ui-core/hooks/useCommonEntityManager";
import { useRegionalContentGetActionQuery } from "@fireback/messaging/sdk/messaging/RegionalContentGetAction";
import { RegionalContentDto } from "@fireback/messaging/sdk/messaging/RegionalContentDto";
import { RegionalContentNavigation } from "@fireback/ui-core/sdk/navigation/MessagingNavigation";
import { useS } from "@fireback/ui-core/hooks/useS";
import { RegionalContentDefinitionList } from "./RegionalContentDefinitionList";
import { strings } from "./strings/translations";
export const RegionalContentSingleScreen = () => {
  const { uniqueId, queryClient } = useCommonEntityManager<Partial<any>>({});
  const getSingleHook = useRegionalContentGetActionQuery({
    params: { uniqueId },
  });
  var d: RegionalContentDto | undefined = getSingleHook.data?.data?.item;
  const t = useS(strings);
  // usePageTitle(`${d?.name}`);
  return (
    <>
      <CommonSingleManager
        editEntityHandler={({ locale, router }) => {
          router.push(RegionalContentNavigation.edit(uniqueId));
        }}
        getSingleHook={getSingleHook}
      >
        <GeneralEntityView
          entity={d}
          fields={[
            {
              elem: d?.keyGroup,
              label: t.regionalContents.keyGroup,
            },
            {
              elem: d?.region,
              label: t.regionalContents.region,
            },
          ]}
        />
        {d?.uniqueId ? (
          <RegionalContentDefinitionList
            regionalContentId={d.uniqueId}
            keyGroup={d.keyGroup}
          />
        ) : null}
      </CommonSingleManager>
    </>
  );
};
