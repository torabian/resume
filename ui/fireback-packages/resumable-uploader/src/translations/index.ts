import type { UploaderLocale, UploadTranslations } from "../types";
import { en } from "./en";
import { fa } from "./fa";
import { pl } from "./pl";

export const localeTranslations: Record<UploaderLocale, UploadTranslations> = {
  en,
  fa,
  pl,
};

export type { UploaderLocale };
export { en, fa, pl };
