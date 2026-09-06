package resume

// ResumeToPdfImplementation.go compiles the same LaTeX source
// ResumeToLatexAction produces (see ResumeToLatexImplementation.go) down to
// an actual PDF, by shelling out to tectonic (https://tectonic-typesetting.github.io/).
// tectonic was picked over pdflatex/xelatex because it downloads and caches
// its own TeX Live bundle on first use - no separate texlive/MiKTeX install
// step, no local package management - which matters here since this is a
// personal single-binary tool, not a server with a maintained TeX install.
//
// This is NOT wired through Resume.emi.yml's `actions:` block like
// resumeToLatex is: emi's generated {Action}Response only ever gets to the
// client through emigo.RenderGinResult -> marshalResponse, which always
// JSON/YAML/TOML/XML-encodes whatever payload it's given (see
// emigo/ResponseFormats.go) - a []byte payload would come back
// base64-inside-JSON, not a real PDF a browser could render or download.
// Raw binary bytes need a plain gin.HandlerFunc that calls c.Data directly,
// the same pattern storage/Download.go's downloadHandler uses for stored
// uploads - so this endpoint is hand-wired in ResumeModule.go's
// GinWebServerInitHooks instead of going through a generated *ActionGin
// wrapper.
import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	resumedefs "github.com/torabian/resume/modules/resume/defs"
)

// compileLatexToPDF shells out to `tectonic --outdir <dir> <file>.tex` in a
// throwaway temp directory and reads back the resulting PDF bytes. tectonic
// writes its .aux/.log/etc alongside the .pdf unless --keep-intermediates is
// passed (it isn't here), so the temp dir only ever holds the .tex, the
// .pdf, and tectonic's own cache-lookup files - all removed together via
// the defer.
//
// Requires the `tectonic` binary on PATH (e.g. `brew install tectonic` on
// macOS, or see https://tectonic-typesetting.github.io/en-US/install.html
// for other platforms) - not vendored or checked for at startup, so a
// missing binary surfaces as a normal exec error from this call, not a
// friendlier upfront message.
func compileLatexToPDF(ctx context.Context, source string) ([]byte, error) {
	dir, err := os.MkdirTemp("", "resume-latex-*")
	if err != nil {
		return nil, fmt.Errorf("creating temp dir: %w", err)
	}
	defer os.RemoveAll(dir)

	texPath := filepath.Join(dir, "resume.tex")
	if err := os.WriteFile(texPath, []byte(source), 0644); err != nil {
		return nil, fmt.Errorf("writing .tex source: %w", err)
	}

	cmd := exec.CommandContext(ctx, "tectonic", "--outdir", dir, texPath)
	var stderr bytes.Buffer
	cmd.Stderr = &stderr
	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("tectonic compile failed: %w: %s", err, stderr.String())
	}

	pdfBytes, err := os.ReadFile(filepath.Join(dir, "resume.pdf"))
	if err != nil {
		return nil, fmt.Errorf("reading compiled pdf: %w", err)
	}
	return pdfBytes, nil
}

// resumeToPdfSource re-derives exactly the LaTeX source resumeToLatex
// (GET /profile/:uniqueId/latex) would return for the given resume, so both
// endpoints stay byte-for-byte in sync by construction - this calls
// ResumeToLatexAction itself rather than duplicating its data-gathering.
//
// Response.AsIdeal() isn't used here: it json.Marshals GetPayload() and
// unmarshals the result straight into ResumeLatexDto, but the actual
// payload is fireback.GResponseSingleItem's envelope shape
// ({"data":{"item": ResumeLatexDto}}), not a bare ResumeLatexDto - so
// AsIdeal would silently decode into an all-zero-value dto (Source ""),
// not an error. Unwrapping data.item explicitly avoids that mismatch.
func resumeToPdfSource(uniqueId string) (string, error) {
	resp, err := ResumeToLatexAction(resumedefs.ResumeToLatexActionRequest{
		Params: resumedefs.ResumeToLatexActionPathParameter{UniqueId: uniqueId},
	})
	if err != nil {
		return "", err
	}
	raw, err := json.Marshal(resp.GetPayload())
	if err != nil {
		return "", err
	}
	var envelope struct {
		Data struct {
			Item resumedefs.ResumeLatexDto `json:"item"`
		} `json:"data"`
	}
	if err := json.Unmarshal(raw, &envelope); err != nil {
		return "", err
	}
	return envelope.Data.Item.Source, nil
}

// resumeToPdfHandler serves GET /profile/:uniqueId/pdf: render -> compile ->
// stream back application/pdf bytes directly (see this file's own header
// comment for why this bypasses the generated action/RenderGinResult path).
func resumeToPdfHandler(c *gin.Context) {
	uniqueId := c.Param("uniqueId")

	source, err := resumeToPdfSource(uniqueId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 60*time.Second)
	defer cancel()

	pdfBytes, err := compileLatexToPDF(ctx, source)
	if err != nil {
		log.Printf("resume: latex->pdf compile failed for %q: %v", uniqueId, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Header("Content-Disposition", "inline; filename=\"resume.pdf\"")
	c.Data(http.StatusOK, "application/pdf", pdfBytes)
}
