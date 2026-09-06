import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { SkillDto } from "./SkillDto";
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
 * Action to communicate with the action skillCreate
 */
export type SkillCreateActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type SkillCreateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  SkillCreateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => SkillDto;
  }>;
export const useSkillCreateAction = (
  options?: SkillCreateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: SkillDto) => {
    setCompleteState(false);
    return SkillCreateAction.Fetch(
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
 * SkillCreateAction
 */
export class SkillCreateAction {
  //
  static URL = "/skill";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(SkillCreateAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<SkillDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<SkillDto>, SkillDto, unknown>(
      overrideUrl ?? SkillCreateAction.NewUrl(qs),
      {
        method: SkillCreateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<SkillDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => SkillDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new SkillDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new SkillDto(item));
    const res = await SkillCreateAction.Fetch$(qs, ctx, init, overrideUrl);
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<SkillDto>();
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
    name: "skillCreate",
    cliName: "create",
    cliShort: "c",
    url: "/skill",
    method: "post",
    description: 'Creates a new "skill" row.',
    in: {
      dto: "SkillDto",
    },
    out: {
      envelope: "GResponse",
      dto: "SkillDto",
    },
  };
}
