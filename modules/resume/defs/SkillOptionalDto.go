package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for skillOptionalDto
type SkillOptionalDto struct {
	UniqueId          emigo.Nullable[string] `json:"uniqueId" yaml:"uniqueId"`
	Name              emigo.Nullable[string] `json:"name" yaml:"name"`
	Category          emigo.Nullable[string] `json:"category" yaml:"category"`
	Level             emigo.Nullable[string] `json:"level" yaml:"level"`
	YearsOfExperience emigo.Nullable[int]    `json:"yearsOfExperience" yaml:"yearsOfExperience"`
	// Longer free-text elaboration on the skill, if any.
	Description complexes.TString `json:"description" yaml:"description"`
}

func (x *SkillOptionalDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetSkillOptionalDtoCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-id",
			Type: "string?",
		},
		{
			Name: prefix + "name",
			Type: "string?",
		},
		{
			Name: prefix + "category",
			Type: "enum?",
		},
		{
			Name: prefix + "level",
			Type: "enum?",
		},
		{
			Name: prefix + "years-of-experience",
			Type: "int?",
		},
		{
			Name:        prefix + "description",
			Type:        "complex",
			Description: "Longer free-text elaboration on the skill, if any.",
		},
	}
}
func CastSkillOptionalDtoFromCli(c emigo.CliCastable) SkillOptionalDto {
	data := SkillOptionalDto{}
	if c.IsSet("unique-id") {
		emigo.ParseNullable(c.String("unique-id"), &data.UniqueId)
	}
	if c.IsSet("name") {
		emigo.ParseNullable(c.String("name"), &data.Name)
	}
	if c.IsSet("category") {
		emigo.ParseNullable(c.String("category"), &data.Category)
	}
	if c.IsSet("level") {
		emigo.ParseNullable(c.String("level"), &data.Level)
	}
	if c.IsSet("years-of-experience") {
		emigo.ParseNullable(c.String("years-of-experience"), &data.YearsOfExperience)
	}
	if c.IsSet("description") {
		if u, ok := any(&data.Description).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("description")))
		}
	}
	return data
}
