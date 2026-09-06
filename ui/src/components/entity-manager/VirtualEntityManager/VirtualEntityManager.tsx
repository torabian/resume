// VirtualEntityManager - a schema-driven replacement for the per-entity
// bundle of files an emi-generated entity normally needs (see e.g.
// fireback-packages/manage/users/{UserEntityManager,UserRoutes,UserList,
// UserColumns,UserArchiveScreen,UserSingleScreen,UserEditForm}.tsx). Most
// entities don't need a hand-written list/form/single screen at all - a
// JSON Schema (see fireback-packages/jsf/SampleForm.tsx for how @rjsf/core
// is normally wired up) is enough to render a create/edit form and a
// reasonable read-only single view, and the schema's root properties are
// enough to derive archive columns too. Reach for the hand-written bundle
// instead of this only once an entity actually needs bespoke widgets/
// columns/layout that a plain JSON Schema can't express (e.g.
// UserEditForm's photo uploader).
//
// Lives in nima's own src/ (not fireback-packages/) deliberately, for now -
// fireback-packages is copied wholesale from the upstream fireback repo, and
// this is being tried out inside nima first before it's proven out enough to
// promote back into @fireback/ui-core.
//
// Usage - same shape as `useUserRoutes()`, called (not rendered - react-
// router v6 walks its children's element tree statically, so the <Route>s
// have to come back as a plain value, not from a mounted custom component)
// from inside a parent route and spread into its children:
//
//   import { VirtualEntityManager } from "@/components/entity-manager/VirtualEntityManager";
//
//   function useWidgetRoutes() {
//     return VirtualEntityManager({
//       slug: "widget",
//       pluralSlug: "widgets",
//       title: "Widget",
//       schema: WidgetSchema,
//       browseQuery: useWidgetBrowseActionQuery,
//       getQuery: useWidgetGetActionQuery,
//       createQuery: useWidgetCreateAction,
//       updateQuery: useWidgetUpdateAction,
//       deleteQuery: useWidgetAwareDeleteAction,
//     });
//   }
//
//   <Route path="manage">{useWidgetRoutes()}</Route>
//
// Only the routes a given combination of queries can actually support are
// registered: no browseQuery -> no archive route, no getQuery -> no single
// route, no createQuery -> no create route, no updateQuery -> no edit
// route. deleteQuery isn't route-gated - it's wired into the archive list's
// row-selection delete action the same way UserList wires up
// useUserAwareDeleteAction.
//
// Split across this folder: EntityManagerScreen/ArchiveScreen/SingleScreen
// are plain, stably-identified components living in their own files, each
// taking its config as explicit props rather than closing over local
// variables - which also means (unlike an earlier version of this file that
// defined them inline and had to useMemo the whole tree just to stop React
// Router from remounting the matched screen on every re-render) no memoizing
// is needed for *those*: the component references never change across
// renders. `Form` below is the one exception - makeJsonSchemaForm builds a
// new component *type* from `schema`/`uiSchema` and that value is itself
// threaded down as a prop and rendered as `<Form .../>` inside
// CommonEntityManager, so a fresh reference on every call here would remount
// the active create/edit form - dropping focus, cursor position and any
// rjsf-internal UI state - on every re-render of whatever calls
// VirtualEntityManager(), not just on actual schema/uiSchema changes.
import { useMemo } from "react";
import { Route } from "react-router-dom";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { createEntityNavigation } from "@fireback/ui-core/sdk/navigation/createEntityNavigation";
import { type VirtualEntityManagerProps } from "./types";
import {
  columnsFromSchema,
  defaultKeyExtractor,
  fieldsFromSchema,
} from "./schemaCasting";
import { makeJsonSchemaForm } from "./JsonSchemaForm";
import { EntityManagerScreen } from "./EntityManagerScreen";
import { ArchiveScreen } from "./ArchiveScreen";
import { SingleScreen } from "./SingleScreen";

export function VirtualEntityManager<T = any>(
  props: VirtualEntityManagerProps<T>,
) {
  const {
    slug,
    pluralSlug,
    title,
    createTitle,
    editTitle,
    schema,
    uiSchema,
    rjsfFields,
    rjsfWidgets,
    columns,
    fields,
    browseQuery,
    getQuery,
    createQuery,
    updateQuery,
    deleteQuery,
    keyExtractor,
    datatableSizeId,
    beforeSetValues,
  } = props;

  const nav = createEntityNavigation(slug, pluralSlug || `${slug}s`);
  const getKey = keyExtractor || defaultKeyExtractor;
  const { locale } = useLocale();
  // Same reasoning as `Form` below: VirtualEntityManager() is called fresh
  // on every re-render of whatever parent calls it (it's a plain function,
  // not a mounted component React can bail out on), so an unmemoized
  // columnsFromSchema() call handed ArchiveScreen -> CommonListManager a
  // brand-new `columns` array (new objects, new getCellValue closures) on
  // every such re-render - unlike every hand-written *List.tsx (ScoreList,
  // UserList, ...), which passes a stable module-level columns constant.
  // CommonListManager's own `cols` useMemo keys off that array's identity,
  // so react-data-grid saw a "new" columns prop on renders that had nothing
  // to do with columns actually changing, which reset its scroll
  // bookkeeping mid-list and re-fired handleScroll's onScroll ->
  // isAtBottom() check - re-requesting the next cursor over and over
  // instead of only on an actual user scroll. This is what made the
  // infinite-scroll-retriggers bug reproduce only through
  // VirtualEntityManager, never through a plain CommonListManager usage.
  const effectiveColumns = useMemo(
    () => columns || columnsFromSchema(schema, locale),
    [columns, schema, locale],
  );
  const effectiveFields = fieldsFromSchema(schema, fields);

  // See file header comment - this is the one identity that has to survive
  // unrelated re-renders. Assumes `schema`/`uiSchema` are themselves stable
  // references (module-level constants), the same assumption any memoized
  // React value relies on.
  const Form = useMemo(
    () => makeJsonSchemaForm<T>(schema, uiSchema, rjsfFields, rjsfWidgets),
    [schema, uiSchema, rjsfFields, rjsfWidgets],
  );

  return (
    <>
      {createQuery && (
        <Route
          element={
            <EntityManagerScreen<T>
              nav={nav}
              getKey={getKey}
              title={title}
              createTitle={createTitle}
              editTitle={editTitle}
              getQuery={getQuery}
              createQuery={createQuery}
              updateQuery={updateQuery}
              beforeSetValues={beforeSetValues}
              Form={Form}
            />
          }
          path={nav.Rcreate}
        />
      )}
      {updateQuery && (
        <Route
          element={
            <EntityManagerScreen<T>
              nav={nav}
              getKey={getKey}
              title={title}
              createTitle={createTitle}
              editTitle={editTitle}
              getQuery={getQuery}
              createQuery={createQuery}
              updateQuery={updateQuery}
              beforeSetValues={beforeSetValues}
              Form={Form}
            />
          }
          path={nav.Redit}
        />
      )}
      {getQuery && (
        <Route
          element={
            <SingleScreen
              nav={nav}
              title={title}
              fields={effectiveFields}
              getQuery={getQuery}
              updateQuery={updateQuery}
            />
          }
          path={nav.Rsingle}
        />
      )}
      {browseQuery && (
        <Route
          element={
            <ArchiveScreen
              nav={nav}
              title={title}
              columns={effectiveColumns}
              browseQuery={browseQuery}
              deleteQuery={deleteQuery}
              datatableSizeId={datatableSizeId}
            />
          }
          path={nav.Rquery}
        />
      )}
    </>
  );
}
