package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for projectDto
type ProjectDto struct {
	UniqueId     emigo.Nullable[string]   `json:"uniqueId" yaml:"uniqueId"`
	Name         string                   `json:"name" yaml:"name"`
	Role         complexes.TString        `json:"role" yaml:"role"`
	Summary      complexes.TString        `json:"summary" yaml:"summary"`
	StartDate    complexes.XDate          `json:"startDate" yaml:"startDate"`
	EndDate      complexes.XDate          `json:"endDate" yaml:"endDate"`
	IsOngoing    emigo.Nullable[bool]     `json:"isOngoing" yaml:"isOngoing"`
	Url          emigo.Nullable[string]   `json:"url" yaml:"url"`
	RepoUrl      emigo.Nullable[string]   `json:"repoUrl" yaml:"repoUrl"`
	Technologies emigo.Nullable[[]string] `json:"technologies" yaml:"technologies"`
	Highlights   emigo.Nullable[[]string] `json:"highlights" yaml:"highlights"`
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
			Name: prefix + "is-ongoing",
			Type: "bool?",
		},
		{
			Name: prefix + "url",
			Type: "string?",
		},
		{
			Name: prefix + "repo-url",
			Type: "string?",
		},
		{
			Name: prefix + "technologies",
			Type: "slice?",
		},
		{
			Name: prefix + "highlights",
			Type: "slice?",
		},
	}
}
func CastProjectDtoFromCli(c emigo.CliCastable) ProjectDto {
	data := ProjectDto{}
	if c.IsSet("unique-id") {
		emigo.ParseNullable(c.String("unique-id"), &data.UniqueId)
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
	if c.IsSet("is-ongoing") {
		emigo.ParseNullable(c.String("is-ongoing"), &data.IsOngoing)
	}
	if c.IsSet("url") {
		emigo.ParseNullable(c.String("url"), &data.Url)
	}
	if c.IsSet("repo-url") {
		emigo.ParseNullable(c.String("repo-url"), &data.RepoUrl)
	}
	if c.IsSet("technologies") {
		emigo.ParseNullable(c.String("technologies"), &data.Technologies)
	}
	if c.IsSet("highlights") {
		emigo.ParseNullable(c.String("highlights"), &data.Highlights)
	}
	return data
}
