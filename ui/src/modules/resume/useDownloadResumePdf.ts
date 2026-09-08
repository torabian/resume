// Shared by ResumeContentField.tsx (the button next to the resume-content
// picker on the edit form) and ResumeDownloadPdfButton.tsx (the single/view
// screen's own copy of the same button) - previously this whole hook lived
// inline inside ResumeContentField.tsx only, so the view screen had no way
// to offer a PDF download at all. Extracted rather than duplicated so the
// two buttons can never drift (same request, same error handling, same
// save-to-disk mechanics).
import { useState } from "react";
import { fetchx } from "@fireback/js-remote-ctx/common/fetchx";
import { useFetchxContext } from "@fireback/js-remote-ctx/react/useFetchx";

/**
 * Downloads the compiled PDF straight from GET /profile/:uniqueId/pdf
 * (ResumeToPdfImplementation.go - a hand-rolled binary route, not a
 * generated action, so there's no ResumeToPdfAction sdk to call - see that
 * file's own doc comment for why). Uses fetchx directly rather than plain
 * fetch/an <a href> so the request goes through the same
 * baseUrl/auth-header/wasm-override plumbing every generated sdk call gets
 * from FetchxProvider (see WithFireback.tsx) - a raw link would silently
 * drop the Authorization header once this endpoint's own "registration, not
 * enforcement yet" permission note (Resume.emi.yml) stops being true.
 * Renders the response as a Blob and clicks a throwaway <a download> rather
 * than navigating the tab there, since a failed compile comes back as JSON
 * (see resumeToPdfHandler's error branch), not a PDF, and navigating would
 * just show that raw JSON.
 */
export function useDownloadResumePdf(uniqueId: string | undefined) {
  const ctx = useFetchxContext();
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
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

  return { download, downloading };
}

export default useDownloadResumePdf;
