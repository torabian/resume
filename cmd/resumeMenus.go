package main

// Sidebar entries for the 9 VirtualEntityManager screens plus the
// hand-written ResumeCreator screen, all wired in
// ui/src/apps/manage/ApplicationRoutes.tsx (ResumeRoutes.tsx,
// CompanyRoutes.tsx, TargetPositionRoutes.tsx, WorkExperienceRoutes.tsx,
// EducationRoutes.tsx, SkillRoutes.tsx, ProjectRoutes.tsx,
// CertificationRoutes.tsx, LanguageRoutes.tsx, ResumeCreator.tsx). Same
// shape as ../../nima/modules/musicalwork/
// MusicalWorkModule.go's MusicWorkMenu()/*Menu.go files: one parent group
// entity (no Href, just a label to nest under) plus one child per screen,
// linked via ParentId.
//
// Hrefs are root-level ("/profiles", not "/manage/profiles") because
// ApplicationRoutes.tsx passes each entity's routes straight into
// FirebackEssentialRouterManager without nima/abac's own "manage" path
// wrapper (see ResumeRoutes.tsx's own doc comment on the "profile" slug,
// and createEntityNavigation.ts's Rquery == pluralSlug) - so the child
// hrefs below are just "/" + each *Routes.tsx's own pluralSlug.
//
// CapabilityId is left unset on every entry: unlike nima's modules, this
// module has no Permissions.go/abac permission checks yet (see
// ResumeModule.go's own doc comment), so there's no capability id to
// require here - every entry is visible to anyone who can see the sidebar
// at all.
//
// ActiveMatcher is a regex (compiled client-side via `new RegExp(...)` and
// tested unanchored against the current route's plain pathname - see
// ui/fireback-packages/ui-core/components/layouts/Sidebar.tsx's
// dataMenuToMenu and MenuParticle.tsx's `item.activeMatcher.test(data.asPath)`)
// that decides whether a sidebar entry highlights as active. Each entity has
// 4 routes sharing one *singular* slug plus one *plural* one (see
// createEntityNavigation.ts): `/<plural>` (browse), `/<slug>/new` (create),
// `/<slug>/edit/:id` (edit), `/<slug>/:id` (single) - so matching only the
// plural form (this file's own original value, e.g. "work-experiences")
// highlighted the browse screen but never edit/create/single, since those
// paths use the singular slug instead. `/<slug>s?(/|$)` matches all 4 at
// once for every entity whose plural is just "+s" (every one of these
// except company): it optionally consumes one trailing "s" (covering the
// bare browse path) and then requires either "/" (a nested id/verb segment)
// or end-of-string, so it doesn't also match an unrelated route that merely
// starts with the same slug (e.g. "/skills-report"). `company`/`companies`
// is irregular ("company" isn't even a prefix of "companies"), so it gets
// its own `/compan(y|ies)(/|$)` instead.

//
// This file lives in cmd/ (package main) rather than under modules/resume
// the way musicalwork's own *Menu.go files do, since modules/resume has no
// dependency on interfacetoolsdefs/abac today (see ResumeModule.go) and
// this wiring is purely for main.go's own xapp - see resumeMenus()'s call
// site in main.go's InterfaceToolsModuleConfig.ExtraAppMenus.
import (
	"github.com/torabian/emi/emigo"
	interfacetoolsdefs "github.com/torabian/fireback/modules/abac/interfacetools/defs"
	"github.com/torabian/fireback/modules/fireback/complexes"
	resumedefs "github.com/torabian/resume/modules/resume/defs"
)

