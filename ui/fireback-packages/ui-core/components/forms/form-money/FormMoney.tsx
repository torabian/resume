import "./FormMoney.css";

import classNames from "classnames";
import { CircleDollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BaseFormElement,
  type BaseFormElementProps,
} from "../base-form-element/BaseFormElement";
import { useOverlay } from "@fireback/overlay";
import { strings as coreStrings } from "../../strings/translations";
import { useS } from "../../../hooks/useS";
import { type TMoney } from "../../../types/TMoney";
import { DEMO_CURRENCIES } from "./currencies";
import { MoneyEditModal } from "./MoneyEditModal";

export interface FormMoneyProps extends Omit<BaseFormElementProps, "value"> {
  value?: TMoney | null;
  onChange?: (value: TMoney) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Which currencies to offer in the edit modal - defaults to DEMO_CURRENCIES (USD/EUR/PLN/IRR/GBP). */
  currencies?: readonly string[];
}

const CYCLE_MS = 2000;

// Form field for editing a TMoney value (types/TMoney.ts - a currency -> amount
// map, mirroring complexes.TMoney.go): a price in several currencies at once,
// edited in a modal - see FormTString.tsx's own doc comment, this is the exact
// same pattern (closed-state crossfading button, modal with one field per key)
// just for currency->amount instead of locale->text.
export const FormMoney = (props: FormMoneyProps) => {
  const {
    value,
    onChange,
    disabled,
    placeholder,
    label,
    currencies = DEMO_CURRENCIES,
    ...rest
  } = props;
  const cs = useS(coreStrings);
  const { openModal } = useOverlay();

  const entries = Object.entries(value ?? {}).filter(
    ([, amount]) => amount != null && !Number.isNaN(amount),
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (entries.length < 2) {
      setActiveIndex(0);
      return;
    }
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % entries.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries.length]);

  const active = entries[activeIndex % Math.max(entries.length, 1)];
  const cycling = entries.length > 1;

  const open = () => {
    if (disabled) return;
    openModal<TMoney>(
      (modalProps) => (
        <MoneyEditModal
          {...modalProps}
          currencies={currencies}
          initialValues={value ?? {}}
        />
      ),
      { title: label || cs.actions.edit },
    ).promise.then(({ type, data }) => {
      if (type !== "resolved" || !data) return;
      onChange?.(data);
    });
  };

  return (
    <BaseFormElement {...rest} label={label} onClick={open}>
      <button
        type="button"
        className={classNames("form-control", "form-money")}
        onClick={open}
        disabled={disabled}
      >
        <CircleDollarSign className="form-money__icon" />
        {active ? (
          <span
            key={cycling ? `${active[0]}-${activeIndex}` : active[0]}
            className={classNames(
              "form-money__value",
              cycling && "form-money__value--cycling",
            )}
          >
            <span className="form-money__currency">{active[0]}</span>
            {active[1]}
          </span>
        ) : (
          <span className="form-money__placeholder">
            {placeholder || cs.common.isNUll}
          </span>
        )}
      </button>
    </BaseFormElement>
  );
};

export default FormMoney;
