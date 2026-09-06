import { useWalletsQuerySource } from "@fireback/wallet/AdminCreateWalletQuerySources";
import type { ErrorSchema, UiSchema } from "@rjsf/utils";
import { useMemo, useState } from "react";
import { extraErrorsFromLocations } from "./extraErrorsFromLocations";
import { RjsfShowcaseDto } from "./generated/RjsfShowcaseDto";
import { simulateBackendSubmit } from "./locales/rjsfShowcaseBackendSimulation";
import type { SupportedLocale } from "./locales/rjsfShowcaseLocales";
import { rjsfShowcaseTranslations } from "./locales/rjsfShowcaseTranslations";
import { rjsfShowcaseSampleData, rjsfShowcaseUiStrings } from "./locales/rjsfShowcaseUiStrings";
import { resolveSchemaTranslations } from "./resolveSchemaTranslations";
import { VirtualForm } from "./VirtualForm";

type SubmitState = "idle" | "submitting" | "accepted" | "rejected";

const LOCALES: SupportedLocale[] = ["en", "fa", "pl"];
const LOCALE_LABEL: Record<SupportedLocale, string> = {
  en: "English",
  fa: "فارسی",
  pl: "Polski",
};

const walletLabel = (wallet: any) => wallet?.label || wallet?.uniqueId;

// Fields whose compiled schema is unconstrained (`{}` - relations and
// `complex` fields alike, see EntityRelationWidget.tsx/TStringWidget's own
// doc comments for why) have nothing for RJSF to auto-select a widget from,
// so the consuming form has to opt each one into a real widget explicitly.
// sponsorWallet (`one?`) and linkedWallets (`collection?`) both target
// WalletEntity; displayName is a `complex: TString` field (a locale -> text
// map, not a single string). Kept outside the component (a stable object
// identity) since <Form> otherwise has no reason to know it changed between
// renders.
const customWidgetUiSchema: UiSchema = {
  displayName: {
    "ui:widget": "tstring",
  },
  sponsorWallet: {
    "ui:widget": "entityRelation",
    "ui:options": {
      querySource: useWalletsQuerySource,
      keyExtractor: (wallet: any) => wallet.uniqueId,
      fnLabelFormat: walletLabel,
    },
  },
  linkedWallets: {
    "ui:widget": "entityRelation",
    "ui:options": {
      multiple: true,
      querySource: useWalletsQuerySource,
      keyExtractor: (wallet: any) => wallet.uniqueId,
      fnLabelFormat: walletLabel,
    },
  },
};

/**
 * Demonstrates the full round trip @fireback/jsf is meant to prove out. Most
 * of the actual RJSF wiring - which widgets, which templates, translated
 * error messages, the `ensureDispatchableWidgetTypes` schema patch - lives
 * in `VirtualForm.tsx` now, reused as-is by any future dto; this component
 * is left with just what's specific to *this* dto:
 *   1. `generated/RjsfShowcaseDto.ts` - a real TS dto class compiled by `emi
 *      js:dto:class --tags json-schema,typescript` straight from
 *      modules/finance/wallet/RjsfShowcase.dto.emi.yml (one dto, every Emi
 *      field type), carrying `static JsonSchema` (title/description/enum
 *      labels are translation *keys*, not literal text) and `static
 *      DefaultTranslations` (those keys resolved to the dto's own source
 *      language). Nothing in this component edits that file - regenerating
 *      it (see the dto's own header comment) is enough to pick up any dto
 *      change here.
 *   2. `resolveSchemaTranslations` walks `RjsfShowcaseDto.JsonSchema`,
 *      resolving every key through `rjsfShowcaseTranslations[locale]` (a
 *      hand-translated FA/PL counterpart, typed so a missing key is a
 *      compile error - see rjsfShowcaseTranslations.ts) or, for English,
 *      `RjsfShowcaseDto.DefaultTranslations` itself - so the same compiled
 *      schema drives all three languages, passed to `VirtualForm` as its
 *      `schema` prop.
 *   3. A controlled `formData` React state, handed to `VirtualForm` and shown
 *      twice below: as read-only JSON (proving the form really does write
 *      into that state) and as an editable textarea (proving state changes
 *      from *outside* the form also flow back into it).
 *   4. `customWidgetUiSchema` below wires the dto's two WalletEntity relation
 *      fields (sponsorWallet: `one?`, linkedWallets: `collection?`) to a real
 *      entity picker, and its `complex: TString` field (displayName) to a
 *      real translated-text editor - see EntityRelationWidget.tsx/
 *      TStringWidget for why both need this explicit wiring, unlike every
 *      other field kind here - passed to `VirtualForm` as its `uiSchema` prop.
 *   5. The "Submit to the backend" section below simulates a real POST via
 *      `simulateBackendSubmit` (locales/rjsfShowcaseBackendSimulation.ts) -
 *      checks only a server could ever make, coming back as field errors
 *      that get merged onto the same form through `VirtualForm`'s own
 *      `extraErrors` prop (`extraErrorsFromLocations` converts the server's
 *      flat `location`/`message` list into the tree shape it expects).
 */
