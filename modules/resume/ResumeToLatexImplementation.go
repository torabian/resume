package resume

// ResumeToLatexImplementation.go - first pass at Resume.emi.yml's own
// `resumeToLatex` action (GET /profile/:uniqueId/latex): renders one Resume
// row into a plain LaTeX (.tex) source string, returned as-is in
// ResumeLatexDto.Source. No compilation happens here or anywhere in this
// project yet - that needs an actual LaTeX toolchain (e.g. shelling out to
// `pdflatex`/`tectonic`, or a hosted compile API) installed wherever this
// runs, which is a real infrastructure decision on its own and deliberately
// left for a later pass. This endpoint is the groundwork that pass would
// build on: given a Resume row, produce correct, compilable .tex text.
//
// What this covers: the Resume's own profile fields (fullName/headline/
// summary/contact info) plus the Skills and Projects picked for it via the
// Resume Creator screen (`resume.content` - see ResumeCreator.tsx's own
// PickerItem shape, {kind, uniqueId, label}, which is exactly what's
// unmarshaled below). What it doesn't: WorkExperience/Education/
// Certification/Language - none of those are referenced by `content` today
// (the picker only ever offered Skills/Projects - see ResumeCreator.tsx's
// own header comment), so there's nothing here yet to pull them in from.
// Wiring a second picker (or extending this one) to also reference those,
// and rendering them here, is the natural next step once this first pass is
// proven out.
//
// Template: plain `article` class with `geometry`/`enumitem`/`titlesec`/
// `hyperref` - packages present in any base texlive/MiKTeX install, no
// resume-specific class (e.g. moderncv) required. Swapping in a nicer theme
// later only touches latexDocument below, not the data-gathering half of
// this file.
import (
	"encoding/json"
	"strings"

	"github.com/torabian/fireback/modules/fireback"
	resumedefs "github.com/torabian/resume/modules/resume/defs"
)

// resumeContentItem mirrors ui/src/modules/resume/ResumeCreator.tsx's own
// PickerItem exactly - {kind, uniqueId, label} - since `resume.content` is
// literally that array, JSON.stringify'd by the picker and stored verbatim
// (see Resume.emi.yml's own doc comment on the `content` field).
type resumeContentItem struct {
	Kind     string `json:"kind"`
	UniqueId string `json:"uniqueId"`
	Label    string `json:"label"`
}

// parseResumeContent tolerates a nil/empty MJson (a resume with nothing
// picked yet) as "no items", the same "absent means empty, not an error"
// treatment every other optional field on this entity gets.
func parseResumeContent(content []byte) []resumeContentItem {
	if len(content) == 0 {
		return nil
	}
	var items []resumeContentItem
	if err := json.Unmarshal(content, &items); err != nil {
		return nil
	}
	return items
}

// latexEscape escapes the handful of characters LaTeX treats specially so
// arbitrary user-entered text (a summary, a company name, ...) can't break
// the surrounding document - e.g. an unescaped "50% raise" or "R&D" would
// otherwise either error out at compile time or silently eat the rest of
// the line as a comment. Order doesn't matter here despite backslash being
// replaced too: strings.Replacer matches against the *original* string in
// one left-to-right pass, it never rescans text it just inserted.
var latexEscaper = strings.NewReplacer(
	`\`, `\textbackslash{}`,
	`&`, `\&`,
	`%`, `\%`,
	`$`, `\$`,
	`#`, `\#`,
	`_`, `\_`,
	`{`, `\{`,
	`}`, `\}`,
	`~`, `\textasciitilde{}`,
	`^`, `\textasciicircum{}`,
)

func tex(s string) string {
	return latexEscaper.Replace(s)
}

// texLocale picks one locale out of a TString-shaped field for the LaTeX
// output - a document is one fixed language, unlike the app's own forms
// which can show any locale on demand. Falls back through TString.Get's own
// chain (requested locale -> "en" -> whatever's set -> "") - see
// complexes.TString.Get's own doc comment.
func texLocale(t interface{ Get(string) string }, locale string) string {
	return tex(t.Get(locale))
}

