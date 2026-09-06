import { MJson, XDate } from "@fireback/complexes";
import { MOne } from "@fireback/js-remote-ctx/common/operators";
import { TreasuryDto } from "./TreasuryDto";
import { WalletDto } from "./WalletDto";
import { WalletTransactionDto } from "./WalletTransactionDto";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for prepaidDto
 **/
export class PrepaidDto {
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
   * Face value as a decimal string of integer minor-units at currency's declared precision (see walletCurrency.decimals) - never a float. Credited to the redeeming wallet in full; there is no partial redemption.
   * @type {string}
   **/
  #amount: string = "";
  /**
   * Face value as a decimal string of integer minor-units at currency's declared precision (see walletCurrency.decimals) - never a float. Credited to the redeeming wallet in full; there is no partial redemption.
   * @returns {string}
   **/
  get amount() {
    return this.#amount;
  }
  /**
   * Face value as a decimal string of integer minor-units at currency's declared precision (see walletCurrency.decimals) - never a float. Credited to the redeeming wallet in full; there is no partial redemption.
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
   * Currency code this card is denominated in (must match an active walletCurrency.code). redeemPrepaid always requires the target wallet's own currency to match this exactly - see isExchangeable's own doc comment for why that's true even when isExchangeable is set.
   * @type {string}
   **/
  #currency: string = "";
  /**
   * Currency code this card is denominated in (must match an active walletCurrency.code). redeemPrepaid always requires the target wallet's own currency to match this exactly - see isExchangeable's own doc comment for why that's true even when isExchangeable is set.
   * @returns {string}
   **/
  get currency() {
    return this.#currency;
  }
  /**
   * Currency code this card is denominated in (must match an active walletCurrency.code). redeemPrepaid always requires the target wallet's own currency to match this exactly - see isExchangeable's own doc comment for why that's true even when isExchangeable is set.
   * @type {string}
   **/
  set currency(value: string) {
    this.#currency = String(value);
  }
  setCurrency(value: string) {
    this.currency = value;
    return this;
  }
  /**
   * The secret code checked/redeemed via walletpublic's checkPrepaid/ redeemPrepaid actions - whoever holds this key can redeem the card once. Auto-generated (fireback.GenerateSecureToken) by PrepaidCreateAction when left empty on create; unique across every prepaid card. Never regenerated afterwards - editing it via the regular update action orphans whatever it was originally issued/shared as, so root shouldn't, even though nothing in this schema prevents it.
   * @type {string}
   **/
  #redeemKey: string = "";
  /**
   * The secret code checked/redeemed via walletpublic's checkPrepaid/ redeemPrepaid actions - whoever holds this key can redeem the card once. Auto-generated (fireback.GenerateSecureToken) by PrepaidCreateAction when left empty on create; unique across every prepaid card. Never regenerated afterwards - editing it via the regular update action orphans whatever it was originally issued/shared as, so root shouldn't, even though nothing in this schema prevents it.
   * @returns {string}
   **/
  get redeemKey() {
    return this.#redeemKey;
  }
  /**
   * The secret code checked/redeemed via walletpublic's checkPrepaid/ redeemPrepaid actions - whoever holds this key can redeem the card once. Auto-generated (fireback.GenerateSecureToken) by PrepaidCreateAction when left empty on create; unique across every prepaid card. Never regenerated afterwards - editing it via the regular update action orphans whatever it was originally issued/shared as, so root shouldn't, even though nothing in this schema prevents it.
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
   * "active" cards can be redeemed. "redeemed" is terminal - set only by redeemPrepaid itself, never by hand. "disabled" is a root-only kill switch (set via the regular update action) for a card that should never be redeemable, e.g. issued in error.
   * @type {string}
   **/
  #status: string = "active";
  /**
   * "active" cards can be redeemed. "redeemed" is terminal - set only by redeemPrepaid itself, never by hand. "disabled" is a root-only kill switch (set via the regular update action) for a card that should never be redeemable, e.g. issued in error.
   * @returns {string}
   **/
  get status() {
    return this.#status;
  }
  /**
   * "active" cards can be redeemed. "redeemed" is terminal - set only by redeemPrepaid itself, never by hand. "disabled" is a root-only kill switch (set via the regular update action) for a card that should never be redeemable, e.g. issued in error.
   * @type {string}
   **/
  set status(value: string) {
    this.#status = String(value);
  }
  setStatus(value: string) {
    this.status = value;
    return this;
  }
  /**
   * Whether this card is conceptually allowed to be redeemed into a wallet of a different currency than currency above. Informational only for now - surfaced in checkPrepaid's response, but redeemPrepaid always requires an exact currency match regardless of this flag, since no exchange-rate source exists anywhere in this codebase to safely convert an amount. Wire this up for real once one does.
   * @type {boolean}
   **/
  #isExchangeable: boolean = false;
  /**
   * Whether this card is conceptually allowed to be redeemed into a wallet of a different currency than currency above. Informational only for now - surfaced in checkPrepaid's response, but redeemPrepaid always requires an exact currency match regardless of this flag, since no exchange-rate source exists anywhere in this codebase to safely convert an amount. Wire this up for real once one does.
   * @returns {boolean}
   **/
  get isExchangeable() {
    return this.#isExchangeable;
  }
  /**
   * Whether this card is conceptually allowed to be redeemed into a wallet of a different currency than currency above. Informational only for now - surfaced in checkPrepaid's response, but redeemPrepaid always requires an exact currency match regardless of this flag, since no exchange-rate source exists anywhere in this codebase to safely convert an amount. Wire this up for real once one does.
   * @type {boolean}
   **/
  set isExchangeable(value: boolean) {
    this.#isExchangeable = Boolean(value);
  }
  setIsExchangeable(value: boolean) {
    this.isExchangeable = value;
    return this;
  }
  /**
   * JSON array of free-form location codes/names this card can be used at (e.g. ["store-1","store-2"]) - purely informational, surfaced in checkPrepaid's response and never enforced by redeemPrepaid itself (no location is supplied at redeem time). Empty/omitted means no location restriction is implied.
   * @type {MJson}
   **/
  #locations!: MJson;
  /**
   * JSON array of free-form location codes/names this card can be used at (e.g. ["store-1","store-2"]) - purely informational, surfaced in checkPrepaid's response and never enforced by redeemPrepaid itself (no location is supplied at redeem time). Empty/omitted means no location restriction is implied.
   * @returns {MJson}
   **/
  get locations() {
    return this.#locations;
  }
  /**
   * JSON array of free-form location codes/names this card can be used at (e.g. ["store-1","store-2"]) - purely informational, surfaced in checkPrepaid's response and never enforced by redeemPrepaid itself (no location is supplied at redeem time). Empty/omitted means no location restriction is implied.
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
   * Restricts redemption to a workspace-scoped wallet: when set, redeemPrepaid requires the target wallet to be ownerType "workspaceUser" with this exact workspaceId (see wallet. ownerType) - funds land in a wallet scoped to one specific user within this one specific workspace, never a plain personal or shared-workspace wallet. Empty means no workspace restriction - any wallet the caller owns in the right currency works.
   * @type {string}
   **/
  #workspaceId?: string | null | undefined = undefined;
  /**
   * Restricts redemption to a workspace-scoped wallet: when set, redeemPrepaid requires the target wallet to be ownerType "workspaceUser" with this exact workspaceId (see wallet. ownerType) - funds land in a wallet scoped to one specific user within this one specific workspace, never a plain personal or shared-workspace wallet. Empty means no workspace restriction - any wallet the caller owns in the right currency works.
   * @returns {string}
   **/
  get workspaceId() {
    return this.#workspaceId;
  }
  /**
   * Restricts redemption to a workspace-scoped wallet: when set, redeemPrepaid requires the target wallet to be ownerType "workspaceUser" with this exact workspaceId (see wallet. ownerType) - funds land in a wallet scoped to one specific user within this one specific workspace, never a plain personal or shared-workspace wallet. Empty means no workspace restriction - any wallet the caller owns in the right currency works.
   * @type {string}
   **/
  set workspaceId(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#workspaceId = correctType ? value : String(value);
  }
  setWorkspaceId(value: string | null | undefined) {
    this.workspaceId = value;
    return this;
  }
  /**
   * The treasury this card's face value is backed by and drawn down from on redemption - "select" an existing treasury by uniqueId, same as treasury.wallet itself. When set, redeemPrepaid debits this treasury's linked wallet (reason "transfer_out") in the same transaction it credits the redeeming wallet (reason "redeem"), so total system balance is conserved instead of the redemption minting new value - see the treasury entity's own doc comment. Empty means this card is unbacked: redemption still just credits the destination wallet with no matching debit anywhere, the same as every prepaid card before this field existed.
   * @type {TreasuryDto}
   **/
  #treasury?: MOne<TreasuryDto> | null | undefined = undefined;
  /**
   * The treasury this card's face value is backed by and drawn down from on redemption - "select" an existing treasury by uniqueId, same as treasury.wallet itself. When set, redeemPrepaid debits this treasury's linked wallet (reason "transfer_out") in the same transaction it credits the redeeming wallet (reason "redeem"), so total system balance is conserved instead of the redemption minting new value - see the treasury entity's own doc comment. Empty means this card is unbacked: redemption still just credits the destination wallet with no matching debit anywhere, the same as every prepaid card before this field existed.
   * @returns {TreasuryDto}
   **/
  get treasury() {
    return this.#treasury;
  }
  /**
   * The treasury this card's face value is backed by and drawn down from on redemption - "select" an existing treasury by uniqueId, same as treasury.wallet itself. When set, redeemPrepaid debits this treasury's linked wallet (reason "transfer_out") in the same transaction it credits the redeeming wallet (reason "redeem"), so total system balance is conserved instead of the redemption minting new value - see the treasury entity's own doc comment. Empty means this card is unbacked: redemption still just credits the destination wallet with no matching debit anywhere, the same as every prepaid card before this field existed.
   * @type {TreasuryDto}
   **/
  set treasury(
    value:
      | MOne<TreasuryDto>
      | null
      | undefined
      | InstanceType<typeof TreasuryDto>
      | null
      | undefined,
  ) {
    // For a nullable relation, a literal null is a deliberate "clear"
    // signal and has to stay null - not fall through to the else branch
    // below and become MOne.of(new TreasuryDto(null)) (the
    // constructor tolerates a null/undefined argument by returning an
    // empty-but-non-null instance), which serializes as an empty object
    // instead of null. The backend tells "explicitly cleared" apart from
    // "field left untouched" (an absent key) only by seeing a real null
    // on the wire, the same way every other nullable field here (array?,
    // collection?) already short-circuits on null/undefined above.
    if (value === null || value === undefined) {
      this.#treasury = value === null ? null : undefined;
      return;
    }
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof MOne) {
      this.#treasury = value;
    } else if (value instanceof TreasuryDto) {
      this.#treasury = MOne.of(value);
    } else {
      this.#treasury = MOne.of(new TreasuryDto(value));
    }
  }
  setTreasury(
    value:
      | MOne<TreasuryDto>
      | null
      | undefined
      | InstanceType<typeof TreasuryDto>
      | null
      | undefined,
  ) {
    this.treasury = value;
    return this;
  }
  /**
   * Extra structured data root wants to attach to this card (e.g. a batch/campaign id, an order reference) - not interpreted by this module, surfaced as-is in checkPrepaid's response.
   * @type {MJson}
   **/
  #metadata!: MJson;
  /**
   * Extra structured data root wants to attach to this card (e.g. a batch/campaign id, an order reference) - not interpreted by this module, surfaced as-is in checkPrepaid's response.
   * @returns {MJson}
   **/
  get metadata() {
    return this.#metadata;
  }
  /**
   * Extra structured data root wants to attach to this card (e.g. a batch/campaign id, an order reference) - not interpreted by this module, surfaced as-is in checkPrepaid's response.
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
   * When this card was redeemed. Empty until then.
   * @type {XDate}
   **/
  #redeemedAt!: XDate;
  /**
   * When this card was redeemed. Empty until then.
   * @returns {XDate}
   **/
  get redeemedAt() {
    return this.#redeemedAt;
  }
  /**
   * When this card was redeemed. Empty until then.
   * @type {XDate}
   **/
  set redeemedAt(value: XDate) {
    if (value instanceof XDate) {
      this.#redeemedAt = value;
    } else {
      this.#redeemedAt = new XDate(value);
    }
  }
  setRedeemedAt(value: XDate) {
    this.redeemedAt = value;
    return this;
  }
  /**
   * The wallet this card's funds were credited to. Empty until redeemed.
   * @type {WalletDto}
   **/
  #redeemedWallet?: MOne<WalletDto> | null | undefined = undefined;
  /**
   * The wallet this card's funds were credited to. Empty until redeemed.
   * @returns {WalletDto}
   **/
  get redeemedWallet() {
    return this.#redeemedWallet;
  }
  /**
   * The wallet this card's funds were credited to. Empty until redeemed.
   * @type {WalletDto}
   **/
  set redeemedWallet(
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
      this.#redeemedWallet = value === null ? null : undefined;
      return;
    }
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof MOne) {
      this.#redeemedWallet = value;
    } else if (value instanceof WalletDto) {
      this.#redeemedWallet = MOne.of(value);
    } else {
      this.#redeemedWallet = MOne.of(new WalletDto(value));
    }
  }
  setRedeemedWallet(
    value:
      | MOne<WalletDto>
      | null
      | undefined
      | InstanceType<typeof WalletDto>
      | null
      | undefined,
  ) {
    this.redeemedWallet = value;
    return this;
  }
  /**
   * The ledger entry (reason "redeem") the redemption created. Empty until redeemed.
   * @type {WalletTransactionDto}
   **/
  #walletTransaction?: MOne<WalletTransactionDto> | null | undefined =
    undefined;
  /**
   * The ledger entry (reason "redeem") the redemption created. Empty until redeemed.
   * @returns {WalletTransactionDto}
   **/
  get walletTransaction() {
    return this.#walletTransaction;
  }
  /**
   * The ledger entry (reason "redeem") the redemption created. Empty until redeemed.
   * @type {WalletTransactionDto}
   **/
  set walletTransaction(
    value:
      | MOne<WalletTransactionDto>
      | null
      | undefined
      | InstanceType<typeof WalletTransactionDto>
      | null
      | undefined,
  ) {
    // For a nullable relation, a literal null is a deliberate "clear"
    // signal and has to stay null - not fall through to the else branch
    // below and become MOne.of(new WalletTransactionDto(null)) (the
    // constructor tolerates a null/undefined argument by returning an
    // empty-but-non-null instance), which serializes as an empty object
    // instead of null. The backend tells "explicitly cleared" apart from
    // "field left untouched" (an absent key) only by seeing a real null
    // on the wire, the same way every other nullable field here (array?,
    // collection?) already short-circuits on null/undefined above.
    if (value === null || value === undefined) {
      this.#walletTransaction = value === null ? null : undefined;
      return;
    }
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof MOne) {
      this.#walletTransaction = value;
    } else if (value instanceof WalletTransactionDto) {
      this.#walletTransaction = MOne.of(value);
    } else {
      this.#walletTransaction = MOne.of(new WalletTransactionDto(value));
    }
  }
  setWalletTransaction(
    value:
      | MOne<WalletTransactionDto>
      | null
      | undefined
      | InstanceType<typeof WalletTransactionDto>
      | null
      | undefined,
  ) {
    this.walletTransaction = value;
    return this;
  }
  /**
   * The ledger entry (reason "transfer_out") debited from treasury's linked wallet on redemption. Empty until redeemed, and always empty for an unbacked card (treasury unset).
   * @type {WalletTransactionDto}
   **/
  #treasuryTransaction?: MOne<WalletTransactionDto> | null | undefined =
    undefined;
  /**
   * The ledger entry (reason "transfer_out") debited from treasury's linked wallet on redemption. Empty until redeemed, and always empty for an unbacked card (treasury unset).
   * @returns {WalletTransactionDto}
   **/
  get treasuryTransaction() {
    return this.#treasuryTransaction;
  }
  /**
   * The ledger entry (reason "transfer_out") debited from treasury's linked wallet on redemption. Empty until redeemed, and always empty for an unbacked card (treasury unset).
   * @type {WalletTransactionDto}
   **/
  set treasuryTransaction(
    value:
      | MOne<WalletTransactionDto>
      | null
      | undefined
      | InstanceType<typeof WalletTransactionDto>
      | null
      | undefined,
  ) {
    // For a nullable relation, a literal null is a deliberate "clear"
    // signal and has to stay null - not fall through to the else branch
    // below and become MOne.of(new WalletTransactionDto(null)) (the
    // constructor tolerates a null/undefined argument by returning an
    // empty-but-non-null instance), which serializes as an empty object
    // instead of null. The backend tells "explicitly cleared" apart from
    // "field left untouched" (an absent key) only by seeing a real null
    // on the wire, the same way every other nullable field here (array?,
    // collection?) already short-circuits on null/undefined above.
    if (value === null || value === undefined) {
      this.#treasuryTransaction = value === null ? null : undefined;
      return;
    }
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof MOne) {
      this.#treasuryTransaction = value;
    } else if (value instanceof WalletTransactionDto) {
      this.#treasuryTransaction = MOne.of(value);
    } else {
      this.#treasuryTransaction = MOne.of(new WalletTransactionDto(value));
    }
  }
  setTreasuryTransaction(
    value:
      | MOne<WalletTransactionDto>
      | null
      | undefined
      | InstanceType<typeof WalletTransactionDto>
      | null
      | undefined,
  ) {
    this.treasuryTransaction = value;
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
    const d = data as Partial<PrepaidDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.amount !== undefined) {
      this.amount = d.amount;
    }
    if (d.currency !== undefined) {
      this.currency = d.currency;
    }
    if (d.redeemKey !== undefined) {
      this.redeemKey = d.redeemKey;
    }
    if (d.status !== undefined) {
      this.status = d.status;
    }
    if (d.isExchangeable !== undefined) {
      this.isExchangeable = d.isExchangeable;
    }
    if (d.locations !== undefined) {
      this.locations = d.locations;
    }
    if (d.workspaceId !== undefined) {
      this.workspaceId = d.workspaceId;
    }
    if (d.treasury !== undefined) {
      this.treasury = d.treasury;
    }
    if (d.metadata !== undefined) {
      this.metadata = d.metadata;
    }
    if (d.redeemedAt !== undefined) {
      this.redeemedAt = d.redeemedAt;
    }
    if (d.redeemedWallet !== undefined) {
      this.redeemedWallet = d.redeemedWallet;
    }
    if (d.walletTransaction !== undefined) {
      this.walletTransaction = d.walletTransaction;
    }
    if (d.treasuryTransaction !== undefined) {
      this.treasuryTransaction = d.treasuryTransaction;
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
      currency: this.#currency,
      redeemKey: this.#redeemKey,
      status: this.#status,
      isExchangeable: this.#isExchangeable,
      locations: this.#locations,
      workspaceId: this.#workspaceId,
      treasury: this.#treasury,
      metadata: this.#metadata,
      redeemedAt: this.#redeemedAt,
      redeemedWallet: this.#redeemedWallet,
      walletTransaction: this.#walletTransaction,
      treasuryTransaction: this.#treasuryTransaction,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      amount: "amount",
      currency: "currency",
      redeemKey: "redeemKey",
      status: "status",
      isExchangeable: "isExchangeable",
      locations: "locations",
      workspaceId: "workspaceId",
      treasury: "treasury",
      metadata: "metadata",
      redeemedAt: "redeemedAt",
      redeemedWallet: "redeemedWallet",
      walletTransaction: "walletTransaction",
      treasuryTransaction: "treasuryTransaction",
    };
  }
  /**
   * Creates an instance of PrepaidDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: PrepaidDtoType) {
    return new PrepaidDto(possibleDtoObject);
  }
  /**
   * Creates an instance of PrepaidDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<PrepaidDtoType>) {
    return new PrepaidDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<PrepaidDtoType>,
  ): InstanceType<typeof PrepaidDto> {
    return new PrepaidDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof PrepaidDto> {
    return new PrepaidDto(this.toJSON());
  }
}
export abstract class PrepaidDtoFactory {
  abstract create(data: unknown): PrepaidDto;
}
/**
 * The base type definition for prepaidDto
 **/
