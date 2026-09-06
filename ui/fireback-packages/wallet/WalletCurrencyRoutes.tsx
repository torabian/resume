import { Route } from "react-router-dom";
import { WalletCurrencyEntityManager } from "./WalletCurrencyEntityManager";
import { WalletCurrencySingleScreen } from "./WalletCurrencySingleScreen";
import { WalletCurrencyArchiveScreen } from "./WalletCurrencyArchiveScreen";
import { WalletCurrencyNavigation } from "./WalletNavigation";

export function useWalletCurrencyRoutes() {
  return (
    <>
      <Route
        // isActive/kind get a sane default here (create-only, since the edit route
        // below reuses the exact same component but never passes this) - otherwise an
        // admin who never touches the isActive checkbox would silently create an
        // inactive currency, since it's a required (non-nullable) bool on the wire.
        element={
          <WalletCurrencyEntityManager data={{ isActive: true, kind: "fiat" }} />
        }
        path={WalletCurrencyNavigation.Rcreate}
      />
      <Route
        element={<WalletCurrencySingleScreen />}
        path={WalletCurrencyNavigation.Rsingle}
      ></Route>
      <Route
        element={<WalletCurrencyEntityManager />}
        path={WalletCurrencyNavigation.Redit}
      ></Route>
      <Route
        element={<WalletCurrencyArchiveScreen />}
        path={WalletCurrencyNavigation.Rquery}
      ></Route>
    </>
  );
}
