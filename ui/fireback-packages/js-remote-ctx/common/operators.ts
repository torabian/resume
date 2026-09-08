export class MOne<T, S = unknown> {
  private operation: string | null = null;
  private selector: S | undefined;

  private content: T | undefined = undefined;

  isNull(): boolean {
    return this.content === null;
  }

  // Bug fix: this used to read `.content` and never touch `.selector` at
  // all - the exact opposite of what toJSON() below actually emits for a
  // "select" operation (`{__operation: "select", __selector}` - there is no
  // "content" key on that shape at all; a plain-content MOne serializes to
  // just its bare content with no __operation tag, so it never reaches this
  // branch in the first place). A round trip through JSON (a form field
  // reloading its own last onChange, say) always landed as an MOne with an
  // empty/undefined `content` and no `selector` either - isSelector() and
  // get() both came back useless.
  static cast<T = any, S = unknown>(
    value: unknown,
  ): { ok: boolean; value: MOne<T, S> | null } {
    if (
      typeof value === "object" &&
      value !== null &&
      (value as any).__operation === "select"
    ) {
      const res = new MOne<T, S>();
      res.operation = "select";
      res.selector = (value as any).__selector;

      return {
        ok: true,
        value: res,
      };
    }

    return {
      value: null,
      ok: false,
    };
  }

  isSelector(): boolean {
    return this.selector !== undefined && this.operation !== null;
  }

  get(): T {
    return this.content!;
  }

  /** The selector payload of a "select"-operation MOne (see static select()
   * below) - undefined for any other MOne (a plain-content one, or one
   * that's never been set at all). No public accessor existed for this
   * before - isSelector() could tell you *that* a selector was set, never
   * *what* it was, so a consumer (e.g. FormOne) had no way to resolve which
   * option a selector-form value actually points at. */
  getSelector(): S | undefined {
    return this.selector;
  }

  /** The raw operation string ("select", or null for a plain-content/unset
   * MOne) - same reasoning as getSelector() above, exposed for callers that
   * need to branch on it themselves rather than only via isSelector(). */
  getOperation(): string | null {
    return this.operation;
  }

  static of<T>(value: T) {
    const one = new MOne<T>();
    one.content = value;

    return one;
  }

  // <S> added alongside the pre-existing <T> (was T-only, defaulting S to
  // `unknown` regardless of the selector's actual type - getSelector()
  // above would have been untypeable for any caller that cared what S
  // actually was, e.g. FormOne.tsx resolving a typed uniqueId back out).
  static select<T = unknown, S = unknown>(selector: S) {
    const one = new MOne<T, S>();
    one.selector = selector;
    one.operation = "select";

    return one;
  }

  toJSON() {
    // When its explicit replace, it means that we need to pass a selector, so reader will
    // be able to replace it via internal mechanism
    if (this.operation === "select") {
      return {
        __operation: this.operation,
        __selector: this.selector,
      };
    }

    // Bug fix: this used to just `return this.content` - fine for a plain
    // value, but silently wrong whenever content is itself a class instance
    // with its own toJSON() (every generated *Dto - e.g. MOne.of(new
    // WorkExperienceDto(...)) for a `one?` relation field's loaded value).
    // JSON.stringify only ever substitutes a toJSON() return value *once*
    // per property it's serializing - it does not then check *that* return
    // value for its own toJSON too, the way a value reached through an
    // ordinary object/array property does. Proven directly:
    //
    //   class Inner { #x = 1; toJSON() { return {x: this.#x}; } }
    //   JSON.stringify({ toJSON() { return new Inner(); } })  // => "{}"
    //   JSON.stringify({ x: new Inner() })                    // => '{"x":{"x":1}}'
    //
    // Inner's own toJSON() never runs in the first case - the engine just
    // enumerates Inner's own enumerable properties directly, and since a
    // generated Dto's fields are all real `#private` (no other enumerable
    // own properties at all), that enumeration comes back empty: `{}`. This
    // is exactly why a fully-populated `one?` relation field (e.g.
    // ProjectDto.experience) serialized as an empty object even though
    // MOne.get() held a correctly-populated nested Dto the whole time -
    // confirmed live: dto.experience.get() returned the full
    // WorkExperienceDto, but JSON.stringify(dto.experience) still gave
    // "{}". Calling content's own toJSON() here ourselves - so what we hand
    // back is already a plain, JSON.stringify-safe value/object rather
    // than a class instance still waiting for its own toJSON pass - closes
    // that gap. (Arrays don't have this problem: MArray/MCollection return
    // their `items` array as-is, and JSON.stringify's array serialization
    // does check each *element's* own toJSON individually - only this
    // "toJSON returns a lone object with its own toJSON" shape is affected.)
    const content = this.content as unknown;
    if (
      content !== null &&
      typeof content === "object" &&
      typeof (content as { toJSON?: unknown }).toJSON === "function"
    ) {
      return (content as { toJSON: () => unknown }).toJSON();
    }
    return this.content;
  }
}

