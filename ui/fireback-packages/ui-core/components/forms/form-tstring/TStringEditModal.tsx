import { useState } from "react";
import { FormText } from "../form-text/FormText";
import { strings as coreStrings } from "../../strings/translations";
import { useS } from "../../../hooks/useS";
import { type TString } from "../../../types/TString";

// Modal body opened by FormTString.tsx to edit a TString value - one FormText per
// locale, same "one field per language" shape TStringFilterDrawer.tsx uses to build
// a column filter, just resolving the edited record itself instead of a filter
// condition. Kept as its own component (rather than reusing TStringFilterDrawer
// directly) since the two resolve genuinely different shapes - a TString here, a
// {values: TString} filter-drawer result there - even though the field list they
// render is identical.
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
