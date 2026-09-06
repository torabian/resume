import { useCallback, useMemo } from "react";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { createUdfBrowseQueryHook } from "@fireback/ui-core/hooks/useUdfBrowseQuery";
import { CommonArchiveManager } from "@fireback/ui-core/components/entity-manager/CommonArchiveManager";
import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { type DatatableColumn } from "@fireback/ui-core/types/DatatableColumn";
import { type AnyHook, type EntityNavigation } from "./types";

export function ArchiveScreen({
  nav,
  title,
  columns,
  browseQuery,
  deleteQuery,
  datatableSizeId,
}: {
  nav: EntityNavigation;
  title: string;
  columns: DatatableColumn[];
  browseQuery: AnyHook;
  deleteQuery?: AnyHook;
  datatableSizeId?: string;
}) {
  const router = useRouter();

  // Same reasoning as VirtualEntityManager.tsx's own `nav`/`effectiveColumns`
  // memoization: ArchiveScreen is a real mounted component (it doesn't
  // remount just because whatever calls VirtualEntityManager() re-renders),
  // but it used to hand CommonListManager a brand-new `queryHook`/
  // `uniqueIdHrefHandler` function on every one of ITS OWN re-renders
  // anyway - `createUdfBrowseQueryHook(browseQuery)` built fresh inline, and
  // `uniqueIdHrefHandler`'s arrow closing over `nav` (itself unstable before
  // VirtualEntityManager.tsx's own fix). `browseQuery` is a stable
  // module-level hook reference (the emi-generated useXxxBrowseActionQuery),
  // so memoizing on it - and on `nav`, now that it's stable too - keeps both
  // identities stable across any re-render that isn't an actual prop change,
  // matching the discipline the rest of this package already follows for
  // exactly this failure mode (see effectiveColumns' own comment).
  const queryHook = useMemo(
    () => createUdfBrowseQueryHook(browseQuery),
    [browseQuery],
  );
  const uniqueIdHrefHandler = useCallback(
    (uniqueId: string) => nav.single(uniqueId),
    [nav],
  );
  const newEntityHandler = useCallback(() => router.push(nav.create()), [router, nav]);

  return (
    <CommonArchiveManager newEntityHandler={newEntityHandler} pageTitle={title}>
      <CommonListManager
        id={datatableSizeId}
        columns={columns}
        queryHook={queryHook}
        uniqueIdHrefHandler={uniqueIdHrefHandler}
        deleteHook={deleteQuery}
      />
    </CommonArchiveManager>
  );
}
