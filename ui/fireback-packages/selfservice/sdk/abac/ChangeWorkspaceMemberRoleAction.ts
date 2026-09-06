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
 * Action to communicate with the action ChangeWorkspaceMemberRole
 */
export type ChangeWorkspaceMemberRoleActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type ChangeWorkspaceMemberRoleActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  ChangeWorkspaceMemberRoleActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => ChangeWorkspaceMemberRoleActionRes;
  }>;
export const useChangeWorkspaceMemberRoleAction = (
  options?: ChangeWorkspaceMemberRoleActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: ChangeWorkspaceMemberRoleActionReq) => {
    setCompleteState(false);
    return ChangeWorkspaceMemberRoleAction.Fetch(
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
 * ChangeWorkspaceMemberRoleAction
 */
export class ChangeWorkspaceMemberRoleAction {
  //
  static URL = "/workspace/members/change-role";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(ChangeWorkspaceMemberRoleAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<ChangeWorkspaceMemberRoleActionReq, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<ChangeWorkspaceMemberRoleActionRes>,
      ChangeWorkspaceMemberRoleActionReq,
      unknown
    >(
      overrideUrl ?? ChangeWorkspaceMemberRoleAction.NewUrl(qs),
      {
        method: ChangeWorkspaceMemberRoleAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<ChangeWorkspaceMemberRoleActionReq, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?:
        | ((item: unknown) => ChangeWorkspaceMemberRoleActionRes)
        | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new ChangeWorkspaceMemberRoleActionRes(item),
    },
  ) => {
    creatorFn =
      creatorFn || ((item) => new ChangeWorkspaceMemberRoleActionRes(item));
    const res = await ChangeWorkspaceMemberRoleAction.Fetch$(
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<ChangeWorkspaceMemberRoleActionRes>();
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
    name: "ChangeWorkspaceMemberRole",
    cliName: "change-member-role",
    url: "/workspace/members/change-role",
    method: "post",
    description:
      "Replaces a member's role assignment(s) in the caller's own current workspace with a single new role. Self-service, not root only (compare ChangeUserWorkspaceRole, which is the root-only equivalent for an arbitrary workspaceId).",
    in: {
      fields: [
        {
          name: "userId",
          description: "UniqueId of the member whose role is changing.",
          type: "string",
          tags: {
            validate: "required",
          },
        },
        {
          name: "roleId",
          description:
            "UniqueId of the new role (must belong to the caller's current workspace).",
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
          description: "UniqueId of the userWorkspace membership row.",
          type: "string",
        },
        {
          name: "userId",
          type: "string",
        },
        {
          name: "roleId",
          type: "string",
        },
      ],
    },
  };
}
/**
 * The base class definition for changeWorkspaceMemberRoleActionReq
 **/
export class ChangeWorkspaceMemberRoleActionReq {
  /**
   * UniqueId of the member whose role is changing.
   * @type {string}
   **/
  #userId: string = "";
  /**
   * UniqueId of the member whose role is changing.
   * @returns {string}
   **/
  get userId() {
    return this.#userId;
  }
  /**
   * UniqueId of the member whose role is changing.
   * @type {string}
   **/
  set userId(value: string) {
    this.#userId = String(value);
  }
  setUserId(value: string) {
    this.userId = value;
    return this;
  }
  /**
   * UniqueId of the new role (must belong to the caller's current workspace).
   * @type {string}
   **/
  #roleId: string = "";
  /**
   * UniqueId of the new role (must belong to the caller's current workspace).
   * @returns {string}
   **/
  get roleId() {
    return this.#roleId;
  }
  /**
   * UniqueId of the new role (must belong to the caller's current workspace).
   * @type {string}
   **/
  set roleId(value: string) {
    this.#roleId = String(value);
  }
  setRoleId(value: string) {
    this.roleId = value;
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
    const d = data as Partial<ChangeWorkspaceMemberRoleActionReq>;
    if (d.userId !== undefined) {
      this.userId = d.userId;
    }
    if (d.roleId !== undefined) {
      this.roleId = d.roleId;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      userId: this.#userId,
      roleId: this.#roleId,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      userId: "userId",
      roleId: "roleId",
    };
  }
  /**
   * Creates an instance of ChangeWorkspaceMemberRoleActionReq, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: ChangeWorkspaceMemberRoleActionReqType) {
    return new ChangeWorkspaceMemberRoleActionReq(possibleDtoObject);
  }
  /**
   * Creates an instance of ChangeWorkspaceMemberRoleActionReq, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(
    partialDtoObject: PartialDeep<ChangeWorkspaceMemberRoleActionReqType>,
  ) {
    return new ChangeWorkspaceMemberRoleActionReq(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<ChangeWorkspaceMemberRoleActionReqType>,
  ): InstanceType<typeof ChangeWorkspaceMemberRoleActionReq> {
    return new ChangeWorkspaceMemberRoleActionReq({
      ...this.toJSON(),
      ...partial,
    });
  }
  clone(): InstanceType<typeof ChangeWorkspaceMemberRoleActionReq> {
    return new ChangeWorkspaceMemberRoleActionReq(this.toJSON());
  }
}
export abstract class ChangeWorkspaceMemberRoleActionReqFactory {
  abstract create(data: unknown): ChangeWorkspaceMemberRoleActionReq;
}
/**
 * The base type definition for changeWorkspaceMemberRoleActionReq
 **/
export type ChangeWorkspaceMemberRoleActionReqType = {
  /**
   * UniqueId of the member whose role is changing.
   * @type {string}
   **/
  userId: string;
  /**
   * UniqueId of the new role (must belong to the caller's current workspace).
   * @type {string}
   **/
  roleId: string;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ChangeWorkspaceMemberRoleActionReqType {}
/**
 * The base class definition for changeWorkspaceMemberRoleActionRes
 **/
export class ChangeWorkspaceMemberRoleActionRes {
  /**
   * UniqueId of the userWorkspace membership row.
   * @type {string}
   **/
  #uniqueId: string = "";
  /**
   * UniqueId of the userWorkspace membership row.
   * @returns {string}
   **/
  get uniqueId() {
    return this.#uniqueId;
  }
  /**
   * UniqueId of the userWorkspace membership row.
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
  /**
   *
   * @type {string}
   **/
  #roleId: string = "";
  /**
   *
   * @returns {string}
   **/
  get roleId() {
    return this.#roleId;
  }
  /**
   *
   * @type {string}
   **/
  set roleId(value: string) {
    this.#roleId = String(value);
  }
  setRoleId(value: string) {
    this.roleId = value;
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
    const d = data as Partial<ChangeWorkspaceMemberRoleActionRes>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.userId !== undefined) {
      this.userId = d.userId;
    }
    if (d.roleId !== undefined) {
      this.roleId = d.roleId;
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
      roleId: this.#roleId,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      userId: "userId",
      roleId: "roleId",
    };
  }
  /**
   * Creates an instance of ChangeWorkspaceMemberRoleActionRes, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: ChangeWorkspaceMemberRoleActionResType) {
    return new ChangeWorkspaceMemberRoleActionRes(possibleDtoObject);
  }
  /**
   * Creates an instance of ChangeWorkspaceMemberRoleActionRes, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(
    partialDtoObject: PartialDeep<ChangeWorkspaceMemberRoleActionResType>,
  ) {
    return new ChangeWorkspaceMemberRoleActionRes(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<ChangeWorkspaceMemberRoleActionResType>,
  ): InstanceType<typeof ChangeWorkspaceMemberRoleActionRes> {
    return new ChangeWorkspaceMemberRoleActionRes({
      ...this.toJSON(),
      ...partial,
    });
  }
  clone(): InstanceType<typeof ChangeWorkspaceMemberRoleActionRes> {
    return new ChangeWorkspaceMemberRoleActionRes(this.toJSON());
  }
}
export abstract class ChangeWorkspaceMemberRoleActionResFactory {
  abstract create(data: unknown): ChangeWorkspaceMemberRoleActionRes;
}
/**
 * The base type definition for changeWorkspaceMemberRoleActionRes
 **/
export type ChangeWorkspaceMemberRoleActionResType = {
  /**
   * UniqueId of the userWorkspace membership row.
   * @type {string}
   **/
  uniqueId: string;
  /**
   *
   * @type {string}
   **/
  userId: string;
  /**
   *
   * @type {string}
   **/
  roleId: string;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ChangeWorkspaceMemberRoleActionResType {}
