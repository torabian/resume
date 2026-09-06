import { type ReactNode, type RefObject } from "react";
import type { OverlayTranslations } from "./translations";

/**
 * The type of overlay presentation.
 * - `"drawer"`: A side panel that slides in from an edge.
 * - `"modal"`: A centered popup dialog.
 * - `"panel"`: A sheet tracked by the provider but not rendered by it —
 *   the host app reads it off `sheets`/`sheetsRef` (from `useOverlay`) and
 *   renders it itself, e.g. as a docked panel inside a larger workspace
 *   UI rather than a floating overlay.
 */
export type OverlayPresentationType = "drawer" | "modal" | "panel";

/**
 * Base configuration options for opening a modal.
 */
export interface BaseModalOpenParams {
  /**
   * Optional title to be shown on the modal.
   */
  title?: string;

  /**
   * If set, only a single instance of an overlay with this identifier can
   * be open at once — a subsequent `open*` call with the same identifier
   * while one is already open is a no-op (returns `undefined`).
   */
  uniqueIdentifier?: string;

  /**
   * Overrides the default 300ms delay between an overlay becoming
   * invisible and being unmounted (e.g. to match a custom close animation).
   */
  dismissTimeout?: number;

  /**
   * Whether to render a backdrop behind the overlay. Defaults to `true`.
   */
  enableOverlay?: boolean;

  /**
   * Extra class name(s) applied to the modal's own `.modal-dialog` element
   * (see the DOM `OverlayBaseModal`'s Bootstrap-based markup), on top of the
   * default "modal-dialog" - Bootstrap's own `.modal-dialog` caps out at a
   * fixed max-width (500px, or one of its own `.modal-lg`/`.modal-xl`/
   * `.modal-fullscreen` presets), which a plain style on your modal's own
   * content can't override from the inside (it's rendered as `.modal-
   * content`'s child, not `.modal-dialog` itself). Pass e.g.
   * `dialogClassName: "modal-lg"` for one of Bootstrap's own presets, or
   * your own class (defined in your app's own CSS) for a custom size like
   * 95% of the viewport.
   */
  dialogClassName?: string;
}

/**
 * Configuration options for opening a drawer.
 */
export interface DrawerOpenParams {
  /**
   * The direction from which the drawer should appear.
   * Defaults typically to "right".
   */
  direction?: "right" | "left" | "top" | "bottom";

  /**
   * The size of the drawer. Can be a string (e.g., "400px") or a number.
   */
  size?: string | number;

  speed?: number;

  /**
   * Whether to render a backdrop behind the drawer. Defaults to `true`.
   */
  enableOverlay?: boolean;

  /**
   * If set, only a single instance of an overlay with this identifier can
   * be open at once — a subsequent `open*` call with the same identifier
   * while one is already open is a no-op (returns `undefined`).
   */
  uniqueIdentifier?: string;

  /**
   * Overrides the default 300ms delay between an overlay becoming
   * invisible and being unmounted (e.g. to match a custom close animation).
   */
  dismissTimeout?: number;

  /**
   * Data which will be passed to the client component.
   */
  data?: any;
}

/**
 * The union of all possible overlay configuration params.
 */
export type OpenOverlayProps = BaseModalOpenParams | DrawerOpenParams;

/**
 * Overlay configuration object passed to `openOverlay`.
 */
export interface OpenOverlayConfig {
  /**
   * The type of overlay to open — either a drawer or modal.
   */
  type?: OverlayPresentationType;

  /**
   * Parameters specific to the chosen overlay type.
   */
  params?: OpenOverlayProps;

  /**
   * The data which will be passed to the client component, in case of
   * direct usage (rather than through `openModal`/`openDrawer`/`openPanel`).
   */
  data?: any;

  /**
   * The unique identifier of the overlay; if provided, only a single
   * instance can be opened at all times.
   */
  uniqueIdentifier?: string;

  /** See `BaseModalOpenParams.dismissTimeout`. */
  dismissTimeout?: number;
}

/**
 * The shape of the context used to control overlays from anywhere in the app.
 */
export type OverlayContextType = {
  /**
   * Opens an overlay (either modal or drawer) with the given component.
   *
   * @param Component The React component to be rendered inside the overlay.
   * @param params Optional configuration for the overlay.
   * @returns A controller with methods and a promise to handle the overlay.
   */
  openOverlay: <T = void>(
    Component: OverlayInstance<T>["Component"],
    params?: OpenOverlayConfig
  ) => OverlayController<T>;

  /**
   * Opens a modal overlay.
   *
   * @param Component The modal component to render.
   * @param params Optional modal configuration (e.g., title).
   * @returns A controller to resolve, reject, or close the modal.
   */
  openModal: <T = void>(
    Component: OverlayInstance<T>["Component"],
    params?: BaseModalOpenParams
  ) => OverlayController<T>;

  /**
   * Opens a drawer overlay.
   *
   * @param Component The drawer component to render.
   * @param params Drawer configuration such as size and direction.
   * @returns A controller to manage the drawer's lifecycle.
   */
  openDrawer: <T = void>(
    Component: OverlayInstance<T>["Component"],
    params?: DrawerOpenParams
  ) => OverlayController<T>;

  /**
   * Opens a "panel" overlay — tracked in `sheets`/`sheetsRef` like any
   * other overlay, but not rendered by the provider itself (see
   * `OverlayPresentationType`). Use when the host app wants to render the
   * panel's chrome inline as part of its own layout.
   *
   * @param Component The panel component to render.
   * @param params Configuration such as size and initial `data`.
   * @returns A controller to manage the panel's lifecycle.
   */
  openPanel: <T = void>(
    Component: OverlayInstance<T>["Component"],
    params?: DrawerOpenParams
  ) => OverlayController<T>;

  /**
   * Dismisses all currently active overlays.
   */
  dismissAll: () => void;

  /** The current stack of open overlays (all types, including "panel"). */
  sheets: OverlayInstance<unknown>[];

  /** Ref mirror of `sheets`, safe to read from callbacks/effects. */
  sheetsRef: RefObject<OverlayInstance<unknown>[]>;
};

