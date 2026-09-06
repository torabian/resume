import { useState } from "react";
import { FormText } from "../form-text/FormText";
import { strings as coreStrings } from "../../strings/translations";
import { useS } from "../../../hooks/useS";
import { type TString } from "../../../types/TString";
import { localeDir } from "./rtlLocales";

// Modal body opened by FormTString.tsx to edit a TString value - one FormText per
// locale, same "one field per language" shape TStringFilterDrawer.tsx uses to build
// a column filter, just resolving the edited record itself instead of a filter
// condition. Kept as its own component (rather than reusing TStringFilterDrawer
// directly) since the two resolve genuinely different shapes - a TString here, a
// {values: TString} filter-drawer result there - even though the field list they
// render is identical.
//
// Each locale's own field is set to that locale's natural writing direction
// (see rtlLocales.ts), not whatever direction the rest of the app/page
// happens to be in - typing Persian/Arabic text into an LTR-forced input (or
// vice versa) puts the cursor and right-to-left shaping in the wrong place
// regardless of the app's own current locale, since a TString value
// legitimately holds several languages' text at once (this is exactly why
// it's a locale->value map rather than one plain string in the first place).
export const TStringEditModal = ({
  close,
  resolve,
  locales,
  initialValues,
  multiline,
  rows,
}: {
  close: () => void;
  resolve: (result?: TString) => void;
  locales: string[];
  initialValues: TString;
  /** Renders each per-locale field as a `<textarea>` instead of a single-line
   * `<input>` - see FormText.tsx's own `multiline` doc comment. */
  multiline?: boolean;
  rows?: number;
}) => {
  const cs = useS(coreStrings);
  const [values, setValues] = useState<TString>(initialValues ?? {});

  return (
    <div className="confirm-drawer-container p-3">
      {locales.map((locale, index) => (
        <FormText
          key={locale}
          value={values[locale] ?? ""}
          onChange={(value) =>
            setValues((prev) => ({ ...prev, [locale]: value }))
          }
          label={locale.toUpperCase()}
          autoFocus={index === 0}
          multiline={multiline}
          rows={rows}
          dir={localeDir(locale)}
        />
      ))}
      <div className="row mt-4">
        <div className="col-md-6">
          <button
            type="button"
            className="d-block w-100 btn btn-primary"
            onClick={() => resolve(values)}
          >
            {cs.common.save}
          </button>
        </div>
        <div className="col-md-6">
          <button
            type="button"
            className="d-block w-100 btn"
            onClick={() => close()}
          >
            {cs.common.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TStringEditModal;
