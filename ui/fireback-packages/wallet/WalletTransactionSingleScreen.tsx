import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { strings } from "./strings/translations";
import { WalletTransactionDto } from "./sdk/WalletTransactionDto";
import { useWalletTransactionGetActionQuery } from "./sdk/WalletTransactionGetAction";

// Read-only - no editEntityHandler, walletTransaction has no update action.
export const WalletTransactionSingleScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const uniqueId = router.query.uniqueId as string;

  const getSingleHook = useWalletTransactionGetActionQuery({
    params: { uniqueId },
  });
  const d: WalletTransactionDto | undefined = getSingleHook.data?.data?.item;
  usePageTitle(s.walletTransactions.singleTitle);

  return (
    <CommonSingleManager getSingleHook={getSingleHook}>
      <GeneralEntityView
        entity={d}
        fields={[
          { label: s.walletTransactions.direction, elem: d?.direction },
          { label: s.walletTransactions.amount, elem: d?.amount },
          { label: s.walletTransactions.balanceAfter, elem: d?.balanceAfter },
          { label: s.walletTransactions.reason, elem: d?.reason },
          { label: s.walletTransactions.referenceType, elem: d?.referenceType },
          { label: s.walletTransactions.referenceId, elem: d?.referenceId },
          { label: s.walletTransactions.idempotencyKey, elem: d?.idempotencyKey },
          { label: s.walletTransactions.note, elem: d?.note },
          { label: s.walletTransactions.createdBy, elem: d?.createdBy },
          { label: s.walletTransactions.createdAt, elem: d?.createdAt as any },
          {
            label: s.walletTransactions.wallet,
            elem: (d?.wallet as any)?.uniqueId,
          },
        ]}
      />
    </CommonSingleManager>
  );
};
