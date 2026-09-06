import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for walletCurrencyViewDto
 **/
export class WalletCurrencyViewDto {
  /**
   * Currency code - pass as createWallet's currency.
   * @type {string}
   **/
  #code: string = "";
  /**
   * Currency code - pass as createWallet's currency.
   * @returns {string}
   **/
  get code() {
    return this.#code;
  }
  /**
   * Currency code - pass as createWallet's currency.
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
   * Optional display symbol, e.g. $ or ₿.
   * @type {string}
   **/
  #symbol?: string | null | undefined = undefined;
  /**
   * Optional display symbol, e.g. $ or ₿.
   * @returns {string}
   **/
  get symbol() {
    return this.#symbol;
  }
  /**
   * Optional display symbol, e.g. $ or ₿.
   * @type {string}
   **/
  set symbol(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#symbol = correctType ? value : String(value);
  }
  setSymbol(value: string | null | undefined) {
    this.symbol = value;
    return this;
  }
  /**
   * Minor-unit precision, e.g. 2 for USD.
   * @type {number}
   **/
  #decimals: number = 0;
  /**
   * Minor-unit precision, e.g. 2 for USD.
   * @returns {number}
   **/
  get decimals() {
    return this.#decimals;
  }
  /**
   * Minor-unit precision, e.g. 2 for USD.
   * @type {number}
   **/
  set decimals(value: number) {
    const correctType = typeof value === "number";
    const parsedValue = correctType ? value : Number(value);
    if (!Number.isNaN(parsedValue)) {
      this.#decimals = parsedValue;
    }
  }
  setDecimals(value: number) {
    this.decimals = value;
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
    const d = data as Partial<WalletCurrencyViewDto>;
    if (d.code !== undefined) {
      this.code = d.code;
    }
    if (d.name !== undefined) {
      this.name = d.name;
    }
    if (d.symbol !== undefined) {
      this.symbol = d.symbol;
    }
    if (d.decimals !== undefined) {
      this.decimals = d.decimals;
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
      symbol: this.#symbol,
      decimals: this.#decimals,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      code: "code",
      name: "name",
      symbol: "symbol",
      decimals: "decimals",
    };
  }
  /**
   * Creates an instance of WalletCurrencyViewDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: WalletCurrencyViewDtoType) {
    return new WalletCurrencyViewDto(possibleDtoObject);
  }
  /**
   * Creates an instance of WalletCurrencyViewDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<WalletCurrencyViewDtoType>) {
    return new WalletCurrencyViewDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<WalletCurrencyViewDtoType>,
  ): InstanceType<typeof WalletCurrencyViewDto> {
    return new WalletCurrencyViewDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof WalletCurrencyViewDto> {
    return new WalletCurrencyViewDto(this.toJSON());
  }
}
export abstract class WalletCurrencyViewDtoFactory {
  abstract create(data: unknown): WalletCurrencyViewDto;
}
/**
 * The base type definition for walletCurrencyViewDto
 **/
export type WalletCurrencyViewDtoType = {
  /**
   * Currency code - pass as createWallet's currency.
   * @type {string}
   **/
  code: string;
  /**
   * Display name.
   * @type {string}
   **/
  name: string;
  /**
   * Optional display symbol, e.g. $ or ₿.
   * @type {string}
   **/
  symbol?: string;
  /**
   * Minor-unit precision, e.g. 2 for USD.
   * @type {number}
   **/
  decimals: number;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace WalletCurrencyViewDtoType {}
