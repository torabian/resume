import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { buildUrl } from "@fireback/js-remote-ctx/common/buildUrl";
import {
  fetchx,
  handleFetchResponse,
  type FetchxContext,
  type PartialDeep,
  type TypedRequestInit,
  type TypedResponse,
} from "@fireback/js-remote-ctx/common/fetchx";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useFetchxContext } from "@fireback/js-remote-ctx/react/useFetchx";
import { useState } from "react";
/**
 * Action to communicate with the action RemoveWorkspaceMember
 */
export type RemoveWorkspaceMemberActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type RemoveWorkspaceMemberActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  RemoveWorkspaceMemberActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => RemoveWorkspaceMemberActionRes;
  }>;
export const useRemoveWorkspaceMemberAction = (
  options?: RemoveWorkspaceMemberActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: RemoveWorkspaceMemberActionReq) => {
    setCompleteState(false);
    return RemoveWorkspaceMemberAction.Fetch(
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
 * RemoveWorkspaceMemberAction
 */
export class RemoveWorkspaceMemberAction {
  //
  static URL = "/workspace/members/remove";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(RemoveWorkspaceMemberAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<RemoveWorkspaceMemberActionReq, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<RemoveWorkspaceMemberActionRes>,
      RemoveWorkspaceMemberActionReq,
      unknown
    >(
      overrideUrl ?? RemoveWorkspaceMemberAction.NewUrl(qs),
      {
        method: RemoveWorkspaceMemberAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<RemoveWorkspaceMemberActionReq, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?:
        | ((item: unknown) => RemoveWorkspaceMemberActionRes)
        | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new RemoveWorkspaceMemberActionRes(item),
    },
  ) => {
    creatorFn =
      creatorFn || ((item) => new RemoveWorkspaceMemberActionRes(item));
    const res = await RemoveWorkspaceMemberAction.Fetch$(
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<RemoveWorkspaceMemberActionRes>();
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
    name: "RemoveWorkspaceMember",
    cliName: "remove-member",
    url: "/workspace/members/remove",
    method: "post",
    description:
      "Removes an existing member - and their role assignment - from the caller's own current workspace. Self-service, not root only (compare RemoveUserFromWorkspace, which is the root-only equivalent for an arbitrary workspaceId). A member cannot remove their own membership this way.",
    in: {
      fields: [
        {
          name: "userId",
          description: "UniqueId of the member to remove.",
          type: "string",
          tags: {
            validate: "required",
          },
        },
      ],
    },
    out: {
      envelope: "GResponse",
      fields: [
        {
          name: "uniqueId",
          description: "UniqueId of the removed userWorkspace membership row.",
          type: "string",
        },
        {
          name: "userId",
          type: "string",
        },
      ],
    },
  };
}
/**
 * The base class definition for removeWorkspaceMemberActionReq
 **/
export class RemoveWorkspaceMemberActionReq {
  /**
   * UniqueId of the member to remove.
   * @type {string}
   **/
  #userId: string = "";
  /**
   * UniqueId of the member to remove.
   * @returns {string}
   **/
  get userId() {
    return this.#userId;
  }
  /**
   * UniqueId of the member to remove.
   * @type {string}
   **/
  set userId(value: string) {
    this.#userId = String(value);
  }
  setUserId(value: string) {
    this.userId = value;
    return this;
  }
  constructor(data: unknown = undefined) {
    if (data === null || data === undefined) {
      return;
    }
    if (typeof data === "string") {
      this.applyFromObject(JSON.parse(data));
    } else if (this.#isJsonAppliable(data)) {
      this.applyFromObject(data);
    } else {
      throw new Error(
        "Instance cannot be created on an unknown value, check the content being passed. got: " +
          typeof data,
      );
    }
  }
  #isJsonAppliable(obj: unknown) {
    const g = globalThis as unknown as { Buffer: any; Blob: any };
    const isBuffer =
      typeof g.Buffer !== "undefined" &&
      typeof g.Buffer.isBuffer === "function" &&
      g.Buffer.isBuffer(obj);
    const isBlob = typeof g.Blob !== "undefined" && obj instanceof g.Blob;
    return (
      obj &&
      typeof obj === "object" &&
      !Array.isArray(obj) &&
      !isBuffer &&
      !(obj instanceof ArrayBuffer) &&
      !isBlob
    );
  }
  /**
   * casts the fields of a javascript object into the class properties one by one
   **/
  applyFromObject(data = {}) {
    const d = data as Partial<RemoveWorkspaceMemberActionReq>;
    if (d.userId !== undefined) {
      this.userId = d.userId;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      userId: this.#userId,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      userId: "userId",
    };
  }
  /**
   * Creates an instance of RemoveWorkspaceMemberActionReq, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: RemoveWorkspaceMemberActionReqType) {
    return new RemoveWorkspaceMemberActionReq(possibleDtoObject);
  }
  /**
   * Creates an instance of RemoveWorkspaceMemberActionReq, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(
    partialDtoObject: PartialDeep<RemoveWorkspaceMemberActionReqType>,
  ) {
    return new RemoveWorkspaceMemberActionReq(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<RemoveWorkspaceMemberActionReqType>,
  ): InstanceType<typeof RemoveWorkspaceMemberActionReq> {
    return new RemoveWorkspaceMemberActionReq({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof RemoveWorkspaceMemberActionReq> {
    return new RemoveWorkspaceMemberActionReq(this.toJSON());
  }
}
export abstract class RemoveWorkspaceMemberActionReqFactory {
  abstract create(data: unknown): RemoveWorkspaceMemberActionReq;
}
/**
 * The base type definition for removeWorkspaceMemberActionReq
 **/
export type RemoveWorkspaceMemberActionReqType = {
  /**
   * UniqueId of the member to remove.
   * @type {string}
   **/
  userId: string;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RemoveWorkspaceMemberActionReqType {}
/**
 * The base class definition for removeWorkspaceMemberActionRes
 **/
export class RemoveWorkspaceMemberActionRes {
  /**
   * UniqueId of the removed userWorkspace membership row.
   * @type {string}
   **/
  #uniqueId: string = "";
  /**
   * UniqueId of the removed userWorkspace membership row.
   * @returns {string}
   **/
  get uniqueId() {
    return this.#uniqueId;
  }
  /**
   * UniqueId of the removed userWorkspace membership row.
   * @type {string}
   **/
  set uniqueId(value: string) {
    this.#uniqueId = String(value);
  }
  setUniqueId(value: string) {
    this.uniqueId = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #userId: string = "";
  /**
   *
   * @returns {string}
   **/
  get userId() {
    return this.#userId;
  }
  /**
   *
   * @type {string}
   **/
  set userId(value: string) {
    this.#userId = String(value);
  }
  setUserId(value: string) {
    this.userId = value;
    return this;
  }
  constructor(data: unknown = undefined) {
    if (data === null || data === undefined) {
      return;
    }
    if (typeof data === "string") {
      this.applyFromObject(JSON.parse(data));
    } else if (this.#isJsonAppliable(data)) {
      this.applyFromObject(data);
    } else {
      throw new Error(
        "Instance cannot be created on an unknown value, check the content being passed. got: " +
          typeof data,
      );
    }
  }
  #isJsonAppliable(obj: unknown) {
    const g = globalThis as unknown as { Buffer: any; Blob: any };
    const isBuffer =
      typeof g.Buffer !== "undefined" &&
      typeof g.Buffer.isBuffer === "function" &&
      g.Buffer.isBuffer(obj);
    const isBlob = typeof g.Blob !== "undefined" && obj instanceof g.Blob;
    return (
      obj &&
      typeof obj === "object" &&
      !Array.isArray(obj) &&
      !isBuffer &&
      !(obj instanceof ArrayBuffer) &&
      !isBlob
    );
  }
  /**
   * casts the fields of a javascript object into the class properties one by one
   **/
  applyFromObject(data = {}) {
    const d = data as Partial<RemoveWorkspaceMemberActionRes>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.userId !== undefined) {
      this.userId = d.userId;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      uniqueId: this.#uniqueId,
      userId: this.#userId,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      userId: "userId",
    };
  }
  /**
   * Creates an instance of RemoveWorkspaceMemberActionRes, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: RemoveWorkspaceMemberActionResType) {
    return new RemoveWorkspaceMemberActionRes(possibleDtoObject);
  }
  /**
   * Creates an instance of RemoveWorkspaceMemberActionRes, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(
    partialDtoObject: PartialDeep<RemoveWorkspaceMemberActionResType>,
  ) {
    return new RemoveWorkspaceMemberActionRes(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<RemoveWorkspaceMemberActionResType>,
  ): InstanceType<typeof RemoveWorkspaceMemberActionRes> {
    return new RemoveWorkspaceMemberActionRes({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof RemoveWorkspaceMemberActionRes> {
    return new RemoveWorkspaceMemberActionRes(this.toJSON());
  }
}
export abstract class RemoveWorkspaceMemberActionResFactory {
  abstract create(data: unknown): RemoveWorkspaceMemberActionRes;
}
/**
 * The base type definition for removeWorkspaceMemberActionRes
 **/
export type RemoveWorkspaceMemberActionResType = {
  /**
   * UniqueId of the removed userWorkspace membership row.
   * @type {string}
   **/
  uniqueId: string;
  /**
   *
   * @type {string}
   **/
  userId: string;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RemoveWorkspaceMemberActionResType {}
