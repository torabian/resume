import { useEffect, useState } from "react";
import { PageTitle, usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { PageSection } from "@fireback/ui-core/components/page-section/PageSection";
import { useS } from "@fireback/ui-core/hooks/useS";
import { httpErrorHanlder } from "@fireback/ui-core/hooks/api";
import { Toast } from "@fireback/ui-core/hooks/toast";
import { strings as coreStrings } from "@fireback/ui-core/components/strings/translations";
import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { createQuerySource } from "@fireback/ui-core/hooks/useAsQuery";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { useWalletsQuerySource } from "./AdminCreateWalletQuerySources";
import { type WalletDto } from "./sdk/WalletDto";
import { useWalletGetActionQuery } from "./sdk/WalletGetAction";
import {
  AdjustBalanceActionReq,
  useAdjustBalanceAction,
} from "./sdk/AdjustBalanceAction";
import { strings } from "./strings/translations";

function walletLabel(w: WalletDto): string {
  const owner = w.userId || w.workspaceId || "";
  return `${w.currency} - ${owner} (${w.uniqueId})`;
}

// Root-only admin screen for AdjustBalanceAction (see modules/finance/wallet/
// AdjustBalanceImplementation.go) - a manual support/ops balance correction, always
// requiring a note (enforced server-side) and always running through the same locked-
// transaction ledger path as purchase. Reachable two ways (see WalletRoutes.tsx):
// "wallet/:uniqueId/adjust-balance" (from WalletSingleScreen's "Adjust Balance" button)
// preselects that wallet via router.query.uniqueId; the bare "wallet-adjust-balance"
// route (from the sidebar) leaves the wallet picker open.
export const WalletAdjustBalance = () => {
  const s = useS(strings);
  const cs = useS(coreStrings);
  const router = useRouter();
  usePageTitle(s.wallets.adjustBalanceTitle);

  const preselectedWalletId = router.query.uniqueId as string | undefined;
  const preselectedWalletQuery = useWalletGetActionQuery({
    params: { uniqueId: preselectedWalletId || "" },
    enabled: !!preselectedWalletId,
  } as any);

  const [wallet, setWallet] = useState<WalletDto | undefined>();
  useEffect(() => {
    const item = preselectedWalletQuery.data?.data?.item;
    if (item) {
      setWallet(item);
    }
  }, [preselectedWalletQuery.data]);

  const [direction, setDirection] = useState<string | undefined>("credit");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const adjustMutation = useAdjustBalanceAction({});

  const directionSource = createQuerySource([
    { name: s.wallets.directionCredit, uniqueId: "credit" },
    { name: s.wallets.directionDebit, uniqueId: "debit" },
  ]);

  const canSubmit =
    !!wallet?.uniqueId &&
    !!direction &&
    amount.trim().length > 0 &&
    note.trim().length > 0;

  const onSubmit = () => {
    if (!canSubmit) {
      return;
    }
    adjustMutation
      .mutateAsync(
        new AdjustBalanceActionReq({
          walletId: wallet!.uniqueId!,
          direction: direction!,
          amount: amount.trim(),
          note: note.trim(),
          idempotencyKey: crypto.randomUUID(),
        }),
      )
      .then(() => {
        Toast(s.wallets.adjustBalanceSuccess, { type: "success" });
        setAmount("");
        setNote("");
      })
      .catch((err) => httpErrorHanlder(err, cs));
  };

  return (
    <div>
      <PageTitle description={s.wallets.adjustBalanceDescription} />

      <PageSection title={s.wallets.adjustBalanceSection}>
        <FormSelect
          querySource={useWalletsQuerySource}
          keyExtractor={(item: any) => item.uniqueId}
          fnLabelFormat={(item: any) => walletLabel(item)}
          value={wallet}
          onChange={(item: any) => setWallet(item || undefined)}
          disabled={!!preselectedWalletId}
          label={s.wallets.wallet}
          placeholder={s.wallets.selectWallet}
        />

        <FormSelect
          querySource={directionSource}
          keyExtractor={(v: any) => v.uniqueId}
          fnLabelFormat={(v: any) => v.name}
          value={direction}
          onChange={(item: any) =>
            setDirection(item ? item.uniqueId : undefined)
          }
          label={s.wallets.direction}
        />

        <FormText
          value={amount}
          onChange={setAmount}
          label={s.wallets.amount}
          hint={s.wallets.amountHint}
        />

        <div className="mb-3">
          <label className="form-label">{s.wallets.adjustBalanceNote}</label>
          <textarea
            className="form-control"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <small className="form-text text-muted">
            {s.wallets.adjustBalanceNoteHint}
          </small>
        </div>

        <button
          className="btn btn-primary"
          disabled={!canSubmit || adjustMutation.isPending}
          onClick={onSubmit}
        >
          {adjustMutation.isPending
            ? s.wallets.adjustBalanceSubmitting
            : s.wallets.adjustBalanceSubmit}
        </button>
      </PageSection>
    </div>
  );
};
