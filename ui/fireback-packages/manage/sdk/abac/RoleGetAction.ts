import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { RoleDto } from "./RoleDto";
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
 * Action to communicate with the action roleGet
 */
export type RoleGetActionOptions = {
  queryKey?: unknown[];
  params: RoleGetActionPathParameter;
  qs?: URLSearchParams;
};
export type RoleGetActionQueryOptions = Omit<
  UseQueryOptions<unknown, unknown, GResponse<RoleDto>, unknown[]>,
  "queryKey"
> &
  RoleGetActionOptions &
  Partial<{
    creatorFn: (item: unknown) => RoleDto;
  }> & {
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
    ctx?: FetchxContext | null;
  };
export const useRoleGetActionQuery = (options: RoleGetActionQueryOptions) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = () => {
    setCompleteState(false);
    return RoleGetAction.Fetch(
      options.params,
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
    queryKey: [RoleGetAction.NewUrl(options.params, options?.qs)],
    queryFn: fn,
    // Bug fix: a "new"/create screen has no uniqueId (or other path param) yet -
    // every *EntityManager.tsx across this app builds this action's own
    // getSingleHook unconditionally (React's rules of hooks - a hook can never be
    // called conditionally), which used to mean this fired for real, every time,
    // against a URL with a literal "undefined" in place of the missing param (e.g.
    // GET /treasury/undefined) - a wasted request and, in a route path built with
    // this before uniqueId resolves, a genuinely wrong one. Defaulting enabled to
    // false whenever any path parameter is missing/empty fixes this the same way
    // for every generated get-by-id hook at once - options.enabled below still
    // wins if a caller explicitly opts back in.
    //
    // Also checks the *string* "undefined"/"null", not just the real values -
    // a caller building params off something already coerced to text before
    // this hook ever sees it (e.g. a router param read via a JS template
    // literal, or String(value) upstream) hands this a param that's
    // technically a non-empty string, but is exactly the same "nothing to
    // fetch yet" case as the real undefined/null it stringified from.
    enabled: !Object.values(options.params || {}).some(
      (v) =>
        v === undefined ||
        v === null ||
        v === "" ||
        v === "undefined" ||
        v === "null",
    ),
    ...(options || {}),
  });
  return {
    ...result,
    isCompleted,
    response,
  };
};
export type RoleGetActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  RoleGetActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => RoleDto;
  }>;
export const useRoleGetAction = (options: RoleGetActionMutationOptions) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: unknown) => {
    setCompleteState(false);
    return RoleGetAction.Fetch(
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
 * Path parameters for RoleGetAction
 */
export type RoleGetActionPathParameter = {
  uniqueId: string;
};
/**
 * RoleGetAction
 */
export class RoleGetAction {
  //
  static URL = "/role/:uniqueId";
  static NewUrl = (params: RoleGetActionPathParameter, qs?: URLSearchParams) =>
    buildUrl(RoleGetAction.URL, params, qs);
  static Method = "GET";
  static Fetch$ = async (
    params: RoleGetActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<unknown, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<RoleDto>, unknown, unknown>(
      overrideUrl ?? RoleGetAction.NewUrl(params, qs),
      {
        method: RoleGetAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: RoleGetActionPathParameter,
    init?: TypedRequestInit<unknown, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => RoleDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new RoleDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new RoleDto(item));
    const res = await RoleGetAction.Fetch$(params, qs, ctx, init, overrideUrl);
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<RoleDto>();
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
    name: "roleGet",
    cliName: "get",
    cliShort: "g",
    url: "/role/:uniqueId string",
    method: "get",
    description: 'Looks up a single "role" row by uniqueId.',
    out: {
      envelope: "GResponse",
      dto: "RoleDto",
    },
  };
}
