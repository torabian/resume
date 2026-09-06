// Frontend counterpart of modules/fireback/jsonsql/JsonLogicToSql.go's
// ConditionToJsonLogic - builds the exact same {"and": [...]} JsonLogic
// (jsonlogic.com) tree shape from a flat list of {field, value} conditions, so a
// column-filter payload built here parses identically on the backend (the Go side
// feeds the same shape into github.com/h22rana/jsonlogic2sql).
//
// Rules mirrored 1:1 from ConditionToJsonLogic:
//  - a blank value is dropped entirely (not sent as an empty "contains")
//  - a value that looks like a JSON object/array ("{" or "[" anywhere in it) is
//    parsed as-is and used directly as the sub-expression - this is the escape
//    hatch for a power-user/advanced filter typing raw JsonLogic instead of a
//    plain contains match (e.g. {"==": [{"var":"status"},"active"]})
//  - anything else becomes {"contains": [{"var": field}, value]}, everything
//    joined with "and"
export interface JsonLogicCondition {
  field: string;
  value: string;
}

export type JsonLogicNode = Record<string, unknown>;

export function buildJsonLogic(conditions: JsonLogicCondition[]): JsonLogicNode {
  const and: unknown[] = [];

  for (const item of conditions) {
    if (!item.value) {
      continue;
    }

    if (item.value.includes("{") || item.value.includes("[")) {
      try {
        and.push(JSON.parse(item.value));
        continue;
      } catch {
        // Fall through to the plain "contains" treatment below - not valid
        // JSON, just a value that happens to contain a brace/bracket.
      }
    }

    and.push({
      contains: [{ var: item.field }, item.value],
    });
  }

  return { and };
}

// True when the tree has no real conditions left ({"and": []}) - the caller's
// signal to omit the filter query param entirely rather than sending a no-op.
export function isEmptyJsonLogic(node: JsonLogicNode): boolean {
  const and = node.and;
  return Array.isArray(and) && and.length === 0;
}

// Builds the sub-expression TStringFilterDrawer's per-locale values turn into: one
// "contains" per locale that actually has search text typed in, OR'd together - "match
// if any of the languages the user typed something into contains it", since a
// complexes.TString column (a locale -> text map, e.g. {"en": "Home", "fa": "خانه"})
// stores each locale as its own JSON key (field.<locale>, e.g. "label.en") rather than
// one flat value a plain "contains" could target.
//
// The caller (DataGridListHeaderCell) JSON.stringifies this and hands it to
// useColumnFilters' setColumnFilter the same way any other column's raw-JsonLogic power
// filter would (see buildJsonLogic's own doc comment on the "{"/"[" escape hatch) -
// there's no separate code path in useColumnFilters/buildJsonLogic for TString columns
// specifically.
export function buildTStringFilterCondition(
  field: string,
  perLocaleValues: Record<string, string>,
): JsonLogicNode | undefined {
  const conditions = Object.entries(perLocaleValues)
    .filter(([, value]) => value.trim() !== "")
    .map(([locale, value]) => ({
      contains: [{ var: `${field}.${locale}` }, value],
    }));

  if (conditions.length === 0) {
    return undefined;
  }
  if (conditions.length === 1) {
    return conditions[0];
  }
  return { or: conditions };
}

// Same dot-path idea as buildTStringFilterCondition, for a complexes.TMoney
// column (a currency -> amount map, e.g. {"USD": 9.99, "EUR": 8.99}) -
// "field.<CURRENCY>" reaches that one currency's price inside the jsonb
// object. Unlike TString's "contains" (free text), a price is a number,
// so this builds an exact "==" match per currency instead - callers doing
// a range match (">=","<=") can build their own {"var": `${field}.USD`}
// condition the same way and skip this helper entirely.
export function buildTMoneyFilterCondition(
  field: string,
  perCurrencyValues: Record<string, number | string>,
): JsonLogicNode | undefined {
  const conditions = Object.entries(perCurrencyValues)
    .filter(([, value]) => value !== "" && value !== null && value !== undefined)
    .map(([currency, value]) => ({
      "==": [{ var: `${field}.${currency.toUpperCase()}` }, Number(value)],
    }));

  if (conditions.length === 0) {
    return undefined;
  }
  if (conditions.length === 1) {
    return conditions[0];
  }
  return { or: conditions };
}

// Builds the literal "sort" query param string for ordering a browse query
// by one currency inside a complexes.TMoney jsonb column, e.g.
// buildTMoneySort("price", "USD", "desc") -> "price->>'USD' desc". Mirrors
// how emigorm.ApplyQuerySort (emigorm/query.go) applies "sort" as a raw
// SQL ORDER BY clause - there's no separate jsonlogic step for sorting the
// way there is for filtering, so this needs to already be valid SQL.
export function buildTMoneySort(
  field: string,
  currency: string,
  direction: "asc" | "desc" = "asc",
): string {
  return `(${field}->>'${currency.toUpperCase()}')::numeric ${direction}`;
}
