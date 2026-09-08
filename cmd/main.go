package main

import (
	"os"

	"github.com/torabian/fireback/modules/abac"
	"github.com/torabian/fireback/modules/abac/interfacetools"
	"github.com/torabian/fireback/modules/abac/resolve"
	"github.com/torabian/fireback/modules/fireback"
	"github.com/torabian/fireback/modules/fireback/application"
	_ "github.com/torabian/fireback/modules/fireback/clitools"
	"github.com/torabian/fireback/modules/fireback/gintools"
	FbSelfService "github.com/torabian/fireback/modules/interfaces/selfservice"
	"github.com/torabian/fireback/modules/internalstats"
	"github.com/torabian/fireback/modules/reactivesearch"
	"github.com/torabian/fireback/modules/storage"
	ui "github.com/torabian/resume/modules/interfaces/ui"
	"github.com/torabian/resume/modules/materialized"
	"github.com/torabian/resume/modules/resume"

	"github.com/gin-gonic/gin"
	"github.com/torabian/emi/emigo"
)

var PRODUCT_NAMESPACENAME = "resume"
var PRODUCT_DESCRIPTION = "Ali's resume, stored structurally and built with fireback :)"

// Same feature level as ../nima/cmd/nima-server/main.go's own xapp - full
// abac (auth/users/workspaces/notifications/passports, via
// abac.AbacCompleteModules()) and the storage module, wired the same way -
// minus nima's own business modules (musicalwork/score/category/
// entitlement/infrasetup) and (per instruction) the backup module.
var xapp = &application.Application{
	Title: PRODUCT_DESCRIPTION,

	PublicFolders: []gintools.PublicFolderInfo{
		// This project's own compiled front-end (ui/), embedded by `make
		// embed-ui` into modules/interfaces/ui - see that Makefile target and
		// modules/interfaces/ui/index.go. Prefix "/" mounts it at the site
		// root, same as ../fireback/cmd/fireback/main.go mounts
		// modules/interfaces/fireback-manage at "/manage".
		{Fs: &ui.ResumeUI, Folder: ".", Prefix: "/"},

		// abac's own self-service portal (password reset, account activation,
		// etc. - see ../nima/cmd/nima-server/main.go's identical PublicFolders
		// entry) ships pre-built inside the fireback module itself, so
		// mounting it needs no go:embed of our own.
		{Fs: &FbSelfService.FbSelfService, Folder: ".", Prefix: "/selfservice"},
	},

	SetupWebServerHook: func(e *gin.Engine, xs *application.Application) {
		// storage.CorsConfig is the exact cors.New(cors.Config{...}) nima's
		// own main.go hand-rolls (AllowAllOrigins, every method/header the
		// tus upload protocol and typical SPA clients need) - reusing it
		// here avoids adding a direct gin-contrib/cors dependency of our
		// own just to duplicate it.
		e.Use(storage.CorsConfig)
	},

	Modules: append([]*application.ModuleProvider{
		fireback.FirebackModuleSetup(nil),

		resume.ResumeModuleSetup(nil),
		materialized.MaterializedModuleSetup(nil),

		storage.StorageModuleSetup(&storage.StorageModuleConfig{
			MountPoint: "/storage/",
			// Authenticate left nil: StorageModuleSetup then defaults it to
			// resolving the same bearer token fireback's own SecurityModel
			// resolves everywhere else (resolve.WithAuthorizationPureDefault -
			// see defaultAuthenticate in modules/storage/Webserver.go), real
			// abac auth rather than nima's own hardcoded
			// AuthContext{UserId: "12", ...} stub.
			Quota: func(auth storage.AuthContext) int64 {
				return 999999999999
			},
		}),

		reactivesearch.ModuleSetup(&reactivesearch.ReactiveSearchModuleConfig{
			SearchProviders: []reactivesearch.SearchProviderFn{
				abac.QueryMenusReact,
				abac.QueryRolesReact,
			},
		}),

		// Authorize is built entirely out of resolve.ResolveActionContext -
		// the same generic contract every abac-backed action uses - so
		// internalstats itself never has to import abac. See
		// ../nima/cmd/nima-server/main.go's identical closure.
		internalstats.ModuleSetup(&internalstats.InternalStatsModuleConfig{
			Authorize: func(req emigo.EmiRequestContexts) (fireback.QueryDSL, error) {
				query, err := resolve.ResolveActionContext(req, &resolve.SecurityModel{
					ResolveStrategy: fireback.ResolveStrategyWorkspace,
					AllowOnRoot:     true,
					ActionRequires:  []application.PermissionInfo{abac.PERM_ROOT_INTERNAL_STATS_QUERY},
				})
				if err != nil {
					return fireback.QueryDSL{}, err
				}
				return fireback.QueryDSL{
					WorkspaceId: query.WorkspaceId.OrDefault(""),
					UserId:      query.UserId.OrDefault(""),
				}, nil
			},
		}),

		// interfacetools syncs abac.Menu (the standard AppMenu tree - login,
		// users, workspaces, roles, notifications, etc.) as part of its own
		// migration. Unlike nima's own 3 manage-UI-specific entries
		// (internal-stats/analytics/notifications, left out - see their
		// removal note this comment used to carry), this project does have
		// a compiled front-end of its own (ui/). The "Resume" sidebar group
		// and its 8 VirtualEntityManager screens used to be appended here
		// via resumeMenus() (cmd/resumeMenus.go, a backend AppMenuEntity
		// seeder) - that's gone now, replaced by ui/src/modules/resume/
		// ResumeMenu.ts's useResumeMenu(), a frontend-only useMenu()
		// registration called from ApplicationRoutes.tsx (same move
		// ../../fireback/ui/packages/wallet/WalletMenu.ts made for the
		// wallet module - see its own doc comment).
		interfacetools.ModuleSetup(&interfacetools.InterfaceToolsModuleConfig{
			ExtraAppMenus: abac.Menu,
		}),
	}, abac.AbacCompleteModules()...),
	// abac.AbacCompleteModules() bundles Workspace/User, Notification,
	// messaging (email/sms/gsm provider config), and Passports (classic +
	// oauth login methods) - appended here rather than spelled out
	// individually the way ../nima/cmd/nima-server/main.go does, since it's
	// the exact same 4 modules either way (see modules/abac/AbacModule.go).
	// This alone is what makes "resume migration apply" available (see
	// abac.WorkspaceModuleSetup's own AppendCli in modules/abac/Migration.go/
	// AbacModule.go) and what fireback.AuthorizeRequest ends up wired to, so
	// every other module's permission checks (internalstats' Authorize
	// above included) actually resolve against something. Deliberately not
	// backup.ModuleSetup - skipped per instruction.
}

// DEFAULT_PORT is this project's own default HTTP port (see ui/vite.config.ts's
// matching 5002 for the front-end dev server).
const DEFAULT_PORT = "5001"

func main() {
	os.Setenv("PRODUCT_UNIQUE_NAME", PRODUCT_NAMESPACENAME)

	// Only fills in PORT before any .env exists yet (i.e. before `resume
	// init` has ever been run) - CommonHeadlessAppStart's config loading
	// (envm.LoadFirebackAppConfiguration) calls godotenv.Load(".env") right
	// after this, which never overwrites an env var already set. Pre-setting
	// PORT unconditionally would therefore permanently shadow whatever real
	// port a later `resume init --port <n>` writes to .env - so once .env
	// exists, its own PORT (or lack of one) is trusted as-is instead.
	if os.Getenv("PORT") == "" {
		if _, err := os.Stat(".env"); os.IsNotExist(err) {
			os.Setenv("PORT", DEFAULT_PORT)
		}
	}

	fireback.CommonHeadlessAppStart(xapp, func() {
		// If anything needs to run once the database is ready.
	})
}
