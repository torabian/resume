// One tab per "descriptions" item (a per-target-position write-up of a
// project - see Resume.emi.yml's own doc comment on ProjectDto.Descriptions),
// each tab holding that item's own target-position picker, TString content
// editor and skills multi-picker. Plain bootstrap nav-tabs/tab-content
// markup with React-controlled active state (no bootstrap JS/data-bs-toggle
// - this repo already loads bootstrap's CSS, see Sidebar.tsx/
// ResumeContentField.tsx's own "nav nav-tabs"/"btn btn-*" usage, just never
// its JS bundle), not a shared Tabs component - there isn't one yet in
// @fireback/ui-core to reach for.
//
// Kept as its own file/component (not inlined into ProjectEditForm.tsx) so
// the array-of-tabs bookkeeping (active index, add/remove) stays isolated
// from the rest of the project form's plain fields.
import { useState } from "react";
import { FormSelectMultiple } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { FormTString } from "@fireback/ui-core/components/forms/form-tstring/FormTString";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { getTStringValue, type TString } from "@fireback/ui-core/types/TString";
import { useTargetPositionsQuerySource } from "../TargetPositionQuerySource";
import { useSkillsQuerySource } from "../SkillQuerySource";
import type { TargetPositionDto } from "@/modules/resume/sdk/TargetPositionDto";
import type { SkillDto } from "@/modules/resume/sdk/SkillDto";

// Wire shape ProjectDto.Descriptions/ProjectOptionalDto.Descriptions items
// actually round-trip as: a fetched item's `target` and `skills` are both a
// bare array of full DTOs (CollectionNullable's own "replace"-is-implicit
// read shape - see emigo/CollectionNullable.go's MarshalJSON) - a plain
// `{uniqueId}` stub per item is all ReconcileManyToMany needs back (see this
// file's own onChange handlers for `target`/`skills`), no selector wrapping
// at all. A description can now match multiple target positions.
export interface ProjectDescriptionItem {
  uniqueId?: string | null;
  target?: Array<{ uniqueId?: string | null } & Record<string, any>>;
  content?: TString | null;
  skills?: Array<{ uniqueId?: string | null } & Record<string, any>>;
}

function emptyDescription(): ProjectDescriptionItem {
  return { content: {}, target: [], skills: [] };
}

function tabLabel(
  item: ProjectDescriptionItem,
  index: number,
  targets: TargetPositionDto[],
  locale: string,
): string {
  const targetIds = new Set((item.target ?? []).map((t) => t.uniqueId));
  const matched = targets.filter((t) => targetIds.has(t.uniqueId));
  if (matched.length > 0) {
    return matched
      .map((t) => getTStringValue(t.name as any, locale) || t.uniqueId)
      .join(", ");
  }
  return `Description #${index + 1}`;
}

export function ProjectDescriptionsTabs({
  value,
  onChange,
  errors,
}: {
  value: ProjectDescriptionItem[] | null | undefined;
  onChange: (next: ProjectDescriptionItem[]) => void;
  errors?: any;
}) {
  const { locale } = useLocale();
  const items = value ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[Math.min(activeIndex, items.length - 1)];

  const { items: targets } = useTargetPositionsQuerySource({
    query: { itemsPerPage: 200 },
  });
  const { items: skills } = useSkillsQuerySource({
    query: { itemsPerPage: 200 },
  });
  const targetsQuerySource = useTargetPositionsQuerySource;
  const skillsQuerySource = useSkillsQuerySource;

  const updateItem = (
    index: number,
    patch: Partial<ProjectDescriptionItem>,
  ) => {
    const next = items.map((it, i) => (i === index ? { ...it, ...patch } : it));
    onChange(next);
  };

  const addTab = () => {
    onChange([...items, emptyDescription()]);
    setActiveIndex(items.length);
  };

  const removeTab = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onChange(next);
    setActiveIndex((current) =>
      Math.max(0, current >= index ? current - 1 : current),
    );
  };

  const activeErrors = Array.isArray(errors) ? errors[activeIndex] : undefined;

  return (
    <div className="project-descriptions-tabs">
      <ul className="nav nav-tabs">
        {items.map((item, index) => (
          <li className="nav-item" key={item.uniqueId ?? `new-${index}`}>
            <button
              type="button"
              className={`nav-link${index === activeIndex ? " active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              {tabLabel(item, index, targets, locale)}
              <span
                className="ms-2 text-danger"
                role="button"
                title="Remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(index);
                }}
              >
                &times;
              </span>
            </button>
          </li>
        ))}
        <li className="nav-item">
          <button type="button" className="nav-link" onClick={addTab}>
            + Add description
          </button>
        </li>
      </ul>

      {activeItem && (
        <div className="tab-content border border-top-0 p-3">
          <FormSelectMultiple<TargetPositionDto, string>
            label="Target positions"
            value={targets.filter((t) =>
              (activeItem.target ?? []).some(
                (selected) => selected.uniqueId === t.uniqueId,
              ),
            )}
            querySource={targetsQuerySource}
            keyExtractor={(t) => t.uniqueId as string}
            fnLabelFormat={(t) =>
              getTStringValue(t.name as any, locale) || (t.uniqueId as string)
            }
            errorMessage={activeErrors?.target}
            onChange={(nextTargets: TargetPositionDto[]) =>
              updateItem(activeIndex, {
                target: nextTargets.map((t) => ({ uniqueId: t.uniqueId })),
              })
            }
          />
          <FormTString
            label="Content"
            multiline
            value={activeItem.content}
            errorMessage={activeErrors?.content}
            onChange={(v) => updateItem(activeIndex, { content: v })}
          />
          <FormSelectMultiple<SkillDto, string>
            label="Skills"
            value={skills.filter((s) =>
              (activeItem.skills ?? []).some(
                (selected) => selected.uniqueId === s.uniqueId,
              ),
            )}
            querySource={skillsQuerySource}
            keyExtractor={(s) => s.uniqueId as string}
            fnLabelFormat={(s) => s.name}
            onChange={(nextSkills: SkillDto[]) =>
              updateItem(activeIndex, {
                skills: nextSkills.map((s) => ({ uniqueId: s.uniqueId })),
              })
            }
          />
        </div>
      )}

      {items.length === 0 && (
        <div className="tab-content border border-top-0 p-3 text-muted">
          No descriptions yet - click "+ Add description" to write one for a
          target position.
        </div>
      )}
    </div>
  );
}

export default ProjectDescriptionsTabs;
