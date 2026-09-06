import { MJson, TString } from "@fireback/complexes";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for resumeOptionalDto
 **/
export class ResumeOptionalDto {
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
  #fullName?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get fullName() {
    return this.#fullName;
  }
  /**
   *
   * @type {string}
   **/
  set fullName(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#fullName = correctType ? value : String(value);
  }
  setFullName(value: string | null | undefined) {
    this.fullName = value;
    return this;
  }
  /**
   * Short title under the name, e.g. "Senior Backend Engineer"
   * @type {TString}
   **/
  #headline?: TString | null | undefined = undefined;
  /**
   * Short title under the name, e.g. "Senior Backend Engineer"
   * @returns {TString}
   **/
  get headline() {
    return this.#headline;
  }
  /**
   * Short title under the name, e.g. "Senior Backend Engineer"
   * @type {TString}
   **/
  set headline(value: TString | null | undefined) {
    // For a nullable complex field, an explicit undefined/null is a
    // deliberate value and has to pass through untouched - same as every
    // other nullable field's setter (array?, one?, object?, ...) above.
    // Anything else always becomes a real instance, exactly like a
    // non-nullable "complex" field does.
    if (value === null || value === undefined) {
      this.#headline = value === null ? null : undefined;
      return;
    }
    if (value instanceof TString) {
      this.#headline = value;
    } else {
      this.#headline = new TString(value);
    }
  }
  setHeadline(value: TString | null | undefined) {
    this.headline = value;
    return this;
  }
  /**
   * Longer professional summary / objective paragraph.
   * @type {TString}
   **/
  #summary?: TString | null | undefined = undefined;
  /**
   * Longer professional summary / objective paragraph.
   * @returns {TString}
   **/
  get summary() {
    return this.#summary;
  }
  /**
   * Longer professional summary / objective paragraph.
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
  #email?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get email() {
    return this.#email;
  }
  /**
   *
   * @type {string}
   **/
  set email(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#email = correctType ? value : String(value);
  }
  setEmail(value: string | null | undefined) {
    this.email = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #phone?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get phone() {
    return this.#phone;
  }
  /**
   *
   * @type {string}
   **/
  set phone(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#phone = correctType ? value : String(value);
  }
  setPhone(value: string | null | undefined) {
    this.phone = value;
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
  #linkedin?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get linkedin() {
    return this.#linkedin;
  }
  /**
   *
   * @type {string}
   **/
  set linkedin(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#linkedin = correctType ? value : String(value);
  }
  setLinkedin(value: string | null | undefined) {
    this.linkedin = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #github?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get github() {
    return this.#github;
  }
  /**
   *
   * @type {string}
   **/
  set github(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#github = correctType ? value : String(value);
  }
  setGithub(value: string | null | undefined) {
    this.github = value;
    return this;
  }
  /**
   *
   * @type {string}
   **/
  #photoUrl?: string | null | undefined = undefined;
  /**
   *
   * @returns {string}
   **/
  get photoUrl() {
    return this.#photoUrl;
  }
  /**
   *
   * @type {string}
   **/
  set photoUrl(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#photoUrl = correctType ? value : String(value);
  }
  setPhotoUrl(value: string | null | undefined) {
    this.photoUrl = value;
    return this;
  }
  /**
   * Language the resume content itself is written in, e.g. "en".
   * @type {string}
   **/
  #language?: string | null | undefined = undefined;
  /**
   * Language the resume content itself is written in, e.g. "en".
   * @returns {string}
   **/
  get language() {
    return this.#language;
  }
  /**
   * Language the resume content itself is written in, e.g. "en".
   * @type {string}
   **/
  set language(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#language = correctType ? value : String(value);
  }
  setLanguage(value: string | null | undefined) {
    this.language = value;
    return this;
  }
  /**
   * Marks the default resume when a user keeps several variants.
   * @type {boolean}
   **/
  #isPrimary?: boolean | null | undefined = undefined;
  /**
   * Marks the default resume when a user keeps several variants.
   * @returns {boolean}
   **/
  get isPrimary() {
    return this.#isPrimary;
  }
  /**
   * Marks the default resume when a user keeps several variants.
   * @type {boolean}
   **/
  set isPrimary(value: boolean | null | undefined) {
    const correctType =
      value === true ||
      value === false ||
      value === undefined ||
      value === null;
    this.#isPrimary = correctType ? value : Boolean(value);
  }
  setIsPrimary(value: boolean | null | undefined) {
    this.isPrimary = value;
    return this;
  }
  /**
   * Skills/projects picked for this resume via the Resume Creator screen (ui/src/modules/resume/ResumeCreator.tsx) - a JSON array of {kind, uniqueId, label} objects, in the order chosen there. Not modeled as real one/collection relations to Skill/Project (those entities dropped their own `resume: one` link - see this file's own top-of-file note on why): this is a lightweight snapshot the picker UI reads/writes wholesale, not a queryable relation.
   * @type {MJson}
   **/
  #content?: MJson | null | undefined = undefined;
  /**
   * Skills/projects picked for this resume via the Resume Creator screen (ui/src/modules/resume/ResumeCreator.tsx) - a JSON array of {kind, uniqueId, label} objects, in the order chosen there. Not modeled as real one/collection relations to Skill/Project (those entities dropped their own `resume: one` link - see this file's own top-of-file note on why): this is a lightweight snapshot the picker UI reads/writes wholesale, not a queryable relation.
   * @returns {MJson}
   **/
  get content() {
    return this.#content;
  }
  /**
   * Skills/projects picked for this resume via the Resume Creator screen (ui/src/modules/resume/ResumeCreator.tsx) - a JSON array of {kind, uniqueId, label} objects, in the order chosen there. Not modeled as real one/collection relations to Skill/Project (those entities dropped their own `resume: one` link - see this file's own top-of-file note on why): this is a lightweight snapshot the picker UI reads/writes wholesale, not a queryable relation.
   * @type {MJson}
   **/
  set content(value: MJson | null | undefined) {
    // For a nullable complex field, an explicit undefined/null is a
    // deliberate value and has to pass through untouched - same as every
    // other nullable field's setter (array?, one?, object?, ...) above.
    // Anything else always becomes a real instance, exactly like a
    // non-nullable "complex" field does.
    if (value === null || value === undefined) {
      this.#content = value === null ? null : undefined;
      return;
    }
    if (value instanceof MJson) {
      this.#content = value;
    } else {
      this.#content = new MJson(value);
    }
  }
  setContent(value: MJson | null | undefined) {
    this.content = value;
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
      fullName: {
        type: "string",
        title: "full_name_title",
      },
      headline: {
        title: "headline_title",
        description: "headline_description",
      },
      summary: {
        title: "summary_title",
        description: "summary_description",
      },
      email: {
        type: "string",
        title: "email_title",
      },
      phone: {
        type: "string",
        title: "phone_title",
      },
      location: {
        title: "location_title",
      },
      website: {
        type: "string",
        title: "website_title",
      },
      linkedin: {
        type: "string",
        title: "linkedin_title",
      },
      github: {
        type: "string",
        title: "github_title",
      },
      photoUrl: {
        type: "string",
        title: "photo_url_title",
      },
      language: {
        type: "string",
        title: "language_title",
        description: "language_description",
      },
      isPrimary: {
        type: "boolean",
        title: "is_primary_title",
        description: "is_primary_description",
      },
      content: {
        title: "content_title",
        description: "content_description",
      },
    },
  };
  static DefaultTranslations = {
    $title: "ResumeOptionalDto",
    $description:
      "Every field of the \"resume\" entity, but optional - used both as Update's partial input and as Browse's response item shape.",
    unique_id_title: "Unique Id",
    full_name_title: "Full Name",
    headline_title: "Headline",
    headline_description:
      'Short title under the name, e.g. "Senior Backend Engineer"',
    summary_title: "Summary",
    summary_description: "Longer professional summary / objective paragraph.",
    email_title: "Email",
    phone_title: "Phone",
    location_title: "Location",
    website_title: "Website",
    linkedin_title: "Linkedin",
    github_title: "Github",
    photo_url_title: "Photo Url",
    language_title: "Language",
    language_description:
      'Language the resume content itself is written in, e.g. "en".',
    is_primary_title: "Is Primary",
    is_primary_description:
      "Marks the default resume when a user keeps several variants.",
    content_title: "Content",
    content_description:
      "Skills/projects picked for this resume via the Resume Creator screen (ui/src/modules/resume/ResumeCreator.tsx) - a JSON array of {kind, uniqueId, label} objects, in the order chosen there. Not modeled as real one/collection relations to Skill/Project (those entities dropped their own `resume: one` link - see this file's own top-of-file note on why): this is a lightweight snapshot the picker UI reads/writes wholesale, not a queryable relation.",
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
    const d = data as Partial<ResumeOptionalDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.fullName !== undefined) {
      this.fullName = d.fullName;
    }
    if (d.headline !== undefined) {
      this.headline = d.headline;
    }
    if (d.summary !== undefined) {
      this.summary = d.summary;
    }
    if (d.email !== undefined) {
      this.email = d.email;
    }
    if (d.phone !== undefined) {
      this.phone = d.phone;
    }
    if (d.location !== undefined) {
      this.location = d.location;
    }
    if (d.website !== undefined) {
      this.website = d.website;
    }
    if (d.linkedin !== undefined) {
      this.linkedin = d.linkedin;
    }
    if (d.github !== undefined) {
      this.github = d.github;
    }
    if (d.photoUrl !== undefined) {
      this.photoUrl = d.photoUrl;
    }
    if (d.language !== undefined) {
      this.language = d.language;
    }
    if (d.isPrimary !== undefined) {
      this.isPrimary = d.isPrimary;
    }
    if (d.content !== undefined) {
      this.content = d.content;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      uniqueId: this.#uniqueId,
      fullName: this.#fullName,
      headline: this.#headline,
      summary: this.#summary,
      email: this.#email,
      phone: this.#phone,
      location: this.#location,
      website: this.#website,
      linkedin: this.#linkedin,
      github: this.#github,
      photoUrl: this.#photoUrl,
      language: this.#language,
      isPrimary: this.#isPrimary,
      content: this.#content,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      fullName: "fullName",
      headline: "headline",
      summary: "summary",
      email: "email",
      phone: "phone",
      location: "location",
      website: "website",
      linkedin: "linkedin",
      github: "github",
      photoUrl: "photoUrl",
      language: "language",
      isPrimary: "isPrimary",
      content: "content",
    };
  }
  /**
   * Creates an instance of ResumeOptionalDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: ResumeOptionalDtoType) {
    return new ResumeOptionalDto(possibleDtoObject);
  }
  /**
   * Creates an instance of ResumeOptionalDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<ResumeOptionalDtoType>) {
    return new ResumeOptionalDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<ResumeOptionalDtoType>,
  ): InstanceType<typeof ResumeOptionalDto> {
    return new ResumeOptionalDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof ResumeOptionalDto> {
    return new ResumeOptionalDto(this.toJSON());
  }
}
export abstract class ResumeOptionalDtoFactory {
  abstract create(data: unknown): ResumeOptionalDto;
}
export type ResumeOptionalDtoTranslationKey =
  keyof typeof ResumeOptionalDto.DefaultTranslations;
export type ResumeOptionalDtoTranslations = Record<
  ResumeOptionalDtoTranslationKey,
  string
>;
/**
 * The base type definition for resumeOptionalDto
 **/
