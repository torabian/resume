import {
  useWalletGatewaysActionQuery,
  WalletGatewaysActionQueryParams,
} from "./sdk/WalletGatewaysAction";
import { type WalletGatewayViewDto } from "./sdk/WalletGatewayViewDto";
import { useWalletCurrenciesActionQuery } from "./sdk/WalletCurrenciesAction";
import { type WalletCurrencyViewDto } from "./sdk/WalletCurrencyViewDto";
import { type UseRemoteQuery } from "@fireback/ui-core/types/remoteQuery";

// Feeds TopupScreen's gateway picker - see WalletGatewaysAction (WalletPublic.emi.yml),
// a public-safe projection of the admin wallet module's own gateway list (never
// config/secrets, unlike the admin WalletGatewayBrowseAction, which is root-gated and
// would 403 for an ordinary logged-in user - see WalletGatewaysImplementation.go's own
// doc comment). Same adapter shape as AdminCreateWalletQuerySources.ts's
// useWalletCurrenciesQuerySource. currency narrows results server-side to gateways that
// can actually top up the wallet being funded.
export const useWalletGatewaysQuerySource = (
  currency: string | undefined,
  params?: UseRemoteQuery,
) => {
  const query = useWalletGatewaysActionQuery({
    qs: new WalletGatewaysActionQueryParams({ currency }),
    enabled: !!currency,
  } as any);
  const items = ((query.data as any)?.data?.items ?? []) as WalletGatewayViewDto[];
  return {
    query: query as any,
    items,
    keyExtractor: (item: WalletGatewayViewDto) => item.code as string,
  };
};

// Feeds MyWalletCreateForm's currency picker - see WalletCurrenciesAction, a public-safe
// projection of the admin wallet module's own currency list (never root-gated, unlike
// the admin WalletCurrencyBrowseAction, which would 403 for an ordinary logged-in user -
// see WalletCapabilitiesImplementation.go's own doc comment).
export const useWalletCurrenciesQuerySource = (params?: UseRemoteQuery) => {
  const query = useWalletCurrenciesActionQuery({});
  const items = ((query.data as any)?.data?.items ?? []) as WalletCurrencyViewDto[];
  return {
    query: query as any,
    items,
    keyExtractor: (item: WalletCurrencyViewDto) => item.code as string,
  };
};