// resumeMenus returns the "Resume" sidebar group and its 8 entity screens.
func resumeMenus() []*interfacetoolsdefs.AppMenuEntity {
	group := &interfacetoolsdefs.AppMenuEntity{
		UniqueId: "resume-sections",
		Label: complexes.TStringFrom(map[string]string{
			"en": "Resume",
		}),
		Icon: "/common/product.svg",
		// Gates the whole group behind resumedefs.ResumePermission ("resume.*" -
		// see ResumeModule.go's own ProvidePermissionHandler call) - same pattern
		// ../../nima/modules/musicalwork/MusicalWorkModule.go uses "musicalwork.*"
		// for. Root (this app's only real user today) always holds the full "*"
		// wildcard (see resolve.MeetsAccessLevel's own doc comment), so this is
		// inert for the current single-user setup - it only starts mattering once
		// a non-root role exists that isn't granted resume.*.
		CapabilityId: emigo.NullableOf(resumedefs.ResumePermission.Key),
	}

	entries := []*interfacetoolsdefs.AppMenuEntity{
		group,
		{
			UniqueId: "resume-sections-creator",
			Label: complexes.TStringFrom(map[string]string{
				"en": "Resume Creator",
			}),
			Href:          "/resume-creator",
			Icon:          "/common/entity-default.svg",
			ActiveMatcher: "/resume-creator(/|$)",
			ParentId:      emigo.NullableOf(group.UniqueId),
		},
		{
			UniqueId: "resume-sections-profiles",
			Label: complexes.TStringFrom(map[string]string{
				"en": "Resumes",
			}),
			Href:          "/profiles",
			Icon:          "/common/entity-default.svg",
			ActiveMatcher: "/profiles?(/|$)",
			ParentId:      emigo.NullableOf(group.UniqueId),
		},
		{
			UniqueId: "resume-sections-companies",
			Label: complexes.TStringFrom(map[string]string{
				"en": "Companies",
			}),
			Href:          "/companies",
			Icon:          "/common/entity-default.svg",
			ActiveMatcher: "/compan(y|ies)(/|$)",
			ParentId:      emigo.NullableOf(group.UniqueId),
		},
		{
			UniqueId: "resume-sections-target-positions",
			Label: complexes.TStringFrom(map[string]string{
				"en": "Target positions",
			}),
			Href:          "/target-positions",
			Icon:          "/common/entity-default.svg",
			ActiveMatcher: "/target-positions?(/|$)",
			ParentId:      emigo.NullableOf(group.UniqueId),
		},
		{
			UniqueId: "resume-sections-work-experiences",
			Label: complexes.TStringFrom(map[string]string{
				"en": "Work experience",
			}),
			Href:          "/work-experiences",
			Icon:          "/common/entity-default.svg",
			ActiveMatcher: "/work-experiences?(/|$)",
			ParentId:      emigo.NullableOf(group.UniqueId),
		},
		{
			UniqueId: "resume-sections-educations",
			Label: complexes.TStringFrom(map[string]string{
				"en": "Education",
			}),
			Href:          "/educations",
			Icon:          "/common/entity-default.svg",
			ActiveMatcher: "/educations?(/|$)",
			ParentId:      emigo.NullableOf(group.UniqueId),
		},
		{
			UniqueId: "resume-sections-skills",
			Label: complexes.TStringFrom(map[string]string{
				"en": "Skills",
			}),
			Href:          "/skills",
			Icon:          "/common/entity-default.svg",
			ActiveMatcher: "/skills?(/|$)",
			ParentId:      emigo.NullableOf(group.UniqueId),
		},
		{
			UniqueId: "resume-sections-projects",
			Label: complexes.TStringFrom(map[string]string{
				"en": "Projects",
			}),
			Href:          "/projects",
			Icon:          "/common/entity-default.svg",
			ActiveMatcher: "/projects?(/|$)",
			ParentId:      emigo.NullableOf(group.UniqueId),
		},
		{
			UniqueId: "resume-sections-certifications",
			Label: complexes.TStringFrom(map[string]string{
				"en": "Certifications",
			}),
			Href:          "/certifications",
			Icon:          "/common/entity-default.svg",
			ActiveMatcher: "/certifications?(/|$)",
			ParentId:      emigo.NullableOf(group.UniqueId),
		},
		{
			UniqueId: "resume-sections-languages",
			Label: complexes.TStringFrom(map[string]string{
				"en": "Languages",
			}),
			Href:          "/languages",
			Icon:          "/common/entity-default.svg",
			ActiveMatcher: "/languages?(/|$)",
			ParentId:      emigo.NullableOf(group.UniqueId),
		},
	}

	return entries
}
