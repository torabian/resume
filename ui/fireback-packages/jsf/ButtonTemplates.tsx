import { TranslatableString, type IconButtonProps } from "@rjsf/utils";

/**
 * RJSF core's own array/additionalProperties buttons
 * (@rjsf/core/lib/components/templates/ButtonTemplates/IconButton.js) render
 * a `<i className="glyphicon glyphicon-remove">` with no visible text at all
 * - only a `title` tooltip. That's a Bootstrap 3 glyphicon, and this app
 * never loads the glyphicon font, so every Add/Remove/Move/Copy button in an
 * array or additionalProperties field (tags, luckyNumbers,
 * emergencyContacts, metadata, ... in the rjsf showcase) renders as a blank,
 * unlabeled button.
 *
 * These replacements render the same translateString()-derived text
 * (already localized - see rjsfShowcaseFormLocales.ts's translatableStrings)
 * as the button's actual visible label instead of an icon, so the control is
 * legible without depending on any icon font, in every locale.
 */
function TextIconButton({
  iconType = "default",
  icon: _icon,
  className,
  uiSchema: _uiSchema,
  registry: _registry,
  title,
  ...otherProps
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-sm btn-${iconType} ${className ?? ""}`}
      title={title}
      {...otherProps}
    >
      {title}
    </button>
  );
}

export function AddButton(props: IconButtonProps) {
  const { translateString } = props.registry;
  // Wrapped in its own flex row, pushed to the *inline-end* edge (right in
  // LTR, left in RTL - flips with dir the same way ArrayFieldItemTemplate.tsx's
  // per-item toolbar does, just the opposite edge) - deliberately the
  // opposite side from that toolbar's Remove/Move buttons, which sit at
  // inline-start below each item. Same row, same button style, but never
  // directly above/below a Remove button, so a click meant for one can't
  // land on the other by muscle memory.
  //
  // A small *negative* top margin, inline (this app's Bootstrap build has no
  // .mt-n* utilities compiled in - only the positive .mt-* scale exists, so
  // a class name here would silently do nothing). The last item's own
  // toolbar already carries the spacing above this row
  // (ArrayFieldItemTemplate.tsx's `mb-2`) - a positive margin here on top of
  // that pushed this row noticeably lower than the toolbar it's meant to sit
  // level with; this nudges it back up just enough to read as level with it,
  // short of removing all spacing and having the two rows touch.
  return (
    <div className="d-flex justify-content-end" style={{ marginTop: -30 }}>
      <TextIconButton {...props} iconType="info" title={translateString(TranslatableString.AddButton)} />
    </div>
  );
}

export function CopyButton(props: IconButtonProps) {
  const { translateString } = props.registry;
  return <TextIconButton {...props} title={translateString(TranslatableString.CopyButton)} />;
}

export function MoveUpButton(props: IconButtonProps) {
  const { translateString } = props.registry;
  return <TextIconButton {...props} title={translateString(TranslatableString.MoveUpButton)} />;
}

export function MoveDownButton(props: IconButtonProps) {
  const { translateString } = props.registry;
  return <TextIconButton {...props} title={translateString(TranslatableString.MoveDownButton)} />;
}

export function RemoveButton(props: IconButtonProps) {
  const { translateString } = props.registry;
  return (
    <TextIconButton {...props} iconType="danger" title={translateString(TranslatableString.RemoveButton)} />
  );
}

/** Pass as `<Form templates={{ ButtonTemplates: labelledButtonTemplates }} />`. */
export const labelledButtonTemplates = {
  AddButton,
  CopyButton,
  MoveUpButton,
  MoveDownButton,
  RemoveButton,
};
