/**
 * Fireback manage routes,
 * It's for administration a root level content.
 * Some components can be used for sub-level workspaces, but this is not planned yet
 *
 * All routes regarding manage are authenticated, they do not expose public components.
 */

import { Route } from "react-router-dom";
import { useAnalyticsRoutes } from "./analytics/AnalyticsRoutes";
import { useCapabilityRoutes } from "./capabilities/CapabilityRoutes";
import { useEmailProviderRoutes } from "@fireback/messaging/mail-providers/EmailProviderRoutes";
import { useEmailSenderRoutes } from "@fireback/messaging/mail-senders/EmailSenderRoutes";
import { useInternalStatsRoutes } from "./internal-stats/InternalStatsRoutes";
import { useMessagingConfigRoutes } from "./messaging-config/MessagingConfigRoutes";
import { useNotificationsRoutes } from "./notifications/NotificationsRoutes";
import { usePassportMethodRoutes } from "./passport-method/PassportMethodRoutes";
import { useRegionalContentRoutes } from "@fireback/messaging/regional-content/RegionalContentRoutes";
import { useUserRoutes } from "./users/UserRoutes";
import { useWorkspaceConfigRoutes } from "./workspace-config/WorkspaceConfigRoutes";
import { useWorkspaceTypeRoutes } from "./workspace-types/WorkspaceTypeRoutes";
import { useWorkspaceRoutes } from "./workspaces/WorkspaceRoutes";
import { useGsmProviderRoutes } from "@fireback/messaging/gsm-provider/GsmProviderRoutes";
import { useWalletRoutes } from "@fireback/wallet/WalletRoutes";
import { useWalletCurrencyRoutes } from "@fireback/wallet/WalletCurrencyRoutes";
import { useWalletGatewayRoutes } from "@fireback/wallet/WalletGatewayRoutes";
import { useWalletProviderConfigRoutes } from "@fireback/wallet/WalletProviderConfigRoutes";
import { useWalletConfigRoutes } from "@fireback/wallet/WalletConfigRoutes";
import { useWalletTransactionRoutes } from "@fireback/wallet/WalletTransactionRoutes";
import { useWalletPaymentAttemptRoutes } from "@fireback/wallet/WalletPaymentAttemptRoutes";
import { useWalletEventRoutes } from "@fireback/wallet/WalletEventRoutes";
import { usePrepaidRoutes } from "@fireback/wallet/PrepaidRoutes";
import { useTreasuryRoutes } from "@fireback/wallet/TreasuryRoutes";
import { useMyWalletRoutes } from "@fireback/walletpublic/MyWalletRoutes";

export function useManageRoutes() {
  const analyticsRoutes = useAnalyticsRoutes();
  const capabilityRoutes = useCapabilityRoutes();
  const mailProviderRoutes = useEmailProviderRoutes();
  const gsmProviderRoutes = useGsmProviderRoutes();
  const mailSenderRoutes = useEmailSenderRoutes();
  const internalStatsRoutes = useInternalStatsRoutes();
  const messagingConfigRoutes = useMessagingConfigRoutes();
  const notificationsRoutes = useNotificationsRoutes();
  const passportMethodRoutes = usePassportMethodRoutes();
  const userRoutes = useUserRoutes();
  const workspaceConfigRoutes = useWorkspaceConfigRoutes();
  const workspaceTypeRoutes = useWorkspaceTypeRoutes();
  const workspaceRoutes = useWorkspaceRoutes();
  const regionalContentRoutes = useRegionalContentRoutes();
  const walletRoutes = useWalletRoutes();
  const walletCurrencyRoutes = useWalletCurrencyRoutes();
  const walletGatewayRoutes = useWalletGatewayRoutes();
  const walletProviderConfigRoutes = useWalletProviderConfigRoutes();
  const walletConfigRoutes = useWalletConfigRoutes();
  const walletTransactionRoutes = useWalletTransactionRoutes();
  const walletPaymentAttemptRoutes = useWalletPaymentAttemptRoutes();
  const walletEventRoutes = useWalletEventRoutes();
  const prepaidRoutes = usePrepaidRoutes();
  const treasuryRoutes = useTreasuryRoutes();
  const myWalletRoutes = useMyWalletRoutes();

  return (
    <Route path="manage">
      {analyticsRoutes}
      {capabilityRoutes}
      {mailProviderRoutes}
      {mailSenderRoutes}
      {internalStatsRoutes}
      {messagingConfigRoutes}
      {notificationsRoutes}
      {passportMethodRoutes}
      {userRoutes}
      {gsmProviderRoutes}
      {workspaceConfigRoutes}
      {workspaceTypeRoutes}
      {workspaceRoutes}
      {regionalContentRoutes}
      {walletRoutes}
      {walletCurrencyRoutes}
      {walletGatewayRoutes}
      {walletProviderConfigRoutes}
      {walletConfigRoutes}
      {walletTransactionRoutes}
      {walletPaymentAttemptRoutes}
      {walletEventRoutes}
      {prepaidRoutes}
      {treasuryRoutes}
      {myWalletRoutes}
    </Route>
  );
}
