import type { LocationError } from "../extraErrorsFromLocations";
import type { SupportedLocale } from "./rjsfShowcaseLocales";

/**
 * Stand-in for a real POST to a fireback action: a compiled JSON Schema
 * (this whole demo) can only ever catch what JSON Schema itself expresses -
 * required/type/format/enum/min-max. It has no way to know a name is
 * already taken, that a city isn't in a supported rollout region, that a
 * given lat/lng falls outside a serviceable area, or that a phone number
 * failed carrier verification - checks that only run against real data, on
 * the server, after a request actually lands. This is exactly the kind of
 * `errors[]` a rejected fireback action's `PublicError` carries (see
 * extraErrorsFromLocations.ts's own doc comment) - deliberately naming a
 * top-level field (fullName), an object-nested one (address.city), an array
 * item's own field (emergencyContacts[0].phone), and a field 4 levels deep
 * (employment.company.headquarters.geo.lat) to prove `extraErrors` reaches
 * every nesting shape this showcase's schema has, the same as client-side
 * errors already do.
 *
 * Always rejects, on purpose - this is a fixed demo response, not a real
 * validation of `formData` (nothing here even reads it) - so the "submit"
 * button always has something to show.
 */
const simulatedBackendErrors: Record<SupportedLocale, LocationError[]> = {
  en: [
    { location: "fullName", message: "This name is already registered to another account." },
    { location: "address.city", message: "We don't support onboarding in this city yet." },
    {
      location: "employment.company.headquarters.geo.lat",
      message: "These coordinates fall outside any region we currently service.",
    },
    { location: "emergencyContacts[0].phone", message: "This phone number could not be verified." },
  ],
  fa: [
    { location: "fullName", message: "این نام قبلاً برای حساب دیگری ثبت شده است." },
    { location: "address.city", message: "پذیرش در این شهر هنوز پشتیبانی نمی‌شود." },
    {
      location: "employment.company.headquarters.geo.lat",
      message: "این مختصات خارج از هر منطقه‌ای است که هم‌اکنون پوشش می‌دهیم.",
    },
    { location: "emergencyContacts[0].phone", message: "این شماره تلفن قابل تأیید نبود." },
  ],
  pl: [
    { location: "fullName", message: "Ta nazwa jest już zarejestrowana na innym koncie." },
    { location: "address.city", message: "Nie obsługujemy jeszcze rejestracji w tym mieście." },
    {
      location: "employment.company.headquarters.geo.lat",
      message: "Te współrzędne znajdują się poza obsługiwanym obecnie regionem.",
    },
    { location: "emergencyContacts[0].phone", message: "Nie udało się zweryfikować tego numeru telefonu." },
  ],
};

export interface SimulatedBackendResponse {
  ok: boolean;
  errors: LocationError[];
}

/**
 * Simulates the round trip of a real `POST` submit: an artificial delay (so
 * the "submitting..." state is actually visible), then a rejection carrying
 * `simulatedBackendErrors[locale]` - see this file's own header comment for
 * why it's a fixed response rather than actually validating `formData`.
 */
export function simulateBackendSubmit(
  _formData: unknown,
  locale: SupportedLocale,
): Promise<SimulatedBackendResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ok: false, errors: simulatedBackendErrors[locale] });
    }, 700);
  });
}
