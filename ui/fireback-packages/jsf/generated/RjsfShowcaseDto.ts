import {
  MArray,
  MCollection,
  MOne,
} from "@fireback/wallet/sdk/sdk/common/operators";
import { WalletDto as WalletEntity } from "@fireback/wallet/sdk/WalletDto";
import { type PartialDeep } from "@fireback/wallet/sdk/sdk/common/fetchx";
import { withPrefix } from "@fireback/wallet/sdk/sdk/common/withPrefix";
/**
 * The base class definition for rjsfShowcaseDto
 **/
export class RjsfShowcaseDto {
  /**
   * Full legal name of the applicant.
   * @type {string}
   **/
  #fullName: string = "";
  /**
   * Full legal name of the applicant.
   * @returns {string}
   **/
  get fullName() {
    return this.#fullName;
  }
  /**
   * Full legal name of the applicant.
   * @type {string}
   **/
  set fullName(value: string) {
    this.#fullName = String(value);
  }
  setFullName(value: string) {
    this.fullName = value;
    return this;
  }
  /**
   * An optional, informal name.
   * @type {string}
   **/
  #nickname?: string | null | undefined = undefined;
  /**
   * An optional, informal name.
   * @returns {string}
   **/
  get nickname() {
    return this.#nickname;
  }
  /**
   * An optional, informal name.
   * @type {string}
   **/
  set nickname(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#nickname = correctType ? value : String(value);
  }
  setNickname(value: string | null | undefined) {
    this.nickname = value;
    return this;
  }
  /**
   * Localized display name of the applicant - one text per language (complexes.TString), not a single string.
   * @type {TString}
   **/
  #displayName!: TString;
  /**
   * Localized display name of the applicant - one text per language (complexes.TString), not a single string.
   * @returns {TString}
   **/
  get displayName() {
    return this.#displayName;
  }
  /**
   * Localized display name of the applicant - one text per language (complexes.TString), not a single string.
   * @type {TString}
   **/
  set displayName(value: TString) {
    if (value instanceof TString) {
      this.#displayName = value;
    } else {
      this.#displayName = new TString(value);
    }
  }
  setDisplayName(value: TString) {
    this.displayName = value;
    return this;
  }
  /**
   * Age in years.
   * @type {number}
   **/
  #age: number = 0;
  /**
   * Age in years.
   * @returns {number}
   **/
  get age() {
    return this.#age;
  }
  /**
   * Age in years.
   * @type {number}
   **/
  set age(value: number) {
    const correctType = typeof value === "number";
    const parsedValue = correctType ? value : Number(value);
    if (!Number.isNaN(parsedValue)) {
      this.#age = parsedValue;
    }
  }
  setAge(value: number) {
    this.age = value;
    return this;
  }
  /**
   * Optional id of the member who referred this applicant.
   * @type {number}
   **/
  #referredBy?: number | null | undefined = undefined;
  /**
   * Optional id of the member who referred this applicant.
   * @returns {number}
   **/
  get referredBy() {
    return this.#referredBy;
  }
  /**
   * Optional id of the member who referred this applicant.
   * @type {number}
   **/
  set referredBy(value: number | null | undefined) {
    const correctType =
      typeof value === "number" || value === undefined || value === null;
    const parsedValue = correctType ? value : Number(value);
    if (!Number.isNaN(parsedValue)) {
      this.#referredBy = parsedValue;
    }
  }
  setReferredBy(value: number | null | undefined) {
    this.referredBy = value;
    return this;
  }
  /**
   * Current balance of the account.
   * @type {number}
   **/
  #accountBalance: number = 0.0;
  /**
   * Current balance of the account.
   * @returns {number}
   **/
  get accountBalance() {
    return this.#accountBalance;
  }
  /**
   * Current balance of the account.
   * @type {number}
   **/
  set accountBalance(value: number) {
    this.#accountBalance = value;
  }
  setAccountBalance(value: number) {
    this.accountBalance = value;
    return this;
  }
  /**
   * Optional weighting factor, if a credit bureau score was pulled.
   * @type {number}
   **/
  #creditScoreFactor?: number | null | undefined = undefined;
  /**
   * Optional weighting factor, if a credit bureau score was pulled.
   * @returns {number}
   **/
  get creditScoreFactor() {
    return this.#creditScoreFactor;
  }
  /**
   * Optional weighting factor, if a credit bureau score was pulled.
   * @type {number}
   **/
  set creditScoreFactor(value: number | null | undefined) {
    const correctType =
      typeof value === "number" || value === undefined || value === null;
    const parsedValue = correctType ? value : Number(value);
    if (!Number.isNaN(parsedValue)) {
      this.#creditScoreFactor = parsedValue;
    }
  }
  setCreditScoreFactor(value: number | null | undefined) {
    this.creditScoreFactor = value;
    return this;
  }
  /**
   * Whether the applicant accepted the terms of service.
   * @type {boolean}
   **/
  #acceptedTerms!: boolean;
  /**
   * Whether the applicant accepted the terms of service.
   * @returns {boolean}
   **/
  get acceptedTerms() {
    return this.#acceptedTerms;
  }
  /**
   * Whether the applicant accepted the terms of service.
   * @type {boolean}
   **/
  set acceptedTerms(value: boolean) {
    this.#acceptedTerms = Boolean(value);
  }
  setAcceptedTerms(value: boolean) {
    this.acceptedTerms = value;
    return this;
  }
  /**
   * Optional newsletter subscription flag.
   * @type {boolean}
   **/
  #newsletterOptIn?: boolean | null | undefined = undefined;
  /**
   * Optional newsletter subscription flag.
   * @returns {boolean}
   **/
  get newsletterOptIn() {
    return this.#newsletterOptIn;
  }
  /**
   * Optional newsletter subscription flag.
   * @type {boolean}
   **/
  set newsletterOptIn(value: boolean | null | undefined) {
    const correctType =
      value === true ||
      value === false ||
      value === undefined ||
      value === null;
    this.#newsletterOptIn = correctType ? value : Boolean(value);
  }
  setNewsletterOptIn(value: boolean | null | undefined) {
    this.newsletterOptIn = value;
    return this;
  }
  /**
   * The membership tier assigned to this applicant.
   * @type {"bronze" | "silver" | "gold"}
   **/
  #membershipTier!: "bronze" | "silver" | "gold";
  /**
   * The membership tier assigned to this applicant.
   * @returns {"bronze" | "silver" | "gold"}
   **/
  get membershipTier() {
    return this.#membershipTier;
  }
  /**
   * The membership tier assigned to this applicant.
   * @type {"bronze" | "silver" | "gold"}
   **/
  set membershipTier(value: "bronze" | "silver" | "gold") {
    this.#membershipTier = value;
  }
  setMembershipTier(value: "bronze" | "silver" | "gold") {
    this.membershipTier = value;
    return this;
  }
  /**
   * Optional preferred contact language.
   * @type {any}
   **/
  #preferredLanguage?: any | null | undefined = undefined;
  /**
   * Optional preferred contact language.
   * @returns {any}
   **/
  get preferredLanguage() {
    return this.#preferredLanguage;
  }
  /**
   * Optional preferred contact language.
   * @type {any}
   **/
  set preferredLanguage(value: any | null | undefined) {
    this.#preferredLanguage = value;
  }
  setPreferredLanguage(value: any | null | undefined) {
    this.preferredLanguage = value;
    return this;
  }
  /**
   * Free-form labels attached to the applicant.
   * @type {string[]}
   **/
  #tags: string[] = [];
  /**
   * Free-form labels attached to the applicant.
   * @returns {string[]}
   **/
  get tags() {
    return this.#tags;
  }
  /**
   * Free-form labels attached to the applicant.
   * @type {string[]}
   **/
  set tags(value: string[]) {
    this.#tags = value;
  }
  setTags(value: string[]) {
    this.tags = value;
    return this;
  }
  /**
   * A list of favourite integers.
   * @type {number[]}
   **/
  #luckyNumbers: number[] = [];
  /**
   * A list of favourite integers.
   * @returns {number[]}
   **/
  get luckyNumbers() {
    return this.#luckyNumbers;
  }
  /**
   * A list of favourite integers.
   * @type {number[]}
   **/
  set luckyNumbers(value: number[]) {
    this.#luckyNumbers = value;
  }
  setLuckyNumbers(value: number[]) {
    this.luckyNumbers = value;
    return this;
  }
  /**
   * Arbitrary string metadata, keyed by string.
   * @type {{[key: string]: any}}
   **/
  #metadata!: { [key: string]: any };
  /**
   * Arbitrary string metadata, keyed by string.
   * @returns {{[key: string]: any}}
   **/
  get metadata() {
    return this.#metadata;
  }
  /**
   * Arbitrary string metadata, keyed by string.
   * @type {{[key: string]: any}}
   **/
  set metadata(value: { [key: string]: any }) {
    this.#metadata = value;
  }
  setMetadata(value: { [key: string]: any }) {
    this.metadata = value;
    return this;
  }
  /**
   * Home address of the applicant.
   * @type {RjsfShowcaseDto.Address}
   **/
  #address!: InstanceType<typeof RjsfShowcaseDto.Address>;
  /**
   * Home address of the applicant.
   * @returns {RjsfShowcaseDto.Address}
   **/
  get address() {
    return this.#address;
  }
  /**
   * Home address of the applicant.
   * @type {RjsfShowcaseDto.Address}
   **/
  set address(value: InstanceType<typeof RjsfShowcaseDto.Address>) {
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof RjsfShowcaseDto.Address) {
      this.#address = value;
    } else {
      this.#address = new RjsfShowcaseDto.Address(value);
    }
  }
  setAddress(value: InstanceType<typeof RjsfShowcaseDto.Address>) {
    this.address = value;
    return this;
  }
  /**
   * Current employment details of the applicant.
   * @type {RjsfShowcaseDto.Employment}
   **/
  #employment?:
    | InstanceType<typeof RjsfShowcaseDto.Employment>
    | null
    | undefined = undefined;
  /**
   * Current employment details of the applicant.
   * @returns {RjsfShowcaseDto.Employment}
   **/
  get employment() {
    return this.#employment;
  }
  /**
   * Current employment details of the applicant.
   * @type {RjsfShowcaseDto.Employment}
   **/
  set employment(
    value:
      | InstanceType<typeof RjsfShowcaseDto.Employment>
      | null
      | undefined
      | null
      | undefined,
  ) {
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof RjsfShowcaseDto.Employment) {
      this.#employment = value;
    } else {
      this.#employment = new RjsfShowcaseDto.Employment(value);
    }
  }
  setEmployment(
    value:
      | InstanceType<typeof RjsfShowcaseDto.Employment>
      | null
      | undefined
      | null
      | undefined,
  ) {
    this.employment = value;
    return this;
  }
  /**
   * People to contact in an emergency.
   * @type {RjsfShowcaseDto.EmergencyContacts}
   **/
  #emergencyContacts: MArray<
    InstanceType<typeof RjsfShowcaseDto.EmergencyContacts>
  > = MArray.of([]);
  /**
   * People to contact in an emergency.
   * @returns {RjsfShowcaseDto.EmergencyContacts}
   **/
  get emergencyContacts() {
    return this.#emergencyContacts;
  }
  /**
   * People to contact in an emergency.
   * @type {RjsfShowcaseDto.EmergencyContacts}
   **/
  set emergencyContacts(
    value:
      | MArray<InstanceType<typeof RjsfShowcaseDto.EmergencyContacts>>
      | InstanceType<typeof RjsfShowcaseDto.EmergencyContacts>[],
  ) {
    // When the passed value is already an array, we check if we need to
    // cast the inner items into class instance.
    if (Array.isArray(value)) {
      if (
        value.length > 0 &&
        value[0] instanceof RjsfShowcaseDto.EmergencyContacts
      ) {
        this.#emergencyContacts = MArray.of(value);
      } else {
        this.#emergencyContacts = MArray.of(
          value.map((item) => new RjsfShowcaseDto.EmergencyContacts(item)),
        );
      }
      return;
    }
    // If the instance is already an MArray, we assume it's all good.
    if (value instanceof MArray) {
      this.#emergencyContacts = value;
      return;
    }
    // If the value is not array, and is not a MArray, we need to be consider,
    // it might be eligible to be casted into MArray.
    const { ok, value: mcastValue } = MArray.cast<unknown>(value);
    if (ok) {
      this.#emergencyContacts = mcastValue as any;
      return;
    }
    console.warn(
      "Cannot assing value to emergencyContacts, because it needs MArray instance or an Array.",
    );
  }
  setEmergencyContacts(
    value:
      | MArray<InstanceType<typeof RjsfShowcaseDto.EmergencyContacts>>
      | InstanceType<typeof RjsfShowcaseDto.EmergencyContacts>[],
  ) {
    this.emergencyContacts = value;
    return this;
  }
  /**
   * Optional wallet this applicant is sponsored by.
   * @type {WalletEntity}
   **/
  #sponsorWallet?: MOne<WalletEntity> | null | undefined = undefined;
  /**
   * Optional wallet this applicant is sponsored by.
   * @returns {WalletEntity}
   **/
  get sponsorWallet() {
    return this.#sponsorWallet;
  }
  /**
   * Optional wallet this applicant is sponsored by.
   * @type {WalletEntity}
   **/
  set sponsorWallet(
    value:
      | MOne<WalletEntity>
      | null
      | undefined
      | InstanceType<typeof WalletEntity>
      | null
      | undefined,
  ) {
    // For a nullable relation, a literal null is a deliberate "clear"
    // signal and has to stay null - not fall through to the else branch
    // below and become MOne.of(new WalletEntity(null)) (the
    // constructor tolerates a null/undefined argument by returning an
    // empty-but-non-null instance), which serializes as an empty object
    // instead of null. The backend tells "explicitly cleared" apart from
    // "field left untouched" (an absent key) only by seeing a real null
    // on the wire, the same way every other nullable field here (array?,
    // collection?) already short-circuits on null/undefined above.
    if (value === null || value === undefined) {
      this.#sponsorWallet = value === null ? null : undefined;
      return;
    }
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof MOne) {
      this.#sponsorWallet = value;
    } else if (value instanceof WalletEntity) {
      this.#sponsorWallet = MOne.of(value);
    } else {
      this.#sponsorWallet = MOne.of(new WalletEntity(value));
    }
  }
  setSponsorWallet(
    value:
      | MOne<WalletEntity>
      | null
      | undefined
      | InstanceType<typeof WalletEntity>
      | null
      | undefined,
  ) {
    this.sponsorWallet = value;
    return this;
  }
  /**
   * Other wallets linked to this applicant.
   * @type {WalletEntity[]}
   **/
  #linkedWallets?: MCollection<WalletEntity> | null | undefined = undefined;
  /**
   * Other wallets linked to this applicant.
   * @returns {WalletEntity[]}
   **/
  get linkedWallets() {
    return this.#linkedWallets;
  }
  /**
   * Other wallets linked to this applicant.
   * @type {WalletEntity[]}
   **/
  set linkedWallets(
    value:
      | MCollection<WalletEntity>
      | InstanceType<typeof WalletEntity>[]
      | null
      | undefined,
  ) {
    // For nullable collection, we allow explicit undefined or null values
    if (value === null || value === undefined) {
      this.#linkedWallets = value === null ? null : undefined;
      return;
    }
    // When the passed value is already an array, we check if we need to
    // cast the inner items into class instance.
    if (Array.isArray(value)) {
      if (value.length > 0 && value[0] instanceof WalletEntity) {
        this.#linkedWallets = MCollection.of(value);
      } else {
        this.#linkedWallets = MCollection.of(
          value.map((item) => new WalletEntity(item)),
        );
      }
      return;
    }
    // If the instance is already an MCollection, we assume it's all good.
    if (value instanceof MCollection) {
      this.#linkedWallets = value;
      return;
    }
    // If the value is not array, and is not a MCollection, we need to be consider,
    // it might be eligible to be casted into MCollection.
    const { ok, value: mcastValue } = MCollection.cast<unknown>(value);
    if (ok) {
      this.#linkedWallets = mcastValue as any;
      return;
    }
    console.warn(
      "Cannot assing value to linkedWallets, because it needs MCollection instance or an Array.",
    );
  }
  setLinkedWallets(
    value:
      | MCollection<WalletEntity>
      | InstanceType<typeof WalletEntity>[]
      | null
      | undefined,
  ) {
    this.linkedWallets = value;
    return this;
  }
  /**
   * Free-form extra payload, shape not known ahead of time.
   * @type {any}
   **/
  #extra?: any | null | undefined = undefined;
  /**
   * Free-form extra payload, shape not known ahead of time.
   * @returns {any}
   **/
  get extra() {
    return this.#extra;
  }
  /**
   * Free-form extra payload, shape not known ahead of time.
   * @type {any}
   **/
  set extra(value: any | null | undefined) {
    this.#extra = value;
  }
  setExtra(value: any | null | undefined) {
    this.extra = value;
    return this;
  }
  /**
   * The base class definition for address
   **/
  static Address = class Address {
    /**
     *
     * @type {string}
     **/
    #street: string = "";
    /**
     *
     * @returns {string}
     **/
    get street() {
      return this.#street;
    }
    /**
     *
     * @type {string}
     **/
    set street(value: string) {
      this.#street = String(value);
    }
    setStreet(value: string) {
      this.street = value;
      return this;
    }
    /**
     *
     * @type {string}
     **/
    #city: string = "";
    /**
     *
     * @returns {string}
     **/
    get city() {
      return this.#city;
    }
    /**
     *
     * @type {string}
     **/
    set city(value: string) {
      this.#city = String(value);
    }
    setCity(value: string) {
      this.city = value;
      return this;
    }
    /**
     *
     * @type {string}
     **/
    #postalCode?: string | null | undefined = undefined;
    /**
     *
     * @returns {string}
     **/
    get postalCode() {
      return this.#postalCode;
    }
    /**
     *
     * @type {string}
     **/
    set postalCode(value: string | null | undefined) {
      const correctType =
        typeof value === "string" || value === undefined || value === null;
      this.#postalCode = correctType ? value : String(value);
    }
    setPostalCode(value: string | null | undefined) {
      this.postalCode = value;
      return this;
    }
    /**
     *
     * @type {"pl" | "ir" | "gb"}
     **/
    #country!: "pl" | "ir" | "gb";
    /**
     *
     * @returns {"pl" | "ir" | "gb"}
     **/
    get country() {
      return this.#country;
    }
    /**
     *
     * @type {"pl" | "ir" | "gb"}
     **/
    set country(value: "pl" | "ir" | "gb") {
      this.#country = value;
    }
    setCountry(value: "pl" | "ir" | "gb") {
      this.country = value;
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
      const d = data as Partial<Address>;
      if (d.street !== undefined) {
        this.street = d.street;
      }
      if (d.city !== undefined) {
        this.city = d.city;
      }
      if (d.postalCode !== undefined) {
        this.postalCode = d.postalCode;
      }
      if (d.country !== undefined) {
        this.country = d.country;
      }
    }
    /**
     *	Special toJSON override, since the field are private,
     *	Json stringify won't see them unless we mention it explicitly.
     **/
    toJSON() {
      return {
        street: this.#street,
        city: this.#city,
        postalCode: this.#postalCode,
        country: this.#country,
      };
    }
    toString() {
      return JSON.stringify(this);
    }
    static get Fields() {
      return {
        street: "street",
        city: "city",
        postalCode: "postalCode",
        country: "country",
      };
    }
    /**
     * Creates an instance of RjsfShowcaseDto.Address, and possibleDtoObject
     * needs to satisfy the type requirement fully, otherwise typescript compile would
     * be complaining.
     **/
    static from(possibleDtoObject: RjsfShowcaseDtoType.AddressType) {
      return new RjsfShowcaseDto.Address(possibleDtoObject);
    }
    /**
     * Creates an instance of RjsfShowcaseDto.Address, and partialDtoObject
     * needs to satisfy the type, but partially, and rest of the content would
     * be constructed according to data types and nullability.
     **/
    static with(
      partialDtoObject: PartialDeep<RjsfShowcaseDtoType.AddressType>,
    ) {
      return new RjsfShowcaseDto.Address(partialDtoObject);
    }
    copyWith(
      partial: PartialDeep<RjsfShowcaseDtoType.AddressType>,
    ): InstanceType<typeof RjsfShowcaseDto.Address> {
      return new RjsfShowcaseDto.Address({ ...this.toJSON(), ...partial });
    }
    clone(): InstanceType<typeof RjsfShowcaseDto.Address> {
      return new RjsfShowcaseDto.Address(this.toJSON());
    }
  };
  /**
   * The base class definition for employment
   **/
  static Employment = class Employment {
    /**
     *
     * @type {string}
     **/
    #employer: string = "";
    /**
     *
     * @returns {string}
     **/
    get employer() {
      return this.#employer;
    }
    /**
     *
     * @type {string}
     **/
    set employer(value: string) {
      this.#employer = String(value);
    }
    setEmployer(value: string) {
      this.employer = value;
      return this;
    }
    /**
     *
     * @type {string}
     **/
    #position?: string | null | undefined = undefined;
    /**
     *
     * @returns {string}
     **/
    get position() {
      return this.#position;
    }
    /**
     *
     * @type {string}
     **/
    set position(value: string | null | undefined) {
      const correctType =
        typeof value === "string" || value === undefined || value === null;
      this.#position = correctType ? value : String(value);
    }
    setPosition(value: string | null | undefined) {
      this.position = value;
      return this;
    }
    /**
     * Prior roles held at this employer.
     * @type {RjsfShowcaseDto.Employment.History}
     **/
    #history: MArray<InstanceType<typeof RjsfShowcaseDto.Employment.History>> =
      MArray.of([]);
    /**
     * Prior roles held at this employer.
     * @returns {RjsfShowcaseDto.Employment.History}
     **/
    get history() {
      return this.#history;
    }
    /**
     * Prior roles held at this employer.
     * @type {RjsfShowcaseDto.Employment.History}
     **/
    set history(
      value:
        | MArray<InstanceType<typeof RjsfShowcaseDto.Employment.History>>
        | InstanceType<typeof RjsfShowcaseDto.Employment.History>[],
    ) {
      // When the passed value is already an array, we check if we need to
      // cast the inner items into class instance.
      if (Array.isArray(value)) {
        if (
          value.length > 0 &&
          value[0] instanceof RjsfShowcaseDto.Employment.History
        ) {
          this.#history = MArray.of(value);
        } else {
          this.#history = MArray.of(
            value.map((item) => new RjsfShowcaseDto.Employment.History(item)),
          );
        }
        return;
      }
      // If the instance is already an MArray, we assume it's all good.
      if (value instanceof MArray) {
        this.#history = value;
        return;
      }
      // If the value is not array, and is not a MArray, we need to be consider,
      // it might be eligible to be casted into MArray.
      const { ok, value: mcastValue } = MArray.cast<unknown>(value);
      if (ok) {
        this.#history = mcastValue as any;
        return;
      }
      console.warn(
        "Cannot assing value to history, because it needs MArray instance or an Array.",
      );
    }
    setHistory(
      value:
        | MArray<InstanceType<typeof RjsfShowcaseDto.Employment.History>>
        | InstanceType<typeof RjsfShowcaseDto.Employment.History>[],
    ) {
      this.history = value;
      return this;
    }
    /**
     * The employer's registered company.
     * @type {RjsfShowcaseDto.Employment.Company}
     **/
    #company!: InstanceType<typeof RjsfShowcaseDto.Employment.Company>;
    /**
     * The employer's registered company.
     * @returns {RjsfShowcaseDto.Employment.Company}
     **/
    get company() {
      return this.#company;
    }
    /**
     * The employer's registered company.
     * @type {RjsfShowcaseDto.Employment.Company}
     **/
    set company(
      value: InstanceType<typeof RjsfShowcaseDto.Employment.Company>,
    ) {
      // For objects, the sub type needs to always be instance of the sub class.
      if (value instanceof RjsfShowcaseDto.Employment.Company) {
        this.#company = value;
      } else {
        this.#company = new RjsfShowcaseDto.Employment.Company(value);
      }
    }
    setCompany(value: InstanceType<typeof RjsfShowcaseDto.Employment.Company>) {
      this.company = value;
      return this;
    }
    /**
     * The base class definition for history
     **/
    static History = class History {
      /**
       *
       * @type {number}
       **/
      #year: number = 0;
      /**
       *
       * @returns {number}
       **/
      get year() {
        return this.#year;
      }
      /**
       *
       * @type {number}
       **/
      set year(value: number) {
        const correctType = typeof value === "number";
        const parsedValue = correctType ? value : Number(value);
        if (!Number.isNaN(parsedValue)) {
          this.#year = parsedValue;
        }
      }
      setYear(value: number) {
        this.year = value;
        return this;
      }
      /**
       *
       * @type {string}
       **/
      #role: string = "";
      /**
       *
       * @returns {string}
       **/
      get role() {
        return this.#role;
      }
      /**
       *
       * @type {string}
       **/
      set role(value: string) {
        this.#role = String(value);
      }
      setRole(value: string) {
        this.role = value;
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
        const d = data as Partial<History>;
        if (d.year !== undefined) {
          this.year = d.year;
        }
        if (d.role !== undefined) {
          this.role = d.role;
        }
      }
      /**
       *	Special toJSON override, since the field are private,
       *	Json stringify won't see them unless we mention it explicitly.
       **/
      toJSON() {
        return {
          year: this.#year,
          role: this.#role,
        };
      }
      toString() {
        return JSON.stringify(this);
      }
      static get Fields() {
        return {
          year: "year",
          role: "role",
        };
      }
      /**
       * Creates an instance of RjsfShowcaseDto.Employment.History, and possibleDtoObject
       * needs to satisfy the type requirement fully, otherwise typescript compile would
       * be complaining.
       **/
      static from(
        possibleDtoObject: RjsfShowcaseDtoType.EmploymentType.HistoryType,
      ) {
        return new RjsfShowcaseDto.Employment.History(possibleDtoObject);
      }
      /**
       * Creates an instance of RjsfShowcaseDto.Employment.History, and partialDtoObject
       * needs to satisfy the type, but partially, and rest of the content would
       * be constructed according to data types and nullability.
       **/
      static with(
        partialDtoObject: PartialDeep<RjsfShowcaseDtoType.EmploymentType.HistoryType>,
      ) {
        return new RjsfShowcaseDto.Employment.History(partialDtoObject);
      }
      copyWith(
        partial: PartialDeep<RjsfShowcaseDtoType.EmploymentType.HistoryType>,
      ): InstanceType<typeof RjsfShowcaseDto.Employment.History> {
        return new RjsfShowcaseDto.Employment.History({
          ...this.toJSON(),
          ...partial,
        });
      }
      clone(): InstanceType<typeof RjsfShowcaseDto.Employment.History> {
        return new RjsfShowcaseDto.Employment.History(this.toJSON());
      }
    };
    /**
     * The base class definition for company
     **/
    static Company = class Company {
      /**
       *
       * @type {string}
       **/
      #name: string = "";
      /**
       *
       * @returns {string}
       **/
      get name() {
        return this.#name;
      }
      /**
       *
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
       *
       * @type {number}
       **/
      #foundedYear: number = 0;
      /**
       *
       * @returns {number}
       **/
      get foundedYear() {
        return this.#foundedYear;
      }
      /**
       *
       * @type {number}
       **/
      set foundedYear(value: number) {
        const correctType = typeof value === "number";
        const parsedValue = correctType ? value : Number(value);
        if (!Number.isNaN(parsedValue)) {
          this.#foundedYear = parsedValue;
        }
      }
      setFoundedYear(value: number) {
        this.foundedYear = value;
        return this;
      }
      /**
       *
       * @type {boolean}
       **/
      #publiclyTraded!: boolean;
      /**
       *
       * @returns {boolean}
       **/
      get publiclyTraded() {
        return this.#publiclyTraded;
      }
      /**
       *
       * @type {boolean}
       **/
      set publiclyTraded(value: boolean) {
        this.#publiclyTraded = Boolean(value);
      }
      setPubliclyTraded(value: boolean) {
        this.publiclyTraded = value;
        return this;
      }
      /**
       * Where the company is headquartered.
       * @type {RjsfShowcaseDto.Employment.Company.Headquarters}
       **/
      #headquarters!: InstanceType<
        typeof RjsfShowcaseDto.Employment.Company.Headquarters
      >;
      /**
       * Where the company is headquartered.
       * @returns {RjsfShowcaseDto.Employment.Company.Headquarters}
       **/
      get headquarters() {
        return this.#headquarters;
      }
      /**
       * Where the company is headquartered.
       * @type {RjsfShowcaseDto.Employment.Company.Headquarters}
       **/
      set headquarters(
        value: InstanceType<
          typeof RjsfShowcaseDto.Employment.Company.Headquarters
        >,
      ) {
        // For objects, the sub type needs to always be instance of the sub class.
        if (value instanceof RjsfShowcaseDto.Employment.Company.Headquarters) {
          this.#headquarters = value;
        } else {
          this.#headquarters =
            new RjsfShowcaseDto.Employment.Company.Headquarters(value);
        }
      }
      setHeadquarters(
        value: InstanceType<
          typeof RjsfShowcaseDto.Employment.Company.Headquarters
        >,
      ) {
        this.headquarters = value;
        return this;
      }
      /**
       * The base class definition for headquarters
       **/
      static Headquarters = class Headquarters {
        /**
         *
         * @type {string}
         **/
        #city: string = "";
        /**
         *
         * @returns {string}
         **/
        get city() {
          return this.#city;
        }
        /**
         *
         * @type {string}
         **/
        set city(value: string) {
          this.#city = String(value);
        }
        setCity(value: string) {
          this.city = value;
          return this;
        }
        /**
         *
         * @type {"pl" | "ir" | "gb"}
         **/
        #country!: "pl" | "ir" | "gb";
        /**
         *
         * @returns {"pl" | "ir" | "gb"}
         **/
        get country() {
          return this.#country;
        }
        /**
         *
         * @type {"pl" | "ir" | "gb"}
         **/
        set country(value: "pl" | "ir" | "gb") {
          this.#country = value;
        }
        setCountry(value: "pl" | "ir" | "gb") {
          this.country = value;
          return this;
        }
        /**
         * Precise coordinates of the headquarters.
         * @type {RjsfShowcaseDto.Employment.Company.Headquarters.Geo}
         **/
        #geo!: InstanceType<
          typeof RjsfShowcaseDto.Employment.Company.Headquarters.Geo
        >;
        /**
         * Precise coordinates of the headquarters.
         * @returns {RjsfShowcaseDto.Employment.Company.Headquarters.Geo}
         **/
        get geo() {
          return this.#geo;
        }
        /**
         * Precise coordinates of the headquarters.
         * @type {RjsfShowcaseDto.Employment.Company.Headquarters.Geo}
         **/
        set geo(
          value: InstanceType<
            typeof RjsfShowcaseDto.Employment.Company.Headquarters.Geo
          >,
        ) {
          // For objects, the sub type needs to always be instance of the sub class.
          if (
            value instanceof RjsfShowcaseDto.Employment.Company.Headquarters.Geo
          ) {
            this.#geo = value;
          } else {
            this.#geo = new RjsfShowcaseDto.Employment.Company.Headquarters.Geo(
              value,
            );
          }
        }
        setGeo(
          value: InstanceType<
            typeof RjsfShowcaseDto.Employment.Company.Headquarters.Geo
          >,
        ) {
          this.geo = value;
          return this;
        }
        /**
         * The base class definition for geo
         **/
        static Geo = class Geo {
          /**
           *
           * @type {number}
           **/
          #lat: number = 0.0;
          /**
           *
           * @returns {number}
           **/
          get lat() {
            return this.#lat;
          }
          /**
           *
           * @type {number}
           **/
          set lat(value: number) {
            this.#lat = value;
          }
          setLat(value: number) {
            this.lat = value;
            return this;
          }
          /**
           *
           * @type {number}
           **/
          #lng: number = 0.0;
          /**
           *
           * @returns {number}
           **/
          get lng() {
            return this.#lng;
          }
          /**
           *
           * @type {number}
           **/
          set lng(value: number) {
            this.#lng = value;
          }
          setLng(value: number) {
            this.lng = value;
            return this;
          }
          /**
           *
           * @type {number}
           **/
          #accuracyMeters?: number | null | undefined = undefined;
          /**
           *
           * @returns {number}
           **/
          get accuracyMeters() {
            return this.#accuracyMeters;
          }
          /**
           *
           * @type {number}
           **/
          set accuracyMeters(value: number | null | undefined) {
            const correctType =
              typeof value === "number" ||
              value === undefined ||
              value === null;
            const parsedValue = correctType ? value : Number(value);
            if (!Number.isNaN(parsedValue)) {
              this.#accuracyMeters = parsedValue;
            }
          }
          setAccuracyMeters(value: number | null | undefined) {
            this.accuracyMeters = value;
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
            const isBlob =
              typeof g.Blob !== "undefined" && obj instanceof g.Blob;
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
            const d = data as Partial<Geo>;
            if (d.lat !== undefined) {
              this.lat = d.lat;
            }
            if (d.lng !== undefined) {
              this.lng = d.lng;
            }
            if (d.accuracyMeters !== undefined) {
              this.accuracyMeters = d.accuracyMeters;
            }
          }
          /**
           *	Special toJSON override, since the field are private,
           *	Json stringify won't see them unless we mention it explicitly.
           **/
          toJSON() {
            return {
              lat: this.#lat,
              lng: this.#lng,
              accuracyMeters: this.#accuracyMeters,
            };
          }
          toString() {
            return JSON.stringify(this);
          }
          static get Fields() {
            return {
              lat: "lat",
              lng: "lng",
              accuracyMeters: "accuracyMeters",
            };
          }
          /**
           * Creates an instance of RjsfShowcaseDto.Employment.Company.Headquarters.Geo, and possibleDtoObject
           * needs to satisfy the type requirement fully, otherwise typescript compile would
           * be complaining.
           **/
          static from(
            possibleDtoObject: RjsfShowcaseDtoType.EmploymentType.CompanyType.HeadquartersType.GeoType,
          ) {
            return new RjsfShowcaseDto.Employment.Company.Headquarters.Geo(
              possibleDtoObject,
            );
          }
          /**
           * Creates an instance of RjsfShowcaseDto.Employment.Company.Headquarters.Geo, and partialDtoObject
           * needs to satisfy the type, but partially, and rest of the content would
           * be constructed according to data types and nullability.
           **/
          static with(
            partialDtoObject: PartialDeep<RjsfShowcaseDtoType.EmploymentType.CompanyType.HeadquartersType.GeoType>,
          ) {
            return new RjsfShowcaseDto.Employment.Company.Headquarters.Geo(
              partialDtoObject,
            );
          }
          copyWith(
            partial: PartialDeep<RjsfShowcaseDtoType.EmploymentType.CompanyType.HeadquartersType.GeoType>,
          ): InstanceType<
            typeof RjsfShowcaseDto.Employment.Company.Headquarters.Geo
          > {
            return new RjsfShowcaseDto.Employment.Company.Headquarters.Geo({
              ...this.toJSON(),
              ...partial,
            });
          }
          clone(): InstanceType<
            typeof RjsfShowcaseDto.Employment.Company.Headquarters.Geo
          > {
            return new RjsfShowcaseDto.Employment.Company.Headquarters.Geo(
              this.toJSON(),
            );
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
          const d = data as Partial<Headquarters>;
          if (d.city !== undefined) {
            this.city = d.city;
          }
          if (d.country !== undefined) {
            this.country = d.country;
          }
          if (d.geo !== undefined) {
            this.geo = d.geo;
          }
          this.#lateInitFields(data);
        }
        /**
         * These are the class instances, which need to be initialised, regardless of the constructor incoming data
         **/
        #lateInitFields(data = {}) {
          const d = data as Partial<Headquarters>;
          if (
            !(
              d.geo instanceof
              RjsfShowcaseDto.Employment.Company.Headquarters.Geo
            )
          ) {
            this.geo = new RjsfShowcaseDto.Employment.Company.Headquarters.Geo(
              d.geo || {},
            );
          }
        }
        /**
         *	Special toJSON override, since the field are private,
         *	Json stringify won't see them unless we mention it explicitly.
         **/
        toJSON() {
          return {
            city: this.#city,
            country: this.#country,
            geo: this.#geo,
          };
        }
        toString() {
          return JSON.stringify(this);
        }
        static get Fields() {
          return {
            city: "city",
            country: "country",
            geo$: "geo",
            get geo() {
              return withPrefix(
                "employment.company.headquarters.geo",
                RjsfShowcaseDto.Employment.Company.Headquarters.Geo.Fields,
              );
            },
          };
        }
        /**
         * Creates an instance of RjsfShowcaseDto.Employment.Company.Headquarters, and possibleDtoObject
         * needs to satisfy the type requirement fully, otherwise typescript compile would
         * be complaining.
         **/
        static from(
          possibleDtoObject: RjsfShowcaseDtoType.EmploymentType.CompanyType.HeadquartersType,
        ) {
          return new RjsfShowcaseDto.Employment.Company.Headquarters(
            possibleDtoObject,
          );
        }
        /**
         * Creates an instance of RjsfShowcaseDto.Employment.Company.Headquarters, and partialDtoObject
         * needs to satisfy the type, but partially, and rest of the content would
         * be constructed according to data types and nullability.
         **/
        static with(
          partialDtoObject: PartialDeep<RjsfShowcaseDtoType.EmploymentType.CompanyType.HeadquartersType>,
        ) {
          return new RjsfShowcaseDto.Employment.Company.Headquarters(
            partialDtoObject,
          );
        }
        copyWith(
          partial: PartialDeep<RjsfShowcaseDtoType.EmploymentType.CompanyType.HeadquartersType>,
        ): InstanceType<
          typeof RjsfShowcaseDto.Employment.Company.Headquarters
        > {
          return new RjsfShowcaseDto.Employment.Company.Headquarters({
            ...this.toJSON(),
            ...partial,
          });
        }
        clone(): InstanceType<
          typeof RjsfShowcaseDto.Employment.Company.Headquarters
        > {
          return new RjsfShowcaseDto.Employment.Company.Headquarters(
            this.toJSON(),
          );
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
        const d = data as Partial<Company>;
        if (d.name !== undefined) {
          this.name = d.name;
        }
        if (d.foundedYear !== undefined) {
          this.foundedYear = d.foundedYear;
        }
        if (d.publiclyTraded !== undefined) {
          this.publiclyTraded = d.publiclyTraded;
        }
        if (d.headquarters !== undefined) {
          this.headquarters = d.headquarters;
        }
        this.#lateInitFields(data);
      }
      /**
       * These are the class instances, which need to be initialised, regardless of the constructor incoming data
       **/
      #lateInitFields(data = {}) {
        const d = data as Partial<Company>;
        if (
          !(
            d.headquarters instanceof
            RjsfShowcaseDto.Employment.Company.Headquarters
          )
        ) {
          this.headquarters =
            new RjsfShowcaseDto.Employment.Company.Headquarters(
              d.headquarters || {},
            );
        }
      }
      /**
       *	Special toJSON override, since the field are private,
       *	Json stringify won't see them unless we mention it explicitly.
       **/
      toJSON() {
        return {
          name: this.#name,
          foundedYear: this.#foundedYear,
          publiclyTraded: this.#publiclyTraded,
          headquarters: this.#headquarters,
        };
      }
      toString() {
        return JSON.stringify(this);
      }
      static get Fields() {
        return {
          name: "name",
          foundedYear: "foundedYear",
          publiclyTraded: "publiclyTraded",
          headquarters$: "headquarters",
          get headquarters() {
            return withPrefix(
              "employment.company.headquarters",
              RjsfShowcaseDto.Employment.Company.Headquarters.Fields,
            );
          },
        };
      }
      /**
       * Creates an instance of RjsfShowcaseDto.Employment.Company, and possibleDtoObject
       * needs to satisfy the type requirement fully, otherwise typescript compile would
       * be complaining.
       **/
      static from(
        possibleDtoObject: RjsfShowcaseDtoType.EmploymentType.CompanyType,
      ) {
        return new RjsfShowcaseDto.Employment.Company(possibleDtoObject);
      }
      /**
       * Creates an instance of RjsfShowcaseDto.Employment.Company, and partialDtoObject
       * needs to satisfy the type, but partially, and rest of the content would
       * be constructed according to data types and nullability.
       **/
      static with(
        partialDtoObject: PartialDeep<RjsfShowcaseDtoType.EmploymentType.CompanyType>,
      ) {
        return new RjsfShowcaseDto.Employment.Company(partialDtoObject);
      }
      copyWith(
        partial: PartialDeep<RjsfShowcaseDtoType.EmploymentType.CompanyType>,
      ): InstanceType<typeof RjsfShowcaseDto.Employment.Company> {
        return new RjsfShowcaseDto.Employment.Company({
          ...this.toJSON(),
          ...partial,
        });
      }
      clone(): InstanceType<typeof RjsfShowcaseDto.Employment.Company> {
        return new RjsfShowcaseDto.Employment.Company(this.toJSON());
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
      const d = data as Partial<Employment>;
      if (d.employer !== undefined) {
        this.employer = d.employer;
      }
      if (d.position !== undefined) {
        this.position = d.position;
      }
      if (d.history !== undefined) {
        this.history = d.history;
      }
      if (d.company !== undefined) {
        this.company = d.company;
      }
      this.#lateInitFields(data);
    }
    /**
     * These are the class instances, which need to be initialised, regardless of the constructor incoming data
     **/
    #lateInitFields(data = {}) {
      const d = data as Partial<Employment>;
      if (!(d.company instanceof RjsfShowcaseDto.Employment.Company)) {
        this.company = new RjsfShowcaseDto.Employment.Company(d.company || {});
      }
    }
    /**
     *	Special toJSON override, since the field are private,
     *	Json stringify won't see them unless we mention it explicitly.
     **/
    toJSON() {
      return {
        employer: this.#employer,
        position: this.#position,
        history: this.#history,
        company: this.#company,
      };
    }
    toString() {
      return JSON.stringify(this);
    }
    static get Fields() {
      return {
        employer: "employer",
        position: "position",
        history$: "history",
        get history() {
          return withPrefix(
            "employment.history[:i]",
            RjsfShowcaseDto.Employment.History.Fields,
          );
        },
        company$: "company",
        get company() {
          return withPrefix(
            "employment.company",
            RjsfShowcaseDto.Employment.Company.Fields,
          );
        },
      };
    }
    /**
     * Creates an instance of RjsfShowcaseDto.Employment, and possibleDtoObject
     * needs to satisfy the type requirement fully, otherwise typescript compile would
     * be complaining.
     **/
    static from(possibleDtoObject: RjsfShowcaseDtoType.EmploymentType) {
      return new RjsfShowcaseDto.Employment(possibleDtoObject);
    }
    /**
     * Creates an instance of RjsfShowcaseDto.Employment, and partialDtoObject
     * needs to satisfy the type, but partially, and rest of the content would
     * be constructed according to data types and nullability.
     **/
    static with(
      partialDtoObject: PartialDeep<RjsfShowcaseDtoType.EmploymentType>,
    ) {
      return new RjsfShowcaseDto.Employment(partialDtoObject);
    }
    copyWith(
      partial: PartialDeep<RjsfShowcaseDtoType.EmploymentType>,
    ): InstanceType<typeof RjsfShowcaseDto.Employment> {
      return new RjsfShowcaseDto.Employment({ ...this.toJSON(), ...partial });
    }
    clone(): InstanceType<typeof RjsfShowcaseDto.Employment> {
      return new RjsfShowcaseDto.Employment(this.toJSON());
    }
  };
  /**
   * The base class definition for emergencyContacts
   **/
  static EmergencyContacts = class EmergencyContacts {
    /**
     *
     * @type {string}
     **/
    #name: string = "";
    /**
     *
     * @returns {string}
     **/
    get name() {
      return this.#name;
    }
    /**
     *
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
     *
     * @type {string}
     **/
    #phone: string = "";
    /**
     *
     * @returns {string}
     **/
    get phone() {
      return this.#phone;
    }
    /**
     *
     * @type {string}
     **/
    set phone(value: string) {
      this.#phone = String(value);
    }
    setPhone(value: string) {
      this.phone = value;
      return this;
    }
    /**
     *
     * @type {string}
     **/
    #relationship?: string | null | undefined = undefined;
    /**
     *
     * @returns {string}
     **/
    get relationship() {
      return this.#relationship;
    }
    /**
     *
     * @type {string}
     **/
    set relationship(value: string | null | undefined) {
      const correctType =
        typeof value === "string" || value === undefined || value === null;
      this.#relationship = correctType ? value : String(value);
    }
    setRelationship(value: string | null | undefined) {
      this.relationship = value;
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
      const d = data as Partial<EmergencyContacts>;
      if (d.name !== undefined) {
        this.name = d.name;
      }
      if (d.phone !== undefined) {
        this.phone = d.phone;
      }
      if (d.relationship !== undefined) {
        this.relationship = d.relationship;
      }
    }
    /**
     *	Special toJSON override, since the field are private,
     *	Json stringify won't see them unless we mention it explicitly.
     **/
    toJSON() {
      return {
        name: this.#name,
        phone: this.#phone,
        relationship: this.#relationship,
      };
    }
    toString() {
      return JSON.stringify(this);
    }
    static get Fields() {
      return {
        name: "name",
        phone: "phone",
        relationship: "relationship",
      };
    }
    /**
     * Creates an instance of RjsfShowcaseDto.EmergencyContacts, and possibleDtoObject
     * needs to satisfy the type requirement fully, otherwise typescript compile would
     * be complaining.
     **/
    static from(possibleDtoObject: RjsfShowcaseDtoType.EmergencyContactsType) {
      return new RjsfShowcaseDto.EmergencyContacts(possibleDtoObject);
    }
    /**
     * Creates an instance of RjsfShowcaseDto.EmergencyContacts, and partialDtoObject
     * needs to satisfy the type, but partially, and rest of the content would
     * be constructed according to data types and nullability.
     **/
    static with(
      partialDtoObject: PartialDeep<RjsfShowcaseDtoType.EmergencyContactsType>,
    ) {
      return new RjsfShowcaseDto.EmergencyContacts(partialDtoObject);
    }
    copyWith(
      partial: PartialDeep<RjsfShowcaseDtoType.EmergencyContactsType>,
    ): InstanceType<typeof RjsfShowcaseDto.EmergencyContacts> {
      return new RjsfShowcaseDto.EmergencyContacts({
        ...this.toJSON(),
        ...partial,
      });
    }
    clone(): InstanceType<typeof RjsfShowcaseDto.EmergencyContacts> {
      return new RjsfShowcaseDto.EmergencyContacts(this.toJSON());
    }
  };
  static JsonSchema = {
    type: "object",
    title: "$title",
    description: "$description",
    properties: {
      fullName: {
        type: "string",
        title: "full_name_title",
        description: "full_name_description",
      },
      nickname: {
        type: "string",
        title: "nickname_title",
        description: "nickname_description",
      },
      displayName: {
        title: "display_name_title",
        description: "display_name_description",
      },
      age: {
        type: "integer",
        title: "age_title",
        description: "age_description",
      },
      referredBy: {
        type: "integer",
        title: "referred_by_title",
        description: "referred_by_description",
      },
      accountBalance: {
        type: "number",
        title: "account_balance_title",
        description: "account_balance_description",
      },
      creditScoreFactor: {
        type: "number",
        title: "credit_score_factor_title",
        description: "credit_score_factor_description",
      },
      acceptedTerms: {
        type: "boolean",
        title: "accepted_terms_title",
        description: "accepted_terms_description",
      },
      newsletterOptIn: {
        type: "boolean",
        title: "newsletter_opt_in_title",
        description: "newsletter_opt_in_description",
      },
      membershipTier: {
        type: "string",
        title: "membership_tier_title",
        description: "membership_tier_description",
        oneOf: [
          {
            const: "bronze",
            title: "membership_tier_enum_bronze",
          },
          {
            const: "silver",
            title: "membership_tier_enum_silver",
          },
          {
            const: "gold",
            title: "membership_tier_enum_gold",
          },
        ],
      },
      preferredLanguage: {
        type: "string",
        title: "preferred_language_title",
        description: "preferred_language_description",
        oneOf: [
          {
            const: "en",
            title: "preferred_language_enum_en",
          },
          {
            const: "fa",
            title: "preferred_language_enum_fa",
          },
          {
            const: "pl",
            title: "preferred_language_enum_pl",
          },
        ],
      },
      tags: {
        type: "array",
        title: "tags_title",
        description: "tags_description",
        items: {
          type: "string",
        },
      },
      luckyNumbers: {
        type: "array",
        title: "lucky_numbers_title",
        description: "lucky_numbers_description",
        items: {
          type: "integer",
        },
      },
      metadata: {
        type: "object",
        title: "metadata_title",
        description: "metadata_description",
        additionalProperties: {
          type: "string",
        },
      },
      address: {
        type: "object",
        title: "address_title",
        description: "address_description",
        properties: {
          street: {
            type: "string",
            title: "address_properties_street_title",
          },
          city: {
            type: "string",
            title: "address_properties_city_title",
          },
          postalCode: {
            type: "string",
            title: "address_properties_postal_code_title",
          },
          country: {
            type: "string",
            title: "address_properties_country_title",
            oneOf: [
              {
                const: "pl",
                title: "address_properties_country_enum_pl",
              },
              {
                const: "ir",
                title: "address_properties_country_enum_ir",
              },
              {
                const: "gb",
                title: "address_properties_country_enum_gb",
              },
            ],
          },
        },
        required: ["street", "city", "country"],
      },
      employment: {
        type: "object",
        title: "employment_title",
        description: "employment_description",
        properties: {
          employer: {
            type: "string",
            title: "employment_properties_employer_title",
          },
          position: {
            type: "string",
            title: "employment_properties_position_title",
          },
          history: {
            type: "array",
            title: "employment_properties_history_title",
            description: "employment_properties_history_description",
            items: {
              type: "object",
              properties: {
                year: {
                  type: "integer",
                  title:
                    "employment_properties_history_items_properties_year_title",
                },
                role: {
                  type: "string",
                  title:
                    "employment_properties_history_items_properties_role_title",
                },
              },
              required: ["year", "role"],
            },
          },
          company: {
            type: "object",
            title: "employment_properties_company_title",
            description: "employment_properties_company_description",
            properties: {
              name: {
                type: "string",
                title: "employment_properties_company_properties_name_title",
              },
              foundedYear: {
                type: "integer",
                title:
                  "employment_properties_company_properties_founded_year_title",
              },
              publiclyTraded: {
                type: "boolean",
                title:
                  "employment_properties_company_properties_publicly_traded_title",
              },
              headquarters: {
                type: "object",
                title:
                  "employment_properties_company_properties_headquarters_title",
                description:
                  "employment_properties_company_properties_headquarters_description",
                properties: {
                  city: {
                    type: "string",
                    title:
                      "employment_properties_company_properties_headquarters_properties_city_title",
                  },
                  country: {
                    type: "string",
                    title:
                      "employment_properties_company_properties_headquarters_properties_country_title",
                    oneOf: [
                      {
                        const: "pl",
                        title:
                          "employment_properties_company_properties_headquarters_properties_country_enum_pl",
                      },
                      {
                        const: "ir",
                        title:
                          "employment_properties_company_properties_headquarters_properties_country_enum_ir",
                      },
                      {
                        const: "gb",
                        title:
                          "employment_properties_company_properties_headquarters_properties_country_enum_gb",
                      },
                    ],
                  },
                  geo: {
                    type: "object",
                    title:
                      "employment_properties_company_properties_headquarters_properties_geo_title",
                    description:
                      "employment_properties_company_properties_headquarters_properties_geo_description",
                    properties: {
                      lat: {
                        type: "number",
                        title:
                          "employment_properties_company_properties_headquarters_properties_geo_properties_lat_title",
                      },
                      lng: {
                        type: "number",
                        title:
                          "employment_properties_company_properties_headquarters_properties_geo_properties_lng_title",
                      },
                      accuracyMeters: {
                        type: "number",
                        title:
                          "employment_properties_company_properties_headquarters_properties_geo_properties_accuracy_meters_title",
                      },
                    },
                    required: ["lat", "lng"],
                  },
                },
                required: ["city", "country", "geo"],
              },
            },
            required: ["name", "foundedYear", "publiclyTraded", "headquarters"],
          },
        },
        required: ["employer", "history", "company"],
      },
      emergencyContacts: {
        type: "array",
        title: "emergency_contacts_title",
        description: "emergency_contacts_description",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              title: "emergency_contacts_items_properties_name_title",
            },
            phone: {
              type: "string",
              title: "emergency_contacts_items_properties_phone_title",
            },
            relationship: {
              type: "string",
              title: "emergency_contacts_items_properties_relationship_title",
            },
          },
          required: ["name", "phone"],
        },
      },
      sponsorWallet: {
        title: "sponsor_wallet_title",
        description: "sponsor_wallet_description",
      },
      linkedWallets: {
        type: "array",
        title: "linked_wallets_title",
        description: "linked_wallets_description",
        items: {},
      },
      extra: {
        title: "extra_title",
        description: "extra_description",
      },
    },
    required: [
      "fullName",
      "displayName",
      "age",
      "accountBalance",
      "acceptedTerms",
      "membershipTier",
      "tags",
      "luckyNumbers",
      "metadata",
      "address",
      "emergencyContacts",
    ],
  };
  static DefaultTranslations = {
    $title: "RjsfShowcaseDto",
    $description:
      "One dto touching every Emi field type, used to demo that @fireback/jsf can render a compiled JSON Schema end to end.",
    full_name_title: "Full Name",
    full_name_description: "Full legal name of the applicant.",
    nickname_title: "Nickname",
    nickname_description: "An optional, informal name.",
    display_name_title: "Display Name",
    display_name_description:
      "Localized display name of the applicant - one text per language (complexes.TString), not a single string.",
    age_title: "Age",
    age_description: "Age in years.",
    referred_by_title: "Referred By",
    referred_by_description:
      "Optional id of the member who referred this applicant.",
    account_balance_title: "Account Balance",
    account_balance_description: "Current balance of the account.",
    credit_score_factor_title: "Credit Score Factor",
    credit_score_factor_description:
      "Optional weighting factor, if a credit bureau score was pulled.",
    accepted_terms_title: "Accepted Terms",
    accepted_terms_description:
      "Whether the applicant accepted the terms of service.",
    newsletter_opt_in_title: "Newsletter Opt In",
    newsletter_opt_in_description: "Optional newsletter subscription flag.",
    membership_tier_enum_bronze: "Bronze tier",
    membership_tier_enum_silver: "Silver tier",
    membership_tier_enum_gold: "Gold tier",
    membership_tier_title: "Membership Tier",
    membership_tier_description:
      "The membership tier assigned to this applicant.",
    preferred_language_enum_en: "English",
    preferred_language_enum_fa: "Persian",
    preferred_language_enum_pl: "Polish",
    preferred_language_title: "Preferred Language",
    preferred_language_description: "Optional preferred contact language.",
    tags_title: "Tags",
    tags_description: "Free-form labels attached to the applicant.",
    lucky_numbers_title: "Lucky Numbers",
    lucky_numbers_description: "A list of favourite integers.",
    metadata_title: "Metadata",
    metadata_description: "Arbitrary string metadata, keyed by string.",
    address_properties_street_title: "Street",
    address_properties_city_title: "City",
    address_properties_postal_code_title: "Postal Code",
    address_properties_country_enum_pl: "Poland",
    address_properties_country_enum_ir: "Iran",
    address_properties_country_enum_gb: "United Kingdom",
    address_properties_country_title: "Country",
    address_title: "Address",
    address_description: "Home address of the applicant.",
    employment_properties_employer_title: "Employer",
    employment_properties_position_title: "Position",
    employment_properties_history_items_properties_year_title: "Year",
    employment_properties_history_items_properties_role_title: "Role",
    employment_properties_history_title: "History",
    employment_properties_history_description:
      "Prior roles held at this employer.",
    employment_properties_company_properties_name_title: "Name",
    employment_properties_company_properties_founded_year_title: "Founded Year",
    employment_properties_company_properties_publicly_traded_title:
      "Publicly Traded",
    employment_properties_company_properties_headquarters_properties_city_title:
      "City",
    employment_properties_company_properties_headquarters_properties_country_enum_pl:
      "Poland",
    employment_properties_company_properties_headquarters_properties_country_enum_ir:
      "Iran",
    employment_properties_company_properties_headquarters_properties_country_enum_gb:
      "United Kingdom",
    employment_properties_company_properties_headquarters_properties_country_title:
      "Country",
    employment_properties_company_properties_headquarters_properties_geo_properties_lat_title:
      "Lat",
    employment_properties_company_properties_headquarters_properties_geo_properties_lng_title:
      "Lng",
    employment_properties_company_properties_headquarters_properties_geo_properties_accuracy_meters_title:
      "Accuracy Meters",
    employment_properties_company_properties_headquarters_properties_geo_title:
      "Geo",
    employment_properties_company_properties_headquarters_properties_geo_description:
      "Precise coordinates of the headquarters.",
    employment_properties_company_properties_headquarters_title: "Headquarters",
    employment_properties_company_properties_headquarters_description:
      "Where the company is headquartered.",
    employment_properties_company_title: "Company",
    employment_properties_company_description:
      "The employer's registered company.",
    employment_title: "Employment",
    employment_description: "Current employment details of the applicant.",
    emergency_contacts_items_properties_name_title: "Name",
    emergency_contacts_items_properties_phone_title: "Phone",
    emergency_contacts_items_properties_relationship_title: "Relationship",
    emergency_contacts_title: "Emergency Contacts",
    emergency_contacts_description: "People to contact in an emergency.",
    sponsor_wallet_title: "Sponsor Wallet",
    sponsor_wallet_description:
      "Optional wallet this applicant is sponsored by.",
    linked_wallets_title: "Linked Wallets",
    linked_wallets_description: "Other wallets linked to this applicant.",
    extra_title: "Extra",
    extra_description:
      "Free-form extra payload, shape not known ahead of time.",
  } as const;
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
    const d = data as Partial<RjsfShowcaseDto>;
    if (d.fullName !== undefined) {
      this.fullName = d.fullName;
    }
    if (d.nickname !== undefined) {
      this.nickname = d.nickname;
    }
    if (d.displayName !== undefined) {
      this.displayName = d.displayName;
    }
    if (d.age !== undefined) {
      this.age = d.age;
    }
    if (d.referredBy !== undefined) {
      this.referredBy = d.referredBy;
    }
    if (d.accountBalance !== undefined) {
      this.accountBalance = d.accountBalance;
    }
    if (d.creditScoreFactor !== undefined) {
      this.creditScoreFactor = d.creditScoreFactor;
    }
    if (d.acceptedTerms !== undefined) {
      this.acceptedTerms = d.acceptedTerms;
    }
    if (d.newsletterOptIn !== undefined) {
      this.newsletterOptIn = d.newsletterOptIn;
    }
    if (d.membershipTier !== undefined) {
      this.membershipTier = d.membershipTier;
    }
    if (d.preferredLanguage !== undefined) {
      this.preferredLanguage = d.preferredLanguage;
    }
    if (d.tags !== undefined) {
      this.tags = d.tags;
    }
    if (d.luckyNumbers !== undefined) {
      this.luckyNumbers = d.luckyNumbers;
    }
    if (d.metadata !== undefined) {
      this.metadata = d.metadata;
    }
    if (d.address !== undefined) {
      this.address = d.address;
    }
    if (d.employment !== undefined) {
      this.employment = d.employment;
    }
    if (d.emergencyContacts !== undefined) {
      this.emergencyContacts = d.emergencyContacts;
    }
    if (d.sponsorWallet !== undefined) {
      this.sponsorWallet = d.sponsorWallet;
    }
    if (d.linkedWallets !== undefined) {
      this.linkedWallets = d.linkedWallets;
    }
    if (d.extra !== undefined) {
      this.extra = d.extra;
    }
    this.#lateInitFields(data);
  }
  /**
   * These are the class instances, which need to be initialised, regardless of the constructor incoming data
   **/
  #lateInitFields(data = {}) {
    const d = data as Partial<RjsfShowcaseDto>;
    if (!(d.address instanceof RjsfShowcaseDto.Address)) {
      this.address = new RjsfShowcaseDto.Address(d.address || {});
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      fullName: this.#fullName,
      nickname: this.#nickname,
      displayName: this.#displayName,
      age: this.#age,
      referredBy: this.#referredBy,
      accountBalance: this.#accountBalance,
      creditScoreFactor: this.#creditScoreFactor,
      acceptedTerms: this.#acceptedTerms,
      newsletterOptIn: this.#newsletterOptIn,
      membershipTier: this.#membershipTier,
      preferredLanguage: this.#preferredLanguage,
      tags: this.#tags,
      luckyNumbers: this.#luckyNumbers,
      metadata: this.#metadata,
      address: this.#address,
      employment: this.#employment,
      emergencyContacts: this.#emergencyContacts,
      sponsorWallet: this.#sponsorWallet,
      linkedWallets: this.#linkedWallets,
      extra: this.#extra,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      fullName: "fullName",
      nickname: "nickname",
      displayName: "displayName",
      age: "age",
      referredBy: "referredBy",
      accountBalance: "accountBalance",
      creditScoreFactor: "creditScoreFactor",
      acceptedTerms: "acceptedTerms",
      newsletterOptIn: "newsletterOptIn",
      membershipTier: "membershipTier",
      preferredLanguage: "preferredLanguage",
      tags$: "tags",
      get tags() {
        return "tags[:i]";
      },
      luckyNumbers$: "luckyNumbers",
      get luckyNumbers() {
        return "luckyNumbers[:i]";
      },
      metadata: "metadata",
      address$: "address",
      get address() {
        return withPrefix("address", RjsfShowcaseDto.Address.Fields);
      },
      employment$: "employment",
      get employment() {
        return withPrefix("employment", RjsfShowcaseDto.Employment.Fields);
      },
      emergencyContacts$: "emergencyContacts",
      get emergencyContacts() {
        return withPrefix(
          "emergencyContacts[:i]",
          RjsfShowcaseDto.EmergencyContacts.Fields,
        );
      },
      sponsorWallet: "sponsorWallet",
      linkedWallets$: "linkedWallets",
      get linkedWallets() {
        return withPrefix("linkedWallets", WalletEntity.Fields);
      },
      extra: "extra",
    };
  }
  /**
   * Creates an instance of RjsfShowcaseDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: RjsfShowcaseDtoType) {
    return new RjsfShowcaseDto(possibleDtoObject);
  }
  /**
   * Creates an instance of RjsfShowcaseDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<RjsfShowcaseDtoType>) {
    return new RjsfShowcaseDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<RjsfShowcaseDtoType>,
  ): InstanceType<typeof RjsfShowcaseDto> {
    return new RjsfShowcaseDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof RjsfShowcaseDto> {
    return new RjsfShowcaseDto(this.toJSON());
  }
}
export abstract class RjsfShowcaseDtoFactory {
  abstract create(data: unknown): RjsfShowcaseDto;
}
export type RjsfShowcaseDtoTranslationKey =
  keyof typeof RjsfShowcaseDto.DefaultTranslations;
export type RjsfShowcaseDtoTranslations = Record<
  RjsfShowcaseDtoTranslationKey,
  string
>;
/**
 * The base type definition for rjsfShowcaseDto
 **/
