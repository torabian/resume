import {
  CommonEntityManager,
  type DtoEntity,
} from "@fireback/ui-core/components/entity-manager/CommonEntityManager";
import { useCommonEntityManager } from "@fireback/ui-core/hooks/useCommonEntityManager";
import { useS } from "@fireback/ui-core/hooks/useS";
import { useTreasuryGetActionQuery } from "./sdk/TreasuryGetAction";
import { useTreasuryCreateAction } from "./sdk/TreasuryCreateAction";
import { useTreasuryUpdateAction } from "./sdk/TreasuryUpdateAction";
import { TreasuryDto } from "./sdk/TreasuryDto";
import { TreasuryNavigation } from "./WalletNavigation";
import { TreasuryEditForm } from "./TreasuryEditForm";
import { strings } from "./strings/translations";

// Defensive unwrap for a one/one? field that might still be an MOne instance (rather
// than the plain object CommonEntityManager's own JSON roundtrip normally produces) by
// the time beforeSetValues sees it - same reasoning as WalletConfigEntityManager's own
// unwrapOne fix.
function unwrapOne(value: any): any {
  return value && typeof value.get === "function" ? value.get() : value;
}

// wallet is select-only and locked on edit (TreasuryEditForm disables the picker once
// isEditing) - TreasuryUpdateAction's own generated dto still carries a wallet field,
// but there's no real use case for re-pointing an existing treasury at a different
// wallet after funds may have already moved through it, so this UI doesn't offer it;
// beforeSubmit only sends wallet on create.
export const TreasuryEntityManager = ({ data }: DtoEntity<TreasuryDto>) => {
  const { router, uniqueId, locale } = useCommonEntityManager<
    Partial<TreasuryDto>
  >({
    data,
  });
  const s = useS(strings);

  const getSingleHook = useTreasuryGetActionQuery({
    params: { uniqueId },
  });

  const postHook = useTreasuryCreateAction({});

  const patchHook = useTreasuryUpdateAction({ params: { uniqueId } });

  return (
    <CommonEntityManager
      postHook={postHook}
      getSingleHook={getSingleHook}
      patchHook={patchHook}
      onCancel={() => {
        router.goBackOrDefault(TreasuryNavigation.query(undefined, locale));
      }}
      onFinishUriResolver={(response, locale) =>
        TreasuryNavigation.single(response.data?.uniqueId, locale)
      }
      beforeSetValues={(item: any) => ({
        ...item,
        wallet: unwrapOne(item?.wallet),
      })}
      // beforeSubmit: values.wallet is the flat WalletDto-shaped object
      // TreasuryEditForm's FormSelect works in terms of - convert it to the
      // {__operation:"select", __selector:uniqueId} shape TreasuryCreateAction's own
      // wallet field expects on the wire, same transform PrepaidEntityManager's own
      // treasury field uses. Only sent on create - see this component's own doc
      // comment on why edit never re-points wallet.
      beforeSubmit={(values: any) => {
        const body: any = { ...values };
        if (!uniqueId && values?.wallet?.uniqueId) {
          body.wallet = { __operation: "select", __selector: values.wallet.uniqueId };
        } else {
          delete body.wallet;
        }
        return body;
      }}
      Form={TreasuryEditForm}
      onEditTitle={s.treasuries.editTreasury}
      onCreateTitle={s.treasuries.newTreasury}
      data={data}
    />
  );
};
