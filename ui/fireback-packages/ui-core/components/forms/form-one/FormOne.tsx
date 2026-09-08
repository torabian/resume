// FormOne - the "one"/"one?" relation counterpart to FormSelect, purpose-built
// for an Emi `one`/`one?` field's own value shape instead of a plain option
// list. FormSelect itself works fine as the underlying picker/search UI
// (querySource, keyExtractor, fnLabelFormat, all forwarded as-is) - what it
// doesn't know how to do is make sense of a relation field's value, which
// shows up in at least four different shapes depending on where it's coming
// from:
//
//   - an MOne<T> instance - what every generated *Dto's own relation getter
//     hands back (e.g. ProjectDto.experience: MOne<WorkExperienceDto>),
//     either already a "select" (an id it hasn't resolved into a full T
//     yet) or plain content (a fetched item's full nested value);
//   - a bare T - the raw shape a fetched item's field round-trips as before
//     any Dto class ever touches it (e.g. straight off
//     JSON.parse(JSON.stringify(dto)), as CommonEntityManager's own load
//     effect does);
//   - a bare id (string/number) - the "plainValue" convention for a field
//     that references another entity by uniqueId only by loose convention,
//     not a real OneNullable-backed relation column (see
//     @fireback/jsf/EntityRelationWidget.tsx's own doc comment on exactly
//     this distinction);
//   - null/undefined - unset.
//
// A consuming form used to have to resolve all of this by hand every time
// (see resolveEntityRelationId/buildEntityRelationSelector in
// @fireback/jsf/EntityRelationWidget.tsx, which does the same job but only
// for the plain-object {__operation,__selector} shape, never a real MOne
// instance) - miss one of the shapes above (or the JSON round-trip that a
// loaded-and-never-touched field never goes through
// buildEntityRelationSelector at all) and the field either silently shows
// as unselected, or - worse - resubmits its own raw loaded value verbatim
// on save, which every generated *EntityUpdateFn rejects outright ("...only
// supports the \"select\" operation..."), since a plain loaded object/`{}`
// carries no __operation at all.
//
// FormOne's onChange hands back a ready-to-submit MOne<T> (or undefined) -
// assign it straight into form values (setFieldValue(field, value)), no
// wrapping/unwrapping needed at the call site: MOne's own toJSON() already
// emits the exact {__operation: "select", __selector} shape a generated
// *EntityUpdateFn's OneNullable.UnmarshalJSON expects, whether it travels
// through JSON.stringify(formik.values) directly or through another round
// of new SomeDto(values) first.
import { useMemo } from "react";
import { MOne } from "@fireback/js-remote-ctx/common/operators";
import { FormSelect, type FormSelectProps } from "../form-select/FormSelect";

export interface FormOneProps<T, ValueIdentifier = string> extends Omit<
  FormSelectProps<T, ValueIdentifier>,
  "value" | "onChange" | "multiple"
> {
  value?: MOne<T, ValueIdentifier> | T | ValueIdentifier | null | undefined;
  /**
   * Called with a ready-to-submit MOne<T> for a pick, or `undefined` when
   * cleared. Never `null` for "cleared", even though emigo.OneNullable's
   * wire contract does support an explicit `null` clear - every generated
   * *EntityUpdateFn checked so far runs the same
   * `Operation != "select"` guard regardless of IsSet(), so a literal
   * `null` hits the identical "only supports select" error a stray loaded
   * object does (see @fireback/jsf/EntityRelationWidget.tsx's own onChange
   * comment - same reasoning, same workaround: omit the field entirely
   * (IsSet() false) rather than send a clear the backend can't actually
   * apply yet).
   */
  onChange?: (value: MOne<T, ValueIdentifier> | undefined) => void;
}

// Resolves any of FormOneProps.value's accepted shapes down to the plain id
// FormSelect's own `value` (the actual selected T, looked up by that id
// against `items`) needs. Returns undefined for "nothing to look up" -
// unset, or a selector whose target isn't in the currently loaded page.
//
// Exported (not just used internally below) for callers that need the same
// id - e.g. a label built from a relation field's current value without
// wanting to mount a whole FormOne for it (see
// ProjectDescriptionsTabs.tsx's own tabLabel) - to resolve every shape this
// field's value can arrive in, an MOne instance included; the older
// resolveEntityRelationId (@fireback/jsf/EntityRelationWidget.tsx) never
// handled a real MOne instance, only the plain {__operation,__selector}
// object shape.
export function resolveOneValueId<T, ValueIdentifier>(
  value: MOne<T, ValueIdentifier> | T | ValueIdentifier | null | undefined,
  keyExtractor: (item: T) => ValueIdentifier,
): ValueIdentifier | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (value instanceof MOne) {
    if (value.isSelector()) {
      return value.getSelector();
    }
    if (value.isNull()) {
      return undefined;
    }
    const content = value.get();
    return content === null || content === undefined
      ? undefined
      : keyExtractor(content);
  }

  if (typeof value === "string" || typeof value === "number") {
    return value as unknown as ValueIdentifier;
  }

  // A plain object at this point is either a bare T (the common case - a
  // freshly loaded field, never touched) or the JSON-tagged
  // {__operation, __selector} shape MOne.toJSON() emits for a "select" - a
  // value that went out through this same FormOne once already and came
  // back in via a JSON round trip (e.g. formik state serialized/restored,
  // or a server response echoing the payload back) without ever being
  // re-cast into a real MOne instance. MOne.cast tells the two apart.
  const casted = MOne.cast<T, ValueIdentifier>(value);
  if (casted.ok && casted.value) {
    return resolveOneValueId(casted.value, keyExtractor);
  }
  return keyExtractor(value as T);
}

export function FormOne<T, ValueIdentifier = string>(
  props: FormOneProps<T, ValueIdentifier>,
) {
  const { value, onChange, keyExtractor, querySource, ...rest } = props;
  // Same default as EntityRelationWidget.tsx's own - most items this picks
  // from are fireback entities/dtos, keyed by uniqueId.
  const ke =
    keyExtractor ??
    (((item: any) => item?.uniqueId ?? item?.id) as (
      item: T,
    ) => ValueIdentifier);

  const { items } = querySource({ query: { itemsPerPage: 200 } });

  const selectedId = useMemo(() => resolveOneValueId(value, ke), [value, ke]);
  const selected =
    selectedId !== undefined
      ? (items.find((item) => ke(item) === selectedId) ?? null)
      : null;

  return (
    <>
      <FormSelect<T, ValueIdentifier>
        {...rest}
        keyExtractor={ke}
        querySource={querySource}
        value={selected}
        onChange={(item: T | null) => {
          if (!item) {
            onChange?.(undefined);
            return;
          }
          onChange?.(MOne.select<T, ValueIdentifier>(ke(item)));
        }}
      />
    </>
  );
}

export default FormOne;
