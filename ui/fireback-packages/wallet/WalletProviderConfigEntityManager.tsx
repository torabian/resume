import {
  CommonEntityManager,
  type DtoEntity,
} from "@fireback/ui-core/components/entity-manager/CommonEntityManager";
import { useCommonEntityManager } from "@fireback/ui-core/hooks/useCommonEntityManager";
import { useS } from "@fireback/ui-core/hooks/useS";
import { useWalletProviderConfigGetActionQuery } from "./sdk/WalletProviderConfigGetAction";
import { useWalletProviderConfigCreateAction } from "./sdk/WalletProviderConfigCreateAction";
import { useWalletProviderConfigUpdateAction } from "./sdk/WalletProviderConfigUpdateAction";
import { WalletProviderConfigDto } from "./sdk/WalletProviderConfigDto";
import { WalletProviderConfigNavigation } from "./WalletNavigation";
import { WalletProviderConfigEditForm } from "./WalletProviderConfigEditForm";
import { strings } from "./strings/translations";

export const WalletProviderConfigEntityManager = ({
  data,
}: DtoEntity<WalletProviderConfigDto>) => {
  const { router, uniqueId, queryClient, locale } = useCommonEntityManager<
    Partial<WalletProviderConfigDto>
  >({
    data,
  });
  const s = useS(strings);

  const getSingleHook = useWalletProviderConfigGetActionQuery({
    params: { uniqueId },
  });

  const postHook = useWalletProviderConfigCreateAction({});

  const patchHook = useWalletProviderConfigUpdateAction({
    params: { uniqueId },
  });

  return (
    <CommonEntityManager
      postHook={postHook}
      getSingleHook={getSingleHook}
      patchHook={patchHook}
      onCancel={() => {
        router.goBackOrDefault(
          WalletProviderConfigNavigation.query(undefined, locale),
        );
      }}
      onFinishUriResolver={(response, locale) =>
        WalletProviderConfigNavigation.single(response.data?.uniqueId, locale)
      }
      Form={WalletProviderConfigEditForm}
      onEditTitle={s.walletProviderConfigs.editWalletProviderConfig}
      onCreateTitle={s.walletProviderConfigs.newWalletProviderConfig}
      data={data}
    />
  );
};
