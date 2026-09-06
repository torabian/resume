import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { strings } from "./strings/translations";
import { WalletGatewayDto } from "./sdk/WalletGatewayDto";
import { useWalletGatewayGetActionQuery } from "./sdk/WalletGatewayGetAction";
import { WalletGatewayNavigation } from "./WalletNavigation";

export const WalletGatewaySingleScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const uniqueId = router.query.uniqueId as string;
  const { locale } = useLocale();

  const getSingleHook = useWalletGatewayGetActionQuery({
    params: { uniqueId },
  });
  const d: WalletGatewayDto | undefined = getSingleHook.data?.data?.item;
  usePageTitle(d?.name || "");

  return (
    <CommonSingleManager
      editEntityHandler={() => {
        router.push(WalletGatewayNavigation.edit(uniqueId, locale));
      }}
      getSingleHook={getSingleHook}
    >
      <GeneralEntityView
        entity={d}
        fields={[
          { label: s.walletGateways.code, elem: d?.code },
          { label: s.walletGateways.name, elem: d?.name },
          { label: s.walletGateways.kind, elem: d?.kind },
          { label: s.walletGateways.isActive, elem: d?.isActive },
          {
            label: s.walletGateways.supportedCurrencies,
            elem: Array.isArray(d?.supportedCurrencies)
              ? (d?.supportedCurrencies as any).join(", ")
              : d?.supportedCurrencies,
          },
          {
            label: s.walletGateways.config,
            elem: d?.config ? JSON.stringify(d.config) : undefined,
          },
        ]}
      />
    </CommonSingleManager>
  );
};
