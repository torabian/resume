import { Route } from "react-router-dom";
import { WalletEventSingleScreen } from "./WalletEventSingleScreen";
import { WalletEventArchiveScreen } from "./WalletEventArchiveScreen";
import { WalletEventNavigation } from "./WalletNavigation";

export function useWalletEventRoutes() {
  return (
    <>
      <Route
        element={<WalletEventSingleScreen />}
        path={WalletEventNavigation.Rsingle}
      ></Route>
      <Route
        element={<WalletEventArchiveScreen />}
        path={WalletEventNavigation.Rquery}
      ></Route>
    </>
  );
}
