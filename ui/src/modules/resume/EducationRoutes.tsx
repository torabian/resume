import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager } from "@/components/entity-manager/VirtualEntityManager";
import { useEducationGetActionQuery } from "@/modules/resume/sdk/EducationGetAction";
import { useEducationBrowseActionQuery } from "@/modules/resume/sdk/EducationBrowseAction";
import { useEducationCreateAction } from "@/modules/resume/sdk/EducationCreateAction";
import { useEducationUpdateAction } from "@/modules/resume/sdk/EducationUpdateAction";
import { useEducationAwareDeleteAction } from "@/modules/resume/sdk/EducationAwareDeleteAction";
import { EducationDto } from "@/modules/resume/sdk/EducationDto";
import { localizeSchema } from "@/components/entity-manager/VirtualEntityManager/localizeSchema";
import {
  withTStringFields,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// degree/fieldOfStudy/location/description are `complex?: TString` - see
// Resume.emi.yml's own top-of-file "Translatable fields" note.
const TSTRING_FIELDS = ["degree", "fieldOfStudy", "location", "description"];

const BASE_SCHEMA = localizeSchema(
  EducationDto.JsonSchema as RJSFSchema,
  EducationDto.DefaultTranslations,
);
const { schema: EDUCATION_SCHEMA, uiSchema: EDUCATION_UI_SCHEMA } =
  withTStringFields(BASE_SCHEMA, TSTRING_FIELDS);
const beforeSetValues = stripNullOptionalValues(EDUCATION_SCHEMA);

// NOTE: `resume` (required) is a `one` relation selector, left unpatched
// here - see WorkExperienceRoutes.tsx's identical note.
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