export function RjsfShowcaseDemo() {
  const [locale, setLocale] = useState<SupportedLocale>("en");
  const [formData, setFormData] = useState<any>(rjsfShowcaseSampleData);
  const [rawText, setRawText] = useState(() => JSON.stringify(rjsfShowcaseSampleData, null, 2));
  const [rawError, setRawError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [extraErrors, setExtraErrors] = useState<ErrorSchema>({});
  const [rejectedErrorCount, setRejectedErrorCount] = useState(0);

  const s = rjsfShowcaseUiStrings[locale];
  const dir = locale === "fa" ? "rtl" : "ltr";

  // Switching language mid-review of a rejected submission would otherwise
  // leave the server's error messages in whichever language they were
  // fetched in, out of sync with everything else on the page re-localizing -
  // simplest correct behaviour is to treat a language switch as a fresh
  // start for the submit section, same as `reset` does for the form data.
  const changeLocale = (next: SupportedLocale) => {
    setLocale(next);
    setSubmitState("idle");
    setExtraErrors({});
    setRejectedErrorCount(0);
  };

  const submit = async () => {
    setSubmitState("submitting");
    const response = await simulateBackendSubmit(formData, locale);
    if (response.ok) {
      setExtraErrors({});
      setSubmitState("accepted");
    } else {
      setExtraErrors(extraErrorsFromLocations(response.errors));
      setRejectedErrorCount(response.errors.length);
      setSubmitState("rejected");
    }
  };

  const schema = useMemo(() => {
    const translations = rjsfShowcaseTranslations[locale] ?? RjsfShowcaseDto.DefaultTranslations;
    return resolveSchemaTranslations(RjsfShowcaseDto.JsonSchema, translations);
  }, [locale]);

  const applyFormData = (next: any) => {
    setFormData(next);
    setRawText(JSON.stringify(next, null, 2));
    setRawError(null);
    // A prior rejection referred to the data that got rejected - once that data
    // changes (from outside the form, via the JSON editor or Reset below), keep
    // showing it would misattribute an old server response to new form values.
    setExtraErrors({});
    setSubmitState("idle");
    setRejectedErrorCount(0);
  };

  const applyRawText = () => {
    try {
      const parsed = JSON.parse(rawText);
      applyFormData(parsed);
    } catch {
      setRawError(s.invalidJson);
    }
  };

  const reset = () => applyFormData(rjsfShowcaseSampleData);

  return (
    <div dir={dir}>
      <h1>{s.title}</h1>
      <p>{s.intro}</p>
      <p>
        <small>{s.sourceNote}</small>
      </p>

      <div className="mb-3">
        <label className="me-2">{s.languageLabel}</label>
        <div className="btn-group" role="group">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              className={`btn btn-sm ${l === locale ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => changeLocale(l)}
            >
              {LOCALE_LABEL[l]}
            </button>
          ))}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h2>{s.formHeading}</h2>
          <VirtualForm
            schema={schema}
            uiSchema={customWidgetUiSchema}
            formData={formData}
            onChange={applyFormData}
            extraErrors={extraErrors}
            locale={locale}
          />

          <h2>{s.submitHeading}</h2>
          <p>{s.submitIntro}</p>
          <button
            type="button"
            className="btn btn-primary"
            disabled={submitState === "submitting"}
            onClick={submit}
          >
            {submitState === "submitting" ? s.submitting : s.submitButton}
          </button>
          {submitState === "accepted" && (
            <p className="text-success mt-2">{s.submitSuccess}</p>
          )}
          {submitState === "rejected" && (
            <p className="text-danger mt-2">
              {s.submitRejected(rejectedErrorCount)}
            </p>
          )}
        </div>

        <div className="col-md-6">
          <h2>{s.dataHeading}</h2>
          <p>{s.dataIntro}</p>
          <pre
            dir="ltr"
            style={{ maxHeight: 300, overflow: "auto", textAlign: "left" }}
          >
            {JSON.stringify(formData, null, 2)}
          </pre>

          <h2>{s.editHeading}</h2>
          <p>{s.editIntro}</p>
          <textarea
            dir="ltr"
            className="form-control"
            style={{ textAlign: "left" }}
            rows={14}
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              setRawError(null);
            }}
          />
          {rawError && <p className="text-danger">{rawError}</p>}
          <div className="mt-2">
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={applyRawText}
            >
              {s.applyButton}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={reset}
            >
              {s.resetButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RjsfShowcaseDemo;
