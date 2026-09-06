import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager } from "@/components/entity-manager/VirtualEntityManager";
import { useCertificationGetActionQuery } from "@/modules/resume/sdk/CertificationGetAction";
import { useCertificationBrowseActionQuery } from "@/modules/resume/sdk/CertificationBrowseAction";
import { useCertificationCreateAction } from "@/modules/resume/sdk/CertificationCreateAction";
import { useCertificationUpdateAction } from "@/modules/resume/sdk/CertificationUpdateAction";
import { useCertificationAwareDeleteAction } from "@/modules/resume/sdk/CertificationAwareDeleteAction";
import { CertificationDto } from "@/modules/resume/sdk/CertificationDto";
import { localizeSchema } from "@/components/entity-manager/VirtualEntityManager/localizeSchema";
import {
  withTStringFields,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// name is `complex: TString` (descriptive license text, unlike every other
// entity's `name`) - issuingOrganization is an org's own name and
// deliberately plain string, see Resume.emi.yml's own top-of-file
// "Translatable fields" note.
const TSTRING_FIELDS = ["name"];

const BASE_SCHEMA = localizeSchema(
  CertificationDto.JsonSchema as RJSFSchema,
  CertificationDto.DefaultTranslations,
);
const { schema: CERTIFICATION_SCHEMA, uiSchema: CERTIFICATION_UI_SCHEMA } =
  withTStringFields(BASE_SCHEMA, TSTRING_FIELDS);
const beforeSetValues = stripNullOptionalValues(CERTIFICATION_SCHEMA);

// NOTE: `resume` (required) is a `one` relation selector, left unpatched
// here - see WorkExperienceRoutes.tsx's identical note.
export function useCertificationRoutes() {
  return VirtualEntityManager({
    slug: "certification",
    pluralSlug: "certifications",
    title: "Certifications",
    createTitle: "New certification",
    editTitle: "Edit certification",
    schema: CERTIFICATION_SCHEMA,
    uiSchema: CERTIFICATION_UI_SCHEMA,
    rjsfFields: TSTRING_RJSF_FIELDS,
    beforeSetValues,
    getQuery: useCertificationGetActionQuery,
    browseQuery: useCertificationBrowseActionQuery,
    createQuery: useCertificationCreateAction,
    updateQuery: useCertificationUpdateAction,
    deleteQuery: useCertificationAwareDeleteAction,
  });
}
