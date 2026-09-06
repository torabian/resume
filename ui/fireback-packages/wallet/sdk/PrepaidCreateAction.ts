import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { PrepaidDto } from "./PrepaidDto";
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
 * Action to communicate with the action prepaidCreate
 */
export type PrepaidCreateActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type PrepaidCreateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  PrepaidCreateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => PrepaidDto;
  }>;
export const usePrepaidCreateAction = (
  options?: PrepaidCreateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: PrepaidDto) => {
    setCompleteState(false);
    return PrepaidCreateAction.Fetch(
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
 * PrepaidCreateAction
 */
export class PrepaidCreateAction {
  //
  static URL = "/prepaid";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(PrepaidCreateAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<PrepaidDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<PrepaidDto>, PrepaidDto, unknown>(
      overrideUrl ?? PrepaidCreateAction.NewUrl(qs),
      {
        method: PrepaidCreateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<PrepaidDto, unknown>,
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
    const res = await PrepaidCreateAction.Fetch$(qs, ctx, init, overrideUrl);
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
    name: "prepaidCreate",
    cliName: "create",
    cliShort: "c",
    url: "/prepaid",
    method: "post",
    description: 'Creates a new "prepaid" row.',
    in: {
      dto: "PrepaidDto",
    },
    out: {
      envelope: "GResponse",
      dto: "PrepaidDto",
    },
  };
}
