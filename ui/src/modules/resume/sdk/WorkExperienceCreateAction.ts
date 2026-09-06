import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { WorkExperienceDto } from "./WorkExperienceDto";
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
 * Action to communicate with the action workExperienceCreate
 */
export type WorkExperienceCreateActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type WorkExperienceCreateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  WorkExperienceCreateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => WorkExperienceDto;
  }>;
export const useWorkExperienceCreateAction = (
  options?: WorkExperienceCreateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: WorkExperienceDto) => {
    setCompleteState(false);
    return WorkExperienceCreateAction.Fetch(
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
 * WorkExperienceCreateAction
 */
export class WorkExperienceCreateAction {
  //
  static URL = "/workExperience";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(WorkExperienceCreateAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<WorkExperienceDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<WorkExperienceDto>, WorkExperienceDto, unknown>(
      overrideUrl ?? WorkExperienceCreateAction.NewUrl(qs),
      {
        method: WorkExperienceCreateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<WorkExperienceDto, unknown>,
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
    const res = await WorkExperienceCreateAction.Fetch$(
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
    name: "workExperienceCreate",
    cliName: "create",
    cliShort: "c",
    url: "/workExperience",
    method: "post",
    description: 'Creates a new "workExperience" row.',
    in: {
      dto: "WorkExperienceDto",
    },
    out: {
      envelope: "GResponse",
      dto: "WorkExperienceDto",
    },
  };
}
