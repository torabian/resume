import { useMemo } from "react";
import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager, localizeSchema } from "@fireback/virtual-entity-manager";
import { type DatatableColumn } from "@fireback/ui-core/types/DatatableColumn";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { useProjectGetActionQuery } from "@/modules/resume/sdk/ProjectGetAction";
import { useProjectBrowseActionQuery } from "@/modules/resume/sdk/ProjectBrowseAction";
import { useProjectCreateAction } from "@/modules/resume/sdk/ProjectCreateAction";
import { useProjectUpdateAction } from "@/modules/resume/sdk/ProjectUpdateAction";
import { useProjectAwareDeleteAction } from "@/modules/resume/sdk/ProjectAwareDeleteAction";
import { ProjectDto } from "@/modules/resume/sdk/ProjectDto";
import { ProjectEditForm } from "./forms/ProjectEditForm";
import { ProjectSingleScreenExtra } from "./ProjectSingleScreenExtra";

import {
  withTStringFields,
  withoutUniqueId,
  withXDateFields,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// role/summary are `complex?: TString` - name is a proper noun/product name
// and deliberately plain string, see Resume.emi.yml's own top-of-file
// "Translatable fields" note.
const TSTRING_FIELDS = ["role", "summary"];
// summary is free-text prose (a paragraph, not a label) - see
// withTStringFields' own doc comment on multilineFields.
const MULTILINE_FIELDS = ["summary"];

// startDate/endDate are `complex?: XDate` - see Resume.emi.yml's own
// top-of-file "Dates" note.
const XDATE_FIELDS = ["startDate", "endDate"];

const BASE_SCHEMA = withoutUniqueId(
  localizeSchema(ProjectDto.JsonSchema as RJSFSchema, ProjectDto.DefaultTranslations),
);
const { schema: TSTRING_PATCHED_SCHEMA, uiSchema: PROJECT_UI_SCHEMA } =
  withTStringFields(BASE_SCHEMA, TSTRING_FIELDS, MULTILINE_FIELDS);
const { schema: PROJECT_SCHEMA } = withXDateFields(
  TSTRING_PATCHED_SCHEMA,
  XDATE_FIELDS,
);
// Both startDate and endDate are optional here - see
// stripNullOptionalValues's own doc comment on why only optional XDate
// fields need their "" normalized away.
//
// No extra normalization needed for the one/one? relation fields
// (experience, descriptions[].target) beyond this - an untouched relation
// field round-trips as the bare target dto (still carrying its own
// uniqueId), and the generated *EntityUpdateFn now falls back to that
// uniqueId itself when no explicit {"__operation":"select",...} tag is
// present (see ../../../emi/lib/golang/go-entity-actions.go's
// FieldTypeOne/OneNullable case) - so the frontend never has to pre-wrap a
// relation field just because the user didn't touch it.
const beforeSetValues = stripNullOptionalValues(PROJECT_SCHEMA, XDATE_FIELDS);

// experience/descriptions are relation/array fields - columnsFromSchema's
// own default (see @fireback/virtual-entity-manager's schemaCasting.ts)
// falls back to stringifying whatever's there for a field it has no
// `format` hint for, which for these two meant the archive grid showing a
// raw, unreadable JSON dump (or, before MOne.toJSON()'s own fix - see
// js-remote-ctx/common/operators.ts - literally "{}"). A one-line label
// (job title @ company) and a plain count read far better, so this entity
// gets its own explicit `columns` instead of leaning on that default -
// every other column here just reproduces what columnsFromSchema would
// already have derived from PROJECT_SCHEMA (same titles/filter wiring), so
// switching to an explicit list doesn't lose anything for those.
function experienceCellValue(dto: any, locale: string): string {
  const value = dto?.experience;
  if (!value) return "";
  // dto.experience is an MOne<WorkExperienceDto> off the generated
  // ProjectOptionalDto (browse items) - .get() unwraps it; a plain object
  // is tolerated too in case a caller ever hands this a flattened row.
  const content = typeof value.get === "function" ? value.get() : value;
  if (!content) return "";
  const jobTitle = getTStringValue(content.jobTitle, locale);
  const company = getTStringValue(content.company, locale);
  return [jobTitle, company].filter(Boolean).join(" @ ");
}

function descriptionsCellValue(dto: any): number {
  const value = dto?.descriptions;
  const items = typeof value?.get === "function" ? value.get() : Array.isArray(value) ? value : [];
  return items?.length ?? 0;
}

function buildProjectColumns(locale: string): DatatableColumn[] {
  return [
    { name: "uniqueId", title: "Unique Id", width: 100 },
    { name: "name", title: "Name", width: 200, filterable: true, filterType: "string" },
    {
      name: "role",
      title: "Role",
      width: 160,
      filterable: true,
      filterType: "tstring",
      filterKey: "role",
      getCellValue: (dto: any) => getTStringValue(dto?.role, locale),
    },
    {
      name: "experience",
      title: "Experience",
      width: 220,
      getCellValue: (dto: any) => experienceCellValue(dto, locale),
    },
    {
      name: "descriptions",
      title: "Descriptions",
      width: 120,
      getCellValue: (dto: any) => descriptionsCellValue(dto),
    },
    {
      name: "summary",
      title: "Summary",
      width: 240,
      filterable: true,
      filterType: "tstring",
      filterKey: "summary",
      getCellValue: (dto: any) => getTStringValue(dto?.summary, locale),
    },
    {
      name: "startDate",
      title: "Start date",
      width: 130,
      filterable: true,
      filterType: "date",
      filterKey: "start_date",
    },
    {
      name: "endDate",
      title: "End date",
      width: 130,
      filterable: true,
      filterType: "date",
      filterKey: "end_date",
    },
    { name: "url", title: "URL", width: 200, filterable: true, filterType: "string" },
    {
      name: "repoUrl",
      title: "Repo URL",
      width: 200,
      filterable: true,
      filterType: "string",
      filterKey: "repo_url",
    },
  ];
}

// Single/view fields, excluding experience/descriptions - see
// ProjectSingleScreenExtra.tsx's own doc comment for why: the plain
// {key,label,format} shape SingleScreen.tsx renders these through has no
// way to format a relation/array field meaningfully (`format` only special-
// cases "tstring"), so those two are rendered as their own sections via
// singleScreenExtra below instead of showing up here as raw JSON.
const PROJECT_FIELDS: Array<{ key: string; label: string; format?: string }> = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role", format: "tstring" },
  { key: "summary", label: "Summary", format: "tstring" },
  { key: "startDate", label: "Start date" },
  { key: "endDate", label: "End date" },
  { key: "url", label: "URL" },
  { key: "repoUrl", label: "Repo URL" },
];

