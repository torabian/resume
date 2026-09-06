import {
  useUserBrowseActionQuery,
  UserBrowseActionQueryParams,
} from "@fireback/manage/sdk/abac/UserBrowseAction";
import { type UserDto } from "@fireback/manage/sdk/abac/UserDto";
import {
  useWorkspaceBrowseActionQuery,
  WorkspaceBrowseActionQueryParams,
} from "@fireback/manage/sdk/abac/WorkspaceBrowseAction";
import { type WorkspaceDto } from "@fireback/manage/sdk/abac/WorkspaceDto";
import {
  useWalletCurrencyBrowseActionQuery,
  WalletCurrencyBrowseActionQueryParams,
} from "./sdk/WalletCurrencyBrowseAction";
import { type WalletCurrencyDto } from "./sdk/WalletCurrencyDto";
import {
  useWalletBrowseActionQuery,
  WalletBrowseActionQueryParams,
} from "./sdk/WalletBrowseAction";
import { type WalletDto } from "./sdk/WalletDto";
import {
  useTreasuryBrowseActionQuery,
  TreasuryBrowseActionQueryParams,
} from "./sdk/TreasuryBrowseAction";
import { type TreasuryDto } from "./sdk/TreasuryDto";
import { type UseRemoteQuery } from "@fireback/ui-core/types/remoteQuery";

// Same adapter shape as CategoryQuerySource.ts's useCategoriesQuerySource: turns a
// generated Browse action's react-query result into the {query, items, keyExtractor}
// shape FormSelect's querySource prop expects. Used by AdminCreateWalletForm to pick a
// target user/workspace and a currency.

export const useUsersQuerySource = (params?: UseRemoteQuery) => {
  const query = useUserBrowseActionQuery({
    qs: new UserBrowseActionQueryParams({
      itemsPerPage: params?.query?.itemsPerPage ?? 200,
    }),
  });
  const items = ((query.data as any)?.data?.items ?? []) as UserDto[];
  return {
    query: query as any,
    items,
    keyExtractor: (item: UserDto) => item.uniqueId as string,
  };
};

export const useWorkspacesQuerySource = (params?: UseRemoteQuery) => {
  const query = useWorkspaceBrowseActionQuery({
    qs: new WorkspaceBrowseActionQueryParams({
      itemsPerPage: params?.query?.itemsPerPage ?? 200,
    }),
  });
  const items = ((query.data as any)?.data?.items ?? []) as WorkspaceDto[];
  return {
    query: query as any,
    items,
    keyExtractor: (item: WorkspaceDto) => item.uniqueId as string,
  };
};

export const useWalletCurrenciesQuerySource = (params?: UseRemoteQuery) => {
  const query = useWalletCurrencyBrowseActionQuery({
    qs: new WalletCurrencyBrowseActionQueryParams({
      itemsPerPage: params?.query?.itemsPerPage ?? 200,
    }),
  });
  const items = ((query.data as any)?.data?.items ?? []) as WalletCurrencyDto[];
  return {
    query: query as any,
    items,
    keyExtractor: (item: WalletCurrencyDto) => item.code as string,
  };
};

// Used by WalletAdjustBalance to pick the target wallet by uniqueId - admin/root view
// over every wallet regardless of owner, same as WalletList's own browse.
export const useWalletsQuerySource = (params?: UseRemoteQuery) => {
  const query = useWalletBrowseActionQuery({
    qs: new WalletBrowseActionQueryParams({
      itemsPerPage: params?.query?.itemsPerPage ?? 200,
    }),
  });
  const items = ((query.data as any)?.data?.items ?? []) as WalletDto[];
  return {
    query: query as any,
    items,
    keyExtractor: (item: WalletDto) => item.uniqueId as string,
  };
};

// Used by PrepaidEditForm to pick the optional backing treasury for a gift card - see
// prepaid.treasury's own doc comment on Wallet.emi.yml.
export const useTreasuriesQuerySource = (params?: UseRemoteQuery) => {
  const query = useTreasuryBrowseActionQuery({
    qs: new TreasuryBrowseActionQueryParams({
      itemsPerPage: params?.query?.itemsPerPage ?? 200,
    }),
  });
  const items = ((query.data as any)?.data?.items ?? []) as TreasuryDto[];
  return {
    query: query as any,
    items,
    keyExtractor: (item: TreasuryDto) => item.uniqueId as string,
  };
};
