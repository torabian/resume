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
import { withPrefix } from "@fireback/js-remote-ctx/common/withPrefix";
/**
 * Action to communicate with the action transferFunds
 */
export type TransferFundsActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type TransferFundsActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  TransferFundsActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => TransferFundsActionRes;
  }>;
export const useTransferFundsAction = (
  options?: TransferFundsActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: TransferFundsActionReq) => {
    setCompleteState(false);
    return TransferFundsAction.Fetch(
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
 * TransferFundsAction
 */
export class TransferFundsAction {
  //
  static URL = "/wallet/transfer";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(TransferFundsAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<TransferFundsActionReq, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<TransferFundsActionRes>,
      TransferFundsActionReq,
      unknown
    >(
      overrideUrl ?? TransferFundsAction.NewUrl(qs),
      {
        method: TransferFundsAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<TransferFundsActionReq, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => TransferFundsActionRes) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new TransferFundsActionRes(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new TransferFundsActionRes(item));
    const res = await TransferFundsAction.Fetch$(qs, ctx, init, overrideUrl);
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<TransferFundsActionRes>();
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
    name: "transferFunds",
    cliShort: "transfer",
    url: "/wallet/transfer",
    method: "post",
    description:
      "Moves funds directly from one of the caller's own wallets into any other wallet, by its uniqueId - a straight peer-to-peer transfer, not a topup/purchase. Root-gated by walletConfig.allowUserTransfer (off by default - see Wallet.emi.yml's own doc comment on that field); rejected outright while it's off, regardless of ownership. The caller must own/belong to fromWalletId the same way every other wallet-scoped action here checks; toWalletId only needs to exist and share fromWalletId's currency - the caller does not need to own or have any relationship to it, since the whole point is sending funds to someone else's wallet.",
    in: {
      fields: [
        {
          name: "fromWalletId",
          description: "Unique id of the caller's own wallet to send from.",
          type: "string",
          tags: {
            validate: "required",
          },
        },
        {
          name: "toWalletId",
          description: "Unique id of the wallet to send funds to.",
          type: "string",
          tags: {
            validate: "required",
          },
        },
        {
          name: "amount",
          description:
            "Amount to transfer, as a positive minor-units decimal string.",
          type: "string",
          tags: {
            validate: "required",
          },
        },
        {
          name: "note",
          description:
            "Optional human-readable note, recorded on both ledger entries.",
          type: "string?",
        },
        {
          name: "idempotencyKey",
          description: "Makes this transfer safe to retry.",
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
          name: "fromTransaction",
          description: "The debit ledger entry recorded against fromWalletId.",
          type: "object",
          fields: [
            {
              name: "uniqueId",
              type: "string",
            },
            {
              name: "amount",
              type: "string",
            },
            {
              name: "balanceAfter",
              type: "string",
            },
          ],
        },
        {
          name: "toTransaction",
          description: "The credit ledger entry recorded against toWalletId.",
          type: "object",
          fields: [
            {
              name: "uniqueId",
              type: "string",
            },
            {
              name: "amount",
              type: "string",
            },
            {
              name: "balanceAfter",
              type: "string",
            },
          ],
        },
      ],
    },
  };
}
/**
 * The base class definition for transferFundsActionReq
 **/
export class TransferFundsActionReq {
  /**
   * Unique id of the caller's own wallet to send from.
   * @type {string}
   **/
  #fromWalletId: string = "";
  /**
   * Unique id of the caller's own wallet to send from.
   * @returns {string}
   **/
  get fromWalletId() {
    return this.#fromWalletId;
  }
  /**
   * Unique id of the caller's own wallet to send from.
   * @type {string}
   **/
  set fromWalletId(value: string) {
    this.#fromWalletId = String(value);
  }
  setFromWalletId(value: string) {
    this.fromWalletId = value;
    return this;
  }
  /**
   * Unique id of the wallet to send funds to.
   * @type {string}
   **/
  #toWalletId: string = "";
  /**
   * Unique id of the wallet to send funds to.
   * @returns {string}
   **/
  get toWalletId() {
    return this.#toWalletId;
  }
  /**
   * Unique id of the wallet to send funds to.
   * @type {string}
   **/
  set toWalletId(value: string) {
    this.#toWalletId = String(value);
  }
  setToWalletId(value: string) {
    this.toWalletId = value;
    return this;
  }
  /**
   * Amount to transfer, as a positive minor-units decimal string.
   * @type {string}
   **/
  #amount: string = "";
  /**
   * Amount to transfer, as a positive minor-units decimal string.
   * @returns {string}
   **/
  get amount() {
    return this.#amount;
  }
  /**
   * Amount to transfer, as a positive minor-units decimal string.
   * @type {string}
   **/
  set amount(value: string) {
    this.#amount = String(value);
  }
  setAmount(value: string) {
    this.amount = value;
    return this;
  }
  /**
   * Optional human-readable note, recorded on both ledger entries.
   * @type {string}
   **/
  #note?: string | null | undefined = undefined;
  /**
   * Optional human-readable note, recorded on both ledger entries.
   * @returns {string}
   **/
  get note() {
    return this.#note;
  }
  /**
   * Optional human-readable note, recorded on both ledger entries.
   * @type {string}
   **/
  set note(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#note = correctType ? value : String(value);
  }
  setNote(value: string | null | undefined) {
    this.note = value;
    return this;
  }
  /**
   * Makes this transfer safe to retry.
   * @type {string}
   **/
  #idempotencyKey: string = "";
  /**
   * Makes this transfer safe to retry.
   * @returns {string}
   **/
  get idempotencyKey() {
    return this.#idempotencyKey;
  }
  /**
   * Makes this transfer safe to retry.
   * @type {string}
   **/
  set idempotencyKey(value: string) {
    this.#idempotencyKey = String(value);
  }
  setIdempotencyKey(value: string) {
    this.idempotencyKey = value;
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
    const d = data as Partial<TransferFundsActionReq>;
    if (d.fromWalletId !== undefined) {
      this.fromWalletId = d.fromWalletId;
    }
    if (d.toWalletId !== undefined) {
      this.toWalletId = d.toWalletId;
    }
    if (d.amount !== undefined) {
      this.amount = d.amount;
    }
    if (d.note !== undefined) {
      this.note = d.note;
    }
    if (d.idempotencyKey !== undefined) {
      this.idempotencyKey = d.idempotencyKey;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      fromWalletId: this.#fromWalletId,
      toWalletId: this.#toWalletId,
      amount: this.#amount,
      note: this.#note,
      idempotencyKey: this.#idempotencyKey,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      fromWalletId: "fromWalletId",
      toWalletId: "toWalletId",
      amount: "amount",
      note: "note",
      idempotencyKey: "idempotencyKey",
    };
  }
  /**
   * Creates an instance of TransferFundsActionReq, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: TransferFundsActionReqType) {
    return new TransferFundsActionReq(possibleDtoObject);
  }
  /**
   * Creates an instance of TransferFundsActionReq, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<TransferFundsActionReqType>) {
    return new TransferFundsActionReq(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<TransferFundsActionReqType>,
  ): InstanceType<typeof TransferFundsActionReq> {
    return new TransferFundsActionReq({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof TransferFundsActionReq> {
    return new TransferFundsActionReq(this.toJSON());
  }
}
export abstract class TransferFundsActionReqFactory {
  abstract create(data: unknown): TransferFundsActionReq;
}
/**
 * The base type definition for transferFundsActionReq
 **/
export type TransferFundsActionReqType = {
  /**
   * Unique id of the caller's own wallet to send from.
   * @type {string}
   **/
  fromWalletId: string;
  /**
   * Unique id of the wallet to send funds to.
   * @type {string}
   **/
  toWalletId: string;
  /**
   * Amount to transfer, as a positive minor-units decimal string.
   * @type {string}
   **/
  amount: string;
  /**
   * Optional human-readable note, recorded on both ledger entries.
   * @type {string}
   **/
  note?: string;
  /**
   * Makes this transfer safe to retry.
   * @type {string}
   **/
  idempotencyKey: string;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TransferFundsActionReqType {}
/**
 * The base class definition for transferFundsActionRes
 **/
export class TransferFundsActionRes {
  /**
   * The debit ledger entry recorded against fromWalletId.
   * @type {TransferFundsActionRes.FromTransaction}
   **/
  #fromTransaction!: InstanceType<
    typeof TransferFundsActionRes.FromTransaction
  >;
  /**
   * The debit ledger entry recorded against fromWalletId.
   * @returns {TransferFundsActionRes.FromTransaction}
   **/
  get fromTransaction() {
    return this.#fromTransaction;
  }
  /**
   * The debit ledger entry recorded against fromWalletId.
   * @type {TransferFundsActionRes.FromTransaction}
   **/
  set fromTransaction(
    value: InstanceType<typeof TransferFundsActionRes.FromTransaction>,
  ) {
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof TransferFundsActionRes.FromTransaction) {
      this.#fromTransaction = value;
    } else {
      this.#fromTransaction = new TransferFundsActionRes.FromTransaction(value);
    }
  }
  setFromTransaction(
    value: InstanceType<typeof TransferFundsActionRes.FromTransaction>,
  ) {
    this.fromTransaction = value;
    return this;
  }
  /**
   * The credit ledger entry recorded against toWalletId.
   * @type {TransferFundsActionRes.ToTransaction}
   **/
  #toTransaction!: InstanceType<typeof TransferFundsActionRes.ToTransaction>;
  /**
   * The credit ledger entry recorded against toWalletId.
   * @returns {TransferFundsActionRes.ToTransaction}
   **/
  get toTransaction() {
    return this.#toTransaction;
  }
  /**
   * The credit ledger entry recorded against toWalletId.
   * @type {TransferFundsActionRes.ToTransaction}
   **/
  set toTransaction(
    value: InstanceType<typeof TransferFundsActionRes.ToTransaction>,
  ) {
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof TransferFundsActionRes.ToTransaction) {
      this.#toTransaction = value;
    } else {
      this.#toTransaction = new TransferFundsActionRes.ToTransaction(value);
    }
  }
  setToTransaction(
    value: InstanceType<typeof TransferFundsActionRes.ToTransaction>,
  ) {
    this.toTransaction = value;
    return this;
  }
  /**
   * The base class definition for fromTransaction
   **/
  static FromTransaction = class FromTransaction {
    /**
     *
     * @type {string}
     **/
    #uniqueId: string = "";
    /**
     *
     * @returns {string}
     **/
    get uniqueId() {
      return this.#uniqueId;
    }
    /**
     *
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
    #amount: string = "";
    /**
     *
     * @returns {string}
     **/
    get amount() {
      return this.#amount;
    }
    /**
     *
     * @type {string}
     **/
    set amount(value: string) {
      this.#amount = String(value);
    }
    setAmount(value: string) {
      this.amount = value;
      return this;
    }
    /**
     *
     * @type {string}
     **/
    #balanceAfter: string = "";
    /**
     *
     * @returns {string}
     **/
    get balanceAfter() {
      return this.#balanceAfter;
    }
    /**
     *
     * @type {string}
     **/
    set balanceAfter(value: string) {
      this.#balanceAfter = String(value);
    }
    setBalanceAfter(value: string) {
      this.balanceAfter = value;
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
      const d = data as Partial<FromTransaction>;
      if (d.uniqueId !== undefined) {
        this.uniqueId = d.uniqueId;
      }
      if (d.amount !== undefined) {
        this.amount = d.amount;
      }
      if (d.balanceAfter !== undefined) {
        this.balanceAfter = d.balanceAfter;
      }
    }
    /**
     *	Special toJSON override, since the field are private,
     *	Json stringify won't see them unless we mention it explicitly.
     **/
    toJSON() {
      return {
        uniqueId: this.#uniqueId,
        amount: this.#amount,
        balanceAfter: this.#balanceAfter,
      };
    }
    toString() {
      return JSON.stringify(this);
    }
    static get Fields() {
      return {
        uniqueId: "uniqueId",
        amount: "amount",
        balanceAfter: "balanceAfter",
      };
    }
    /**
     * Creates an instance of TransferFundsActionRes.FromTransaction, and possibleDtoObject
     * needs to satisfy the type requirement fully, otherwise typescript compile would
     * be complaining.
     **/
    static from(
      possibleDtoObject: TransferFundsActionResType.FromTransactionType,
    ) {
      return new TransferFundsActionRes.FromTransaction(possibleDtoObject);
    }
    /**
     * Creates an instance of TransferFundsActionRes.FromTransaction, and partialDtoObject
     * needs to satisfy the type, but partially, and rest of the content would
     * be constructed according to data types and nullability.
     **/
    static with(
      partialDtoObject: PartialDeep<TransferFundsActionResType.FromTransactionType>,
    ) {
      return new TransferFundsActionRes.FromTransaction(partialDtoObject);
    }
    copyWith(
      partial: PartialDeep<TransferFundsActionResType.FromTransactionType>,
    ): InstanceType<typeof TransferFundsActionRes.FromTransaction> {
      return new TransferFundsActionRes.FromTransaction({
        ...this.toJSON(),
        ...partial,
      });
    }
    clone(): InstanceType<typeof TransferFundsActionRes.FromTransaction> {
      return new TransferFundsActionRes.FromTransaction(this.toJSON());
    }
  };
  /**
   * The base class definition for toTransaction
   **/
  static ToTransaction = class ToTransaction {
    /**
     *
     * @type {string}
     **/
    #uniqueId: string = "";
    /**
     *
     * @returns {string}
     **/
    get uniqueId() {
      return this.#uniqueId;
    }
    /**
     *
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
    #amount: string = "";
    /**
     *
     * @returns {string}
     **/
    get amount() {
      return this.#amount;
    }
    /**
     *
     * @type {string}
     **/
    set amount(value: string) {
      this.#amount = String(value);
    }
    setAmount(value: string) {
      this.amount = value;
      return this;
    }
    /**
     *
     * @type {string}
     **/
    #balanceAfter: string = "";
    /**
     *
     * @returns {string}
     **/
    get balanceAfter() {
      return this.#balanceAfter;
    }
    /**
     *
     * @type {string}
     **/
    set balanceAfter(value: string) {
      this.#balanceAfter = String(value);
    }
    setBalanceAfter(value: string) {
      this.balanceAfter = value;
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
      const d = data as Partial<ToTransaction>;
      if (d.uniqueId !== undefined) {
        this.uniqueId = d.uniqueId;
      }
      if (d.amount !== undefined) {
        this.amount = d.amount;
      }
      if (d.balanceAfter !== undefined) {
        this.balanceAfter = d.balanceAfter;
      }
    }
    /**
     *	Special toJSON override, since the field are private,
     *	Json stringify won't see them unless we mention it explicitly.
     **/
    toJSON() {
      return {
        uniqueId: this.#uniqueId,
        amount: this.#amount,
        balanceAfter: this.#balanceAfter,
      };
    }
    toString() {
      return JSON.stringify(this);
    }
    static get Fields() {
      return {
        uniqueId: "uniqueId",
        amount: "amount",
        balanceAfter: "balanceAfter",
      };
    }
    /**
     * Creates an instance of TransferFundsActionRes.ToTransaction, and possibleDtoObject
     * needs to satisfy the type requirement fully, otherwise typescript compile would
     * be complaining.
     **/
    static from(
      possibleDtoObject: TransferFundsActionResType.ToTransactionType,
    ) {
      return new TransferFundsActionRes.ToTransaction(possibleDtoObject);
    }
    /**
     * Creates an instance of TransferFundsActionRes.ToTransaction, and partialDtoObject
     * needs to satisfy the type, but partially, and rest of the content would
     * be constructed according to data types and nullability.
     **/
    static with(
      partialDtoObject: PartialDeep<TransferFundsActionResType.ToTransactionType>,
    ) {
      return new TransferFundsActionRes.ToTransaction(partialDtoObject);
    }
    copyWith(
      partial: PartialDeep<TransferFundsActionResType.ToTransactionType>,
    ): InstanceType<typeof TransferFundsActionRes.ToTransaction> {
      return new TransferFundsActionRes.ToTransaction({
        ...this.toJSON(),
        ...partial,
      });
    }
    clone(): InstanceType<typeof TransferFundsActionRes.ToTransaction> {
      return new TransferFundsActionRes.ToTransaction(this.toJSON());
    }
  };
  constructor(data: unknown = undefined) {
    if (data === null || data === undefined) {
      this.#lateInitFields();
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
    const d = data as Partial<TransferFundsActionRes>;
    if (d.fromTransaction !== undefined) {
      this.fromTransaction = d.fromTransaction;
    }
    if (d.toTransaction !== undefined) {
      this.toTransaction = d.toTransaction;
    }
    this.#lateInitFields(data);
  }
  /**
   * These are the class instances, which need to be initialised, regardless of the constructor incoming data
   **/
  #lateInitFields(data = {}) {
    const d = data as Partial<TransferFundsActionRes>;
    if (
      !(d.fromTransaction instanceof TransferFundsActionRes.FromTransaction)
    ) {
      this.fromTransaction = new TransferFundsActionRes.FromTransaction(
        d.fromTransaction || {},
      );
    }
    if (!(d.toTransaction instanceof TransferFundsActionRes.ToTransaction)) {
      this.toTransaction = new TransferFundsActionRes.ToTransaction(
        d.toTransaction || {},
      );
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      fromTransaction: this.#fromTransaction,
      toTransaction: this.#toTransaction,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      fromTransaction$: "fromTransaction",
      get fromTransaction() {
        return withPrefix(
          "fromTransaction",
          TransferFundsActionRes.FromTransaction.Fields,
        );
      },
      toTransaction$: "toTransaction",
      get toTransaction() {
        return withPrefix(
          "toTransaction",
          TransferFundsActionRes.ToTransaction.Fields,
        );
      },
    };
  }
  /**
   * Creates an instance of TransferFundsActionRes, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: TransferFundsActionResType) {
    return new TransferFundsActionRes(possibleDtoObject);
  }
  /**
   * Creates an instance of TransferFundsActionRes, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<TransferFundsActionResType>) {
    return new TransferFundsActionRes(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<TransferFundsActionResType>,
  ): InstanceType<typeof TransferFundsActionRes> {
    return new TransferFundsActionRes({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof TransferFundsActionRes> {
    return new TransferFundsActionRes(this.toJSON());
  }
}
export abstract class TransferFundsActionResFactory {
  abstract create(data: unknown): TransferFundsActionRes;
}
/**
 * The base type definition for transferFundsActionRes
 **/
export type TransferFundsActionResType = {
  /**
   * The debit ledger entry recorded against fromWalletId.
   * @type {TransferFundsActionResType.FromTransactionType}
   **/
  fromTransaction: TransferFundsActionResType.FromTransactionType;
  /**
   * The credit ledger entry recorded against toWalletId.
   * @type {TransferFundsActionResType.ToTransactionType}
   **/
  toTransaction: TransferFundsActionResType.ToTransactionType;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TransferFundsActionResType {
  /**
   * The base type definition for fromTransactionType
   **/
  export type FromTransactionType = {
    /**
     *
     * @type {string}
     **/
    uniqueId: string;
    /**
     *
     * @type {string}
     **/
    amount: string;
    /**
     *
     * @type {string}
     **/
    balanceAfter: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace FromTransactionType {}
  /**
   * The base type definition for toTransactionType
   **/
  export type ToTransactionType = {
    /**
     *
     * @type {string}
     **/
    uniqueId: string;
    /**
     *
     * @type {string}
     **/
    amount: string;
    /**
     *
     * @type {string}
     **/
    balanceAfter: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace ToTransactionType {}
}
