package resume

// RouterManifest.go groups ResumeActions.go's handlers into one *cli.Command
// per entity - same idea as ../nima/modules/category/RouterManifest.go's
// RouterCliManifest, except each generated {Action}CliHandler's own Name
// (meta.CliName, e.g. "resume-create-action" - see e.g.
// resumedefs.ResumeCreateActionCliHandler) is overridden to a short
// create/update/get/browse/delete-preview/delete verb, since these are
// nested one level under a per-entity group here (`resume company create`)
// rather than exposed as flat top-level commands.
import (
	resumedefs "github.com/torabian/resume/modules/resume/defs"
	"github.com/urfave/cli/v3"
)

// entityCrudCommands renames the 6 crud/awaredelete commands emi's
// {Action}CliHandler wrappers produce to plain verbs.
func entityCrudCommands(create, update, get, browse, deletePreview, delete *cli.Command) []*cli.Command {
	create.Name = "create"
	update.Name = "update"
	get.Name = "get"
	browse.Name = "browse"
	deletePreview.Name = "delete-preview"
	delete.Name = "delete"
	return []*cli.Command{create, update, get, browse, deletePreview, delete}
}

func resumeCliCommands() []*cli.Command {
	return entityCrudCommands(
		resumedefs.ResumeCreateActionCliHandler(ResumeCreateAction),
		resumedefs.ResumeUpdateActionCliHandler(ResumeUpdateAction),
		resumedefs.ResumeGetActionCliHandler(ResumeGetAction),
		resumedefs.ResumeBrowseActionCliHandler(ResumeBrowseAction),
		resumedefs.ResumeAwareDeletePreviewActionCliHandler(ResumeAwareDeletePreviewAction),
		resumedefs.ResumeAwareDeleteActionCliHandler(ResumeAwareDeleteAction),
	)
}

func companyCliCommands() []*cli.Command {
	return entityCrudCommands(
		resumedefs.CompanyCreateActionCliHandler(CompanyCreateAction),
		resumedefs.CompanyUpdateActionCliHandler(CompanyUpdateAction),
		resumedefs.CompanyGetActionCliHandler(CompanyGetAction),
		resumedefs.CompanyBrowseActionCliHandler(CompanyBrowseAction),
		resumedefs.CompanyAwareDeletePreviewActionCliHandler(CompanyAwareDeletePreviewAction),
		resumedefs.CompanyAwareDeleteActionCliHandler(CompanyAwareDeleteAction),
	)
}

func workExperienceCliCommands() []*cli.Command {
	return entityCrudCommands(
		resumedefs.WorkExperienceCreateActionCliHandler(WorkExperienceCreateAction),
		resumedefs.WorkExperienceUpdateActionCliHandler(WorkExperienceUpdateAction),
		resumedefs.WorkExperienceGetActionCliHandler(WorkExperienceGetAction),
		resumedefs.WorkExperienceBrowseActionCliHandler(WorkExperienceBrowseAction),
		resumedefs.WorkExperienceAwareDeletePreviewActionCliHandler(WorkExperienceAwareDeletePreviewAction),
		resumedefs.WorkExperienceAwareDeleteActionCliHandler(WorkExperienceAwareDeleteAction),
	)
}

func educationCliCommands() []*cli.Command {
	return entityCrudCommands(
		resumedefs.EducationCreateActionCliHandler(EducationCreateAction),
		resumedefs.EducationUpdateActionCliHandler(EducationUpdateAction),
		resumedefs.EducationGetActionCliHandler(EducationGetAction),
		resumedefs.EducationBrowseActionCliHandler(EducationBrowseAction),
		resumedefs.EducationAwareDeletePreviewActionCliHandler(EducationAwareDeletePreviewAction),
		resumedefs.EducationAwareDeleteActionCliHandler(EducationAwareDeleteAction),
	)
}

func skillCliCommands() []*cli.Command {
	return entityCrudCommands(
		resumedefs.SkillCreateActionCliHandler(SkillCreateAction),
		resumedefs.SkillUpdateActionCliHandler(SkillUpdateAction),
		resumedefs.SkillGetActionCliHandler(SkillGetAction),
		resumedefs.SkillBrowseActionCliHandler(SkillBrowseAction),
		resumedefs.SkillAwareDeletePreviewActionCliHandler(SkillAwareDeletePreviewAction),
		resumedefs.SkillAwareDeleteActionCliHandler(SkillAwareDeleteAction),
	)
}

func projectCliCommands() []*cli.Command {
	return entityCrudCommands(
		resumedefs.ProjectCreateActionCliHandler(ProjectCreateAction),
		resumedefs.ProjectUpdateActionCliHandler(ProjectUpdateAction),
		resumedefs.ProjectGetActionCliHandler(ProjectGetAction),
		resumedefs.ProjectBrowseActionCliHandler(ProjectBrowseAction),
		resumedefs.ProjectAwareDeletePreviewActionCliHandler(ProjectAwareDeletePreviewAction),
		resumedefs.ProjectAwareDeleteActionCliHandler(ProjectAwareDeleteAction),
	)
}

func certificationCliCommands() []*cli.Command {
	return entityCrudCommands(
		resumedefs.CertificationCreateActionCliHandler(CertificationCreateAction),
		resumedefs.CertificationUpdateActionCliHandler(CertificationUpdateAction),
		resumedefs.CertificationGetActionCliHandler(CertificationGetAction),
		resumedefs.CertificationBrowseActionCliHandler(CertificationBrowseAction),
		resumedefs.CertificationAwareDeletePreviewActionCliHandler(CertificationAwareDeletePreviewAction),
		resumedefs.CertificationAwareDeleteActionCliHandler(CertificationAwareDeleteAction),
	)
}

func languageCliCommands() []*cli.Command {
	return entityCrudCommands(
		resumedefs.LanguageCreateActionCliHandler(LanguageCreateAction),
		resumedefs.LanguageUpdateActionCliHandler(LanguageUpdateAction),
		resumedefs.LanguageGetActionCliHandler(LanguageGetAction),
		resumedefs.LanguageBrowseActionCliHandler(LanguageBrowseAction),
		resumedefs.LanguageAwareDeletePreviewActionCliHandler(LanguageAwareDeletePreviewAction),
		resumedefs.LanguageAwareDeleteActionCliHandler(LanguageAwareDeleteAction),
	)
}

// RouterCliManifest bundles one *cli.Command group per entity - each with
// create/update/get/browse/delete-preview/delete subcommands - for
// ResumeModuleSetup's CliHandlers.
func RouterCliManifest() []*cli.Command {
	return []*cli.Command{
		{Name: "profile", Usage: "Manage the root Resume record (create/get/browse/update/delete)", Commands: resumeCliCommands()},
		{Name: "company", Usage: "Manage employer records (create/get/browse/update/delete)", Commands: companyCliCommands()},
		{Name: "work-experience", Usage: "Manage work experience entries (create/get/browse/update/delete)", Commands: workExperienceCliCommands()},
		{Name: "education", Usage: "Manage education entries (create/get/browse/update/delete)", Commands: educationCliCommands()},
		{Name: "skill", Usage: "Manage skill entries (create/get/browse/update/delete)", Commands: skillCliCommands()},
		{Name: "project", Usage: "Manage project entries (create/get/browse/update/delete)", Commands: projectCliCommands()},
		{Name: "certification", Usage: "Manage certification entries (create/get/browse/update/delete)", Commands: certificationCliCommands()},
		{Name: "language", Usage: "Manage language proficiency entries (create/get/browse/update/delete)", Commands: languageCliCommands()},
	}
}
