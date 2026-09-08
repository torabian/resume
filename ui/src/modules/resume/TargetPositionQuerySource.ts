import {
  useTargetPositionBrowseActionQuery,
  TargetPositionBrowseActionQueryParams,
} from "@/modules/resume/sdk/TargetPositionBrowseAction";
import type { TargetPositionDto } from "@/modules/resume/sdk/TargetPositionDto";
import type { UseRemoteQuery } from "@fireback/ui-core/types/remoteQuery";

// Same shape/reasoning as ./WorkExperienceQuerySource.ts's own
// useWorkExperiencesQuerySource - adapts useTargetPositionBrowseActionQuery
// into the {query, items, keyExtractor} shape FormSelect/FormSelectMultiple
// expect. Used by ProjectEditForm.tsx to pick each description's target
// position.
export const useTargetPositionsQuerySource = (params?: UseRemoteQuery) => {
  const query = useTargetPositionBrowseActionQuery({
    qs: new TargetPositionBrowseActionQueryParams({
      itemsPerPage: params?.query?.itemsPerPage ?? 200,
    }),
  });
  const items = ((query.data as any)?.data?.items ?? []) as TargetPositionDto[];
  return {
    query: query as any,
    items,
    keyExtractor: (item: TargetPositionDto) => item.uniqueId,
  };
};
