import { Route } from "react-router-dom";
import { WalletConfigEntityManager } from "./WalletConfigEntityManager";
import { WalletConfigSingleScreen } from "./WalletConfigSingleScreen";

export function useWalletConfigRoutes() {
  return (
    <>
      <Route
        element={<WalletConfigSingleScreen />}
        path={"wallet-config"}
      ></Route>
      <Route
        element={<WalletConfigEntityManager />}
        path={"wallet-config/edit"}
      ></Route>
    </>
  );
}
