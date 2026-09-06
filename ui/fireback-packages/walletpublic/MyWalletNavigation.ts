import { createEntityNavigation } from "@fireback/ui-core/sdk/navigation/createEntityNavigation";

// "my-wallet"/"my-wallets" rather than reusing the admin wallet package's own
// WalletNavigation - this is a completely separate, self-service route tree (see
// MyWalletRoutes.tsx), even though both ultimately read/write the same wallet rows.
const base = createEntityNavigation("my-wallet", "my-wallets");

export const MyWalletNavigation = {
  ...base,
  // TopupScreen isn't a create/edit/single/query slot createEntityNavigation already
  // covers - it's a fifth sibling route nested one level under "my-wallet/:uniqueId"
  // (see MyWalletRoutes.tsx's Rtopup), matching WalletAdjustBalance's own
  // "wallet/:uniqueId/adjust-balance" pattern in the admin wallet package.
  topup(uniqueId: string) {
    return `../my-wallet/${uniqueId}/topup`;
  },
  Rtopup: "my-wallet/:uniqueId/topup",
};
