import { CapabilityDto } from "@fireback/manage/sdk/abac/CapabilityDto";
import { useS } from "@fireback/ui-core/hooks/useS";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { strings } from "./strings/translations";
export const columns = (t: typeof strings) => [
  {
    name: "uniqueId",
    title: t.capabilities.uniqueId,
    width: 200,
  },
  {
    // name/description are complexes.TString now (a locale -> text map, see
    // Abac.emi.yml's own comment on the capability entity) - render whichever
    // locale the viewer is in instead of the raw {en, fa, ...} object (which React
    // can't render as a child at all), and mark the column "tstring" so
    // DataGridListHeaderCell offers TStringFilterDrawer's per-language filter
    // instead of a plain text input.
    name: CapabilityDto.Fields.name,
    title: t.capabilities.name,
    width: 100,
    filterType: "tstring" as const,
    getCellValue: (dto: CapabilityDto) => getTStringValue(dto.name, getLocale()),
  },
  {
    name: CapabilityDto.Fields.description,
    title: t.capabilities.description,
    width: 100,
    filterType: "tstring" as const,
    getCellValue: (dto: CapabilityDto) =>
      getTStringValue(dto.description, getLocale()),
  },
];
