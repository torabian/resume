import type { SupportedLocale } from "./rjsfShowcaseLocales";

/** Page chrome text around the form itself (headings, buttons, hints) - not part of the compiled schema. */
export interface RjsfShowcaseUiStrings {
  title: string;
  intro: string;
  languageLabel: string;
  formHeading: string;
  dataHeading: string;
  dataIntro: string;
  editHeading: string;
  editIntro: string;
  applyButton: string;
  resetButton: string;
  invalidJson: string;
  sourceNote: string;
  submitHeading: string;
  submitIntro: string;
  submitButton: string;
  submitting: string;
  submitSuccess: string;
  submitRejected: (count: number) => string;
}

export const rjsfShowcaseUiStrings: Record<SupportedLocale, RjsfShowcaseUiStrings> = {
  en: {
    title: "Emi DTO → RJSF showcase",
    intro:
      "This form is rendered from a JSON Schema compiled by Emi's `js:rjsf` target directly from a single dto (RjsfShowcase.dto.emi.yml) — every Emi field type appears at least once. Switch languages below: the schema's labels and this page's own text are relabelled without touching the compiled schema itself.",
    languageLabel: "Language",
    formHeading: "Form",
    dataHeading: "Filled data",
    dataIntro:
      "This is exactly the `formData` state the form above is controlled by — change a field above and watch it update here.",
    editHeading: "Edit the JSON directly",
    editIntro: "Or edit the JSON below and apply it — the form above re-renders with your changes.",
    applyButton: "Apply to form",
    resetButton: "Reset to sample data",
    invalidJson: "Invalid JSON — fix it before applying.",
    sourceNote:
      "Schema source: modules/finance/wallet/RjsfShowcase.dto.emi.yml, compiled with `emi js:rjsf`.",
    submitHeading: "Submit to the backend",
    submitIntro:
      "Client-side validation (above) only ever catches what the JSON Schema itself expresses. This simulates a real POST: the fake backend rejects it with its own field errors — checks only the server can make (a name already taken, an unsupported city, ...) — merged straight onto the matching fields, including ones nested several levels deep and inside an array item.",
    submitButton: "Simulate POST",
    submitting: "Submitting…",
    submitSuccess: "The backend accepted the submission.",
    submitRejected: (count) =>
      `The backend rejected the submission with ${count} field error${count === 1 ? "" : "s"} — see them on the form above.`,
  },
  fa: {
    title: "نمایش Emi DTO → RJSF",
    intro:
      "این فرم از یک JSON Schema رندر شده که مستقیماً از یک dto (RjsfShowcase.dto.emi.yml) توسط هدف `js:rjsf` کامپایلر Emi ساخته شده است — هر نوع فیلد Emi حداقل یک‌بار در آن دیده می‌شود. زبان را در پایین تغییر دهید: برچسب‌های schema و متن این صفحه بدون دست‌کاری خودِ schema کامپایل‌شده تغییر می‌کنند.",
    languageLabel: "زبان",
    formHeading: "فرم",
    dataHeading: "داده‌های پر شده",
    dataIntro:
      "این دقیقاً همان state با نام `formData` است که فرم بالا با آن کنترل می‌شود — یک فیلد را در بالا تغییر دهید و ببینید اینجا به‌روزرسانی می‌شود.",
    editHeading: "ویرایش مستقیم JSON",
    editIntro: "یا JSON زیر را ویرایش و اعمال کنید — فرم بالا با تغییرات شما دوباره رندر می‌شود.",
    applyButton: "اعمال روی فرم",
    resetButton: "بازگشت به داده نمونه",
    invalidJson: "JSON نامعتبر است — پیش از اعمال آن را اصلاح کنید.",
    sourceNote:
      "منبع schema: modules/finance/wallet/RjsfShowcase.dto.emi.yml، کامپایل‌شده با `emi js:rjsf`.",
    submitHeading: "ارسال به بک‌اند",
    submitIntro:
      "اعتبارسنجی سمت کلاینت (بالا) فقط چیزی را می‌گیرد که خودِ JSON Schema بیان می‌کند. این دکمه یک POST واقعی را شبیه‌سازی می‌کند: بک‌اند ساختگی آن را با خطاهای فیلد خودش رد می‌کند — بررسی‌هایی که فقط سرور می‌تواند انجام دهد (نامی که قبلاً گرفته شده، شهری که پشتیبانی نمی‌شود، ...) — که مستقیماً روی فیلدهای متناظر، حتی آن‌هایی که چند سطح تودرتو هستند یا داخل یک آیتم آرایه قرار دارند، اعمال می‌شوند.",
    submitButton: "شبیه‌سازی POST",
    submitting: "در حال ارسال…",
    submitSuccess: "بک‌اند ارسال را پذیرفت.",
    submitRejected: (count) => `بک‌اند ارسال را با ${count} خطای فیلد رد کرد — آن‌ها را در فرم بالا ببینید.`,
  },
  pl: {
    title: "Podgląd Emi DTO → RJSF",
    intro:
      "Ten formularz jest renderowany na podstawie schematu JSON skompilowanego przez cel `js:rjsf` kompilatora Emi bezpośrednio z jednego dto (RjsfShowcase.dto.emi.yml) — każdy typ pola Emi występuje co najmniej raz. Zmień język poniżej: etykiety schematu i tekst tej strony zmieniają się bez ingerencji w sam skompilowany schemat.",
    languageLabel: "Język",
    formHeading: "Formularz",
    dataHeading: "Wypełnione dane",
    dataIntro:
      "To dokładnie ten sam stan `formData`, którym sterowany jest powyższy formularz — zmień pole powyżej i obserwuj aktualizację tutaj.",
    editHeading: "Edytuj JSON bezpośrednio",
    editIntro:
      "Albo edytuj poniższy JSON i zastosuj go — formularz powyżej odświeży się z Twoimi zmianami.",
    applyButton: "Zastosuj w formularzu",
    resetButton: "Przywróć dane przykładowe",
    invalidJson: "Nieprawidłowy JSON — popraw go przed zastosowaniem.",
    sourceNote:
      "Źródło schematu: modules/finance/wallet/RjsfShowcase.dto.emi.yml, skompilowane poleceniem `emi js:rjsf`.",
    submitHeading: "Wyślij do backendu",
    submitIntro:
      "Walidacja po stronie klienta (powyżej) wykrywa tylko to, co wyraża sam schemat JSON. To symuluje prawdziwe żądanie POST: fikcyjny backend odrzuca je z własnymi błędami pól — sprawdzeniami, które może wykonać tylko serwer (nazwa już zajęta, nieobsługiwane miasto, ...) — dopasowanymi bezpośrednio do właściwych pól, także tych zagnieżdżonych kilka poziomów głębiej i wewnątrz elementu tablicy.",
    submitButton: "Symuluj POST",
    submitting: "Wysyłanie…",
    submitSuccess: "Backend zaakceptował zgłoszenie.",
    submitRejected: (count) =>
      `Backend odrzucił zgłoszenie z ${count} błędami pól — zobacz je w formularzu powyżej.`,
  },
};

