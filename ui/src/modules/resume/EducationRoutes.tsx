import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager, localizeSchema } from "@fireback/virtual-entity-manager";
import { useEducationGetActionQuery } from "@/modules/resume/sdk/EducationGetAction";
import { useEducationBrowseActionQuery } from "@/modules/resume/sdk/EducationBrowseAction";
import { useEducationCreateAction } from "@/modules/resume/sdk/EducationCreateAction";
import { useEducationUpdateAction } from "@/modules/resume/sdk/EducationUpdateAction";
import { useEducationAwareDeleteAction } from "@/modules/resume/sdk/EducationAwareDeleteAction";
import { EducationDto } from "@/modules/resume/sdk/EducationDto";

import {
  withTStringFields,
  withoutUniqueId,
  withXDateFields,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// degree/fieldOfStudy/location/description are `complex?: TString` - see
// Resume.emi.yml's own top-of-file "Translatable fields" note.
const TSTRING_FIELDS = ["degree", "fieldOfStudy", "location", "description"];
// description is free-text prose (a paragraph, not a label) - see
// withTStringFields' own doc comment on multilineFields.
const MULTILINE_FIELDS = ["description"];

// startDate/endDate are `complex?: XDate` - see Resume.emi.yml's own
// top-of-file "Dates" note.
const XDATE_FIELDS = ["startDate", "endDate"];

const BASE_SCHEMA = withoutUniqueId(
  localizeSchema(EducationDto.JsonSchema as RJSFSchema, EducationDto.DefaultTranslations),
);
const { schema: TSTRING_PATCHED_SCHEMA, uiSchema: EDUCATION_UI_SCHEMA } =
  withTStringFields(BASE_SCHEMA, TSTRING_FIELDS, MULTILINE_FIELDS);
const { schema: EDUCATION_SCHEMA } = withXDateFields(
  TSTRING_PATCHED_SCHEMA,
  XDATE_FIELDS,
);
// Both startDate and endDate are optional here (unlike WorkExperience's
// required startDate) - see stripNullOptionalValues's own doc comment on
// why only optional XDate fields need their "" normalized away.
const beforeSetValues = stripNullOptionalValues(
  EDUCATION_SCHEMA,
  XDATE_FIELDS,
);

export function useEducationRoutes() {
  return VirtualEntityManager({
    slug: "education",
    pluralSlug: "educations",
    title: "Education",
    createTitle: "New education entry",
    editTitle: "Edit education entry",
    schema: EDUCATION_SCHEMA,
    uiSchema: EDUCATION_UI_SCHEMA,
    rjsfFields: TSTRING_RJSF_FIELDS,
    beforeSetValues,
    getQuery: useEducationGetActionQuery,
    browseQuery: useEducationBrowseActionQuery,
    createQuery: useEducationCreateAction,
    updateQuery: useEducationUpdateAction,
    deleteQuery: useEducationAwareDeleteAction,
  });
}
