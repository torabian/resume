import { type RJSFSchema } from "@rjsf/utils";
import { VirtualEntityManager, localizeSchema } from "@fireback/virtual-entity-manager";
import { useTargetPositionGetActionQuery } from "@/modules/resume/sdk/TargetPositionGetAction";
import { useTargetPositionBrowseActionQuery } from "@/modules/resume/sdk/TargetPositionBrowseAction";
import { useTargetPositionCreateAction } from "@/modules/resume/sdk/TargetPositionCreateAction";
import { useTargetPositionUpdateAction } from "@/modules/resume/sdk/TargetPositionUpdateAction";
import { useTargetPositionAwareDeleteAction } from "@/modules/resume/sdk/TargetPositionAwareDeleteAction";
import { TargetPositionDto } from "@/modules/resume/sdk/TargetPositionDto";

import {
  withTStringFields,
  TSTRING_RJSF_FIELDS,
  stripNullOptionalValues,
} from "./routeUtils";

// name is the only field, and it's `complex: TString` - unlike Company/
// Skill/Project's own `name` (a proper noun, left plain), a target
// position's name is descriptive prose ("Fullstack JavaScript Developer"),
// same reasoning as Certification/Language's own `name` field - see
// Resume.emi.yml's own doc comment on targetPosition.
const TSTRING_FIELDS = ["name"];

const BASE_SCHEMA = localizeSchema(
  TargetPositionDto.JsonSchema as RJSFSchema,
  TargetPositionDto.DefaultTranslations,
);
const { schema: TARGET_POSITION_SCHEMA, uiSchema: TARGET_POSITION_UI_SCHEMA } =
  withTStringFields(BASE_SCHEMA, TSTRING_FIELDS);
const beforeSetValues = stripNullOptionalValues(TARGET_POSITION_SCHEMA);

export function useTargetPositionRoutes() {
  return VirtualEntityManager({
    slug: "target-position",
    pluralSlug: "target-positions",
    title: "Target positions",
    createTitle: "New target position",
    editTitle: "Edit target position",
    schema: TARGET_POSITION_SCHEMA,
    uiSchema: TARGET_POSITION_UI_SCHEMA,
    rjsfFields: TSTRING_RJSF_FIELDS,
    beforeSetValues,
    getQuery: useTargetPositionGetActionQuery,
    browseQuery: useTargetPositionBrowseActionQuery,
    createQuery: useTargetPositionCreateAction,
    updateQuery: useTargetPositionUpdateAction,
    deleteQuery: useTargetPositionAwareDeleteAction,
  });
}
