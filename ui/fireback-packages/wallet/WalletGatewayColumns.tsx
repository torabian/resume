import { WalletGatewayDto } from "./sdk/WalletGatewayDto";
import { strings } from "./strings/translations";

export const columns = (t: typeof strings) => [
  {
    name: WalletGatewayDto.Fields.code,
    title: t.walletGateways.code,
    width: 140,
  },
  {
    name: WalletGatewayDto.Fields.name,
    title: t.walletGateways.name,
    width: 200,
  },
  {
    name: WalletGatewayDto.Fields.kind,
    title: t.walletGateways.kind,
    width: 100,
  },
  {
    name: WalletGatewayDto.Fields.isActive,
    title: t.walletGateways.isActive,
    width: 100,
  },
];
