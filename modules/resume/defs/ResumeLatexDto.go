package resumedefs

import (
	"encoding/json"
	"github.com/torabian/emi/emigo"
)

// The base class definition for resumeLatexDto
type ResumeLatexDto struct {
	// The complete .tex document, ready to hand to a LaTeX compiler as-is.
	Source string `json:"source" yaml:"source"`
}

func (x *ResumeLatexDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetResumeLatexDtoCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name:        prefix + "source",
			Type:        "string",
			Description: "The complete .tex document, ready to hand to a LaTeX compiler as-is.",
		},
	}
}
func CastResumeLatexDtoFromCli(c emigo.CliCastable) ResumeLatexDto {
	data := ResumeLatexDto{}
	if c.IsSet("source") {
		data.Source = c.String("source")
	}
	return data
}
