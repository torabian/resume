/**
 * The locales this demo offers a translation for. Field label/description/
 * enum-option translations themselves now come from the compiled dto class
 * (generated/RjsfShowcaseDto.ts's `static JsonSchema`/`static
 * DefaultTranslations`, resolved via resolveSchemaTranslations.ts) plus
 * rjsfShowcaseTranslations.ts's hand-translated fa/pl counterparts - this
 * file used to also hold a hand-written structural overlay for that, back
 * when `emi js:rjsf` gave the schema no translation keys of its own to
 * resolve against.
 */
export type SupportedLocale = "en" | "fa" | "pl";
