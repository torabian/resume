import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { WalletTransactionDto } from "./WalletTransactionDto";
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
 * Action to communicate with the action fundTreasury
 */
export type FundTreasuryActionOptions = {
  queryKey?: unknown[];
  qs?: URLSearchParams;
};
export type FundTreasuryActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  FundTreasuryActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => WalletTransactionDto;
  }>;
export const useFundTreasuryAction = (
  options?: FundTreasuryActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: FundTreasuryActionReq) => {
    setCompleteState(false);
    return FundTreasuryAction.Fetch(
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
 * FundTreasuryAction
 */
export class FundTreasuryAction {
  //
  static URL = "/wallet/treasury/fund";
  static NewUrl = (qs?: URLSearchParams) =>
    buildUrl(FundTreasuryAction.URL, undefined, qs);
  static Method = "POST";
  static Fetch$ = async (
    qs?: URLSearchParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<FundTreasuryActionReq, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<
      GResponse<WalletTransactionDto>,
      FundTreasuryActionReq,
      unknown
    >(
      overrideUrl ?? FundTreasuryAction.NewUrl(qs),
      {
        method: FundTreasuryAction.Method,
        ...(init || {}),
      },
      ctx,
    );
  };
  static Fetch = async (
    init?: TypedRequestInit<FundTreasuryActionReq, unknown>,
    {
      creatorFn,
      qs,
      ctx,
      onMessage,
      overrideUrl,
    }: {
      creatorFn?: ((item: unknown) => WalletTransactionDto) | undefined;
      qs?: URLSearchParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new WalletTransactionDto(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new WalletTransactionDto(item));
    const res = await FundTreasuryAction.Fetch$(qs, ctx, init, overrideUrl);
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<WalletTransactionDto>();
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
    name: "fundTreasury",
    cliShort: "fund-treasury",
    url: "/wallet/treasury/fund",
    method: "post",
    description:
      'Root-only: credits a treasury\'s linked wallet - the one deliberate, audited "capital injection" a treasury exists for (see the treasury entity\'s own doc comment). Runs through the same locked-transaction ledger path as adjustBalance/purchase; reason on the resulting ledger entry is always "treasury_funding". Always requires a note, same as adjustBalance.',
    in: {
      fields: [
        {
          name: "treasuryId",
          description: "Unique id of the treasury to fund.",
          type: "string",
          tags: {
            validate: "required",
          },
        },
        {
          name: "amount",
          description: "Amount to credit, as a positive minor-units string.",
          type: "string",
          tags: {
            validate: "required",
          },
        },
        {
          name: "note",
          description:
            "Required human explanation of why this treasury is being funded.",
          type: "string",
          tags: {
            validate: "required",
          },
        },
        {
          name: "idempotencyKey",
          description:
            "Makes this funding call safe to retry without double-crediting.",
          type: "string",
          tags: {
            validate: "required",
          },
        },
      ],
    },
    out: {
      envelope: "GResponse",
      dto: "WalletTransactionDto",
    },
  };
}
/**
 * The base class definition for fundTreasuryActionReq
 **/
export class FundTreasuryActionReq {
  /**
   * Unique id of the treasury to fund.
   * @type {string}
   **/
  #treasuryId: string = "";
  /**
   * Unique id of the treasury to fund.
   * @returns {string}
   **/
  get treasuryId() {
    return this.#treasuryId;
  }
  /**
   * Unique id of the treasury to fund.
   * @type {string}
   **/
  set treasuryId(value: string) {
    this.#treasuryId = String(value);
  }
  setTreasuryId(value: string) {
    this.treasuryId = value;
    return this;
  }
  /**
   * Amount to credit, as a positive minor-units string.
   * @type {string}
   **/
  #amount: string = "";
  /**
   * Amount to credit, as a positive minor-units string.
   * @returns {string}
   **/
  get amount() {
    return this.#amount;
  }
  /**
   * Amount to credit, as a positive minor-units string.
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
   * Required human explanation of why this treasury is being funded.
   * @type {string}
   **/
  #note: string = "";
  /**
   * Required human explanation of why this treasury is being funded.
   * @returns {string}
   **/
  get note() {
    return this.#note;
  }
  /**
   * Required human explanation of why this treasury is being funded.
   * @type {string}
   **/
  set note(value: string) {
    this.#note = String(value);
  }
  setNote(value: string) {
    this.note = value;
    return this;
  }
  /**
   * Makes this funding call safe to retry without double-crediting.
   * @type {string}
   **/
  #idempotencyKey: string = "";
  /**
   * Makes this funding call safe to retry without double-crediting.
   * @returns {string}
   **/
  get idempotencyKey() {
    return this.#idempotencyKey;
  }
  /**
   * Makes this funding call safe to retry without double-crediting.
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
    const d = data as Partial<FundTreasuryActionReq>;
    if (d.treasuryId !== undefined) {
      this.treasuryId = d.treasuryId;
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
      treasuryId: this.#treasuryId,
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
      treasuryId: "treasuryId",
      amount: "amount",
      note: "note",
      idempotencyKey: "idempotencyKey",
    };
  }
  /**
   * Creates an instance of FundTreasuryActionReq, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: FundTreasuryActionReqType) {
    return new FundTreasuryActionReq(possibleDtoObject);
  }
  /**
   * Creates an instance of FundTreasuryActionReq, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<FundTreasuryActionReqType>) {
    return new FundTreasuryActionReq(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<FundTreasuryActionReqType>,
  ): InstanceType<typeof FundTreasuryActionReq> {
    return new FundTreasuryActionReq({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof FundTreasuryActionReq> {
    return new FundTreasuryActionReq(this.toJSON());
  }
}
export abstract class FundTreasuryActionReqFactory {
  abstract create(data: unknown): FundTreasuryActionReq;
}
/**
 * The base type definition for fundTreasuryActionReq
 **/
export type FundTreasuryActionReqType = {
  /**
   * Unique id of the treasury to fund.
   * @type {string}
   **/
  treasuryId: string;
  /**
   * Amount to credit, as a positive minor-units string.
   * @type {string}
   **/
  amount: string;
  /**
   * Required human explanation of why this treasury is being funded.
   * @type {string}
   **/
  note: string;
  /**
   * Makes this funding call safe to retry without double-crediting.
   * @type {string}
   **/
  idempotencyKey: string;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FundTreasuryActionReqType {}
