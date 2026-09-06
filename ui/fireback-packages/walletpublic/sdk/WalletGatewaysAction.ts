import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { URLSearchParamsX } from "@fireback/js-remote-ctx/common/URLSearchParamsX";
import { WalletGatewayViewDto } from "./WalletGatewayViewDto";
import { buildUrl } from "@fireback/js-remote-ctx/common/buildUrl";
import {
  fetchx,
  handleFetchResponse,
  type FetchxContext,
  type TypedRequestInit,
  type TypedResponse,
} from "@fireback/js-remote-ctx/common/fetchx";
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { useFetchxContext } from "@fireback/js-remote-ctx/react/useFetchx";
import { useState } from "react";
/**
 * Action to communicate with the action walletGateways
 */
export type WalletGatewaysActionOptions = {
  queryKey?: unknown[];
  qs?: WalletGatewaysActionQueryParams;
};
export type WalletGatewaysActionQueryOptions = Omit<
  UseQueryOptions<unknown, unknown, GResponse<WalletGatewayViewDto>, unknown[]>,
  "queryKey"
> &
  WalletGatewaysActionOptions &
  Partial<{
    creatorFn: (item: unknown) => WalletGatewayViewDto;
  }> & {
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
    ctx?: FetchxContext | null;
  };
export const useWalletGatewaysActionQuery = (
  options: WalletGatewaysActionQueryOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = () => {
    setCompleteState(false);
    return WalletGatewaysAction.Fetch(
      {
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
  const result = useQuery({
    queryKey: [WalletGatewaysAction.NewUrl(options?.qs)],
    queryFn: fn,
    ...(options || {}),
  });
  return {
    ...result,
    isCompleted,
    response,
  };
};
export type WalletGatewaysActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  WalletGatewaysActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => WalletGatewayViewDto;
  }>;
export const useWalletGatewaysAction = (
  options?: WalletGatewaysActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: unknown) => {
    setCompleteState(false);
    return WalletGatewaysAction.Fetch(
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
 * WalletGatewaysAction
 */
export class WalletGatewaysAction {
  //
  static URL = "/wallet/gateways";
  static NewUrl = (qs?: WalletGatewaysActionQueryParams) =>
    buildUrl(WalletGatewaysAction.URL, undefined, qs);
  static Method = "GET";
  static Fetch$ = async (
    qs?: WalletGatewaysActionQueryParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<unknown, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<WalletGatewayViewDto>, unknown, unknown>(
      overrideUrl ?? WalletGatewaysAction.NewUrl(qs),
      {
        method: WalletGatewaysAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<unknown, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => WalletGatewayViewDto) | undefined;
      qs?: WalletGatewaysActionQueryParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new WalletGatewayViewDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new WalletGatewayViewDto(item));
    const res = await WalletGatewaysAction.Fetch$(qs, ctx, init, overrideUrl);
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<WalletGatewayViewDto>();
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
    name: "walletGateways",
    cliShort: "gateways",
    url: "/wallet/gateways",
    method: "get",
    qs: [
      {
        name: "currency",
        type: "string?",
      },
    ],
    description:
      "Lists active payment gateways available to top up through, optionally filtered to ones that support a given currency - feeds a topup form's gateway picker. Logged-in-only, same as the rest of this module; never exposes gateway config/secrets (see walletGatewayView).",
    out: {
      envelope: "GResponse",
      dto: "WalletGatewayViewDto",
    },
  };
}
/**
 * WalletGatewaysActionQueryParams class
 * Auto-generated from EmiAction
 */
export class WalletGatewaysActionQueryParams extends URLSearchParamsX {
  /**
   *
   * @returns { any }
   */
  getCurrency() {
    return this.getTyped("currency", "any");
  }
  /**
   *
   * @param { any } value
   */
  setCurrency(value: any) {
    this.set("currency", value);
    return this;
  }
}
