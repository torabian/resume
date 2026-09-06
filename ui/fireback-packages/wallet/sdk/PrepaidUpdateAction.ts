import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { PrepaidDto } from "./PrepaidDto";
import { PrepaidOptionalDto } from "./PrepaidOptionalDto";
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
 * Action to communicate with the action prepaidUpdate
 */
export type PrepaidUpdateActionOptions = {
  queryKey?: unknown[];
  params: PrepaidUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type PrepaidUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  PrepaidUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => PrepaidDto;
  }>;
export const usePrepaidUpdateAction = (
  options: PrepaidUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: PrepaidOptionalDto) => {
    setCompleteState(false);
    return PrepaidUpdateAction.Fetch(
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
 * Path parameters for PrepaidUpdateAction
 */
export type PrepaidUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * PrepaidUpdateAction
 */
export class PrepaidUpdateAction {
  //
  static URL = "/prepaid/:uniqueId";
  static NewUrl = (
    params: PrepaidUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(PrepaidUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: PrepaidUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<PrepaidOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<PrepaidDto>, PrepaidOptionalDto, unknown>(
      overrideUrl ?? PrepaidUpdateAction.NewUrl(params, qs),
      {
        method: PrepaidUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: PrepaidUpdateActionPathParameter,
    init?: TypedRequestInit<PrepaidOptionalDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => PrepaidDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new PrepaidDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new PrepaidDto(item));
    const res = await PrepaidUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<PrepaidDto>();
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
    name: "prepaidUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/prepaid/:uniqueId string",
    method: "patch",
    description: 'Applies a partial update to a "prepaid" row by uniqueId.',
    in: {
      dto: "PrepaidOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "PrepaidDto",
    },
  };
}
