import { MArray, MOne } from "@fireback/js-remote-ctx/common/operators";
import { WalletCurrencyDto as WalletCurrencyEntity } from "./WalletCurrencyDto";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
import { withPrefix } from "@fireback/js-remote-ctx/common/withPrefix";
/**
 * The base class definition for walletConfigDto
 **/
export class WalletConfigDto {
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
   * Maximum number of wallets a single user may own in total, across all currencies. 0 means unlimited.
   * @type {number}
   **/
  #maxWalletsPerUser: number = 5;
  /**
   * Maximum number of wallets a single user may own in total, across all currencies. 0 means unlimited.
   * @returns {number}
   **/
  get maxWalletsPerUser() {
    return this.#maxWalletsPerUser;
  }
  /**
   * Maximum number of wallets a single user may own in total, across all currencies. 0 means unlimited.
   * @type {number}
   **/
  set maxWalletsPerUser(value: number) {
    const correctType = typeof value === "number";
    const parsedValue = correctType ? value : Number(value);
    if (!Number.isNaN(parsedValue)) {
      this.#maxWalletsPerUser = parsedValue;
    }
  }
  setMaxWalletsPerUser(value: number) {
    this.maxWalletsPerUser = value;
    return this;
  }
  /**
   * Maximum number of wallets a single workspace may own in total, across all currencies. 0 means unlimited.
   * @type {number}
   **/
  #maxWalletsPerWorkspace: number = 5;
  /**
   * Maximum number of wallets a single workspace may own in total, across all currencies. 0 means unlimited.
   * @returns {number}
   **/
  get maxWalletsPerWorkspace() {
    return this.#maxWalletsPerWorkspace;
  }
  /**
   * Maximum number of wallets a single workspace may own in total, across all currencies. 0 means unlimited.
   * @type {number}
   **/
  set maxWalletsPerWorkspace(value: number) {
    const correctType = typeof value === "number";
    const parsedValue = correctType ? value : Number(value);
    if (!Number.isNaN(parsedValue)) {
      this.#maxWalletsPerWorkspace = parsedValue;
    }
  }
  setMaxWalletsPerWorkspace(value: number) {
    this.maxWalletsPerWorkspace = value;
    return this;
  }
  /**
   * Maximum wallets a user may own in a single currency. Empty means no per-currency limit beyond maxWalletsPerUser.
   * @type {number}
   **/
  #maxWalletsPerUserPerCurrency?: number | null | undefined = undefined;
  /**
   * Maximum wallets a user may own in a single currency. Empty means no per-currency limit beyond maxWalletsPerUser.
   * @returns {number}
   **/
  get maxWalletsPerUserPerCurrency() {
    return this.#maxWalletsPerUserPerCurrency;
  }
  /**
   * Maximum wallets a user may own in a single currency. Empty means no per-currency limit beyond maxWalletsPerUser.
   * @type {number}
   **/
  set maxWalletsPerUserPerCurrency(value: number | null | undefined) {
    const correctType =
      typeof value === "number" || value === undefined || value === null;
    const parsedValue = correctType ? value : Number(value);
    if (!Number.isNaN(parsedValue)) {
      this.#maxWalletsPerUserPerCurrency = parsedValue;
    }
  }
  setMaxWalletsPerUserPerCurrency(value: number | null | undefined) {
    this.maxWalletsPerUserPerCurrency = value;
    return this;
  }
  /**
   * Maximum wallets a workspace may own in a single currency. Empty means no per-currency limit beyond maxWalletsPerWorkspace.
   * @type {number}
   **/
  #maxWalletsPerWorkspacePerCurrency?: number | null | undefined = undefined;
  /**
   * Maximum wallets a workspace may own in a single currency. Empty means no per-currency limit beyond maxWalletsPerWorkspace.
   * @returns {number}
   **/
  get maxWalletsPerWorkspacePerCurrency() {
    return this.#maxWalletsPerWorkspacePerCurrency;
  }
  /**
   * Maximum wallets a workspace may own in a single currency. Empty means no per-currency limit beyond maxWalletsPerWorkspace.
   * @type {number}
   **/
  set maxWalletsPerWorkspacePerCurrency(value: number | null | undefined) {
    const correctType =
      typeof value === "number" || value === undefined || value === null;
    const parsedValue = correctType ? value : Number(value);
    if (!Number.isNaN(parsedValue)) {
      this.#maxWalletsPerWorkspacePerCurrency = parsedValue;
    }
  }
  setMaxWalletsPerWorkspacePerCurrency(value: number | null | undefined) {
    this.maxWalletsPerWorkspacePerCurrency = value;
    return this;
  }
  /**
   * Whether walletpublic's createWallet action is allowed to create a wallet for the calling user at all. When false, walletpublic rejects self-service wallet creation outright, regardless of defaultUserWallets or the max-wallets limits above - new wallets can then only be provisioned by an admin via adminCreateWallet.
   * @type {boolean}
   **/
  #allowUserCreateWallet: boolean = true;
  /**
   * Whether walletpublic's createWallet action is allowed to create a wallet for the calling user at all. When false, walletpublic rejects self-service wallet creation outright, regardless of defaultUserWallets or the max-wallets limits above - new wallets can then only be provisioned by an admin via adminCreateWallet.
   * @returns {boolean}
   **/
  get allowUserCreateWallet() {
    return this.#allowUserCreateWallet;
  }
  /**
   * Whether walletpublic's createWallet action is allowed to create a wallet for the calling user at all. When false, walletpublic rejects self-service wallet creation outright, regardless of defaultUserWallets or the max-wallets limits above - new wallets can then only be provisioned by an admin via adminCreateWallet.
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
   * Whether walletpublic's transferFunds action is allowed at all - when false (the default), a wallet owner can never move funds directly into another wallet themselves, only through topup/ purchase/prepaid-redeem. Off by default since, unlike allowUserCreateWallet, this lets a caller move value into any wallet they can name the id of, not just provision one for themselves - root must opt in explicitly.
   * @type {boolean}
   **/
  #allowUserTransfer: boolean = false;
  /**
   * Whether walletpublic's transferFunds action is allowed at all - when false (the default), a wallet owner can never move funds directly into another wallet themselves, only through topup/ purchase/prepaid-redeem. Off by default since, unlike allowUserCreateWallet, this lets a caller move value into any wallet they can name the id of, not just provision one for themselves - root must opt in explicitly.
   * @returns {boolean}
   **/
  get allowUserTransfer() {
    return this.#allowUserTransfer;
  }
  /**
   * Whether walletpublic's transferFunds action is allowed at all - when false (the default), a wallet owner can never move funds directly into another wallet themselves, only through topup/ purchase/prepaid-redeem. Off by default since, unlike allowUserCreateWallet, this lets a caller move value into any wallet they can name the id of, not just provision one for themselves - root must opt in explicitly.
   * @type {boolean}
   **/
  set allowUserTransfer(value: boolean) {
    this.#allowUserTransfer = Boolean(value);
  }
  setAllowUserTransfer(value: boolean) {
    this.allowUserTransfer = value;
    return this;
  }
  /**
   * Currencies a wallet is auto-provisioned for every new user in, e.g. one row for USD and one for IRR so every user starts with both. Read by the user-provisioning flow that calls walletpublic's wallet creation for each configured currency; empty means no wallets are auto-created and the user only gets one once they (or an admin) create it explicitly.
   * @type {WalletConfigDto.DefaultUserWallets}
   **/
  #defaultUserWallets: MArray<
    InstanceType<typeof WalletConfigDto.DefaultUserWallets>
  > = MArray.of([]);
  /**
   * Currencies a wallet is auto-provisioned for every new user in, e.g. one row for USD and one for IRR so every user starts with both. Read by the user-provisioning flow that calls walletpublic's wallet creation for each configured currency; empty means no wallets are auto-created and the user only gets one once they (or an admin) create it explicitly.
   * @returns {WalletConfigDto.DefaultUserWallets}
   **/
  get defaultUserWallets() {
    return this.#defaultUserWallets;
  }
  /**
   * Currencies a wallet is auto-provisioned for every new user in, e.g. one row for USD and one for IRR so every user starts with both. Read by the user-provisioning flow that calls walletpublic's wallet creation for each configured currency; empty means no wallets are auto-created and the user only gets one once they (or an admin) create it explicitly.
   * @type {WalletConfigDto.DefaultUserWallets}
   **/
  set defaultUserWallets(
    value:
      | MArray<InstanceType<typeof WalletConfigDto.DefaultUserWallets>>
      | InstanceType<typeof WalletConfigDto.DefaultUserWallets>[],
  ) {
    // When the passed value is already an array, we check if we need to
    // cast the inner items into class instance.
    if (Array.isArray(value)) {
      if (
        value.length > 0 &&
        value[0] instanceof WalletConfigDto.DefaultUserWallets
      ) {
        this.#defaultUserWallets = MArray.of(value);
      } else {
        this.#defaultUserWallets = MArray.of(
          value.map((item) => new WalletConfigDto.DefaultUserWallets(item)),
        );
      }
      return;
    }
    // If the instance is already an MArray, we assume it's all good.
    if (value instanceof MArray) {
      this.#defaultUserWallets = value;
      return;
    }
    // If the value is not array, and is not a MArray, we need to be consider,
    // it might be eligible to be casted into MArray.
    const { ok, value: mcastValue } = MArray.cast<unknown>(value);
    if (ok) {
      this.#defaultUserWallets = mcastValue as any;
      return;
    }
    console.warn(
      "Cannot assing value to defaultUserWallets, because it needs MArray instance or an Array.",
    );
  }
  setDefaultUserWallets(
    value:
      | MArray<InstanceType<typeof WalletConfigDto.DefaultUserWallets>>
      | InstanceType<typeof WalletConfigDto.DefaultUserWallets>[],
  ) {
    this.defaultUserWallets = value;
    return this;
  }
  /**
   * The base class definition for defaultUserWallets
   **/
  static DefaultUserWallets = class DefaultUserWallets {
    /**
     * The currency a default wallet should be created in for every new user. Must match an active walletCurrency.
     * @type {WalletCurrencyEntity}
     **/
    #currency!: MOne<WalletCurrencyEntity>;
    /**
     * The currency a default wallet should be created in for every new user. Must match an active walletCurrency.
     * @returns {WalletCurrencyEntity}
     **/
    get currency() {
      return this.#currency;
    }
    /**
     * The currency a default wallet should be created in for every new user. Must match an active walletCurrency.
     * @type {WalletCurrencyEntity}
     **/
    set currency(
      value:
        | MOne<WalletCurrencyEntity>
        | InstanceType<typeof WalletCurrencyEntity>,
    ) {
      // For objects, the sub type needs to always be instance of the sub class.
      if (value instanceof MOne) {
        this.#currency = value;
      } else if (value instanceof WalletCurrencyEntity) {
        this.#currency = MOne.of(value);
      } else {
        this.#currency = MOne.of(new WalletCurrencyEntity(value));
      }
    }
    setCurrency(
      value:
        | MOne<WalletCurrencyEntity>
        | InstanceType<typeof WalletCurrencyEntity>,
    ) {
      this.currency = value;
      return this;
    }
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
      const d = data as Partial<DefaultUserWallets>;
      if (d.currency !== undefined) {
        this.currency = d.currency;
      }
      this.#lateInitFields(data);
    }
    /**
     * These are the class instances, which need to be initialised, regardless of the constructor incoming data
     **/
    #lateInitFields(data = {}) {
      const d = data as Partial<DefaultUserWallets>;
      if (!(d.currency instanceof WalletCurrencyEntity)) {
        this.currency = MOne.of(new WalletCurrencyEntity(d.currency || {}));
      }
    }
    /**
     *	Special toJSON override, since the field are private,
     *	Json stringify won't see them unless we mention it explicitly.
     **/
    toJSON() {
      return {
        currency: this.#currency,
      };
    }
    toString() {
      return JSON.stringify(this);
    }
    static get Fields() {
      return {
        currency$: "currency",
        get currency() {
          return withPrefix(
            "defaultUserWallets.currency",
            WalletCurrencyEntity.Fields,
          );
        },
      };
    }
    /**
     * Creates an instance of WalletConfigDto.DefaultUserWallets, and possibleDtoObject
     * needs to satisfy the type requirement fully, otherwise typescript compile would
     * be complaining.
     **/
    static from(possibleDtoObject: WalletConfigDtoType.DefaultUserWalletsType) {
      return new WalletConfigDto.DefaultUserWallets(possibleDtoObject);
    }
    /**
     * Creates an instance of WalletConfigDto.DefaultUserWallets, and partialDtoObject
     * needs to satisfy the type, but partially, and rest of the content would
     * be constructed according to data types and nullability.
     **/
    static with(
      partialDtoObject: PartialDeep<WalletConfigDtoType.DefaultUserWalletsType>,
    ) {
      return new WalletConfigDto.DefaultUserWallets(partialDtoObject);
    }
    copyWith(
      partial: PartialDeep<WalletConfigDtoType.DefaultUserWalletsType>,
    ): InstanceType<typeof WalletConfigDto.DefaultUserWallets> {
      return new WalletConfigDto.DefaultUserWallets({
        ...this.toJSON(),
        ...partial,
      });
    }
    clone(): InstanceType<typeof WalletConfigDto.DefaultUserWallets> {
      return new WalletConfigDto.DefaultUserWallets(this.toJSON());
    }
  };
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
    const d = data as Partial<WalletConfigDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.maxWalletsPerUser !== undefined) {
      this.maxWalletsPerUser = d.maxWalletsPerUser;
    }
    if (d.maxWalletsPerWorkspace !== undefined) {
      this.maxWalletsPerWorkspace = d.maxWalletsPerWorkspace;
    }
    if (d.maxWalletsPerUserPerCurrency !== undefined) {
      this.maxWalletsPerUserPerCurrency = d.maxWalletsPerUserPerCurrency;
    }
    if (d.maxWalletsPerWorkspacePerCurrency !== undefined) {
      this.maxWalletsPerWorkspacePerCurrency =
        d.maxWalletsPerWorkspacePerCurrency;
    }
    if (d.allowUserCreateWallet !== undefined) {
      this.allowUserCreateWallet = d.allowUserCreateWallet;
    }
    if (d.allowUserTransfer !== undefined) {
      this.allowUserTransfer = d.allowUserTransfer;
    }
    if (d.defaultUserWallets !== undefined) {
      this.defaultUserWallets = d.defaultUserWallets;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      uniqueId: this.#uniqueId,
      maxWalletsPerUser: this.#maxWalletsPerUser,
      maxWalletsPerWorkspace: this.#maxWalletsPerWorkspace,
      maxWalletsPerUserPerCurrency: this.#maxWalletsPerUserPerCurrency,
      maxWalletsPerWorkspacePerCurrency:
        this.#maxWalletsPerWorkspacePerCurrency,
      allowUserCreateWallet: this.#allowUserCreateWallet,
      allowUserTransfer: this.#allowUserTransfer,
      defaultUserWallets: this.#defaultUserWallets,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      maxWalletsPerUser: "maxWalletsPerUser",
      maxWalletsPerWorkspace: "maxWalletsPerWorkspace",
      maxWalletsPerUserPerCurrency: "maxWalletsPerUserPerCurrency",
      maxWalletsPerWorkspacePerCurrency: "maxWalletsPerWorkspacePerCurrency",
      allowUserCreateWallet: "allowUserCreateWallet",
      allowUserTransfer: "allowUserTransfer",
      defaultUserWallets$: "defaultUserWallets",
      get defaultUserWallets() {
        return withPrefix(
          "defaultUserWallets[:i]",
          WalletConfigDto.DefaultUserWallets.Fields,
        );
      },
    };
  }
  /**
   * Creates an instance of WalletConfigDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: WalletConfigDtoType) {
    return new WalletConfigDto(possibleDtoObject);
  }
  /**
   * Creates an instance of WalletConfigDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<WalletConfigDtoType>) {
    return new WalletConfigDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<WalletConfigDtoType>,
  ): InstanceType<typeof WalletConfigDto> {
    return new WalletConfigDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof WalletConfigDto> {
    return new WalletConfigDto(this.toJSON());
  }
}
export abstract class WalletConfigDtoFactory {
  abstract create(data: unknown): WalletConfigDto;
}
/**
 * The base type definition for walletConfigDto
 **/
