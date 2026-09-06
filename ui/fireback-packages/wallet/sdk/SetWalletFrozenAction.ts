import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { WalletDto } from "./WalletDto";
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
 * Action to communicate with the action setWalletFrozen
 */
export type SetWalletFrozenActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type SetWalletFrozenActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  SetWalletFrozenActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => WalletDto;
  }>;
export const useSetWalletFrozenAction = (
  options?: SetWalletFrozenActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: SetWalletFrozenActionReq) => {
    setCompleteState(false);
    return SetWalletFrozenAction.Fetch(
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
 * SetWalletFrozenAction
 */
export class SetWalletFrozenAction {
  //
  static URL = "/wallet/freeze";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(SetWalletFrozenAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<SetWalletFrozenActionReq, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<WalletDto>, SetWalletFrozenActionReq, unknown>(
      overrideUrl ?? SetWalletFrozenAction.NewUrl(qs),
      {
        method: SetWalletFrozenAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<SetWalletFrozenActionReq, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => WalletDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new WalletDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new WalletDto(item));
    const res = await SetWalletFrozenAction.Fetch$(qs, ctx, init, overrideUrl);
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<WalletDto>();
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
    name: "setWalletFrozen",
    cliShort: "freeze",
    url: "/wallet/freeze",
    method: "post",
    description:
      'Root-only: sets or clears wallet.frozen - see that field\'s own doc comment on how this differs from (and overrides) the owner-settable status "frozen". There is no separate "unfreeze" action - pass frozen=false here to lift it, same root-only gate either way.',
    in: {
      fields: [
        {
          name: "walletId",
          description: "Unique id of the wallet to freeze/unfreeze.",
          type: "string",
          tags: {
            validate: "required",
          },
        },
        {
          name: "frozen",
          description:
            'New frozen value. No "required" validation here on purpose - false is this field\'s own valid, meaningful zero value (unfreeze), not "omitted".',
          type: "bool",
        },
      ],
    },
    out: {
      envelope: "GResponse",
      dto: "WalletDto",
    },
  };
}
/**
 * The base class definition for setWalletFrozenActionReq
 **/
export class SetWalletFrozenActionReq {
  /**
   * Unique id of the wallet to freeze/unfreeze.
   * @type {string}
   **/
  #walletId: string = "";
  /**
   * Unique id of the wallet to freeze/unfreeze.
   * @returns {string}
   **/
  get walletId() {
    return this.#walletId;
  }
  /**
   * Unique id of the wallet to freeze/unfreeze.
   * @type {string}
   **/
  set walletId(value: string) {
    this.#walletId = String(value);
  }
  setWalletId(value: string) {
    this.walletId = value;
    return this;
  }
  /**
   * New frozen value. No "required" validation here on purpose - false is this field's own valid, meaningful zero value (unfreeze), not "omitted".
   * @type {boolean}
   **/
  #frozen!: boolean;
  /**
   * New frozen value. No "required" validation here on purpose - false is this field's own valid, meaningful zero value (unfreeze), not "omitted".
   * @returns {boolean}
   **/
  get frozen() {
    return this.#frozen;
  }
  /**
   * New frozen value. No "required" validation here on purpose - false is this field's own valid, meaningful zero value (unfreeze), not "omitted".
   * @type {boolean}
   **/
  set frozen(value: boolean) {
    this.#frozen = Boolean(value);
  }
  setFrozen(value: boolean) {
    this.frozen = value;
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
    const d = data as Partial<SetWalletFrozenActionReq>;
    if (d.walletId !== undefined) {
      this.walletId = d.walletId;
    }
    if (d.frozen !== undefined) {
      this.frozen = d.frozen;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      walletId: this.#walletId,
      frozen: this.#frozen,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      walletId: "walletId",
      frozen: "frozen",
    };
  }
  /**
   * Creates an instance of SetWalletFrozenActionReq, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: SetWalletFrozenActionReqType) {
    return new SetWalletFrozenActionReq(possibleDtoObject);
  }
  /**
   * Creates an instance of SetWalletFrozenActionReq, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<SetWalletFrozenActionReqType>) {
    return new SetWalletFrozenActionReq(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<SetWalletFrozenActionReqType>,
  ): InstanceType<typeof SetWalletFrozenActionReq> {
    return new SetWalletFrozenActionReq({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof SetWalletFrozenActionReq> {
    return new SetWalletFrozenActionReq(this.toJSON());
  }
}
export abstract class SetWalletFrozenActionReqFactory {
  abstract create(data: unknown): SetWalletFrozenActionReq;
}
/**
 * The base type definition for setWalletFrozenActionReq
 **/
export type SetWalletFrozenActionReqType = {
  /**
   * Unique id of the wallet to freeze/unfreeze.
   * @type {string}
   **/
  walletId: string;
  /**
   * New frozen value. No "required" validation here on purpose - false is this field's own valid, meaningful zero value (unfreeze), not "omitted".
   * @type {boolean}
   **/
  frozen: boolean;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SetWalletFrozenActionReqType {}
