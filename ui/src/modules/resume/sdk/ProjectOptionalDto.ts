import {
  MArray,
  MCollection,
  MOne,
} from "@fireback/js-remote-ctx/common/operators";
import { SkillDto } from "./SkillDto";
import { TString, XDate } from "@fireback/complexes";
import { TargetPositionDto } from "./TargetPositionDto";
import { WorkExperienceDto } from "./WorkExperienceDto";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
import { withPrefix } from "@fireback/js-remote-ctx/common/withPrefix";
/**
 * The base class definition for projectOptionalDto
 **/
export class ProjectOptionalDto {
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
   * The work experience that this project is done based on that.
   * @type {WorkExperienceDto}
   **/
  #experience?: MOne<WorkExperienceDto> | null | undefined = undefined;
  /**
   * The work experience that this project is done based on that.
   * @returns {WorkExperienceDto}
   **/
  get experience() {
    return this.#experience;
  }
  /**
   * The work experience that this project is done based on that.
   * @type {WorkExperienceDto}
   **/
  set experience(
    value:
      | MOne<WorkExperienceDto>
      | null
      | undefined
      | InstanceType<typeof WorkExperienceDto>
      | null
      | undefined,
  ) {
    // For a nullable relation, a literal null is a deliberate "clear"
    // signal and has to stay null - not fall through to the else branch
    // below and become MOne.of(new WorkExperienceDto(null)) (the
    // constructor tolerates a null/undefined argument by returning an
    // empty-but-non-null instance), which serializes as an empty object
    // instead of null. The backend tells "explicitly cleared" apart from
    // "field left untouched" (an absent key) only by seeing a real null
    // on the wire, the same way every other nullable field here (array?,
    // collection?) already short-circuits on null/undefined above.
    if (value === null || value === undefined) {
      this.#experience = value === null ? null : undefined;
      return;
    }
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof MOne) {
      this.#experience = value;
    } else if (value instanceof WorkExperienceDto) {
      this.#experience = MOne.of(value);
    } else {
      this.#experience = MOne.of(new WorkExperienceDto(value));
    }
  }
  setExperience(
    value:
      | MOne<WorkExperienceDto>
      | null
      | undefined
      | InstanceType<typeof WorkExperienceDto>
      | null
      | undefined,
  ) {
    this.experience = value;
    return this;
  }
  /**
   * The project description, based on the target profile. So you can emphesize more on backend or front-end part of the project.
   * @type {ProjectOptionalDto.Descriptions}
   **/
  #descriptions?:
    | MArray<InstanceType<typeof ProjectOptionalDto.Descriptions>>
    | null
    | undefined = undefined;
  /**
   * The project description, based on the target profile. So you can emphesize more on backend or front-end part of the project.
   * @returns {ProjectOptionalDto.Descriptions}
   **/
  get descriptions() {
    return this.#descriptions;
  }
  /**
   * The project description, based on the target profile. So you can emphesize more on backend or front-end part of the project.
   * @type {ProjectOptionalDto.Descriptions}
   **/
  set descriptions(
    value:
      | MArray<InstanceType<typeof ProjectOptionalDto.Descriptions>>
      | null
      | undefined
      | InstanceType<typeof ProjectOptionalDto.Descriptions>[]
      | null
      | undefined,
  ) {
    // For nullable array, we allow explicit undefined or null values
    if (value === null || value === undefined) {
      this.#descriptions = value === null ? null : undefined;
      return;
    }
    // When the passed value is already an array, we check if we need to
    // cast the inner items into class instance.
    if (Array.isArray(value)) {
      if (
        value.length > 0 &&
        value[0] instanceof ProjectOptionalDto.Descriptions
      ) {
        this.#descriptions = MArray.of(value);
      } else {
        this.#descriptions = MArray.of(
          value.map((item) => new ProjectOptionalDto.Descriptions(item)),
        );
      }
      return;
    }
    // If the instance is already an MArray, we assume it's all good.
    if (value instanceof MArray) {
      this.#descriptions = value;
      return;
    }
    // If the value is not array, and is not a MArray, we need to be consider,
    // it might be eligible to be casted into MArray.
    const { ok, value: mcastValue } = MArray.cast<unknown>(value);
    if (ok) {
      this.#descriptions = mcastValue as any;
      return;
    }
    console.warn(
      "Cannot assing value to descriptions, because it needs MArray instance or an Array.",
    );
  }
  setDescriptions(
    value:
      | MArray<InstanceType<typeof ProjectOptionalDto.Descriptions>>
      | null
      | undefined
      | InstanceType<typeof ProjectOptionalDto.Descriptions>[]
      | null
      | undefined,
  ) {
    this.descriptions = value;
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
  #role?: TString | null | undefined = undefined;
  /**
   *
   * @returns {TString}
   **/
  get role() {
    return this.#role;
  }
  /**
   *
   * @type {TString}
   **/
  set role(value: TString | null | undefined) {
    // For a nullable complex field, an explicit undefined/null is a
    // deliberate value and has to pass through untouched - same as every
    // other nullable field's setter (array?, one?, object?, ...) above.
    // Anything else always becomes a real instance, exactly like a
    // non-nullable "complex" field does.
    if (value === null || value === undefined) {
      this.#role = value === null ? null : undefined;
      return;
    }
    if (value instanceof TString) {
      this.#role = value;
    } else {
      this.#role = new TString(value);
    }
  }
  setRole(value: TString | null | undefined) {
    this.role = value;
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
   * @type {XDate}
   **/
  #startDate?: XDate | null | undefined = undefined;
  /**
   *
   * @returns {XDate}
   **/
  get startDate() {
    return this.#startDate;
  }
  /**
   *
   * @type {XDate}
   **/
  set startDate(value: XDate | null | undefined) {
    // For a nullable complex field, an explicit undefined/null is a
    // deliberate value and has to pass through untouched - same as every
    // other nullable field's setter (array?, one?, object?, ...) above.
    // Anything else always becomes a real instance, exactly like a
    // non-nullable "complex" field does.
    if (value === null || value === undefined) {
      this.#startDate = value === null ? null : undefined;
      return;
    }
    if (value instanceof XDate) {
      this.#startDate = value;
    } else {
      this.#startDate = new XDate(value);
    }
  }
  setStartDate(value: XDate | null | undefined) {
    this.startDate = value;
    return this;
  }
  /**
   *
   * @type {XDate}
   **/
  #endDate?: XDate | null | undefined = undefined;
  /**
   *
   * @returns {XDate}
   **/
  get endDate() {
    return this.#endDate;
  }
  /**
   *
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
   * @type {string}
   **/
  #url?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get url() {
    return this.#url;
  }
  /**
   *
   * @type {string}
   **/
  set url(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#url = correctType ? value : String(value);
  }
  setUrl(value: string | null | undefined) {
    this.url = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #repoUrl?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get repoUrl() {
    return this.#repoUrl;
  }
  /**
   *
   * @type {string}
   **/
  set repoUrl(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#repoUrl = correctType ? value : String(value);
  }
  setRepoUrl(value: string | null | undefined) {
    this.repoUrl = value;
    return this;
  }
  /**
   * The base class definition for descriptions
   **/
  static Descriptions = class Descriptions {
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
     * @type {TargetPositionDto}
     **/
    #target?: MOne<TargetPositionDto> | null | undefined = undefined;
    /**
     *
     * @returns {TargetPositionDto}
     **/
    get target() {
      return this.#target;
    }
    /**
     *
     * @type {TargetPositionDto}
     **/
    set target(
      value:
        | MOne<TargetPositionDto>
        | null
        | undefined
        | InstanceType<typeof TargetPositionDto>
        | null
        | undefined,
    ) {
      // For a nullable relation, a literal null is a deliberate "clear"
      // signal and has to stay null - not fall through to the else branch
      // below and become MOne.of(new TargetPositionDto(null)) (the
      // constructor tolerates a null/undefined argument by returning an
      // empty-but-non-null instance), which serializes as an empty object
      // instead of null. The backend tells "explicitly cleared" apart from
      // "field left untouched" (an absent key) only by seeing a real null
      // on the wire, the same way every other nullable field here (array?,
      // collection?) already short-circuits on null/undefined above.
      if (value === null || value === undefined) {
        this.#target = value === null ? null : undefined;
        return;
      }
      // For objects, the sub type needs to always be instance of the sub class.
      if (value instanceof MOne) {
        this.#target = value;
      } else if (value instanceof TargetPositionDto) {
        this.#target = MOne.of(value);
      } else {
        this.#target = MOne.of(new TargetPositionDto(value));
      }
    }
    setTarget(
      value:
        | MOne<TargetPositionDto>
        | null
        | undefined
        | InstanceType<typeof TargetPositionDto>
        | null
        | undefined,
    ) {
      this.target = value;
      return this;
    }
    /**
     *
     * @type {TString}
     **/
    #content!: TString;
    /**
     *
     * @returns {TString}
     **/
    get content() {
      return this.#content;
    }
    /**
     *
     * @type {TString}
     **/
    set content(value: TString) {
      if (value instanceof TString) {
        this.#content = value;
      } else {
        this.#content = new TString(value);
      }
    }
    setContent(value: TString) {
      this.content = value;
      return this;
    }
    /**
     *
     * @type {SkillDto[]}
     **/
    #skills?: MCollection<SkillDto> | null | undefined = undefined;
    /**
     *
     * @returns {SkillDto[]}
     **/
    get skills() {
      return this.#skills;
    }
    /**
     *
     * @type {SkillDto[]}
     **/
    set skills(
      value:
        | MCollection<SkillDto>
        | InstanceType<typeof SkillDto>[]
        | null
        | undefined,
    ) {
      // For nullable collection, we allow explicit undefined or null values
      if (value === null || value === undefined) {
        this.#skills = value === null ? null : undefined;
        return;
      }
      // When the passed value is already an array, we check if we need to
      // cast the inner items into class instance.
      if (Array.isArray(value)) {
        if (value.length > 0 && value[0] instanceof SkillDto) {
          this.#skills = MCollection.of(value);
        } else {
          this.#skills = MCollection.of(
            value.map((item) => new SkillDto(item)),
          );
        }
        return;
      }
      // If the instance is already an MCollection, we assume it's all good.
      if (value instanceof MCollection) {
        this.#skills = value;
        return;
      }
      // If the value is not array, and is not a MCollection, we need to be consider,
      // it might be eligible to be casted into MCollection.
      const { ok, value: mcastValue } = MCollection.cast<unknown>(value);
      if (ok) {
        this.#skills = mcastValue as any;
        return;
      }
      console.warn(
        "Cannot assing value to skills, because it needs MCollection instance or an Array.",
      );
    }
    setSkills(
      value:
        | MCollection<SkillDto>
        | InstanceType<typeof SkillDto>[]
        | null
        | undefined,
    ) {
      this.skills = value;
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
      const d = data as Partial<Descriptions>;
      if (d.uniqueId !== undefined) {
        this.uniqueId = d.uniqueId;
      }
      if (d.target !== undefined) {
        this.target = d.target;
      }
      if (d.content !== undefined) {
        this.content = d.content;
      }
      if (d.skills !== undefined) {
        this.skills = d.skills;
      }
    }
    /**
     *	Special toJSON override, since the field are private,
     *	Json stringify won't see them unless we mention it explicitly.
     **/
    toJSON() {
      return {
        uniqueId: this.#uniqueId,
        target: this.#target,
        content: this.#content,
        skills: this.#skills,
      };
    }
    toString() {
      return JSON.stringify(this);
    }
    static get Fields() {
      return {
        uniqueId: "uniqueId",
        target: "target",
        content: "content",
        skills$: "skills",
        get skills() {
          return withPrefix("descriptions.skills", SkillDto.Fields);
        },
      };
    }
    /**
     * Creates an instance of ProjectOptionalDto.Descriptions, and possibleDtoObject
     * needs to satisfy the type requirement fully, otherwise typescript compile would
     * be complaining.
     **/
    static from(possibleDtoObject: ProjectOptionalDtoType.DescriptionsType) {
      return new ProjectOptionalDto.Descriptions(possibleDtoObject);
    }
    /**
     * Creates an instance of ProjectOptionalDto.Descriptions, and partialDtoObject
     * needs to satisfy the type, but partially, and rest of the content would
     * be constructed according to data types and nullability.
     **/
    static with(
      partialDtoObject: PartialDeep<ProjectOptionalDtoType.DescriptionsType>,
    ) {
      return new ProjectOptionalDto.Descriptions(partialDtoObject);
    }
    copyWith(
      partial: PartialDeep<ProjectOptionalDtoType.DescriptionsType>,
    ): InstanceType<typeof ProjectOptionalDto.Descriptions> {
      return new ProjectOptionalDto.Descriptions({
        ...this.toJSON(),
        ...partial,
      });
    }
    clone(): InstanceType<typeof ProjectOptionalDto.Descriptions> {
      return new ProjectOptionalDto.Descriptions(this.toJSON());
    }
  };
  static JsonSchema = {
    type: "object",
    title: "$title",
    description: "$description",
    properties: {
      uniqueId: {
        type: "string",
        title: "unique_id_title",
      },
      experience: {
        title: "experience_title",
        description: "experience_description",
      },
      descriptions: {
        type: "array",
        title: "descriptions_title",
        description: "descriptions_description",
        items: {
          type: "object",
          properties: {
            uniqueId: {
              type: "string",
              title: "descriptions_items_properties_unique_id_title",
            },
            target: {
              title: "descriptions_items_properties_target_title",
            },
            content: {
              title: "descriptions_items_properties_content_title",
            },
            skills: {
              type: "array",
              title: "descriptions_items_properties_skills_title",
              items: {},
            },
          },
          required: ["content"],
        },
      },
      name: {
        type: "string",
        title: "name_title",
      },
      role: {
        title: "role_title",
      },
      summary: {
        title: "summary_title",
      },
      startDate: {
        title: "start_date_title",
      },
      endDate: {
        title: "end_date_title",
      },
      url: {
        type: "string",
        title: "url_title",
      },
      repoUrl: {
        type: "string",
        title: "repo_url_title",
      },
    },
  };
  static DefaultTranslations = {
    $title: "ProjectOptionalDto",
    $description:
      "Every field of the \"project\" entity, but optional - used both as Update's partial input and as Browse's response item shape.",
    unique_id_title: "Unique Id",
    experience_title: "Experience",
    experience_description:
      "The work experience that this project is done based on that.",
    descriptions_items_properties_unique_id_title: "Unique Id",
    descriptions_items_properties_target_title: "Target",
    descriptions_items_properties_content_title: "Content",
    descriptions_items_properties_skills_title: "Skills",
    descriptions_title: "Descriptions",
    descriptions_description:
      "The project description, based on the target profile. So you can emphesize more on backend or front-end part of the project.",
    name_title: "Name",
    role_title: "Role",
    summary_title: "Summary",
    start_date_title: "Start Date",
    end_date_title: "End Date",
    url_title: "Url",
    repo_url_title: "Repo Url",
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
    const d = data as Partial<ProjectOptionalDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.experience !== undefined) {
      this.experience = d.experience;
    }
    if (d.descriptions !== undefined) {
      this.descriptions = d.descriptions;
    }
    if (d.name !== undefined) {
      this.name = d.name;
    }
    if (d.role !== undefined) {
      this.role = d.role;
    }
    if (d.summary !== undefined) {
      this.summary = d.summary;
    }
    if (d.startDate !== undefined) {
      this.startDate = d.startDate;
    }
    if (d.endDate !== undefined) {
      this.endDate = d.endDate;
    }
    if (d.url !== undefined) {
      this.url = d.url;
    }
    if (d.repoUrl !== undefined) {
      this.repoUrl = d.repoUrl;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      uniqueId: this.#uniqueId,
      experience: this.#experience,
      descriptions: this.#descriptions,
      name: this.#name,
      role: this.#role,
      summary: this.#summary,
      startDate: this.#startDate,
      endDate: this.#endDate,
      url: this.#url,
      repoUrl: this.#repoUrl,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      experience: "experience",
      descriptions$: "descriptions",
      get descriptions() {
        return withPrefix(
          "descriptions[:i]",
          ProjectOptionalDto.Descriptions.Fields,
        );
      },
      name: "name",
      role: "role",
      summary: "summary",
      startDate: "startDate",
      endDate: "endDate",
      url: "url",
      repoUrl: "repoUrl",
    };
  }
  /**
   * Creates an instance of ProjectOptionalDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: ProjectOptionalDtoType) {
    return new ProjectOptionalDto(possibleDtoObject);
  }
  /**
   * Creates an instance of ProjectOptionalDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<ProjectOptionalDtoType>) {
    return new ProjectOptionalDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<ProjectOptionalDtoType>,
  ): InstanceType<typeof ProjectOptionalDto> {
    return new ProjectOptionalDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof ProjectOptionalDto> {
    return new ProjectOptionalDto(this.toJSON());
  }
}
export abstract class ProjectOptionalDtoFactory {
  abstract create(data: unknown): ProjectOptionalDto;
}
export type ProjectOptionalDtoTranslationKey =
  keyof typeof ProjectOptionalDto.DefaultTranslations;
export type ProjectOptionalDtoTranslations = Record<
  ProjectOptionalDtoTranslationKey,
  string
>;
/**
 * The base type definition for projectOptionalDto
 **/
