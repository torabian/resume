import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager, localizeSchema } from "@fireback/virtual-entity-manager";
import { useWorkExperienceGetActionQuery } from "@/modules/resume/sdk/WorkExperienceGetAction";
import { useWorkExperienceBrowseActionQuery } from "@/modules/resume/sdk/WorkExperienceBrowseAction";
import { useWorkExperienceCreateAction } from "@/modules/resume/sdk/WorkExperienceCreateAction";
import { useWorkExperienceUpdateAction } from "@/modules/resume/sdk/WorkExperienceUpdateAction";
import { useWorkExperienceAwareDeleteAction } from "@/modules/resume/sdk/WorkExperienceAwareDeleteAction";
import { WorkExperienceDto } from "@/modules/resume/sdk/WorkExperienceDto";

import {
  withTStringFields,
  withoutUniqueId,
  withXDateFields,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// company/jobTitle/location are `complex(?): TString` - see Resume.emi.yml's
// own top-of-file "Translatable fields" note. `company` used to be a
// `one? target: CompanyEntity` relation (left unpatched here deliberately -
// see the removed NOTE this comment used to carry) but is now a plain
// TString field like the others, so it needs the same patch.
const TSTRING_FIELDS = ["company", "jobTitle", "location"];

// startDate (required) / endDate (optional) are `complex(?): XDate` - see
// Resume.emi.yml's own top-of-file "Dates" note.
const XDATE_FIELDS = ["startDate", "endDate"];

const BASE_SCHEMA = withoutUniqueId(
  localizeSchema(WorkExperienceDto.JsonSchema as RJSFSchema, WorkExperienceDto.DefaultTranslations),
);
const { schema: TSTRING_PATCHED_SCHEMA, uiSchema: WORK_EXPERIENCE_UI_SCHEMA } =
  withTStringFields(BASE_SCHEMA, TSTRING_FIELDS);
const { schema: WORK_EXPERIENCE_SCHEMA } = withXDateFields(
  TSTRING_PATCHED_SCHEMA,
  XDATE_FIELDS,
);
// Only endDate is optional (startDate is required) - see
// stripNullOptionalValues's own doc comment on why only optional XDate
// fields need their "" normalized away.
const beforeSetValues = stripNullOptionalValues(WORK_EXPERIENCE_SCHEMA, [
  "endDate",
]);

export function useWorkExperienceRoutes() {
  return VirtualEntityManager({
    slug: "work-experience",
    pluralSlug: "work-experiences",
    title: "Work experience",
    createTitle: "New work experience",
    editTitle: "Edit work experience",
    schema: WORK_EXPERIENCE_SCHEMA,
    uiSchema: WORK_EXPERIENCE_UI_SCHEMA,
    rjsfFields: TSTRING_RJSF_FIELDS,
    beforeSetValues,
    getQuery: useWorkExperienceGetActionQuery,
    browseQuery: useWorkExperienceBrowseActionQuery,
    createQuery: useWorkExperienceCreateAction,
    updateQuery: useWorkExperienceUpdateAction,
    deleteQuery: useWorkExperienceAwareDeleteAction,
  });
}
