import { CompanyDto } from "./CompanyDto";
import { MOne } from "@fireback/js-remote-ctx/common/operators";
import { ResumeDto } from "./ResumeDto";
import { TString } from "@fireback/complexes";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for workExperienceOptionalDto
 **/
export class WorkExperienceOptionalDto {
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
   * @type {CompanyDto}
   **/
  #company?: MOne<CompanyDto> | null | undefined = undefined;
  /**
   *
   * @returns {CompanyDto}
   **/
  get company() {
    return this.#company;
  }
  /**
   *
   * @type {CompanyDto}
   **/
  set company(
    value:
      | MOne<CompanyDto>
      | null
      | undefined
      | InstanceType<typeof CompanyDto>
      | null
      | undefined,
  ) {
    // For a nullable relation, a literal null is a deliberate "clear"
    // signal and has to stay null - not fall through to the else branch
    // below and become MOne.of(new CompanyDto(null)) (the
    // constructor tolerates a null/undefined argument by returning an
    // empty-but-non-null instance), which serializes as an empty object
    // instead of null. The backend tells "explicitly cleared" apart from
    // "field left untouched" (an absent key) only by seeing a real null
    // on the wire, the same way every other nullable field here (array?,
    // collection?) already short-circuits on null/undefined above.
    if (value === null || value === undefined) {
      this.#company = value === null ? null : undefined;
      return;
    }
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof MOne) {
      this.#company = value;
    } else if (value instanceof CompanyDto) {
      this.#company = MOne.of(value);
    } else {
      this.#company = MOne.of(new CompanyDto(value));
    }
  }
  setCompany(
    value:
      | MOne<CompanyDto>
      | null
      | undefined
      | InstanceType<typeof CompanyDto>
      | null
      | undefined,
  ) {
    this.company = value;
    return this;
  }
  /**
   *
   * @type {TString}
   **/
  #jobTitle!: TString;
  /**
   *
   * @returns {TString}
   **/
  get jobTitle() {
    return this.#jobTitle;
  }
  /**
   *
   * @type {TString}
   **/
  set jobTitle(value: TString) {
    if (value instanceof TString) {
      this.#jobTitle = value;
    } else {
      this.#jobTitle = new TString(value);
    }
  }
  setJobTitle(value: TString) {
    this.jobTitle = value;
    return this;
  }
  /**
   *
   * @type {any}
   **/
  #employmentType?: any | null | undefined = undefined;
  /**
   *
   * @returns {any}
   **/
  get employmentType() {
    return this.#employmentType;
  }
  /**
   *
   * @type {any}
   **/
  set employmentType(value: any | null | undefined) {
    this.#employmentType = value;
  }
  setEmploymentType(value: any | null | undefined) {
    this.employmentType = value;
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
   * @type {boolean}
   **/
  #remote?: boolean | null | undefined = undefined;
  /**
   *
   * @returns {boolean}
   **/
  get remote() {
    return this.#remote;
  }
  /**
   *
   * @type {boolean}
   **/
  set remote(value: boolean | null | undefined) {
    const correctType =
      value === true ||
      value === false ||
      value === undefined ||
      value === null;
    this.#remote = correctType ? value : Boolean(value);
  }
  setRemote(value: boolean | null | undefined) {
    this.remote = value;
    return this;
  }
  /**
   * ISO-8601 date, e.g. "2021-03-01".
   * @type {string}
   **/
  #startDate?: string | null | undefined = undefined;
  /**
   * ISO-8601 date, e.g. "2021-03-01".
   * @returns {string}
   **/
  get startDate() {
    return this.#startDate;
  }
  /**
   * ISO-8601 date, e.g. "2021-03-01".
   * @type {string}
   **/
  set startDate(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#startDate = correctType ? value : String(value);
  }
  setStartDate(value: string | null | undefined) {
    this.startDate = value;
    return this;
  }
  /**
   * ISO-8601 date. Empty/omitted when isCurrent is true.
   * @type {string}
   **/
  #endDate?: string | null | undefined = undefined;
  /**
   * ISO-8601 date. Empty/omitted when isCurrent is true.
   * @returns {string}
   **/
  get endDate() {
    return this.#endDate;
  }
  /**
   * ISO-8601 date. Empty/omitted when isCurrent is true.
   * @type {string}
   **/
  set endDate(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#endDate = correctType ? value : String(value);
  }
  setEndDate(value: string | null | undefined) {
    this.endDate = value;
    return this;
  }
  /**
   *
   * @type {boolean}
   **/
  #isCurrent?: boolean | null | undefined = undefined;
  /**
   *
   * @returns {boolean}
   **/
  get isCurrent() {
    return this.#isCurrent;
  }
  /**
   *
   * @type {boolean}
   **/
  set isCurrent(value: boolean | null | undefined) {
    const correctType =
      value === true ||
      value === false ||
      value === undefined ||
      value === null;
    this.#isCurrent = correctType ? value : Boolean(value);
  }
  setIsCurrent(value: boolean | null | undefined) {
    this.isCurrent = value;
    return this;
  }
  /**
   *
   * @type {TString}
   **/
  #summary?: TString | null | undefined = undefined;
  /**
   *
   * @returns {TString}
   **/
  get summary() {
    return this.#summary;
  }
  /**
   *
   * @type {TString}
   **/
  set summary(value: TString | null | undefined) {
    // For a nullable complex field, an explicit undefined/null is a
    // deliberate value and has to pass through untouched - same as every
    // other nullable field's setter (array?, one?, object?, ...) above.
    // Anything else always becomes a real instance, exactly like a
    // non-nullable "complex" field does.
    if (value === null || value === undefined) {
      this.#summary = value === null ? null : undefined;
      return;
    }
    if (value instanceof TString) {
      this.#summary = value;
    } else {
      this.#summary = new TString(value);
    }
  }
  setSummary(value: TString | null | undefined) {
    this.summary = value;
    return this;
  }
  /**
   *
   * @type {any}
   **/
  #achievements?: any | null | undefined = undefined;
  /**
   *
   * @returns {any}
   **/
  get achievements() {
    return this.#achievements;
  }
  /**
   *
   * @type {any}
   **/
  set achievements(value: any | null | undefined) {
    this.#achievements = value;
  }
  setAchievements(value: any | null | undefined) {
    this.achievements = value;
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
      company: {
        title: "company_title",
      },
      jobTitle: {
        title: "job_title_title",
      },
      employmentType: {
        type: "string",
        title: "employment_type_title",
        oneOf: [
          {
            const: "fullTime",
            title: "employment_type_enum_full_time",
          },
          {
            const: "partTime",
            title: "employment_type_enum_part_time",
          },
          {
            const: "contract",
            title: "employment_type_enum_contract",
          },
          {
            const: "internship",
            title: "employment_type_enum_internship",
          },
          {
            const: "freelance",
            title: "employment_type_enum_freelance",
          },
        ],
      },
      location: {
        title: "location_title",
      },
      remote: {
        type: "boolean",
        title: "remote_title",
      },
      startDate: {
        type: "string",
        title: "start_date_title",
        description: "start_date_description",
      },
      endDate: {
        type: "string",
        title: "end_date_title",
        description: "end_date_description",
      },
      isCurrent: {
        type: "boolean",
        title: "is_current_title",
      },
      summary: {
        title: "summary_title",
      },
      achievements: {
        type: "array",
        title: "achievements_title",
        items: {
          type: "string",
        },
      },
    },
    required: ["jobTitle"],
  };
  static DefaultTranslations = {
    $title: "WorkExperienceOptionalDto",
    $description:
      "Every field of the \"workExperience\" entity, but optional - used both as Update's partial input and as Browse's response item shape.",
    unique_id_title: "Unique Id",
    resume_title: "Resume",
    company_title: "Company",
    job_title_title: "Job Title",
    employment_type_enum_full_time: "fullTime",
    employment_type_enum_part_time: "partTime",
    employment_type_enum_contract: "contract",
    employment_type_enum_internship: "internship",
    employment_type_enum_freelance: "freelance",
    employment_type_title: "Employment Type",
    location_title: "Location",
    remote_title: "Remote",
    start_date_title: "Start Date",
    start_date_description: 'ISO-8601 date, e.g. "2021-03-01".',
    end_date_title: "End Date",
    end_date_description:
      "ISO-8601 date. Empty/omitted when isCurrent is true.",
    is_current_title: "Is Current",
    summary_title: "Summary",
    achievements_title: "Achievements",
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
    const d = data as Partial<WorkExperienceOptionalDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.resume !== undefined) {
      this.resume = d.resume;
    }
    if (d.company !== undefined) {
      this.company = d.company;
    }
    if (d.jobTitle !== undefined) {
      this.jobTitle = d.jobTitle;
    }
    if (d.employmentType !== undefined) {
      this.employmentType = d.employmentType;
    }
    if (d.location !== undefined) {
      this.location = d.location;
    }
    if (d.remote !== undefined) {
      this.remote = d.remote;
    }
    if (d.startDate !== undefined) {
      this.startDate = d.startDate;
    }
    if (d.endDate !== undefined) {
      this.endDate = d.endDate;
    }
    if (d.isCurrent !== undefined) {
      this.isCurrent = d.isCurrent;
    }
    if (d.summary !== undefined) {
      this.summary = d.summary;
    }
    if (d.achievements !== undefined) {
      this.achievements = d.achievements;
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
      company: this.#company,
      jobTitle: this.#jobTitle,
      employmentType: this.#employmentType,
      location: this.#location,
      remote: this.#remote,
      startDate: this.#startDate,
      endDate: this.#endDate,
      isCurrent: this.#isCurrent,
      summary: this.#summary,
      achievements: this.#achievements,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      resume: "resume",
      company: "company",
      jobTitle: "jobTitle",
      employmentType: "employmentType",
      location: "location",
      remote: "remote",
      startDate: "startDate",
      endDate: "endDate",
      isCurrent: "isCurrent",
      summary: "summary",
      achievements: "achievements",
    };
  }
  /**
   * Creates an instance of WorkExperienceOptionalDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: WorkExperienceOptionalDtoType) {
    return new WorkExperienceOptionalDto(possibleDtoObject);
  }
  /**
   * Creates an instance of WorkExperienceOptionalDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<WorkExperienceOptionalDtoType>) {
    return new WorkExperienceOptionalDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<WorkExperienceOptionalDtoType>,
  ): InstanceType<typeof WorkExperienceOptionalDto> {
    return new WorkExperienceOptionalDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof WorkExperienceOptionalDto> {
    return new WorkExperienceOptionalDto(this.toJSON());
  }
}
export abstract class WorkExperienceOptionalDtoFactory {
  abstract create(data: unknown): WorkExperienceOptionalDto;
}
export type WorkExperienceOptionalDtoTranslationKey =
  keyof typeof WorkExperienceOptionalDto.DefaultTranslations;
export type WorkExperienceOptionalDtoTranslations = Record<
  WorkExperienceOptionalDtoTranslationKey,
  string
>;
/**
 * The base type definition for workExperienceOptionalDto
 **/
export type WorkExperienceOptionalDtoType = {
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
   * @type {CompanyDto}
   **/
  company?: CompanyDto;
  /**
   *
   * @type {TString}
   **/
  jobTitle: TString;
  /**
   *
   * @type {any}
   **/
  employmentType?: any;
  /**
   *
   * @type {TString}
   **/
  location?: TString;
  /**
   *
   * @type {boolean}
   **/
  remote?: boolean;
  /**
   * ISO-8601 date, e.g. "2021-03-01".
   * @type {string}
   **/
  startDate?: string;
  /**
   * ISO-8601 date. Empty/omitted when isCurrent is true.
   * @type {string}
   **/
  endDate?: string;
  /**
   *
   * @type {boolean}
   **/
  isCurrent?: boolean;
  /**
   *
   * @type {TString}
   **/
  summary?: TString;
  /**
   *
   * @type {any}
   **/
  achievements?: any;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace WorkExperienceOptionalDtoType {}
