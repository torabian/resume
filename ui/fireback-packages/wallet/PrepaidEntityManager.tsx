import {
  CommonEntityManager,
  type DtoEntity,
} from "@fireback/ui-core/components/entity-manager/CommonEntityManager";
import { useCommonEntityManager } from "@fireback/ui-core/hooks/useCommonEntityManager";
import { useS } from "@fireback/ui-core/hooks/useS";
import { usePrepaidGetActionQuery } from "./sdk/PrepaidGetAction";
import { usePrepaidCreateAction } from "./sdk/PrepaidCreateAction";
import { usePrepaidUpdateAction } from "./sdk/PrepaidUpdateAction";
import { PrepaidDto } from "./sdk/PrepaidDto";
import { PrepaidNavigation } from "./WalletNavigation";
import { PrepaidEditForm } from "./PrepaidEditForm";
import { strings } from "./strings/translations";

export const PrepaidEntityManager = ({ data }: DtoEntity<PrepaidDto>) => {
  const { router, uniqueId, queryClient, locale } = useCommonEntityManager<
    Partial<PrepaidDto>
  >({
    data,
  });
  const s = useS(strings);

  const getSingleHook = usePrepaidGetActionQuery({
    params: { uniqueId },
  });

  const postHook = usePrepaidCreateAction({});

  const patchHook = usePrepaidUpdateAction({ params: { uniqueId } });

  return (
    <CommonEntityManager
      postHook={postHook}
      getSingleHook={getSingleHook}
      patchHook={patchHook}
      onCancel={() => {
        router.goBackOrDefault(PrepaidNavigation.query(undefined, locale));
      }}
      onFinishUriResolver={(response, locale) =>
        PrepaidNavigation.single(response.data?.uniqueId, locale)
      }
      // beforeSubmit: values.treasury is the flat TreasuryDto-shaped object
      // PrepaidEditForm's FormSelect works in terms of (already unwrapped from MOne
      // by CommonEntityManager's own JSON round-trip on load - see MOne.toJSON in
      // sdk/sdk/common/operators.ts, which emits the bare content unless the field
      // was itself a "select" instruction) - convert it to the
      // {__operation:"select", __selector:uniqueId} shape PrepaidCreateAction/
      // PrepaidUpdateAction's own treasury field expects on the wire, same
      // transform WalletConfigEntityManager's own defaultUserWallets uses. Clearing
      // the picker isn't wired to send an explicit null here (FormSelect's
      // `nullable` clear just leaves treasury untouched) - a minor gap, not
      // something any other one/one? field in this package supports yet either.
      beforeSubmit={(data: any) => ({
        ...data,
        treasury: data?.treasury?.uniqueId
          ? { __operation: "select", __selector: data.treasury.uniqueId }
          : data?.treasury,
      })}
      Form={PrepaidEditForm}
      onEditTitle={s.prepaids.editPrepaid}
      onCreateTitle={s.prepaids.newPrepaid}
      data={data}
    />
  );
};
