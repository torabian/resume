import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { ResumeDto } from "./ResumeDto";
import { ResumeOptionalDto } from "./ResumeOptionalDto";
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
 * Action to communicate with the action resumeUpdate
 */
export type ResumeUpdateActionOptions = {
  queryKey?: unknown[];
  params: ResumeUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type ResumeUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  ResumeUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => ResumeDto;
  }>;
export const useResumeUpdateAction = (
  options: ResumeUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: ResumeOptionalDto) => {
    setCompleteState(false);
    return ResumeUpdateAction.Fetch(
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
 * Path parameters for ResumeUpdateAction
 */
export type ResumeUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * ResumeUpdateAction
 */
export class ResumeUpdateAction {
  //
  static URL = "/resume/:uniqueId";
  static NewUrl = (
    params: ResumeUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(ResumeUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: ResumeUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<ResumeOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<ResumeDto>, ResumeOptionalDto, unknown>(
      overrideUrl ?? ResumeUpdateAction.NewUrl(params, qs),
      {
        method: ResumeUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: ResumeUpdateActionPathParameter,
    init?: TypedRequestInit<ResumeOptionalDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => ResumeDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new ResumeDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new ResumeDto(item));
    const res = await ResumeUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<ResumeDto>();
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
    name: "resumeUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/resume/:uniqueId string",
    method: "patch",
    description: 'Applies a partial update to a "resume" row by uniqueId.',
    in: {
      dto: "ResumeOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "ResumeDto",
    },
  };
}
