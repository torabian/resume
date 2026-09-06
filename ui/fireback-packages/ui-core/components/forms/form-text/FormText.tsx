import classNames from "classnames";
import { useCallback, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  BaseFormElement,
  type BaseFormElementProps,
} from "../base-form-element/BaseFormElement";

export interface FormTextProps extends BaseFormElementProps {
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  onChange?: (value: any) => void;
  readonly?: boolean;

  secureTextEntry?: boolean;
  Icon?: any;
  dir?: string;
  errorMessage?: string;
  autoFocus?: boolean;
  validMessage?: string;
  value?: any | null;
  type?: "text" | "password" | "number" | "phonenumber" | "email";
  focused?: boolean;
  getInputRef?: (ref: any) => void;
  pattern?: string;
  children?: any;
  id?: string;
  /** Renders a `<textarea>` instead of the default single-line `<input>` -
   * same value/onChange contract either way, just a taller multi-line
   * control. `type`/`secureTextEntry`/the phone-number branch are all
   * ignored when this is set (there's no such thing as a password or phone
   * number textarea). */
  multiline?: boolean;
  /** `<textarea rows>` - only meaningful with `multiline`. Defaults to 3. */
  rows?: number;
}

// & React.InputHTMLAttributes<HTMLInputElement>;

export const FormText = (props: FormTextProps) => {
  const {
    label,
    getInputRef,
    secureTextEntry,
    Icon,
    onChange,
    value,
    children,
    errorMessage,
    type,
    focused: f = false,
    autoFocus,
    multiline,
    rows,
    ...restProps
  } = props;

  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement | null>();
  const onClick = useCallback(() => {
    ref.current?.focus();
  }, [ref.current]);

  let innerValue = value === undefined ? "" : value;

  if (type === "number") {
    innerValue = +value;
  }

  const onChangeHandler = (e: any) => {
    if (!onChange) {
      return;
    }
    if (type === "number") {
      onChange(+e.target.value);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <BaseFormElement focused={focused} onClick={onClick} {...props}>
      {props.type === "phonenumber" ? (
        <PhoneInput
          autoFocus={autoFocus}
          value={innerValue}
          // containerClass="form-phone-input"
          onChange={(e) => onChange && onChange(e)}
        />
      ) : multiline ? (
        <textarea
          {...restProps}
          ref={ref as any}
          value={innerValue}
          autoFocus={autoFocus}
          rows={rows ?? 3}
          className={classNames(
            "form-control",
            props.errorMessage && "is-invalid",
            props.validMessage && "is-valid",
          )}
          onChange={onChangeHandler}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
        />
      ) : (
        <input
          {...restProps}
          ref={ref as any}
          value={innerValue}
          autoFocus={autoFocus}
          className={classNames(
            "form-control",
            props.errorMessage && "is-invalid",
            props.validMessage && "is-valid",
          )}
          type={type || "text"}
          onChange={onChangeHandler}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
        />
      )}
      {children}
    </BaseFormElement>
  );
};
