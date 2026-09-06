import { type QueryArchiveColumn } from "@fireback/ui-core/types/QueryArchiveColumn";
import { type strings } from "./strings/translations";

export const historyColumns = (s: typeof strings): QueryArchiveColumn[] => [
  {
    name: "createdAt",
    title: s.myWallets.createdAt,
    width: 160,
  },
  {
    name: "direction",
    title: s.myWallets.direction,
    width: 100,
  },
  {
    name: "amount",
    title: s.myWallets.amount,
    width: 140,
  },
  {
    name: "balanceAfter",
    title: s.myWallets.balanceAfter,
    width: 140,
  },
  {
    name: "reason",
    title: s.myWallets.reason,
    width: 140,
  },
  {
    name: "note",
    title: s.myWallets.note,
    width: 200,
  },
];
