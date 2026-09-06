import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager } from "@/components/entity-manager/VirtualEntityManager";
import { useWorkExperienceGetActionQuery } from "@/modules/resume/sdk/WorkExperienceGetAction";
import { useWorkExperienceBrowseActionQuery } from "@/modules/resume/sdk/WorkExperienceBrowseAction";
import { useWorkExperienceCreateAction } from "@/modules/resume/sdk/WorkExperienceCreateAction";
import { useWorkExperienceUpdateAction } from "@/modules/resume/sdk/WorkExperienceUpdateAction";
import { useWorkExperienceAwareDeleteAction } from "@/modules/resume/sdk/WorkExperienceAwareDeleteAction";
import { WorkExperienceDto } from "@/modules/resume/sdk/WorkExperienceDto";
import { localizeSchema } from "@/components/entity-manager/VirtualEntityManager/localizeSchema";
import {
  withTStringFields,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// jobTitle/location/summary are `complex(?): TString` - see Resume.emi.yml's
// own top-of-file "Translatable fields" note.
const TSTRING_FIELDS = ["jobTitle", "location", "summary"];

const BASE_SCHEMA = localizeSchema(
  WorkExperienceDto.JsonSchema as RJSFSchema,
  WorkExperienceDto.DefaultTranslations,
);
const { schema: WORK_EXPERIENCE_SCHEMA, uiSchema: WORK_EXPERIENCE_UI_SCHEMA } =
  withTStringFields(BASE_SCHEMA, TSTRING_FIELDS);
const beforeSetValues = stripNullOptionalValues(WORK_EXPERIENCE_SCHEMA);

// NOTE: `resume` (required) and `company` (optional) are `one`/`one?`
// relation selectors, left unpatched here - same known gap as
// ../../../nima/ui/src/modules/musicalwork/MusicalWorkRoutes.tsx's own
// `musicalContext: one?` field (see routeUtils.ts's withTStringFields doc
// comment): VirtualEntityManager has no relation-picker widget yet, so
// create/update through this generic form can't set them today. Get/
// Browse/single-view/delete all work fully regardless.
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
