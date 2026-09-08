import { useCommonEntityManager } from "@fireback/ui-core/hooks/useCommonEntityManager";
import { CommonEntityManager } from "@fireback/ui-core/components/entity-manager/CommonEntityManager";
import { type AnyHook, type EntityNavigation } from "./types";

/** Serves both the create and edit routes - same as UserEntityManager.tsx
 * serving both UserNavigation.Rcreate and .Redit, telling create/edit apart
 * via useCommonEntityManager's own `uniqueId` route param. */
export function EntityManagerScreen<T>({
  nav,
  getKey,
  title,
  createTitle,
  editTitle,
  getQuery,
  createQuery,
  updateQuery,
  beforeSetValues,
  Form,
  formClassName,
}: {
  nav: EntityNavigation;
  getKey: (m: Partial<T>) => string | undefined;
  title: string;
  createTitle?: string;
  editTitle?: string;
  getQuery?: AnyHook;
  createQuery?: AnyHook;
  updateQuery?: AnyHook;
  beforeSetValues?: (data: Partial<T>) => Partial<T>;
  Form: any;
  formClassName?: string;
}) {
  const { router, uniqueId, locale } = useCommonEntityManager<Partial<T>>();

  const getSingleHook = getQuery?.({ params: { uniqueId } });
  const postHook = createQuery?.({});
  const patchHook = updateQuery?.({ params: { uniqueId } });

  return (
    <CommonEntityManager
      postHook={postHook}
      getSingleHook={getSingleHook}
      patchHook={patchHook}
      onCancel={() => {
        router.goBackOrDefault(nav.query(undefined, locale));
      }}
      onFinishUriResolver={(response) =>
        nav.single(getKey(response.data?.item), locale)
      }
      beforeSetValues={beforeSetValues}
      Form={Form}
      customClass={
        formClassName
          ? `headless-form-entity-manager ${formClassName}`
          : undefined
      }
      onEditTitle={editTitle || `Edit ${title}`}
      onCreateTitle={createTitle || `New ${title}`}
    />
  );
}