export type WalletConfigDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   * Maximum number of wallets a single user may own in total, across all currencies. 0 means unlimited.
   * @type {number}
   **/
  maxWalletsPerUser: number;
  /**
   * Maximum number of wallets a single workspace may own in total, across all currencies. 0 means unlimited.
   * @type {number}
   **/
  maxWalletsPerWorkspace: number;
  /**
   * Maximum wallets a user may own in a single currency. Empty means no per-currency limit beyond maxWalletsPerUser.
   * @type {number}
   **/
  maxWalletsPerUserPerCurrency?: number;
  /**
   * Maximum wallets a workspace may own in a single currency. Empty means no per-currency limit beyond maxWalletsPerWorkspace.
   * @type {number}
   **/
  maxWalletsPerWorkspacePerCurrency?: number;
  /**
   * Whether walletpublic's createWallet action is allowed to create a wallet for the calling user at all. When false, walletpublic rejects self-service wallet creation outright, regardless of defaultUserWallets or the max-wallets limits above - new wallets can then only be provisioned by an admin via adminCreateWallet.
   * @type {boolean}
   **/
  allowUserCreateWallet: boolean;
  /**
   * Whether walletpublic's transferFunds action is allowed at all - when false (the default), a wallet owner can never move funds directly into another wallet themselves, only through topup/ purchase/prepaid-redeem. Off by default since, unlike allowUserCreateWallet, this lets a caller move value into any wallet they can name the id of, not just provision one for themselves - root must opt in explicitly.
   * @type {boolean}
   **/
  allowUserTransfer: boolean;
  /**
   * Currencies a wallet is auto-provisioned for every new user in, e.g. one row for USD and one for IRR so every user starts with both. Read by the user-provisioning flow that calls walletpublic's wallet creation for each configured currency; empty means no wallets are auto-created and the user only gets one once they (or an admin) create it explicitly.
   * @type {WalletConfigDtoType.DefaultUserWalletsType[]}
   **/
  defaultUserWallets: WalletConfigDtoType.DefaultUserWalletsType[];
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace WalletConfigDtoType {
  /**
   * The base type definition for defaultUserWalletsType
   **/
  export type DefaultUserWalletsType = {
    /**
     * The currency a default wallet should be created in for every new user. Must match an active walletCurrency.
     * @type {WalletCurrencyEntity}
     **/
    currency: WalletCurrencyEntity;
  };
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace DefaultUserWalletsType {}
}
