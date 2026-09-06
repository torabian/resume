import type { RjsfShowcaseDtoTranslations } from "../generated/RjsfShowcaseDto";
import type { SupportedLocale } from "./rjsfShowcaseLocales";

/**
 * Hand-translated counterparts of generated/RjsfShowcaseDto.ts's own `static
 * DefaultTranslations` (the dto's source-language/English bucket) - typed as
 * RjsfShowcaseDtoTranslations, a `Record` requiring every key
 * DefaultTranslations has. A field renamed/added/removed in the dto changes
 * that type the next time RjsfShowcaseDto.ts is regenerated, and a key
 * missing here becomes a TypeScript compile error - never a blank or
 * stale-English label discovered at runtime.
 *
 * "en" isn't listed: RjsfShowcaseDemo.tsx falls back to
 * RjsfShowcaseDto.DefaultTranslations itself for that case, so English isn't
 * duplicated here as a second copy that could drift from the compiler's own.
 */
export const rjsfShowcaseTranslations: Partial<
  Record<SupportedLocale, RjsfShowcaseDtoTranslations>
> = {
  fa: {
    $title: "پروفایل متقاضی",
    $description:
      "یک فرم که تمام انواع فیلد Emi را پوشش می‌دهد - نشان می‌دهد یک JSON Schema کامپایل‌شده در react-jsonschema-form به‌درستی رندر می‌شود.",
    full_name_title: "نام کامل",
    full_name_description: "نام قانونی کامل متقاضی.",
    nickname_title: "نام مستعار",
    nickname_description: "یک نام غیررسمی اختیاری.",
    display_name_title: "نام نمایشی",
    display_name_description: "نام نمایشی محلی‌سازی‌شده - یک متن برای هر زبان.",
    age_title: "سن",
    age_description: "سن به سال.",
    referred_by_title: "معرفی‌شده توسط (شناسه عضو)",
    referred_by_description:
      "شناسه اختیاری عضوی که این متقاضی را معرفی کرده است.",
    account_balance_title: "موجودی حساب",
    account_balance_description: "موجودی فعلی حساب.",
    credit_score_factor_title: "ضریب امتیاز اعتباری",
    credit_score_factor_description:
      "ضریب وزنی اختیاری، در صورت استعلام از دفتر اعتبارسنجی.",
    accepted_terms_title: "پذیرش شرایط",
    accepted_terms_description:
      "اینکه آیا متقاضی شرایط استفاده از خدمات را پذیرفته است.",
    newsletter_opt_in_title: "عضویت در خبرنامه",
    newsletter_opt_in_description: "پرچم اختیاری عضویت در خبرنامه.",
    membership_tier_enum_bronze: "برنزی",
    membership_tier_enum_silver: "نقره‌ای",
    membership_tier_enum_gold: "طلایی",
    membership_tier_title: "سطح عضویت",
    membership_tier_description: "سطح عضویت اختصاص‌یافته به این متقاضی.",
    preferred_language_enum_en: "انگلیسی",
    preferred_language_enum_fa: "فارسی",
    preferred_language_enum_pl: "لهستانی",
    preferred_language_title: "زبان ترجیحی",
    preferred_language_description: "زبان ترجیحی تماس (اختیاری).",
    tags_title: "برچسب‌ها",
    tags_description: "برچسب‌های آزاد متصل به متقاضی.",
    lucky_numbers_title: "اعداد شانس",
    lucky_numbers_description: "فهرستی از اعداد صحیح مورد علاقه.",
    metadata_title: "فراداده",
    metadata_description: "فراداده متنی دلخواه، کلیددار با رشته.",
    address_properties_street_title: "خیابان",
    address_properties_city_title: "شهر",
    address_properties_postal_code_title: "کد پستی",
    address_properties_country_enum_pl: "لهستان",
    address_properties_country_enum_ir: "ایران",
    address_properties_country_enum_gb: "بریتانیا",
    address_properties_country_title: "کشور",
    address_title: "آدرس",
    address_description: "آدرس محل سکونت متقاضی.",
    employment_properties_employer_title: "کارفرما",
    employment_properties_position_title: "سمت",
    employment_properties_history_items_properties_year_title: "سال",
    employment_properties_history_items_properties_role_title: "سمت",
    employment_properties_history_title: "سوابق",
    employment_properties_history_description: "سمت‌های پیشین نزد این کارفرما.",
    employment_properties_company_properties_name_title: "نام شرکت",
    employment_properties_company_properties_founded_year_title: "سال تأسیس",
    employment_properties_company_properties_publicly_traded_title: "سهامی عام",
    employment_properties_company_properties_headquarters_properties_city_title:
      "شهر",
    employment_properties_company_properties_headquarters_properties_country_enum_pl:
      "لهستان",
    employment_properties_company_properties_headquarters_properties_country_enum_ir:
      "ایران",
    employment_properties_company_properties_headquarters_properties_country_enum_gb:
      "بریتانیا",
    employment_properties_company_properties_headquarters_properties_country_title:
      "کشور",
    employment_properties_company_properties_headquarters_properties_geo_properties_lat_title:
      "عرض جغرافیایی",
    employment_properties_company_properties_headquarters_properties_geo_properties_lng_title:
      "طول جغرافیایی",
    employment_properties_company_properties_headquarters_properties_geo_properties_accuracy_meters_title:
      "دقت (متر)",
    employment_properties_company_properties_headquarters_properties_geo_title:
      "مختصات",
    employment_properties_company_properties_headquarters_properties_geo_description:
      "مختصات دقیق دفتر مرکزی.",
    employment_properties_company_properties_headquarters_title: "دفتر مرکزی",
    employment_properties_company_properties_headquarters_description:
      "محل استقرار دفتر مرکزی شرکت.",
    employment_properties_company_title: "شرکت",
    employment_properties_company_description: "شرکت ثبت‌شده کارفرما.",
    employment_title: "اشتغال",
    employment_description: "جزئیات شغل فعلی متقاضی.",
    emergency_contacts_items_properties_name_title: "نام",
    emergency_contacts_items_properties_phone_title: "تلفن",
    emergency_contacts_items_properties_relationship_title: "نسبت",
    emergency_contacts_title: "مخاطبین اضطراری",
    emergency_contacts_description:
      "افرادی که در شرایط اضطراری باید با آن‌ها تماس گرفت.",
    sponsor_wallet_title: "کیف پول حامی",
    sponsor_wallet_description:
      "کیف پول اختیاری که این متقاضی توسط آن حمایت می‌شود.",
    linked_wallets_title: "کیف پول‌های مرتبط",
    linked_wallets_description: "دیگر کیف پول‌های مرتبط با این متقاضی.",
    extra_title: "اطلاعات اضافی",
    extra_description: "داده اضافی آزاد که شکل آن از پیش مشخص نیست.",
  },
  pl: {
    $title: "Profil wnioskodawcy",
    $description:
      "Formularz obejmujący każdy typ pola Emi - pokazuje, że skompilowany schemat JSON renderuje się poprawnie w react-jsonschema-form.",
    full_name_title: "Imię i nazwisko",
    full_name_description: "Pełne imię i nazwisko wnioskodawcy.",
    nickname_title: "Pseudonim",
    nickname_description: "Opcjonalna, nieformalna nazwa.",
    display_name_title: "Nazwa wyświetlana",
    display_name_description:
      "Zlokalizowana nazwa wyświetlana - jeden tekst na język.",
    age_title: "Wiek",
    age_description: "Wiek w latach.",
    referred_by_title: "Polecony przez (ID członka)",
    referred_by_description:
      "Opcjonalny identyfikator członka, który polecił tego wnioskodawcę.",
    account_balance_title: "Saldo konta",
    account_balance_description: "Aktualne saldo konta.",
    credit_score_factor_title: "Współczynnik zdolności kredytowej",
    credit_score_factor_description:
      "Opcjonalny współczynnik wagowy, jeśli pobrano wynik z biura kredytowego.",
    accepted_terms_title: "Akceptacja regulaminu",
    accepted_terms_description:
      "Czy wnioskodawca zaakceptował regulamin usługi.",
    newsletter_opt_in_title: "Zgoda na newsletter",
    newsletter_opt_in_description: "Opcjonalna flaga subskrypcji newslettera.",
    membership_tier_enum_bronze: "Brązowy",
    membership_tier_enum_silver: "Srebrny",
    membership_tier_enum_gold: "Złoty",
    membership_tier_title: "Poziom członkostwa",
    membership_tier_description:
      "Poziom członkostwa przypisany temu wnioskodawcy.",
    preferred_language_enum_en: "Angielski",
    preferred_language_enum_fa: "Perski",
    preferred_language_enum_pl: "Polski",
    preferred_language_title: "Preferowany język",
    preferred_language_description: "Opcjonalny preferowany język kontaktu.",
    tags_title: "Tagi",
    tags_description: "Dowolne etykiety przypisane do wnioskodawcy.",
    lucky_numbers_title: "Szczęśliwe liczby",
    lucky_numbers_description: "Lista ulubionych liczb całkowitych.",
    metadata_title: "Metadane",
    metadata_description:
      "Dowolne metadane tekstowe, kluczowane ciągiem znaków.",
    address_properties_street_title: "Ulica",
    address_properties_city_title: "Miasto",
    address_properties_postal_code_title: "Kod pocztowy",
    address_properties_country_enum_pl: "Polska",
    address_properties_country_enum_ir: "Iran",
    address_properties_country_enum_gb: "Wielka Brytania",
    address_properties_country_title: "Kraj",
    address_title: "Adres",
    address_description: "Adres zamieszkania wnioskodawcy.",
    employment_properties_employer_title: "Pracodawca",
    employment_properties_position_title: "Stanowisko",
    employment_properties_history_items_properties_year_title: "Rok",
    employment_properties_history_items_properties_role_title: "Stanowisko",
    employment_properties_history_title: "Historia",
    employment_properties_history_description:
      "Wcześniejsze stanowiska u tego pracodawcy.",
    employment_properties_company_properties_name_title: "Nazwa firmy",
    employment_properties_company_properties_founded_year_title:
      "Rok założenia",
    employment_properties_company_properties_publicly_traded_title:
      "Spółka giełdowa",
    employment_properties_company_properties_headquarters_properties_city_title:
      "Miasto",
    employment_properties_company_properties_headquarters_properties_country_enum_pl:
      "Polska",
    employment_properties_company_properties_headquarters_properties_country_enum_ir:
      "Iran",
    employment_properties_company_properties_headquarters_properties_country_enum_gb:
      "Wielka Brytania",
    employment_properties_company_properties_headquarters_properties_country_title:
      "Kraj",
    employment_properties_company_properties_headquarters_properties_geo_properties_lat_title:
      "Szerokość geograficzna",
    employment_properties_company_properties_headquarters_properties_geo_properties_lng_title:
      "Długość geograficzna",
    employment_properties_company_properties_headquarters_properties_geo_properties_accuracy_meters_title:
      "Dokładność (metry)",
    employment_properties_company_properties_headquarters_properties_geo_title:
      "Współrzędne",
    employment_properties_company_properties_headquarters_properties_geo_description:
      "Dokładne współrzędne siedziby.",
    employment_properties_company_properties_headquarters_title: "Siedziba",
    employment_properties_company_properties_headquarters_description:
      "Lokalizacja siedziby firmy.",
    employment_properties_company_title: "Firma",
    employment_properties_company_description:
      "Zarejestrowana firma pracodawcy.",
    employment_title: "Zatrudnienie",
    employment_description: "Aktualne informacje o zatrudnieniu wnioskodawcy.",
    emergency_contacts_items_properties_name_title: "Imię i nazwisko",
    emergency_contacts_items_properties_phone_title: "Telefon",
    emergency_contacts_items_properties_relationship_title: "Pokrewieństwo",
    emergency_contacts_title: "Kontakty alarmowe",
    emergency_contacts_description: "Osoby do kontaktu w nagłych wypadkach.",
    sponsor_wallet_title: "Portfel sponsora",
    sponsor_wallet_description:
      "Opcjonalny portfel, przez który sponsorowany jest ten wnioskodawca.",
    linked_wallets_title: "Powiązane portfele",
    linked_wallets_description: "Inne portfele powiązane z tym wnioskodawcą.",
    extra_title: "Dodatkowe dane",
    extra_description:
      "Dowolny dodatkowy ładunek, którego kształt nie jest z góry znany.",
  },
};
