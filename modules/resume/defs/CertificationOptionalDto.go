package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for certificationOptionalDto
type CertificationOptionalDto struct {
	UniqueId            emigo.Nullable[string] `json:"uniqueId" yaml:"uniqueId"`
	Name                complexes.TString      `json:"name" yaml:"name"`
	IssuingOrganization emigo.Nullable[string] `json:"issuingOrganization" yaml:"issuingOrganization"`
	IssueDate           emigo.Nullable[string] `json:"issueDate" yaml:"issueDate"`
	ExpirationDate      emigo.Nullable[string] `json:"expirationDate" yaml:"expirationDate"`
	CredentialId        emigo.Nullable[string] `json:"credentialId" yaml:"credentialId"`
	CredentialUrl       emigo.Nullable[string] `json:"credentialUrl" yaml:"credentialUrl"`
}

func (x *CertificationOptionalDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetCertificationOptionalDtoCliFlags(prefix string) []emigo.CliFlag {
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
			Name: prefix + "issuing-organization",
			Type: "string?",
		},
		{
			Name: prefix + "issue-date",
			Type: "string?",
		},
		{
			Name: prefix + "expiration-date",
			Type: "string?",
		},
		{
			Name: prefix + "credential-id",
			Type: "string?",
		},
		{
			Name: prefix + "credential-url",
			Type: "string?",
		},
	}
}
func CastCertificationOptionalDtoFromCli(c emigo.CliCastable) CertificationOptionalDto {
	data := CertificationOptionalDto{}
	if c.IsSet("unique-id") {
		emigo.ParseNullable(c.String("unique-id"), &data.UniqueId)
	}
	if c.IsSet("name") {
		if u, ok := any(&data.Name).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("name")))
		}
	}
	if c.IsSet("issuing-organization") {
		emigo.ParseNullable(c.String("issuing-organization"), &data.IssuingOrganization)
	}
	if c.IsSet("issue-date") {
		emigo.ParseNullable(c.String("issue-date"), &data.IssueDate)
	}
	if c.IsSet("expiration-date") {
		emigo.ParseNullable(c.String("expiration-date"), &data.ExpirationDate)
	}
	if c.IsSet("credential-id") {
		emigo.ParseNullable(c.String("credential-id"), &data.CredentialId)
	}
	if c.IsSet("credential-url") {
		emigo.ParseNullable(c.String("credential-url"), &data.CredentialUrl)
	}
	return data
}
