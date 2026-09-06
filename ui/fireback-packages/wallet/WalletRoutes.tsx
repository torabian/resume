import { Route } from "react-router-dom";
import { AdminCreateWalletEntityManager } from "./AdminCreateWalletEntityManager";
import { WalletArchiveScreen } from "./WalletArchiveScreen";
import { WalletSingleScreen } from "./WalletSingleScreen";
import { WalletAdjustBalance } from "./WalletAdjustBalance";
import { WalletNavigation } from "./WalletNavigation";

// No "/:locale/wallet-edit/:uniqueId" route - unlike category, wallet has no update
// action a client can reach (see Wallet.emi.yml's features override on the wallet
// entity), so /new plus the read-only single screen are the only entity-manager routes.
//
// Bug fix: every path here used to be prefixed with a literal "/:locale/..." segment
// and mounted nowhere at all (useWalletRoutes had no caller anywhere in the app - see
// ManageRoutes.tsx, which now does). Routes no longer carry a locale segment (see
// createEntityNavigation.ts's own history) and this whole tree is mounted as flat
// siblings under ManageRoutes.tsx's shared <Route path="manage">, the same way every
// other module's routes are - so these are relative, unprefixed paths now, matching
// WalletCurrencyNavigation/WalletGatewayNavigation/etc. (WalletNavigation.ts).
export function useWalletRoutes() {
  return (
    <>
      <Route
        element={<AdminCreateWalletEntityManager />}
        path={WalletNavigation.Rcreate}
      />
      <Route
        element={<WalletSingleScreen />}
        path={WalletNavigation.Rsingle}
      ></Route>
      <Route
        element={<WalletAdjustBalance />}
        path={`${WalletNavigation.Rsingle}/adjust-balance`}
      ></Route>
      <Route
        element={<WalletAdjustBalance />}
        path={"wallet-adjust-balance"}
      ></Route>
      <Route
        element={<WalletArchiveScreen />}
        path={WalletNavigation.Rquery}
      ></Route>
    </>
  );
}
