import "./FormTString.css";

import classNames from "classnames";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BaseFormElement,
  type BaseFormElementProps,
} from "../base-form-element/BaseFormElement";
import { useOverlay } from "@fireback/overlay";
import { useSupportedLocales } from "../../../hooks/useSupportedLocales";
import { strings as coreStrings } from "../../strings/translations";
import { useS } from "../../../hooks/useS";
import { type TString } from "../../../types/TString";
import { FormText } from "../form-text/FormText";
import { TStringEditModal } from "./TStringEditModal";
import { RTL_LOCALES, localeDir } from "./rtlLocales";

export interface FormTStringProps extends Omit<BaseFormElementProps, "value"> {
  value?: TString | null;
  onChange?: (value: TString) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Edits each locale through a `<textarea>` instead of a single-line
   * `<input>` - see FormText.tsx's own `multiline` doc comment. In "modal"
   * mode (the default) this only affects the modal's own fields and the
   * closed preview (a wrapped, multi-line block instead of the default
   * single-line ellipsis, and no more cycling between languages - the same
   * reasoning as CYCLE_MS's own comment below: a taller box already shows
   * enough of one language's text at once that cycling every 2s would be
   * more distracting than useful). In "inline" mode it's just whether the
   * one always-visible field is an `<input>` or `<textarea>`. */
  multiline?: boolean;
  /** `<textarea rows>` - only meaningful with `multiline`. */
  rows?: number;
  /**
   * "modal" (the default): a single closed-field button that opens
   * TStringEditModal, one FormText per locale, same as always.
   *
   * "inline": no modal at all - a small row of per-locale tabs sits right
   * above one FormText, switching which locale that field edits. Every
   * keystroke calls `onChange` immediately (there's no separate save/cancel
   * step the way the modal has one) - use this where the extra click to
   * open a modal is more friction than it's worth (a field edited often, or
   * one where seeing the surrounding form while typing matters).
   */
  mode?: "modal" | "inline";
}

const CYCLE_MS = 2000;

// Form field for editing a TString value (types/TString.ts - a locale -> text map,
// mirroring complexes.TString.go), reusing the same "one input per language" idea
// DataGridList's TString column filter already uses (TStringFilterDrawer.tsx) - just
// through a modal instead of a drawer, and resolving the record itself instead of a
// filter condition. See TStringEditModal.tsx for the actual modal-mode edit form, and
// the `mode` prop's own doc comment for the inline alternative.
//
// The closed field (modal mode) is a button, not a text input - there's no single
// string to show. With 2+ non-empty languages it crossfades between them every
// CYCLE_MS (2s) so the user can tell there's more than one without opening the modal;
// with 0 or 1 it just shows the placeholder or that one value, no animation (see
// FormTString.css).
export const FormTString = (props: FormTStringProps) => {
  const {
    value,
    onChange,
    disabled,
    placeholder,
    label,
    multiline,
    rows,
    mode = "modal",
    ...rest
  } = props;
  const cs = useS(coreStrings);
  const { openModal } = useOverlay();
  const locales = useSupportedLocales();

  const entries = Object.entries(value ?? {}).filter(
    ([, text]) => (text ?? "").trim() !== "",
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // See the `multiline` prop's own doc comment - a multi-line preview
    // doesn't cycle at all, so there's no interval to set up in the first
    // place (activeIndex just stays 0, always showing the first non-empty
    // entry). Also irrelevant in "inline" mode (nothing here is rendered
    // there), but harmless to still run.
    if (multiline || entries.length < 2) {
      setActiveIndex(0);
      return;
    }
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % entries.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
    // Only the *count* of non-empty entries should restart the cycle - re-keying it
    // on the entries array itself (a new array every render) would reset the timer
    // on every keystroke made elsewhere in the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries.length, multiline]);

  // Inline mode's own "which language am I typing right now" state - kept
  // even while in modal mode (a component's hook calls can't be
  // conditional on a prop) but simply unused there. Not initialized to
  // `locales[0]` directly since `useSupportedLocales()` can still be
  // resolving its first real list on mount (empty array); recomputed below
  // instead of trusted as-is, so it self-corrects once locales loads.
  const [requestedLocale, setRequestedLocale] = useState<string | null>(null);
  const activeLocale =
    requestedLocale && locales.includes(requestedLocale)
      ? requestedLocale
      : (locales[0] ?? "en");

  const open = () => {
    if (disabled) return;
    openModal<TString>(
      (modalProps) => (
        <TStringEditModal
          {...modalProps}
          locales={locales}
          initialValues={value ?? {}}
          multiline={multiline}
          rows={rows}
        />
      ),
      { title: label || cs.actions.edit },
    ).promise.then(({ type, data }) => {
      if (type !== "resolved" || !data) return;
      onChange?.(data);
    });
  };

  if (mode === "inline") {
    const current = value ?? {};
    return (
      <BaseFormElement {...rest} label={label}>
        <div className="form-tstring-inline">
          <div className="form-tstring-inline__tabs" role="tablist">
            {locales.map((locale) => (
              <button
                key={locale}
                type="button"
                role="tab"
                aria-selected={locale === activeLocale}
                disabled={disabled}
                className={classNames(
                  "form-tstring-inline__tab",
                  locale === activeLocale && "form-tstring-inline__tab--active",
                  (current[locale] ?? "").trim() !== "" &&
                    "form-tstring-inline__tab--filled",
                )}
                onClick={() => setRequestedLocale(locale)}
              >
                {locale.toUpperCase()}
              </button>
            ))}
          </div>
          <FormText
            value={current[activeLocale] ?? ""}
            onChange={(next) =>
              onChange?.({ ...current, [activeLocale]: next })
            }
            placeholder={placeholder}
            disabled={disabled}
            multiline={multiline}
            rows={rows}
            dir={localeDir(activeLocale)}
          />
        </div>
      </BaseFormElement>
    );
  }

  const active = entries[activeIndex % Math.max(entries.length, 1)];
  const cycling = !multiline && entries.length > 1;

  return (
    <BaseFormElement {...rest} label={label} onClick={open}>
      <button
        type="button"
        className={classNames(
          "form-control",
          "form-tstring",
          multiline && "form-tstring--multiline",
        )}
        onClick={open}
        disabled={disabled}
      >
        <Languages className="form-tstring__icon" />
        {active ? (
          <span
            key={cycling ? `${active[0]}-${activeIndex}` : active[0]}
            dir={RTL_LOCALES.includes(active[0]) ? "rtl" : "ltr"}
            className={classNames(
              "form-tstring__value",
              cycling && "form-tstring__value--cycling",
              multiline && "form-tstring__value--multiline",
            )}
          >
            <span className="form-tstring__locale">{active[0].toUpperCase()}</span>
            {active[1]}
          </span>
        ) : (
          <span className="form-tstring__placeholder">
            {placeholder || cs.common.isNUll}
          </span>
        )}
      </button>
    </BaseFormElement>
  );
};

export default FormTString;
