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
import { useState } from "react";
import { type FieldProps } from "@rjsf/utils";
import { useOverlay } from "@fireback/overlay";
import { useRouter } from "@fireback/ui-core/hooks/useRouter";
import { fetchx } from "@fireback/js-remote-ctx/common/fetchx";
import { useFetchxContext } from "@fireback/js-remote-ctx/react/useFetchx";
import { ResumeCreatorPicker, type PickerItem } from "./ResumeCreator";
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
  const ctx = useFetchxContext();
  // Only present once the resume has actually been saved once - VEM's
  // create route (nav.Rcreate) has no :uniqueId segment at all, so a
  // brand-new, not-yet-saved resume has nothing for GET
  // /profile/:uniqueId/pdf to resolve yet (see ResumeToPdfImplementation.go).
  const uniqueId = router.query.uniqueId as string | undefined;
  const [downloading, setDownloading] = useState(false);
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

  // Downloads the compiled PDF straight from GET /profile/:uniqueId/pdf
  // (ResumeToPdfImplementation.go - a hand-rolled binary route, not a
  // generated action, so there's no ResumeToPdfAction sdk to call - see
  // that file's own doc comment for why). Uses fetchx directly rather than
  // plain fetch/an <a href> so the request goes through the same
  // baseUrl/auth-header/wasm-override plumbing every generated sdk call
  // gets from FetchxProvider (see WithFireback.tsx) - a raw link would
  // silently drop the Authorization header once this endpoint's own
  // "registration, not enforcement yet" permission note (Resume.emi.yml)
  // stops being true. Renders the response as a Blob and clicks a
  // throwaway <a download> rather than navigating the tab there, since a
  // failed compile comes back as JSON (see resumeToPdfHandler's error
  // branch), not a PDF, and navigating would just show that raw JSON.
  const downloadPdf = async () => {
    if (!uniqueId || downloading) return;
    setDownloading(true);
    try {
      const res = await fetchx(
        `/profile/${encodeURIComponent(uniqueId)}/pdf`,
        {},
        ctx,
      );
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`PDF request failed (${res.status}): ${body}`);
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Failed to download resume PDF", err);
      window.alert("Could not generate the PDF - see the console for details.");
    } finally {
      setDownloading(false);
    }
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
