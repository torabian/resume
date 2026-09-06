import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { RegionalContentDefinitionDto } from "./RegionalContentDefinitionDto";
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
 * Action to communicate with the action regionalContentDefinitionCreate
 */
export type RegionalContentDefinitionCreateActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type RegionalContentDefinitionCreateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  RegionalContentDefinitionCreateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => RegionalContentDefinitionDto;
  }>;
export const useRegionalContentDefinitionCreateAction = (
  options?: RegionalContentDefinitionCreateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: RegionalContentDefinitionDto) => {
    setCompleteState(false);
    return RegionalContentDefinitionCreateAction.Fetch(
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
 * RegionalContentDefinitionCreateAction
 */
export class RegionalContentDefinitionCreateAction {
  //
  static URL = "/regionalContentDefinition";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(RegionalContentDefinitionCreateAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<RegionalContentDefinitionDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<RegionalContentDefinitionDto>,
      RegionalContentDefinitionDto,
      unknown
    >(
      overrideUrl ?? RegionalContentDefinitionCreateAction.NewUrl(qs),
      {
        method: RegionalContentDefinitionCreateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<RegionalContentDefinitionDto, unknown>,
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
    const res = await RegionalContentDefinitionCreateAction.Fetch$(
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
    name: "regionalContentDefinitionCreate",
    cliName: "create",
    cliShort: "c",
    url: "/regionalContentDefinition",
    method: "post",
    description: 'Creates a new "regionalContentDefinition" row.',
    in: {
      dto: "RegionalContentDefinitionDto",
    },
    out: {
      envelope: "GResponse",
      dto: "RegionalContentDefinitionDto",
    },
  };
}