export type PrepaidDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   * Face value as a decimal string of integer minor-units at currency's declared precision (see walletCurrency.decimals) - never a float. Credited to the redeeming wallet in full; there is no partial redemption.
   * @type {string}
   **/
  amount: string;
  /**
   * Currency code this card is denominated in (must match an active walletCurrency.code). redeemPrepaid always requires the target wallet's own currency to match this exactly - see isExchangeable's own doc comment for why that's true even when isExchangeable is set.
   * @type {string}
   **/
  currency: string;
  /**
   * The secret code checked/redeemed via walletpublic's checkPrepaid/ redeemPrepaid actions - whoever holds this key can redeem the card once. Auto-generated (fireback.GenerateSecureToken) by PrepaidCreateAction when left empty on create; unique across every prepaid card. Never regenerated afterwards - editing it via the regular update action orphans whatever it was originally issued/shared as, so root shouldn't, even though nothing in this schema prevents it.
   * @type {string}
   **/
  redeemKey: string;
  /**
   * "active" cards can be redeemed. "redeemed" is terminal - set only by redeemPrepaid itself, never by hand. "disabled" is a root-only kill switch (set via the regular update action) for a card that should never be redeemable, e.g. issued in error.
   * @type {string}
   **/
  status: string;
  /**
   * Whether this card is conceptually allowed to be redeemed into a wallet of a different currency than currency above. Informational only for now - surfaced in checkPrepaid's response, but redeemPrepaid always requires an exact currency match regardless of this flag, since no exchange-rate source exists anywhere in this codebase to safely convert an amount. Wire this up for real once one does.
   * @type {boolean}
   **/
  isExchangeable: boolean;
  /**
   * JSON array of free-form location codes/names this card can be used at (e.g. ["store-1","store-2"]) - purely informational, surfaced in checkPrepaid's response and never enforced by redeemPrepaid itself (no location is supplied at redeem time). Empty/omitted means no location restriction is implied.
   * @type {MJson}
   **/
  locations: MJson;
  /**
   * Restricts redemption to a workspace-scoped wallet: when set, redeemPrepaid requires the target wallet to be ownerType "workspaceUser" with this exact workspaceId (see wallet. ownerType) - funds land in a wallet scoped to one specific user within this one specific workspace, never a plain personal or shared-workspace wallet. Empty means no workspace restriction - any wallet the caller owns in the right currency works.
   * @type {string}
   **/
  workspaceId?: string;
  /**
   * The treasury this card's face value is backed by and drawn down from on redemption - "select" an existing treasury by uniqueId, same as treasury.wallet itself. When set, redeemPrepaid debits this treasury's linked wallet (reason "transfer_out") in the same transaction it credits the redeeming wallet (reason "redeem"), so total system balance is conserved instead of the redemption minting new value - see the treasury entity's own doc comment. Empty means this card is unbacked: redemption still just credits the destination wallet with no matching debit anywhere, the same as every prepaid card before this field existed.
   * @type {TreasuryDto}
   **/
  treasury?: TreasuryDto;
  /**
   * Extra structured data root wants to attach to this card (e.g. a batch/campaign id, an order reference) - not interpreted by this module, surfaced as-is in checkPrepaid's response.
   * @type {MJson}
   **/
  metadata: MJson;
  /**
   * When this card was redeemed. Empty until then.
   * @type {XDate}
   **/
  redeemedAt: XDate;
  /**
   * The wallet this card's funds were credited to. Empty until redeemed.
   * @type {WalletDto}
   **/
  redeemedWallet?: WalletDto;
  /**
   * The ledger entry (reason "redeem") the redemption created. Empty until redeemed.
   * @type {WalletTransactionDto}
   **/
  walletTransaction?: WalletTransactionDto;
  /**
   * The ledger entry (reason "transfer_out") debited from treasury's linked wallet on redemption. Empty until redeemed, and always empty for an unbacked card (treasury unset).
   * @type {WalletTransactionDto}
   **/
  treasuryTransaction?: WalletTransactionDto;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PrepaidDtoType {}
