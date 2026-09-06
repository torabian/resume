import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { TreasuryDto } from "./TreasuryDto";
import { TreasuryOptionalDto } from "./TreasuryOptionalDto";
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
 * Action to communicate with the action treasuryUpdate
 */
export type TreasuryUpdateActionOptions = {
  queryKey?: unknown[];
  params: TreasuryUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type TreasuryUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  TreasuryUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => TreasuryDto;
  }>;
export const useTreasuryUpdateAction = (
  options: TreasuryUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: TreasuryOptionalDto) => {
    setCompleteState(false);
    return TreasuryUpdateAction.Fetch(
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
 * Path parameters for TreasuryUpdateAction
 */
export type TreasuryUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * TreasuryUpdateAction
 */
export class TreasuryUpdateAction {
  //
  static URL = "/treasury/:uniqueId";
  static NewUrl = (
    params: TreasuryUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(TreasuryUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: TreasuryUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<TreasuryOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<TreasuryDto>, TreasuryOptionalDto, unknown>(
      overrideUrl ?? TreasuryUpdateAction.NewUrl(params, qs),
      {
        method: TreasuryUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: TreasuryUpdateActionPathParameter,
    init?: TypedRequestInit<TreasuryOptionalDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => TreasuryDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new TreasuryDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new TreasuryDto(item));
    const res = await TreasuryUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<TreasuryDto>();
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
    name: "treasuryUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/treasury/:uniqueId string",
    method: "patch",
    description: 'Applies a partial update to a "treasury" row by uniqueId.',
    in: {
      dto: "TreasuryOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "TreasuryDto",
    },
  };
}
