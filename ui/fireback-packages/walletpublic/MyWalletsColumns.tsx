import { type QueryArchiveColumn } from "@fireback/ui-core/types/QueryArchiveColumn";
import { type WalletViewDto } from "./sdk/WalletViewDto";
import { type strings } from "./strings/translations";

// Row click (via CommonListManager's uniqueIdHrefHandler, see MyWalletsList.tsx) opens
// MyWalletSingleScreen - same convention as the admin WalletList/WalletColumns. The
// "Top up" button is a separate actions column on top of that (not a replacement for
// it) - it jumps straight into TopupScreen for that one row's wallet instead of making
// the owner go through the single-wallet screen first every time.
export const columns = (
  s: typeof strings,
  onTopup: (walletId: string) => void,
): QueryArchiveColumn[] => [
  {
    name: "currency",
    title: s.myWallets.currency,
    width: 100,
  },
  {
    name: "balance",
    title: s.myWallets.balance,
    width: 140,
  },
  {
    name: "label",
    title: s.myWallets.label,
    width: 160,
  },
  {
    name: "status",
    title: s.myWallets.status,
    width: 120,
  },
  {
    name: "isDefault",
    title: s.myWallets.isDefault,
    width: 100,
    getCellValue: (dto: WalletViewDto) => (dto.isDefault ? "✓" : ""),
  },
  {
    name: "actions",
    title: "",
    width: 120,
    getCellValue: (dto: WalletViewDto) =>
      (
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={(e) => {
            e.stopPropagation();
            onTopup(dto.uniqueId as string);
          }}
        >
          {s.myWallets.topUp}
        </button>
      ) as any,
  },
];
