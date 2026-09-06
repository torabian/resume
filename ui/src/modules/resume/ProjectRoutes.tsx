import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager } from "@/components/entity-manager/VirtualEntityManager";
import { useProjectGetActionQuery } from "@/modules/resume/sdk/ProjectGetAction";
import { useProjectBrowseActionQuery } from "@/modules/resume/sdk/ProjectBrowseAction";
import { useProjectCreateAction } from "@/modules/resume/sdk/ProjectCreateAction";
import { useProjectUpdateAction } from "@/modules/resume/sdk/ProjectUpdateAction";
import { useProjectAwareDeleteAction } from "@/modules/resume/sdk/ProjectAwareDeleteAction";
import { ProjectDto } from "@/modules/resume/sdk/ProjectDto";
import { localizeSchema } from "@/components/entity-manager/VirtualEntityManager/localizeSchema";
import {
  withTStringFields,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// role/summary are `complex?: TString` - name is a proper noun/product name
// and deliberately plain string, see Resume.emi.yml's own top-of-file
// "Translatable fields" note.
const TSTRING_FIELDS = ["role", "summary"];

const BASE_SCHEMA = localizeSchema(
  ProjectDto.JsonSchema as RJSFSchema,
  ProjectDto.DefaultTranslations,
);
const { schema: PROJECT_SCHEMA, uiSchema: PROJECT_UI_SCHEMA } =
  withTStringFields(BASE_SCHEMA, TSTRING_FIELDS);
const beforeSetValues = stripNullOptionalValues(PROJECT_SCHEMA);

// NOTE: `resume` (required) is a `one` relation selector, left unpatched
// here - see WorkExperienceRoutes.tsx's identical note.
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
