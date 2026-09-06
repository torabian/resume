package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for resumeOptionalDto
type ResumeOptionalDto struct {
	UniqueId emigo.Nullable[string] `json:"uniqueId" yaml:"uniqueId"`
	FullName emigo.Nullable[string] `json:"fullName" yaml:"fullName"`
	// Short title under the name, e.g. "Senior Backend Engineer"
	Headline complexes.TString `json:"headline" yaml:"headline"`
	// Longer professional summary / objective paragraph.
	Summary  complexes.TString      `json:"summary" yaml:"summary"`
	Email    emigo.Nullable[string] `json:"email" yaml:"email"`
	Phone    emigo.Nullable[string] `json:"phone" yaml:"phone"`
	Location complexes.TString      `json:"location" yaml:"location"`
	Website  emigo.Nullable[string] `json:"website" yaml:"website"`
	Linkedin emigo.Nullable[string] `json:"linkedin" yaml:"linkedin"`
	Github   emigo.Nullable[string] `json:"github" yaml:"github"`
	PhotoUrl emigo.Nullable[string] `json:"photoUrl" yaml:"photoUrl"`
	// Language the resume content itself is written in, e.g. "en".
	Language emigo.Nullable[string] `json:"language" yaml:"language"`
	// Marks the default resume when a user keeps several variants.
	IsPrimary emigo.Nullable[bool] `json:"isPrimary" yaml:"isPrimary"`
}

func (x *ResumeOptionalDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetResumeOptionalDtoCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-id",
			Type: "string?",
		},
		{
			Name: prefix + "full-name",
			Type: "string?",
		},
		{
			Name:        prefix + "headline",
			Type:        "complex",
			Description: "Short title under the name, e.g. \"Senior Backend Engineer\"",
		},
		{
			Name:        prefix + "summary",
			Type:        "complex",
			Description: "Longer professional summary / objective paragraph.",
		},
		{
			Name: prefix + "email",
			Type: "string?",
		},
		{
			Name: prefix + "phone",
			Type: "string?",
		},
		{
			Name: prefix + "location",
			Type: "complex",
		},
		{
			Name: prefix + "website",
			Type: "string?",
		},
		{
			Name: prefix + "linkedin",
			Type: "string?",
		},
		{
			Name: prefix + "github",
			Type: "string?",
		},
		{
			Name: prefix + "photo-url",
			Type: "string?",
		},
		{
			Name:        prefix + "language",
			Type:        "string?",
			Description: "Language the resume content itself is written in, e.g. \"en\".",
		},
		{
			Name:        prefix + "is-primary",
			Type:        "bool?",
			Description: "Marks the default resume when a user keeps several variants.",
		},
	}
}
func CastResumeOptionalDtoFromCli(c emigo.CliCastable) ResumeOptionalDto {
	data := ResumeOptionalDto{}
	if c.IsSet("unique-id") {
		emigo.ParseNullable(c.String("unique-id"), &data.UniqueId)
	}
	if c.IsSet("full-name") {
		emigo.ParseNullable(c.String("full-name"), &data.FullName)
	}
	if c.IsSet("headline") {
		if u, ok := any(&data.Headline).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("headline")))
		}
	}
	if c.IsSet("summary") {
		if u, ok := any(&data.Summary).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("summary")))
		}
	}
	if c.IsSet("email") {
		emigo.ParseNullable(c.String("email"), &data.Email)
	}
	if c.IsSet("phone") {
		emigo.ParseNullable(c.String("phone"), &data.Phone)
	}
	if c.IsSet("location") {
		if u, ok := any(&data.Location).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("location")))
		}
	}
	if c.IsSet("website") {
		emigo.ParseNullable(c.String("website"), &data.Website)
	}
	if c.IsSet("linkedin") {
		emigo.ParseNullable(c.String("linkedin"), &data.Linkedin)
	}
	if c.IsSet("github") {
		emigo.ParseNullable(c.String("github"), &data.Github)
	}
	if c.IsSet("photo-url") {
		emigo.ParseNullable(c.String("photo-url"), &data.PhotoUrl)
	}
	if c.IsSet("language") {
		emigo.ParseNullable(c.String("language"), &data.Language)
	}
	if c.IsSet("is-primary") {
		emigo.ParseNullable(c.String("is-primary"), &data.IsPrimary)
	}
	return data
}
