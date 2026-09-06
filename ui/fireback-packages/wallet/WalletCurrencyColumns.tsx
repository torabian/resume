import { WalletCurrencyDto } from "./sdk/WalletCurrencyDto";
import { strings } from "./strings/translations";

export const columns = (t: typeof strings) => [
  {
    name: WalletCurrencyDto.Fields.code,
    title: t.walletCurrencies.code,
    width: 100,
  },
  {
    name: WalletCurrencyDto.Fields.name,
    title: t.walletCurrencies.name,
    width: 200,
  },
  {
    name: WalletCurrencyDto.Fields.kind,
    title: t.walletCurrencies.kind,
    width: 100,
  },
  {
    name: WalletCurrencyDto.Fields.decimals,
    title: t.walletCurrencies.decimals,
    width: 100,
  },
  {
    name: WalletCurrencyDto.Fields.symbol,
    title: t.walletCurrencies.symbol,
    width: 100,
  },
  {
    name: WalletCurrencyDto.Fields.isActive,
    title: t.walletCurrencies.isActive,
    width: 100,
  },
];
