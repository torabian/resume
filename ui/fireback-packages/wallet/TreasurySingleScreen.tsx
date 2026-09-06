import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { strings } from "./strings/translations";
import { TreasuryDto } from "./sdk/TreasuryDto";
import { useTreasuryGetActionQuery } from "./sdk/TreasuryGetAction";
import { TreasuryNavigation } from "./WalletNavigation";

export const TreasurySingleScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const uniqueId = router.query.uniqueId as string;
  const { locale } = useLocale();

  const getSingleHook = useTreasuryGetActionQuery({
    params: { uniqueId },
  });
  const d: TreasuryDto | undefined = getSingleHook.data?.data?.item;
  const name = getTStringValue(d?.name, getLocale());
  // wallet comes back wrapped in MOne (see sdk/sdk/common/operators.ts) - .get()
  // unwraps to the plain value, same reasoning as PrepaidSingleScreen's own
  // unwrapOne/WalletConfigSingleScreen's defaultUserWallets fix.
  const wallet = d?.wallet?.get?.();
  usePageTitle(name || "");

  return (
    <CommonSingleManager
      editEntityHandler={() => {
        router.push(TreasuryNavigation.edit(uniqueId, locale));
      }}
      getSingleHook={getSingleHook}
    >
      <GeneralEntityView
        title={name}
        entity={d}
        fields={[
          { label: s.treasuries.name, elem: name },
          {
            label: s.treasuries.description,
            elem: getTStringValue(d?.description, getLocale()),
          },
          { label: s.treasuries.walletId, elem: wallet?.uniqueId },
          { label: s.treasuries.currency, elem: wallet?.currency },
          { label: s.treasuries.balance, elem: wallet?.balance },
          { label: s.treasuries.walletStatus, elem: wallet?.status },
        ]}
      />
    </CommonSingleManager>
  );
};
