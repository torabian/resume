package resume

// See Resume.emi.yml for the entity definitions, ResumeActions.go for the
// hand-written Create/Get/Update/Browse/AwareDeletePreview/AwareDelete
// implementations (each leaning on the generated resumedefs.*EntityActions
// as much as possible), and RouterManifest.go for how those are grouped
// into CLI commands below. This file wires both the generated entities
// into fireback's migration system (so `resume migration apply`
// creates/updates their tables) and RouterManifest's CLI commands.
//
// Unlike modules/category in ../nima, no individual action here checks a
// permission yet - this is a personal, single-user tool with no
// workspace-scoped auth model (see ResumeActions.go's own doc comment). HTTP
// routes are wired below (GinWebServerInitHooks), same shape as
// CategoryModuleSetup: one resumedefs.{Entity}{Verb}ActionGin(g, ...) call
// per hand-written implementation in ResumeActions.go, so the
// ui/src/modules/resume/*Routes.tsx VirtualEntityManager screens (which
// hit these over HTTP, not the CLI) have something to talk to.
//
// The module *does* now register a capability, though - resumedefs.ResumePermission
// ("resume.*", generated from Resume.emi.yml's own `permissions:` block) is
// provided below via ProvidePermissionHandler, so it shows up in abac's
// capability tree for a role to be granted, and cmd/resumeMenus.go uses it
// as the resume sidebar group's own CapabilityId. That's registration, not
// enforcement - see the doc comment on Resume.emi.yml's `permissions:`
// block for why no ActionRequires check was added to match.
import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/torabian/fireback/modules/fireback"
	"github.com/torabian/fireback/modules/fireback/application"
	"github.com/torabian/fireback/modules/fireback/complexes"
	resumedefs "github.com/torabian/resume/modules/resume/defs"
	"github.com/urfave/cli/v3"
)

type ResumeModuleConfig struct {
	// Add whatever you need to pass to this module for setup.
}

