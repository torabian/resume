/**
 * Strings the overlay chrome itself needs (a close button's accessible
 * label, the default confirm/cancel button labels used by `commonDialogs`).
 * Deliberately tiny — this package never imports a host app's global
 * translation catalog. Instead the host passes a plain object (optionally
 * with per-locale overrides, see `useS`) via `<OverlayProvider translations={...}>`.
 */
export interface OverlayTranslations {
  close: string;
  confirm: string;
  cancel: string;
}

/**
 * Built-in English fallback, used whenever a host app doesn't supply its
 * own `translations` prop.
 */
export const defaultOverlayTranslations: OverlayTranslations = {
  close: "Close",
  confirm: "Confirm",
  cancel: "Cancel",
};
