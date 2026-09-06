import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { strings } from "./strings/translations";
import { WalletPaymentAttemptDto } from "./sdk/WalletPaymentAttemptDto";
import { useWalletPaymentAttemptGetActionQuery } from "./sdk/WalletPaymentAttemptGetAction";

export const WalletPaymentAttemptSingleScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const uniqueId = router.query.uniqueId as string;

  const getSingleHook = useWalletPaymentAttemptGetActionQuery({
    params: { uniqueId },
  });
  const d: WalletPaymentAttemptDto | undefined = getSingleHook.data?.data?.item;
  usePageTitle(s.walletPaymentAttempts.singleTitle);

  return (
    <CommonSingleManager getSingleHook={getSingleHook}>
      <GeneralEntityView
        entity={d}
        fields={[
          { label: s.walletPaymentAttempts.purpose, elem: d?.purpose },
          { label: s.walletPaymentAttempts.amount, elem: d?.amount },
          { label: s.walletPaymentAttempts.currency, elem: d?.currency },
          { label: s.walletPaymentAttempts.status, elem: d?.status },
          {
            label: s.walletPaymentAttempts.gatewayReference,
            elem: d?.gatewayReference,
          },
          {
            label: s.walletPaymentAttempts.idempotencyKey,
            elem: d?.idempotencyKey,
          },
          { label: s.walletPaymentAttempts.failureReason, elem: d?.failureReason },
          { label: s.walletPaymentAttempts.returnUrl, elem: d?.returnUrl },
          { label: s.walletPaymentAttempts.createdAt, elem: d?.createdAt as any },
          { label: s.walletPaymentAttempts.expiresAt, elem: d?.expiresAt as any },
          {
            label: s.walletPaymentAttempts.completedAt,
            elem: d?.completedAt as any,
          },
          {
            label: s.walletPaymentAttempts.wallet,
            elem: (d?.wallet as any)?.uniqueId,
          },
          {
            label: s.walletPaymentAttempts.gateway,
            elem: (d?.gateway as any)?.uniqueId,
          },
        ]}
      />
    </CommonSingleManager>
  );
};