export type ProjectOptionalDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   * The work experience that this project is done based on that.
   * @type {WorkExperienceDto}
   **/
  experience?: WorkExperienceDto;
  /**
   * The project description, based on the target profile. So you can emphesize more on backend or front-end part of the project.
   * @type {ProjectOptionalDtoType.DescriptionsType[]}
   **/
  descriptions?: ProjectOptionalDtoType.DescriptionsType[];
  /**
   *
   * @type {string}
   **/
  name?: string;
  /**
   *
   * @type {TString}
   **/
  role?: TString;
  /**
   *
   * @type {TString}
   **/
  summary?: TString;
  /**
   *
   * @type {XDate}
   **/
  startDate?: XDate;
  /**
   *
   * @type {XDate}
   **/
  endDate?: XDate;
  /**
   *
   * @type {string}
   **/
  url?: string;
  /**
   *
   * @type {string}
   **/
  repoUrl?: string;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ProjectOptionalDtoType {
  /**
   * The base type definition for descriptionsType
   **/
  export type DescriptionsType = {
    /**
     *
     * @type {string}
     **/
    uniqueId?: string;
    /**
     *
     * @type {TargetPositionDto}
     **/
    target?: TargetPositionDto;
    /**
     *
     * @type {TString}
     **/
    content: TString;
    /**
     *
     * @type {SkillDto[]}
     **/
    skills?: SkillDto[];
  };
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace DescriptionsType {}
}
