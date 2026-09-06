import { type QueryArchiveColumn } from "@fireback/ui-core/types/QueryArchiveColumn";
import { type BrowseWorkspaceMembersActionResType as WorkspaceMemberDto } from "@fireback/selfservice/sdk/abac/BrowseWorkspaceMembersAction";
import { type strings } from "./strings/translations";

export const columns = (
  s: typeof strings,
  onRemove: (member: WorkspaceMemberDto) => void,
  onChangeRole: (member: WorkspaceMemberDto) => void,
): QueryArchiveColumn[] => [
  {
    name: "firstName",
    title: s.member.name,
    width: 200,
    getCellValue: (dto: WorkspaceMemberDto) =>
      [dto.firstName, dto.lastName].filter(Boolean).join(" ") || dto.userId,
  },
  {
    name: "roleName",
    title: s.member.role,
    width: 160,
  },
  {
    name: "actions",
    title: s.member.actions,
    width: 200,
    getCellValue: (dto: WorkspaceMemberDto) =>
      (
        <>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            style={{ marginRight: "4px" }}
            onClick={(e) => {
              e.stopPropagation();
              onChangeRole(dto);
            }}
          >
            {s.member.changeRole}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(dto);
            }}
          >
            {s.member.remove}
          </button>
        </>
      ) as any,
  },
];
