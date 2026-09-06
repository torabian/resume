import {
  type RJSFSchema,
  type UiSchema,
  type RegistryFieldsType,
} from "@rjsf/utils";
import { type DatatableColumn } from "@fireback/ui-core/types/DatatableColumn";
import { type createEntityNavigation } from "@fireback/ui-core/sdk/navigation/createEntityNavigation";

/** Shape of every emi-generated useXxxAction query/mutation hook this module
 * plugs in (useXxxBrowseActionQuery, useXxxGetActionQuery, useXxxCreateAction,
 * useXxxUpdateAction, useXxxAwareDeleteAction) - see e.g.
 * fireback-packages/manage/users/UserEntityManager.tsx for how each one is
 * normally called directly. */
export type AnyHook = (...args: any[]) => any;

export type EntityNavigation = ReturnType<typeof createEntityNavigation>;

export interface VirtualEntityManagerProps<T = any> {
  /** kebab-case entity slug, e.g. "widget" - drives the route paths. */
  slug: string;
  /** kebab-case plural slug for the archive route, defaults to `${slug}s`. */
  pluralSlug?: string;
  /** Feature title, e.g. "Widget" - used for page titles and, unless
   * createTitle/editTitle override it, for the create/edit form titles too. */
  title: string;
  createTitle?: string;
  editTitle?: string;

  /** JSON Schema describing the entity - drives the create/edit form and,
   * when `columns`/`fields` aren't given, the archive columns and single
   * view's fields too. */
  schema: RJSFSchema;
  uiSchema?: UiSchema;
  /** Custom rjsf field components, for properties a plain JSON Schema type
   * can't express - e.g. a `complex` field like TString (a locale -> value
   * map, not a plain string - see @fireback/complexes/TString), which needs
   * its own field rather than the default per-`type` one. Reference a key
   * here from `uiSchema`'s `"ui:field"` on that property.
   *
   * Widgets (as opposed to fields) aren't customizable here - those are
   * @fireback/jsf's VirtualForm's own to own (ui-core-styled text/select/
   * checkbox widgets, plus its `entityRelation`/`tstring` widgets - see
   * fireback-packages/jsf/RjsfWidgets.tsx), the same way its templates and
   * translated chrome/error text are. */
  rjsfFields?: RegistryFieldsType;

  /** Transforms a fetched item before it becomes the create/edit form's
   * initial values (see CommonEntityManager's own `beforeSetValues` prop,
   * which this passes straight through). Mainly for a `complex: XDate`
   * field left unset - its Go zero value serializes as `""`, never absent,
   * and ajv's `format: "date"` keyword rejects `""` outright regardless of
   * whether the property is `required` - so an optional date field loaded
   * with no value would otherwise show a permanent, un-clearable validation
   * error. Normalize it to `undefined` here (ajv only validates a property's
   * format when the property is actually present) - e.g.
   * `(data) => ({ ...data, deathDate: data.deathDate || undefined })`. */
  beforeSetValues?: (data: Partial<T>) => Partial<T>;

  /** Archive columns. Derived from `schema.properties` when omitted. */
  columns?: DatatableColumn[];
  /** Single-view fields. Derived from `schema.properties` when omitted.
   * `format` (schema.properties[key].format when derived) flags a property
   * needing type-specific display logic - e.g. "tstring" for a
   * `complex: TString` field, see schemaCasting.ts's formatByFieldFormat. */
  fields?: Array<{ key: string; label: string; format?: string }>;

  /** emi-generated useXxxBrowseActionQuery hook. Presence adds the archive route. */
  browseQuery?: AnyHook;
  /** emi-generated useXxxGetActionQuery hook. Presence adds the single route,
   * and (when present) prefills the edit form. */
  getQuery?: AnyHook;
  /** emi-generated useXxxCreateAction hook. Presence adds the create route. */
  createQuery?: AnyHook;
  /** emi-generated useXxxUpdateAction hook. Presence adds the edit route. */
  updateQuery?: AnyHook;
  /** emi-generated useXxxAwareDeleteAction hook, wired into the archive list. */
  deleteQuery?: AnyHook;

  /** Row -> unique key. Only used where this module itself reads an id back
   * out of a row/response (e.g. resolving where "save" navigates to) -
   * CommonListManager's own grid still keys/selects rows by `.uniqueId`
   * (see CommonListManager.tsx's rowKeyGetter/PaginateUtils.uniqueIdHrefHandler),
   * so a non-default extractor won't change which field the grid links on. */
  keyExtractor?: (m: Partial<T>) => string | undefined;

  /** Storage id for the archive datatable's column widths
   * (see useTableSizingManager) - keep it stable across releases. */
  datatableSizeId?: string;
}
