import { TString } from "@fireback/complexes";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for companyOptionalDto
 **/
export class CompanyOptionalDto {
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
   *
   * @type {string}
   **/
  #name?: string | null | undefined = undefined;
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
  set name(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#name = correctType ? value : String(value);
  }
  setName(value: string | null | undefined) {
    this.name = value;
    return this;
  }
  /**
   *
   * @type {TString}
   **/
  #industry?: TString | null | undefined = undefined;
  /**
   *
   * @returns {TString}
   **/
  get industry() {
    return this.#industry;
  }
  /**
   *
   * @type {TString}
   **/
  set industry(value: TString | null | undefined) {
    // For a nullable complex field, an explicit undefined/null is a
    // deliberate value and has to pass through untouched - same as every
    // other nullable field's setter (array?, one?, object?, ...) above.
    // Anything else always becomes a real instance, exactly like a
    // non-nullable "complex" field does.
    if (value === null || value === undefined) {
      this.#industry = value === null ? null : undefined;
      return;
    }
    if (value instanceof TString) {
      this.#industry = value;
    } else {
      this.#industry = new TString(value);
    }
  }
  setIndustry(value: TString | null | undefined) {
    this.industry = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #website?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get website() {
    return this.#website;
  }
  /**
   *
   * @type {string}
   **/
  set website(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#website = correctType ? value : String(value);
  }
  setWebsite(value: string | null | undefined) {
    this.website = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #logoUrl?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get logoUrl() {
    return this.#logoUrl;
  }
  /**
   *
   * @type {string}
   **/
  set logoUrl(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#logoUrl = correctType ? value : String(value);
  }
  setLogoUrl(value: string | null | undefined) {
    this.logoUrl = value;
    return this;
  }
  /**
   *
   * @type {TString}
   **/
  #location?: TString | null | undefined = undefined;
  /**
   *
   * @returns {TString}
   **/
  get location() {
    return this.#location;
  }
  /**
   *
   * @type {TString}
   **/
  set location(value: TString | null | undefined) {
    // For a nullable complex field, an explicit undefined/null is a
    // deliberate value and has to pass through untouched - same as every
    // other nullable field's setter (array?, one?, object?, ...) above.
    // Anything else always becomes a real instance, exactly like a
    // non-nullable "complex" field does.
    if (value === null || value === undefined) {
      this.#location = value === null ? null : undefined;
      return;
    }
    if (value instanceof TString) {
      this.#location = value;
    } else {
      this.#location = new TString(value);
    }
  }
  setLocation(value: TString | null | undefined) {
    this.location = value;
    return this;
  }
  /**
   *
   * @type {TString}
   **/
  #description?: TString | null | undefined = undefined;
  /**
   *
   * @returns {TString}
   **/
  get description() {
    return this.#description;
  }
  /**
   *
   * @type {TString}
   **/
  set description(value: TString | null | undefined) {
    // For a nullable complex field, an explicit undefined/null is a
    // deliberate value and has to pass through untouched - same as every
    // other nullable field's setter (array?, one?, object?, ...) above.
    // Anything else always becomes a real instance, exactly like a
    // non-nullable "complex" field does.
    if (value === null || value === undefined) {
      this.#description = value === null ? null : undefined;
      return;
    }
    if (value instanceof TString) {
      this.#description = value;
    } else {
      this.#description = new TString(value);
    }
  }
  setDescription(value: TString | null | undefined) {
    this.description = value;
    return this;
  }
  static JsonSchema = {
    type: "object",
    title: "$title",
    description: "$description",
    properties: {
      uniqueId: {
        type: "string",
        title: "unique_id_title",
      },
      name: {
        type: "string",
        title: "name_title",
      },
      industry: {
        title: "industry_title",
      },
      website: {
        type: "string",
        title: "website_title",
      },
      logoUrl: {
        type: "string",
        title: "logo_url_title",
      },
      location: {
        title: "location_title",
      },
      description: {
        title: "description_title",
      },
    },
  };
  static DefaultTranslations = {
    $title: "CompanyOptionalDto",
    $description:
      "Every field of the \"company\" entity, but optional - used both as Update's partial input and as Browse's response item shape.",
    unique_id_title: "Unique Id",
    name_title: "Name",
    industry_title: "Industry",
    website_title: "Website",
    logo_url_title: "Logo Url",
    location_title: "Location",
    description_title: "Description",
  } as const;
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
    const d = data as Partial<CompanyOptionalDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.name !== undefined) {
      this.name = d.name;
    }
    if (d.industry !== undefined) {
      this.industry = d.industry;
    }
    if (d.website !== undefined) {
      this.website = d.website;
    }
    if (d.logoUrl !== undefined) {
      this.logoUrl = d.logoUrl;
    }
    if (d.location !== undefined) {
      this.location = d.location;
    }
    if (d.description !== undefined) {
      this.description = d.description;
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
      industry: this.#industry,
      website: this.#website,
      logoUrl: this.#logoUrl,
      location: this.#location,
      description: this.#description,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      name: "name",
      industry: "industry",
      website: "website",
      logoUrl: "logoUrl",
      location: "location",
      description: "description",
    };
  }
  /**
   * Creates an instance of CompanyOptionalDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: CompanyOptionalDtoType) {
    return new CompanyOptionalDto(possibleDtoObject);
  }
  /**
   * Creates an instance of CompanyOptionalDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<CompanyOptionalDtoType>) {
    return new CompanyOptionalDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<CompanyOptionalDtoType>,
  ): InstanceType<typeof CompanyOptionalDto> {
    return new CompanyOptionalDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof CompanyOptionalDto> {
    return new CompanyOptionalDto(this.toJSON());
  }
}
export abstract class CompanyOptionalDtoFactory {
  abstract create(data: unknown): CompanyOptionalDto;
}
export type CompanyOptionalDtoTranslationKey =
  keyof typeof CompanyOptionalDto.DefaultTranslations;
export type CompanyOptionalDtoTranslations = Record<
  CompanyOptionalDtoTranslationKey,
  string
>;
/**
 * The base type definition for companyOptionalDto
 **/
export type CompanyOptionalDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   *
   * @type {string}
   **/
  name?: string;
  /**
   *
   * @type {TString}
   **/
  industry?: TString;
  /**
   *
   * @type {string}
   **/
  website?: string;
  /**
   *
   * @type {string}
   **/
  logoUrl?: string;
  /**
   *
   * @type {TString}
   **/
  location?: TString;
  /**
   *
   * @type {TString}
   **/
  description?: TString;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CompanyOptionalDtoType {}
