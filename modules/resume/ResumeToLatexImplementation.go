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
// summary/contact info) plus every section - WorkExperience, Skill,
// Project, Certification, Language - picked for it via the Resume Creator
// screen (`resume.content` - see ResumeCreator.tsx's own PickerItem shape,
// {kind, uniqueId, label}, which is exactly what's unmarshaled below).
// Every section is scoped by `content` the same way now: nothing appears in
// the PDF that wasn't dragged/clicked into the builder's left pane, and
// each section's own row order follows the order items were arranged
// there (see DropZone's own doc comment on why that pane is sortable) -
// resolveItems below preserves `content`'s order by construction, iterating
// it once and appending each kind into its own slice as it goes, rather
// than a per-kind Browse query. Education is the one entity left out even
// from that - Resume.emi.yml's seeder has no sample data for it yet and
// ResumeCreator.tsx's own picker doesn't offer it either, not a deliberate
// omission.
//
// This used to browse WorkExperience/Certification/Language unfiltered
// instead of going through `content` at all (on the theory that neither
// carries a `resume: one` link back to a specific resume to filter by -
// see Resume.emi.yml's own top-of-file note on why that field was dropped
// from every section entity - and this is a personal, one-resume tool
// where "everything" and "this resume's content" were the same set
// anyway). That meant the PDF never reacted to picking/unpicking/
// reordering those three sections in the builder - only Skills/Projects
// did. Fixed by making every section go through `content`, the same way
// Skills/Projects already did.
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
	var workExperiences []*resumedefs.WorkExperienceEntity
	var certifications []*resumedefs.CertificationEntity
	var languages []*resumedefs.LanguageEntity
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
		case "workExperience":
			if w, err := resumedefs.WorkExperienceEntityActions.Get(tx, item.UniqueId); err == nil {
				workExperiences = append(workExperiences, w)
			}
		case "certification":
			if c, err := resumedefs.CertificationEntityActions.Get(tx, item.UniqueId); err == nil {
				certifications = append(certifications, c)
			}
		case "language":
			if l, err := resumedefs.LanguageEntityActions.Get(tx, item.UniqueId); err == nil {
				languages = append(languages, l)
			}
		}
	}

	source := latexDocument(entity, locale, skills, projects, workExperiences, certifications, languages)

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
	workExperiences []*resumedefs.WorkExperienceEntity,
	certifications []*resumedefs.CertificationEntity,
	languages []*resumedefs.LanguageEntity,
) string {
	var b strings.Builder

	// Newspaper-style two-column layout (the reader picked this over a
	// fixed sidebar+main split): every section below flows top-to-bottom
	// within a column, wrapping into a second column once the first fills
	// up - LaTeX's own `\twocolumn` command, not the `twocolumn` document
	// class option. The class option would put the very first thing on the
	// page (the name) at the top of the *narrow* column, which looks wrong
	// for a header; `\twocolumn[<content>]` instead typesets <content> at
	// full page width across both columns, THEN switches into two-column
	// mode for everything that follows it - so the header spans edge to
	// edge and only Summary onward actually splits into columns. Slightly
	// tighter margins/columnsep than the old single-column layout (2in of
	// combined column gutter eats into a 1in-margin page fast otherwise).
	b.WriteString("\\documentclass[11pt]{article}\n")
	b.WriteString("\\usepackage[margin=0.75in]{geometry}\n")
	b.WriteString("\\usepackage{enumitem}\n")
	b.WriteString("\\usepackage{titlesec}\n")
	b.WriteString("\\usepackage{hyperref}\n")
	b.WriteString("\\setlength{\\columnsep}{0.35in}\n")
	b.WriteString("\\pagestyle{empty}\n")
	b.WriteString("\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]\n")
	b.WriteString("\\titlespacing*{\\section}{0pt}{1.2em}{0.6em}\n")
	b.WriteString("\n\\begin{document}\n\n")

	// Header - name, headline, contact line, centered and spanning the full
	// page width via \twocolumn's own optional argument (see this
	// function's own comment above). Every contact field is `string?`
	// (emigo.Nullable), so OrDefault("") + a non-empty check keeps an unset
	// one from leaving a stray separator behind.
	var header strings.Builder
	header.WriteString("\\begin{center}\n")
	header.WriteString("{\\LARGE \\textbf{" + tex(e.FullName) + "}}\\\\\n")
	if headline := texLocale(e.Headline, locale); headline != "" {
		// A bare `\\[<len>]` (linebreak with extra vertical glue) here would
		// put a second, unbraced `[...]` inside \twocolumn's own optional
		// argument (see this function's own comment above on why the header
		// is built that way) - its bracket-matching gets confused by that
		// nested pair (empirically: "Argument of \@icentercr has an extra
		// }", tectonic refusing to compile at all), even though the exact
		// same `\\[0.3em]` was fine back when the header wasn't inside a
		// `\twocolumn[...]` argument. `\\` plus a separate \vspace sidesteps
		// the nested-bracket parsing entirely.
		header.WriteString("{\\large " + headline + "}\\\\\n\\vspace{0.3em}\n")
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
		header.WriteString(strings.Join(contact, " $\\cdot$ ") + "\\\\\n")
	}
	header.WriteString("\\end{center}\n")
	header.WriteString("\\vspace{0.5em}\n")

	b.WriteString("\\twocolumn[\n" + header.String() + "]\n\n")

	if summary := texLocale(e.Summary, locale); summary != "" {
		b.WriteString("\\section*{Summary}\n" + summary + "\n\n")
	}

	if len(workExperiences) > 0 {
		b.WriteString("\\section*{Work Experience}\n")
		for _, w := range workExperiences {
			line := "\\textbf{" + texLocale(w.JobTitle, locale) + "}"
			if company := texLocale(w.Company, locale); company != "" {
				line += " -- " + company
			}
			dateRange := string(w.StartDate)
			if end := string(w.EndDate); end != "" {
				dateRange += " -- " + end
			} else {
				dateRange += " -- Present"
			}
			b.WriteString(line + " \\hfill \\textit{" + tex(dateRange) + "}\\\\\n")
			if loc := texLocale(w.Location, locale); loc != "" {
				b.WriteString("\\textit{" + loc + "}\\\\\n")
			}
			if achievements := w.Achievements.OrDefault(nil); len(achievements) > 0 {
				b.WriteString("\\begin{itemize}[leftmargin=*, itemsep=1pt, parsep=0pt, topsep=2pt]\n")
				for _, a := range achievements {
					b.WriteString("\\item " + tex(a) + "\n")
				}
				b.WriteString("\\end{itemize}\n")
			}
			b.WriteString("\\vspace{0.4em}\n\n")
		}
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

	if len(certifications) > 0 {
		b.WriteString("\\section*{Certifications \\& Licenses}\n")
		b.WriteString("\\begin{itemize}[leftmargin=*, itemsep=2pt, parsep=0pt]\n")
		for _, c := range certifications {
			line := "\\item " + texLocale(c.Name, locale)
			if org := c.IssuingOrganization.OrDefault(""); org != "" {
				line += " -- " + tex(org)
			}
			b.WriteString(line + "\n")
		}
		b.WriteString("\\end{itemize}\n\n")
	}

	if len(languages) > 0 {
		b.WriteString("\\section*{Languages}\n")
		parts := make([]string, 0, len(languages))
		for _, l := range languages {
			part := texLocale(l.Name, locale)
			if prof := l.Proficiency.OrDefault(""); prof != "" {
				part += " (" + tex(prof) + ")"
			}
			parts = append(parts, part)
		}
		b.WriteString(strings.Join(parts, ", ") + "\n\n")
	}

	b.WriteString("\\end{document}\n")

	return b.String()
}
