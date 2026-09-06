import { useState } from "react";
import { PageTitle, usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { PageSection } from "@fireback/ui-core/components/page-section/PageSection";
import { useS } from "@fireback/ui-core/hooks/useS";
import { httpErrorHanlder } from "@fireback/ui-core/hooks/api";
import { Toast } from "@fireback/ui-core/hooks/toast";
import { strings as coreStrings } from "@fireback/ui-core/components/strings/translations";
import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { WalletViewDto } from "./sdk/WalletViewDto";
import { useGetWalletActionQuery, GetWalletActionQueryParams } from "./sdk/GetWalletAction";
import { TopupActionReq, useTopupAction } from "./sdk/TopupAction";
import { type WalletGatewayViewDto } from "./sdk/WalletGatewayViewDto";
import { useWalletGatewaysQuerySource } from "./MyWalletQuerySources";
import { MyWalletNavigation } from "./MyWalletNavigation";
import { strings } from "./strings/translations";

// Owner-facing topup form (TopupAction - see TopupImplementation.go). Gateway choices
// are narrowed to the wallet's own currency (WalletGatewaysAction), so a gateway that
// can't actually settle in this wallet's currency never shows up as pickable in the
// first place. A redirect-based gateway (Przelewy24/ZarinPal/BLIK) sends the browser
// straight to result.redirectUrl; a client-secret gateway (Stripe) only gets as far as
// creating the pending attempt here - completing it needs a gateway-specific
// client-side SDK this first pass doesn't wire up (see s.myWallets.clientSecretNotice).
export const TopupScreen = () => {
  const router = useRouter();
  const s = useS(strings);
  const cs = useS(coreStrings);
  const uniqueId = router.query.uniqueId as string;
  usePageTitle(s.myWallets.topupTitle);

  const walletQuery = useGetWalletActionQuery({
    qs: new GetWalletActionQueryParams({ walletId: uniqueId }),
  });
  const wallet: WalletViewDto | undefined = (walletQuery.data as any)?.data?.item;

  const [gateway, setGateway] = useState<WalletGatewayViewDto | undefined>();
  const [amount, setAmount] = useState("");
  const [returnUrl, setReturnUrl] = useState(
    typeof window !== "undefined" ? window.location.href : "",
  );

  const topupMutation = useTopupAction({});

  const canSubmit =
    !!uniqueId && !!gateway?.code && amount.trim().length > 0;

  const onSubmit = () => {
    if (!canSubmit) {
      return;
    }
    topupMutation
      .mutateAsync(
        new TopupActionReq({
          walletId: uniqueId,
          gatewayCode: gateway!.code!,
          amount: amount.trim(),
          idempotencyKey: crypto.randomUUID(),
          returnUrl: returnUrl.trim() || undefined,
        }),
      )
      .then((res: any) => {
        const redirectUrl = res?.redirectUrl;
        const clientSecret = res?.clientSecret;
        if (redirectUrl) {
          Toast(s.myWallets.redirecting, { type: "success" });
          window.location.href = redirectUrl;
          return;
        }
        if (clientSecret) {
          Toast(s.myWallets.clientSecretNotice, { type: "info" });
          return;
        }
        Toast(s.myWallets.success, { type: "success" });
        router.push(MyWalletNavigation.single(uniqueId));
      })
      .catch((err: any) => httpErrorHanlder(err, cs));
  };

  return (
    <div>
      <PageTitle
        title={s.myWallets.topupTitle}
        description={s.myWallets.topupDescription}
      />

      <PageSection title={s.myWallets.wallet}>
        <div>
          {wallet ? `${wallet.currency} - ${wallet.balance}` : uniqueId}
        </div>

        <FormSelect
          querySource={(params: any) =>
            useWalletGatewaysQuerySource(wallet?.currency, params)
          }
          keyExtractor={(item: any) => item?.code}
          fnLabelFormat={(item: any) => item?.name}
          value={gateway}
          onChange={(item: any) => setGateway(item || undefined)}
          label={s.myWallets.gateway}
          placeholder={s.myWallets.selectGateway}
          disabled={!wallet?.currency}
        />

        <FormText
          value={amount}
          onChange={setAmount}
          label={s.myWallets.amount}
          hint={s.myWallets.amountHint}
        />

        <FormText
          value={returnUrl}
          onChange={setReturnUrl}
          label={s.myWallets.returnUrl}
          hint={s.myWallets.returnUrlHint}
        />

        <button
          className="btn btn-primary"
          disabled={!canSubmit || topupMutation.isPending}
          onClick={onSubmit}
        >
          {topupMutation.isPending ? s.myWallets.submitting : s.myWallets.submit}
        </button>
      </PageSection>
    </div>
  );
};
