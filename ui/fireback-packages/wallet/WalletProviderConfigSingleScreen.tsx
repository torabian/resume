import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { strings } from "./strings/translations";
import { WalletProviderConfigDto } from "./sdk/WalletProviderConfigDto";
import { useWalletProviderConfigGetActionQuery } from "./sdk/WalletProviderConfigGetAction";
import { WalletProviderConfigNavigation } from "./WalletNavigation";

export const WalletProviderConfigSingleScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const uniqueId = router.query.uniqueId as string;
  const { locale } = useLocale();

  const getSingleHook = useWalletProviderConfigGetActionQuery({
    params: { uniqueId },
  });
  const d: WalletProviderConfigDto | undefined = getSingleHook.data?.data?.item;
  usePageTitle(d?.providerType || "");

  return (
    <CommonSingleManager
      editEntityHandler={() => {
        router.push(WalletProviderConfigNavigation.edit(uniqueId, locale));
      }}
      getSingleHook={getSingleHook}
    >
      <GeneralEntityView
        entity={d}
        fields={[
          { label: s.walletProviderConfigs.providerType, elem: d?.providerType },
          { label: s.walletProviderConfigs.region, elem: d?.region },
          { label: s.walletProviderConfigs.isEnabled, elem: d?.isEnabled },
          {
            label: s.walletProviderConfigs.config,
            elem: d?.config ? JSON.stringify(d.config) : undefined,
          },
        ]}
      />
    </CommonSingleManager>
  );
};
