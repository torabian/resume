import { FormSelect, FormSelectMultiple } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { createQuerySource } from "@fireback/ui-core/hooks/useAsQuery";
import type { UseRemoteQuery } from "@fireback/ui-core/types/remoteQuery";
import type { WidgetProps } from "@rjsf/utils";
import { useMemo } from "react";

/**
 * Widget for Emi's `one`/`one?`/`collection`/`collection?` relation fields
 * (e.g. this package's own showcase dto's sponsorWallet/linkedWallets,
 * targeting WalletEntity).
 *
 * These are *not* the same shape as an Emi `array`/`_list` field
 * (WidgetArrayGroup - a repeatable sub-form, each item its own set of
 * inline fields; see ArrayFieldItemTemplate.tsx for that one) even though
 * `collection` also holds many values: a relation field holds references to
 * *existing rows of another entity* - the right control for it is a picker
 * (FormSelect/FormSelectMultiple), not a repeatable form with nothing to
 * fill in.
 *
 * The complication `js:rjsf` can't solve for you: a relation field's
 * compiled JSON Schema is deliberately just `{title, description}` (see
 * formgen/jsonschema.go's own doc comment) - the compiler was never given
 * the target entity's fields, so there is nothing in the schema to
 * auto-derive a picker from. This widget instead expects the *consuming
 * form* to say, per field, which query to run - via uiSchema:
 *
 *   uiSchema: {
 *     linkedWallets: {
 *       "ui:widget": "entityRelation",
 *       "ui:options": {
 *         multiple: true,               // collection -> true, one -> false/omit
 *         querySource: useWalletsQuerySource,  // a FormSelect-shaped query hook - see
 *                                               // wallet/AdminCreateWalletQuerySources.ts
 *         keyExtractor: (w) => w.uniqueId,
 *         fnLabelFormat: (w) => w.label ?? w.uniqueId,
 *       },
 *     },
 *   }
 *
 * `querySource` is itself a hook (it calls react-query's useQuery internally,
 * same as every other querySource in this repo - see
 * AdminCreateWalletQuerySources.ts) and is called unconditionally here,
 * exactly once per widget instance; since a given field's uiSchema always
 * names the same hook, this never violates the rules of hooks. Its result is
 * then wrapped with createQuerySource so FormSelect/FormSelectMultiple only
 * have to deal with one querySource shape (a plain items array) - see
 * RjsfWidgets.tsx's SelectWidget for the same adapter used for enum fields.
 *
 * For a single (`one`/`one?`) relation, picking an item doesn't just send its
 * uniqueId back through `onChange` - see buildEntityRelationSelector()/resolveEntityRelationId()
 * below for the actual wire shape a generated *EntityUpdateFn requires.
 *
 * Not every field that references another entity by uniqueId *is* an Emi
 * `one`/`collection` relation, though - e.g. MusicalWorkDto.performers'
 * `personUniqueId` is a plain `type: string, required` field on an owned
 * array item (Person is looked up by convention, not through an
 * OneNullable-backed FK column the way musicalContext is), so the backend
 * just wants the bare uniqueId string, not the wrapped select-operation
 * shape. Pass `"ui:options": { plainValue: true, ... }` for that case - see
 * MusicalWorkRoutes.tsx's own performers.items.personUniqueId wiring.
 */

function errorMessage(rawErrors?: string[]): string | undefined {
  return rawErrors && rawErrors.length > 0 ? rawErrors.join(", ") : undefined;
}

// A `one`/`one?` field's wire shape on the way *out* isn't just the target's
// uniqueId - it's whatever emigo.OneNullable's UnmarshalJSON accepts (see
// emigo/OneNullable.go), and every generated *EntityUpdateFn only honors one
// of those forms: `{"__operation": "select", "__selector": "<uniqueId>"}`
// (any other shape - a bare id, or the full nested object - fails
// server-side with "updating a one/one? relation only supports the
// \"select\" operation"). Building it here, rather than leaving it to every
// consuming form, means a uiSchema wiring this widget the documented way
// (see this file's own header comment) gets a relation field that actually
// persists, not just one that renders.
//
// Exported (not just used internally below) because a consuming form's own
// `beforeSetValues` needs the exact same shape: an untouched `one`/`one?`
// field round-trips whatever CommonEntityManager last loaded straight back
// into the submit payload (see resolveEntityRelationId's own doc comment on
// what that load actually looks like) - if that's still the full nested
// entity rather than this select-operation shape, an update that never
// touches the relation field at all still fails with the same server-side
// error. Rebuilding it as `{ musicalContext: buildEntityRelationSelector(id) }`
// in `beforeSetValues` (see MusicalWorkRoutes.tsx) keeps an unedited
// selection valid to resubmit, not just valid to initially display.
export function buildEntityRelationSelector(selectorId: any) {
  return { __operation: "select", __selector: selectorId };
}

