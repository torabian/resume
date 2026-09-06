import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { ProjectDto } from "./ProjectDto";
import { ProjectOptionalDto } from "./ProjectOptionalDto";
import { buildUrl } from "@fireback/js-remote-ctx/common/buildUrl";
import {
  fetchx,
  handleFetchResponse,
  type FetchxContext,
  type TypedRequestInit,
  type TypedResponse,
} from "@fireback/js-remote-ctx/common/fetchx";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useFetchxContext } from "@fireback/js-remote-ctx/react/useFetchx";
import { useState } from "react";
/**
 * Action to communicate with the action projectUpdate
 */
export type ProjectUpdateActionOptions = {
  queryKey?: unknown[];
  params: ProjectUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type ProjectUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  ProjectUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => ProjectDto;
  }>;
export const useProjectUpdateAction = (
  options: ProjectUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: ProjectOptionalDto) => {
    setCompleteState(false);
    return ProjectUpdateAction.Fetch(
      options.params,
      {
        body,
        headers: options?.headers,
      },
      {
        creatorFn: options?.creatorFn,
        qs: options?.qs,
        ctx,
        onMessage: options?.onMessage,
        overrideUrl: options?.overrideUrl,
      },
    ).then((x) => {
      x.done.then(() => {
        setCompleteState(true);
      });
      setResponse(x.response);
      return x.response.result;
    });
  };
  const result = useMutation({
    mutationFn: fn,
    ...(options || {}),
  });
  return {
    ...result,
    isCompleted,
    response,
  };
};
/**
 * Path parameters for ProjectUpdateAction
 */
export type ProjectUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * ProjectUpdateAction
 */
export class ProjectUpdateAction {
  //
  static URL = "/project/:uniqueId";
  static NewUrl = (
    params: ProjectUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(ProjectUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: ProjectUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<ProjectOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<ProjectDto>, ProjectOptionalDto, unknown>(
      overrideUrl ?? ProjectUpdateAction.NewUrl(params, qs),
      {
        method: ProjectUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: ProjectUpdateActionPathParameter,
    init?: TypedRequestInit<ProjectOptionalDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => ProjectDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new ProjectDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new ProjectDto(item));
    const res = await ProjectUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<ProjectDto>();
        if (creatorFn) {
          resp.setCreator(creatorFn);
        }
        resp.inject(data);
        return resp;
      },
      onMessage,
      init?.signal,
    );
  };
  static Definition = {
    name: "projectUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/project/:uniqueId string",
    method: "patch",
    description: 'Applies a partial update to a "project" row by uniqueId.',
    in: {
      dto: "ProjectOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "ProjectDto",
    },
  };
}