export function useProjectRoutes() {
  const { locale } = useLocale();
  // Memoized on `locale` alone - VirtualEntityManager.tsx's own doc comment
  // on `effectiveColumns` explains why a fresh columns array on every
  // unrelated re-render is a real bug, not just a style nit (it resets
  // react-data-grid's scroll bookkeeping and can re-trigger infinite-scroll
  // fetches) - so this can't be a plain inline array/object literal here.
  const columns = useMemo(() => buildProjectColumns(locale), [locale]);

  return VirtualEntityManager({
    slug: "project",
    pluralSlug: "projects",
    title: "Projects",
    createTitle: "New project",
    editTitle: "Edit project",
    schema: PROJECT_SCHEMA,
    uiSchema: PROJECT_UI_SCHEMA,
    rjsfFields: TSTRING_RJSF_FIELDS,
    // schema/uiSchema/rjsfFields above still drive the single-view fields
    // (see VirtualEntityManager.tsx) - customForm replaces the create/edit
    // *form*, columns (below) replaces the archive grid's own derivation.
    // See ProjectEditForm.tsx's own doc comment for why this entity needs a
    // customForm (descriptions' per-target-position tabs) when every other
    // resume entity doesn't.
    customForm: ProjectEditForm,
    columns,
    fields: PROJECT_FIELDS,
    singleScreenExtra: (entity) => <ProjectSingleScreenExtra entity={entity} />,
    // Wider than the default 500px every other resume entity's form uses
    // (theme-basic.css's own .headless-form-entity-manager rule) - the
    // descriptions tabs (ProjectDescriptionsTabs.tsx) need real horizontal
    // room, not a narrow single-column form. See ./ProjectEditForm.css's
    // own ".project-edit-form" rule.
    formClassName: "project-edit-form",
    beforeSetValues,
    getQuery: useProjectGetActionQuery,
    browseQuery: useProjectBrowseActionQuery,
    createQuery: useProjectCreateAction,
    updateQuery: useProjectUpdateAction,
    deleteQuery: useProjectAwareDeleteAction,
  });
}
