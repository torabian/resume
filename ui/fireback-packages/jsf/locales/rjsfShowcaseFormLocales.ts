import { replaceStringParameters, TranslatableString, type RJSFValidationError } from "@rjsf/utils";
import type { SupportedLocale } from "./rjsfShowcaseLocales";

/**
 * RJSF has two separate, independent extension points for localizing
 * anything that isn't part of the schema itself - neither is covered by
 * localizeSchema (that only overlays the *schema's own* title/description/
 * enum-option text):
 *
 *  - `translateString` (registry.translateString) covers RJSF's own built-in
 *    chrome: the "Errors" panel heading, Add/Remove/Move item buttons, the
 *    map-field "%1 Key" placeholder label, etc. - see @rjsf/utils'
 *    TranslatableString enum for the full list. Its default implementation
 *    (englishStringTranslator) just substitutes %1/%2 params into the
 *    english value of whichever TranslatableString was passed in;
 *    translateString below does the same substitution (via
 *    replaceStringParameters) but looks the string up in a translated table
 *    first.
 *
 *  - `transformErrors` (a Form prop) covers ajv8's own validation error
 *    messages ("must have required property 'x'", "must be string", ...) -
 *    these never go through translateString at all. translateValidationErrors
 *    below rebuilds each error's message/stack from its ajv `name` (keyword)
 *    and `params` instead of trying to translate ajv's English wording, using
 *    `error.title` for the field name - which @rjsf/validator-ajv8 already
 *    resolves from the schema's own (already-localized, see localizeSchema)
 *    `title`, so the field name in a translated error is correct without any
 *    extra lookup here.
 */

const translatableStrings: Record<SupportedLocale, Partial<Record<TranslatableString, string>>> = {
  en: {},
  fa: {
    [TranslatableString.ErrorsLabel]: "خطاها",
    [TranslatableString.CloseLabel]: "بستن",
    [TranslatableString.AddButton]: "افزودن",
    [TranslatableString.AddItemButton]: "افزودن مورد",
    [TranslatableString.RemoveButton]: "حذف",
    [TranslatableString.CopyButton]: "کپی",
    [TranslatableString.MoveUpButton]: "انتقال به بالا",
    [TranslatableString.MoveDownButton]: "انتقال به پایین",
    [TranslatableString.NewStringDefault]: "مقدار جدید",
    [TranslatableString.KeyLabel]: "کلید %1",
    [TranslatableString.YesLabel]: "بله",
    [TranslatableString.NoLabel]: "خیر",
  },
  pl: {
    [TranslatableString.ErrorsLabel]: "Błędy",
    [TranslatableString.CloseLabel]: "Zamknij",
    [TranslatableString.AddButton]: "Dodaj",
    [TranslatableString.AddItemButton]: "Dodaj element",
    [TranslatableString.RemoveButton]: "Usuń",
    [TranslatableString.CopyButton]: "Kopiuj",
    [TranslatableString.MoveUpButton]: "Przenieś w górę",
    [TranslatableString.MoveDownButton]: "Przenieś w dół",
    [TranslatableString.NewStringDefault]: "Nowa wartość",
    [TranslatableString.KeyLabel]: "Klucz %1",
    [TranslatableString.YesLabel]: "Tak",
    [TranslatableString.NoLabel]: "Nie",
  },
};

/** Builds the `translateString` Form prop for one locale. */
export function makeTranslateString(locale: SupportedLocale) {
  return (stringToTranslate: TranslatableString, params?: string[]) => {
    const translated = translatableStrings[locale][stringToTranslate] ?? stringToTranslate;
    return replaceStringParameters(translated, params);
  };
}

interface ErrorMessageBuilders {
  required: (field: string) => string;
  type: (field: string, type: string) => string;
  format: (field: string, format: string) => string;
  minLength: (field: string, limit: number) => string;
  maxLength: (field: string, limit: number) => string;
  minimum: (field: string, limit: number) => string;
  maximum: (field: string, limit: number) => string;
  minItems: (field: string, limit: number) => string;
  maxItems: (field: string, limit: number) => string;
  uniqueItems: (field: string) => string;
  pattern: (field: string) => string;
  enum: (field: string) => string;
  additionalProperties: (field: string) => string;
  fallback: (field: string) => string;
}

