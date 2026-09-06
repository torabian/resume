import { TMoney } from "@fireback/complexes";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for walletProductDto
 **/
export class WalletProductDto {
  /**
   *
   * @type {string}
   **/
  #uniqueId?: string | null | undefined = undefined;
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
  set uniqueId(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#uniqueId = correctType ? value : String(value);
  }
  setUniqueId(value: string | null | undefined) {
    this.uniqueId = value;
    return this;
  }
  /**
   * Display name of the product.
   * @type {string}
   **/
  #name: string = "";
  /**
   * Display name of the product.
   * @returns {string}
   **/
  get name() {
    return this.#name;
  }
  /**
   * Display name of the product.
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
   * Price of this product, one amount per currency it's sold in. Not every currency needs an entry - purchase falls back the same way TMoney.Get does (see complexes/TMoney.go) when the buyer's wallet currency has no explicit price set.
   * @type {TMoney}
   **/
  #price!: TMoney;
  /**
   * Price of this product, one amount per currency it's sold in. Not every currency needs an entry - purchase falls back the same way TMoney.Get does (see complexes/TMoney.go) when the buyer's wallet currency has no explicit price set.
   * @returns {TMoney}
   **/
  get price() {
    return this.#price;
  }
  /**
   * Price of this product, one amount per currency it's sold in. Not every currency needs an entry - purchase falls back the same way TMoney.Get does (see complexes/TMoney.go) when the buyer's wallet currency has no explicit price set.
   * @type {TMoney}
   **/
  set price(value: TMoney) {
    if (value instanceof TMoney) {
      this.#price = value;
    } else {
      this.#price = new TMoney(value);
    }
  }
  setPrice(value: TMoney) {
    this.price = value;
    return this;
  }
  /**
   * Whether this product can currently be purchased.
   * @type {boolean}
   **/
  #isActive: boolean = true;
  /**
   * Whether this product can currently be purchased.
   * @returns {boolean}
   **/
  get isActive() {
    return this.#isActive;
  }
  /**
   * Whether this product can currently be purchased.
   * @type {boolean}
   **/
  set isActive(value: boolean) {
    this.#isActive = Boolean(value);
  }
  setIsActive(value: boolean) {
    this.isActive = value;
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
    const d = data as Partial<WalletProductDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.name !== undefined) {
      this.name = d.name;
    }
    if (d.price !== undefined) {
      this.price = d.price;
    }
    if (d.isActive !== undefined) {
      this.isActive = d.isActive;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      uniqueId: this.#uniqueId,
      name: this.#name,
      price: this.#price,
      isActive: this.#isActive,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      name: "name",
      price: "price",
      isActive: "isActive",
    };
  }
  /**
   * Creates an instance of WalletProductDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: WalletProductDtoType) {
    return new WalletProductDto(possibleDtoObject);
  }
  /**
   * Creates an instance of WalletProductDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<WalletProductDtoType>) {
    return new WalletProductDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<WalletProductDtoType>,
  ): InstanceType<typeof WalletProductDto> {
    return new WalletProductDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof WalletProductDto> {
    return new WalletProductDto(this.toJSON());
  }
}
export abstract class WalletProductDtoFactory {
  abstract create(data: unknown): WalletProductDto;
}
/**
 * The base type definition for walletProductDto
 **/
export type WalletProductDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   * Display name of the product.
   * @type {string}
   **/
  name: string;
  /**
   * Price of this product, one amount per currency it's sold in. Not every currency needs an entry - purchase falls back the same way TMoney.Get does (see complexes/TMoney.go) when the buyer's wallet currency has no explicit price set.
   * @type {TMoney}
   **/
  price: TMoney;
  /**
   * Whether this product can currently be purchased.
   * @type {boolean}
   **/
  isActive: boolean;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace WalletProductDtoType {}
