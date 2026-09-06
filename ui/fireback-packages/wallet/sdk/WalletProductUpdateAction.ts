import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { WalletProductDto } from "./WalletProductDto";
import { WalletProductOptionalDto } from "./WalletProductOptionalDto";
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
 * Action to communicate with the action walletProductUpdate
 */
export type WalletProductUpdateActionOptions = {
  queryKey?: unknown[];
  params: WalletProductUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type WalletProductUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  WalletProductUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => WalletProductDto;
  }>;
export const useWalletProductUpdateAction = (
  options: WalletProductUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: WalletProductOptionalDto) => {
    setCompleteState(false);
    return WalletProductUpdateAction.Fetch(
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
 * Path parameters for WalletProductUpdateAction
 */
export type WalletProductUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * WalletProductUpdateAction
 */
export class WalletProductUpdateAction {
  //
  static URL = "/walletProduct/:uniqueId";
  static NewUrl = (
    params: WalletProductUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(WalletProductUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: WalletProductUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<WalletProductOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<WalletProductDto>,
      WalletProductOptionalDto,
      unknown
    >(
      overrideUrl ?? WalletProductUpdateAction.NewUrl(params, qs),
      {
        method: WalletProductUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: WalletProductUpdateActionPathParameter,
    init?: TypedRequestInit<WalletProductOptionalDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => WalletProductDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new WalletProductDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new WalletProductDto(item));
    const res = await WalletProductUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<WalletProductDto>();
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
    name: "walletProductUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/walletProduct/:uniqueId string",
    method: "patch",
    description:
      'Applies a partial update to a "walletProduct" row by uniqueId.',
    in: {
      dto: "WalletProductOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "WalletProductDto",
    },
  };
}
