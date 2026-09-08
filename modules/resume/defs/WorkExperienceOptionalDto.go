package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for workExperienceOptionalDto
type WorkExperienceOptionalDto struct {
	UniqueId       emigo.Nullable[string] `json:"uniqueId" yaml:"uniqueId"`
	Company        complexes.TString      `json:"company" yaml:"company"`
	JobTitle       complexes.TString      `json:"jobTitle" yaml:"jobTitle"`
	EmploymentType emigo.Nullable[string] `json:"employmentType" yaml:"employmentType"`
	Location       complexes.TString      `json:"location" yaml:"location"`
	// ISO-8601 date, e.g. "2021-03-01".
	StartDate complexes.XDate `json:"startDate" yaml:"startDate"`
	// ISO-8601 date. Empty/omitted when isCurrent is true.
	EndDate      complexes.XDate          `json:"endDate" yaml:"endDate"`
	Achievements emigo.Nullable[[]string] `json:"achievements" yaml:"achievements"`
}

func (x *WorkExperienceOptionalDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetWorkExperienceOptionalDtoCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-id",
			Type: "string?",
		},
		{
			Name: prefix + "company",
			Type: "complex",
		},
		{
			Name: prefix + "job-title",
			Type: "complex",
		},
		{
			Name: prefix + "employment-type",
			Type: "enum?",
		},
		{
			Name: prefix + "location",
			Type: "complex",
		},
		{
			Name:        prefix + "start-date",
			Type:        "complex",
			Description: "ISO-8601 date, e.g. \"2021-03-01\".",
		},
		{
			Name:        prefix + "end-date",
			Type:        "complex",
			Description: "ISO-8601 date. Empty/omitted when isCurrent is true.",
		},
		{
			Name: prefix + "achievements",
			Type: "slice?",
		},
	}
}
func CastWorkExperienceOptionalDtoFromCli(c emigo.CliCastable) WorkExperienceOptionalDto {
	data := WorkExperienceOptionalDto{}
	if c.IsSet("unique-id") {
		emigo.ParseNullable(c.String("unique-id"), &data.UniqueId)
	}
	if c.IsSet("company") {
		if u, ok := any(&data.Company).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("company")))
		}
	}
	if c.IsSet("job-title") {
		if u, ok := any(&data.JobTitle).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("job-title")))
		}
	}
	if c.IsSet("employment-type") {
		emigo.ParseNullable(c.String("employment-type"), &data.EmploymentType)
	}
	if c.IsSet("location") {
		if u, ok := any(&data.Location).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("location")))
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
	if c.IsSet("achievements") {
		emigo.ParseNullable(c.String("achievements"), &data.Achievements)
	}
	return data
}
