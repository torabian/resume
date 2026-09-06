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
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { useFetchxContext } from "@fireback/js-remote-ctx/react/useFetchx";
import { useState } from "react";
/**
 * Action to communicate with the action getWalletCapabilities
 */
export type GetWalletCapabilitiesActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type GetWalletCapabilitiesActionQueryOptions = Omit<
  UseQueryOptions<
    unknown,
    unknown,
    GResponse<GetWalletCapabilitiesActionRes>,
    unknown[]
  >,
  "queryKey"
> &
  GetWalletCapabilitiesActionOptions &
  Partial<{
    creatorFn: (item: unknown) => GetWalletCapabilitiesActionRes;
  }> & {
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
    ctx?: FetchxContext | null;
  };
export const useGetWalletCapabilitiesActionQuery = (
  options: GetWalletCapabilitiesActionQueryOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = () => {
    setCompleteState(false);
    return GetWalletCapabilitiesAction.Fetch(
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
    queryKey: [GetWalletCapabilitiesAction.NewUrl(options?.qs)],
    queryFn: fn,
    ...(options || {}),
  });
  return {
    ...result,
    isCompleted,
    response,
  };
};
export type GetWalletCapabilitiesActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  GetWalletCapabilitiesActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => GetWalletCapabilitiesActionRes;
  }>;
export const useGetWalletCapabilitiesAction = (
  options?: GetWalletCapabilitiesActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: unknown) => {
    setCompleteState(false);
    return GetWalletCapabilitiesAction.Fetch(
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
 * GetWalletCapabilitiesAction
 */
export class GetWalletCapabilitiesAction {
  //
  static URL = "/wallet/capabilities";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(GetWalletCapabilitiesAction.URL, undefined, qs);
  static Method = "GET";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<unknown, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<GetWalletCapabilitiesActionRes>, unknown, unknown>(
      overrideUrl ?? GetWalletCapabilitiesAction.NewUrl(qs),
      {
        method: GetWalletCapabilitiesAction.Method,
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
        | ((item: unknown) => GetWalletCapabilitiesActionRes)
        | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new GetWalletCapabilitiesActionRes(item),
    },
  ) => {
    creatorFn =
      creatorFn || ((item) => new GetWalletCapabilitiesActionRes(item));
    const res = await GetWalletCapabilitiesAction.Fetch$(
      qs,
      ctx,
      init,
      overrideUrl,
    );
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<GetWalletCapabilitiesActionRes>();
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
    name: "getWalletCapabilities",
    cliShort: "capabilities",
    url: "/wallet/capabilities",
    method: "get",
    description:
      'Reports which self-service wallet features are currently turned on - just enough of walletConfig for the owner-facing UI to decide whether to show a "New wallet" button or a transfer form, without needing root\'s own getWalletConfig (root-only, AllowOnRoot). Logged-in-only, same as every other walletpublic action.',
    out: {
      envelope: "GResponse",
      fields: [
        {
          name: "allowUserCreateWallet",
          description:
            'Whether createWallet is currently allowed for a caller-owned ("user") wallet.',
          type: "bool",
        },
        {
          name: "allowUserTransfer",
          description: "Whether transferFunds is currently allowed at all.",
          type: "bool",
        },
      ],
    },
  };
}
/**
 * The base class definition for getWalletCapabilitiesActionRes
 **/
export class GetWalletCapabilitiesActionRes {
  /**
   * Whether createWallet is currently allowed for a caller-owned ("user") wallet.
   * @type {boolean}
   **/
  #allowUserCreateWallet!: boolean;
  /**
   * Whether createWallet is currently allowed for a caller-owned ("user") wallet.
   * @returns {boolean}
   **/
  get allowUserCreateWallet() {
    return this.#allowUserCreateWallet;
  }
  /**
   * Whether createWallet is currently allowed for a caller-owned ("user") wallet.
   * @type {boolean}
   **/
  set allowUserCreateWallet(value: boolean) {
    this.#allowUserCreateWallet = Boolean(value);
  }
  setAllowUserCreateWallet(value: boolean) {
    this.allowUserCreateWallet = value;
    return this;
  }
  /**
   * Whether transferFunds is currently allowed at all.
   * @type {boolean}
   **/
  #allowUserTransfer!: boolean;
  /**
   * Whether transferFunds is currently allowed at all.
   * @returns {boolean}
   **/
  get allowUserTransfer() {
    return this.#allowUserTransfer;
  }
  /**
   * Whether transferFunds is currently allowed at all.
   * @type {boolean}
   **/
  set allowUserTransfer(value: boolean) {
    this.#allowUserTransfer = Boolean(value);
  }
  setAllowUserTransfer(value: boolean) {
    this.allowUserTransfer = value;
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
    const d = data as Partial<GetWalletCapabilitiesActionRes>;
    if (d.allowUserCreateWallet !== undefined) {
      this.allowUserCreateWallet = d.allowUserCreateWallet;
    }
    if (d.allowUserTransfer !== undefined) {
      this.allowUserTransfer = d.allowUserTransfer;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      allowUserCreateWallet: this.#allowUserCreateWallet,
      allowUserTransfer: this.#allowUserTransfer,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      allowUserCreateWallet: "allowUserCreateWallet",
      allowUserTransfer: "allowUserTransfer",
    };
  }
  /**
   * Creates an instance of GetWalletCapabilitiesActionRes, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: GetWalletCapabilitiesActionResType) {
    return new GetWalletCapabilitiesActionRes(possibleDtoObject);
  }
  /**
   * Creates an instance of GetWalletCapabilitiesActionRes, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(
    partialDtoObject: PartialDeep<GetWalletCapabilitiesActionResType>,
  ) {
    return new GetWalletCapabilitiesActionRes(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<GetWalletCapabilitiesActionResType>,
  ): InstanceType<typeof GetWalletCapabilitiesActionRes> {
    return new GetWalletCapabilitiesActionRes({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof GetWalletCapabilitiesActionRes> {
    return new GetWalletCapabilitiesActionRes(this.toJSON());
  }
}
export abstract class GetWalletCapabilitiesActionResFactory {
  abstract create(data: unknown): GetWalletCapabilitiesActionRes;
}
/**
 * The base type definition for getWalletCapabilitiesActionRes
 **/
export type GetWalletCapabilitiesActionResType = {
  /**
   * Whether createWallet is currently allowed for a caller-owned ("user") wallet.
   * @type {boolean}
   **/
  allowUserCreateWallet: boolean;
  /**
   * Whether transferFunds is currently allowed at all.
   * @type {boolean}
   **/
  allowUserTransfer: boolean;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GetWalletCapabilitiesActionResType {}
