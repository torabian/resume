/**
 * `@fireback/overlay` — core entry point.
 *
 * Render-target-agnostic: the overlay stack/state machine, its types, and
 * the tiny `useS` translation helper. No DOM, no CSS, no `react-dom`, so
 * this half is safe to use as-is on React Native (bring your own
 * `BaseModalWrapper`/`OverlayWrapper` built from RN's `Modal`/`View`).
 *
 * For ready-made web (DOM) wrapper components, see `@fireback/overlay/dom`.
 */
export { OverlayProvider, useOverlay } from "./OverlayProvider";
export { useS } from "./useS";
export {
  defaultOverlayTranslations,
  type OverlayTranslations,
} from "./translations";
export type {
  BaseModalOpenParams,
  DialogResult,
  DrawerOpenParams,
  OpenOverlayConfig,
  OpenOverlayProps,
  OverlayContextType,
  OverlayController,
  OverlayInstance,
  OverlayInstanceComponentProps,
  OverlayPresentationType,
} from "./types";
