import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { SkillDto } from "./SkillDto";
import { SkillOptionalDto } from "./SkillOptionalDto";
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
 * Action to communicate with the action skillUpdate
 */
export type SkillUpdateActionOptions = {
  queryKey?: unknown[];
  params: SkillUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type SkillUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  SkillUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => SkillDto;
  }>;
export const useSkillUpdateAction = (
  options: SkillUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: SkillOptionalDto) => {
    setCompleteState(false);
    return SkillUpdateAction.Fetch(
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
 * Path parameters for SkillUpdateAction
 */
export type SkillUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * SkillUpdateAction
 */
export class SkillUpdateAction {
  //
  static URL = "/skill/:uniqueId";
  static NewUrl = (
    params: SkillUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(SkillUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: SkillUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<SkillOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<SkillDto>, SkillOptionalDto, unknown>(
      overrideUrl ?? SkillUpdateAction.NewUrl(params, qs),
      {
        method: SkillUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: SkillUpdateActionPathParameter,
    init?: TypedRequestInit<SkillOptionalDto, unknown>,
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
    const res = await SkillUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
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
    name: "skillUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/skill/:uniqueId string",
    method: "patch",
    description: 'Applies a partial update to a "skill" row by uniqueId.',
    in: {
      dto: "SkillOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "SkillDto",
    },
  };
}
