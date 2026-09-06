import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { PlainTime } from "@fireback/complexes";
import { buildUrl } from "@fireback/js-remote-ctx/common/buildUrl";
import {
  fetchx,
  handleFetchResponse,
  type FetchxContext,
  type PartialDeep,
  type TypedRequestInit,
  type TypedResponse,
} from "@fireback/js-remote-ctx/common/fetchx";
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { useFetchxContext } from "@fireback/js-remote-ctx/react/useFetchx";
import { useState } from "react";
/**
 * Action to communicate with the action BrowseWorkspaceMembers
 */
export type BrowseWorkspaceMembersActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type BrowseWorkspaceMembersActionQueryOptions = Omit<
  UseQueryOptions<
    unknown,
    unknown,
    GResponse<BrowseWorkspaceMembersActionRes>,
    unknown[]
  >,
  "queryKey"
> &
  BrowseWorkspaceMembersActionOptions &
  Partial<{
    creatorFn: (item: unknown) => BrowseWorkspaceMembersActionRes;
  }> & {
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
    ctx?: FetchxContext | null;
  };
export const useBrowseWorkspaceMembersActionQuery = (
  options: BrowseWorkspaceMembersActionQueryOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = () => {
    setCompleteState(false);
    return BrowseWorkspaceMembersAction.Fetch(
      {
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
  const result = useQuery({
    queryKey: [BrowseWorkspaceMembersAction.NewUrl(options?.qs)],
    queryFn: fn,
    ...(options || {}),
  });
  return {
    ...result,
    isCompleted,
    response,
  };
};
export type BrowseWorkspaceMembersActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  BrowseWorkspaceMembersActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => BrowseWorkspaceMembersActionRes;
  }>;
export const useBrowseWorkspaceMembersAction = (
  options?: BrowseWorkspaceMembersActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: unknown) => {
    setCompleteState(false);
    return BrowseWorkspaceMembersAction.Fetch(
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
 * BrowseWorkspaceMembersAction
 */
export class BrowseWorkspaceMembersAction {
  //
  static URL = "/workspace/members";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(BrowseWorkspaceMembersAction.URL, undefined, qs);
  static Method = "GET";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<unknown, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<BrowseWorkspaceMembersActionRes>, unknown, unknown>(
      overrideUrl ?? BrowseWorkspaceMembersAction.NewUrl(qs),
      {
        method: BrowseWorkspaceMembersAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<unknown, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?:
        | ((item: unknown) => BrowseWorkspaceMembersActionRes)
        | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new BrowseWorkspaceMembersActionRes(item),
    },
  ) => {
    creatorFn =
      creatorFn || ((item) => new BrowseWorkspaceMembersActionRes(item));
    const res = await BrowseWorkspaceMembersAction.Fetch$(
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<BrowseWorkspaceMembersActionRes>();
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
    name: "BrowseWorkspaceMembers",
    cliName: "members",
    url: "/workspace/members",
    method: "get",
    description:
      "Lists the members of the caller's own current workspace (the one named by the Workspace-id header) - self-service, not root only. Unlike QueryWorkspaceRoles this always resolves against the caller's own SqlContext, never an arbitrary workspaceId field, so it only ever shows the workspace the caller actually belongs to.",
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
          name: "firstName",
          type: "string",
        },
        {
          name: "lastName",
          type: "string",
        },
        {
          name: "roleId",
          type: "string?",
        },
        {
          name: "roleName",
          type: "string?",
        },
        {
          name: "createdAt",
          type: "complex",
          complex: "PlainTime",
        },
      ],
    },
  };
}
/**
 * The base class definition for browseWorkspaceMembersActionRes
 **/
export class BrowseWorkspaceMembersActionRes {
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
  #firstName: string = "";
  /**
   *
   * @returns {string}
   **/
  get firstName() {
    return this.#firstName;
  }
  /**
   *
   * @type {string}
   **/
  set firstName(value: string) {
    this.#firstName = String(value);
  }
  setFirstName(value: string) {
    this.firstName = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #lastName: string = "";
  /**
   *
   * @returns {string}
   **/
  get lastName() {
    return this.#lastName;
  }
  /**
   *
   * @type {string}
   **/
  set lastName(value: string) {
    this.#lastName = String(value);
  }
  setLastName(value: string) {
    this.lastName = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #roleId?: string | null | undefined = undefined;
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
  set roleId(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#roleId = correctType ? value : String(value);
  }
  setRoleId(value: string | null | undefined) {
    this.roleId = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #roleName?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get roleName() {
    return this.#roleName;
  }
  /**
   *
   * @type {string}
   **/
  set roleName(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#roleName = correctType ? value : String(value);
  }
  setRoleName(value: string | null | undefined) {
    this.roleName = value;
    return this;
  }
  /**
   *
   * @type {PlainTime}
   **/
  #createdAt!: PlainTime;
  /**
   *
   * @returns {PlainTime}
   **/
  get createdAt() {
    return this.#createdAt;
  }
  /**
   *
   * @type {PlainTime}
   **/
  set createdAt(value: PlainTime) {
    if (value instanceof PlainTime) {
      this.#createdAt = value;
    } else {
      this.#createdAt = new PlainTime(value);
    }
  }
  setCreatedAt(value: PlainTime) {
    this.createdAt = value;
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
    const d = data as Partial<BrowseWorkspaceMembersActionRes>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.userId !== undefined) {
      this.userId = d.userId;
    }
    if (d.firstName !== undefined) {
      this.firstName = d.firstName;
    }
    if (d.lastName !== undefined) {
      this.lastName = d.lastName;
    }
    if (d.roleId !== undefined) {
      this.roleId = d.roleId;
    }
    if (d.roleName !== undefined) {
      this.roleName = d.roleName;
    }
    if (d.createdAt !== undefined) {
      this.createdAt = d.createdAt;
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
      firstName: this.#firstName,
      lastName: this.#lastName,
      roleId: this.#roleId,
      roleName: this.#roleName,
      createdAt: this.#createdAt,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      userId: "userId",
      firstName: "firstName",
      lastName: "lastName",
      roleId: "roleId",
      roleName: "roleName",
      createdAt: "createdAt",
    };
  }
  /**
   * Creates an instance of BrowseWorkspaceMembersActionRes, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: BrowseWorkspaceMembersActionResType) {
    return new BrowseWorkspaceMembersActionRes(possibleDtoObject);
  }
  /**
   * Creates an instance of BrowseWorkspaceMembersActionRes, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(
    partialDtoObject: PartialDeep<BrowseWorkspaceMembersActionResType>,
  ) {
    return new BrowseWorkspaceMembersActionRes(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<BrowseWorkspaceMembersActionResType>,
  ): InstanceType<typeof BrowseWorkspaceMembersActionRes> {
    return new BrowseWorkspaceMembersActionRes({
      ...this.toJSON(),
      ...partial,
    });
  }
  clone(): InstanceType<typeof BrowseWorkspaceMembersActionRes> {
    return new BrowseWorkspaceMembersActionRes(this.toJSON());
  }
}
export abstract class BrowseWorkspaceMembersActionResFactory {
  abstract create(data: unknown): BrowseWorkspaceMembersActionRes;
}
/**
 * The base type definition for browseWorkspaceMembersActionRes
 **/
export type BrowseWorkspaceMembersActionResType = {
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
  firstName: string;
  /**
   *
   * @type {string}
   **/
  lastName: string;
  /**
   *
   * @type {string}
   **/
  roleId?: string;
  /**
   *
   * @type {string}
   **/
  roleName?: string;
  /**
   *
   * @type {PlainTime}
   **/
  createdAt: PlainTime;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BrowseWorkspaceMembersActionResType {}
