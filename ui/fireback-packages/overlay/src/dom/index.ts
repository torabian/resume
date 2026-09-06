/**
 * `@fireback/overlay/dom` — web (DOM) bindings.
 *
 * Ready-made modal/drawer chrome built on plain `div`s + Bootstrap-style
 * classes and `react-modern-drawer`. Import `react-modern-drawer/dist/index.css`
 * yourself once at the app root if your bundler doesn't already pick it up
 * from this package's own import of it.
 *
 * Not for React Native - build your own wrapper components against
 * `@fireback/overlay`'s core types instead.
 */
export { OverlayBaseModal } from "./OverlayBaseModal";
export { OverlayDrawerImp } from "./OverlayDrawer";
export { DomOverlayProvider } from "./DomOverlayProvider";
export { commonDialogs } from "./CommonOverlays";
