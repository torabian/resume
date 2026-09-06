import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { TargetPositionDto } from "./TargetPositionDto";
import { TargetPositionOptionalDto } from "./TargetPositionOptionalDto";
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
 * Action to communicate with the action targetPositionUpdate
 */
export type TargetPositionUpdateActionOptions = {
  queryKey?: unknown[];
  params: TargetPositionUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type TargetPositionUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  TargetPositionUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => TargetPositionDto;
  }>;
export const useTargetPositionUpdateAction = (
  options: TargetPositionUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: TargetPositionOptionalDto) => {
    setCompleteState(false);
    return TargetPositionUpdateAction.Fetch(
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
 * Path parameters for TargetPositionUpdateAction
 */
export type TargetPositionUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * TargetPositionUpdateAction
 */
export class TargetPositionUpdateAction {
  //
  static URL = "/targetPosition/:uniqueId";
  static NewUrl = (
    params: TargetPositionUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(TargetPositionUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: TargetPositionUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<TargetPositionOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<TargetPositionDto>,
      TargetPositionOptionalDto,
      unknown
    >(
      overrideUrl ?? TargetPositionUpdateAction.NewUrl(params, qs),
      {
        method: TargetPositionUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: TargetPositionUpdateActionPathParameter,
    init?: TypedRequestInit<TargetPositionOptionalDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => TargetPositionDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new TargetPositionDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new TargetPositionDto(item));
    const res = await TargetPositionUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<TargetPositionDto>();
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
    name: "targetPositionUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/targetPosition/:uniqueId string",
    method: "patch",
    description:
      'Applies a partial update to a "targetPosition" row by uniqueId.',
    in: {
      dto: "TargetPositionOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "TargetPositionDto",
    },
  };
}
