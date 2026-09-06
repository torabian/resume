package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for skillDto
type SkillDto struct {
	UniqueId          emigo.Nullable[string]       `json:"uniqueId" yaml:"uniqueId"`
	Resume            emigo.OneNullable[ResumeDto] `json:"resume" yaml:"resume"`
	Name              string                       `json:"name" yaml:"name"`
	Category          emigo.Nullable[string]       `json:"category" yaml:"category"`
	Level             emigo.Nullable[string]       `json:"level" yaml:"level"`
	YearsOfExperience emigo.Nullable[int]          `json:"yearsOfExperience" yaml:"yearsOfExperience"`
	// Longer free-text elaboration on the skill, if any.
	Description complexes.TString `json:"description" yaml:"description"`
}

func (x *SkillDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetSkillDtoCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-id",
			Type: "string?",
		},
		{
			Name: prefix + "resume",
			Type: "one?",
		},
		{
			Name: prefix + "name",
			Type: "string",
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
func CastSkillDtoFromCli(c emigo.CliCastable) SkillDto {
	data := SkillDto{}
	if c.IsSet("unique-id") {
		emigo.ParseNullable(c.String("unique-id"), &data.UniqueId)
	}
	if c.IsSet("resume") {
		data.Resume = emigo.CapturePossibleOneNullable(CastResumeDtoFromCli, "resume", c)
	}
	if c.IsSet("name") {
		data.Name = c.String("name")
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
