import { type ReactNode } from "react";
import classNames from "classnames";
import {
  type BaseModalOpenParams,
  type OverlayInstanceComponentProps,
  useS,
  defaultOverlayTranslations,
} from "@fireback/overlay";

/**
 * Web (DOM) implementation of a "modal"-type overlay's chrome: a Bootstrap
 * `.modal` backdrop/box with a title bar and close button. Pass this as
 * `<OverlayProvider BaseModalWrapper={OverlayBaseModal} .../>` in a
 * browser app; a React Native app would supply its own equivalent instead.
 */
export const OverlayBaseModal = ({
  children,
  close,
  visible,
  params,
  translations = defaultOverlayTranslations,
  locale,
}: {
  children: ReactNode;
} & OverlayInstanceComponentProps<unknown, BaseModalOpenParams>) => {
  const s = useS(translations, locale);
  return (
    <div
      className={classNames(
        "modal d-block with-fade-in modal-overlay",
        visible ? "visible" : "invisible"
      )}
    >
      <div className={classNames("modal-dialog", params?.dialogClassName)}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{params?.title}</h5>
            <button
              type="button"
              id="cls"
              className="btn-close"
              onClick={close}
              aria-label={s.close}
            ></button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
