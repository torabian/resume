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

  return (
    <CommonArchiveManager
      newEntityHandler={() => router.push(nav.create())}
      pageTitle={title}
    >
      <CommonListManager
        id={datatableSizeId}
        columns={columns}
        queryHook={createUdfBrowseQueryHook(browseQuery)}
        uniqueIdHrefHandler={(uniqueId: string) => nav.single(uniqueId)}
        deleteHook={deleteQuery}
      />
    </CommonArchiveManager>
  );
}
