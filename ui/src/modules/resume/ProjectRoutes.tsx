import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager, localizeSchema } from "@fireback/virtual-entity-manager";
import { useProjectGetActionQuery } from "@/modules/resume/sdk/ProjectGetAction";
import { useProjectBrowseActionQuery } from "@/modules/resume/sdk/ProjectBrowseAction";
import { useProjectCreateAction } from "@/modules/resume/sdk/ProjectCreateAction";
import { useProjectUpdateAction } from "@/modules/resume/sdk/ProjectUpdateAction";
import { useProjectAwareDeleteAction } from "@/modules/resume/sdk/ProjectAwareDeleteAction";
import { ProjectDto } from "@/modules/resume/sdk/ProjectDto";

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
const beforeSetValues = stripNullOptionalValues(PROJECT_SCHEMA, XDATE_FIELDS);

export function useProjectRoutes() {
  return VirtualEntityManager({
    slug: "project",
    pluralSlug: "projects",
    title: "Projects",
    createTitle: "New project",
    editTitle: "Edit project",
    schema: PROJECT_SCHEMA,
    uiSchema: PROJECT_UI_SCHEMA,
    rjsfFields: TSTRING_RJSF_FIELDS,
    beforeSetValues,
    getQuery: useProjectGetActionQuery,
    browseQuery: useProjectBrowseActionQuery,
    createQuery: useProjectCreateAction,
    updateQuery: useProjectUpdateAction,
    deleteQuery: useProjectAwareDeleteAction,
  });
}
