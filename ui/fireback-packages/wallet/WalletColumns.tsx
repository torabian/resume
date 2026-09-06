import { WalletDto } from "./sdk/WalletDto";
import { strings } from "./strings/translations";

export const columns = (t: typeof strings) => [
  {
    name: "uniqueId",
    title: "uniqueId",
    width: 220,
  },
  {
    name: WalletDto.Fields.ownerType,
    title: t.wallets.ownerType,
    width: 120,
  },
  {
    name: WalletDto.Fields.userId,
    title: t.wallets.user,
    width: 220,
  },
  {
    name: WalletDto.Fields.workspaceId,
    title: t.wallets.workspace,
    width: 220,
  },
  {
    name: WalletDto.Fields.currency,
    title: t.wallets.currency,
    width: 100,
  },
  {
    name: WalletDto.Fields.balance,
    title: t.wallets.balance,
    width: 140,
  },
  {
    name: WalletDto.Fields.status,
    title: t.wallets.status,
    width: 100,
  },
  {
    name: WalletDto.Fields.label,
    title: t.wallets.label,
    width: 160,
  },
];