/** Sample formData matching generated/RjsfShowcaseDto.schema.json - one value per field, every widget kind filled in. */
export const rjsfShowcaseSampleData = {
  fullName: "Alicja Nowak",
  nickname: "Ali",
  displayName: { en: "Alicja Nowak", fa: "آلیشا نواک", pl: "Alicja Nowak" },
  age: 34,
  referredBy: 1042,
  accountBalance: 1250.75,
  creditScoreFactor: 0.86,
  acceptedTerms: true,
  newsletterOptIn: false,
  membershipTier: "gold",
  preferredLanguage: "pl",
  tags: ["vip", "beta-tester"],
  luckyNumbers: [7, 21, 42],
  metadata: { source: "referral-campaign-2026", segment: "premium" },
  address: {
    street: "Marszałkowska 12",
    city: "Warszawa",
    postalCode: "00-001",
    country: "pl",
  },
  employment: {
    employer: "Fireback sp. z o.o.",
    position: "Senior Engineer",
    history: [
      { year: 2021, role: "Software Engineer" },
      { year: 2024, role: "Senior Engineer" },
    ],
    company: {
      name: "Fireback sp. z o.o.",
      foundedYear: 2018,
      publiclyTraded: false,
      headquarters: {
        city: "Warszawa",
        country: "pl",
        geo: {
          lat: 52.2297,
          lng: 21.0122,
          accuracyMeters: 5,
        },
      },
    },
  },
  emergencyContacts: [{ name: "Jan Nowak", phone: "+48 600 100 200", relationship: "spouse" }],
  sponsorWallet: null,
  linkedWallets: [],
  extra: { note: "created from the rjsf showcase demo" },
};
