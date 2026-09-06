import { useState } from "react";
import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { useS } from "@fireback/ui-core/hooks/useS";
import { useRolesQuerySource } from "@fireback/ui-core/hooks/useRolesQuerySource";
import { type RoleDto } from "@fireback/selfservice/sdk/abac/RoleDto";
import { strings as coreStrings } from "@fireback/ui-core/components/strings/translations";
import { getLocale } from "@fireback/ui-core/hooks/localeStore";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { strings } from "./strings/translations";

export const WorkspaceMemberChangeRoleDrawer = ({
  close,
  resolve,
}: {
  close: () => void;
  resolve: (roleId?: string) => void;
}) => {
  const s = useS(strings);
  const cs = useS(coreStrings);
  const [role, setRole] = useState<RoleDto | undefined>();

  return (
    <div className="confirm-drawer-container p-3">
      <h2>{s.member.changeRoleTitle}</h2>
      <p>{s.member.changeRoleHint}</p>

      <FormSelect<RoleDto, string>
        querySource={useRolesQuerySource}
        value={role}
        onChange={(item) => setRole(item)}
        keyExtractor={(item) => item?.uniqueId}
        // name is complexes.TString now (a locale -> text map) - resolve to the
        // viewer's own locale rather than handing React the raw {en, fa, ...} object.
        fnLabelFormat={(item) =>
          getTStringValue(item?.name, getLocale()) || item?.uniqueId || ""
        }
        label={s.member.changeRoleLabel}
      />

      <div>
        <button
          className="d-block w-100 btn btn-primary"
          disabled={!role?.uniqueId}
          onClick={() => resolve(role!.uniqueId!)}
        >
          {cs.common.save}
        </button>
        <button className="d-block w-100 btn" onClick={() => close()}>
          {cs.common.cancel}
        </button>
      </div>
    </div>
  );
};
