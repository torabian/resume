import { WorkspaceTypeDto } from "@fireback/manage/sdk/abac/WorkspaceTypeDto";
import { type strings as uiStrings } from "@fireback/ui-core/components/strings/translations";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { type strings } from "./strings/translations";

export const columns = (s: typeof strings, uiS: typeof uiStrings) => [
  {
    name: "uniqueId",
    title: uiS.table.uniqueId,
    width: 200,
  },
  {
    // title is complexes.TString now (a locale -> text map, see Abac.emi.yml's own
    // comment on the workspaceType entity) - render whichever locale the viewer is
    // in instead of the raw {en, fa, ...} object (which React can't render as a
    // child at all), same as CapabilityColumns.tsx's own name/description columns.
    name: "title",
    title: s.title,
    width: 200,
    filterType: "tstring" as const,
    getCellValue: (entity: WorkspaceTypeDto) =>
      getTStringValue(entity.title, getLocale()),
  },
  {
    name: "slug",
    slug: s.slug,
    width: 200,
    getCellValue: (entity: WorkspaceTypeDto) => entity.slug,
  },
];
