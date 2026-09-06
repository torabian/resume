import { Checkbox } from "@fireback/ui-core/components/checkbox/Checkbox";
import { ErrorsView } from "@fireback/ui-core/components/error-view/ErrorView";
import { useCapabilitiesTreeActionQuery } from "@fireback/selfservice/sdk/abac/CapabilitiesTreeAction";
import { MCollection } from "@fireback/js-remote-ctx/common/operators";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue, type TString } from "@fireback/ui-core/types/TString";

/**
 * Moved from the old `sdk/core/react-tools.tsx` - this is the only consumer.
 */
interface CapabilityChild {
  uniqueId: string;
  // name/description are complexes.TString now (a locale -> text map) - see
  // CapabilitiesTreeActionImplementation.go's own treeToCapabilityChild, which looks
  // each node's real capability row up by its reconstructed full key. Not every
  // synthetic grouping node has one (nothing is ever registered as bare "abac"), so
  // both stay optional - the raw uniqueId is still shown when there's no name.
  name?: TString;
  children: CapabilityChild[];
}

type NodeChangeFn = (
  node: string,
  value: "checked" | "unchecked" | "indeterminate",
) => void;

export function RolePermissionTree({
  onChange,
  value,
  prefix,
}: {
  value: string[];
  onChange?: (value: string[]) => void;
  prefix?: string;
}) {
  const { data, error } = useCapabilitiesTreeActionQuery({});

  let items = data?.data?.item?.nested;

  const onNodeChange: NodeChangeFn = (node, checkValue) => {
    let newValue: string[] = [...(value || [])];
    if (checkValue === "checked") {
      newValue.push(node);
    }
    if (checkValue === "unchecked") {
      newValue = newValue.filter((t) => t !== node);
    }
    onChange && onChange(newValue);
  };

  return (
    <nav className="tree-nav">
      <ErrorsView error={error} />
      <ul className="list">
        {items instanceof MCollection ? (
          <PermissionTree
            items={items}
            onNodeChange={onNodeChange}
            value={value}
            prefix={prefix}
          />
        ) : null}
      </ul>
    </nav>
  );
}

export function PermissionTree({
  items,
  onNodeChange,
  value,
  prefix,
  autoChecked,
}: {
  items: MCollection<CapabilityChild>;
  value: string[];
  autoChecked?: boolean;
  onNodeChange: NodeChangeFn;
  prefix?: string;
}) {
  const pref = prefix ? prefix + "." : "";
  return (
    <>
      {(items.get() || []).map((item) => {
        const completeKey = `${pref}${item.uniqueId}${
          item.children?.length ? ".*" : ""
        }`;

        const checkValue: "checked" | "unchecked" | "indeterminate" = (
          value || []
        ).includes(completeKey)
          ? "checked"
          : "unchecked";

        return (
          <li key={item.uniqueId}>
            <span>
              <label className={autoChecked ? "auto-checked" : ""}>
                <Checkbox
                  value={checkValue}
                  onChange={(e) => {
                    onNodeChange(
                      completeKey,
                      checkValue === "checked" ? "unchecked" : "checked",
                    );
                  }}
                />
                {getTStringValue(item.name, getLocale()) || item.uniqueId}
              </label>
            </span>
            {item.children && (
              <ul>
                <PermissionTree
                  autoChecked={autoChecked || checkValue === "checked"}
                  onNodeChange={onNodeChange}
                  value={value}
                  items={item.children as any}
                  prefix={pref + item.uniqueId}
                />
              </ul>
            )}
          </li>
        );
      })}
    </>
  );
}
