import { CompanyDto } from "./CompanyDto";
import { CompanyOptionalDto } from "./CompanyOptionalDto";
import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
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
 * Action to communicate with the action companyUpdate
 */
export type CompanyUpdateActionOptions = {
  queryKey?: unknown[];
  params: CompanyUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type CompanyUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  CompanyUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => CompanyDto;
  }>;
export const useCompanyUpdateAction = (
  options: CompanyUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: CompanyOptionalDto) => {
    setCompleteState(false);
    return CompanyUpdateAction.Fetch(
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
 * Path parameters for CompanyUpdateAction
 */
export type CompanyUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * CompanyUpdateAction
 */
export class CompanyUpdateAction {
  //
  static URL = "/company/:uniqueId";
  static NewUrl = (
    params: CompanyUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(CompanyUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: CompanyUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<CompanyOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<CompanyDto>, CompanyOptionalDto, unknown>(
      overrideUrl ?? CompanyUpdateAction.NewUrl(params, qs),
      {
        method: CompanyUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: CompanyUpdateActionPathParameter,
    init?: TypedRequestInit<CompanyOptionalDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => CompanyDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new CompanyDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new CompanyDto(item));
    const res = await CompanyUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<CompanyDto>();
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
    name: "companyUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/company/:uniqueId string",
    method: "patch",
    description: 'Applies a partial update to a "company" row by uniqueId.',
    in: {
      dto: "CompanyOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "CompanyDto",
    },
  };
}
