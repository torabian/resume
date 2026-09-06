import { WalletPaymentAttemptDto } from "./sdk/WalletPaymentAttemptDto";
import { strings } from "./strings/translations";

export const columns = (t: typeof strings) => [
  {
    name: WalletPaymentAttemptDto.Fields.purpose,
    title: t.walletPaymentAttempts.purpose,
    width: 100,
  },
  {
    name: WalletPaymentAttemptDto.Fields.amount,
    title: t.walletPaymentAttempts.amount,
    width: 120,
  },
  {
    name: WalletPaymentAttemptDto.Fields.currency,
    title: t.walletPaymentAttempts.currency,
    width: 100,
  },
  {
    name: WalletPaymentAttemptDto.Fields.status,
    title: t.walletPaymentAttempts.status,
    width: 130,
  },
  {
    name: WalletPaymentAttemptDto.Fields.gatewayReference,
    title: t.walletPaymentAttempts.gatewayReference,
    width: 200,
  },
  {
    name: WalletPaymentAttemptDto.Fields.createdAt,
    title: t.walletPaymentAttempts.createdAt,
    width: 180,
  },
];
