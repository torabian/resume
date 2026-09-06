package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for educationOptionalDto
type EducationOptionalDto struct {
	UniqueId    emigo.Nullable[string] `json:"uniqueId" yaml:"uniqueId"`
	Institution emigo.Nullable[string] `json:"institution" yaml:"institution"`
	// e.g. "B.Sc.", "M.Sc.", "Bootcamp certificate".
	Degree       complexes.TString      `json:"degree" yaml:"degree"`
	FieldOfStudy complexes.TString      `json:"fieldOfStudy" yaml:"fieldOfStudy"`
	Location     complexes.TString      `json:"location" yaml:"location"`
	StartDate    complexes.XDate        `json:"startDate" yaml:"startDate"`
	EndDate      complexes.XDate        `json:"endDate" yaml:"endDate"`
	IsCurrent    emigo.Nullable[bool]   `json:"isCurrent" yaml:"isCurrent"`
	Grade        emigo.Nullable[string] `json:"grade" yaml:"grade"`
	Description  complexes.TString      `json:"description" yaml:"description"`
}

func (x *EducationOptionalDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetEducationOptionalDtoCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-id",
			Type: "string?",
		},
		{
			Name: prefix + "institution",
			Type: "string?",
		},
		{
			Name:        prefix + "degree",
			Type:        "complex",
			Description: "e.g. \"B.Sc.\", \"M.Sc.\", \"Bootcamp certificate\".",
		},
		{
			Name: prefix + "field-of-study",
			Type: "complex",
		},
		{
			Name: prefix + "location",
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
			Name: prefix + "is-current",
			Type: "bool?",
		},
		{
			Name: prefix + "grade",
			Type: "string?",
		},
		{
			Name: prefix + "description",
			Type: "complex",
		},
	}
}
func CastEducationOptionalDtoFromCli(c emigo.CliCastable) EducationOptionalDto {
	data := EducationOptionalDto{}
	if c.IsSet("unique-id") {
		emigo.ParseNullable(c.String("unique-id"), &data.UniqueId)
	}
	if c.IsSet("institution") {
		emigo.ParseNullable(c.String("institution"), &data.Institution)
	}
	if c.IsSet("degree") {
		if u, ok := any(&data.Degree).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("degree")))
		}
	}
	if c.IsSet("field-of-study") {
		if u, ok := any(&data.FieldOfStudy).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("field-of-study")))
		}
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
	if c.IsSet("is-current") {
		emigo.ParseNullable(c.String("is-current"), &data.IsCurrent)
	}
	if c.IsSet("grade") {
		emigo.ParseNullable(c.String("grade"), &data.Grade)
	}
	if c.IsSet("description") {
		if u, ok := any(&data.Description).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("description")))
		}
	}
	return data
}
