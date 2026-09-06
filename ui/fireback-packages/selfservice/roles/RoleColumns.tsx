import { type QueryArchiveColumn } from "@fireback/ui-core/types/QueryArchiveColumn";
import { RoleDto } from "@fireback/selfservice/sdk/abac/RoleDto";
import { type strings as uiStrings } from "@fireback/ui-core/components/strings/translations";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { type strings } from "./strings/translations";

export const columns = (
  s: typeof strings,
  uiS: typeof uiStrings,
): QueryArchiveColumn[] => [
  {
    name: RoleDto.Fields.uniqueId,
    title: uiS.table.uniqueId,
    width: 200,
  },
  {
    // name is complexes.TString now (a locale -> text map, see Abac.emi.yml's own
    // comment on the role entity) - render whichever locale the viewer is in
    // instead of the raw {en, fa, ...} object, same as CapabilityColumns.tsx's own
    // name/description columns.
    name: RoleDto.Fields.name,
    title: s.role.name,
    width: 200,
    getCellValue: (dto: RoleDto) => getTStringValue(dto.name, getLocale()),
  },
];
