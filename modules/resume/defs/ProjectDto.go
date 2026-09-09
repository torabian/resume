package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for projectDto
type ProjectDto struct {
	UniqueId emigo.Nullable[string] `json:"uniqueId" yaml:"uniqueId"`
	// The work experience that this project is done based on that.
	Experience emigo.OneNullable[WorkExperienceDto] `json:"experience" yaml:"experience"`
	// The project description, based on the target profile. So you can emphesize more on backend or front-end part of the project.
	Descriptions emigo.Array[ProjectDtoDescriptions] `json:"descriptions" yaml:"descriptions"`
	Name         string                              `json:"name" yaml:"name"`
	Role         complexes.TString                   `json:"role" yaml:"role"`
	Summary      complexes.TString                   `json:"summary" yaml:"summary"`
	StartDate    complexes.XDate                     `json:"startDate" yaml:"startDate"`
	EndDate      complexes.XDate                     `json:"endDate" yaml:"endDate"`
	Url          emigo.Nullable[string]              `json:"url" yaml:"url"`
	RepoUrl      emigo.Nullable[string]              `json:"repoUrl" yaml:"repoUrl"`
}

// The base class definition for descriptions
type ProjectDtoDescriptions struct {
	Target  emigo.CollectionNullable[TargetPositionDto] `json:"target" yaml:"target"`
	Content complexes.TString                           `json:"content" yaml:"content"`
	Skills  emigo.CollectionNullable[SkillDto]          `json:"skills" yaml:"skills"`
}

func (x *ProjectDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetProjectDtoCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-id",
			Type: "string?",
		},
		{
			Name:        prefix + "experience",
			Type:        "one?",
			Description: "The work experience that this project is done based on that.",
		},
		{
			Name:        prefix + "descriptions",
			Type:        "array",
			Description: "The project description, based on the target profile. So you can emphesize more on backend or front-end part of the project.",
		},
		{
			Name: prefix + "name",
			Type: "string",
		},
		{
			Name: prefix + "role",
			Type: "complex",
		},
		{
			Name: prefix + "summary",
			Type: "complex",
		},
		{
			Name: prefix + "start-date",
			Type: "complex",
		},
		{
			Name: prefix + "end-date",
			Type: "complex",
		},
		{
			Name: prefix + "url",
			Type: "string?",
		},
		{
			Name: prefix + "repo-url",
			Type: "string?",
		},
	}
}
func CastProjectDtoFromCli(c emigo.CliCastable) ProjectDto {
	data := ProjectDto{}
	if c.IsSet("unique-id") {
		emigo.ParseNullable(c.String("unique-id"), &data.UniqueId)
	}
	if c.IsSet("experience") {
		data.Experience = emigo.CapturePossibleOneNullable(CastWorkExperienceDtoFromCli, "experience", c)
	}
	if c.IsSet("descriptions") {
		data.Descriptions = emigo.CapturePossibleArray(CastProjectDtoDescriptionsFromCli, "descriptions", c)
	}
	if c.IsSet("name") {
		data.Name = c.String("name")
	}
	if c.IsSet("role") {
		if u, ok := any(&data.Role).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("role")))
		}
	}
	if c.IsSet("summary") {
		if u, ok := any(&data.Summary).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("summary")))
		}
	}
	if c.IsSet("start-date") {
		if u, ok := any(&data.StartDate).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("start-date")))
		}
	}
	if c.IsSet("end-date") {
		if u, ok := any(&data.EndDate).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("end-date")))
		}
	}
	if c.IsSet("url") {
		emigo.ParseNullable(c.String("url"), &data.Url)
	}
	if c.IsSet("repo-url") {
		emigo.ParseNullable(c.String("repo-url"), &data.RepoUrl)
	}
	return data
}
func GetProjectDtoDescriptionsCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "target",
			Type: "collection?",
		},
		{
			Name: prefix + "content",
			Type: "complex",
		},
		{
			Name: prefix + "skills",
			Type: "collection?",
		},
	}
}
func CastProjectDtoDescriptionsFromCli(c emigo.CliCastable) ProjectDtoDescriptions {
	data := ProjectDtoDescriptions{}
	if c.IsSet("target") {
		data.Target = emigo.CapturePossibleCollectionNullable(CastTargetPositionDtoFromCli, "target", c)
	}
	if c.IsSet("content") {
		if u, ok := any(&data.Content).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("content")))
		}
	}
	if c.IsSet("skills") {
		data.Skills = emigo.CapturePossibleCollectionNullable(CastSkillDtoFromCli, "skills", c)
	}
	return data
}
