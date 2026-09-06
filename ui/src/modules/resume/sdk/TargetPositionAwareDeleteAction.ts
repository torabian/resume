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
 * Action to communicate with the action targetPositionAwareDelete
 */
export type TargetPositionAwareDeleteActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type TargetPositionAwareDeleteActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  TargetPositionAwareDeleteActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  };
export const useTargetPositionAwareDeleteAction = (
  options?: TargetPositionAwareDeleteActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: TargetPositionAwareDeleteActionReq) => {
    setCompleteState(false);
    return TargetPositionAwareDeleteAction.Fetch(
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
 * TargetPositionAwareDeleteAction
 */
export class TargetPositionAwareDeleteAction {
  //
  static URL = "/targetPosition/delete";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(TargetPositionAwareDeleteAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<TargetPositionAwareDeleteActionReq, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<unknown, TargetPositionAwareDeleteActionReq, unknown>(
      overrideUrl ?? TargetPositionAwareDeleteAction.NewUrl(qs),
      {
        method: TargetPositionAwareDeleteAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<TargetPositionAwareDeleteActionReq, unknown>,
    {
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {},
  ) => {
    const res = await TargetPositionAwareDeleteAction.Fetch$(
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(res, undefined, onMessage, init?.signal);
  };
  static Definition = {
    name: "targetPositionAwareDelete",
    cliName: "delete",
    cliShort: "d",
    url: "/targetPosition/delete",
    method: "post",
    description:
      'Deletes the given "targetPosition" uniqueIds, along with everything targetPositionAwareDeletePreview reports.',
    in: {
      fields: [
        {
          name: "uniqueIds",
          type: "slice",
          primitive: "string",
        },
      ],
    },
  };
}
/**
 * The base class definition for targetPositionAwareDeleteActionReq
 **/
export class TargetPositionAwareDeleteActionReq {
  /**
   *
   * @type {string[]}
   **/
  #uniqueIds: string[] = [];
  /**
   *
   * @returns {string[]}
   **/
  get uniqueIds() {
    return this.#uniqueIds;
  }
  /**
   *
   * @type {string[]}
   **/
  set uniqueIds(value: string[]) {
    this.#uniqueIds = value;
  }
  setUniqueIds(value: string[]) {
    this.uniqueIds = value;
    return this;
  }
  static JsonSchema = {
    type: "object",
    title: "$title",
    description: "$description",
    properties: {
      uniqueIds: {
        type: "array",
        title: "unique_ids_title",
        items: {
          type: "string",
        },
      },
    },
    required: ["uniqueIds"],
  };
  static DefaultTranslations = {
    $title: "TargetPositionAwareDeleteActionReq",
    $description: "",
    unique_ids_title: "Unique Ids",
  } as const;
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
    const d = data as Partial<TargetPositionAwareDeleteActionReq>;
    if (d.uniqueIds !== undefined) {
      this.uniqueIds = d.uniqueIds;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      uniqueIds: this.#uniqueIds,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueIds$: "uniqueIds",
      get uniqueIds() {
        return "uniqueIds[:i]";
      },
    };
  }
  /**
   * Creates an instance of TargetPositionAwareDeleteActionReq, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: TargetPositionAwareDeleteActionReqType) {
    return new TargetPositionAwareDeleteActionReq(possibleDtoObject);
  }
  /**
   * Creates an instance of TargetPositionAwareDeleteActionReq, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(
    partialDtoObject: PartialDeep<TargetPositionAwareDeleteActionReqType>,
  ) {
    return new TargetPositionAwareDeleteActionReq(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<TargetPositionAwareDeleteActionReqType>,
  ): InstanceType<typeof TargetPositionAwareDeleteActionReq> {
    return new TargetPositionAwareDeleteActionReq({
      ...this.toJSON(),
      ...partial,
    });
  }
  clone(): InstanceType<typeof TargetPositionAwareDeleteActionReq> {
    return new TargetPositionAwareDeleteActionReq(this.toJSON());
  }
}
export abstract class TargetPositionAwareDeleteActionReqFactory {
  abstract create(data: unknown): TargetPositionAwareDeleteActionReq;
}
export type TargetPositionAwareDeleteActionReqTranslationKey =
  keyof typeof TargetPositionAwareDeleteActionReq.DefaultTranslations;
export type TargetPositionAwareDeleteActionReqTranslations = Record<
  TargetPositionAwareDeleteActionReqTranslationKey,
  string
>;
/**
 * The base type definition for targetPositionAwareDeleteActionReq
 **/
export type TargetPositionAwareDeleteActionReqType = {
  /**
   *
   * @type {string[]}
   **/
  uniqueIds: string[];
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TargetPositionAwareDeleteActionReqType {}
