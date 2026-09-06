import { GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import { MJson, TString } from "@fireback/complexes";
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
/**
 * Action to communicate with the action checkPrepaid
 */
export type CheckPrepaidActionOptions = {
  queryKey?: unknown[];
  qs?: CheckPrepaidActionQueryParams;
};
export type CheckPrepaidActionQueryOptions = Omit<
  UseQueryOptions<
    unknown,
    unknown,
    GResponse<CheckPrepaidActionRes>,
    unknown[]
  >,
  "queryKey"
> &
  CheckPrepaidActionOptions &
  Partial<{
    creatorFn: (item: unknown) => CheckPrepaidActionRes;
  }> & {
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
    ctx?: FetchxContext | null;
  };
export const useCheckPrepaidActionQuery = (
  options: CheckPrepaidActionQueryOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = () => {
    setCompleteState(false);
    return CheckPrepaidAction.Fetch(
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
    queryKey: [CheckPrepaidAction.NewUrl(options?.qs)],
    queryFn: fn,
    ...(options || {}),
  });
  return {
    ...result,
    isCompleted,
    response,
  };
};
export type CheckPrepaidActionMutationOptions = Omit<
  UseMutationOptions<unknown, unknown, unknown, unknown>,
  "mutationFn"
> &
  CheckPrepaidActionOptions & {
    ctx?: FetchxContext | null;
    onMessage?: (ev: MessageEvent) => void;
    overrideUrl?: string;
    headers?: Headers;
  } & Partial<{
    creatorFn: (item: unknown) => CheckPrepaidActionRes;
  }>;
export const useCheckPrepaidAction = (
  options?: CheckPrepaidActionMutationOptions,
) => {
  const globalCtx = useFetchxContext();
  const ctx = options?.ctx ?? globalCtx ?? undefined;
  const [isCompleted, setCompleteState] = useState(false);
  const [response, setResponse] = useState<TypedResponse<unknown>>();
  const fn = (body: unknown) => {
    setCompleteState(false);
    return CheckPrepaidAction.Fetch(
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
 * CheckPrepaidAction
 */
export class CheckPrepaidAction {
  //
  static URL = "/wallet/prepaid/check";
  static NewUrl = (qs?: CheckPrepaidActionQueryParams) =>
    buildUrl(CheckPrepaidAction.URL, undefined, qs);
  static Method = "GET";
  static Fetch$ = async (
    qs?: CheckPrepaidActionQueryParams,
    ctx?: FetchxContext | null,
    init?: TypedRequestInit<unknown, unknown>,
    overrideUrl?: string,
  ) => {
    return fetchx<GResponse<CheckPrepaidActionRes>, unknown, unknown>(
      overrideUrl ?? CheckPrepaidAction.NewUrl(qs),
      {
        method: CheckPrepaidAction.Method,
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
      creatorFn?: ((item: unknown) => CheckPrepaidActionRes) | undefined;
      qs?: CheckPrepaidActionQueryParams;
      ctx?: FetchxContext | null;
      onMessage?: (ev: MessageEvent) => void;
      overrideUrl?: string;
    } = {
      creatorFn: (item) => new CheckPrepaidActionRes(item),
    },
  ) => {
    creatorFn = creatorFn || ((item) => new CheckPrepaidActionRes(item));
    const res = await CheckPrepaidAction.Fetch$(qs, ctx, init, overrideUrl);
    return handleFetchResponse(
      res,
      (data) => {
        const resp = new GResponse<CheckPrepaidActionRes>();
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
    name: "checkPrepaid",
    cliShort: "prepaid-check",
    url: "/wallet/prepaid/check",
    method: "get",
    qs: [
      {
        name: "redeemKey",
        type: "string",
      },
    ],
    description:
      "Looks up a prepaid gift card by its redeemKey and reports whether redeemPrepaid would currently succeed for it, along with a translated summary and its declared details (amount/currency/locations/ isExchangeable/metadata). Never reveals redeemKey itself, or which wallet redeemed it if already redeemed. Public - no login required, matching the redeemKey itself being the only real secret in this flow (same reasoning as CheckPassportMethodsAction being public).",
    out: {
      envelope: "GResponse",
      fields: [
        {
          name: "redeemable",
          description:
            "Whether redeemPrepaid would currently succeed for this key.",
          type: "bool",
        },
        {
          name: "status",
          description:
            '"active", "redeemed", or "disabled" - empty if redeemKey doesn\'t match any prepaid card at all.',
          type: "string?",
        },
        {
          name: "amount",
          description:
            "Face value as a minor-units decimal string, if the key matched.",
          type: "string?",
        },
        {
          name: "currency",
          description:
            "Currency code this card is denominated in, if the key matched.",
          type: "string?",
        },
        {
          name: "isExchangeable",
          description:
            "Informational only - see prepaid.isExchangeable's own doc comment on Wallet.emi.yml.",
          type: "bool?",
        },
        {
          name: "locations",
          description:
            "JSON array of location codes/names this card can be used at, if any were set.",
          type: "complex",
          complex: "MJson",
        },
        {
          name: "metadata",
          description:
            "Extra structured data root attached to this card, if any.",
          type: "complex",
          complex: "MJson",
        },
        {
          name: "message",
          description:
            "Human-readable, translated summary of this card's details, or of why it can't currently be redeemed (unknown key / already redeemed / disabled) - e.g. \"This gift card is worth 5000 USD.\"",
          type: "complex",
          complex: "TString",
        },
      ],
    },
  };
}
/**
 * The base class definition for checkPrepaidActionRes
 **/
export class CheckPrepaidActionRes {
  /**
   * Whether redeemPrepaid would currently succeed for this key.
   * @type {boolean}
   **/
  #redeemable!: boolean;
  /**
   * Whether redeemPrepaid would currently succeed for this key.
   * @returns {boolean}
   **/
  get redeemable() {
    return this.#redeemable;
  }
  /**
   * Whether redeemPrepaid would currently succeed for this key.
   * @type {boolean}
   **/
  set redeemable(value: boolean) {
    this.#redeemable = Boolean(value);
  }
  setRedeemable(value: boolean) {
    this.redeemable = value;
    return this;
  }
  /**
   * "active", "redeemed", or "disabled" - empty if redeemKey doesn't match any prepaid card at all.
   * @type {string}
   **/
  #status?: string | null | undefined = undefined;
  /**
   * "active", "redeemed", or "disabled" - empty if redeemKey doesn't match any prepaid card at all.
   * @returns {string}
   **/
  get status() {
    return this.#status;
  }
  /**
   * "active", "redeemed", or "disabled" - empty if redeemKey doesn't match any prepaid card at all.
   * @type {string}
   **/
  set status(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#status = correctType ? value : String(value);
  }
  setStatus(value: string | null | undefined) {
    this.status = value;
    return this;
  }
  /**
   * Face value as a minor-units decimal string, if the key matched.
   * @type {string}
   **/
  #amount?: string | null | undefined = undefined;
  /**
   * Face value as a minor-units decimal string, if the key matched.
   * @returns {string}
   **/
  get amount() {
    return this.#amount;
  }
  /**
   * Face value as a minor-units decimal string, if the key matched.
   * @type {string}
   **/
  set amount(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#amount = correctType ? value : String(value);
  }
  setAmount(value: string | null | undefined) {
    this.amount = value;
    return this;
  }
  /**
   * Currency code this card is denominated in, if the key matched.
   * @type {string}
   **/
  #currency?: string | null | undefined = undefined;
  /**
   * Currency code this card is denominated in, if the key matched.
   * @returns {string}
   **/
  get currency() {
    return this.#currency;
  }
  /**
   * Currency code this card is denominated in, if the key matched.
   * @type {string}
   **/
  set currency(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#currency = correctType ? value : String(value);
  }
  setCurrency(value: string | null | undefined) {
    this.currency = value;
    return this;
  }
  /**
   * Informational only - see prepaid.isExchangeable's own doc comment on Wallet.emi.yml.
   * @type {boolean}
   **/
  #isExchangeable?: boolean | null | undefined = undefined;
  /**
   * Informational only - see prepaid.isExchangeable's own doc comment on Wallet.emi.yml.
   * @returns {boolean}
   **/
  get isExchangeable() {
    return this.#isExchangeable;
  }
  /**
   * Informational only - see prepaid.isExchangeable's own doc comment on Wallet.emi.yml.
   * @type {boolean}
   **/
  set isExchangeable(value: boolean | null | undefined) {
    const correctType =
      value === true ||
      value === false ||
      value === undefined ||
      value === null;
    this.#isExchangeable = correctType ? value : Boolean(value);
  }
  setIsExchangeable(value: boolean | null | undefined) {
    this.isExchangeable = value;
    return this;
  }
  /**
   * JSON array of location codes/names this card can be used at, if any were set.
   * @type {MJson}
   **/
  #locations!: MJson;
  /**
   * JSON array of location codes/names this card can be used at, if any were set.
   * @returns {MJson}
   **/
  get locations() {
    return this.#locations;
  }
  /**
   * JSON array of location codes/names this card can be used at, if any were set.
   * @type {MJson}
   **/
  set locations(value: MJson) {
    if (value instanceof MJson) {
      this.#locations = value;
    } else {
      this.#locations = new MJson(value);
    }
  }
  setLocations(value: MJson) {
    this.locations = value;
    return this;
  }
  /**
   * Extra structured data root attached to this card, if any.
   * @type {MJson}
   **/
  #metadata!: MJson;
  /**
   * Extra structured data root attached to this card, if any.
   * @returns {MJson}
   **/
  get metadata() {
    return this.#metadata;
  }
  /**
   * Extra structured data root attached to this card, if any.
   * @type {MJson}
   **/
  set metadata(value: MJson) {
    if (value instanceof MJson) {
      this.#metadata = value;
    } else {
      this.#metadata = new MJson(value);
    }
  }
  setMetadata(value: MJson) {
    this.metadata = value;
    return this;
  }
  /**
   * Human-readable, translated summary of this card's details, or of why it can't currently be redeemed (unknown key / already redeemed / disabled) - e.g. "This gift card is worth 5000 USD."
   * @type {TString}
   **/
  #message!: TString;
  /**
   * Human-readable, translated summary of this card's details, or of why it can't currently be redeemed (unknown key / already redeemed / disabled) - e.g. "This gift card is worth 5000 USD."
   * @returns {TString}
   **/
  get message() {
    return this.#message;
  }
  /**
   * Human-readable, translated summary of this card's details, or of why it can't currently be redeemed (unknown key / already redeemed / disabled) - e.g. "This gift card is worth 5000 USD."
   * @type {TString}
   **/
  set message(value: TString) {
    if (value instanceof TString) {
      this.#message = value;
    } else {
      this.#message = new TString(value);
    }
  }
  setMessage(value: TString) {
    this.message = value;
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
    const d = data as Partial<CheckPrepaidActionRes>;
    if (d.redeemable !== undefined) {
      this.redeemable = d.redeemable;
    }
    if (d.status !== undefined) {
      this.status = d.status;
    }
    if (d.amount !== undefined) {
      this.amount = d.amount;
    }
    if (d.currency !== undefined) {
      this.currency = d.currency;
    }
    if (d.isExchangeable !== undefined) {
      this.isExchangeable = d.isExchangeable;
    }
    if (d.locations !== undefined) {
      this.locations = d.locations;
    }
    if (d.metadata !== undefined) {
      this.metadata = d.metadata;
    }
    if (d.message !== undefined) {
      this.message = d.message;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      redeemable: this.#redeemable,
      status: this.#status,
      amount: this.#amount,
      currency: this.#currency,
      isExchangeable: this.#isExchangeable,
      locations: this.#locations,
      metadata: this.#metadata,
      message: this.#message,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      redeemable: "redeemable",
      status: "status",
      amount: "amount",
      currency: "currency",
      isExchangeable: "isExchangeable",
      locations: "locations",
      metadata: "metadata",
      message: "message",
    };
  }
  /**
   * Creates an instance of CheckPrepaidActionRes, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: CheckPrepaidActionResType) {
    return new CheckPrepaidActionRes(possibleDtoObject);
  }
  /**
   * Creates an instance of CheckPrepaidActionRes, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<CheckPrepaidActionResType>) {
    return new CheckPrepaidActionRes(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<CheckPrepaidActionResType>,
  ): InstanceType<typeof CheckPrepaidActionRes> {
    return new CheckPrepaidActionRes({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof CheckPrepaidActionRes> {
    return new CheckPrepaidActionRes(this.toJSON());
  }
}
export abstract class CheckPrepaidActionResFactory {
  abstract create(data: unknown): CheckPrepaidActionRes;
}
/**
 * The base type definition for checkPrepaidActionRes
 **/
export type CheckPrepaidActionResType = {
  /**
   * Whether redeemPrepaid would currently succeed for this key.
   * @type {boolean}
   **/
  redeemable: boolean;
  /**
   * "active", "redeemed", or "disabled" - empty if redeemKey doesn't match any prepaid card at all.
   * @type {string}
   **/
  status?: string;
  /**
   * Face value as a minor-units decimal string, if the key matched.
   * @type {string}
   **/
  amount?: string;
  /**
   * Currency code this card is denominated in, if the key matched.
   * @type {string}
   **/
  currency?: string;
  /**
   * Informational only - see prepaid.isExchangeable's own doc comment on Wallet.emi.yml.
   * @type {boolean}
   **/
  isExchangeable?: boolean;
  /**
   * JSON array of location codes/names this card can be used at, if any were set.
   * @type {MJson}
   **/
  locations: MJson;
  /**
   * Extra structured data root attached to this card, if any.
   * @type {MJson}
   **/
  metadata: MJson;
  /**
   * Human-readable, translated summary of this card's details, or of why it can't currently be redeemed (unknown key / already redeemed / disabled) - e.g. "This gift card is worth 5000 USD."
   * @type {TString}
   **/
  message: TString;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CheckPrepaidActionResType {}
/**
 * CheckPrepaidActionQueryParams class
 * Auto-generated from EmiAction
 */
export class CheckPrepaidActionQueryParams extends URLSearchParamsX {
  /**
   *
   * @returns { string | null }
   */
  getRedeemKey() {
    return this.getTyped("redeemKey", "string | null");
  }
  /**
   *
   * @param { string | null } value
   */
  setRedeemKey(value: string | null) {
    this.set("redeemKey", value);
    return this;
  }
}
