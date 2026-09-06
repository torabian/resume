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
	"context"
	"fmt"
	"os"

	resumedefs "github.com/torabian/resume/modules/resume/defs"
	"github.com/urfave/cli/v3"
)

// resumeToPdfCliCommand is hand-written rather than generated: unlike
// resumeToLatex, resumeToPdf isn't declared in Resume.emi.yml's `actions:`
// block at all (see ResumeToPdfImplementation.go's own header comment on
// why - raw PDF bytes don't fit the generated action/RenderGinResult
// response path), so there's no resumedefs.ResumeToPdfActionCliHandler to
// lean on. Writes the compiled PDF to a file instead of stdout, since a CLI
// stdout stream would need callers to be careful not to let their terminal
// mangle binary output; --out defaults next to the current directory as
// "<uniqueId>.pdf" so the common case needs no flag at all.
func resumeToPdfCliCommand() *cli.Command {
	return &cli.Command{
		Name:  "to-pdf",
		Usage: "Compile one resume straight to a PDF file via tectonic",
		Flags: []cli.Flag{
			&cli.StringFlag{Name: "unique-id", Required: true, Usage: "Resume uniqueId"},
			&cli.StringFlag{Name: "out", Usage: "Output .pdf path (default: <uniqueId>.pdf)"},
		},
		Action: func(ctx context.Context, cmd *cli.Command) error {
			uniqueId := cmd.String("unique-id")
			source, err := resumeToPdfSource(uniqueId)
			if err != nil {
				return err
			}
			pdfBytes, err := compileLatexToPDF(ctx, source)
			if err != nil {
				return err
			}
			out := cmd.String("out")
			if out == "" {
				out = uniqueId + ".pdf"
			}
			if err := os.WriteFile(out, pdfBytes, 0644); err != nil {
				return err
			}
			fmt.Println("wrote", out)
			return nil
		},
	}
}

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

func targetPositionCliCommands() []*cli.Command {
	return entityCrudCommands(
		resumedefs.TargetPositionCreateActionCliHandler(TargetPositionCreateAction),
		resumedefs.TargetPositionUpdateActionCliHandler(TargetPositionUpdateAction),
		resumedefs.TargetPositionGetActionCliHandler(TargetPositionGetAction),
		resumedefs.TargetPositionBrowseActionCliHandler(TargetPositionBrowseAction),
		resumedefs.TargetPositionAwareDeletePreviewActionCliHandler(TargetPositionAwareDeletePreviewAction),
		resumedefs.TargetPositionAwareDeleteActionCliHandler(TargetPositionAwareDeleteAction),
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
		{
			Name:  "profile",
			Usage: "Manage the root Resume record (create/get/browse/update/delete)",
			Commands: append(resumeCliCommands(), func() *cli.Command {
				cmd := resumedefs.ResumeToLatexActionCliHandler(ResumeToLatexAction)
				cmd.Name = "to-latex"
				return cmd
			}(), resumeToPdfCliCommand()),
		},
		{Name: "company", Usage: "Manage employer records (create/get/browse/update/delete)", Commands: companyCliCommands()},
		{Name: "target-position", Usage: "Manage target position records (create/get/browse/update/delete)", Commands: targetPositionCliCommands()},
		{Name: "work-experience", Usage: "Manage work experience entries (create/get/browse/update/delete)", Commands: workExperienceCliCommands()},
		{Name: "education", Usage: "Manage education entries (create/get/browse/update/delete)", Commands: educationCliCommands()},
		{Name: "skill", Usage: "Manage skill entries (create/get/browse/update/delete)", Commands: skillCliCommands()},
		{Name: "project", Usage: "Manage project entries (create/get/browse/update/delete)", Commands: projectCliCommands()},
		{Name: "certification", Usage: "Manage certification entries (create/get/browse/update/delete)", Commands: certificationCliCommands()},
		{Name: "language", Usage: "Manage language proficiency entries (create/get/browse/update/delete)", Commands: languageCliCommands()},
	}
}
