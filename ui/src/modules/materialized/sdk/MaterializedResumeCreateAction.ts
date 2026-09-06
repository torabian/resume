import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { MaterializedResumeDto } from "./MaterializedResumeDto";
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
 * Action to communicate with the action materializedResumeCreate
 */
export type MaterializedResumeCreateActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type MaterializedResumeCreateActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  MaterializedResumeCreateActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => MaterializedResumeDto;
  }>;
export const useMaterializedResumeCreateAction = (
  options?: MaterializedResumeCreateActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: MaterializedResumeDto) => {
    setCompleteState(false);
    return MaterializedResumeCreateAction.Fetch(
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
 * MaterializedResumeCreateAction
 */
export class MaterializedResumeCreateAction {
  //
  static URL = "/materializedResume";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(MaterializedResumeCreateAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<MaterializedResumeDto, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<MaterializedResumeDto>,
      MaterializedResumeDto,
      unknown
    >(
      overrideUrl ?? MaterializedResumeCreateAction.NewUrl(qs),
      {
        method: MaterializedResumeCreateAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<MaterializedResumeDto, unknown>,
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
    const res = await MaterializedResumeCreateAction.Fetch$(
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
    name: "materializedResumeCreate",
    cliName: "create",
    cliShort: "c",
    url: "/materializedResume",
    method: "post",
    description: 'Creates a new "materializedResume" row.',
    in: {
      dto: "MaterializedResumeDto",
    },
    out: {
      envelope: "GResponse",
      dto: "MaterializedResumeDto",
    },
  };
}
