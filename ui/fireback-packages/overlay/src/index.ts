/**
 * Root entry point — re-exports the render-target-agnostic `core` API only,
 * so importing `@fireback/overlay` directly never pulls in DOM-only code
 * (react-modern-drawer, classnames, etc.) and stays safe on React Native.
 *
 * Web apps additionally want `@fireback/overlay/dom` for ready-made
 * modal/drawer chrome.
 */
export * from "./core";
