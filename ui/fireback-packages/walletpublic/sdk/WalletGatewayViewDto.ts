import { MJson } from "@fireback/complexes";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for walletGatewayViewDto
 **/
export class WalletGatewayViewDto {
  /**
   * Code identifying this gateway - pass as topup's gatewayCode.
   * @type {string}
   **/
  #code: string = "";
  /**
   * Code identifying this gateway - pass as topup's gatewayCode.
   * @returns {string}
   **/
  get code() {
    return this.#code;
  }
  /**
   * Code identifying this gateway - pass as topup's gatewayCode.
   * @type {string}
   **/
  set code(value: string) {
    this.#code = String(value);
  }
  setCode(value: string) {
    this.code = value;
    return this;
  }
  /**
   * Display name.
   * @type {string}
   **/
  #name: string = "";
  /**
   * Display name.
   * @returns {string}
   **/
  get name() {
    return this.#name;
  }
  /**
   * Display name.
   * @type {string}
   **/
  set name(value: string) {
    this.#name = String(value);
  }
  setName(value: string) {
    this.name = value;
    return this;
  }
  /**
   * Provider kind, e.g. stripe, przelewy24, blik, zarinpal.
   * @type {string}
   **/
  #kind: string = "";
  /**
   * Provider kind, e.g. stripe, przelewy24, blik, zarinpal.
   * @returns {string}
   **/
  get kind() {
    return this.#kind;
  }
  /**
   * Provider kind, e.g. stripe, przelewy24, blik, zarinpal.
   * @type {string}
   **/
  set kind(value: string) {
    this.#kind = String(value);
  }
  setKind(value: string) {
    this.kind = value;
    return this;
  }
  /**
   * JSON array of currency codes this gateway can top up wallets in.
   * @type {MJson}
   **/
  #supportedCurrencies!: MJson;
  /**
   * JSON array of currency codes this gateway can top up wallets in.
   * @returns {MJson}
   **/
  get supportedCurrencies() {
    return this.#supportedCurrencies;
  }
  /**
   * JSON array of currency codes this gateway can top up wallets in.
   * @type {MJson}
   **/
  set supportedCurrencies(value: MJson) {
    if (value instanceof MJson) {
      this.#supportedCurrencies = value;
    } else {
      this.#supportedCurrencies = new MJson(value);
    }
  }
  setSupportedCurrencies(value: MJson) {
    this.supportedCurrencies = value;
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
    const d = data as Partial<WalletGatewayViewDto>;
    if (d.code !== undefined) {
      this.code = d.code;
    }
    if (d.name !== undefined) {
      this.name = d.name;
    }
    if (d.kind !== undefined) {
      this.kind = d.kind;
    }
    if (d.supportedCurrencies !== undefined) {
      this.supportedCurrencies = d.supportedCurrencies;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      code: this.#code,
      name: this.#name,
      kind: this.#kind,
      supportedCurrencies: this.#supportedCurrencies,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      code: "code",
      name: "name",
      kind: "kind",
      supportedCurrencies: "supportedCurrencies",
    };
  }
  /**
   * Creates an instance of WalletGatewayViewDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: WalletGatewayViewDtoType) {
    return new WalletGatewayViewDto(possibleDtoObject);
  }
  /**
   * Creates an instance of WalletGatewayViewDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<WalletGatewayViewDtoType>) {
    return new WalletGatewayViewDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<WalletGatewayViewDtoType>,
  ): InstanceType<typeof WalletGatewayViewDto> {
    return new WalletGatewayViewDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof WalletGatewayViewDto> {
    return new WalletGatewayViewDto(this.toJSON());
  }
}
export abstract class WalletGatewayViewDtoFactory {
  abstract create(data: unknown): WalletGatewayViewDto;
}
/**
 * The base type definition for walletGatewayViewDto
 **/
export type WalletGatewayViewDtoType = {
  /**
   * Code identifying this gateway - pass as topup's gatewayCode.
   * @type {string}
   **/
  code: string;
  /**
   * Display name.
   * @type {string}
   **/
  name: string;
  /**
   * Provider kind, e.g. stripe, przelewy24, blik, zarinpal.
   * @type {string}
   **/
  kind: string;
  /**
   * JSON array of currency codes this gateway can top up wallets in.
   * @type {MJson}
   **/
  supportedCurrencies: MJson;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace WalletGatewayViewDtoType {}
