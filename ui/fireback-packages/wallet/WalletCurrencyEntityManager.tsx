import {
  CommonEntityManager,
  type DtoEntity,
} from "@fireback/ui-core/components/entity-manager/CommonEntityManager";
import { useCommonEntityManager } from "@fireback/ui-core/hooks/useCommonEntityManager";
import { useS } from "@fireback/ui-core/hooks/useS";
import { useWalletCurrencyGetActionQuery } from "./sdk/WalletCurrencyGetAction";
import { useWalletCurrencyCreateAction } from "./sdk/WalletCurrencyCreateAction";
import { useWalletCurrencyUpdateAction } from "./sdk/WalletCurrencyUpdateAction";
import { WalletCurrencyDto } from "./sdk/WalletCurrencyDto";
import { WalletCurrencyNavigation } from "./WalletNavigation";
import { WalletCurrencyEditForm } from "./WalletCurrencyEditForm";
import { strings } from "./strings/translations";

export const WalletCurrencyEntityManager = ({
  data,
}: DtoEntity<WalletCurrencyDto>) => {
  const { router, uniqueId, queryClient, locale } = useCommonEntityManager<
    Partial<WalletCurrencyDto>
  >({
    data,
  });
  const s = useS(strings);

  const getSingleHook = useWalletCurrencyGetActionQuery({
    params: { uniqueId },
  });

  const postHook = useWalletCurrencyCreateAction({});

  const patchHook = useWalletCurrencyUpdateAction({ params: { uniqueId } });

  return (
    <CommonEntityManager
      postHook={postHook}
      getSingleHook={getSingleHook}
      patchHook={patchHook}
      onCancel={() => {
        router.goBackOrDefault(
          WalletCurrencyNavigation.query(undefined, locale),
        );
      }}
      onFinishUriResolver={(response, locale) =>
        WalletCurrencyNavigation.single(response.data?.uniqueId, locale)
      }
      Form={WalletCurrencyEditForm}
      onEditTitle={s.walletCurrencies.editWalletCurrency}
      onCreateTitle={s.walletCurrencies.newWalletCurrency}
      data={data}
    />
  );
};
