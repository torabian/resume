package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for companyDto
type CompanyDto struct {
	UniqueId    emigo.Nullable[string] `json:"uniqueId" yaml:"uniqueId"`
	Name        string                 `json:"name" yaml:"name"`
	Industry    complexes.TString      `json:"industry" yaml:"industry"`
	Website     emigo.Nullable[string] `json:"website" yaml:"website"`
	LogoUrl     emigo.Nullable[string] `json:"logoUrl" yaml:"logoUrl"`
	Location    complexes.TString      `json:"location" yaml:"location"`
	Description complexes.TString      `json:"description" yaml:"description"`
}

func (x *CompanyDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetCompanyDtoCliFlags(prefix string) []emigo.CliFlag {
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
			Name: prefix + "industry",
			Type: "complex",
		},
		{
			Name: prefix + "website",
			Type: "string?",
		},
		{
			Name: prefix + "logo-url",
			Type: "string?",
		},
		{
			Name: prefix + "location",
			Type: "complex",
		},
		{
			Name: prefix + "description",
			Type: "complex",
		},
	}
}
func CastCompanyDtoFromCli(c emigo.CliCastable) CompanyDto {
	data := CompanyDto{}
	if c.IsSet("unique-id") {
		emigo.ParseNullable(c.String("unique-id"), &data.UniqueId)
	}
	if c.IsSet("name") {
		data.Name = c.String("name")
	}
	if c.IsSet("industry") {
		if u, ok := any(&data.Industry).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("industry")))
		}
	}
	if c.IsSet("website") {
		emigo.ParseNullable(c.String("website"), &data.Website)
	}
	if c.IsSet("logo-url") {
		emigo.ParseNullable(c.String("logo-url"), &data.LogoUrl)
	}
	if c.IsSet("location") {
		if u, ok := any(&data.Location).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("location")))
		}
	}
	if c.IsSet("description") {
		if u, ok := any(&data.Description).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("description")))
		}
	}
	return data
}
