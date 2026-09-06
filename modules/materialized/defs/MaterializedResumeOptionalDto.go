package materializeddefs

import (
	"encoding/json"
	"github.com/torabian/emi/emigo"
	resumedefs "github.com/torabian/resume/modules/resume/defs"
)

// The base class definition for materializedResumeOptionalDto
type MaterializedResumeOptionalDto struct {
	UniqueId emigo.Nullable[string] `json:"uniqueId" yaml:"uniqueId"`
	// Label for this variant, e.g. "Backend-focused - Acme Corp application".
	Title emigo.Nullable[string] `json:"title" yaml:"title"`
	// The role/company this variant was tailored for, if any.
	TargetRole emigo.Nullable[string] `json:"targetRole" yaml:"targetRole"`
	// The base Resume this variant is assembled from.
	Resume          emigo.OneNullable[resumedefs.ResumeDto]                `json:"resume" yaml:"resume"`
	WorkExperiences emigo.CollectionNullable[resumedefs.WorkExperienceDto] `json:"workExperiences" yaml:"workExperiences"`
	Educations      emigo.CollectionNullable[resumedefs.EducationDto]      `json:"educations" yaml:"educations"`
	Skills          emigo.CollectionNullable[resumedefs.SkillDto]          `json:"skills" yaml:"skills"`
	Projects        emigo.CollectionNullable[resumedefs.ProjectDto]        `json:"projects" yaml:"projects"`
	Certifications  emigo.CollectionNullable[resumedefs.CertificationDto]  `json:"certifications" yaml:"certifications"`
	Languages       emigo.CollectionNullable[resumedefs.LanguageDto]       `json:"languages" yaml:"languages"`
}

func (x *MaterializedResumeOptionalDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetMaterializedResumeOptionalDtoCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-id",
			Type: "string?",
		},
		{
			Name:        prefix + "title",
			Type:        "string?",
			Description: "Label for this variant, e.g. \"Backend-focused - Acme Corp application\".",
		},
		{
			Name:        prefix + "target-role",
			Type:        "string?",
			Description: "The role/company this variant was tailored for, if any.",
		},
		{
			Name:        prefix + "resume",
			Type:        "one?",
			Description: "The base Resume this variant is assembled from.",
		},
		{
			Name: prefix + "work-experiences",
			Type: "collection?",
		},
		{
			Name: prefix + "educations",
			Type: "collection?",
		},
		{
			Name: prefix + "skills",
			Type: "collection?",
		},
		{
			Name: prefix + "projects",
			Type: "collection?",
		},
		{
			Name: prefix + "certifications",
			Type: "collection?",
		},
		{
			Name: prefix + "languages",
			Type: "collection?",
		},
	}
}
func CastMaterializedResumeOptionalDtoFromCli(c emigo.CliCastable) MaterializedResumeOptionalDto {
	data := MaterializedResumeOptionalDto{}
	if c.IsSet("unique-id") {
		emigo.ParseNullable(c.String("unique-id"), &data.UniqueId)
	}
	if c.IsSet("title") {
		emigo.ParseNullable(c.String("title"), &data.Title)
	}
	if c.IsSet("target-role") {
		emigo.ParseNullable(c.String("target-role"), &data.TargetRole)
	}
	if c.IsSet("resume") {
		data.Resume = emigo.CapturePossibleOneNullable(resumedefs.CastResumeDtoFromCli, "resume", c)
	}
	if c.IsSet("work-experiences") {
		data.WorkExperiences = emigo.CapturePossibleCollectionNullable(resumedefs.CastWorkExperienceDtoFromCli, "work-experiences", c)
	}
	if c.IsSet("educations") {
		data.Educations = emigo.CapturePossibleCollectionNullable(resumedefs.CastEducationDtoFromCli, "educations", c)
	}
	if c.IsSet("skills") {
		data.Skills = emigo.CapturePossibleCollectionNullable(resumedefs.CastSkillDtoFromCli, "skills", c)
	}
	if c.IsSet("projects") {
		data.Projects = emigo.CapturePossibleCollectionNullable(resumedefs.CastProjectDtoFromCli, "projects", c)
	}
	if c.IsSet("certifications") {
		data.Certifications = emigo.CapturePossibleCollectionNullable(resumedefs.CastCertificationDtoFromCli, "certifications", c)
	}
	if c.IsSet("languages") {
		data.Languages = emigo.CapturePossibleCollectionNullable(resumedefs.CastLanguageDtoFromCli, "languages", c)
	}
	return data
}
