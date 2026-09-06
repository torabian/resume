import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useS } from "@fireback/ui-core/hooks/useS";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { strings } from "./strings/translations";
import { WalletEventDto } from "./sdk/WalletEventDto";
import { useWalletEventGetActionQuery } from "./sdk/WalletEventGetAction";

export const WalletEventSingleScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const uniqueId = router.query.uniqueId as string;

  const getSingleHook = useWalletEventGetActionQuery({
    params: { uniqueId },
  });
  const d: WalletEventDto | undefined = getSingleHook.data?.data?.item;
  usePageTitle(s.walletEvents.singleTitle);

  return (
    <CommonSingleManager getSingleHook={getSingleHook}>
      <GeneralEntityView
        entity={d}
        fields={[
          { label: s.walletEvents.eventType, elem: d?.eventType },
          { label: s.walletEvents.externalEventId, elem: d?.externalEventId },
          { label: s.walletEvents.processed, elem: d?.processed },
          { label: s.walletEvents.processingError, elem: d?.processingError },
          { label: s.walletEvents.receivedAt, elem: d?.receivedAt as any },
          {
            label: s.walletEvents.gateway,
            elem: (d?.gateway as any)?.uniqueId,
          },
          {
            label: s.walletEvents.payload,
            elem: d?.payload ? JSON.stringify(d.payload) : undefined,
          },
        ]}
      />
    </CommonSingleManager>
  );
};
