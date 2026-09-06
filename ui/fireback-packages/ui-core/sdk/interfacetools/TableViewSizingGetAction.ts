import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { TableViewSizingDto } from "./TableViewSizingDto";
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
 * Action to communicate with the action tableViewSizingGet
 */
export type TableViewSizingGetActionOptions = {
  queryKey?: unknown[];
  params: TableViewSizingGetActionPathParameter;
  qs?: URLSearchParams;
};
export type TableViewSizingGetActionQueryOptions = Omit<
  UseQueryOptions<unknown, unknown, GResponse<TableViewSizingDto>, unknown[]>,
  "queryKey"
> &
  TableViewSizingGetActionOptions &
  Partial<{
    creatorFn: (item: unknown) => TableViewSizingDto;
  }> & {
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
    ctx?: FetchxContext | null;
  };
export const useTableViewSizingGetActionQuery = (
  options: TableViewSizingGetActionQueryOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = () => {
    setCompleteState(false);
    return TableViewSizingGetAction.Fetch(
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
    queryKey: [TableViewSizingGetAction.NewUrl(options.params, options?.qs)],
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
export type TableViewSizingGetActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  TableViewSizingGetActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => TableViewSizingDto;
  }>;
export const useTableViewSizingGetAction = (
  options: TableViewSizingGetActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: unknown) => {
    setCompleteState(false);
    return TableViewSizingGetAction.Fetch(
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
 * Path parameters for TableViewSizingGetAction
 */
export type TableViewSizingGetActionPathParameter = {
  uniqueId: string;
};
/**
 * TableViewSizingGetAction
 */
export class TableViewSizingGetAction {
  //
  static URL = "/tableViewSizing/:uniqueId";
  static NewUrl = (
    params: TableViewSizingGetActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(TableViewSizingGetAction.URL, params, qs);
  static Method = "GET";
  static Fetch$ = async (
    params: TableViewSizingGetActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<unknown, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<TableViewSizingDto>, unknown, unknown>(
      overrideUrl ?? TableViewSizingGetAction.NewUrl(params, qs),
      {
        method: TableViewSizingGetAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: TableViewSizingGetActionPathParameter,
    init?: TypedRequestInit<unknown, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => TableViewSizingDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new TableViewSizingDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new TableViewSizingDto(item));
    const res = await TableViewSizingGetAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<TableViewSizingDto>();
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
    name: "tableViewSizingGet",
    cliName: "get",
    cliShort: "g",
    url: "/tableViewSizing/:uniqueId string",
    method: "get",
    description: 'Looks up a single "tableViewSizing" row by uniqueId.',
    out: {
      envelope: "GResponse",
      dto: "TableViewSizingDto",
    },
  };
}
