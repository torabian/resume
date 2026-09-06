import type { UploaderLocale, UploadTranslations } from "./types";
import { en, fa, pl, localeTranslations } from "./translations/index";

export { en, fa, pl, localeTranslations };

export const defaultUploadTranslations: UploadTranslations = localeTranslations.en;

export function mergeTranslations(
  overrides?: Partial<UploadTranslations>,
  locale?: UploaderLocale,
): UploadTranslations {
  const base = locale ? localeTranslations[locale] : defaultUploadTranslations;
  return { ...base, ...overrides };
}
