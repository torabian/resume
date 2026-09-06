import { TString, XDate } from "@fireback/complexes";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for workExperienceDto
 **/
export class WorkExperienceDto {
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
   * @type {TString}
   **/
  #company!: TString;
  /**
   *
   * @returns {TString}
   **/
  get company() {
    return this.#company;
  }
  /**
   *
   * @type {TString}
   **/
  set company(value: TString) {
    if (value instanceof TString) {
      this.#company = value;
    } else {
      this.#company = new TString(value);
    }
  }
  setCompany(value: TString) {
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
   * @type {XDate}
   **/
  #startDate!: XDate;
  /**
   * ISO-8601 date, e.g. "2021-03-01".
   * @returns {XDate}
   **/
  get startDate() {
    return this.#startDate;
  }
  /**
   * ISO-8601 date, e.g. "2021-03-01".
   * @type {XDate}
   **/
  set startDate(value: XDate) {
    if (value instanceof XDate) {
      this.#startDate = value;
    } else {
      this.#startDate = new XDate(value);
    }
  }
  setStartDate(value: XDate) {
    this.startDate = value;
    return this;
  }
  /**
   * ISO-8601 date. Empty/omitted when isCurrent is true.
   * @type {XDate}
   **/
  #endDate?: XDate | null | undefined = undefined;
  /**
   * ISO-8601 date. Empty/omitted when isCurrent is true.
   * @returns {XDate}
   **/
  get endDate() {
    return this.#endDate;
  }
  /**
   * ISO-8601 date. Empty/omitted when isCurrent is true.
   * @type {XDate}
   **/
  set endDate(value: XDate | null | undefined) {
    // For a nullable complex field, an explicit undefined/null is a
    // deliberate value and has to pass through untouched - same as every
    // other nullable field's setter (array?, one?, object?, ...) above.
    // Anything else always becomes a real instance, exactly like a
    // non-nullable "complex" field does.
    if (value === null || value === undefined) {
      this.#endDate = value === null ? null : undefined;
      return;
    }
    if (value instanceof XDate) {
      this.#endDate = value;
    } else {
      this.#endDate = new XDate(value);
    }
  }
  setEndDate(value: XDate | null | undefined) {
    this.endDate = value;
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
        title: "start_date_title",
        description: "start_date_description",
      },
      endDate: {
        title: "end_date_title",
        description: "end_date_description",
      },
      achievements: {
        type: "array",
        title: "achievements_title",
        items: {
          type: "string",
        },
      },
    },
    required: ["company", "jobTitle", "startDate"],
  };
  static DefaultTranslations = {
    $title: "WorkExperienceDto",
    $description:
      'Plain dto mirroring the "workExperience" entity\'s own fields.',
    unique_id_title: "Unique Id",
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
    const d = data as Partial<WorkExperienceDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
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
      company: this.#company,
      jobTitle: this.#jobTitle,
      employmentType: this.#employmentType,
      location: this.#location,
      remote: this.#remote,
      startDate: this.#startDate,
      endDate: this.#endDate,
      achievements: this.#achievements,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      company: "company",
      jobTitle: "jobTitle",
      employmentType: "employmentType",
      location: "location",
      remote: "remote",
      startDate: "startDate",
      endDate: "endDate",
      achievements: "achievements",
    };
  }
  /**
   * Creates an instance of WorkExperienceDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: WorkExperienceDtoType) {
    return new WorkExperienceDto(possibleDtoObject);
  }
  /**
   * Creates an instance of WorkExperienceDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<WorkExperienceDtoType>) {
    return new WorkExperienceDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<WorkExperienceDtoType>,
  ): InstanceType<typeof WorkExperienceDto> {
    return new WorkExperienceDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof WorkExperienceDto> {
    return new WorkExperienceDto(this.toJSON());
  }
}
export abstract class WorkExperienceDtoFactory {
  abstract create(data: unknown): WorkExperienceDto;
}
export type WorkExperienceDtoTranslationKey =
  keyof typeof WorkExperienceDto.DefaultTranslations;
export type WorkExperienceDtoTranslations = Record<
  WorkExperienceDtoTranslationKey,
  string
>;
/**
 * The base type definition for workExperienceDto
 **/
export type WorkExperienceDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   *
   * @type {TString}
   **/
  company: TString;
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
   * @type {XDate}
   **/
  startDate: XDate;
  /**
   * ISO-8601 date. Empty/omitted when isCurrent is true.
   * @type {XDate}
   **/
  endDate?: XDate;
  /**
   *
   * @type {any}
   **/
  achievements?: any;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace WorkExperienceDtoType {}
