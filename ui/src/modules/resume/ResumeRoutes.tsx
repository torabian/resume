import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager } from "@/components/entity-manager/VirtualEntityManager";
import { useResumeGetActionQuery } from "@/modules/resume/sdk/ResumeGetAction";
import { useResumeBrowseActionQuery } from "@/modules/resume/sdk/ResumeBrowseAction";
import { useResumeCreateAction } from "@/modules/resume/sdk/ResumeCreateAction";
import { useResumeUpdateAction } from "@/modules/resume/sdk/ResumeUpdateAction";
import { useResumeAwareDeleteAction } from "@/modules/resume/sdk/ResumeAwareDeleteAction";
import { ResumeDto } from "@/modules/resume/sdk/ResumeDto";
import { localizeSchema } from "@/components/entity-manager/VirtualEntityManager/localizeSchema";
import {
  withTStringFields,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// headline/summary/location are `complex?: TString`; fullName and every
// contact field (email/phone/website/linkedin/github/photoUrl/language) are
// plain strings, left alone - see Resume.emi.yml's own top-of-file
// "Translatable fields" note.
const TSTRING_FIELDS = ["headline", "summary", "location"];

const BASE_SCHEMA = localizeSchema(
  ResumeDto.JsonSchema as RJSFSchema,
  ResumeDto.DefaultTranslations,
);
const { schema: RESUME_SCHEMA, uiSchema: RESUME_UI_SCHEMA } =
  withTStringFields(BASE_SCHEMA, TSTRING_FIELDS);
const beforeSetValues = stripNullOptionalValues(RESUME_SCHEMA);

// slug "profile" (not "resume") - matches ../../../cmd's own CLI naming
// (modules/resume/RouterManifest.go's "profile" command group) and avoids
// colliding with the product's own name in the URL.
export function useResumeRoutes() {
  return VirtualEntityManager({
    slug: "profile",
    pluralSlug: "profiles",
    title: "Resumes",
    createTitle: "New resume",
    editTitle: "Edit resume",
    schema: RESUME_SCHEMA,
    uiSchema: RESUME_UI_SCHEMA,
    rjsfFields: TSTRING_RJSF_FIELDS,
    beforeSetValues,
    getQuery: useResumeGetActionQuery,
    browseQuery: useResumeBrowseActionQuery,
    createQuery: useResumeCreateAction,
    updateQuery: useResumeUpdateAction,
    deleteQuery: useResumeAwareDeleteAction,
  });
}