export type ResumeOptionalDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   *
   * @type {string}
   **/
  fullName?: string;
  /**
   * Short title under the name, e.g. "Senior Backend Engineer"
   * @type {TString}
   **/
  headline?: TString;
  /**
   * Longer professional summary / objective paragraph.
   * @type {TString}
   **/
  summary?: TString;
  /**
   *
   * @type {string}
   **/
  email?: string;
  /**
   *
   * @type {string}
   **/
  phone?: string;
  /**
   *
   * @type {TString}
   **/
  location?: TString;
  /**
   *
   * @type {string}
   **/
  website?: string;
  /**
   *
   * @type {string}
   **/
  linkedin?: string;
  /**
   *
   * @type {string}
   **/
  github?: string;
  /**
   *
   * @type {string}
   **/
  photoUrl?: string;
  /**
   * Language the resume content itself is written in, e.g. "en".
   * @type {string}
   **/
  language?: string;
  /**
   * Marks the default resume when a user keeps several variants.
   * @type {boolean}
   **/
  isPrimary?: boolean;
  /**
   * Skills/projects picked for this resume via the Resume Creator screen (ui/src/modules/resume/ResumeCreator.tsx) - a JSON array of {kind, uniqueId, label} objects, in the order chosen there. Not modeled as real one/collection relations to Skill/Project (those entities dropped their own `resume: one` link - see this file's own top-of-file note on why): this is a lightweight snapshot the picker UI reads/writes wholesale, not a queryable relation.
   * @type {MJson}
   **/
  content?: MJson;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ResumeOptionalDtoType {}
