import React, {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  BaseModalOpenParams,
  DialogResult,
  DrawerOpenParams,
  OpenOverlayConfig,
  OverlayContextType,
  OverlayController,
  OverlayInstance,
  OverlayInstanceComponentProps,
} from "./types";
import { defaultOverlayTranslations, type OverlayTranslations } from "./translations";

const OverlayContext = createContext<OverlayContextType | null>(null);

let uniqueId = 0;

/**
 * Core, render-target-agnostic overlay engine: tracks the stack of open
 * overlays and exposes `openOverlay`/`openModal`/`openDrawer`/`dismissAll`
 * via context. It has no idea what a "modal" or "drawer" actually looks
 * like on screen — that's supplied by `BaseModalWrapper`/`OverlayWrapper`,
 * so the same provider works for a DOM app (see the `dom` entry point's
 * `OverlayBaseModal`/`OverlayDrawerImp`) or a React Native app (bring your
 * own `Modal`/animated `View` based wrappers).
 */
export const OverlayProvider = ({
  children,
  BaseModalWrapper,
  OverlayWrapper,
  translations = defaultOverlayTranslations,
  locale = "en",
}: {
  children: ReactNode;
  /** Renders a "modal"-type overlay's chrome (backdrop, box, close button). */
  BaseModalWrapper: FC<OverlayInstanceComponentProps<unknown>>;
  /** Renders a "drawer"-type overlay's chrome (sliding panel). */
  OverlayWrapper: FC<OverlayInstanceComponentProps<unknown>>;
  /** Strings for the overlay chrome itself; see `OverlayTranslations`. */
  translations?: OverlayTranslations;
  /** Current locale code, forwarded to every overlay for use with `useS`. */
  locale?: string;
}) => {
  const [sheets, setSheets] = useState<OverlayInstance<unknown>[]>([]);
  const sheetsRef = useRef(sheets);
  sheetsRef.current = sheets;

  // Tracks whether the top "panel"-type sheet has already absorbed one
  // Escape press - panels require a second press to close, so an
  // accidental tap doesn't discard in-progress work.
  const doubleEscape = useRef(false);

  useEffect(() => {
    // `window`/keyboard events don't exist on React Native - skip wiring
    // the Escape-to-close shortcut there instead of throwing.
    if (
      typeof window === "undefined" ||
      typeof window.addEventListener !== "function"
    ) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sheets.length > 0) {
        const topSheet = sheets[sheets.length - 1];
        if (topSheet.type === "panel") {
          if (doubleEscape.current !== true) {
            doubleEscape.current = true;
            return;
          }
        }
        doubleEscape.current = false;
        topSheet?.close?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sheets]);

  const openOverlay = <T = void,>(
    Component: OverlayInstance<unknown>["Component"],
    params?: OpenOverlayConfig
  ): OverlayController<T> => {
    // Refuse to open a second instance sharing a `uniqueIdentifier` while
    // one is already open.
    const uniqueIdentifier =
      params?.uniqueIdentifier ?? (params?.params as any)?.uniqueIdentifier;
    if (uniqueIdentifier) {
      if (
        sheetsRef.current.find(
          (instance) => instance.uniqueIdentifier === uniqueIdentifier
        )
      ) {
        return undefined as unknown as OverlayController<T>;
      }
    }

    const id = uniqueId++;
    const ref = React.createRef<any>();
    const dismissTimeout =
      params?.dismissTimeout ?? (params?.params as any)?.dismissTimeout;

    let resolveFn!: (result?: DialogResult<T>) => void;
    let rejectFn!: (reason?: DialogResult<any>) => void;

    const promise = new Promise<DialogResult<T>>((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
    });

    const dismiss = () => {
      setSheets((prev) =>
        prev.map((s) => (s.id === id ? { ...s, visible: false } : s))
      );
      setTimeout(() => {
        setSheets((prev) => prev.filter((s) => s.id !== id));
      }, dismissTimeout ?? 300);
    };

    const overlayInstance: OverlayInstance<T> = {
      id,
      ref,
      Component,
      uniqueIdentifier,
      dismissTimeout,
      type: params?.type || "modal",
      params: params?.params,
      data: params?.data ?? {},
      visible: false,
      onBeforeClose: undefined,
      resolve: (result?: T) => {
        setTimeout(() => resolveFn({ type: "resolved", data: result }), 50);
        dismiss();
      },
      close: async () => {
        const current = sheetsRef.current.find((item) => item.id === id);

        if (current?.onBeforeClose) {
          const allow = await current.onBeforeClose();
          if (!allow) return;
        }
        const shouldClose = await (overlayInstance.onBeforeClose?.() ?? true);
        if (!shouldClose) return;
        setTimeout(() => resolveFn({ data: null as any, type: "closed" }), 50);
        dismiss();
      },
      reject: (reason?: any) => {
        setTimeout(() => rejectFn({ data: reason, type: "rejected" }), 50);
        dismiss();
      },
    };

    setSheets((prev) => [...prev, overlayInstance]);
    setTimeout(() => {
      setSheets((prev) =>
        prev.map((s) => (s.id === id ? { ...s, visible: true } : s))
      );
    }, 50);

    const updateData = (newData: Partial<any>) => {
      setSheets((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, data: { ...s.data, ...newData } } : s
        )
      );
    };

    return {
      id,
      ref,
      promise,
      close: overlayInstance.close,
      resolve: overlayInstance.resolve,
      reject: overlayInstance.reject,
      updateData,
    };
  };

  const openModal = <T = void,>(
    Component: OverlayInstance<T>["Component"],
    params?: BaseModalOpenParams
  ): OverlayController<T> =>
    openOverlay<T>(Component, {
      type: "modal",
      params,
      uniqueIdentifier: params?.uniqueIdentifier,
      dismissTimeout: params?.dismissTimeout,
    });

  const openDrawer = <T = void,>(
    Component: OverlayInstance<T>["Component"],
    params?: DrawerOpenParams
  ): OverlayController<T> =>
    openOverlay<T>(Component, {
      type: "drawer",
      params,
      data: params?.data,
      uniqueIdentifier: params?.uniqueIdentifier,
      dismissTimeout: params?.dismissTimeout,
    });

  const openPanel = <T = void,>(
    Component: OverlayInstance<T>["Component"],
    params?: DrawerOpenParams
  ): OverlayController<T> =>
    openOverlay<T>(Component, {
      type: "panel",
      params,
      data: params?.data,
      uniqueIdentifier: params?.uniqueIdentifier,
      dismissTimeout: params?.dismissTimeout,
    });

  const dismissAll = () => {
    sheetsRef.current.forEach((s) => s.reject?.("dismiss-all"));
    setSheets([]);
  };

  return (
    <OverlayContext.Provider
      value={{
        openOverlay,
        openDrawer,
        openModal,
        openPanel,
        dismissAll,
        sheets,
        sheetsRef,
      }}
    >
      {children}
      {sheets
        .filter((sheet) => sheet.type !== "panel")
        .map(
          ({
            id,
            type,
            Component,
            resolve,
            reject,
            close,
            params,
            visible,
            data,
          }) => {
            const C = type === "drawer" ? OverlayWrapper : BaseModalWrapper;
            return (
              <C
                key={id}
                visible={visible}
                close={close}
                reject={reject}
                resolve={resolve}
                params={params}
                locale={locale}
                translations={translations}
              >
                <Component
                  resolve={resolve}
                  reject={reject}
                  close={close}
                  data={data}
                  locale={locale}
                  translations={translations}
                  setOnBeforeClose={(fn) => {
                    setSheets((prev) =>
                      prev.map((s) =>
                        s.id === id ? { ...s, onBeforeClose: fn } : s
                      )
                    );
                  }}
                />
              </C>
            );
          }
        )}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const ctx = useContext(OverlayContext);
  if (!ctx) {
    throw new Error("useOverlay must be inside OverlayProvider");
  }
  return ctx;
};