func ResumeModuleSetup(cfg *ResumeModuleConfig) *application.ModuleProvider {
	module := &application.ModuleProvider{
		Name: "resume",

		EntityBundles: []application.EntityBundle{
			{
				AutoMigrationEntities: []interface{}{
					&resumedefs.ResumeEntity{},
					&resumedefs.CompanyEntity{},
					&resumedefs.TargetPositionEntity{},
					&resumedefs.WorkExperienceEntity{},
					&resumedefs.EducationEntity{},
					&resumedefs.SkillEntity{},
					&resumedefs.ProjectEntity{},
					&resumedefs.CertificationEntity{},
					&resumedefs.LanguageEntity{},
				},
			},
		},

		GinWebServerInitHooks: []func(g *gin.RouterGroup, x *application.Application) error{
			func(g *gin.RouterGroup, x *application.Application) error {
				resumedefs.ResumeCreateActionGin(g, ResumeCreateAction)
				resumedefs.ResumeUpdateActionGin(g, ResumeUpdateAction)
				resumedefs.ResumeGetActionGin(g, ResumeGetAction)
				resumedefs.ResumeBrowseActionGin(g, ResumeBrowseAction)
				resumedefs.ResumeAwareDeletePreviewActionGin(g, ResumeAwareDeletePreviewAction)
				resumedefs.ResumeAwareDeleteActionGin(g, ResumeAwareDeleteAction)
				resumedefs.ResumeToLatexActionGin(g, ResumeToLatexAction)
				g.GET("/profile/:uniqueId/pdf", resumeToPdfHandler)

				resumedefs.CompanyCreateActionGin(g, CompanyCreateAction)
				resumedefs.CompanyUpdateActionGin(g, CompanyUpdateAction)
				resumedefs.CompanyGetActionGin(g, CompanyGetAction)
				resumedefs.CompanyBrowseActionGin(g, CompanyBrowseAction)
				resumedefs.CompanyAwareDeletePreviewActionGin(g, CompanyAwareDeletePreviewAction)
				resumedefs.CompanyAwareDeleteActionGin(g, CompanyAwareDeleteAction)

				resumedefs.TargetPositionCreateActionGin(g, TargetPositionCreateAction)
				resumedefs.TargetPositionUpdateActionGin(g, TargetPositionUpdateAction)
				resumedefs.TargetPositionGetActionGin(g, TargetPositionGetAction)
				resumedefs.TargetPositionBrowseActionGin(g, TargetPositionBrowseAction)
				resumedefs.TargetPositionAwareDeletePreviewActionGin(g, TargetPositionAwareDeletePreviewAction)
				resumedefs.TargetPositionAwareDeleteActionGin(g, TargetPositionAwareDeleteAction)

				resumedefs.WorkExperienceCreateActionGin(g, WorkExperienceCreateAction)
				resumedefs.WorkExperienceUpdateActionGin(g, WorkExperienceUpdateAction)
				resumedefs.WorkExperienceGetActionGin(g, WorkExperienceGetAction)
				resumedefs.WorkExperienceBrowseActionGin(g, WorkExperienceBrowseAction)
				resumedefs.WorkExperienceAwareDeletePreviewActionGin(g, WorkExperienceAwareDeletePreviewAction)
				resumedefs.WorkExperienceAwareDeleteActionGin(g, WorkExperienceAwareDeleteAction)

				resumedefs.EducationCreateActionGin(g, EducationCreateAction)
				resumedefs.EducationUpdateActionGin(g, EducationUpdateAction)
				resumedefs.EducationGetActionGin(g, EducationGetAction)
				resumedefs.EducationBrowseActionGin(g, EducationBrowseAction)
				resumedefs.EducationAwareDeletePreviewActionGin(g, EducationAwareDeletePreviewAction)
				resumedefs.EducationAwareDeleteActionGin(g, EducationAwareDeleteAction)

				resumedefs.SkillCreateActionGin(g, SkillCreateAction)
				resumedefs.SkillUpdateActionGin(g, SkillUpdateAction)
				resumedefs.SkillGetActionGin(g, SkillGetAction)
				resumedefs.SkillBrowseActionGin(g, SkillBrowseAction)
				resumedefs.SkillAwareDeletePreviewActionGin(g, SkillAwareDeletePreviewAction)
				resumedefs.SkillAwareDeleteActionGin(g, SkillAwareDeleteAction)

				resumedefs.ProjectCreateActionGin(g, ProjectCreateAction)
				resumedefs.ProjectUpdateActionGin(g, ProjectUpdateAction)
				resumedefs.ProjectGetActionGin(g, ProjectGetAction)
				resumedefs.ProjectBrowseActionGin(g, ProjectBrowseAction)
				resumedefs.ProjectAwareDeletePreviewActionGin(g, ProjectAwareDeletePreviewAction)
				resumedefs.ProjectAwareDeleteActionGin(g, ProjectAwareDeleteAction)

				resumedefs.CertificationCreateActionGin(g, CertificationCreateAction)
				resumedefs.CertificationUpdateActionGin(g, CertificationUpdateAction)
				resumedefs.CertificationGetActionGin(g, CertificationGetAction)
				resumedefs.CertificationBrowseActionGin(g, CertificationBrowseAction)
				resumedefs.CertificationAwareDeletePreviewActionGin(g, CertificationAwareDeletePreviewAction)
				resumedefs.CertificationAwareDeleteActionGin(g, CertificationAwareDeleteAction)

				resumedefs.LanguageCreateActionGin(g, LanguageCreateAction)
				resumedefs.LanguageUpdateActionGin(g, LanguageUpdateAction)
				resumedefs.LanguageGetActionGin(g, LanguageGetAction)
				resumedefs.LanguageBrowseActionGin(g, LanguageBrowseAction)
				resumedefs.LanguageAwareDeletePreviewActionGin(g, LanguageAwareDeletePreviewAction)
				resumedefs.LanguageAwareDeleteActionGin(g, LanguageAwareDeleteAction)

				return nil
			},
		},

		CliHandlers: []*cli.Command{
			{
				Name:  "seed",
				Usage: "Injects a resume-data.yml-shaped seeder file into the database (see Seeder.go)",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:  "file",
						Usage: "Path to the seeder yaml file",
						Value: "./resume-data.yml",
					},
				},
				Action: func(ctx context.Context, c *cli.Command) error {
					seeder, err := LoadResumeDataSeederFile(c.String("file"))
					if err != nil {
						return err
					}
					created, err := SeedResumeData(fireback.GetDbRef(), seeder)
					if err != nil {
						return err
					}
					fmt.Printf("Seeded resume %q (uniqueId=%s)\n", created.FullName, created.UniqueId)
					return nil
				},
			},
		},
	}

	module.CliHandlers = append(module.CliHandlers, RouterCliManifest()...)

	// See this file's own doc comment - registers resumedefs.ResumePermission
	// ("resume.*") with the module, the same ModuleProvider.PermissionsProvider
	// slot CategoryModuleSetup's own ProvidePermissionHandler call fills in
	// ../nima/modules/category/CategoryModule.go. Cast by hand (rather than a
	// PermissionsFrom helper - only one permission exists here so a whole slice
	// -mapping helper isn't worth it yet) the same way
	// ../nima/modules/entitlement/CatalogImplementation.go's own
	// permissionInfoFromEmigo does: Key -> CompleteKey, Title/Description (both
	// already `map[string]string`) -> Name/Description, Name -> GoVariable.
	module.ProvidePermissionHandler([]application.PermissionInfo{
		{
			CompleteKey: resumedefs.ResumePermission.Key,
			Name:        complexes.TString(resumedefs.ResumePermission.Title),
			Description: complexes.TString(resumedefs.ResumePermission.Description),
			GoVariable:  resumedefs.ResumePermission.Name,
		},
	})

	return module
}
