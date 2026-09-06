import classNames from "classnames";
import { type BaseFormElementProps } from "../base-form-element/BaseFormElement";
import { type UseMutationResult } from "@tanstack/react-query";

export interface FormButtonProps extends BaseFormElementProps {
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  secureTextEntry?: boolean;
  Icon?: any;
  errorMessage?: string;
  isSubmitting?: boolean;
  value?: any | null;
  focused?: boolean;
  type?: "primary" | "secondary";
  getInputRef?: (ref: any) => void;
  children?: React.ReactNode;
  mutation?: UseMutationResult<any, any, Partial<any>, any>;
}

export const FormButton = (
  // Bug fix: intersecting the native button's own `type` ("submit" | "reset" |
  // "button") with FormButtonProps' `type` ("primary" | "secondary") collapsed
  // to `never` - passing either one at all was a compile error. Omit the
  // native one; FormButton hardcodes type="submit" on the rendered <button>
  // below regardless; a caller was never able to override that through this
  // prop anyway.
  props: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> &
    FormButtonProps
) => {
  const {
    placeholder,
    label,
    getInputRef,
    secureTextEntry,
    Icon,
    isSubmitting,
    errorMessage,
    onChange,
    value,
    disabled,
    type,
    focused: f = false,
    className,
    mutation,
    ...restProps
  } = props;

  const isLoading = mutation?.isLoading;

  return (
    <button
      onClick={props.onClick}
      type="submit"
      disabled={disabled || isLoading}
      className={classNames("btn mb-3", `btn-${type || "primary"}`, className)}
      {...props}
    >
      {props.children || props.label}
    </button>
  );
};
