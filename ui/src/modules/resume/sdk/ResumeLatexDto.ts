import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for resumeLatexDto
 **/
export class ResumeLatexDto {
  /**
   * The complete .tex document, ready to hand to a LaTeX compiler as-is.
   * @type {string}
   **/
  #source: string = "";
  /**
   * The complete .tex document, ready to hand to a LaTeX compiler as-is.
   * @returns {string}
   **/
  get source() {
    return this.#source;
  }
  /**
   * The complete .tex document, ready to hand to a LaTeX compiler as-is.
   * @type {string}
   **/
  set source(value: string) {
    this.#source = String(value);
  }
  setSource(value: string) {
    this.source = value;
    return this;
  }
  static JsonSchema = {
    type: "object",
    title: "$title",
    description: "$description",
    properties: {
      source: {
        type: "string",
        title: "source_title",
        description: "source_description",
      },
    },
    required: ["source"],
  };
  static DefaultTranslations = {
    $title: "ResumeLatexDto",
    $description:
      "Plain LaTeX (.tex) source generated for one resume - the profile fields (fullName/headline/summary/contact info) plus the skills and projects picked for it via the Resume Creator screen (see `resume.content` and ui/src/modules/resume/ResumeCreator.tsx). First pass only: raw source text, not a compiled PDF - see ResumeToLatexImplementation.go's own doc comment for what a later pass would still need (a real LaTeX toolchain, a proper template/theme, work experience/education/certifications/languages - none of which `content` references today).",
    source_title: "Source",
    source_description:
      "The complete .tex document, ready to hand to a LaTeX compiler as-is.",
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
    const d = data as Partial<ResumeLatexDto>;
    if (d.source !== undefined) {
      this.source = d.source;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      source: this.#source,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      source: "source",
    };
  }
  /**
   * Creates an instance of ResumeLatexDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: ResumeLatexDtoType) {
    return new ResumeLatexDto(possibleDtoObject);
  }
  /**
   * Creates an instance of ResumeLatexDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<ResumeLatexDtoType>) {
    return new ResumeLatexDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<ResumeLatexDtoType>,
  ): InstanceType<typeof ResumeLatexDto> {
    return new ResumeLatexDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof ResumeLatexDto> {
    return new ResumeLatexDto(this.toJSON());
  }
}
export abstract class ResumeLatexDtoFactory {
  abstract create(data: unknown): ResumeLatexDto;
}
export type ResumeLatexDtoTranslationKey =
  keyof typeof ResumeLatexDto.DefaultTranslations;
export type ResumeLatexDtoTranslations = Record<
  ResumeLatexDtoTranslationKey,
  string
>;
/**
 * The base type definition for resumeLatexDto
 **/
export type ResumeLatexDtoType = {
  /**
   * The complete .tex document, ready to hand to a LaTeX compiler as-is.
   * @type {string}
   **/
  source: string;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ResumeLatexDtoType {}
