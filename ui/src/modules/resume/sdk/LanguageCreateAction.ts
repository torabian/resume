import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { LanguageDto } from "./LanguageDto";
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
 * Action to communicate with the action languageCreate
 */
export type LanguageCreateActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type LanguageCreateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  LanguageCreateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => LanguageDto;
  }>;
export const useLanguageCreateAction = (
  options?: LanguageCreateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: LanguageDto) => {
    setCompleteState(false);
    return LanguageCreateAction.Fetch(
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
 * LanguageCreateAction
 */
export class LanguageCreateAction {
  //
  static URL = "/language";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(LanguageCreateAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<LanguageDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<LanguageDto>, LanguageDto, unknown>(
      overrideUrl ?? LanguageCreateAction.NewUrl(qs),
      {
        method: LanguageCreateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<LanguageDto, unknown>,
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
    const res = await LanguageCreateAction.Fetch$(qs, ctx, init, overrideUrl);
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
    name: "languageCreate",
    cliName: "create",
    cliShort: "c",
    url: "/language",
    method: "post",
    description: 'Creates a new "language" row.',
    in: {
      dto: "LanguageDto",
    },
    out: {
      envelope: "GResponse",
      dto: "LanguageDto",
    },
  };
}
