import {
  useOverlay,
  defaultOverlayTranslations,
  type OverlayTranslations,
} from "@fireback/overlay";

/**
 * A set of very frequently used dialogs UI for confirming, showing a
 * message, etc. Expand this if you think there are useful and repeatable
 * ones; for custom needs, build one using the `useOverlay` hook and
 * `OverlayProvider` directly.
 *
 * Button labels default from `translations.confirm`/`translations.cancel`
 * (English by default - pass your own `OverlayTranslations` object, with
 * `$locale` overrides if needed, to localize them) but can still be
 * overridden per call via `confirmLabel`/`cancelLabel`.
 */
export const commonDialogs = (translations: OverlayTranslations = defaultOverlayTranslations) => {
  const { openDrawer, openModal } = useOverlay();

  /**
   * Use for yes/no dialogs, where user needs to decide between 'yes' or 'no'
   * to an operation.
   * @param title
   * @param description
   * @param buttonLabel
   */
  const confirmDrawer = ({
    title,
    description,
    cancelLabel = translations.cancel,
    confirmLabel = translations.confirm,
  }: {
    title: string;
    description: string;
    cancelLabel?: string;
    confirmLabel?: string;
  }) => {
    return openDrawer(({ close, resolve }) => (
      <div className="confirm-drawer-container p-3">
        <h2>{title}</h2>
        <span>{description}</span>
        <div>
          <button
            className="d-block w-100 btn btn-primary"
            onClick={() => resolve()}
          >
            {confirmLabel}
          </button>
          <button className="d-block w-100 btn" onClick={() => close()}>
            {cancelLabel}
          </button>
        </div>
      </div>
    ));
  };
  /**
   * Use for yes/no dialogs, where user needs to decide between 'yes' or 'no'
   * to an operation.
   * @param title
   * @param description
   * @param buttonLabel
   */
  const confirmModal = ({
    title,
    description,
    cancelLabel = translations.cancel,
    confirmLabel = translations.confirm,
  }: {
    title: string;
    description: string;
    cancelLabel?: string;
    confirmLabel?: string;
  }) => {
    return openModal(
      ({ close, resolve }) => (
        <div className="confirm-modal-container p-3">
          <span>{description}</span>
          <div className="row mt-4">
            <div className="col-md-6">
              <button
                className="d-block w-100 btn btn-primary"
                onClick={() => resolve()}
              >
                {confirmLabel}
              </button>
            </div>
            <div className="col-md-6">
              <button className="d-block w-100 btn" onClick={() => close()}>
                {cancelLabel}
              </button>
            </div>
          </div>
        </div>
      ),
      { title }
    );
  };

  return { confirmDrawer, confirmModal };
};
