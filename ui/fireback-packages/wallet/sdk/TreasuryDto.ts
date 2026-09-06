import { MOne } from "@fireback/js-remote-ctx/common/operators";
import { TString } from "@fireback/complexes";
import { WalletDto } from "./WalletDto";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for treasuryDto
 **/
export class TreasuryDto {
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
   * Display name, as a locale -> text map (e.g. {"en": "EU Ad Budget", "fa": "بودجه تبلیغات اروپا"}).
   * @type {TString}
   **/
  #name!: TString;
  /**
   * Display name, as a locale -> text map (e.g. {"en": "EU Ad Budget", "fa": "بودجه تبلیغات اروپا"}).
   * @returns {TString}
   **/
  get name() {
    return this.#name;
  }
  /**
   * Display name, as a locale -> text map (e.g. {"en": "EU Ad Budget", "fa": "بودجه تبلیغات اروپا"}).
   * @type {TString}
   **/
  set name(value: TString) {
    if (value instanceof TString) {
      this.#name = value;
    } else {
      this.#name = new TString(value);
    }
  }
  setName(value: TString) {
    this.name = value;
    return this;
  }
  /**
   * Optional longer description, as a locale -> text map.
   * @type {TString}
   **/
  #description!: TString;
  /**
   * Optional longer description, as a locale -> text map.
   * @returns {TString}
   **/
  get description() {
    return this.#description;
  }
  /**
   * Optional longer description, as a locale -> text map.
   * @type {TString}
   **/
  set description(value: TString) {
    if (value instanceof TString) {
      this.#description = value;
    } else {
      this.#description = new TString(value);
    }
  }
  setDescription(value: TString) {
    this.description = value;
    return this;
  }
  /**
   * The wallet this treasury's funds actually live in. Must already exist (created via the regular wallet admin tooling, e.g. adminCreateWallet) and is only ever linked here by uniqueId ("select") - never created inline, and never implicitly created by this entity's own create action.
   * @type {WalletDto}
   **/
  #wallet?: MOne<WalletDto> | null | undefined = undefined;
  /**
   * The wallet this treasury's funds actually live in. Must already exist (created via the regular wallet admin tooling, e.g. adminCreateWallet) and is only ever linked here by uniqueId ("select") - never created inline, and never implicitly created by this entity's own create action.
   * @returns {WalletDto}
   **/
  get wallet() {
    return this.#wallet;
  }
  /**
   * The wallet this treasury's funds actually live in. Must already exist (created via the regular wallet admin tooling, e.g. adminCreateWallet) and is only ever linked here by uniqueId ("select") - never created inline, and never implicitly created by this entity's own create action.
   * @type {WalletDto}
   **/
  set wallet(
    value:
      | MOne<WalletDto>
      | null
      | undefined
      | InstanceType<typeof WalletDto>
      | null
      | undefined,
  ) {
    // For a nullable relation, a literal null is a deliberate "clear"
    // signal and has to stay null - not fall through to the else branch
    // below and become MOne.of(new WalletDto(null)) (the
    // constructor tolerates a null/undefined argument by returning an
    // empty-but-non-null instance), which serializes as an empty object
    // instead of null. The backend tells "explicitly cleared" apart from
    // "field left untouched" (an absent key) only by seeing a real null
    // on the wire, the same way every other nullable field here (array?,
    // collection?) already short-circuits on null/undefined above.
    if (value === null || value === undefined) {
      this.#wallet = value === null ? null : undefined;
      return;
    }
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof MOne) {
      this.#wallet = value;
    } else if (value instanceof WalletDto) {
      this.#wallet = MOne.of(value);
    } else {
      this.#wallet = MOne.of(new WalletDto(value));
    }
  }
  setWallet(
    value:
      | MOne<WalletDto>
      | null
      | undefined
      | InstanceType<typeof WalletDto>
      | null
      | undefined,
  ) {
    this.wallet = value;
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
    const d = data as Partial<TreasuryDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.name !== undefined) {
      this.name = d.name;
    }
    if (d.description !== undefined) {
      this.description = d.description;
    }
    if (d.wallet !== undefined) {
      this.wallet = d.wallet;
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
      description: this.#description,
      wallet: this.#wallet,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      name: "name",
      description: "description",
      wallet: "wallet",
    };
  }
  /**
   * Creates an instance of TreasuryDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: TreasuryDtoType) {
    return new TreasuryDto(possibleDtoObject);
  }
  /**
   * Creates an instance of TreasuryDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<TreasuryDtoType>) {
    return new TreasuryDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<TreasuryDtoType>,
  ): InstanceType<typeof TreasuryDto> {
    return new TreasuryDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof TreasuryDto> {
    return new TreasuryDto(this.toJSON());
  }
}
export abstract class TreasuryDtoFactory {
  abstract create(data: unknown): TreasuryDto;
}
/**
 * The base type definition for treasuryDto
 **/
export type TreasuryDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   * Display name, as a locale -> text map (e.g. {"en": "EU Ad Budget", "fa": "بودجه تبلیغات اروپا"}).
   * @type {TString}
   **/
  name: TString;
  /**
   * Optional longer description, as a locale -> text map.
   * @type {TString}
   **/
  description: TString;
  /**
   * The wallet this treasury's funds actually live in. Must already exist (created via the regular wallet admin tooling, e.g. adminCreateWallet) and is only ever linked here by uniqueId ("select") - never created inline, and never implicitly created by this entity's own create action.
   * @type {WalletDto}
   **/
  wallet?: WalletDto;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TreasuryDtoType {}
