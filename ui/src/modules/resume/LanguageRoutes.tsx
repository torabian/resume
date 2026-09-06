import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager } from "@/components/entity-manager/VirtualEntityManager";
import { useLanguageGetActionQuery } from "@/modules/resume/sdk/LanguageGetAction";
import { useLanguageBrowseActionQuery } from "@/modules/resume/sdk/LanguageBrowseAction";
import { useLanguageCreateAction } from "@/modules/resume/sdk/LanguageCreateAction";
import { useLanguageUpdateAction } from "@/modules/resume/sdk/LanguageUpdateAction";
import { useLanguageAwareDeleteAction } from "@/modules/resume/sdk/LanguageAwareDeleteAction";
import { LanguageDto } from "@/modules/resume/sdk/LanguageDto";
import { localizeSchema } from "@/components/entity-manager/VirtualEntityManager/localizeSchema";
import {
  withTStringFields,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// name is `complex: TString` (a language's own display name should render
// in the viewer's own language, e.g. "فارسی" not "Persian") - see
// Resume.emi.yml's own top-of-file "Translatable fields" note.
const TSTRING_FIELDS = ["name"];

const BASE_SCHEMA = localizeSchema(
  LanguageDto.JsonSchema as RJSFSchema,
  LanguageDto.DefaultTranslations,
);
const { schema: LANGUAGE_SCHEMA, uiSchema: LANGUAGE_UI_SCHEMA } =
  withTStringFields(BASE_SCHEMA, TSTRING_FIELDS);
const beforeSetValues = stripNullOptionalValues(LANGUAGE_SCHEMA);

// NOTE: `resume` (required) is a `one` relation selector, left unpatched
// here - see WorkExperienceRoutes.tsx's identical note.
export function useLanguageRoutes() {
  return VirtualEntityManager({
    slug: "language",
    pluralSlug: "languages",
    title: "Languages",
    createTitle: "New language",
    editTitle: "Edit language",
    schema: LANGUAGE_SCHEMA,
    uiSchema: LANGUAGE_UI_SCHEMA,
    rjsfFields: TSTRING_RJSF_FIELDS,
    beforeSetValues,
    getQuery: useLanguageGetActionQuery,
    browseQuery: useLanguageBrowseActionQuery,
    createQuery: useLanguageCreateAction,
    updateQuery: useLanguageUpdateAction,
    deleteQuery: useLanguageAwareDeleteAction,
  });
}
