import { createEntityNavigation } from "@fireback/ui-core/sdk/navigation/createEntityNavigation";

// Route-building helpers for every wallet-module entity/screen this package covers -
// same factory every other module's own Navigation.ts uses (see e.g.
// ui-core/sdk/navigation/MessagingNavigation.ts).
export const WalletNavigation = createEntityNavigation("wallet", "wallets");
export const PrepaidNavigation = createEntityNavigation("prepaid", "prepaids");
export const TreasuryNavigation = createEntityNavigation("treasury", "treasuries");
export const WalletCurrencyNavigation = createEntityNavigation(
  "wallet-currency",
  "wallet-currencies",
);
export const WalletGatewayNavigation = createEntityNavigation(
  "wallet-gateway",
  "wallet-gateways",
);
export const WalletProviderConfigNavigation = createEntityNavigation(
  "wallet-provider-config",
  "wallet-provider-configs",
);
export const WalletTransactionNavigation = createEntityNavigation(
  "wallet-transaction",
  "wallet-transactions",
);
export const WalletPaymentAttemptNavigation = createEntityNavigation(
  "wallet-payment-attempt",
  "wallet-payment-attempts",
);
export const WalletEventNavigation = createEntityNavigation(
  "wallet-event",
  "wallet-events",
);
