import { EducationDto } from "./EducationDto";
import { EducationOptionalDto } from "./EducationOptionalDto";
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
 * Action to communicate with the action educationUpdate
 */
export type EducationUpdateActionOptions = {
  queryKey?: unknown[];
  params: EducationUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type EducationUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  EducationUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => EducationDto;
  }>;
export const useEducationUpdateAction = (
  options: EducationUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: EducationOptionalDto) => {
    setCompleteState(false);
    return EducationUpdateAction.Fetch(
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
 * Path parameters for EducationUpdateAction
 */
export type EducationUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * EducationUpdateAction
 */
export class EducationUpdateAction {
  //
  static URL = "/education/:uniqueId";
  static NewUrl = (
    params: EducationUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(EducationUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: EducationUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<EducationOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<EducationDto>, EducationOptionalDto, unknown>(
      overrideUrl ?? EducationUpdateAction.NewUrl(params, qs),
      {
        method: EducationUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: EducationUpdateActionPathParameter,
    init?: TypedRequestInit<EducationOptionalDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => EducationDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new EducationDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new EducationDto(item));
    const res = await EducationUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<EducationDto>();
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
    name: "educationUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/education/:uniqueId string",
    method: "patch",
    description: 'Applies a partial update to a "education" row by uniqueId.',
    in: {
      dto: "EducationOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "EducationDto",
    },
  };
}
