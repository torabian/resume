import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { ProjectDto } from "./ProjectDto";
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
 * Action to communicate with the action projectCreate
 */
export type ProjectCreateActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type ProjectCreateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  ProjectCreateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => ProjectDto;
  }>;
export const useProjectCreateAction = (
  options?: ProjectCreateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: ProjectDto) => {
    setCompleteState(false);
    return ProjectCreateAction.Fetch(
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
 * ProjectCreateAction
 */
export class ProjectCreateAction {
  //
  static URL = "/project";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(ProjectCreateAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<ProjectDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<ProjectDto>, ProjectDto, unknown>(
      overrideUrl ?? ProjectCreateAction.NewUrl(qs),
      {
        method: ProjectCreateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<ProjectDto, unknown>,
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
    const res = await ProjectCreateAction.Fetch$(qs, ctx, init, overrideUrl);
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
    name: "projectCreate",
    cliName: "create",
    cliShort: "c",
    url: "/project",
    method: "post",
    description: 'Creates a new "project" row.',
    in: {
      dto: "ProjectDto",
    },
    out: {
      envelope: "GResponse",
      dto: "ProjectDto",
    },
  };
}
