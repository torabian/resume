import { Route } from "react-router-dom";
import { TreasurySingleScreen } from "./TreasurySingleScreen";
import { TreasuryArchiveScreen } from "./TreasuryArchiveScreen";
import { TreasuryEntityManager } from "./TreasuryEntityManager";
import { TreasuryNavigation } from "./WalletNavigation";

export function useTreasuryRoutes() {
  return (
    <>
      <Route
        element={<TreasuryEntityManager data={{}} />}
        path={TreasuryNavigation.Rcreate}
      ></Route>
      <Route
        element={<TreasurySingleScreen />}
        path={TreasuryNavigation.Rsingle}
      ></Route>
      <Route
        element={<TreasuryEntityManager />}
        path={TreasuryNavigation.Redit}
      ></Route>
      <Route
        element={<TreasuryArchiveScreen />}
        path={TreasuryNavigation.Rquery}
      ></Route>
    </>
  );
}
