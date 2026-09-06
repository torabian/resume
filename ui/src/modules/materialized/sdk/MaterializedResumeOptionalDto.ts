import { CertificationDto } from "./CertificationDto";
import { EducationDto } from "./EducationDto";
import { LanguageDto } from "./LanguageDto";
import { MCollection, MOne } from "@fireback/js-remote-ctx/common/operators";
import { ProjectDto } from "./ProjectDto";
import { ResumeDto } from "./ResumeDto";
import { SkillDto } from "./SkillDto";
import { WorkExperienceDto } from "./WorkExperienceDto";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
import { withPrefix } from "@fireback/js-remote-ctx/common/withPrefix";
/**
 * The base class definition for materializedResumeOptionalDto
 **/
export class MaterializedResumeOptionalDto {
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
   * Label for this variant, e.g. "Backend-focused - Acme Corp application".
   * @type {string}
   **/
  #title?: string | null | undefined = undefined;
  /**
   * Label for this variant, e.g. "Backend-focused - Acme Corp application".
   * @returns {string}
   **/
  get title() {
    return this.#title;
  }
  /**
   * Label for this variant, e.g. "Backend-focused - Acme Corp application".
   * @type {string}
   **/
  set title(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#title = correctType ? value : String(value);
  }
  setTitle(value: string | null | undefined) {
    this.title = value;
    return this;
  }
  /**
   * The role/company this variant was tailored for, if any.
   * @type {string}
   **/
  #targetRole?: string | null | undefined = undefined;
  /**
   * The role/company this variant was tailored for, if any.
   * @returns {string}
   **/
  get targetRole() {
    return this.#targetRole;
  }
  /**
   * The role/company this variant was tailored for, if any.
   * @type {string}
   **/
  set targetRole(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#targetRole = correctType ? value : String(value);
  }
  setTargetRole(value: string | null | undefined) {
    this.targetRole = value;
    return this;
  }
  /**
   * The base Resume this variant is assembled from.
   * @type {ResumeDto}
   **/
  #resume?: MOne<ResumeDto> | null | undefined = undefined;
  /**
   * The base Resume this variant is assembled from.
   * @returns {ResumeDto}
   **/
  get resume() {
    return this.#resume;
  }
  /**
   * The base Resume this variant is assembled from.
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
   * @type {WorkExperienceDto[]}
   **/
  #workExperiences?: MCollection<WorkExperienceDto> | null | undefined =
    undefined;
  /**
   *
   * @returns {WorkExperienceDto[]}
   **/
  get workExperiences() {
    return this.#workExperiences;
  }
  /**
   *
   * @type {WorkExperienceDto[]}
   **/
  set workExperiences(
    value:
      | MCollection<WorkExperienceDto>
      | InstanceType<typeof WorkExperienceDto>[]
      | null
      | undefined,
  ) {
    // For nullable collection, we allow explicit undefined or null values
    if (value === null || value === undefined) {
      this.#workExperiences = value === null ? null : undefined;
      return;
    }
    // When the passed value is already an array, we check if we need to
    // cast the inner items into class instance.
    if (Array.isArray(value)) {
      if (value.length > 0 && value[0] instanceof WorkExperienceDto) {
        this.#workExperiences = MCollection.of(value);
      } else {
        this.#workExperiences = MCollection.of(
          value.map((item) => new WorkExperienceDto(item)),
        );
      }
      return;
    }
    // If the instance is already an MCollection, we assume it's all good.
    if (value instanceof MCollection) {
      this.#workExperiences = value;
      return;
    }
    // If the value is not array, and is not a MCollection, we need to be consider,
    // it might be eligible to be casted into MCollection.
    const { ok, value: mcastValue } = MCollection.cast<unknown>(value);
    if (ok) {
      this.#workExperiences = mcastValue as any;
      return;
    }
    console.warn(
      "Cannot assing value to workExperiences, because it needs MCollection instance or an Array.",
    );
  }
  setWorkExperiences(
    value:
      | MCollection<WorkExperienceDto>
      | InstanceType<typeof WorkExperienceDto>[]
      | null
      | undefined,
  ) {
    this.workExperiences = value;
    return this;
  }
  /**
   *
   * @type {EducationDto[]}
   **/
  #educations?: MCollection<EducationDto> | null | undefined = undefined;
  /**
   *
   * @returns {EducationDto[]}
   **/
  get educations() {
    return this.#educations;
  }
  /**
   *
   * @type {EducationDto[]}
   **/
  set educations(
    value:
      | MCollection<EducationDto>
      | InstanceType<typeof EducationDto>[]
      | null
      | undefined,
  ) {
    // For nullable collection, we allow explicit undefined or null values
    if (value === null || value === undefined) {
      this.#educations = value === null ? null : undefined;
      return;
    }
    // When the passed value is already an array, we check if we need to
    // cast the inner items into class instance.
    if (Array.isArray(value)) {
      if (value.length > 0 && value[0] instanceof EducationDto) {
        this.#educations = MCollection.of(value);
      } else {
        this.#educations = MCollection.of(
          value.map((item) => new EducationDto(item)),
        );
      }
      return;
    }
    // If the instance is already an MCollection, we assume it's all good.
    if (value instanceof MCollection) {
      this.#educations = value;
      return;
    }
    // If the value is not array, and is not a MCollection, we need to be consider,
    // it might be eligible to be casted into MCollection.
    const { ok, value: mcastValue } = MCollection.cast<unknown>(value);
    if (ok) {
      this.#educations = mcastValue as any;
      return;
    }
    console.warn(
      "Cannot assing value to educations, because it needs MCollection instance or an Array.",
    );
  }
  setEducations(
    value:
      | MCollection<EducationDto>
      | InstanceType<typeof EducationDto>[]
      | null
      | undefined,
  ) {
    this.educations = value;
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
        this.#skills = MCollection.of(value.map((item) => new SkillDto(item)));
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
  /**
   *
   * @type {ProjectDto[]}
   **/
  #projects?: MCollection<ProjectDto> | null | undefined = undefined;
  /**
   *
   * @returns {ProjectDto[]}
   **/
  get projects() {
    return this.#projects;
  }
  /**
   *
   * @type {ProjectDto[]}
   **/
  set projects(
    value:
      | MCollection<ProjectDto>
      | InstanceType<typeof ProjectDto>[]
      | null
      | undefined,
  ) {
    // For nullable collection, we allow explicit undefined or null values
    if (value === null || value === undefined) {
      this.#projects = value === null ? null : undefined;
      return;
    }
    // When the passed value is already an array, we check if we need to
    // cast the inner items into class instance.
    if (Array.isArray(value)) {
      if (value.length > 0 && value[0] instanceof ProjectDto) {
        this.#projects = MCollection.of(value);
      } else {
        this.#projects = MCollection.of(
          value.map((item) => new ProjectDto(item)),
        );
      }
      return;
    }
    // If the instance is already an MCollection, we assume it's all good.
    if (value instanceof MCollection) {
      this.#projects = value;
      return;
    }
    // If the value is not array, and is not a MCollection, we need to be consider,
    // it might be eligible to be casted into MCollection.
    const { ok, value: mcastValue } = MCollection.cast<unknown>(value);
    if (ok) {
      this.#projects = mcastValue as any;
      return;
    }
    console.warn(
      "Cannot assing value to projects, because it needs MCollection instance or an Array.",
    );
  }
  setProjects(
    value:
      | MCollection<ProjectDto>
      | InstanceType<typeof ProjectDto>[]
      | null
      | undefined,
  ) {
    this.projects = value;
    return this;
  }
  /**
   *
   * @type {CertificationDto[]}
   **/
  #certifications?: MCollection<CertificationDto> | null | undefined =
    undefined;
  /**
   *
   * @returns {CertificationDto[]}
   **/
  get certifications() {
    return this.#certifications;
  }
  /**
   *
   * @type {CertificationDto[]}
   **/
  set certifications(
    value:
      | MCollection<CertificationDto>
      | InstanceType<typeof CertificationDto>[]
      | null
      | undefined,
  ) {
    // For nullable collection, we allow explicit undefined or null values
    if (value === null || value === undefined) {
      this.#certifications = value === null ? null : undefined;
      return;
    }
    // When the passed value is already an array, we check if we need to
    // cast the inner items into class instance.
    if (Array.isArray(value)) {
      if (value.length > 0 && value[0] instanceof CertificationDto) {
        this.#certifications = MCollection.of(value);
      } else {
        this.#certifications = MCollection.of(
          value.map((item) => new CertificationDto(item)),
        );
      }
      return;
    }
    // If the instance is already an MCollection, we assume it's all good.
    if (value instanceof MCollection) {
      this.#certifications = value;
      return;
    }
    // If the value is not array, and is not a MCollection, we need to be consider,
    // it might be eligible to be casted into MCollection.
    const { ok, value: mcastValue } = MCollection.cast<unknown>(value);
    if (ok) {
      this.#certifications = mcastValue as any;
      return;
    }
    console.warn(
      "Cannot assing value to certifications, because it needs MCollection instance or an Array.",
    );
  }
  setCertifications(
    value:
      | MCollection<CertificationDto>
      | InstanceType<typeof CertificationDto>[]
      | null
      | undefined,
  ) {
    this.certifications = value;
    return this;
  }
  /**
   *
   * @type {LanguageDto[]}
   **/
  #languages?: MCollection<LanguageDto> | null | undefined = undefined;
  /**
   *
   * @returns {LanguageDto[]}
   **/
  get languages() {
    return this.#languages;
  }
  /**
   *
   * @type {LanguageDto[]}
   **/
  set languages(
    value:
      | MCollection<LanguageDto>
      | InstanceType<typeof LanguageDto>[]
      | null
      | undefined,
  ) {
    // For nullable collection, we allow explicit undefined or null values
    if (value === null || value === undefined) {
      this.#languages = value === null ? null : undefined;
      return;
    }
    // When the passed value is already an array, we check if we need to
    // cast the inner items into class instance.
    if (Array.isArray(value)) {
      if (value.length > 0 && value[0] instanceof LanguageDto) {
        this.#languages = MCollection.of(value);
      } else {
        this.#languages = MCollection.of(
          value.map((item) => new LanguageDto(item)),
        );
      }
      return;
    }
    // If the instance is already an MCollection, we assume it's all good.
    if (value instanceof MCollection) {
      this.#languages = value;
      return;
    }
    // If the value is not array, and is not a MCollection, we need to be consider,
    // it might be eligible to be casted into MCollection.
    const { ok, value: mcastValue } = MCollection.cast<unknown>(value);
    if (ok) {
      this.#languages = mcastValue as any;
      return;
    }
    console.warn(
      "Cannot assing value to languages, because it needs MCollection instance or an Array.",
    );
  }
  setLanguages(
    value:
      | MCollection<LanguageDto>
      | InstanceType<typeof LanguageDto>[]
      | null
      | undefined,
  ) {
    this.languages = value;
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
    const d = data as Partial<MaterializedResumeOptionalDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.title !== undefined) {
      this.title = d.title;
    }
    if (d.targetRole !== undefined) {
      this.targetRole = d.targetRole;
    }
    if (d.resume !== undefined) {
      this.resume = d.resume;
    }
    if (d.workExperiences !== undefined) {
      this.workExperiences = d.workExperiences;
    }
    if (d.educations !== undefined) {
      this.educations = d.educations;
    }
    if (d.skills !== undefined) {
      this.skills = d.skills;
    }
    if (d.projects !== undefined) {
      this.projects = d.projects;
    }
    if (d.certifications !== undefined) {
      this.certifications = d.certifications;
    }
    if (d.languages !== undefined) {
      this.languages = d.languages;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      uniqueId: this.#uniqueId,
      title: this.#title,
      targetRole: this.#targetRole,
      resume: this.#resume,
      workExperiences: this.#workExperiences,
      educations: this.#educations,
      skills: this.#skills,
      projects: this.#projects,
      certifications: this.#certifications,
      languages: this.#languages,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      title: "title",
      targetRole: "targetRole",
      resume: "resume",
      workExperiences$: "workExperiences",
      get workExperiences() {
        return withPrefix("workExperiences", WorkExperienceDto.Fields);
      },
      educations$: "educations",
      get educations() {
        return withPrefix("educations", EducationDto.Fields);
      },
      skills$: "skills",
      get skills() {
        return withPrefix("skills", SkillDto.Fields);
      },
      projects$: "projects",
      get projects() {
        return withPrefix("projects", ProjectDto.Fields);
      },
      certifications$: "certifications",
      get certifications() {
        return withPrefix("certifications", CertificationDto.Fields);
      },
      languages$: "languages",
      get languages() {
        return withPrefix("languages", LanguageDto.Fields);
      },
    };
  }
  /**
   * Creates an instance of MaterializedResumeOptionalDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: MaterializedResumeOptionalDtoType) {
    return new MaterializedResumeOptionalDto(possibleDtoObject);
  }
  /**
   * Creates an instance of MaterializedResumeOptionalDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(
    partialDtoObject: PartialDeep<MaterializedResumeOptionalDtoType>,
  ) {
    return new MaterializedResumeOptionalDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<MaterializedResumeOptionalDtoType>,
  ): InstanceType<typeof MaterializedResumeOptionalDto> {
    return new MaterializedResumeOptionalDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof MaterializedResumeOptionalDto> {
    return new MaterializedResumeOptionalDto(this.toJSON());
  }
}
export abstract class MaterializedResumeOptionalDtoFactory {
  abstract create(data: unknown): MaterializedResumeOptionalDto;
}
/**
 * The base type definition for materializedResumeOptionalDto
 **/
export type MaterializedResumeOptionalDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   * Label for this variant, e.g. "Backend-focused - Acme Corp application".
   * @type {string}
   **/
  title?: string;
  /**
   * The role/company this variant was tailored for, if any.
   * @type {string}
   **/
  targetRole?: string;
  /**
   * The base Resume this variant is assembled from.
   * @type {ResumeDto}
   **/
  resume?: ResumeDto;
  /**
   *
   * @type {WorkExperienceDto[]}
   **/
  workExperiences?: WorkExperienceDto[];
  /**
   *
   * @type {EducationDto[]}
   **/
  educations?: EducationDto[];
  /**
   *
   * @type {SkillDto[]}
   **/
  skills?: SkillDto[];
  /**
   *
   * @type {ProjectDto[]}
   **/
  projects?: ProjectDto[];
  /**
   *
   * @type {CertificationDto[]}
   **/
  certifications?: CertificationDto[];
  /**
   *
   * @type {LanguageDto[]}
   **/
  languages?: LanguageDto[];
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MaterializedResumeOptionalDtoType {}
