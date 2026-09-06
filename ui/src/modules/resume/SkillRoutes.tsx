import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager } from "@/components/entity-manager/VirtualEntityManager";
import { useSkillGetActionQuery } from "@/modules/resume/sdk/SkillGetAction";
import { useSkillBrowseActionQuery } from "@/modules/resume/sdk/SkillBrowseAction";
import { useSkillCreateAction } from "@/modules/resume/sdk/SkillCreateAction";
import { useSkillUpdateAction } from "@/modules/resume/sdk/SkillUpdateAction";
import { useSkillAwareDeleteAction } from "@/modules/resume/sdk/SkillAwareDeleteAction";
import { SkillDto } from "@/modules/resume/sdk/SkillDto";
import { localizeSchema } from "@/components/entity-manager/VirtualEntityManager/localizeSchema";
import {
  withTStringFields,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// description is `complex?: TString` - name is a tech/language name and
// deliberately plain string, see Resume.emi.yml's own top-of-file
// "Translatable fields" note.
const TSTRING_FIELDS = ["description"];

const BASE_SCHEMA = localizeSchema(
  SkillDto.JsonSchema as RJSFSchema,
  SkillDto.DefaultTranslations,
);
const { schema: SKILL_SCHEMA, uiSchema: SKILL_UI_SCHEMA } = withTStringFields(
  BASE_SCHEMA,
  TSTRING_FIELDS,
);
const beforeSetValues = stripNullOptionalValues(SKILL_SCHEMA);

// NOTE: `resume` (required) is a `one` relation selector, left unpatched
// here - see WorkExperienceRoutes.tsx's identical note.
export function useSkillRoutes() {
  return VirtualEntityManager({
    slug: "skill",
    pluralSlug: "skills",
    title: "Skills",
    createTitle: "New skill",
    editTitle: "Edit skill",
    schema: SKILL_SCHEMA,
    uiSchema: SKILL_UI_SCHEMA,
    rjsfFields: TSTRING_RJSF_FIELDS,
    beforeSetValues,
    getQuery: useSkillGetActionQuery,
    browseQuery: useSkillBrowseActionQuery,
    createQuery: useSkillCreateAction,
    updateQuery: useSkillUpdateAction,
    deleteQuery: useSkillAwareDeleteAction,
  });
}
