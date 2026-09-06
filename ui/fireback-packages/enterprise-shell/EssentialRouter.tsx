import { strings } from "@fireback/ui-core/components/strings/translations";
import { useS } from "@fireback/ui-core/hooks/useS";

import { NotFound404 } from "@fireback/ui-core/components/404/NotFound404";
import { useRtlClass } from "@fireback/ui-core/hooks/useRtlClass";

import { useManageRoutes } from "@fireback/manage/ManageRoutes";
import { useMobileKitRoutes } from "@fireback/mobile-kit/dashboard/ManageRoutes";
import { SettingsScreen } from "@fireback/selfservice/personal-settings/SettingsScreen";
import { useSelfServiceAuthenticateRoutes } from "@fireback/selfservice/SelfServiceRoutes";
import Layout from "@fireback/ui-core/components/layouts/Layout";
import { PageTitleProvider } from "@fireback/ui-core/components/page-title/PageTitle";
import { BUILD_VARIABLES } from "@fireback/ui-core/hooks/build-variables";
import { useRemoteMenuResolver } from "@fireback/ui-core/hooks/useRemoteMenuResolver";
import { Navigate, Route, Routes } from "react-router-dom";

export function FirebackEssentialRouterManager({
  children,
  routerId,
}: {
  children?: any;
  routerId?: string;
}) {
  const s = useS(strings);
  useRtlClass();
  const sidebarMenu = useRemoteMenuResolver("sidebar");

  const selfServiceAuthenticateRoutes = useSelfServiceAuthenticateRoutes();
  const manageRoutes = useManageRoutes();
  const mobileKitRoutes = useMobileKitRoutes();

  // ~ auto:useRouteDefs

  return (
    <PageTitleProvider affix={s.productName}>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={BUILD_VARIABLES.DEFAULT_ROUTE || "/signin"} replace />
          }
        />
        <Route
          element={<Layout routerId={routerId} sidebarMenu={sidebarMenu} />}
        >
          <Route path="settings" element={<SettingsScreen />} />

          {selfServiceAuthenticateRoutes}
          {manageRoutes}
          {mobileKitRoutes}

          {children}

          {/* ~ auto:useRouteJsx */}

          <Route path="*" element={<NotFound404 />} />
        </Route>

        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </PageTitleProvider>
  );
}
