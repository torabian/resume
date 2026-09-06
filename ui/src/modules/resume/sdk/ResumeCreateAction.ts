import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { ResumeDto } from "./ResumeDto";
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
 * Action to communicate with the action resumeCreate
 */
export type ResumeCreateActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type ResumeCreateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  ResumeCreateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => ResumeDto;
  }>;
export const useResumeCreateAction = (
  options?: ResumeCreateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: ResumeDto) => {
    setCompleteState(false);
    return ResumeCreateAction.Fetch(
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
 * ResumeCreateAction
 */
export class ResumeCreateAction {
  //
  static URL = "/resume";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(ResumeCreateAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<ResumeDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<ResumeDto>, ResumeDto, unknown>(
      overrideUrl ?? ResumeCreateAction.NewUrl(qs),
      {
        method: ResumeCreateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<ResumeDto, unknown>,
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
    const res = await ResumeCreateAction.Fetch$(qs, ctx, init, overrideUrl);
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
    name: "resumeCreate",
    cliName: "create",
    cliShort: "c",
    url: "/resume",
    method: "post",
    description: 'Creates a new "resume" row.',
    in: {
      dto: "ResumeDto",
    },
    out: {
      envelope: "GResponse",
      dto: "ResumeDto",
    },
  };
}
