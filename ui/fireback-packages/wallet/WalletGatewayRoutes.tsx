import { Route } from "react-router-dom";
import { WalletGatewayEntityManager } from "./WalletGatewayEntityManager";
import { WalletGatewaySingleScreen } from "./WalletGatewaySingleScreen";
import { WalletGatewayArchiveScreen } from "./WalletGatewayArchiveScreen";
import { WalletGatewayNavigation } from "./WalletNavigation";

export function useWalletGatewayRoutes() {
  return (
    <>
      <Route
        element={<WalletGatewayEntityManager data={{ isActive: true }} />}
        path={WalletGatewayNavigation.Rcreate}
      />
      <Route
        element={<WalletGatewaySingleScreen />}
        path={WalletGatewayNavigation.Rsingle}
      ></Route>
      <Route
        element={<WalletGatewayEntityManager />}
        path={WalletGatewayNavigation.Redit}
      ></Route>
      <Route
        element={<WalletGatewayArchiveScreen />}
        path={WalletGatewayNavigation.Rquery}
      ></Route>
    </>
  );
}