const errorMessages: Record<SupportedLocale, ErrorMessageBuilders> = {
  en: {
    required: (f) => `${f} is required.`,
    type: (f, t) => `${f} must be a ${t}.`,
    format: (f, fmt) => `${f} must be a valid ${fmt}.`,
    minLength: (f, n) => `${f} must be at least ${n} characters.`,
    maxLength: (f, n) => `${f} must be at most ${n} characters.`,
    minimum: (f, n) => `${f} must be at least ${n}.`,
    maximum: (f, n) => `${f} must be at most ${n}.`,
    minItems: (f, n) => `${f} must have at least ${n} item(s).`,
    maxItems: (f, n) => `${f} must have at most ${n} item(s).`,
    uniqueItems: (f) => `${f} must not contain duplicate items.`,
    pattern: (f) => `${f} does not match the required pattern.`,
    enum: (f) => `${f} must be one of the allowed values.`,
    additionalProperties: (f) => `${f} contains a field that is not allowed.`,
    fallback: (f) => `${f} is invalid.`,
  },
  fa: {
    required: (f) => `${f} الزامی است.`,
    type: (f, t) => `${f} باید از نوع ${t} باشد.`,
    format: (f, fmt) => `${f} باید یک ${fmt} معتبر باشد.`,
    minLength: (f, n) => `${f} باید حداقل ${n} نویسه داشته باشد.`,
    maxLength: (f, n) => `${f} باید حداکثر ${n} نویسه داشته باشد.`,
    minimum: (f, n) => `${f} باید حداقل ${n} باشد.`,
    maximum: (f, n) => `${f} باید حداکثر ${n} باشد.`,
    minItems: (f, n) => `${f} باید حداقل ${n} مورد داشته باشد.`,
    maxItems: (f, n) => `${f} باید حداکثر ${n} مورد داشته باشد.`,
    uniqueItems: (f) => `${f} نباید شامل موارد تکراری باشد.`,
    pattern: (f) => `${f} با الگوی مورد نیاز مطابقت ندارد.`,
    enum: (f) => `${f} باید یکی از مقادیر مجاز باشد.`,
    additionalProperties: (f) => `${f} شامل فیلدی است که مجاز نیست.`,
    fallback: (f) => `${f} نامعتبر است.`,
  },
  pl: {
    required: (f) => `${f} jest wymagane.`,
    type: (f, t) => `${f} musi być typu ${t}.`,
    format: (f, fmt) => `${f} musi być poprawnym formatem ${fmt}.`,
    minLength: (f, n) => `${f} musi mieć co najmniej ${n} znaków.`,
    maxLength: (f, n) => `${f} musi mieć co najwyżej ${n} znaków.`,
    minimum: (f, n) => `${f} musi wynosić co najmniej ${n}.`,
    maximum: (f, n) => `${f} musi wynosić co najwyżej ${n}.`,
    minItems: (f, n) => `${f} musi zawierać co najmniej ${n} element(ów).`,
    maxItems: (f, n) => `${f} musi zawierać co najwyżej ${n} element(ów).`,
    uniqueItems: (f) => `${f} nie może zawierać powtarzających się elementów.`,
    pattern: (f) => `${f} nie pasuje do wymaganego wzorca.`,
    enum: (f) => `${f} musi być jedną z dozwolonych wartości.`,
    additionalProperties: (f) => `${f} zawiera pole, które nie jest dozwolone.`,
    fallback: (f) => `${f} jest nieprawidłowe.`,
  },
};

/** Falls back to the field's last path segment (e.g. ".address.city" -> "city") when ajv/rjsf never resolved a schema title for it. */
function fieldLabelFrom(error: RJSFValidationError): string {
  if (error.title) {
    return error.title;
  }
  const segments = (error.property ?? "").split(/[.[\]]/).filter(Boolean);
  return segments[segments.length - 1] ?? "Field";
}

/**
 * Rebuilds every ajv validation error's message/stack in the given locale.
 * Pass as `<Form transformErrors={(errors) => translateValidationErrors(errors, locale)} />`.
 * Any ajv keyword this file hasn't been taught about yet falls back to the
 * generic "<field> is invalid." message rather than leaking raw English.
 */
export function translateValidationErrors(
  errors: RJSFValidationError[],
  locale: SupportedLocale,
): RJSFValidationError[] {
  const t = errorMessages[locale];

  return errors.map((error) => {
    const field = fieldLabelFrom(error);
    const params: any = error.params ?? {};

    let message: string;
    switch (error.name) {
      case "required":
        message = t.required(field);
        break;
      case "type":
        message = t.type(field, params.type ?? "");
        break;
      case "format":
        message = t.format(field, params.format ?? "");
        break;
      case "minLength":
        message = t.minLength(field, params.limit);
        break;
      case "maxLength":
        message = t.maxLength(field, params.limit);
        break;
      case "minimum":
        message = t.minimum(field, params.limit);
        break;
      case "maximum":
        message = t.maximum(field, params.limit);
        break;
      case "minItems":
        message = t.minItems(field, params.limit);
        break;
      case "maxItems":
        message = t.maxItems(field, params.limit);
        break;
      case "uniqueItems":
        message = t.uniqueItems(field);
        break;
      case "pattern":
        message = t.pattern(field);
        break;
      case "enum":
      case "oneOf":
      case "anyOf":
        message = t.enum(field);
        break;
      case "additionalProperties":
        message = t.additionalProperties(field);
        break;
      default:
        message = t.fallback(field);
    }

    return { ...error, message, stack: message };
  });
}
