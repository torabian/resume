import {
  useSkillBrowseActionQuery,
  SkillBrowseActionQueryParams,
} from "@/modules/resume/sdk/SkillBrowseAction";
import type { SkillDto } from "@/modules/resume/sdk/SkillDto";
import type { UseRemoteQuery } from "@fireback/ui-core/types/remoteQuery";

// Same shape/reasoning as ./WorkExperienceQuerySource.ts's own
// useWorkExperiencesQuerySource. Used by ProjectEditForm.tsx to pick the
// skills highlighted under each of a project's descriptions.
export const useSkillsQuerySource = (params?: UseRemoteQuery) => {
  const query = useSkillBrowseActionQuery({
    qs: new SkillBrowseActionQueryParams({
      itemsPerPage: params?.query?.itemsPerPage ?? 200,
    }),
  });
  const items = ((query.data as any)?.data?.items ?? []) as SkillDto[];
  return {
    query: query as any,
    items,
    keyExtractor: (item: SkillDto) => item.uniqueId,
  };
};
