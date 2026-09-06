import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { TargetPositionDto } from "./TargetPositionDto";
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
 * Action to communicate with the action targetPositionCreate
 */
export type TargetPositionCreateActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type TargetPositionCreateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  TargetPositionCreateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => TargetPositionDto;
  }>;
export const useTargetPositionCreateAction = (
  options?: TargetPositionCreateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: TargetPositionDto) => {
    setCompleteState(false);
    return TargetPositionCreateAction.Fetch(
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
 * TargetPositionCreateAction
 */
export class TargetPositionCreateAction {
  //
  static URL = "/targetPosition";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(TargetPositionCreateAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<TargetPositionDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<TargetPositionDto>, TargetPositionDto, unknown>(
      overrideUrl ?? TargetPositionCreateAction.NewUrl(qs),
      {
        method: TargetPositionCreateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<TargetPositionDto, unknown>,
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
    const res = await TargetPositionCreateAction.Fetch$(
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
    name: "targetPositionCreate",
    cliName: "create",
    cliShort: "c",
    url: "/targetPosition",
    method: "post",
    description: 'Creates a new "targetPosition" row.',
    in: {
      dto: "TargetPositionDto",
    },
    out: {
      envelope: "GResponse",
      dto: "TargetPositionDto",
    },
  };
}
