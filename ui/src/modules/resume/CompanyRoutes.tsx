import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager } from "@/components/entity-manager/VirtualEntityManager";
import { useCompanyGetActionQuery } from "@/modules/resume/sdk/CompanyGetAction";
import { useCompanyBrowseActionQuery } from "@/modules/resume/sdk/CompanyBrowseAction";
import { useCompanyCreateAction } from "@/modules/resume/sdk/CompanyCreateAction";
import { useCompanyUpdateAction } from "@/modules/resume/sdk/CompanyUpdateAction";
import { useCompanyAwareDeleteAction } from "@/modules/resume/sdk/CompanyAwareDeleteAction";
import { CompanyDto } from "@/modules/resume/sdk/CompanyDto";
import { useMemo } from "react";
import { localizeSchema } from "@/components/entity-manager/VirtualEntityManager/localizeSchema";
import {
  withTStringFields,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// industry/location/description are `complex?: TString` (see
// Resume.emi.yml's own top-of-file "Translatable fields" note) - name/
// website/logoUrl are plain strings, left alone.
const TSTRING_FIELDS = ["industry", "location", "description"];

const BASE_SCHEMA = localizeSchema(
  CompanyDto.JsonSchema as RJSFSchema,
  CompanyDto.DefaultTranslations,
);
const { schema: COMPANY_SCHEMA, uiSchema: COMPANY_UI_SCHEMA } =
  withTStringFields(BASE_SCHEMA, TSTRING_FIELDS);
const beforeSetValues = stripNullOptionalValues(COMPANY_SCHEMA);

export function useCompanyRoutes() {
  // BASE_SCHEMA/COMPANY_SCHEMA/COMPANY_UI_SCHEMA are module-level constants
  // (CompanyDto.JsonSchema never changes at runtime) rather than useMemo'd
  // here - VirtualEntityManager's own Form useMemo already requires a
  // stable schema/uiSchema reference (see its file header comment), and a
  // module-level constant is the simplest way to guarantee that.
  return VirtualEntityManager({
    slug: "company",
    pluralSlug: "companies",
    title: "Companies",
    createTitle: "New company",
    editTitle: "Edit company",
    schema: COMPANY_SCHEMA,
    uiSchema: COMPANY_UI_SCHEMA,
    rjsfFields: TSTRING_RJSF_FIELDS,
    beforeSetValues,
    getQuery: useCompanyGetActionQuery,
    browseQuery: useCompanyBrowseActionQuery,
    createQuery: useCompanyCreateAction,
    updateQuery: useCompanyUpdateAction,
    deleteQuery: useCompanyAwareDeleteAction,
  });
}
