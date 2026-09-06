package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for languageOptionalDto
type LanguageOptionalDto struct {
	UniqueId    emigo.Nullable[string] `json:"uniqueId" yaml:"uniqueId"`
	Name        complexes.TString      `json:"name" yaml:"name"`
	Proficiency emigo.Nullable[string] `json:"proficiency" yaml:"proficiency"`
}

func (x *LanguageOptionalDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetLanguageOptionalDtoCliFlags(prefix string) []emigo.CliFlag {
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
			Name: prefix + "proficiency",
			Type: "enum?",
		},
	}
}
func CastLanguageOptionalDtoFromCli(c emigo.CliCastable) LanguageOptionalDto {
	data := LanguageOptionalDto{}
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
