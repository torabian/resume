import { Route } from "react-router-dom";
import { WalletTransactionSingleScreen } from "./WalletTransactionSingleScreen";
import { WalletTransactionArchiveScreen } from "./WalletTransactionArchiveScreen";
import { WalletTransactionNavigation } from "./WalletNavigation";

// Read-only entity: no create/edit route, only a browse list and a single-item view.
export function useWalletTransactionRoutes() {
  return (
    <>
      <Route
        element={<WalletTransactionSingleScreen />}
        path={WalletTransactionNavigation.Rsingle}
      ></Route>
      <Route
        element={<WalletTransactionArchiveScreen />}
        path={WalletTransactionNavigation.Rquery}
      ></Route>
    </>
  );
}
