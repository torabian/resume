import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { WorkExperienceDto } from "./WorkExperienceDto";
import { WorkExperienceOptionalDto } from "./WorkExperienceOptionalDto";
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
 * Action to communicate with the action workExperienceUpdate
 */
export type WorkExperienceUpdateActionOptions = {
  queryKey?: unknown[];
  params: WorkExperienceUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type WorkExperienceUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  WorkExperienceUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => WorkExperienceDto;
  }>;
export const useWorkExperienceUpdateAction = (
  options: WorkExperienceUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: WorkExperienceOptionalDto) => {
    setCompleteState(false);
    return WorkExperienceUpdateAction.Fetch(
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
 * Path parameters for WorkExperienceUpdateAction
 */
export type WorkExperienceUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * WorkExperienceUpdateAction
 */
export class WorkExperienceUpdateAction {
  //
  static URL = "/workExperience/:uniqueId";
  static NewUrl = (
    params: WorkExperienceUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(WorkExperienceUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: WorkExperienceUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<WorkExperienceOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<WorkExperienceDto>,
      WorkExperienceOptionalDto,
      unknown
    >(
      overrideUrl ?? WorkExperienceUpdateAction.NewUrl(params, qs),
      {
        method: WorkExperienceUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: WorkExperienceUpdateActionPathParameter,
    init?: TypedRequestInit<WorkExperienceOptionalDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => WorkExperienceDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new WorkExperienceDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new WorkExperienceDto(item));
    const res = await WorkExperienceUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<WorkExperienceDto>();
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
    name: "workExperienceUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/workExperience/:uniqueId string",
    method: "patch",
    description:
      'Applies a partial update to a "workExperience" row by uniqueId.',
    in: {
      dto: "WorkExperienceOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "WorkExperienceDto",
    },
  };
}
