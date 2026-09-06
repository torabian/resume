import { WalletProviderConfigDto } from "./sdk/WalletProviderConfigDto";
import { strings } from "./strings/translations";

export const columns = (t: typeof strings) => [
  {
    name: WalletProviderConfigDto.Fields.providerType,
    title: t.walletProviderConfigs.providerType,
    width: 160,
  },
  {
    name: WalletProviderConfigDto.Fields.region,
    title: t.walletProviderConfigs.region,
    width: 120,
  },
  {
    name: WalletProviderConfigDto.Fields.isEnabled,
    title: t.walletProviderConfigs.isEnabled,
    width: 100,
  },
];
