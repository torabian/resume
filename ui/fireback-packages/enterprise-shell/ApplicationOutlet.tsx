import { QueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { ActionMenuProvider } from "@fireback/ui-core/components/action-menu/ActionMenu";

import { DomOverlayProvider } from "@fireback/overlay/dom";
import { FormSelectLocaleProvider } from "@fireback/ui-core/components/forms/form-select/translations";
import { LoadingRibbonProvider } from "@fireback/ui-core/components/loading-ribbon/LoadingRibbonContext";
import { ReactiveSearchProvider } from "@fireback/ui-core/components/reactive-search/ReactiveSearchContext";
import { AppConfigProvider } from "@fireback/ui-core/hooks/appConfigTools";
import { BUILD_VARIABLES } from "@fireback/ui-core/hooks/build-variables";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";

/**
 * Shows routes of the application, can be independently used,
 * needs to be wrapped in a router
 * @param param0
 * @returns
 */
export const ApplicationOutlet = ({
  routerId,
  ApplicationRoutes,
  queryClient,
}: {
  routerId: string;
  ApplicationRoutes: any;
  queryClient: QueryClient;
}) => {
  const { locale } = useLocale();

  return (
    <AppConfigProvider
      initialConfig={{
        remote: BUILD_VARIABLES.REMOTE_SERVICE,
      }}
    >
      <LoadingRibbonProvider>
        <ReactiveSearchProvider>
          <ActionMenuProvider>
            <FormSelectLocaleProvider value={locale}>
              <DomOverlayProvider>
                <ApplicationRoutes routerId={routerId} />
              </DomOverlayProvider>
            </FormSelectLocaleProvider>
            <ToastContainer />
          </ActionMenuProvider>
        </ReactiveSearchProvider>
      </LoadingRibbonProvider>
    </AppConfigProvider>
  );
};
