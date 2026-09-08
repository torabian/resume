// The single/view screen's own "Download PDF" button (see ResumeRoutes.tsx's
// `singleScreenExtra`) - same useDownloadResumePdf.ts the edit form's own
// copy (ResumeContentField.tsx) uses, just without the resume-content
// picker button next to it, since this screen has nothing to edit.
import { useDownloadResumePdf } from "./useDownloadResumePdf";
import "./ResumeCreator.css";

export function ResumeDownloadPdfButton({ uniqueId }: { uniqueId?: string }) {
  const { download, downloading } = useDownloadResumePdf(uniqueId);

  return (
    <div className="resume-content-field">
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={download}
        disabled={!uniqueId || downloading}
      >
        {downloading ? "Generating PDF…" : "Download PDF"}
      </button>
    </div>
  );
}

export default ResumeDownloadPdfButton;
