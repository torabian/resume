import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { MArray } from "@fireback/js-remote-ctx/common/operators";
import { URLSearchParamsX } from "@fireback/js-remote-ctx/common/URLSearchParamsX";
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
import { withPrefix } from "@fireback/js-remote-ctx/common/withPrefix";
/**
 * Action to communicate with the action projectAwareDeletePreview
 */
export type ProjectAwareDeletePreviewActionOptions = {
  queryKey?: unknown[];
  qs?: ProjectAwareDeletePreviewActionQueryParams;
};
export type ProjectAwareDeletePreviewActionQueryOptions = Omit<
  UseQueryOptions<
    unknown,
    unknown,
    GResponse<ProjectAwareDeletePreviewActionRes>,
    unknown[]
  >,
  "queryKey"
> &
  ProjectAwareDeletePreviewActionOptions &
  Partial<{
    creatorFn: (item: unknown) => ProjectAwareDeletePreviewActionRes;
  }> & {
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
    ctx?: FetchxContext | null;
  };
export const useProjectAwareDeletePreviewActionQuery = (
  options: ProjectAwareDeletePreviewActionQueryOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = () => {
    setCompleteState(false);
    return ProjectAwareDeletePreviewAction.Fetch(
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
    queryKey: [ProjectAwareDeletePreviewAction.NewUrl(options?.qs)],
    queryFn: fn,
    ...(options || {}),
  });
  return {
    ...result,
    isCompleted,
    response,
  };
};
export type ProjectAwareDeletePreviewActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  ProjectAwareDeletePreviewActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => ProjectAwareDeletePreviewActionRes;
  }>;
