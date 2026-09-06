import { WorkspaceDto } from "@fireback/manage/sdk/abac/WorkspaceDto";
import { type strings as uiStrings } from "@fireback/ui-core/components/strings/translations";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { type strings } from "./strings/translations";
import { WorkspaceAddUserButton } from "./WorkspaceAddUserButton";

export const columns = (s: typeof strings, uiS: typeof uiStrings) => [
  {
    name: WorkspaceDto.Fields.uniqueId,
    title: uiS.table.uniqueId,
    width: 100,
  },
  {
    // name is complexes.TString now (a locale -> text map) - render whichever
    // locale the viewer is in instead of the raw {en, fa, ...} object (which React
    // can't render as a child at all), same as WorkspaceTypeColumns.ts's own title.
    name: WorkspaceDto.Fields.name,
    title: s.name,
    width: 200,
    filterType: "tstring" as const,
    getCellValue: (entity: WorkspaceDto) => getTStringValue(entity.name, getLocale()),
  },
  {
    name: "addUser",
    title: s.addUser,
    width: 130,
    getCellValue: (item: WorkspaceDto) => (
      <WorkspaceAddUserButton workspace={item} />
    ),
  },
];
