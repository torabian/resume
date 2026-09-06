import { MJson, XDate } from "@fireback/complexes";
import { MOne } from "@fireback/js-remote-ctx/common/operators";
import { WalletGatewayDto } from "./WalletGatewayDto";
import { WalletPaymentAttemptDto } from "./WalletPaymentAttemptDto";
import { type PartialDeep } from "@fireback/js-remote-ctx/common/fetchx";
/**
 * The base class definition for walletEventDto
 **/
export class WalletEventDto {
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
   * The gateway this event came from.
   * @type {WalletGatewayDto}
   **/
  #gateway?: MOne<WalletGatewayDto> | null | undefined = undefined;
  /**
   * The gateway this event came from.
   * @returns {WalletGatewayDto}
   **/
  get gateway() {
    return this.#gateway;
  }
  /**
   * The gateway this event came from.
   * @type {WalletGatewayDto}
   **/
  set gateway(
    value:
      | MOne<WalletGatewayDto>
      | null
      | undefined
      | InstanceType<typeof WalletGatewayDto>
      | null
      | undefined,
  ) {
    // For a nullable relation, a literal null is a deliberate "clear"
    // signal and has to stay null - not fall through to the else branch
    // below and become MOne.of(new WalletGatewayDto(null)) (the
    // constructor tolerates a null/undefined argument by returning an
    // empty-but-non-null instance), which serializes as an empty object
    // instead of null. The backend tells "explicitly cleared" apart from
    // "field left untouched" (an absent key) only by seeing a real null
    // on the wire, the same way every other nullable field here (array?,
    // collection?) already short-circuits on null/undefined above.
    if (value === null || value === undefined) {
      this.#gateway = value === null ? null : undefined;
      return;
    }
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof MOne) {
      this.#gateway = value;
    } else if (value instanceof WalletGatewayDto) {
      this.#gateway = MOne.of(value);
    } else {
      this.#gateway = MOne.of(new WalletGatewayDto(value));
    }
  }
  setGateway(
    value:
      | MOne<WalletGatewayDto>
      | null
      | undefined
      | InstanceType<typeof WalletGatewayDto>
      | null
      | undefined,
  ) {
    this.gateway = value;
    return this;
  }
  /**
   * Gateway-specific event type string, e.g. "payment_intent.succeeded".
   * @type {string}
   **/
  #eventType: string = "";
  /**
   * Gateway-specific event type string, e.g. "payment_intent.succeeded".
   * @returns {string}
   **/
  get eventType() {
    return this.#eventType;
  }
  /**
   * Gateway-specific event type string, e.g. "payment_intent.succeeded".
   * @type {string}
   **/
  set eventType(value: string) {
    this.#eventType = String(value);
  }
  setEventType(value: string) {
    this.eventType = value;
    return this;
  }
  /**
   * The gateway's own id for this event, when it provides one - used to deduplicate webhook retries.
   * @type {string}
   **/
  #externalEventId?: string | null | undefined = undefined;
  /**
   * The gateway's own id for this event, when it provides one - used to deduplicate webhook retries.
   * @returns {string}
   **/
  get externalEventId() {
    return this.#externalEventId;
  }
  /**
   * The gateway's own id for this event, when it provides one - used to deduplicate webhook retries.
   * @type {string}
   **/
  set externalEventId(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#externalEventId = correctType ? value : String(value);
  }
  setExternalEventId(value: string | null | undefined) {
    this.externalEventId = value;
    return this;
  }
  /**
   * The full raw event payload as received from the gateway.
   * @type {MJson}
   **/
  #payload!: MJson;
  /**
   * The full raw event payload as received from the gateway.
   * @returns {MJson}
   **/
  get payload() {
    return this.#payload;
  }
  /**
   * The full raw event payload as received from the gateway.
   * @type {MJson}
   **/
  set payload(value: MJson) {
    if (value instanceof MJson) {
      this.#payload = value;
    } else {
      this.#payload = new MJson(value);
    }
  }
  setPayload(value: MJson) {
    this.payload = value;
    return this;
  }
  /**
   * Whether this event was successfully applied (e.g. wallet credited).
   * @type {boolean}
   **/
  #processed: boolean = false;
  /**
   * Whether this event was successfully applied (e.g. wallet credited).
   * @returns {boolean}
   **/
  get processed() {
    return this.#processed;
  }
  /**
   * Whether this event was successfully applied (e.g. wallet credited).
   * @type {boolean}
   **/
  set processed(value: boolean) {
    this.#processed = Boolean(value);
  }
  setProcessed(value: boolean) {
    this.processed = value;
    return this;
  }
  /**
   * Error message from the last failed processing attempt, if any.
   * @type {string}
   **/
  #processingError?: string | null | undefined = undefined;
  /**
   * Error message from the last failed processing attempt, if any.
   * @returns {string}
   **/
  get processingError() {
    return this.#processingError;
  }
  /**
   * Error message from the last failed processing attempt, if any.
   * @type {string}
   **/
  set processingError(value: string | null | undefined) {
    const correctType =
      typeof value === "string" || value === undefined || value === null;
    this.#processingError = correctType ? value : String(value);
  }
  setProcessingError(value: string | null | undefined) {
    this.processingError = value;
    return this;
  }
  /**
   * The payment attempt this event relates to, if identifiable.
   * @type {WalletPaymentAttemptDto}
   **/
  #paymentAttempt?: MOne<WalletPaymentAttemptDto> | null | undefined =
    undefined;
  /**
   * The payment attempt this event relates to, if identifiable.
   * @returns {WalletPaymentAttemptDto}
   **/
  get paymentAttempt() {
    return this.#paymentAttempt;
  }
  /**
   * The payment attempt this event relates to, if identifiable.
   * @type {WalletPaymentAttemptDto}
   **/
  set paymentAttempt(
    value:
      | MOne<WalletPaymentAttemptDto>
      | null
      | undefined
      | InstanceType<typeof WalletPaymentAttemptDto>
      | null
      | undefined,
  ) {
    // For a nullable relation, a literal null is a deliberate "clear"
    // signal and has to stay null - not fall through to the else branch
    // below and become MOne.of(new WalletPaymentAttemptDto(null)) (the
    // constructor tolerates a null/undefined argument by returning an
    // empty-but-non-null instance), which serializes as an empty object
    // instead of null. The backend tells "explicitly cleared" apart from
    // "field left untouched" (an absent key) only by seeing a real null
    // on the wire, the same way every other nullable field here (array?,
    // collection?) already short-circuits on null/undefined above.
    if (value === null || value === undefined) {
      this.#paymentAttempt = value === null ? null : undefined;
      return;
    }
    // For objects, the sub type needs to always be instance of the sub class.
    if (value instanceof MOne) {
      this.#paymentAttempt = value;
    } else if (value instanceof WalletPaymentAttemptDto) {
      this.#paymentAttempt = MOne.of(value);
    } else {
      this.#paymentAttempt = MOne.of(new WalletPaymentAttemptDto(value));
    }
  }
  setPaymentAttempt(
    value:
      | MOne<WalletPaymentAttemptDto>
      | null
      | undefined
      | InstanceType<typeof WalletPaymentAttemptDto>
      | null
      | undefined,
  ) {
    this.paymentAttempt = value;
    return this;
  }
  /**
   * When this event was received.
   * @type {XDate}
   **/
  #receivedAt!: XDate;
  /**
   * When this event was received.
   * @returns {XDate}
   **/
  get receivedAt() {
    return this.#receivedAt;
  }
  /**
   * When this event was received.
   * @type {XDate}
   **/
  set receivedAt(value: XDate) {
    if (value instanceof XDate) {
      this.#receivedAt = value;
    } else {
      this.#receivedAt = new XDate(value);
    }
  }
  setReceivedAt(value: XDate) {
    this.receivedAt = value;
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
    const d = data as Partial<WalletEventDto>;
    if (d.uniqueId !== undefined) {
      this.uniqueId = d.uniqueId;
    }
    if (d.gateway !== undefined) {
      this.gateway = d.gateway;
    }
    if (d.eventType !== undefined) {
      this.eventType = d.eventType;
    }
    if (d.externalEventId !== undefined) {
      this.externalEventId = d.externalEventId;
    }
    if (d.payload !== undefined) {
      this.payload = d.payload;
    }
    if (d.processed !== undefined) {
      this.processed = d.processed;
    }
    if (d.processingError !== undefined) {
      this.processingError = d.processingError;
    }
    if (d.paymentAttempt !== undefined) {
      this.paymentAttempt = d.paymentAttempt;
    }
    if (d.receivedAt !== undefined) {
      this.receivedAt = d.receivedAt;
    }
  }
  /**
   *	Special toJSON override, since the field are private,
   *	Json stringify won't see them unless we mention it explicitly.
   **/
  toJSON() {
    return {
      uniqueId: this.#uniqueId,
      gateway: this.#gateway,
      eventType: this.#eventType,
      externalEventId: this.#externalEventId,
      payload: this.#payload,
      processed: this.#processed,
      processingError: this.#processingError,
      paymentAttempt: this.#paymentAttempt,
      receivedAt: this.#receivedAt,
    };
  }
  toString() {
    return JSON.stringify(this);
  }
  static get Fields() {
    return {
      uniqueId: "uniqueId",
      gateway: "gateway",
      eventType: "eventType",
      externalEventId: "externalEventId",
      payload: "payload",
      processed: "processed",
      processingError: "processingError",
      paymentAttempt: "paymentAttempt",
      receivedAt: "receivedAt",
    };
  }
  /**
   * Creates an instance of WalletEventDto, and possibleDtoObject
   * needs to satisfy the type requirement fully, otherwise typescript compile would
   * be complaining.
   **/
  static from(possibleDtoObject: WalletEventDtoType) {
    return new WalletEventDto(possibleDtoObject);
  }
  /**
   * Creates an instance of WalletEventDto, and partialDtoObject
   * needs to satisfy the type, but partially, and rest of the content would
   * be constructed according to data types and nullability.
   **/
  static with(partialDtoObject: PartialDeep<WalletEventDtoType>) {
    return new WalletEventDto(partialDtoObject);
  }
  copyWith(
    partial: PartialDeep<WalletEventDtoType>,
  ): InstanceType<typeof WalletEventDto> {
    return new WalletEventDto({ ...this.toJSON(), ...partial });
  }
  clone(): InstanceType<typeof WalletEventDto> {
    return new WalletEventDto(this.toJSON());
  }
}
export abstract class WalletEventDtoFactory {
  abstract create(data: unknown): WalletEventDto;
}
/**
 * The base type definition for walletEventDto
 **/
export type WalletEventDtoType = {
  /**
   *
   * @type {string}
   **/
  uniqueId?: string;
  /**
   * The gateway this event came from.
   * @type {WalletGatewayDto}
   **/
  gateway?: WalletGatewayDto;
  /**
   * Gateway-specific event type string, e.g. "payment_intent.succeeded".
   * @type {string}
   **/
  eventType: string;
  /**
   * The gateway's own id for this event, when it provides one - used to deduplicate webhook retries.
   * @type {string}
   **/
  externalEventId?: string;
  /**
   * The full raw event payload as received from the gateway.
   * @type {MJson}
   **/
  payload: MJson;
  /**
   * Whether this event was successfully applied (e.g. wallet credited).
   * @type {boolean}
   **/
  processed: boolean;
  /**
   * Error message from the last failed processing attempt, if any.
   * @type {string}
   **/
  processingError?: string;
  /**
   * The payment attempt this event relates to, if identifiable.
   * @type {WalletPaymentAttemptDto}
   **/
  paymentAttempt?: WalletPaymentAttemptDto;
  /**
   * When this event was received.
   * @type {XDate}
   **/
  receivedAt: XDate;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace WalletEventDtoType {}
