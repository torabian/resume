import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { WalletProductDto } from "./WalletProductDto";
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
 * Action to communicate with the action walletProductCreate
 */
export type WalletProductCreateActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type WalletProductCreateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  WalletProductCreateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => WalletProductDto;
  }>;
export const useWalletProductCreateAction = (
  options?: WalletProductCreateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: WalletProductDto) => {
    setCompleteState(false);
    return WalletProductCreateAction.Fetch(
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
 * WalletProductCreateAction
 */
export class WalletProductCreateAction {
  //
  static URL = "/walletProduct";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(WalletProductCreateAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<WalletProductDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<WalletProductDto>, WalletProductDto, unknown>(
      overrideUrl ?? WalletProductCreateAction.NewUrl(qs),
      {
        method: WalletProductCreateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<WalletProductDto, unknown>,
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
    const res = await WalletProductCreateAction.Fetch$(
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
    name: "walletProductCreate",
    cliName: "create",
    cliShort: "c",
    url: "/walletProduct",
    method: "post",
    description: 'Creates a new "walletProduct" row.',
    in: {
      dto: "WalletProductDto",
    },
    out: {
      envelope: "GResponse",
      dto: "WalletProductDto",
    },
  };
}
