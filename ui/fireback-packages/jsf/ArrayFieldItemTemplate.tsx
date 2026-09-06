import { getTemplate, getUiOptions, type ArrayFieldItemTemplateProps } from "@rjsf/utils";

/**
 * RJSF core's own ArrayFieldItemTemplate
 * (@rjsf/core/lib/components/templates/ArrayFieldItemTemplate.js) lays each
 * item out as a flex row of two `<div>`s - the field content and, next to
 * it, the Remove/Move/Copy toolbar - sized with Bootstrap 3 grid classes
 * (`col-xs-9`/`col-xs-3`, ...) this app (Bootstrap 5) doesn't define, so
 * neither div gets a real width and the layout falls apart.
 *
 * Rather than chase that side-by-side layout, this replacement stacks the
 * two: field content on top, toolbar on its own line below. The toolbar
 * `<div>` is left as a plain, non-full-width inline-flex box (Bootstrap's
 * `.btn-group` is `display: inline-flex`, so it never stretches to fill the
 * line on its own) with no explicit alignment class - a shrink-to-fit
 * inline-level box in normal flow simply starts at its containing block's
 * *inline-start* edge, which - unlike a fixed `left`/`right` - already
 * flips with `direction` for free: left in the LTR form (English/Polish),
 * right in the RTL one (Persian; see RjsfShowcaseDemo.tsx's `dir={dir}` on
 * the form's containing element), with nothing here needing to know which.
 */
export function ArrayFieldItemTemplate(props: ArrayFieldItemTemplateProps) {
  const { children, className, buttonsProps, hasToolbar, registry, uiSchema } = props;
  const uiOptions = getUiOptions(uiSchema);
  const ArrayFieldItemButtonsTemplate = getTemplate("ArrayFieldItemButtonsTemplate", registry, uiOptions);

  return (
    <div className={className}>
      <div>{children}</div>
      {hasToolbar && (
        <div className="btn-group mb-2">
          <ArrayFieldItemButtonsTemplate {...buttonsProps} />
        </div>
      )}
    </div>
  );
}

export default ArrayFieldItemTemplate;