// The *incoming* side has to accept more shapes than that single outgoing
// one: `value` is whatever CommonEntityManager's beforeSetValues/setValues
// last put into Formik for this field, and that's the full related entity -
// not a selector - on an initial load (CommonEntityManager's own effect
// JSON-round-trips the fetched item through JSON.parse(JSON.stringify(...)),
// which is `OneNullable`'s own MarshalJSON on the *read* side - only ever a
// bare `T` unless a caller explicitly asked for the "select" tag), plain
// `{uniqueId: ...}` for a form that already stores it that way, or (once
// this widget's own onChange below has run at least once without a
// subsequent refetch) the `buildEntityRelationSelector(...)` shape itself.
// Resolving all three down to a bare id is what lets `selected`/
// `selectedIds` below match against `items` (keyed by keyExtractor, e.g.
// `item.uniqueId`) regardless of which shape `value` currently happens to
// be in - exported so a consuming form's own `beforeSetValues` can reuse it
// too (see buildEntityRelationSelector's own doc comment).
export function resolveEntityRelationId(value: any): any {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "object") {
    if ("__selector" in value) return value.__selector;
    if ("uniqueId" in value) return value.uniqueId;
    if ("id" in value) return value.id;
  }
  return value;
}

export function EntityRelationWidget(props: WidgetProps) {
  const { id, value, onChange, label, disabled, readonly, rawErrors, options, schema } = props;

  const querySource = options.querySource as ((params: UseRemoteQuery) => { items: any[] }) | undefined;
  const multiple = !!options.multiple;
  // See this file's own header comment on when to set this - default (false)
  // is every actual Emi `one`/`one?` relation field's OneNullable contract.
  const plainValue = !!options.plainValue;
  const keyExtractor = (options.keyExtractor as (item: any) => any) ?? ((item: any) => item?.uniqueId ?? item?.id);
  const fnLabelFormat =
    (options.fnLabelFormat as (item: any) => string) ??
    ((item: any) => item?.label ?? item?.name ?? String(keyExtractor(item)));

  if (!querySource) {
    return (
      <div className="alert alert-warning">
        No querySource configured for "{label}" - pass one via{" "}
        <code>uiSchema.{String(id)}.ui:options.querySource</code>.
      </div>
    );
  }

  const { items } = querySource({ query: { itemsPerPage: options.itemsPerPage ?? 200, startIndex: 0 } });
  const staticQuerySource = useMemo(() => createQuerySource(items), [items]);

  if (multiple) {
    // Note: unlike the single-value case below, this doesn't (yet) build
    // the `collection`/`collection?` equivalent of buildEntityRelationSelector() above -
    // there's no real backend `collection` *relation* field (as opposed to
    // an owned-rows array like MusicalWorkDto.performers) in this repo yet
    // to confirm the wire shape against. Verify emigo's actual
    // CollectionNullable-based contract for a relation field before relying
    // on this in production the way the single-value branch now can be.
    const selectedIds: any[] = Array.isArray(value)
      ? value.map(resolveEntityRelationId)
      : [];
    const selectedItems = items.filter((item) => selectedIds.includes(keyExtractor(item)));

    return (
      <FormSelectMultiple
        id={id}
        label={label}
        value={selectedItems}
        querySource={staticQuerySource}
        keyExtractor={keyExtractor}
        fnLabelFormat={fnLabelFormat}
        disabled={disabled || readonly}
        hint={schema.description}
        errorMessage={errorMessage(rawErrors)}
        onChange={(nextItems: any[]) => onChange(nextItems.map(keyExtractor))}
      />
    );
  }

  const selectedId = resolveEntityRelationId(value);
  const selected = items.find((item) => keyExtractor(item) === selectedId) ?? null;

  return (
    <FormSelect
      id={id}
      label={label}
      value={selected}
      querySource={staticQuerySource}
      keyExtractor={keyExtractor}
      fnLabelFormat={fnLabelFormat}
      disabled={disabled || readonly}
      hint={schema.description}
      errorMessage={errorMessage(rawErrors)}
      // Clearing the field (item === null) sends `undefined` - omitted from
      // the submitted JSON entirely - rather than a literal `null`:
      // OneNullable does treat `null` as a valid explicit-clear wire form,
      // but every generated *EntityUpdateFn checked so far (see
      // buildEntityRelationSelector's own doc comment) runs the exact same
      // Operation !== "select" check regardless of IsSet(), so a literal
      // null would hit the identical server-side error as any other
      // non-select shape. Leaving the field out of the payload instead
      // means IsSet() is false and the relation is simply left untouched -
      // not the same as actually clearing it, but not a hard failure either
      // (matches this widget's own pre-existing behavior, unchanged here).
      // `plainValue` fields (see this file's own header comment) skip the
      // select-operation wrapping entirely - they're not an OneNullable
      // column, just a plain string that happens to hold another entity's
      // uniqueId, so the bare id is the only shape the backend expects.
      onChange={(item: any) =>
        onChange(
          item
            ? plainValue
              ? keyExtractor(item)
              : buildEntityRelationSelector(keyExtractor(item))
            : undefined,
        )
      }
    />
  );
}

export default EntityRelationWidget;
