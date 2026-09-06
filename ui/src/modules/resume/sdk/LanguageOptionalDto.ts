import { MOne } from "@fireback/js-remote-ctx/common/operators";
import { ResumeDto } from "./ResumeDto";
import { TString } from "@fireback/complexes";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for languageOptionalDto
 **/
export class LanguageOptionalDto {
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
   * @type {any}
   **/
  #proficiency?: any | null | undefined = undefined;
  /**
   *
   * @returns {any}
   **/
  get proficiency() {
    return this.#proficiency;
  }
  /**
   *
   * @type {any}
   **/
  set proficiency(value: any | null | undefined) {
    this.#proficiency = value;
  }
  setProficiency(value: any | null | undefined) {
    this.proficiency = value;
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
      proficiency: {
        type: "string",
        title: "proficiency_title",
        oneOf: [
          {
            const: "elementary",
            title: "proficiency_enum_elementary",
          },
          {
            const: "limitedWorking",
            title: "proficiency_enum_limited_working",
          },
          {
            const: "professionalWorking",
            title: "proficiency_enum_professional_working",
          },
          {
            const: "fullProfessional",
            title: "proficiency_enum_full_professional",
          },
          {
            const: "nativeOrBilingual",
            title: "proficiency_enum_native_or_bilingual",
          },
        ],
      },
    },
    required: ["name"],
  };
  static DefaultTranslations = {
    $title: "LanguageOptionalDto",
    $description:
      "Every field of the \"language\" entity, but optional - used both as Update's partial input and as Browse's response item shape.",
    unique_id_title: "Unique Id",
    resume_title: "Resume",
    name_title: "Name",
    proficiency_enum_elementary: "elementary",
    proficiency_enum_limited_working: "limitedWorking",
    proficiency_enum_professional_working: "professionalWorking",
    proficiency_enum_full_professional: "fullProfessional",
    proficiency_enum_native_or_bilingual: "nativeOrBilingual",
    proficiency_title: "Proficiency",
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
    const d = data as Partial<LanguageOptionalDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.resume !== undefined) {
      this.resume = d.resume;
    }
    if (d.name !== undefined) {
      this.name = d.name;
    }
    if (d.proficiency !== undefined) {
      this.proficiency = d.proficiency;
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
      proficiency: this.#proficiency,
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
      proficiency: "proficiency",
    };
  }
  /**
   * Creates an instance of LanguageOptionalDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: LanguageOptionalDtoType) {
    return new LanguageOptionalDto(possibleDtoObject);
  }
  /**
   * Creates an instance of LanguageOptionalDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<LanguageOptionalDtoType>) {
    return new LanguageOptionalDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<LanguageOptionalDtoType>,
  ): InstanceType<typeof LanguageOptionalDto> {
    return new LanguageOptionalDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof LanguageOptionalDto> {
    return new LanguageOptionalDto(this.toJSON());
  }
}
export abstract class LanguageOptionalDtoFactory {
  abstract create(data: unknown): LanguageOptionalDto;
}
export type LanguageOptionalDtoTranslationKey =
  keyof typeof LanguageOptionalDto.DefaultTranslations;
export type LanguageOptionalDtoTranslations = Record<
  LanguageOptionalDtoTranslationKey,
  string
>;
/**
 * The base type definition for languageOptionalDto
 **/
export type LanguageOptionalDtoType = {
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
   * @type {any}
   **/
  proficiency?: any;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LanguageOptionalDtoType {}
