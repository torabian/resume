import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { LanguageDto } from "./LanguageDto";
import { LanguageOptionalDto } from "./LanguageOptionalDto";
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
 * Action to communicate with the action languageUpdate
 */
export type LanguageUpdateActionOptions = {
  queryKey?: unknown[];
  params: LanguageUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type LanguageUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  LanguageUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => LanguageDto;
  }>;
export const useLanguageUpdateAction = (
  options: LanguageUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: LanguageOptionalDto) => {
    setCompleteState(false);
    return LanguageUpdateAction.Fetch(
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
 * Path parameters for LanguageUpdateAction
 */
export type LanguageUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * LanguageUpdateAction
 */
export class LanguageUpdateAction {
  //
  static URL = "/language/:uniqueId";
  static NewUrl = (
    params: LanguageUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(LanguageUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: LanguageUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<LanguageOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<LanguageDto>, LanguageOptionalDto, unknown>(
      overrideUrl ?? LanguageUpdateAction.NewUrl(params, qs),
      {
        method: LanguageUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: LanguageUpdateActionPathParameter,
    init?: TypedRequestInit<LanguageOptionalDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => LanguageDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new LanguageDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new LanguageDto(item));
    const res = await LanguageUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<LanguageDto>();
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
    name: "languageUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/language/:uniqueId string",
    method: "patch",
    description: 'Applies a partial update to a "language" row by uniqueId.',
    in: {
      dto: "LanguageOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "LanguageDto",
    },
  };
}