// Array describes how an incoming list should be applied to an existing one,
// mirroring emigo.Array on the Go side. It lets a PATCH-style payload say
// "replace the whole set" versus "append to the existing set".
//
// On the wire a "replace" is implicit (a bare array), while an "append" is
// tagged with __operation so the reader keeps the existing rows. This keeps
// the payload identical to the Go client/backend generators.
export class MArray<T> {
  private operation: "replace" | "append" = "replace";
  private items: T[] = [];

  static cast<T = any>(
    value: unknown,
  ): { ok: boolean; value: MArray<T> | null } {
    if (typeof value === "object" && (value as any)?.__operation) {
      const res = MArray.of<T>((value as any)?.items);
      res.operation = (value as any)?.__operation;

      return {
        ok: true,
        value: res,
      };
    }

    return {
      value: null,
      ok: false,
    };
  }

  isAppend(): boolean {
    return this.operation === "append";
  }

  isReplace(): boolean {
    return this.operation === "replace";
  }

  len(): number {
    return this.items.length;
  }

  get(): T[] {
    return this.items;
  }

  // Full replacement — existing rows are cleared before these are applied.
  static of<T>(items: T[]) {
    const arr = new MArray<T>();
    arr.items = items;
    arr.operation = "replace";

    return arr;
  }

  // Append — existing rows are preserved and these are added alongside them.
  static append<T>(items: T[]) {
    const arr = new MArray<T>();
    arr.items = items;
    arr.operation = "append";

    return arr;
  }

  toJSON() {
    // "replace" is implicit on the wire, so we emit a bare array. Only the
    // "append" operation needs the explicit tagged-object form.
    if (this.operation === "append") {
      return {
        __operation: this.operation,
        items: this.items,
      };
    }

    return this.items;
  }
}

// Collection mirrors emigo.Collection on the Go side. Structurally it is the
// same as Array — a list carrying a "replace"/"append" operation — but it is a
// distinct field type: a collection holds a list of a target entity, whereas an
// array holds a list of an inline DTO.
export class MCollection<T> {
  private operation: "replace" | "append" = "replace";
  private items: T[] = [];

  isAppend(): boolean {
    return this.operation === "append";
  }

  static cast<T = any>(
    value: unknown,
  ): { ok: boolean; value: MCollection<T> | null } {
    if (typeof value === "object" && (value as any)?.__operation) {
      const res = MCollection.of<T>((value as any)?.items);
      res.operation = (value as any)?.__operation;

      return {
        ok: true,
        value: res,
      };
    }

    return {
      value: null,
      ok: false,
    };
  }

  isReplace(): boolean {
    return this.operation === "replace";
  }

  len(): number {
    return this.items.length;
  }

  get(): T[] {
    return this.items;
  }

  // Full replacement — existing rows are cleared before these are applied.
  static of<T>(items: T[]) {
    const collection = new MCollection<T>();
    collection.items = items;
    collection.operation = "replace";

    return collection;
  }

  // Append — existing rows are preserved and these are added alongside them.
  static append<T>(items: T[]) {
    const collection = new MCollection<T>();
    collection.items = items;
    collection.operation = "append";

    return collection;
  }

  toJSON() {
    // "replace" is implicit on the wire, so we emit a bare array. Only the
    // "append" operation needs the explicit tagged-object form.
    if (this.operation === "append") {
      return {
        __operation: this.operation,
        items: this.items,
      };
    }

    return this.items;
  }
}
