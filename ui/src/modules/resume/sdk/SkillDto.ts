import { MOne } from "@fireback/js-remote-ctx/common/operators";
import { ResumeDto } from "./ResumeDto";
import { TString } from "@fireback/complexes";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for skillDto
 **/
export class SkillDto {
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
   * @type {any}
   **/
  #category?: any | null | undefined = undefined;
  /**
   *
   * @returns {any}
   **/
  get category() {
    return this.#category;
  }
  /**
   *
   * @type {any}
   **/
  set category(value: any | null | undefined) {
    this.#category = value;
  }
  setCategory(value: any | null | undefined) {
    this.category = value;
    return this;
  }
  /**
   *
   * @type {any}
   **/
  #level?: any | null | undefined = undefined;
  /**
   *
   * @returns {any}
   **/
  get level() {
    return this.#level;
  }
  /**
   *
   * @type {any}
   **/
  set level(value: any | null | undefined) {
    this.#level = value;
  }
  setLevel(value: any | null | undefined) {
    this.level = value;
    return this;
  }
  /**
   *
   * @type {number}
   **/
  #yearsOfExperience?: number | null | undefined = undefined;
  /**
   *
   * @returns {number}
   **/
  get yearsOfExperience() {
    return this.#yearsOfExperience;
  }
  /**
   *
   * @type {number}
   **/
  set yearsOfExperience(value: number | null | undefined) {
    const correctType =
      typeof value === "number" || value === undefined || value === null;
    const parsedValue = correctType ? value : Number(value);
    if (!Number.isNaN(parsedValue)) {
      this.#yearsOfExperience = parsedValue;
    }
  }
  setYearsOfExperience(value: number | null | undefined) {
    this.yearsOfExperience = value;
    return this;
  }
  /**
   * Longer free-text elaboration on the skill, if any.
   * @type {TString}
   **/
  #description?: TString | null | undefined = undefined;
  /**
   * Longer free-text elaboration on the skill, if any.
   * @returns {TString}
   **/
  get description() {
    return this.#description;
  }
  /**
   * Longer free-text elaboration on the skill, if any.
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
      name: {
        type: "string",
        title: "name_title",
      },
      category: {
        type: "string",
        title: "category_title",
        oneOf: [
          {
            const: "language",
            title: "category_enum_language",
          },
          {
            const: "framework",
            title: "category_enum_framework",
          },
          {
            const: "database",
            title: "category_enum_database",
          },
          {
            const: "protocol",
            title: "category_enum_protocol",
          },
          {
            const: "tool",
            title: "category_enum_tool",
          },
          {
            const: "platform",
            title: "category_enum_platform",
          },
          {
            const: "softSkill",
            title: "category_enum_soft_skill",
          },
          {
            const: "other",
            title: "category_enum_other",
          },
        ],
      },
      level: {
        type: "string",
        title: "level_title",
        oneOf: [
          {
            const: "beginner",
            title: "level_enum_beginner",
          },
          {
            const: "intermediate",
            title: "level_enum_intermediate",
          },
          {
            const: "advanced",
            title: "level_enum_advanced",
          },
          {
            const: "expert",
            title: "level_enum_expert",
          },
        ],
      },
      yearsOfExperience: {
        type: "integer",
        title: "years_of_experience_title",
      },
      description: {
        title: "description_title",
        description: "description_description",
      },
    },
    required: ["name"],
  };
  static DefaultTranslations = {
    $title: "SkillDto",
    $description: 'Plain dto mirroring the "skill" entity\'s own fields.',
    unique_id_title: "Unique Id",
    resume_title: "Resume",
    name_title: "Name",
    category_enum_language: "language",
    category_enum_framework: "framework",
    category_enum_database: "database",
    category_enum_protocol: "protocol",
    category_enum_tool: "tool",
    category_enum_platform: "platform",
    category_enum_soft_skill: "softSkill",
    category_enum_other: "other",
    category_title: "Category",
    level_enum_beginner: "beginner",
    level_enum_intermediate: "intermediate",
    level_enum_advanced: "advanced",
    level_enum_expert: "expert",
    level_title: "Level",
    years_of_experience_title: "Years Of Experience",
    description_title: "Description",
    description_description:
      "Longer free-text elaboration on the skill, if any.",
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
    const d = data as Partial<SkillDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.resume !== undefined) {
      this.resume = d.resume;
    }
    if (d.name !== undefined) {
      this.name = d.name;
    }
    if (d.category !== undefined) {
      this.category = d.category;
    }
    if (d.level !== undefined) {
      this.level = d.level;
    }
    if (d.yearsOfExperience !== undefined) {
      this.yearsOfExperience = d.yearsOfExperience;
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
      name: this.#name,
      category: this.#category,
      level: this.#level,
      yearsOfExperience: this.#yearsOfExperience,
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
      name: "name",
      category: "category",
      level: "level",
      yearsOfExperience: "yearsOfExperience",
      description: "description",
    };
  }
  /**
   * Creates an instance of SkillDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: SkillDtoType) {
    return new SkillDto(possibleDtoObject);
  }
  /**
   * Creates an instance of SkillDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<SkillDtoType>) {
    return new SkillDto(partialDtoObject);
  }
  copyWith(partial: PartialDeep<SkillDtoType>): InstanceType<typeof SkillDto> {
    return new SkillDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof SkillDto> {
    return new SkillDto(this.toJSON());
  }
}
export abstract class SkillDtoFactory {
  abstract create(data: unknown): SkillDto;
}
export type SkillDtoTranslationKey = keyof typeof SkillDto.DefaultTranslations;
export type SkillDtoTranslations = Record<SkillDtoTranslationKey, string>;
/**
 * The base type definition for skillDto
 **/
export type SkillDtoType = {
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
  name: string;
  /**
   *
   * @type {any}
   **/
  category?: any;
  /**
   *
   * @type {any}
   **/
  level?: any;
  /**
   *
   * @type {number}
   **/
  yearsOfExperience?: number;
  /**
   * Longer free-text elaboration on the skill, if any.
   * @type {TString}
   **/
  description?: TString;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SkillDtoType {}
