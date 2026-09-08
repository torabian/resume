import { useMemo } from "react";
import { useMenu } from "@fireback/ui-core/hooks/frontendMenuRegistry";
import type { MenuItem } from "@fireback/ui-core/types/MenuItem";

// Frontend-only port of cmd/resumeMenus.go's AppMenuEntity tree - same 9
// entries (the "Resume" group plus 8 VirtualEntityManager screens, hand-
// written ResumeCreator included), now contributed via useMenu (see
// frontendMenuRegistry.tsx) instead of a backend `/cte-app-menus` seeder
// row, the same move ../../../fireback/ui/packages/wallet/WalletMenu.ts
// made for the wallet module. cmd/resumeMenus.go and its call site in
// main.go's InterfaceToolsModuleConfig.ExtraAppMenus are gone now - this is
// the only source for this menu tree.
//
// Hrefs are root-level ("/profiles", not "/manage/profiles") because
// ApplicationRoutes.tsx passes each entity's routes straight into
// FirebackEssentialRouterManager without a "manage" path wrapper - same
// reasoning as ResumeRoutes.tsx's own doc comment on the "profile" slug -
// so each child's href here is just "/" + that screen's own pluralSlug (or
// singular slug for resume-creator, which isn't VirtualEntityManager-backed
// at all).
//
// No displayFn/capability gating (unlike WalletMenu.ts's requireCapability):
// resumedefs.ResumePermission gated the old backend group, but this module
// has no per-screen abac permissions of its own yet (see ResumeModule.go's
// own doc comment) - every entry here is visible to anyone who can see the
// sidebar at all, same as resumeMenus.go's entity entries always were.
//
// Labels are plain hardcoded English text, not translated via strings/
// useS the way WalletMenu.ts's are - this module has no strings/
// translations.ts of its own (only "en" ever existed for these labels in
// resumeMenus.go's own TStringFrom maps), so there's nothing to localize
// yet. Wire up a strings.ts and switch these to s.<key> if/when that
// changes.
function buildResumeMenuItems(): MenuItem[] {
  return [
    {
      key: "resume-sections",
      label: "Resume",
      icon: "/common/product.svg",
      children: [
        {
          label: "Resume Creator",
          icon: "/common/entity-default.svg",
          href: "/resume-creator",
          activeMatcher: /\/resume-creator(\/|$)/,
          children: [],
        },
        {
          label: "Resumes",
          icon: "/common/entity-default.svg",
          href: "/profiles",
          activeMatcher: /\/profiles?(\/|$)/,
          children: [],
        },
        {
          label: "Companies",
          icon: "/common/entity-default.svg",
          href: "/companies",
          activeMatcher: /\/compan(y|ies)(\/|$)/,
          children: [],
        },
        {
          label: "Target positions",
          icon: "/common/entity-default.svg",
          href: "/target-positions",
          activeMatcher: /\/target-positions?(\/|$)/,
          children: [],
        },
        {
          label: "Work experience",
          icon: "/common/entity-default.svg",
          href: "/work-experiences",
          activeMatcher: /\/work-experiences?(\/|$)/,
          children: [],
        },
        {
          label: "Education",
          icon: "/common/entity-default.svg",
          href: "/educations",
          activeMatcher: /\/educations?(\/|$)/,
          children: [],
        },
        {
          label: "Skills",
          icon: "/common/entity-default.svg",
          href: "/skills",
          activeMatcher: /\/skills?(\/|$)/,
          children: [],
        },
        {
          label: "Projects",
          icon: "/common/entity-default.svg",
          href: "/projects",
          activeMatcher: /\/projects?(\/|$)/,
          children: [],
        },
        {
          label: "Certifications",
          icon: "/common/entity-default.svg",
          href: "/certifications",
          activeMatcher: /\/certifications?(\/|$)/,
          children: [],
        },
        {
          label: "Languages",
          icon: "/common/entity-default.svg",
          href: "/languages",
          activeMatcher: /\/languages?(\/|$)/,
          children: [],
        },
      ],
    },
  ];
}

/**
 * The resume module's own sidebar entry, contributed entirely from the
 * frontend via useMenu instead of a backend `appMenu` seeder row (see
 * buildResumeMenuItems' own doc comment above). Called from
 * ApplicationRoutes.tsx, the same always-runs-while-the-app-shell-is-up
 * place every *Routes.tsx hook already gets called from, so the menu entry
 * exists for exactly as long as the app shell does - not tied to whether
 * any resume page happens to be the one currently open.
 */
export function useResumeMenu() {
  useMenu(
    "sidebar",
    useMemo(() => buildResumeMenuItems(), []),
  );
}
