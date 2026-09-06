import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { PageSection } from "@fireback/ui-core/components/page-section/PageSection";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { strings } from "./strings/translations";
import { WalletViewDto } from "./sdk/WalletViewDto";
import { useGetWalletActionQuery } from "./sdk/GetWalletAction";
import { GetWalletActionQueryParams } from "./sdk/GetWalletAction";
import { WalletHistoryList } from "./WalletHistoryList";
import { MyWalletNavigation } from "./MyWalletNavigation";

// Own-wallet detail: balance/status/label (GetWalletAction, scoped to the caller the
// same way every other walletpublic action is - see GetWalletImplementation.go), its
// full transaction history below, and a button into TopupScreen. No edit form here -
// UpdateWalletSettingsAction exists on the backend but isn't wired into this first pass
// of the self-service UI (see this module's own Menu.go doc comment - list/history/
// topup is the asked-for scope).
export const MyWalletSingleScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const uniqueId = router.query.uniqueId as string;

  const getSingleHook = useGetWalletActionQuery({
    qs: new GetWalletActionQueryParams({ walletId: uniqueId }),
  });
  const d: WalletViewDto | undefined = (getSingleHook.data as any)?.data?.item;
  usePageTitle(d?.currency || "");

  return (
    <CommonSingleManager getSingleHook={getSingleHook}>
      <GeneralEntityView
        entity={d}
        fields={[
          { label: s.myWallets.currency, elem: d?.currency },
          { label: s.myWallets.balance, elem: d?.balance },
          { label: s.myWallets.status, elem: d?.status },
          { label: s.myWallets.label, elem: d?.label },
          {
            label: s.myWallets.ownerType,
            elem:
              d?.ownerType === "workspace"
                ? s.myWallets.ownerWorkspace
                : s.myWallets.ownerUser,
          },
        ]}
      />

      <button
        className="btn btn-primary mt-3"
        onClick={() => router.push(MyWalletNavigation.topup(uniqueId))}
      >
        {s.myWallets.topUp}
      </button>

      <PageSection title={s.myWallets.historyTitle}>
        {uniqueId && <WalletHistoryList walletId={uniqueId} />}
      </PageSection>
    </CommonSingleManager>
  );
};
