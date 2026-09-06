import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { RegionalContentDefinitionDto } from "./RegionalContentDefinitionDto";
import { RegionalContentDefinitionOptionalDto } from "./RegionalContentDefinitionOptionalDto";
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
 * Action to communicate with the action regionalContentDefinitionUpdate
 */
export type RegionalContentDefinitionUpdateActionOptions = {
  queryKey?: unknown[];
  params: RegionalContentDefinitionUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type RegionalContentDefinitionUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  RegionalContentDefinitionUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => RegionalContentDefinitionDto;
  }>;
export const useRegionalContentDefinitionUpdateAction = (
  options: RegionalContentDefinitionUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: RegionalContentDefinitionOptionalDto) => {
    setCompleteState(false);
    return RegionalContentDefinitionUpdateAction.Fetch(
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
 * Path parameters for RegionalContentDefinitionUpdateAction
 */
export type RegionalContentDefinitionUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * RegionalContentDefinitionUpdateAction
 */
export class RegionalContentDefinitionUpdateAction {
  //
  static URL = "/regionalContentDefinition/:uniqueId";
  static NewUrl = (
    params: RegionalContentDefinitionUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(RegionalContentDefinitionUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: RegionalContentDefinitionUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<RegionalContentDefinitionOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<RegionalContentDefinitionDto>,
      RegionalContentDefinitionOptionalDto,
      unknown
    >(
      overrideUrl ?? RegionalContentDefinitionUpdateAction.NewUrl(params, qs),
      {
        method: RegionalContentDefinitionUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: RegionalContentDefinitionUpdateActionPathParameter,
    init?: TypedRequestInit<RegionalContentDefinitionOptionalDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => RegionalContentDefinitionDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new RegionalContentDefinitionDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new RegionalContentDefinitionDto(item));
    const res = await RegionalContentDefinitionUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<RegionalContentDefinitionDto>();
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
    name: "regionalContentDefinitionUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/regionalContentDefinition/:uniqueId string",
    method: "patch",
    description:
      'Applies a partial update to a "regionalContentDefinition" row by uniqueId.',
    in: {
      dto: "RegionalContentDefinitionOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "RegionalContentDefinitionDto",
    },
  };
}
