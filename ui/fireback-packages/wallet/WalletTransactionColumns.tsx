import { WalletTransactionDto } from "./sdk/WalletTransactionDto";
import { strings } from "./strings/translations";

// Append-only ledger, read-only in the admin UI (see Wallet.emi.yml's features
// override on walletTransaction: no create/update/delete action exists at all).
export const columns = (t: typeof strings) => [
  {
    name: WalletTransactionDto.Fields.direction,
    title: t.walletTransactions.direction,
    width: 100,
  },
  {
    name: WalletTransactionDto.Fields.amount,
    title: t.walletTransactions.amount,
    width: 140,
  },
  {
    name: WalletTransactionDto.Fields.balanceAfter,
    title: t.walletTransactions.balanceAfter,
    width: 140,
  },
  {
    name: WalletTransactionDto.Fields.reason,
    title: t.walletTransactions.reason,
    width: 120,
  },
  {
    name: WalletTransactionDto.Fields.referenceType,
    title: t.walletTransactions.referenceType,
    width: 160,
  },
  {
    name: WalletTransactionDto.Fields.createdBy,
    title: t.walletTransactions.createdBy,
    width: 160,
  },
  {
    name: WalletTransactionDto.Fields.createdAt,
    title: t.walletTransactions.createdAt,
    width: 180,
  },
];
