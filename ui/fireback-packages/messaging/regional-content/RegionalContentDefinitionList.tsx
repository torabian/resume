import { type MouseEvent } from "react";
import { PageSection } from "@fireback/ui-core/components/page-section/PageSection";
import { useS } from "@fireback/ui-core/hooks/useS";
import { httpErrorHanlder } from "@fireback/ui-core/hooks/api";
import { Toast } from "@fireback/ui-core/hooks/toast";
import { useOverlay } from "@fireback/overlay";
import { commonDialogs } from "@fireback/overlay/dom";
import { strings as coreStrings } from "@fireback/ui-core/components/strings/translations";
import { MOne } from "@fireback/js-remote-ctx/common/operators";
import { RegionalContentDto } from "@fireback/messaging/sdk/messaging/RegionalContentDto";
import { RegionalContentDefinitionDto } from "@fireback/messaging/sdk/messaging/RegionalContentDefinitionDto";
import { RegionalContentDefinitionOptionalDto } from "@fireback/messaging/sdk/messaging/RegionalContentDefinitionOptionalDto";
import {
  RegionalContentDefinitionBrowseActionQueryParams,
  useRegionalContentDefinitionBrowseActionQuery,
} from "@fireback/messaging/sdk/messaging/RegionalContentDefinitionBrowseAction";
import { useRegionalContentDefinitionCreateAction } from "@fireback/messaging/sdk/messaging/RegionalContentDefinitionCreateAction";
import { useRegionalContentDefinitionUpdateAction } from "@fireback/messaging/sdk/messaging/RegionalContentDefinitionUpdateAction";
import {
  RegionalContentDefinitionAwareDeleteActionReq,
  useRegionalContentDefinitionAwareDeleteAction,
} from "@fireback/messaging/sdk/messaging/RegionalContentDefinitionAwareDeleteAction";
import {
  RegionalContentDefinitionModal,
  type RegionalContentDefinitionModalResult,
} from "./RegionalContentDefinitionModal";
import { strings } from "./strings/translations";

// Lists every regionalContentDefinition (locale/title/content) belonging to one
// regionalContent row, with its own add/edit/delete flow through
// regionalContentDefinition's own endpoints - clicking a row opens a modal to edit just
// that one definition, mirroring UserPassportsList.tsx's "child list scoped by a
// parent's uniqueId, per-item actions" shape (openModal here, since this feature was
// specifically asked for as a modal rather than a drawer).
export const RegionalContentDefinitionList = ({
  regionalContentId,
  keyGroup,
}: {
  regionalContentId: string;
  // Which kind of message the parent regionalContent is used for - forwarded into the
  // modal so its content field picks rich vs plain text the same way
  // RegionalContentEditForm.tsx's own content field used to.
  keyGroup?: string;
}) => {
  const s = useS(strings);
  const cs = useS(coreStrings);
  const { openModal } = useOverlay();

  const { data, refetch } = useRegionalContentDefinitionBrowseActionQuery({
    qs: new RegionalContentDefinitionBrowseActionQueryParams({
      regionalContentId,
    }).setItemsPerPage(1000),
  });
  const items = (data as any)?.data?.items as
    | RegionalContentDefinitionDto[]
    | undefined;

  const createMutation = useRegionalContentDefinitionCreateAction({});

  const addDefinition = () => {
    openModal<RegionalContentDefinitionModalResult | undefined>(
      (modalProps) => (
        <RegionalContentDefinitionModal {...modalProps} parentKeyGroup={keyGroup} />
      ),
      { title: s.regionalContents.newDefinition },
    )
      .promise.then(({ type, data: values }) => {
        if (type !== "resolved" || !values) {
          return;
        }
        const dto = new RegionalContentDefinitionDto({
          locale: values.locale,
          title: values.title,
          content: values.content,
        });
        dto.regionalContent = MOne.select<RegionalContentDto>(regionalContentId);
        return createMutation.mutateAsync(dto).then(() => {
          Toast(s.regionalContents.definitionCreated, { type: "success" });
          refetch();
        });
      })
      .catch((err) => httpErrorHanlder(err, cs));
  };

  return (
    <PageSection
      title={s.regionalContents.definitionsTitle}
      description={s.regionalContents.definitionsHint}
    >
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={addDefinition}
        >
          {s.regionalContents.addDefinition}
        </button>
      </div>
      {!items || items.length === 0 ? (
        <p className="text-muted">{s.regionalContents.noDefinitions}</p>
      ) : (
        <div className="list-group">
          {items.map((item) => (
            <RegionalContentDefinitionRow
              key={item.uniqueId}
              item={item}
              keyGroup={keyGroup}
              onChanged={refetch}
            />
          ))}
        </div>
      )}
    </PageSection>
  );
};

