import { useState } from "react";
import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormRichText } from "@fireback/ui-core/components/forms/form-richtext/FormRichText";
import { strings as coreStrings } from "@fireback/ui-core/components/strings/translations";
import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";

export type RegionalContentDefinitionModalResult = {
  locale: string;
  title: string;
  content: string;
};

// Modal body opened by RegionalContentDefinitionList.tsx to create/edit one
// definition (locale/title/content) - mirrors TStringEditModal.tsx/AddPassportDrawer's
// "plain useState form, resolved value read by the opener" shape: the actual
// create/update API call happens in the opener (RegionalContentDefinitionList), not
// here, the same way UserPassportsList.tsx's addPassport does for AddPassportDrawer.
export const RegionalContentDefinitionModal = ({
  close,
  resolve,
  initialValues,
  parentKeyGroup,
}: {
  close: () => void;
  resolve: (result?: RegionalContentDefinitionModalResult) => void;
  initialValues?: Partial<RegionalContentDefinitionModalResult>;
  // Mirrors RegionalContentEditForm.tsx's old forceRich/forceBasic logic - which kind
  // of message this content is used for decides whether content should be a rich or a
  // plain text editor.
  parentKeyGroup?: string;
}) => {
  const s = useS(strings);
  const cs = useS(coreStrings);
  const [locale, setLocale] = useState(initialValues?.locale ?? "");
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");

  const canSubmit = locale.trim().length > 0 && content.trim().length > 0;

  return (
    <div className="confirm-drawer-container p-3">
      <FormText
        value={locale}
        onChange={setLocale}
        autoFocus
        label={s.regionalContents.locale}
        hint={s.regionalContents.localeHint}
      />
      <FormText
        value={title}
        onChange={setTitle}
        label={s.regionalContents.title}
        hint={s.regionalContents.titleHint}
      />
      <FormRichText
        value={content}
        forceRich={parentKeyGroup === "EMAIL_OTP"}
        forceBasic={parentKeyGroup === "SMS_OTP"}
        dir="ltr"
        onChange={(value) => setContent(value)}
        label={s.regionalContents.content}
        hint={s.regionalContents.contentHint}
      />
      <div className="row mt-4">
        <div className="col-md-6">
          <button
            className="d-block w-100 btn btn-primary"
            disabled={!canSubmit}
            onClick={() => resolve({ locale, title, content })}
          >
            {cs.common.save}
          </button>
        </div>
        <div className="col-md-6">
          <button className="d-block w-100 btn" onClick={() => close()}>
            {cs.common.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegionalContentDefinitionModal;
