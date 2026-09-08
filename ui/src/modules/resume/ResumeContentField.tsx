// rjsf field adapter for Resume's own `content` property (`complex?: MJson` -
// see Resume.emi.yml) - a JSON array of {kind, uniqueId, label} picked via
// the ResumeCreator screen (ResumeCreator.tsx's own ResumeCreatorPicker).
// Rather than rendering that array as raw JSON (rjsf's default for an
// untyped/MJson property - the same "no type at all" gap TStringField.tsx's
// own doc comment describes for `complex: TString`), this shows one button
// summarizing what's picked and opens the exact same ResumeCreatorPicker the
// standalone "/resume-creator" page uses, inside a modal
// (@fireback/overlay's openModal - same mechanism FormTString.tsx/
// TStringEditModal.tsx already use for TString fields) - so editing a
// resume's content doesn't need to leave its own create/edit form.
//
// Deliberately minimal against @fireback/virtual-entity-manager: this file
// (and ResumeCreator.tsx's own ResumeCreatorPicker export) are the only
// pieces needed - registered the same way TStringField already is, via
// `rjsfFields={{ resumeContent: ResumeContentField }}` +
// `uiSchema: { content: { "ui:field": "resumeContent" } }` (see
// ResumeRoutes.tsx). Nothing in the shared package changes.
//
// Also renders the "Download PDF" button next to the content picker -
// useDownloadResumePdf.ts is the shared implementation, reused by
// ResumeDownloadPdfButton.tsx for the read-only single/view screen (see
// ResumeRoutes.tsx's own `singleScreenExtra`), so both places hit the same
// endpoint the same way instead of two copies drifting apart.
import { useState } from "react";
import { type FieldProps } from "@rjsf/utils";
import { useOverlay } from "@fireback/overlay";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { ResumeCreatorPicker, type PickerItem } from "./ResumeCreator";
import { useDownloadResumePdf } from "./useDownloadResumePdf";
import "./ResumeCreator.css";

function ResumeContentModal({
  close,
  resolve,
  initialValue,
}: {
  close: () => void;
  resolve: (result?: PickerItem[]) => void;
  initialValue: PickerItem[];
}) {
  const [value, setValue] = useState<PickerItem[]>(initialValue);

  return (
    <div className="resume-content-modal">
      <ResumeCreatorPicker value={value} onChange={setValue} />
      <div className="resume-content-modal__actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => resolve(value)}
        >
          Save
        </button>
        <button type="button" className="btn" onClick={() => close()}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export function ResumeContentField({
  formData,
  onChange,
  fieldPathId,
}: FieldProps<PickerItem[]>) {
  const { openModal } = useOverlay();
  const router = useRouter();
  // Only present once the resume has actually been saved once - VEM's
  // create route (nav.Rcreate) has no :uniqueId segment at all, so a
  // brand-new, not-yet-saved resume has nothing for GET
  // /profile/:uniqueId/pdf to resolve yet (see ResumeToPdfImplementation.go).
  const uniqueId = router.query.uniqueId as string | undefined;
  const { download: downloadPdf, downloading } = useDownloadResumePdf(uniqueId);
  // CommonEntityManager flattens a fetched item via
  // JSON.parse(JSON.stringify(...)) before handing it to the form (see its
  // own doc comment), so a stored MJson array arrives as a plain array
  // already - Array.isArray guards the unset case (null/undefined).
  const items: PickerItem[] = Array.isArray(formData) ? formData : [];

  const open = () => {
    openModal<PickerItem[]>(
      (modalProps) => <ResumeContentModal {...modalProps} initialValue={items} />,
      { title: "Resume content", dialogClassName: "modal-xl" },
    ).promise.then(({ type, data }) => {
      if (type !== "resolved" || !data) return;
      onChange(data, fieldPathId.path);
    });
  };

  return (
    <div className="resume-content-field">
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={open}
      >
        {items.length > 0
          ? `Edit resume content (${items.length} item${items.length === 1 ? "" : "s"})`
          : "Build resume content"}
      </button>
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={downloadPdf}
        disabled={!uniqueId || downloading}
        title={!uniqueId ? "Save the resume first" : undefined}
      >
        {downloading ? "Generating PDF…" : "Download PDF"}
      </button>
    </div>
  );
}

export default ResumeContentField;
