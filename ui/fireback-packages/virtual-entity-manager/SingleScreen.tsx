import { type ReactNode } from "react";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { formatFieldValue } from "./schemaCasting";
import { type AnyHook, type EntityNavigation } from "./types";

export function SingleScreen({
  nav,
  title,
  fields,
  getQuery,
  updateQuery,
  extra,
}: {
  nav: EntityNavigation;
  title: string;
  fields: Array<{ key: string; label: string; format?: string }>;
  getQuery: AnyHook;
  updateQuery?: AnyHook;
  /** See VirtualEntityManagerProps.singleScreenExtra's own doc comment. */
  extra?: (entity: any) => ReactNode;
}) {
  const router = useRouter();
  const uniqueId = router.query.uniqueId as string;
  const { locale } = useLocale();

  const getSingleHook = getQuery({ params: { uniqueId } });
  const d: any = getSingleHook?.data?.data?.item;
  usePageTitle(title);

  return (
    <CommonSingleManager
      editEntityHandler={
        updateQuery ? () => router.push(nav.edit(uniqueId)) : undefined
      }
      getSingleHook={getSingleHook}
    >
      <GeneralEntityView
        entity={d}
        title={title}
        fields={fields.map(({ key, label, format }) => ({
          label,
          elem: formatFieldValue(d?.[key], format, locale),
        }))}
      />
      {extra?.(d)}
    </CommonSingleManager>
  );
}
