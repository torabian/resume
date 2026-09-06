import { Route } from "react-router-dom";
import { WalletPaymentAttemptSingleScreen } from "./WalletPaymentAttemptSingleScreen";
import { WalletPaymentAttemptArchiveScreen } from "./WalletPaymentAttemptArchiveScreen";
import { WalletPaymentAttemptNavigation } from "./WalletNavigation";

export function useWalletPaymentAttemptRoutes() {
  return (
    <>
      <Route
        element={<WalletPaymentAttemptSingleScreen />}
        path={WalletPaymentAttemptNavigation.Rsingle}
      ></Route>
      <Route
        element={<WalletPaymentAttemptArchiveScreen />}
        path={WalletPaymentAttemptNavigation.Rquery}
      ></Route>
    </>
  );
}
