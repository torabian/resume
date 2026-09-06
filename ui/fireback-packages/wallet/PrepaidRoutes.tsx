import { Route } from "react-router-dom";
import { PrepaidEntityManager } from "./PrepaidEntityManager";
import { PrepaidSingleScreen } from "./PrepaidSingleScreen";
import { PrepaidArchiveScreen } from "./PrepaidArchiveScreen";
import { PrepaidNavigation } from "./WalletNavigation";

export function usePrepaidRoutes() {
  return (
    <>
      <Route
        // status defaults to "active" here (create-only - the edit route below reuses
        // the exact same component but never passes this), matching
        // PrepaidCreateAction's own server-side default.
        element={<PrepaidEntityManager data={{ status: "active" }} />}
        path={PrepaidNavigation.Rcreate}
      />
      <Route
        element={<PrepaidSingleScreen />}
        path={PrepaidNavigation.Rsingle}
      ></Route>
      <Route
        element={<PrepaidEntityManager />}
        path={PrepaidNavigation.Redit}
      ></Route>
      <Route
        element={<PrepaidArchiveScreen />}
        path={PrepaidNavigation.Rquery}
      ></Route>
    </>
  );
}