export const useProjectAwareDeletePreviewAction = (
  options?: ProjectAwareDeletePreviewActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: unknown) => {
    setCompleteState(false);
    return ProjectAwareDeletePreviewAction.Fetch(
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
 * ProjectAwareDeletePreviewAction
 */
export class ProjectAwareDeletePreviewAction {
  //
  static URL = "/project/delete-preview";
  static NewUrl = (qs?: ProjectAwareDeletePreviewActionQueryParams) =>
    buildUrl(ProjectAwareDeletePreviewAction.URL, undefined, qs);
  static Method = "GET";
  static Fetch$ = async (
    qs?: ProjectAwareDeletePreviewActionQueryParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<unknown, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<ProjectAwareDeletePreviewActionRes>,
      unknown,
      unknown
    >(
      overrideUrl ?? ProjectAwareDeletePreviewAction.NewUrl(qs),
      {
        method: ProjectAwareDeletePreviewAction.Method,
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
        | ((item: unknown) => ProjectAwareDeletePreviewActionRes)
        | undefined;
      qs?: ProjectAwareDeletePreviewActionQueryParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new ProjectAwareDeletePreviewActionRes(item),
    },
  ) => {
    creatorFn =
      creatorFn || ((item) => new ProjectAwareDeletePreviewActionRes(item));
    const res = await ProjectAwareDeletePreviewAction.Fetch$(
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<ProjectAwareDeletePreviewActionRes>();
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
    name: "projectAwareDeletePreview",
    cliName: "delete-preview",
    cliShort: "dp",
    url: "/project/delete-preview",
    method: "get",
    qs: [
      {
        name: "uniqueIds",
        type: "slice",
        primitive: "string",
      },
    ],
    description:
      'Reports what deleting the given "project" uniqueIds would affect, without deleting anything.',
    out: {
      envelope: "GResponse",
      fields: [
        {
          name: "message",
          type: "string",
        },
        {
          name: "affected",
          type: "array",
          fields: [
            {
              name: "relation",
              type: "string",
            },
            {
              name: "count",
              type: "int64",
            },
          ],
        },
      ],
    },
  };
}
/**
 * The base class definition for projectAwareDeletePreviewActionRes
 **/
export class ProjectAwareDeletePreviewActionRes {
  /**
   *
   * @type {string}
   **/
  #message: string = "";
  /**
   *
   * @returns {string}
   **/
  get message() {
    return this.#message;
  }
  /**
   *
   * @type {string}
   **/
  set message(value: string) {
    this.#message = String(value);
  }
  setMessage(value: string) {
    this.message = value;
    return this;
  }
  /**
   *
   * @type {ProjectAwareDeletePreviewActionRes.Affected}
   **/
  #affected: MArray<
    InstanceType<typeof ProjectAwareDeletePreviewActionRes.Affected>
  > = MArray.of([]);
  /**
   *
   * @returns {ProjectAwareDeletePreviewActionRes.Affected}
   **/
  get affected() {
    return this.#affected;
  }
  /**
   *
   * @type {ProjectAwareDeletePreviewActionRes.Affected}
   **/
  set affected(
    value:
      | MArray<InstanceType<typeof ProjectAwareDeletePreviewActionRes.Affected>>
      | InstanceType<typeof ProjectAwareDeletePreviewActionRes.Affected>[],
  ) {
    // When the passed value is already an array, we check if we need to
    // cast the inner items into class instance.
    if (Array.isArray(value)) {
      if (
        value.length > 0 &&
        value[0] instanceof ProjectAwareDeletePreviewActionRes.Affected
      ) {
        this.#affected = MArray.of(value);
      } else {
        this.#affected = MArray.of(
          value.map(
            (item) => new ProjectAwareDeletePreviewActionRes.Affected(item),
          ),
        );
      }
      return;
    }
    // If the instance is already an MArray, we assume it's all good.
    if (value instanceof MArray) {
      this.#affected = value;
      return;
    }
    // If the value is not array, and is not a MArray, we need to be consider,
    // it might be eligible to be casted into MArray.
    const { ok, value: mcastValue } = MArray.cast<unknown>(value);
    if (ok) {
      this.#affected = mcastValue as any;
      return;
    }
    console.warn(
      "Cannot assing value to affected, because it needs MArray instance or an Array.",
    );
  }
  setAffected(
    value:
      | MArray<InstanceType<typeof ProjectAwareDeletePreviewActionRes.Affected>>
      | InstanceType<typeof ProjectAwareDeletePreviewActionRes.Affected>[],
  ) {
    this.affected = value;
    return this;
  }
  /**
   * The base class definition for affected
   **/
  static Affected = class Affected {
    /**
     *
     * @type {string}
     **/
    #relation: string = "";
    /**
     *
     * @returns {string}
     **/
    get relation() {
      return this.#relation;
    }
    /**
     *
     * @type {string}
     **/
    set relation(value: string) {
      this.#relation = String(value);
    }
    setRelation(value: string) {
      this.relation = value;
      return this;
    }
    /**
     *
     * @type {number}
     **/
    #count: number = 0;
    /**
     *
     * @returns {number}
     **/
    get count() {
      return this.#count;
    }
    /**
     *
     * @type {number}
     **/
    set count(value: number) {
      const correctType = typeof value === "number";
      const parsedValue = correctType ? value : Number(value);
      if (!Number.isNaN(parsedValue)) {
        this.#count = parsedValue;
      }
    }
    setCount(value: number) {
      this.count = value;
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
      const d = data as Partial<Affected>;
      if (d.relation !== undefined) {
        this.relation = d.relation;
      }
      if (d.count !== undefined) {
        this.count = d.count;
      }
    }
    /**
     *	Special toJSON override, since the field are private,
     *	Json stringify won't see them unless we mention it explicitly.
     **/
    toJSON() {
      return {
        relation: this.#relation,
        count: this.#count,
      };
    }
    toString() {
      return JSON.stringify(this);
    }
    static get Fields() {
      return {
        relation: "relation",
        count: "count",
      };
    }
    /**
     * Creates an instance of ProjectAwareDeletePreviewActionRes.Affected, and possibleDtoObject
     * needs to satisfy the type requirement fully, otherwise typescript compile would
     * be complaining.
     **/
    static from(
      possibleDtoObject: ProjectAwareDeletePreviewActionResType.AffectedType,
    ) {
      return new ProjectAwareDeletePreviewActionRes.Affected(possibleDtoObject);
    }
    /**
     * Creates an instance of ProjectAwareDeletePreviewActionRes.Affected, and partialDtoObject
     * needs to satisfy the type, but partially, and rest of the content would
     * be constructed according to data types and nullability.
     **/
    static with(
      partialDtoObject: PartialDeep<ProjectAwareDeletePreviewActionResType.AffectedType>,
    ) {
      return new ProjectAwareDeletePreviewActionRes.Affected(partialDtoObject);
    }
    copyWith(
      partial: PartialDeep<ProjectAwareDeletePreviewActionResType.AffectedType>,
    ): InstanceType<typeof ProjectAwareDeletePreviewActionRes.Affected> {
      return new ProjectAwareDeletePreviewActionRes.Affected({
        ...this.toJSON(),
        ...partial,
      });
    }
    clone(): InstanceType<typeof ProjectAwareDeletePreviewActionRes.Affected> {
      return new ProjectAwareDeletePreviewActionRes.Affected(this.toJSON());
    }
  };
  static JsonSchema = {
    type: "object",
    title: "$title",
    description: "$description",
    properties: {
      message: {
        type: "string",
        title: "message_title",
      },
      affected: {
        type: "array",
        title: "affected_title",
        items: {
          type: "object",
          properties: {
            relation: {
              type: "string",
              title: "affected_items_properties_relation_title",
            },
            count: {
              type: "integer",
              title: "affected_items_properties_count_title",
            },
          },
          required: ["relation", "count"],
        },
      },
    },
    required: ["message", "affected"],
  };
  static DefaultTranslations = {
    $title: "ProjectAwareDeletePreviewActionRes",
    $description: "",
    message_title: "Message",
    affected_items_properties_relation_title: "Relation",
    affected_items_properties_count_title: "Count",
    affected_title: "Affected",
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
    const d = data as Partial<ProjectAwareDeletePreviewActionRes>;
    if (d.message !== undefined) {
      this.message = d.message;
    }
    if (d.affected !== undefined) {
      this.affected = d.affected;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      message: this.#message,
      affected: this.#affected,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      message: "message",
      affected$: "affected",
      get affected() {
        return withPrefix(
          "affected[:i]",
          ProjectAwareDeletePreviewActionRes.Affected.Fields,
        );
      },
    };
  }
  /**
   * Creates an instance of ProjectAwareDeletePreviewActionRes, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: ProjectAwareDeletePreviewActionResType) {
    return new ProjectAwareDeletePreviewActionRes(possibleDtoObject);
  }
  /**
   * Creates an instance of ProjectAwareDeletePreviewActionRes, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(
    partialDtoObject: PartialDeep<ProjectAwareDeletePreviewActionResType>,
  ) {
    return new ProjectAwareDeletePreviewActionRes(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<ProjectAwareDeletePreviewActionResType>,
  ): InstanceType<typeof ProjectAwareDeletePreviewActionRes> {
    return new ProjectAwareDeletePreviewActionRes({
      ...this.toJSON(),
      ...partial,
    });
  }
  clone(): InstanceType<typeof ProjectAwareDeletePreviewActionRes> {
    return new ProjectAwareDeletePreviewActionRes(this.toJSON());
  }
}
export abstract class ProjectAwareDeletePreviewActionResFactory {
  abstract create(data: unknown): ProjectAwareDeletePreviewActionRes;
}
export type ProjectAwareDeletePreviewActionResTranslationKey =
  keyof typeof ProjectAwareDeletePreviewActionRes.DefaultTranslations;
export type ProjectAwareDeletePreviewActionResTranslations = Record<
  ProjectAwareDeletePreviewActionResTranslationKey,
  string
>;
/**
 * The base type definition for projectAwareDeletePreviewActionRes
 **/
export type ProjectAwareDeletePreviewActionResType = {
  /**
   *
   * @type {string}
   **/
  message: string;
  /**
   *
   * @type {ProjectAwareDeletePreviewActionResType.AffectedType[]}
   **/
  affected: ProjectAwareDeletePreviewActionResType.AffectedType[];
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ProjectAwareDeletePreviewActionResType {
  /**
   * The base type definition for affectedType
   **/
  export type AffectedType = {
    /**
     *
     * @type {string}
     **/
    relation: string;
    /**
     *
     * @type {number}
     **/
    count: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace AffectedType {}
}
/**
 * ProjectAwareDeletePreviewActionQueryParams class
 * Auto-generated from EmiAction
 */
export class ProjectAwareDeletePreviewActionQueryParams extends URLSearchParamsX {
  /**
   *
   * @returns { any }
   */
  getUniqueIds() {
    return this.getTyped("uniqueIds", "any");
  }
  /**
   *
   * @param { any } value
   */
  setUniqueIds(value: any) {
    this.set("uniqueIds", value);
    return this;
  }
}
