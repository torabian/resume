package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for workExperienceOptionalDto
type WorkExperienceOptionalDto struct {
	UniqueId       emigo.Nullable[string]        `json:"uniqueId" yaml:"uniqueId"`
	Resume         emigo.OneNullable[ResumeDto]  `json:"resume" yaml:"resume"`
	Company        emigo.OneNullable[CompanyDto] `json:"company" yaml:"company"`
	JobTitle       complexes.TString             `json:"jobTitle" yaml:"jobTitle"`
	EmploymentType emigo.Nullable[string]        `json:"employmentType" yaml:"employmentType"`
	Location       complexes.TString             `json:"location" yaml:"location"`
	Remote         emigo.Nullable[bool]          `json:"remote" yaml:"remote"`
	// ISO-8601 date, e.g. "2021-03-01".
	StartDate emigo.Nullable[string] `json:"startDate" yaml:"startDate"`
	// ISO-8601 date. Empty/omitted when isCurrent is true.
	EndDate      emigo.Nullable[string]   `json:"endDate" yaml:"endDate"`
	IsCurrent    emigo.Nullable[bool]     `json:"isCurrent" yaml:"isCurrent"`
	Summary      complexes.TString        `json:"summary" yaml:"summary"`
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
			Name: prefix + "resume",
			Type: "one?",
		},
		{
			Name: prefix + "company",
			Type: "one?",
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
			Name: prefix + "remote",
			Type: "bool?",
		},
		{
			Name:        prefix + "start-date",
			Type:        "string?",
			Description: "ISO-8601 date, e.g. \"2021-03-01\".",
		},
		{
			Name:        prefix + "end-date",
			Type:        "string?",
			Description: "ISO-8601 date. Empty/omitted when isCurrent is true.",
		},
		{
			Name: prefix + "is-current",
			Type: "bool?",
		},
		{
			Name: prefix + "summary",
			Type: "complex",
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
	if c.IsSet("resume") {
		data.Resume = emigo.CapturePossibleOneNullable(CastResumeDtoFromCli, "resume", c)
	}
	if c.IsSet("company") {
		data.Company = emigo.CapturePossibleOneNullable(CastCompanyDtoFromCli, "company", c)
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
	if c.IsSet("remote") {
		emigo.ParseNullable(c.String("remote"), &data.Remote)
	}
	if c.IsSet("start-date") {
		emigo.ParseNullable(c.String("start-date"), &data.StartDate)
	}
	if c.IsSet("end-date") {
		emigo.ParseNullable(c.String("end-date"), &data.EndDate)
	}
	if c.IsSet("is-current") {
		emigo.ParseNullable(c.String("is-current"), &data.IsCurrent)
	}
	if c.IsSet("summary") {
		if u, ok := any(&data.Summary).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("summary")))
		}
	}
	if c.IsSet("achievements") {
		emigo.ParseNullable(c.String("achievements"), &data.Achievements)
	}
	return data
}