// One row = one definition. Owns its own update mutation, bound to this item's own
// uniqueId (regionalContentDefinition's update endpoint takes uniqueId as a URL path
// parameter fixed at hook-creation time - see useRegionalContentDefinitionUpdateAction -
// so each row needs its own hook instance rather than sharing one at the list level,
// same reasoning as RegionalContentEntityManager.tsx's own patchHook).
const RegionalContentDefinitionRow = ({
  item,
  keyGroup,
  onChanged,
}: {
  item: RegionalContentDefinitionDto;
  keyGroup?: string;
  onChanged: () => void;
}) => {
  const s = useS(strings);
  const cs = useS(coreStrings);
  const { openModal } = useOverlay();
  const { confirmModal } = commonDialogs();

  const updateMutation = useRegionalContentDefinitionUpdateAction({
    params: { uniqueId: item.uniqueId },
  });
  const deleteMutation = useRegionalContentDefinitionAwareDeleteAction({});

  const edit = () => {
    openModal<RegionalContentDefinitionModalResult | undefined>(
      (modalProps) => (
        <RegionalContentDefinitionModal
          {...modalProps}
          parentKeyGroup={keyGroup}
          initialValues={{
            locale: item.locale,
            title: item.title,
            content: item.content,
          }}
        />
      ),
      { title: s.regionalContents.editDefinition },
    )
      .promise.then(({ type, data: values }) => {
        if (type !== "resolved" || !values) {
          return;
        }
        // "regionalContent" is deliberately never set here - a definition's parent
        // never changes through a plain content edit, and the generated update fn only
        // accepts a "select" operation for it (see RegionalContentDefinitionActions.go).
        const optional = new RegionalContentDefinitionOptionalDto({
          locale: values.locale,
          title: values.title,
          content: values.content,
        });
        return updateMutation.mutateAsync(optional).then(() => {
          Toast(s.regionalContents.definitionUpdated, { type: "success" });
          onChanged();
        });
      })
      .catch((err) => httpErrorHanlder(err, cs));
  };

  const remove = (e: MouseEvent) => {
    e.stopPropagation();
    confirmModal({
      title: s.regionalContents.deleteDefinitionConfirmTitle,
      description: s.regionalContents.deleteDefinitionConfirmDescription.replace(
        "{locale}",
        item.locale,
      ),
      confirmLabel: cs.common.yes,
      cancelLabel: cs.common.no,
    })
      .promise.then(({ type }) => {
        if (type !== "resolved") {
          return;
        }
        return deleteMutation
          .mutateAsync(
            new RegionalContentDefinitionAwareDeleteActionReq({
              uniqueIds: [item.uniqueId],
            }),
          )
          .then(() => {
            Toast(s.regionalContents.definitionDeleted, { type: "success" });
            onChanged();
          });
      })
      .catch((err) => httpErrorHanlder(err, cs));
  };

  return (
    <div
      className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
      role="button"
      onClick={edit}
    >
      <div>
        <div className="fw-bold">
          {item.locale}
          {item.title ? ` — ${item.title}` : ""}
        </div>
        <div className="text-muted text-truncate" style={{ maxWidth: 480 }}>
          {item.content}
        </div>
      </div>
      <button
        type="button"
        className="btn btn-sm btn-outline-danger"
        onClick={remove}
      >
        {cs.deleteAction}
      </button>
    </div>
  );
};

export default RegionalContentDefinitionList;
