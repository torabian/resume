import { type ReactNode } from "react";
import { OverlayProvider, type OverlayTranslations } from "@fireback/overlay";
import { OverlayBaseModal } from "./OverlayBaseModal";
import { OverlayDrawerImp } from "./OverlayDrawer";

/**
 * Convenience wrapper around the core `OverlayProvider` preconfigured with
 * this package's built-in web (DOM) modal/drawer chrome, so a browser app
 * can just do:
 *
 * ```tsx
 * <DomOverlayProvider translations={myTranslations} locale={locale}>
 *   <App />
 * </DomOverlayProvider>
 * ```
 *
 * instead of wiring `BaseModalWrapper`/`OverlayWrapper` itself. Swap either
 * one out via props if you only want to customize part of the chrome.
 */
export const DomOverlayProvider = ({
  children,
  translations,
  locale,
  BaseModalWrapper = OverlayBaseModal,
  OverlayWrapper = OverlayDrawerImp,
}: {
  children: ReactNode;
  translations?: OverlayTranslations;
  locale?: string;
  BaseModalWrapper?: typeof OverlayBaseModal;
  OverlayWrapper?: typeof OverlayDrawerImp;
}) => {
  return (
    <OverlayProvider
      BaseModalWrapper={BaseModalWrapper}
      OverlayWrapper={OverlayWrapper}
      translations={translations}
      locale={locale}
    >
      {children}
    </OverlayProvider>
  );
};
