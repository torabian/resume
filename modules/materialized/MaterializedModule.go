package materialized

// See Materialized.emi.yml for the entity definition and the reasoning
// behind composing rather than duplicating resume module data. Like
// resume.ResumeModuleSetup, this only wires the generated entity into
// fireback's migration system - no hand-written CRUD/CLI/Gin layer yet
// (see ResumeModule.go's own doc comment for why).
import (
	"github.com/torabian/fireback/modules/fireback/application"
	materializeddefs "github.com/torabian/resume/modules/materialized/defs"
)

type MaterializedModuleConfig struct {
	// Add whatever you need to pass to this module for setup.
}

func MaterializedModuleSetup(cfg *MaterializedModuleConfig) *application.ModuleProvider {
	module := &application.ModuleProvider{
		Name: "materialized",

		EntityBundles: []application.EntityBundle{
			{
				AutoMigrationEntities: []interface{}{
					&materializeddefs.MaterializedResumeEntity{},
				},
			},
		},
	}

	return module
}