/**
 * The result of an overlay interaction.
 */
export interface DialogResult<T> {
  /**
   * Optional result data returned by the overlay.
   */
  data: T;

  /**
   * The type of closure that occurred:
   * - `"resolved"`: User confirmed.
   * - `"rejected"`: User explicitly canceled.
   * - `"closed"`: User passively dismissed (e.g., backdrop click).
   */
  type: "closed" | "resolved" | "rejected";
}

/**
 * Internal actions available to overlays for controlling their own lifecycle.
 */
interface OverlayControlActions<T> {
  /**
   * Marks the overlay as resolved, returning optional result data.
   */
  resolve: (result?: T) => void;

  /**
   * Closes the overlay passively (e.g., user dismisses it without confirming).
   */
  close: () => void;

  /**
   * Marks the overlay as rejected, returning optional reason data.
   */
  reject: (reason?: T) => void;
}

/**
 * Internal representation of an overlay instance.
 */
export type OverlayInstance<T, M = {}> = {
  /**
   * Unique ID of the overlay.
   */
  id: number;

  /** See `BaseModalOpenParams.uniqueIdentifier`. */
  uniqueIdentifier?: string;

  /** See `BaseModalOpenParams.dismissTimeout`. */
  dismissTimeout?: number;

  /**
   * Ref to the overlay component instance.
   */
  ref: React.RefObject<any>;

  /**
   * The component rendered in the overlay.
   */
  Component: React.ComponentType<OverlayInstanceComponentProps<T>>;

  /**
   * Configuration parameters for the overlay.
   */
  params?: OpenOverlayProps;

  /**
   * Custom data passed down to the overlay.
   */
  data?: M;

  /**
   * Visibility flag — true if overlay is shown.
   */
  visible: boolean;

  /**
   * Whether it's a "modal" or "drawer".
   */
  type: OverlayPresentationType;

  /**
   * Optional hook to determine if overlay can close.
   * Returning false or a Promise resolving to false will block close.
   */
  onBeforeClose?: () => boolean | Promise<boolean>;
} & OverlayControlActions<T>;

/**
 * Props passed into an overlay component.
 */
export type OverlayInstanceComponentProps<T, V = OpenOverlayProps, M = {}> = {
  /**
   * Whether the overlay is currently visible.
   */
  visible?: boolean;

  /**
   * Modal/drawer configuration parameters.
   */
  params?: V | undefined;

  /**
   * Optional custom data passed in by caller.
   */
  data?: M;

  /**
   * Optional children for rendering inside overlay.
   */
  children?: ReactNode;

  /**
   * Used to set a function that runs before close and can block it.
   */
  setOnBeforeClose?: (fn: () => boolean | Promise<boolean>) => void;

  /**
   * The current locale code (e.g. "en", "fr"). Forwarded from
   * `<OverlayProvider locale="...">` down to every wrapper/overlay so
   * translated strings can be picked with `useS`. Defaults to "en".
   */
  locale?: string;

  /**
   * The translation strings (title-bar close label, common button labels,
   * etc.) forwarded from `<OverlayProvider translations={...}>`. Passed as
   * a plain object rather than pulled from a global catalog, so this
   * package never needs to know about any particular app's i18n setup.
   */
  translations?: OverlayTranslations;
} & OverlayControlActions<T>;

/**
 * Controller object returned by `openOverlay`, `openModal`, and `openDrawer`.
 */
export type OverlayController<T, M = undefined> = {
  /**
   * Unique ID of the overlay instance.
   */
  id: number;

  /**
   * Ref to the rendered overlay component.
   */
  ref: React.RefObject<any>;

  /**
   * Promise that resolves with a DialogResult when overlay is dismissed.
   */
  promise: Promise<DialogResult<T>>;

  /**
   * Closes the overlay (marked as `"closed"`).
   */
  close: () => void;

  /**
   * Rejects the overlay (marked as `"rejected"`).
   */
  reject: (reason?: any) => void;

  /**
   * Resolves the overlay (marked as `"resolved"`).
   */
  resolve: (result?: T) => void;

  /**
   * Updates custom data passed to the overlay.
   */
  updateData: (data: M) => void;
};
