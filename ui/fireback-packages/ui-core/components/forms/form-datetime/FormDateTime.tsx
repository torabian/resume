import { useCallback, useRef, useState } from "react";

import moment from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import {
  BaseFormElement,
  type BaseFormElementProps,
} from "../base-form-element/BaseFormElement";

export interface FormDateTimeProps extends BaseFormElementProps {
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  secureTextEntry?: boolean;
  Icon?: any;
  dir?: string;
  errorMessage?: string;
  autoFocus?: boolean;
  validMessage?: string;
  value?: any | null;
  type?: "jalali" | "european";
  focused?: boolean;
  inputProps?: any;
  getInputRef?: (ref: any) => void;
  pattern?: string;
}

export const FormDateTime = (props: FormDateTimeProps) => {
  const {
    placeholder,
    label,
    getInputRef,
    secureTextEntry,
    Icon,
    onChange,
    value,
    errorMessage,
    type,
    focused: f = false,
    autoFocus,
    ...restProps
  } = props;

  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement | null>();
  const onClick = useCallback(() => {
    ref.current?.focus();
  }, [ref.current]);

  return (
    <BaseFormElement focused={focused} onClick={onClick} {...props}>
      <Datetime
        value={moment(props.value)}
        onChange={(e) => props.onChange && props.onChange(e as string)}
        {...props.inputProps}
      />
    </BaseFormElement>
  );
};
