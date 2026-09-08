// VirtualEntityManager - a schema-driven replacement for the per-entity
// bundle of files an emi-generated entity normally needs (see e.g.
// fireback-packages/manage/users/{UserEntityManager,UserRoutes,UserList,
// UserColumns,UserArchiveScreen,UserSingleScreen,UserEditForm}.tsx). Most
// entities don't need a hand-written list/form/single screen at all - a
// JSON Schema (rendered via @fireback/jsf's VirtualForm - see
// EntityJsonSchemaForm.tsx and fireback-packages/jsf/RjsfShowcaseDemo.tsx for
// how that's normally wired up) is enough to render a create/edit form and a
// reasonable read-only single view, and the schema's root properties are
// enough to derive archive columns too. Reach for the hand-written bundle
// instead of this only once an entity actually needs bespoke widgets/
// columns/layout that a plain JSON Schema can't express (e.g.
// UserEditForm's photo uploader).
//
// Ships as its own package (@fireback/virtual-entity-manager) rather than
// living inside @fireback/ui-core - it was tried out first inside a
// consuming app's own src/ (see this repo's git history) before being
// proven out enough to move here; kept as a separate package rather than
// folded into ui-core since not every ui-core consumer wants the rjsf/jsf
// dependency this pulls in.
//
// Usage - same shape as `useUserRoutes()`, called (not rendered - react-
// router v6 walks its children's element tree statically, so the <Route>s
// have to come back as a plain value, not from a mounted custom component)
// from inside a parent route and spread into its children:
//
//   import { VirtualEntityManager } from "@fireback/virtual-entity-manager";
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
import { makeJsonSchemaForm } from "./EntityJsonSchemaForm";
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
    customForm,
    formClassName,
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
    singleScreenExtra,
  } = props;

  // Same reasoning as `effectiveColumns`/`Form` below - and the exact same
  // bug class: createEntityNavigation(...) builds a brand-new object (new
  // .single/.create/.query/... method closures) every call, so leaving this
  // unmemoized handed ArchiveScreen.tsx's uniqueIdHrefHandler/
  // newEntityHandler (both built from `nav`) a fresh function identity on
  // every VirtualEntityManager() re-invocation too - one more spoke of the
  // same "reset react-data-grid's scroll bookkeeping on an unrelated
  // re-render" wheel effectiveColumns' own comment describes, on top of
  // (not instead of) the columns array itself.
  const nav = useMemo(
    () => createEntityNavigation(slug, pluralSlug || `${slug}s`),
    [slug, pluralSlug],
  );
  const getKey = keyExtractor || defaultKeyExtractor;
  const { locale } = useLocale();
  // VirtualEntityManager() is called fresh on every re-render of whatever
  // parent calls it (it's a plain function, not a mounted component React
  // can bail out on), so an unmemoized columnsFromSchema() call handed
  // ArchiveScreen -> CommonListManager a brand-new `columns` array (new
  // objects, new getCellValue closures) on every such re-render - unlike
  // every hand-written *List.tsx (ScoreList, UserList, ...), which passes a
  // stable module-level columns constant. CommonListManager's own `cols`
  // useMemo keys off that array's identity, so react-data-grid saw a "new"
  // columns prop on renders that had nothing to do with columns actually
  // changing, which reset its scroll bookkeeping mid-list and re-fired
  // handleScroll's onScroll -> isAtBottom() check - re-requesting the next
  // cursor over and over instead of only on an actual user scroll. This is
  // what made the infinite-scroll-retriggers bug reproduce only through
  // VirtualEntityManager, never through a plain CommonListManager usage.
  const effectiveColumns = useMemo(
    () => columns || columnsFromSchema(schema, locale),
    [columns, schema, locale],
  );
  const effectiveFields = fieldsFromSchema(schema, fields);

  // See file header comment - this is the one identity that has to survive
  // unrelated re-renders. Assumes `schema`/`uiSchema` are themselves stable
  // references (module-level constants), the same assumption any memoized
  // React value relies on. useMemo is still called unconditionally (rules
  // of hooks) even though its result is only used when `customForm` (see
  // types.ts's own doc comment) is absent - `customForm` itself is already
  // expected to be a stable reference from its own call site, so it's used
  // as-is rather than wrapped in another useMemo.
  const jsonSchemaForm = useMemo(
    () => makeJsonSchemaForm<T>(schema, uiSchema, rjsfFields),
    [schema, uiSchema, rjsfFields],
  );
  const Form = customForm ?? jsonSchemaForm;

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
              formClassName={formClassName}
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
              formClassName={formClassName}
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
              extra={singleScreenExtra}
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
