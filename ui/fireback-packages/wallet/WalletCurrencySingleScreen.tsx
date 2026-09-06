import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { strings } from "./strings/translations";
import { WalletCurrencyDto } from "./sdk/WalletCurrencyDto";
import { useWalletCurrencyGetActionQuery } from "./sdk/WalletCurrencyGetAction";
import { WalletCurrencyNavigation } from "./WalletNavigation";

export const WalletCurrencySingleScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const uniqueId = router.query.uniqueId as string;
  const { locale } = useLocale();

  const getSingleHook = useWalletCurrencyGetActionQuery({
    params: { uniqueId },
  });
  const d: WalletCurrencyDto | undefined = getSingleHook.data?.data?.item;
  usePageTitle(d?.name || "");

  return (
    <CommonSingleManager
      editEntityHandler={() => {
        router.push(WalletCurrencyNavigation.edit(uniqueId, locale));
      }}
      getSingleHook={getSingleHook}
    >
      <GeneralEntityView
        entity={d}
        fields={[
          { label: s.walletCurrencies.code, elem: d?.code },
          { label: s.walletCurrencies.name, elem: d?.name },
          { label: s.walletCurrencies.kind, elem: d?.kind },
          { label: s.walletCurrencies.decimals, elem: d?.decimals },
          { label: s.walletCurrencies.symbol, elem: d?.symbol },
          { label: s.walletCurrencies.isActive, elem: d?.isActive },
        ]}
      />
    </CommonSingleManager>
  );
};
