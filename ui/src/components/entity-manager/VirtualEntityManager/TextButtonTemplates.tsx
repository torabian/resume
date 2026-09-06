import { type IconButtonProps, TranslatableString } from "@rjsf/utils";

// @rjsf/core's own default ButtonTemplates (AddButton.tsx/IconButton.tsx)
// render Bootstrap 3 Glyphicons (`<i className="glyphicon glyphicon-plus">`)
// inside a Bootstrap 3 grid wrapper (`col-xs-4 col-sm-offset-10 ...`) - with
// no visible text at all, only an invisible `title` tooltip attribute. This
// app ships Bootstrap 5 (see ui/package.json), which dropped glyphicons
// entirely and renamed every one of those grid/utility classes - so with no
// icon font loaded and no matching CSS, every array add/remove/move/copy
// button rendered completely blank (this is what "button texts are
// missing" actually was: not a translation gap, a Bootstrap-3-only theme
// with nothing to render its icons). Overriding the whole ButtonTemplates
// registry (see JsonSchemaForm.tsx) with plain labeled buttons sidesteps
// needing a rjsf theme package (@rjsf/bootstrap-4, @mui, ...) or a
// glyphicon font just to make these buttons visible.
function makeTextButton(labelKey: TranslatableString) {
  return function TextButton({
    icon,
    iconType,
    className,
    registry,
    uiSchema,
    title,
    ...rest
  }: IconButtonProps) {
    const label = registry.translateString(labelKey);
    return (
      <button
        type="button"
        className={`btn btn-sm btn-outline-secondary ${className ?? ""}`}
        title={title || label}
        {...rest}
      >
        {label}
      </button>
    );
  };
}

export const TEXT_BUTTON_TEMPLATES = {
  AddButton: makeTextButton(TranslatableString.AddButton),
  CopyButton: makeTextButton(TranslatableString.CopyButton),
  MoveDownButton: makeTextButton(TranslatableString.MoveDownButton),
  MoveUpButton: makeTextButton(TranslatableString.MoveUpButton),
  RemoveButton: makeTextButton(TranslatableString.RemoveButton),
  ClearButton: makeTextButton(TranslatableString.ClearButton),
};
