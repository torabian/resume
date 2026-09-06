import { useCommonEntityManager } from "@fireback/ui-core/hooks/useCommonEntityManager";
import {
  CommonEntityManager,
  type DtoEntity,
} from "@fireback/ui-core/components/entity-manager/CommonEntityManager";
import { RegionalContentForm } from "./RegionalContentEditForm";
import { useRegionalContentGetActionQuery } from "@fireback/messaging/sdk/messaging/RegionalContentGetAction";
import { useRegionalContentCreateAction } from "@fireback/messaging/sdk/messaging/RegionalContentCreateAction";
import { useRegionalContentUpdateAction } from "@fireback/messaging/sdk/messaging/RegionalContentUpdateAction";
import { RegionalContentDto } from "@fireback/messaging/sdk/messaging/RegionalContentDto";
import { RegionalContentNavigation } from "@fireback/ui-core/sdk/navigation/MessagingNavigation";
import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
export const RegionalContentEntityManager = ({
  data,
}: DtoEntity<RegionalContentDto>) => {
  const s = useS(strings);
  const { router, uniqueId, queryClient, locale } = useCommonEntityManager<
    Partial<RegionalContentDto>
  >({
    data,
  });
  const getSingleHook = useRegionalContentGetActionQuery({
    params: { uniqueId },
  });
  const postHook = useRegionalContentCreateAction({});
  const patchHook = useRegionalContentUpdateAction({ params: { uniqueId } });
  return (
    <CommonEntityManager
      postHook={postHook}
      patchHook={patchHook}
      getSingleHook={getSingleHook}
      onCancel={() => {
        router.goBackOrDefault(
          RegionalContentNavigation.query(undefined, locale),
        );
      }}
      onFinishUriResolver={(response, locale) =>
        RegionalContentNavigation.single(response.data?.item?.uniqueId, locale)
      }
      Form={RegionalContentForm}
      onEditTitle={s.regionalContents.editRegionalContent}
      onCreateTitle={s.regionalContents.newRegionalContent}
      data={data}
    />
  );
};
