import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { MaterializedResumeDto } from "./MaterializedResumeDto";
import { MaterializedResumeOptionalDto } from "./MaterializedResumeOptionalDto";
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
 * Action to communicate with the action materializedResumeUpdate
 */
export type MaterializedResumeUpdateActionOptions = {
  queryKey?: unknown[];
  params: MaterializedResumeUpdateActionPathParameter;
  qs?: URLSearchParams;
};
export type MaterializedResumeUpdateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  MaterializedResumeUpdateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => MaterializedResumeDto;
  }>;
export const useMaterializedResumeUpdateAction = (
  options: MaterializedResumeUpdateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: MaterializedResumeOptionalDto) => {
    setCompleteState(false);
    return MaterializedResumeUpdateAction.Fetch(
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
 * Path parameters for MaterializedResumeUpdateAction
 */
export type MaterializedResumeUpdateActionPathParameter = {
  uniqueId: string;
};
/**
 * MaterializedResumeUpdateAction
 */
export class MaterializedResumeUpdateAction {
  //
  static URL = "/materializedResume/:uniqueId";
  static NewUrl = (
    params: MaterializedResumeUpdateActionPathParameter,
    qs?: URLSearchParams,
  ) => buildUrl(MaterializedResumeUpdateAction.URL, params, qs);
  static Method = "PATCH";
  static Fetch$ = async (
    params: MaterializedResumeUpdateActionPathParameter,
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<MaterializedResumeOptionalDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<MaterializedResumeDto>,
      MaterializedResumeOptionalDto,
      unknown
    >(
      overrideUrl ?? MaterializedResumeUpdateAction.NewUrl(params, qs),
      {
        method: MaterializedResumeUpdateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    params: MaterializedResumeUpdateActionPathParameter,
    init?: TypedRequestInit<MaterializedResumeOptionalDto, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => MaterializedResumeDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new MaterializedResumeDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new MaterializedResumeDto(item));
    const res = await MaterializedResumeUpdateAction.Fetch$(
      params,
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<MaterializedResumeDto>();
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
    name: "materializedResumeUpdate",
    cliName: "update",
    cliShort: "u",
    url: "/materializedResume/:uniqueId string",
    method: "patch",
    description:
      'Applies a partial update to a "materializedResume" row by uniqueId.',
    in: {
      dto: "MaterializedResumeOptionalDto",
    },
    out: {
      envelope: "GResponse",
      dto: "MaterializedResumeDto",
    },
  };
}
