import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager, localizeSchema } from "@fireback/virtual-entity-manager";
import { useResumeGetActionQuery } from "@/modules/resume/sdk/ResumeGetAction";
import { useResumeBrowseActionQuery } from "@/modules/resume/sdk/ResumeBrowseAction";
import { useResumeCreateAction } from "@/modules/resume/sdk/ResumeCreateAction";
import { useResumeUpdateAction } from "@/modules/resume/sdk/ResumeUpdateAction";
import { useResumeAwareDeleteAction } from "@/modules/resume/sdk/ResumeAwareDeleteAction";
import { ResumeDto } from "@/modules/resume/sdk/ResumeDto";
import { ResumeContentField } from "./ResumeContentField";

import {
  withTStringFields,
  withoutUniqueId,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// headline/summary/location are `complex?: TString`; fullName and every
// contact field (email/phone/website/linkedin/github/photoUrl/language) are
// plain strings, left alone - see Resume.emi.yml's own top-of-file
// "Translatable fields" note.
const TSTRING_FIELDS = ["headline", "summary", "location"];
// summary is free-text prose (a paragraph, not a label) - see
// withTStringFields' own doc comment on multilineFields.
const MULTILINE_FIELDS = ["summary"];

const BASE_SCHEMA = withoutUniqueId(
  localizeSchema(ResumeDto.JsonSchema as RJSFSchema, ResumeDto.DefaultTranslations),
);
const { schema: RESUME_SCHEMA, uiSchema: TSTRING_UI_SCHEMA } =
  withTStringFields(BASE_SCHEMA, TSTRING_FIELDS, MULTILINE_FIELDS);
// `content` (`complex?: MJson` - see Resume.emi.yml) opts into
// ResumeContentField.tsx's own picker-in-a-modal instead of rjsf's default
// raw-JSON rendering for an untyped property - same "ui:field" mechanism
// TString fields above use, just a different custom field/registration
// (see RESUME_FORM_FIELDS below).
const RESUME_UI_SCHEMA = {
  ...TSTRING_UI_SCHEMA,
  content: { "ui:field": "resumeContent" },
};
const RESUME_FORM_FIELDS = {
  ...TSTRING_RJSF_FIELDS,
  resumeContent: ResumeContentField,
};
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
    rjsfFields: RESUME_FORM_FIELDS,
    beforeSetValues,
    getQuery: useResumeGetActionQuery,
    browseQuery: useResumeBrowseActionQuery,
    createQuery: useResumeCreateAction,
    updateQuery: useResumeUpdateAction,
    deleteQuery: useResumeAwareDeleteAction,
  });
}
