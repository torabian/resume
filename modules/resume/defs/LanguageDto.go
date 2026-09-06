package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for languageDto
type LanguageDto struct {
	UniqueId emigo.Nullable[string] `json:"uniqueId" yaml:"uniqueId"`
	Name     complexes.TString      `json:"name" yaml:"name"`
	// CEFR scale (Common European Framework of Reference for Languages).
	Proficiency emigo.Nullable[string] `json:"proficiency" yaml:"proficiency"`
}

func (x *LanguageDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetLanguageDtoCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-id",
			Type: "string?",
		},
		{
			Name: prefix + "name",
			Type: "complex",
		},
		{
			Name:        prefix + "proficiency",
			Type:        "enum?",
			Description: "CEFR scale (Common European Framework of Reference for Languages).",
		},
	}
}
func CastLanguageDtoFromCli(c emigo.CliCastable) LanguageDto {
	data := LanguageDto{}
	if c.IsSet("unique-id") {
		emigo.ParseNullable(c.String("unique-id"), &data.UniqueId)
	}
	if c.IsSet("name") {
		if u, ok := any(&data.Name).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("name")))
		}
	}
	if c.IsSet("proficiency") {
		emigo.ParseNullable(c.String("proficiency"), &data.Proficiency)
	}
	return data
}
