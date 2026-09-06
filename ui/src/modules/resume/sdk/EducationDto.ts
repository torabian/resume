import { MOne } from "@fireback/js-remote-ctx/common/operators";
import { ResumeDto } from "./ResumeDto";
import { TString } from "@fireback/complexes";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for educationDto
 **/
export class EducationDto {
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
   * @type {string}
   **/
  #institution: string = "";
  /**
   *
   * @returns {string}
   **/
  get institution() {
    return this.#institution;
  }
  /**
   *
   * @type {string}
   **/
  set institution(value: string) {
    this.#institution = String(value);
  }
  setInstitution(value: string) {
    this.institution = value;
    return this;
  }
  /**
   * e.g. "B.Sc.", "M.Sc.", "Bootcamp certificate".
   * @type {TString}
   **/
  #degree?: TString | null | undefined = undefined;
  /**
   * e.g. "B.Sc.", "M.Sc.", "Bootcamp certificate".
   * @returns {TString}
   **/
  get degree() {
    return this.#degree;
  }
  /**
   * e.g. "B.Sc.", "M.Sc.", "Bootcamp certificate".
   * @type {TString}
   **/
  set degree(value: TString | null | undefined) {
    // For a nullable complex field, an explicit undefined/null is a
    // deliberate value and has to pass through untouched - same as every
    // other nullable field's setter (array?, one?, object?, ...) above.
    // Anything else always becomes a real instance, exactly like a
    // non-nullable "complex" field does.
    if (value === null || value === undefined) {
      this.#degree = value === null ? null : undefined;
      return;
    }
    if (value instanceof TString) {
      this.#degree = value;
    } else {
      this.#degree = new TString(value);
    }
  }
  setDegree(value: TString | null | undefined) {
    this.degree = value;
    return this;
  }
  /**
   *
   * @type {TString}
   **/
  #fieldOfStudy?: TString | null | undefined = undefined;
  /**
   *
   * @returns {TString}
   **/
  get fieldOfStudy() {
    return this.#fieldOfStudy;
  }
  /**
   *
   * @type {TString}
   **/
  set fieldOfStudy(value: TString | null | undefined) {
    // For a nullable complex field, an explicit undefined/null is a
    // deliberate value and has to pass through untouched - same as every
    // other nullable field's setter (array?, one?, object?, ...) above.
    // Anything else always becomes a real instance, exactly like a
    // non-nullable "complex" field does.
    if (value === null || value === undefined) {
      this.#fieldOfStudy = value === null ? null : undefined;
      return;
    }
    if (value instanceof TString) {
      this.#fieldOfStudy = value;
    } else {
      this.#fieldOfStudy = new TString(value);
    }
  }
  setFieldOfStudy(value: TString | null | undefined) {
    this.fieldOfStudy = value;
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
   * @type {string}
   **/
  #startDate?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get startDate() {
    return this.#startDate;
  }
  /**
   *
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
   *
   * @type {string}
   **/
  #endDate?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get endDate() {
    return this.#endDate;
  }
  /**
   *
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
   * @type {string}
   **/
  #grade?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get grade() {
    return this.#grade;
  }
  /**
   *
   * @type {string}
   **/
  set grade(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#grade = correctType ? value : String(value);
  }
  setGrade(value: string | null | undefined) {
    this.grade = value;
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
      resume: {
        title: "resume_title",
      },
      institution: {
        type: "string",
        title: "institution_title",
      },
      degree: {
        title: "degree_title",
        description: "degree_description",
      },
      fieldOfStudy: {
        title: "field_of_study_title",
      },
      location: {
        title: "location_title",
      },
      startDate: {
        type: "string",
        title: "start_date_title",
      },
      endDate: {
        type: "string",
        title: "end_date_title",
      },
      isCurrent: {
        type: "boolean",
        title: "is_current_title",
      },
      grade: {
        type: "string",
        title: "grade_title",
      },
      description: {
        title: "description_title",
      },
    },
    required: ["institution"],
  };
  static DefaultTranslations = {
    $title: "EducationDto",
    $description: 'Plain dto mirroring the "education" entity\'s own fields.',
    unique_id_title: "Unique Id",
    resume_title: "Resume",
    institution_title: "Institution",
    degree_title: "Degree",
    degree_description: 'e.g. "B.Sc.", "M.Sc.", "Bootcamp certificate".',
    field_of_study_title: "Field Of Study",
    location_title: "Location",
    start_date_title: "Start Date",
    end_date_title: "End Date",
    is_current_title: "Is Current",
    grade_title: "Grade",
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
    const d = data as Partial<EducationDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.resume !== undefined) {
      this.resume = d.resume;
    }
    if (d.institution !== undefined) {
      this.institution = d.institution;
    }
    if (d.degree !== undefined) {
      this.degree = d.degree;
    }
    if (d.fieldOfStudy !== undefined) {
      this.fieldOfStudy = d.fieldOfStudy;
    }
    if (d.location !== undefined) {
      this.location = d.location;
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
    if (d.grade !== undefined) {
      this.grade = d.grade;
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
      resume: this.#resume,
      institution: this.#institution,
      degree: this.#degree,
      fieldOfStudy: this.#fieldOfStudy,
      location: this.#location,
      startDate: this.#startDate,
      endDate: this.#endDate,
      isCurrent: this.#isCurrent,
      grade: this.#grade,
      description: this.#description,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      resume: "resume",
      institution: "institution",
      degree: "degree",
      fieldOfStudy: "fieldOfStudy",
      location: "location",
      startDate: "startDate",
      endDate: "endDate",
      isCurrent: "isCurrent",
      grade: "grade",
      description: "description",
    };
  }
  /**
   * Creates an instance of EducationDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: EducationDtoType) {
    return new EducationDto(possibleDtoObject);
  }
  /**
   * Creates an instance of EducationDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<EducationDtoType>) {
    return new EducationDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<EducationDtoType>,
  ): InstanceType<typeof EducationDto> {
    return new EducationDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof EducationDto> {
    return new EducationDto(this.toJSON());
  }
}
export abstract class EducationDtoFactory {
  abstract create(data: unknown): EducationDto;
}
export type EducationDtoTranslationKey =
  keyof typeof EducationDto.DefaultTranslations;
export type EducationDtoTranslations = Record<
  EducationDtoTranslationKey,
  string
>;
/**
 * The base type definition for educationDto
 **/
export type EducationDtoType = {
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
   * @type {string}
   **/
  institution: string;
  /**
   * e.g. "B.Sc.", "M.Sc.", "Bootcamp certificate".
   * @type {TString}
   **/
  degree?: TString;
  /**
   *
   * @type {TString}
   **/
  fieldOfStudy?: TString;
  /**
   *
   * @type {TString}
   **/
  location?: TString;
  /**
   *
   * @type {string}
   **/
  startDate?: string;
  /**
   *
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
   * @type {string}
   **/
  grade?: string;
  /**
   *
   * @type {TString}
   **/
  description?: TString;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EducationDtoType {}
