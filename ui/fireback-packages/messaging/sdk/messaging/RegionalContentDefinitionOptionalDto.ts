import { MOne } from "@fireback/js-remote-ctx/common/operators";
import { PlainTime } from "@fireback/complexes";
import { RegionalContentDto } from "./RegionalContentDto";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for regionalContentDefinitionOptionalDto
 **/
export class RegionalContentDefinitionOptionalDto {
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
   * The regionalContent (region+keyGroup) row this definition is a language variant of.
   * @type {RegionalContentDto}
   **/
  #regionalContent?: MOne<RegionalContentDto> | null | undefined = undefined;
  /**
   * The regionalContent (region+keyGroup) row this definition is a language variant of.
   * @returns {RegionalContentDto}
   **/
  get regionalContent() {
    return this.#regionalContent;
  }
  /**
   * The regionalContent (region+keyGroup) row this definition is a language variant of.
   * @type {RegionalContentDto}
   **/
  set regionalContent(
    value:
      | MOne<RegionalContentDto>
      | null
      | undefined
      | InstanceType<typeof RegionalContentDto>
      | null
      | undefined,
  ) {
    // For a nullable relation, a literal null is a deliberate "clear"
    // signal and has to stay null - not fall through to the else branch
    // below and become MOne.of(new RegionalContentDto(null)) (the
    // constructor tolerates a null/undefined argument by returning an
    // empty-but-non-null instance), which serializes as an empty object
    // instead of null. The backend tells "explicitly cleared" apart from
    // "field left untouched" (an absent key) only by seeing a real null
    // on the wire, the same way every other nullable field here (array?,
    // collection?) already short-circuits on null/undefined above.
    if (value === null || value === undefined) {
      this.#regionalContent = value === null ? null : undefined;
      return;
    }
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof MOne) {
      this.#regionalContent = value;
    } else if (value instanceof RegionalContentDto) {
      this.#regionalContent = MOne.of(value);
    } else {
      this.#regionalContent = MOne.of(new RegionalContentDto(value));
    }
  }
  setRegionalContent(
    value:
      | MOne<RegionalContentDto>
      | null
      | undefined
      | InstanceType<typeof RegionalContentDto>
      | null
      | undefined,
  ) {
    this.regionalContent = value;
    return this;
  }
  /**
   * Language code this definition is written in, for example en, fa, or pl.
   * @type {string}
   **/
  #locale?: string | null | undefined = undefined;
  /**
   * Language code this definition is written in, for example en, fa, or pl.
   * @returns {string}
   **/
  get locale() {
    return this.#locale;
  }
  /**
   * Language code this definition is written in, for example en, fa, or pl.
   * @type {string}
   **/
  set locale(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#locale = correctType ? value : String(value);
  }
  setLocale(value: string | null | undefined) {
    this.locale = value;
    return this;
  }
  /**
   * Optional subject line - only used for email-type content.
   * @type {string}
   **/
  #title?: string | null | undefined = undefined;
  /**
   * Optional subject line - only used for email-type content.
   * @returns {string}
   **/
  get title() {
    return this.#title;
  }
  /**
   * Optional subject line - only used for email-type content.
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
   * The template body sent to the user - supports Go template syntax to insert dynamic values, such as {{.Otp}} for the one-time password.
   * @type {string}
   **/
  #content?: string | null | undefined = undefined;
  /**
   * The template body sent to the user - supports Go template syntax to insert dynamic values, such as {{.Otp}} for the one-time password.
   * @returns {string}
   **/
  get content() {
    return this.#content;
  }
  /**
   * The template body sent to the user - supports Go template syntax to insert dynamic values, such as {{.Otp}} for the one-time password.
   * @type {string}
   **/
  set content(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#content = correctType ? value : String(value);
  }
  setContent(value: string | null | undefined) {
    this.content = value;
    return this;
  }
  /**
   * The unique-id of the workspace which content belongs to.
   * @type {string}
   **/
  #workspaceId?: string | null | undefined = undefined;
  /**
   * The unique-id of the workspace which content belongs to.
   * @returns {string}
   **/
  get workspaceId() {
    return this.#workspaceId;
  }
  /**
   * The unique-id of the workspace which content belongs to.
   * @type {string}
   **/
  set workspaceId(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#workspaceId = correctType ? value : String(value);
  }
  setWorkspaceId(value: string | null | undefined) {
    this.workspaceId = value;
    return this;
  }
  /**
   * The unique-id of the user which created/owns the record.
   * @type {string}
   **/
  #userId?: string | null | undefined = undefined;
  /**
   * The unique-id of the user which created/owns the record.
   * @returns {string}
   **/
  get userId() {
    return this.#userId;
  }
  /**
   * The unique-id of the user which created/owns the record.
   * @type {string}
   **/
  set userId(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#userId = correctType ? value : String(value);
  }
  setUserId(value: string | null | undefined) {
    this.userId = value;
    return this;
  }
  /**
   *
   * @type {PlainTime}
   **/
  #createdAt!: PlainTime;
  /**
   *
   * @returns {PlainTime}
   **/
  get createdAt() {
    return this.#createdAt;
  }
  /**
   *
   * @type {PlainTime}
   **/
  set createdAt(value: PlainTime) {
    if (value instanceof PlainTime) {
      this.#createdAt = value;
    } else {
      this.#createdAt = new PlainTime(value);
    }
  }
  setCreatedAt(value: PlainTime) {
    this.createdAt = value;
    return this;
  }
  /**
   *
   * @type {PlainTime}
   **/
  #updatedAt!: PlainTime;
  /**
   *
   * @returns {PlainTime}
   **/
  get updatedAt() {
    return this.#updatedAt;
  }
  /**
   *
   * @type {PlainTime}
   **/
  set updatedAt(value: PlainTime) {
    if (value instanceof PlainTime) {
      this.#updatedAt = value;
    } else {
      this.#updatedAt = new PlainTime(value);
    }
  }
  setUpdatedAt(value: PlainTime) {
    this.updatedAt = value;
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
    const d = data as Partial<RegionalContentDefinitionOptionalDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.regionalContent !== undefined) {
      this.regionalContent = d.regionalContent;
    }
    if (d.locale !== undefined) {
      this.locale = d.locale;
    }
    if (d.title !== undefined) {
      this.title = d.title;
    }
    if (d.content !== undefined) {
      this.content = d.content;
    }
    if (d.workspaceId !== undefined) {
      this.workspaceId = d.workspaceId;
    }
    if (d.userId !== undefined) {
      this.userId = d.userId;
    }
    if (d.createdAt !== undefined) {
      this.createdAt = d.createdAt;
    }
    if (d.updatedAt !== undefined) {
      this.updatedAt = d.updatedAt;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      uniqueId: this.#uniqueId,
      regionalContent: this.#regionalContent,
      locale: this.#locale,
      title: this.#title,
      content: this.#content,
      workspaceId: this.#workspaceId,
      userId: this.#userId,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      regionalContent: "regionalContent",
      locale: "locale",
      title: "title",
      content: "content",
      workspaceId: "workspaceId",
      userId: "userId",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    };
  }
  /**
   * Creates an instance of RegionalContentDefinitionOptionalDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: RegionalContentDefinitionOptionalDtoType) {
    return new RegionalContentDefinitionOptionalDto(possibleDtoObject);
  }
  /**
   * Creates an instance of RegionalContentDefinitionOptionalDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(
    partialDtoObject: PartialDeep<RegionalContentDefinitionOptionalDtoType>,
  ) {
    return new RegionalContentDefinitionOptionalDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<RegionalContentDefinitionOptionalDtoType>,
  ): InstanceType<typeof RegionalContentDefinitionOptionalDto> {
    return new RegionalContentDefinitionOptionalDto({
      ...this.toJSON(),
      ...partial,
    });
  }
  clone(): InstanceType<typeof RegionalContentDefinitionOptionalDto> {
    return new RegionalContentDefinitionOptionalDto(this.toJSON());
  }
}
export abstract class RegionalContentDefinitionOptionalDtoFactory {
  abstract create(data: unknown): RegionalContentDefinitionOptionalDto;
}
/**
 * The base type definition for regionalContentDefinitionOptionalDto
 **/
export type RegionalContentDefinitionOptionalDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   * The regionalContent (region+keyGroup) row this definition is a language variant of.
   * @type {RegionalContentDto}
   **/
  regionalContent?: RegionalContentDto;
  /**
   * Language code this definition is written in, for example en, fa, or pl.
   * @type {string}
   **/
  locale?: string;
  /**
   * Optional subject line - only used for email-type content.
   * @type {string}
   **/
  title?: string;
  /**
   * The template body sent to the user - supports Go template syntax to insert dynamic values, such as {{.Otp}} for the one-time password.
   * @type {string}
   **/
  content?: string;
  /**
   * The unique-id of the workspace which content belongs to.
   * @type {string}
   **/
  workspaceId?: string;
  /**
   * The unique-id of the user which created/owns the record.
   * @type {string}
   **/
  userId?: string;
  /**
   *
   * @type {PlainTime}
   **/
  createdAt: PlainTime;
  /**
   *
   * @type {PlainTime}
   **/
  updatedAt: PlainTime;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RegionalContentDefinitionOptionalDtoType {}
