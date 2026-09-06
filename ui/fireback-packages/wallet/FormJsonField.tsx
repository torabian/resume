import { useEffect, useState } from "react";
import classNames from "classnames";
import {
  BaseFormElement,
  type BaseFormElementProps,
} from "@fireback/ui-core/components/forms/base-form-element/BaseFormElement";

// A minimal raw-JSON textarea for the wallet module's few `complex: JSON` fields
// (walletGateway.config/supportedCurrencies, walletProviderConfig.config) - there is no
// dedicated JSON editor component anywhere else in ui-core to reuse, and these fields
// are root/admin-only free-form data, so a plain textarea is an acceptable stand-in
// rather than building a full editor for three call sites.
//
// value/onChange work in terms of the parsed JS value (matching every other form
// element's contract) - invalid JSON is kept in the textarea as typed (so a mid-edit
// keystroke never gets silently reverted) but never propagated to onChange, and
// errorMessage surfaces the parse error inline the same way a validation error would.
export interface FormJsonFieldProps extends BaseFormElementProps {
  value?: any;
  onChange?: (value: any) => void;
  rows?: number;
}

export const FormJsonField = (props: FormJsonFieldProps) => {
  const { value, onChange, rows, errorMessage, ...rest } = props;
  const [raw, setRaw] = useState(() => stringify(value));
  const [parseError, setParseError] = useState<string | undefined>();

  // Keep the textarea in sync when the field is set from outside (e.g. loading an
  // existing gateway) - but never while the value is exactly what our own onChange
  // last produced, so a user's in-progress (possibly still-invalid) typing is never
  // clobbered by its own resulting update.
  useEffect(() => {
    setRaw(stringify(value));
    setParseError(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  return (
    <BaseFormElement
      {...rest}
      value={raw}
      errorMessage={errorMessage || parseError}
    >
      <textarea
        rows={rows || 6}
        className={classNames(
          "form-control",
          (errorMessage || parseError) && "is-invalid",
        )}
        value={raw}
        onChange={(e) => {
          const text = e.target.value;
          setRaw(text);
          if (text.trim() === "") {
            setParseError(undefined);
            onChange?.(undefined);
            return;
          }
          try {
            const parsed = JSON.parse(text);
            setParseError(undefined);
            onChange?.(parsed);
          } catch (err: any) {
            setParseError(err?.message || "Invalid JSON");
          }
        }}
      />
    </BaseFormElement>
  );
};

function stringify(value: any) {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value === "string") {
    // Already-serialized JSON coming straight off the wire (complex: JSON fields
    // marshal as a JSON string, not a nested object - see e.g. WalletGatewayDto.ts) -
    // pretty-print it if it parses, otherwise show it verbatim.
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
}
