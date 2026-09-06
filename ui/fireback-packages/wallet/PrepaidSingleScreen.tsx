import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { strings } from "./strings/translations";
import { PrepaidDto } from "./sdk/PrepaidDto";
import { usePrepaidGetActionQuery } from "./sdk/PrepaidGetAction";
import { PrepaidNavigation } from "./WalletNavigation";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";

// redeemedWallet/walletTransaction come back wrapped in MOne (see
// sdk/sdk/common/operators.ts) - .get() unwraps to the plain value, same reasoning as
// WalletConfigSingleScreen's own defaultUserWallets fix (MArray's equivalent).
function unwrapOne(value: any): any {
  return value && typeof value.get === "function" ? value.get() : value;
}

export const PrepaidSingleScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const uniqueId = router.query.uniqueId as string;
  const { locale } = useLocale();

  const getSingleHook = usePrepaidGetActionQuery({
    params: { uniqueId },
  });
  const d: PrepaidDto | undefined = getSingleHook.data?.data?.item;
  usePageTitle(d?.redeemKey || "");

  const redeemedWallet = unwrapOne(d?.redeemedWallet);
  const walletTransaction = unwrapOne(d?.walletTransaction);
  const treasury = unwrapOne(d?.treasury);
  const treasuryTransaction = unwrapOne(d?.treasuryTransaction);

  return (
    <CommonSingleManager
      editEntityHandler={() => {
        router.push(PrepaidNavigation.edit(uniqueId, locale));
      }}
      getSingleHook={getSingleHook}
    >
      <GeneralEntityView
        entity={d}
        fields={[
          { label: s.prepaids.amount, elem: d?.amount },
          { label: s.prepaids.currency, elem: d?.currency },
          { label: s.prepaids.redeemKey, elem: d?.redeemKey },
          { label: s.prepaids.status, elem: d?.status },
          { label: s.prepaids.isExchangeable, elem: d?.isExchangeable },
          {
            label: s.prepaids.locations,
            elem: Array.isArray(d?.locations)
              ? (d?.locations as any).join(", ")
              : d?.locations,
          },
          { label: s.prepaids.workspaceId, elem: d?.workspaceId },
          {
            label: s.prepaids.treasury,
            elem: treasury ? getTStringValue(treasury.name, getLocale()) : undefined,
          },
          {
            label: s.prepaids.metadata,
            elem: d?.metadata ? JSON.stringify(d.metadata) : undefined,
          },
          { label: s.prepaids.redeemedAt, elem: d?.redeemedAt as any },
          {
            label: s.prepaids.redeemedWallet,
            elem: redeemedWallet?.uniqueId,
          },
          {
            label: s.prepaids.walletTransaction,
            elem: walletTransaction?.uniqueId,
          },
          {
            label: s.prepaids.treasuryTransaction,
            elem: treasuryTransaction?.uniqueId,
          },
        ]}
      />
    </CommonSingleManager>
  );
};
