import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { strings as coreStrings } from "../../strings/translations";
import { useS } from "../../../hooks/useS";
import { type TMoney } from "../../../types/TMoney";

// Modal body opened by FormMoney.tsx to edit a TMoney value - one currency
// amount input per currency in `currencies`, same "one field per key" shape
// TStringEditModal.tsx uses for locales, just resolving a TMoney (currency
// -> amount) record instead of a TString (locale -> text) one.
export const MoneyEditModal = ({
  close,
  resolve,
  currencies,
  initialValues,
}: {
  close: () => void;
  resolve: (result?: TMoney) => void;
  currencies: readonly string[];
  initialValues: TMoney;
}) => {
  const cs = useS(coreStrings);
  const [values, setValues] = useState<TMoney>(initialValues ?? {});

  return (
    <div className="confirm-drawer-container p-3">
      {currencies.map((currency, index) => (
        <div className="mb-3" key={currency}>
          <label className="form-label">{currency}</label>
          <CurrencyInput
            className="form-control"
            autoFocus={index === 0}
            decimalsLimit={2}
            value={values[currency] ?? ""}
            onValueChange={(value) =>
              setValues((prev) => ({
                ...prev,
                [currency]: value === undefined ? undefined : parseFloat(value),
              }))
            }
          />
        </div>
      ))}
      <div className="row mt-4">
        <div className="col-md-6">
          <button
            type="button"
            className="d-block w-100 btn btn-primary"
            onClick={() => {
              // Drop currencies the user cleared back out entirely rather
              // than resolving them as NaN/undefined - an absent key is
              // what TMoney.Get/Has (Go and TS) treat as "no price set for
              // this currency", not a key holding a bogus value.
              const cleaned: TMoney = {};
              for (const [currency, amount] of Object.entries(values)) {
                if (amount != null && !Number.isNaN(amount)) {
                  cleaned[currency] = amount;
                }
              }
              resolve(cleaned);
            }}
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

export default MoneyEditModal;