export type RjsfShowcaseDtoType = {
  /**
   * Full legal name of the applicant.
   * @type {string}
   **/
  fullName: string;
  /**
   * An optional, informal name.
   * @type {string}
   **/
  nickname?: string;
  /**
   * Localized display name of the applicant - one text per language (complexes.TString), not a single string.
   * @type {TString}
   **/
  displayName: TString;
  /**
   * Age in years.
   * @type {number}
   **/
  age: number;
  /**
   * Optional id of the member who referred this applicant.
   * @type {number}
   **/
  referredBy?: number;
  /**
   * Current balance of the account.
   * @type {number}
   **/
  accountBalance: number;
  /**
   * Optional weighting factor, if a credit bureau score was pulled.
   * @type {number}
   **/
  creditScoreFactor?: number;
  /**
   * Whether the applicant accepted the terms of service.
   * @type {boolean}
   **/
  acceptedTerms: boolean;
  /**
   * Optional newsletter subscription flag.
   * @type {boolean}
   **/
  newsletterOptIn?: boolean;
  /**
   * The membership tier assigned to this applicant.
   * @type {"bronze" | "silver" | "gold"}
   **/
  membershipTier: "bronze" | "silver" | "gold";
  /**
   * Optional preferred contact language.
   * @type {any}
   **/
  preferredLanguage?: any;
  /**
   * Free-form labels attached to the applicant.
   * @type {string[]}
   **/
  tags: string[];
  /**
   * A list of favourite integers.
   * @type {number[]}
   **/
  luckyNumbers: number[];
  /**
   * Arbitrary string metadata, keyed by string.
   * @type {{[key: string]: any}}
   **/
  metadata: { [key: string]: any };
  /**
   * Home address of the applicant.
   * @type {RjsfShowcaseDtoType.AddressType}
   **/
  address: RjsfShowcaseDtoType.AddressType;
  /**
   * Current employment details of the applicant.
   * @type {RjsfShowcaseDtoType.EmploymentType}
   **/
  employment?: RjsfShowcaseDtoType.EmploymentType;
  /**
   * People to contact in an emergency.
   * @type {RjsfShowcaseDtoType.EmergencyContactsType[]}
   **/
  emergencyContacts: RjsfShowcaseDtoType.EmergencyContactsType[];
  /**
   * Optional wallet this applicant is sponsored by.
   * @type {WalletEntity}
   **/
  sponsorWallet?: WalletEntity;
  /**
   * Other wallets linked to this applicant.
   * @type {WalletEntity[]}
   **/
  linkedWallets?: WalletEntity[];
  /**
   * Free-form extra payload, shape not known ahead of time.
   * @type {any}
   **/
  extra?: any;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RjsfShowcaseDtoType {
  /**
   * The base type definition for addressType
   **/
  export type AddressType = {
    /**
     *
     * @type {string}
     **/
    street: string;
    /**
     *
     * @type {string}
     **/
    city: string;
    /**
     *
     * @type {string}
     **/
    postalCode?: string;
    /**
     *
     * @type {"pl" | "ir" | "gb"}
     **/
    country: "pl" | "ir" | "gb";
  };
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace AddressType {}
  /**
   * The base type definition for employmentType
   **/
  export type EmploymentType = {
    /**
     *
     * @type {string}
     **/
    employer: string;
    /**
     *
     * @type {string}
     **/
    position?: string;
    /**
     * Prior roles held at this employer.
     * @type {RjsfShowcaseDtoType.EmploymentType.HistoryType[]}
     **/
    history: RjsfShowcaseDtoType.EmploymentType.HistoryType[];
    /**
     * The employer's registered company.
     * @type {RjsfShowcaseDtoType.EmploymentType.CompanyType}
     **/
    company: RjsfShowcaseDtoType.EmploymentType.CompanyType;
  };
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace EmploymentType {
    /**
     * The base type definition for historyType
     **/
    export type HistoryType = {
      /**
       *
       * @type {number}
       **/
      year: number;
      /**
       *
       * @type {string}
       **/
      role: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace HistoryType {}
    /**
     * The base type definition for companyType
     **/
    export type CompanyType = {
      /**
       *
       * @type {string}
       **/
      name: string;
      /**
       *
       * @type {number}
       **/
      foundedYear: number;
      /**
       *
       * @type {boolean}
       **/
      publiclyTraded: boolean;
      /**
       * Where the company is headquartered.
       * @type {RjsfShowcaseDtoType.EmploymentType.CompanyType.HeadquartersType}
       **/
      headquarters: RjsfShowcaseDtoType.EmploymentType.CompanyType.HeadquartersType;
    };
    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace CompanyType {
      /**
       * The base type definition for headquartersType
       **/
      export type HeadquartersType = {
        /**
         *
         * @type {string}
         **/
        city: string;
        /**
         *
         * @type {"pl" | "ir" | "gb"}
         **/
        country: "pl" | "ir" | "gb";
        /**
         * Precise coordinates of the headquarters.
         * @type {RjsfShowcaseDtoType.EmploymentType.CompanyType.HeadquartersType.GeoType}
         **/
        geo: RjsfShowcaseDtoType.EmploymentType.CompanyType.HeadquartersType.GeoType;
      };
      // eslint-disable-next-line @typescript-eslint/no-namespace
      export namespace HeadquartersType {
        /**
         * The base type definition for geoType
         **/
        export type GeoType = {
          /**
           *
           * @type {number}
           **/
          lat: number;
          /**
           *
           * @type {number}
           **/
          lng: number;
          /**
           *
           * @type {number}
           **/
          accuracyMeters?: number;
        };
        // eslint-disable-next-line @typescript-eslint/no-namespace
        export namespace GeoType {}
      }
    }
  }
  /**
   * The base type definition for emergencyContactsType
   **/
  export type EmergencyContactsType = {
    /**
     *
     * @type {string}
     **/
    name: string;
    /**
     *
     * @type {string}
     **/
    phone: string;
    /**
     *
     * @type {string}
     **/
    relationship?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace EmergencyContactsType {}
}
