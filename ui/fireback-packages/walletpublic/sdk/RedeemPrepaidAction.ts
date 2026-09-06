import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { WalletTransactionViewDto } from "./WalletTransactionViewDto";
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
 * Action to communicate with the action redeemPrepaid
 */
export type RedeemPrepaidActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type RedeemPrepaidActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  RedeemPrepaidActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => WalletTransactionViewDto;
  }>;
export const useRedeemPrepaidAction = (
  options?: RedeemPrepaidActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: RedeemPrepaidActionReq) => {
    setCompleteState(false);
    return RedeemPrepaidAction.Fetch(
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
 * RedeemPrepaidAction
 */
export class RedeemPrepaidAction {
  //
  static URL = "/wallet/prepaid/redeem";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(RedeemPrepaidAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<RedeemPrepaidActionReq, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<WalletTransactionViewDto>,
      RedeemPrepaidActionReq,
      unknown
    >(
      overrideUrl ?? RedeemPrepaidAction.NewUrl(qs),
      {
        method: RedeemPrepaidAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<RedeemPrepaidActionReq, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => WalletTransactionViewDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new WalletTransactionViewDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new WalletTransactionViewDto(item));
    const res = await RedeemPrepaidAction.Fetch$(qs, ctx, init, overrideUrl);
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<WalletTransactionViewDto>();
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
    name: "redeemPrepaid",
    cliShort: "prepaid-redeem",
    url: "/wallet/prepaid/redeem",
    method: "post",
    description:
      'Redeems a prepaid gift card by its redeemKey into walletId, which must belong to the caller (see resolveOwnedWallet) - or, for a workspace- restricted card (prepaid.workspaceId set), be the caller\'s ownerType "workspaceUser" wallet scoped to that exact workspace. Flags the card "redeemed" (one-time use - a second call with the same key fails once it\'s no longer "active"), credits walletId through the same locked- transaction ledger path purchase/adjustBalance use (reason "redeem" - see wallet.Redeem, PrepaidRedeem.go), and returns the resulting ledger entry. Logged-in-only, unlike checkPrepaid.',
    in: {
      fields: [
        {
          name: "redeemKey",
          description: "The prepaid card's secret redeem key.",
          type: "string",
          tags: {
            validate: "required",
          },
        },
        {
          name: "walletId",
          description:
            'Unique id of the wallet to credit. Must be owned by the caller, in the same currency as the card, and - only when the card is workspace-restricted - an ownerType "workspaceUser" wallet scoped to that exact workspace.',
          type: "string",
          tags: {
            validate: "required",
          },
        },
      ],
    },
    out: {
      envelope: "GResponse",
      dto: "WalletTransactionViewDto",
    },
  };
}
/**
 * The base class definition for redeemPrepaidActionReq
 **/
export class RedeemPrepaidActionReq {
  /**
   * The prepaid card's secret redeem key.
   * @type {string}
   **/
  #redeemKey: string = "";
  /**
   * The prepaid card's secret redeem key.
   * @returns {string}
   **/
  get redeemKey() {
    return this.#redeemKey;
  }
  /**
   * The prepaid card's secret redeem key.
   * @type {string}
   **/
  set redeemKey(value: string) {
    this.#redeemKey = String(value);
  }
  setRedeemKey(value: string) {
    this.redeemKey = value;
    return this;
  }
  /**
   * Unique id of the wallet to credit. Must be owned by the caller, in the same currency as the card, and - only when the card is workspace-restricted - an ownerType "workspaceUser" wallet scoped to that exact workspace.
   * @type {string}
   **/
  #walletId: string = "";
  /**
   * Unique id of the wallet to credit. Must be owned by the caller, in the same currency as the card, and - only when the card is workspace-restricted - an ownerType "workspaceUser" wallet scoped to that exact workspace.
   * @returns {string}
   **/
  get walletId() {
    return this.#walletId;
  }
  /**
   * Unique id of the wallet to credit. Must be owned by the caller, in the same currency as the card, and - only when the card is workspace-restricted - an ownerType "workspaceUser" wallet scoped to that exact workspace.
   * @type {string}
   **/
  set walletId(value: string) {
    this.#walletId = String(value);
  }
  setWalletId(value: string) {
    this.walletId = value;
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
    const d = data as Partial<RedeemPrepaidActionReq>;
    if (d.redeemKey !== undefined) {
      this.redeemKey = d.redeemKey;
    }
    if (d.walletId !== undefined) {
      this.walletId = d.walletId;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      redeemKey: this.#redeemKey,
      walletId: this.#walletId,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      redeemKey: "redeemKey",
      walletId: "walletId",
    };
  }
  /**
   * Creates an instance of RedeemPrepaidActionReq, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: RedeemPrepaidActionReqType) {
    return new RedeemPrepaidActionReq(possibleDtoObject);
  }
  /**
   * Creates an instance of RedeemPrepaidActionReq, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<RedeemPrepaidActionReqType>) {
    return new RedeemPrepaidActionReq(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<RedeemPrepaidActionReqType>,
  ): InstanceType<typeof RedeemPrepaidActionReq> {
    return new RedeemPrepaidActionReq({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof RedeemPrepaidActionReq> {
    return new RedeemPrepaidActionReq(this.toJSON());
  }
}
export abstract class RedeemPrepaidActionReqFactory {
  abstract create(data: unknown): RedeemPrepaidActionReq;
}
/**
 * The base type definition for redeemPrepaidActionReq
 **/
export type RedeemPrepaidActionReqType = {
  /**
   * The prepaid card's secret redeem key.
   * @type {string}
   **/
  redeemKey: string;
  /**
   * Unique id of the wallet to credit. Must be owned by the caller, in the same currency as the card, and - only when the card is workspace-restricted - an ownerType "workspaceUser" wallet scoped to that exact workspace.
   * @type {string}
   **/
  walletId: string;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RedeemPrepaidActionReqType {}
