import {
  CommonEntityManager,
  type DtoEntity,
} from "@fireback/ui-core/components/entity-manager/CommonEntityManager";
import { useCommonEntityManager } from "@fireback/ui-core/hooks/useCommonEntityManager";
import { useS } from "@fireback/ui-core/hooks/useS";
import { useCreateWalletAction } from "./sdk/CreateWalletAction";
import { useGetWalletCapabilitiesActionQuery } from "./sdk/GetWalletCapabilitiesAction";
import { type WalletViewDto } from "./sdk/WalletViewDto";
import { MyWalletNavigation } from "./MyWalletNavigation";
import { MyWalletCreateForm } from "./MyWalletCreateForm";
import { strings } from "./strings/translations";

// Create-only - unlike every other *EntityManager.tsx in this app, there is no edit
// route/patchHook (wallet has no update action of its own beyond updateWalletSettings,
// not wired here - see MyWalletSingleScreen's own doc comment). ownerType is always
// "user": this screen only ever creates a wallet for the caller themselves, matching
// what MyWalletsList/MyWalletsAction only ever lists.
//
// Whether self-service create is even turned on (walletConfig.allowUserCreateWallet) is
// checked right here, not on MyWalletsArchiveScreen's "New wallet" button - that button
// is registered once, at mount, by a shared action-menu hook (ActionMenu.tsx's
// useActions/useNewAction) that doesn't re-run once an async capability query resolves,
// so gating it there would leave it stuck on whatever the loading-state value happened
// to be. This screen has no such problem: it only renders once the caller has already
// navigated here, so a plain conditional render on the loaded capability works fine -
// createWallet itself re-checks the same flag server-side regardless either way.
export const MyWalletEntityManager = ({ data }: DtoEntity<Partial<WalletViewDto>>) => {
  const { router, locale } = useCommonEntityManager<Partial<WalletViewDto>>({
    data,
  });
  const s = useS(strings);

  const capabilitiesQuery = useGetWalletCapabilitiesActionQuery({});
  const capabilities = (capabilitiesQuery.data as any)?.data?.item;
  const canCreate = capabilities ? !!capabilities.allowUserCreateWallet : true;

  const postHook = useCreateWalletAction({});

  if (capabilitiesQuery.isLoading) {
    return null;
  }

  if (!canCreate) {
    return (
      <div className="alert alert-warning">
        {s.myWallets.createDisabled}
      </div>
    );
  }

  return (
    <CommonEntityManager
      postHook={postHook}
      onCancel={() => {
        router.goBackOrDefault(MyWalletNavigation.query(undefined, locale));
      }}
      onFinishUriResolver={(response, locale) =>
        MyWalletNavigation.single(response.data?.uniqueId, locale)
      }
      beforeSubmit={(values: any) => ({
        ownerType: "user",
        currency: values.currency,
        label: values.label || undefined,
      })}
      Form={MyWalletCreateForm}
      onCreateTitle={s.myWallets.newWallet}
      data={data}
    />
  );
};
