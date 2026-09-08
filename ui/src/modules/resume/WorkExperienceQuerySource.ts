import {
  useWorkExperienceBrowseActionQuery,
  WorkExperienceBrowseActionQueryParams,
} from "@/modules/resume/sdk/WorkExperienceBrowseAction";
import type { WorkExperienceDto } from "@/modules/resume/sdk/WorkExperienceDto";
import type { UseRemoteQuery } from "@fireback/ui-core/types/remoteQuery";

// Adapts useWorkExperienceBrowseActionQuery into the {query, items,
// keyExtractor} shape FormSelect (see forms/ProjectEditForm.tsx's own
// "experience" field) expects - same convention as
// ../../../nima/ui/src/modules/musicalwork/MusicalContextQuerySource.ts's
// own useMusicalContextsQuerySource. No server-side search forwarded
// (WorkExperienceBrowseAction has no searchPhrase-aware filter to forward
// it into) - FormSelect already filters the fetched page client-side
// against what's typed (see its own doc comment), and a resume
// realistically has a few dozen work experiences at most, not thousands.
export const useWorkExperiencesQuerySource = (params?: UseRemoteQuery) => {
  const query = useWorkExperienceBrowseActionQuery({
    qs: new WorkExperienceBrowseActionQueryParams({
      itemsPerPage: params?.query?.itemsPerPage ?? 200,
    }),
  });
  const items = ((query.data as any)?.data?.items ?? []) as WorkExperienceDto[];
  return {
    query: query as any,
    items,
    keyExtractor: (item: WorkExperienceDto) => item.uniqueId,
  };
};
