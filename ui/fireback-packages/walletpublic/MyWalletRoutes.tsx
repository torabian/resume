import { Route } from "react-router-dom";
import { MyWalletNavigation } from "./MyWalletNavigation";
import { MyWalletsArchiveScreen } from "./MyWalletsArchiveScreen";
import { MyWalletSingleScreen } from "./MyWalletSingleScreen";
import { MyWalletEntityManager } from "./MyWalletEntityManager";
import { TopupScreen } from "./TopupScreen";

// Self-service: list (Rquery), create (Rcreate - shown only when
// getWalletCapabilities.allowUserCreateWallet is true, see MyWalletsArchiveScreen),
// detail+history (Rsingle), and topup (Rtopup). No edit route - wallet has no
// self-service update beyond updateWalletSettings, not wired into this UI (see
// MyWalletEntityManager's own doc comment). Same flat-siblings-under-one-parent
// convention as every other *Routes.tsx in this app (see createEntityNavigation's own
// doc comment).
export function useMyWalletRoutes() {
  return (
    <>
      <Route
        element={<MyWalletsArchiveScreen />}
        path={MyWalletNavigation.Rquery}
      ></Route>
      <Route
        element={<MyWalletEntityManager />}
        path={MyWalletNavigation.Rcreate}
      ></Route>
      <Route
        element={<MyWalletSingleScreen />}
        path={MyWalletNavigation.Rsingle}
      ></Route>
      <Route element={<TopupScreen />} path={MyWalletNavigation.Rtopup}></Route>
    </>
  );
}
