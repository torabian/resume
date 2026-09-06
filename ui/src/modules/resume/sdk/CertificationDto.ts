import { MOne } from "@fireback/js-remote-ctx/common/operators";
import { ResumeDto } from "./ResumeDto";
import { TString } from "@fireback/complexes";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for certificationDto
 **/
export class CertificationDto {
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
   * @type {ResumeDto}
   **/
  #resume?: MOne<ResumeDto> | null | undefined = undefined;
  /**
   *
   * @returns {ResumeDto}
   **/
  get resume() {
    return this.#resume;
  }
  /**
   *
   * @type {ResumeDto}
   **/
  set resume(
    value:
      | MOne<ResumeDto>
      | null
      | undefined
      | InstanceType<typeof ResumeDto>
      | null
      | undefined,
  ) {
    // For a nullable relation, a literal null is a deliberate "clear"
    // signal and has to stay null - not fall through to the else branch
    // below and become MOne.of(new ResumeDto(null)) (the
    // constructor tolerates a null/undefined argument by returning an
    // empty-but-non-null instance), which serializes as an empty object
    // instead of null. The backend tells "explicitly cleared" apart from
    // "field left untouched" (an absent key) only by seeing a real null
    // on the wire, the same way every other nullable field here (array?,
    // collection?) already short-circuits on null/undefined above.
    if (value === null || value === undefined) {
      this.#resume = value === null ? null : undefined;
      return;
    }
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof MOne) {
      this.#resume = value;
    } else if (value instanceof ResumeDto) {
      this.#resume = MOne.of(value);
    } else {
      this.#resume = MOne.of(new ResumeDto(value));
    }
  }
  setResume(
    value:
      | MOne<ResumeDto>
      | null
      | undefined
      | InstanceType<typeof ResumeDto>
      | null
      | undefined,
  ) {
    this.resume = value;
    return this;
  }
  /**
   *
   * @type {TString}
   **/
  #name!: TString;
  /**
   *
   * @returns {TString}
   **/
  get name() {
    return this.#name;
  }
  /**
   *
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
   *
   * @type {string}
   **/
  #issuingOrganization?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get issuingOrganization() {
    return this.#issuingOrganization;
  }
  /**
   *
   * @type {string}
   **/
  set issuingOrganization(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#issuingOrganization = correctType ? value : String(value);
  }
  setIssuingOrganization(value: string | null | undefined) {
    this.issuingOrganization = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #issueDate?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get issueDate() {
    return this.#issueDate;
  }
  /**
   *
   * @type {string}
   **/
  set issueDate(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#issueDate = correctType ? value : String(value);
  }
  setIssueDate(value: string | null | undefined) {
    this.issueDate = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #expirationDate?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get expirationDate() {
    return this.#expirationDate;
  }
  /**
   *
   * @type {string}
   **/
  set expirationDate(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#expirationDate = correctType ? value : String(value);
  }
  setExpirationDate(value: string | null | undefined) {
    this.expirationDate = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #credentialId?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get credentialId() {
    return this.#credentialId;
  }
  /**
   *
   * @type {string}
   **/
  set credentialId(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#credentialId = correctType ? value : String(value);
  }
  setCredentialId(value: string | null | undefined) {
    this.credentialId = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #credentialUrl?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get credentialUrl() {
    return this.#credentialUrl;
  }
  /**
   *
   * @type {string}
   **/
  set credentialUrl(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#credentialUrl = correctType ? value : String(value);
  }
  setCredentialUrl(value: string | null | undefined) {
    this.credentialUrl = value;
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
      resume: {
        title: "resume_title",
      },
      name: {
        title: "name_title",
      },
      issuingOrganization: {
        type: "string",
        title: "issuing_organization_title",
      },
      issueDate: {
        type: "string",
        title: "issue_date_title",
      },
      expirationDate: {
        type: "string",
        title: "expiration_date_title",
      },
      credentialId: {
        type: "string",
        title: "credential_id_title",
      },
      credentialUrl: {
        type: "string",
        title: "credential_url_title",
      },
    },
    required: ["name"],
  };
  static DefaultTranslations = {
    $title: "CertificationDto",
    $description:
      'Plain dto mirroring the "certification" entity\'s own fields.',
    unique_id_title: "Unique Id",
    resume_title: "Resume",
    name_title: "Name",
    issuing_organization_title: "Issuing Organization",
    issue_date_title: "Issue Date",
    expiration_date_title: "Expiration Date",
    credential_id_title: "Credential Id",
    credential_url_title: "Credential Url",
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
    const d = data as Partial<CertificationDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.resume !== undefined) {
      this.resume = d.resume;
    }
    if (d.name !== undefined) {
      this.name = d.name;
    }
    if (d.issuingOrganization !== undefined) {
      this.issuingOrganization = d.issuingOrganization;
    }
    if (d.issueDate !== undefined) {
      this.issueDate = d.issueDate;
    }
    if (d.expirationDate !== undefined) {
      this.expirationDate = d.expirationDate;
    }
    if (d.credentialId !== undefined) {
      this.credentialId = d.credentialId;
    }
    if (d.credentialUrl !== undefined) {
      this.credentialUrl = d.credentialUrl;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      uniqueId: this.#uniqueId,
      resume: this.#resume,
      name: this.#name,
      issuingOrganization: this.#issuingOrganization,
      issueDate: this.#issueDate,
      expirationDate: this.#expirationDate,
      credentialId: this.#credentialId,
      credentialUrl: this.#credentialUrl,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      resume: "resume",
      name: "name",
      issuingOrganization: "issuingOrganization",
      issueDate: "issueDate",
      expirationDate: "expirationDate",
      credentialId: "credentialId",
      credentialUrl: "credentialUrl",
    };
  }
  /**
   * Creates an instance of CertificationDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: CertificationDtoType) {
    return new CertificationDto(possibleDtoObject);
  }
  /**
   * Creates an instance of CertificationDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<CertificationDtoType>) {
    return new CertificationDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<CertificationDtoType>,
  ): InstanceType<typeof CertificationDto> {
    return new CertificationDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof CertificationDto> {
    return new CertificationDto(this.toJSON());
  }
}
export abstract class CertificationDtoFactory {
  abstract create(data: unknown): CertificationDto;
}
export type CertificationDtoTranslationKey =
  keyof typeof CertificationDto.DefaultTranslations;
export type CertificationDtoTranslations = Record<
  CertificationDtoTranslationKey,
  string
>;
/**
 * The base type definition for certificationDto
 **/
export type CertificationDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   *
   * @type {ResumeDto}
   **/
  resume?: ResumeDto;
  /**
   *
   * @type {TString}
   **/
  name: TString;
  /**
   *
   * @type {string}
   **/
  issuingOrganization?: string;
  /**
   *
   * @type {string}
   **/
  issueDate?: string;
  /**
   *
   * @type {string}
   **/
  expirationDate?: string;
  /**
   *
   * @type {string}
   **/
  credentialId?: string;
  /**
   *
   * @type {string}
   **/
  credentialUrl?: string;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CertificationDtoType {}
