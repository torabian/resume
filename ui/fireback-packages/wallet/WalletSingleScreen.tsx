import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { strings } from "./strings/translations";
import { WalletDto } from "./sdk/WalletDto";
import { useWalletGetActionQuery } from "./sdk/WalletGetAction";

// Read-only, plus a link into AdjustBalanceAction (WalletAdjustBalance.tsx) - wallet has
// no update action of its own (balance/status/label all change through dedicated
// actions instead, see Wallet.emi.yml's features override), so there is nothing else
// to "edit" here.
export const WalletSingleScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const uniqueId = router.query.uniqueId as string;

  const getSingleHook = useWalletGetActionQuery({
    params: { uniqueId },
  });
  const d: WalletDto | undefined = getSingleHook.data?.data?.item;
  usePageTitle(d?.currency || "");

  return (
    <CommonSingleManager getSingleHook={getSingleHook} noBack>
      <GeneralEntityView
        entity={d}
        fields={[
          { label: s.wallets.ownerType, elem: d?.ownerType },
          { label: s.wallets.user, elem: d?.userId },
          { label: s.wallets.workspace, elem: d?.workspaceId },
          { label: s.wallets.currency, elem: d?.currency },
          { label: s.wallets.balance, elem: d?.balance },
          { label: s.wallets.status, elem: d?.status },
          { label: s.wallets.label, elem: d?.label },
        ]}
      />
      <button
        className="btn btn-primary mt-3"
        onClick={() => router.push(`../wallet/${uniqueId}/adjust-balance`)}
      >
        {s.wallets.adjustBalanceTitle}
      </button>
    </CommonSingleManager>
  );
};
