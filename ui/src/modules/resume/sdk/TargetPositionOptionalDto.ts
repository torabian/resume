import { TString } from "@fireback/complexes";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for targetPositionOptionalDto
 **/
export class TargetPositionOptionalDto {
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
  static JsonSchema = {
    type: "object",
    title: "$title",
    description: "$description",
    properties: {
      uniqueId: {
        type: "string",
        title: "unique_id_title",
      },
      name: {
        title: "name_title",
      },
    },
    required: ["name"],
  };
  static DefaultTranslations = {
    $title: "TargetPositionOptionalDto",
    $description:
      "Every field of the \"targetPosition\" entity, but optional - used both as Update's partial input and as Browse's response item shape.",
    unique_id_title: "Unique Id",
    name_title: "Name",
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
    const d = data as Partial<TargetPositionOptionalDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.name !== undefined) {
      this.name = d.name;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      uniqueId: this.#uniqueId,
      name: this.#name,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      name: "name",
    };
  }
  /**
   * Creates an instance of TargetPositionOptionalDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: TargetPositionOptionalDtoType) {
    return new TargetPositionOptionalDto(possibleDtoObject);
  }
  /**
   * Creates an instance of TargetPositionOptionalDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<TargetPositionOptionalDtoType>) {
    return new TargetPositionOptionalDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<TargetPositionOptionalDtoType>,
  ): InstanceType<typeof TargetPositionOptionalDto> {
    return new TargetPositionOptionalDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof TargetPositionOptionalDto> {
    return new TargetPositionOptionalDto(this.toJSON());
  }
}
export abstract class TargetPositionOptionalDtoFactory {
  abstract create(data: unknown): TargetPositionOptionalDto;
}
export type TargetPositionOptionalDtoTranslationKey =
  keyof typeof TargetPositionOptionalDto.DefaultTranslations;
export type TargetPositionOptionalDtoTranslations = Record<
  TargetPositionOptionalDtoTranslationKey,
  string
>;
/**
 * The base type definition for targetPositionOptionalDto
 **/
export type TargetPositionOptionalDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   *
   * @type {TString}
   **/
  name: TString;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TargetPositionOptionalDtoType {}
