import { MOne } from "@fireback/js-remote-ctx/common/operators";
import { ResumeDto } from "./ResumeDto";
import { TString } from "@fireback/complexes";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
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
  #isOngoing?: boolean | null | undefined = undefined;
  /**
   *
   * @returns {boolean}
   **/
  get isOngoing() {
    return this.#isOngoing;
  }
  /**
   *
   * @type {boolean}
   **/
  set isOngoing(value: boolean | null | undefined) {
    const correctType =
      value === true ||
      value === false ||
      value === undefined ||
      value === null;
    this.#isOngoing = correctType ? value : Boolean(value);
  }
  setIsOngoing(value: boolean | null | undefined) {
    this.isOngoing = value;
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
   *
   * @type {any}
   **/
  #technologies?: any | null | undefined = undefined;
  /**
   *
   * @returns {any}
   **/
  get technologies() {
    return this.#technologies;
  }
  /**
   *
   * @type {any}
   **/
  set technologies(value: any | null | undefined) {
    this.#technologies = value;
  }
  setTechnologies(value: any | null | undefined) {
    this.technologies = value;
    return this;
  }
  /**
   *
   * @type {any}
   **/
  #highlights?: any | null | undefined = undefined;
  /**
   *
   * @returns {any}
   **/
  get highlights() {
    return this.#highlights;
  }
  /**
   *
   * @type {any}
   **/
  set highlights(value: any | null | undefined) {
    this.#highlights = value;
  }
  setHighlights(value: any | null | undefined) {
    this.highlights = value;
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
      role: {
        title: "role_title",
      },
      summary: {
        title: "summary_title",
      },
      startDate: {
        type: "string",
        title: "start_date_title",
      },
      endDate: {
        type: "string",
        title: "end_date_title",
      },
      isOngoing: {
        type: "boolean",
        title: "is_ongoing_title",
      },
      url: {
        type: "string",
        title: "url_title",
      },
      repoUrl: {
        type: "string",
        title: "repo_url_title",
      },
      technologies: {
        type: "array",
        title: "technologies_title",
        items: {
          type: "string",
        },
      },
      highlights: {
        type: "array",
        title: "highlights_title",
        items: {
          type: "string",
        },
      },
    },
  };
  static DefaultTranslations = {
    $title: "ProjectOptionalDto",
    $description:
      "Every field of the \"project\" entity, but optional - used both as Update's partial input and as Browse's response item shape.",
    unique_id_title: "Unique Id",
    resume_title: "Resume",
    name_title: "Name",
    role_title: "Role",
    summary_title: "Summary",
    start_date_title: "Start Date",
    end_date_title: "End Date",
    is_ongoing_title: "Is Ongoing",
    url_title: "Url",
    repo_url_title: "Repo Url",
    technologies_title: "Technologies",
    highlights_title: "Highlights",
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
    if (d.resume !== undefined) {
      this.resume = d.resume;
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
    if (d.isOngoing !== undefined) {
      this.isOngoing = d.isOngoing;
    }
    if (d.url !== undefined) {
      this.url = d.url;
    }
    if (d.repoUrl !== undefined) {
      this.repoUrl = d.repoUrl;
    }
    if (d.technologies !== undefined) {
      this.technologies = d.technologies;
    }
    if (d.highlights !== undefined) {
      this.highlights = d.highlights;
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
      role: this.#role,
      summary: this.#summary,
      startDate: this.#startDate,
      endDate: this.#endDate,
      isOngoing: this.#isOngoing,
      url: this.#url,
      repoUrl: this.#repoUrl,
      technologies: this.#technologies,
      highlights: this.#highlights,
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
      role: "role",
      summary: "summary",
      startDate: "startDate",
      endDate: "endDate",
      isOngoing: "isOngoing",
      url: "url",
      repoUrl: "repoUrl",
      technologies: "technologies",
      highlights: "highlights",
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
   *
   * @type {ResumeDto}
   **/
  resume?: ResumeDto;
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
  isOngoing?: boolean;
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
  /**
   *
   * @type {any}
   **/
  technologies?: any;
  /**
   *
   * @type {any}
   **/
  highlights?: any;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ProjectOptionalDtoType {}
