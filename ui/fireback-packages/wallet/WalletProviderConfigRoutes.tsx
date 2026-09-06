import { Route } from "react-router-dom";
import { WalletProviderConfigEntityManager } from "./WalletProviderConfigEntityManager";
import { WalletProviderConfigSingleScreen } from "./WalletProviderConfigSingleScreen";
import { WalletProviderConfigArchiveScreen } from "./WalletProviderConfigArchiveScreen";
import { WalletProviderConfigNavigation } from "./WalletNavigation";

export function useWalletProviderConfigRoutes() {
  return (
    <>
      <Route
        element={
          <WalletProviderConfigEntityManager
            data={{ region: "global", isEnabled: false }}
          />
        }
        path={WalletProviderConfigNavigation.Rcreate}
      />
      <Route
        element={<WalletProviderConfigSingleScreen />}
        path={WalletProviderConfigNavigation.Rsingle}
      ></Route>
      <Route
        element={<WalletProviderConfigEntityManager />}
        path={WalletProviderConfigNavigation.Redit}
      ></Route>
      <Route
        element={<WalletProviderConfigArchiveScreen />}
        path={WalletProviderConfigNavigation.Rquery}
      ></Route>
    </>
  );
}