func ResumeToLatexAction(c resumedefs.ResumeToLatexActionRequest) (*resumedefs.ResumeToLatexActionResponse, error) {
	tx := fireback.GetDbRef()
	entity, err := resumedefs.ResumeEntityActions.Get(tx, c.Params.UniqueId)
	if err != nil {
		return nil, err
	}

	locale := entity.Language.OrDefault("en")
	if locale == "" {
		locale = "en"
	}

	items := parseResumeContent([]byte(entity.Content))
	var skills []*resumedefs.SkillEntity
	var projects []*resumedefs.ProjectEntity
	for _, item := range items {
		switch item.Kind {
		case "skill":
			if s, err := resumedefs.SkillEntityActions.Get(tx, item.UniqueId); err == nil {
				skills = append(skills, s)
			}
		case "project":
			if p, err := resumedefs.ProjectEntityActions.Get(tx, item.UniqueId); err == nil {
				projects = append(projects, p)
			}
		}
	}

	source := latexDocument(entity, locale, skills, projects)

	return &resumedefs.ResumeToLatexActionResponse{
		Payload: fireback.GResponseSingleItem(resumedefs.ResumeLatexDto{Source: source}),
	}, nil
}

// latexDocument assembles the actual .tex source. Deliberately a single
// function, not a Go html/text-template file - the whole document is small
// enough that a template would add more indirection than it saves right
// now; revisit if this grows a second theme/layout to switch between.
func latexDocument(
	e *resumedefs.ResumeEntity,
	locale string,
	skills []*resumedefs.SkillEntity,
	projects []*resumedefs.ProjectEntity,
) string {
	var b strings.Builder

	b.WriteString("\\documentclass[11pt]{article}\n")
	b.WriteString("\\usepackage[margin=1in]{geometry}\n")
	b.WriteString("\\usepackage{enumitem}\n")
	b.WriteString("\\usepackage{titlesec}\n")
	b.WriteString("\\usepackage{hyperref}\n")
	b.WriteString("\\pagestyle{empty}\n")
	b.WriteString("\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]\n")
	b.WriteString("\\titlespacing*{\\section}{0pt}{1.2em}{0.6em}\n")
	b.WriteString("\n\\begin{document}\n\n")

	// Header - name, headline, contact line. Every contact field is
	// `string?` (emigo.Nullable), so OrDefault("") + a non-empty check
	// keeps an unset one from leaving a stray separator behind.
	b.WriteString("{\\LARGE \\textbf{" + tex(e.FullName) + "}}\\\\\n")
	if headline := texLocale(e.Headline, locale); headline != "" {
		b.WriteString("{\\large " + headline + "}\\\\[0.3em]\n")
	}

	var contact []string
	if v := e.Email.OrDefault(""); v != "" {
		contact = append(contact, "\\href{mailto:"+tex(v)+"}{"+tex(v)+"}")
	}
	if v := e.Phone.OrDefault(""); v != "" {
		contact = append(contact, tex(v))
	}
	if v := texLocale(e.Location, locale); v != "" {
		contact = append(contact, v)
	}
	if v := e.Website.OrDefault(""); v != "" {
		contact = append(contact, "\\url{"+v+"}")
	}
	if v := e.Linkedin.OrDefault(""); v != "" {
		contact = append(contact, "\\url{"+v+"}")
	}
	if v := e.Github.OrDefault(""); v != "" {
		contact = append(contact, "\\url{"+v+"}")
	}
	if len(contact) > 0 {
		b.WriteString(strings.Join(contact, " $\\cdot$ ") + "\\\\\n")
	}
	b.WriteString("\n")

	if summary := texLocale(e.Summary, locale); summary != "" {
		b.WriteString("\\section*{Summary}\n" + summary + "\n\n")
	}

	if len(skills) > 0 {
		b.WriteString("\\section*{Skills}\n")
		b.WriteString("\\begin{itemize}[leftmargin=*, itemsep=2pt, parsep=0pt]\n")
		for _, s := range skills {
			line := "\\item \\textbf{" + tex(s.Name) + "}"
			if level := s.Level.OrDefault(""); level != "" {
				line += " (" + tex(level) + ")"
			}
			if desc := texLocale(s.Description, locale); desc != "" {
				line += " -- " + desc
			}
			b.WriteString(line + "\n")
		}
		b.WriteString("\\end{itemize}\n\n")
	}

	if len(projects) > 0 {
		b.WriteString("\\section*{Projects}\n")
		b.WriteString("\\begin{itemize}[leftmargin=*, itemsep=4pt, parsep=0pt]\n")
		for _, p := range projects {
			line := "\\item \\textbf{" + tex(p.Name) + "}"
			if role := texLocale(p.Role, locale); role != "" {
				line += " -- " + role
			}
			b.WriteString(line + "\n")
			if summary := texLocale(p.Summary, locale); summary != "" {
				b.WriteString(summary + "\\\\\n")
			}
			if len(p.Technologies.OrDefault(nil)) > 0 {
				b.WriteString("\\textit{" + tex(strings.Join(p.Technologies.OrDefault(nil), ", ")) + "}\\\\\n")
			}
		}
		b.WriteString("\\end{itemize}\n\n")
	}

	b.WriteString("\\end{document}\n")

	return b.String()
}
