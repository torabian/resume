import { TreasuryDto } from "./sdk/TreasuryDto";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { strings } from "./strings/translations";

// Read-only list - root creates/funds treasuries via CLI (`wallet treasury create`,
// `wallet fund-treasury`); this package only ever needs to *see* them (per what was
// actually asked for), same discipline as WalletTransactionList's own read-only
// convention.
export const columns = (t: typeof strings) => [
  {
    name: TreasuryDto.Fields.name,
    title: t.treasuries.name,
    width: 220,
    getCellValue: (entity: TreasuryDto) =>
      getTStringValue(entity.name, getLocale()),
  },
  {
    name: "walletCurrency",
    title: t.treasuries.currency,
    width: 100,
    getCellValue: (entity: TreasuryDto) => entity.wallet?.get()?.currency,
  },
  {
    name: "walletBalance",
    title: t.treasuries.balance,
    width: 140,
    getCellValue: (entity: TreasuryDto) => entity.wallet?.get()?.balance,
  },
];
