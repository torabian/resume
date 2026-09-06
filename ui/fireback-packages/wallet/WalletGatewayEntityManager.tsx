import {
  CommonEntityManager,
  type DtoEntity,
} from "@fireback/ui-core/components/entity-manager/CommonEntityManager";
import { useCommonEntityManager } from "@fireback/ui-core/hooks/useCommonEntityManager";
import { useS } from "@fireback/ui-core/hooks/useS";
import { useWalletGatewayGetActionQuery } from "./sdk/WalletGatewayGetAction";
import { useWalletGatewayCreateAction } from "./sdk/WalletGatewayCreateAction";
import { useWalletGatewayUpdateAction } from "./sdk/WalletGatewayUpdateAction";
import { WalletGatewayDto } from "./sdk/WalletGatewayDto";
import { WalletGatewayNavigation } from "./WalletNavigation";
import { WalletGatewayEditForm } from "./WalletGatewayEditForm";
import { strings } from "./strings/translations";

export const WalletGatewayEntityManager = ({
  data,
}: DtoEntity<WalletGatewayDto>) => {
  const { router, uniqueId, queryClient, locale } = useCommonEntityManager<
    Partial<WalletGatewayDto>
  >({
    data,
  });
  const s = useS(strings);

  const getSingleHook = useWalletGatewayGetActionQuery({
    params: { uniqueId },
  });

  const postHook = useWalletGatewayCreateAction({});

  const patchHook = useWalletGatewayUpdateAction({ params: { uniqueId } });

  return (
    <CommonEntityManager
      postHook={postHook}
      getSingleHook={getSingleHook}
      patchHook={patchHook}
      onCancel={() => {
        router.goBackOrDefault(
          WalletGatewayNavigation.query(undefined, locale),
        );
      }}
      onFinishUriResolver={(response, locale) =>
        WalletGatewayNavigation.single(response.data?.uniqueId, locale)
      }
      Form={WalletGatewayEditForm}
      onEditTitle={s.walletGateways.editWalletGateway}
      onCreateTitle={s.walletGateways.newWalletGateway}
      data={data}
    />
  );
};
