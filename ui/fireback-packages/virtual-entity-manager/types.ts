import { type ReactNode } from "react";
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

  /** Escape hatch past `schema`/`uiSchema` entirely: when set, this renders
   * as the create/edit form instead of the rjsf form makeJsonSchemaForm
   * would otherwise build from `schema` - `schema`/`uiSchema`/`rjsfFields`
   * are then only used for `columns`/`fields` derivation (archive/single
   * screens), not for the form itself. Same shape/contract as
   * fireback-packages/manage/users/UserEditForm.tsx's `Form` (a plain
   * `EntityFormProps<T>` component: `{form, isEditing, initialData}`,
   * `form` a FormikProps whose wrapped `setValues`/`setFieldValue` already
   * feed CommonEntityManager's submit payload - see its own doc comment) -
   * reach for this once an entity's form needs layout/widgets/repeatable
   * sub-forms (e.g. tabs) a JSON Schema can't express, the same reasoning
   * VirtualEntityManager.tsx's own file header gives for dropping to the
   * fully hand-written bundle, just scoped to only the form instead of
   * every route. Must be a stable reference (a module-level component, or
   * memoized at the call site) - same reasoning as the internal `Form`
   * this replaces (see VirtualEntityManager.tsx's own comment on why). */
  customForm?: any;

  /** Extra class name(s) on the create/edit form's own wrapping `<form>`
   * (CommonEntityManager's `customClass` - see its own doc comment),
   * appended to (not replacing) its default "headless-form-entity-manager"
   * class - so the base class's own rules (e.g. theme-basic.css's
   * `max-width: 500px`) still apply unless this entity's own stylesheet
   * overrides them for the combined selector. Reach for this when a
   * `customForm` needs more horizontal room than every other entity's
   * plain-field form does (e.g. a form with tabs or side-by-side columns) -
   * see ProjectRoutes.tsx for a real usage. */
  formClassName?: string;

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

  /** Extra content rendered on the single/view screen, below the plain
   * field list GeneralEntityView already produces - for an action that
   * doesn't fit "one more row of text" (a button hitting a bespoke
   * endpoint, say) and so has no place in `fields`. Passed the fetched
   * entity itself (whatever `getQuery` resolved, possibly still loading -
   * check for the fields an implementation needs before using them) so it
   * can build its own request/link off it (e.g. `entity?.uniqueId`).
   * Optional and rendered nowhere else - every consumer that doesn't pass
   * this keeps the exact single-screen layout it already had. See
   * resume's own ResumeRoutes.tsx for a real usage (a "Download PDF"
   * button hitting an endpoint outside this entity's own generated CRUD
   * actions). */
  singleScreenExtra?: (entity: Partial<T>) => ReactNode;

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
