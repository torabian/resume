import {
  useWorkspaceTypeBrowseActionQuery,
  WorkspaceTypeBrowseActionQueryParams,
} from "@fireback/manage/sdk/abac/WorkspaceTypeBrowseAction";
import { type WorkspaceTypeDto } from "@fireback/manage/sdk/abac/WorkspaceTypeDto";
import { type UseRemoteQuery } from "@fireback/ui-core/types/remoteQuery";

// Same {query, items, keyExtractor} adapter shape as useWorkspacesQuerySource, but for
// WorkspaceType - used by WorkspaceEditForm.tsx's "Workspace type" picker, so a
// workspace can't be created (or edited) without one being chosen (see
// WorkspaceCreateAction/WorkspaceActions.go, which now rejects a blank typeId too).
export const useWorkspaceTypesQuerySource = (params?: UseRemoteQuery) => {
  const query = useWorkspaceTypeBrowseActionQuery({
    qs: new WorkspaceTypeBrowseActionQueryParams({
      itemsPerPage: params?.query?.itemsPerPage ?? 200,
      searchPhrase: params?.query?.searchPhrase || undefined,
    }),
  });
  const items = ((query.data as any)?.data?.items ?? []) as WorkspaceTypeDto[];
  return {
    query: query as any,
    items,
    keyExtractor: (item: WorkspaceTypeDto) => item.uniqueId,
  };
};
