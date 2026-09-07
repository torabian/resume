import "./ResumeCreator.css";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Award,
  Briefcase,
  Building2,
  GripVertical,
  Languages as LanguagesIcon,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { getTStringValue, type TString as TStringValue } from "@fireback/ui-core/types/TString";
import { useSkillBrowseActionQuery } from "@/modules/resume/sdk/SkillBrowseAction";
import { useProjectBrowseActionQuery } from "@/modules/resume/sdk/ProjectBrowseAction";
import { useWorkExperienceBrowseActionQuery } from "@/modules/resume/sdk/WorkExperienceBrowseAction";
import { useCertificationBrowseActionQuery } from "@/modules/resume/sdk/CertificationBrowseAction";
import { useLanguageBrowseActionQuery } from "@/modules/resume/sdk/LanguageBrowseAction";

// ResumeCreator - a two-pane picker for assembling one resume's worth of
// content - work experience, skills, projects, certifications, languages -
// out of everything you've ever recorded (see each entity's own browse
// action; none of them are scoped to any one Resume, so this is a manual
// curation step rather than a query-driven one). What ends up in `selected`
// here is exactly what ResumeToLatexImplementation.go's own
// ResumeToLatexAction renders into the PDF, section by section, in this
// same order - see that file's own header comment.
//
// Right pane lists every row of each kind (unfiltered browse - no qs means
// no LIMIT is applied server-side, see emigorm.ApplyQueryPage, so this
// really is "everything" - fine for a personal tool's own handful of rows),
// grouped under GROUP_TITLES. Dragging a card from there into the left pane
// adds it to `selected`
// (this component's own state - nothing is persisted server-side by this
// screen; see its own file-header note on why). Cards already in `selected`
// drop out of the right pane so the same item can't be added twice, and can
// be reordered by dragging within the left pane itself (resume section
// order matters, unlike a plain multi-select) or removed with the "x"
// button.
//
// Drag-and-drop is @dnd-kit (already a dependency - see package.json and
// Sidebar.tsx's own group-reorder drag handle, which this mirrors: same
// PointerSensor + 4px activationConstraint, same
// attributes/listeners-on-a-grip-icon convention) rather than a new
// library - one of the most widely used React DnD toolkits, and already
// proven out elsewhere in this app.
type ItemKind = "skill" | "project" | "workExperience" | "certification" | "language";

// Every kind offered by the picker, in the order they're rendered as groups
// in the library pane below - also doubles as the single source of truth
// pool-lookups (findAvailable, addChecked, ...) iterate over instead of
// hand-listing each pool at every call site.
const ITEM_KINDS: ItemKind[] = [
  "workExperience",
  "skill",
  "project",
  "certification",
  "language",
];

const GROUP_TITLES: Record<ItemKind, string> = {
  workExperience: "Work Experience",
  skill: "Skills",
  project: "Projects",
  certification: "Certifications & Licenses",
  language: "Languages",
};

export interface PickerItem {
  kind: ItemKind;
  uniqueId: string;
  label: string;
}

// jobTitle/company/name/etc are `complex: TString` server-side (a
// locale->string map, e.g. {"en": "Software Engineer"}) - see
// Resume.emi.yml's own field definitions for workExperience/certification/
// language. This used to hand-roll its own {locale: value} lookup here,
// which is exactly what broke it: the generated *Dto classes
// (WorkExperienceDto.ts etc) don't hand a browse hook's caller a plain
// {en: "..."} object at all - every `complex: TString` field is wrapped in
// a real `@fireback/complexes` TString *class instance* (a getter backed by
// a private `values` field), even when nothing asked for one explicitly
// (WorkExperienceBrowseAction.ts's own default `creatorFn` always
// constructs one). `map.en`/`Object.values(map)` against that instance
// don't see `values.en` at all - they see the instance's own one
// enumerable property, `values` (the *whole* {en: "...", ...} record,
// still an object) - so the old code's strict `typeof v === "string"` guard
// (added to fix an earlier crash where an unguarded version rendered that
// object directly) just made it silently resolve to "" instead: correctly
// not-a-crash, but still wrong. `getTStringValue` (@fireback/ui-core/types/
// TString.ts) is this codebase's own already-proven fix for exactly this -
// duck-typed against `.get` being a function - and is what every other
// TString-displaying screen in this app already uses (RoleColumns.tsx,
// WorkspaceColumns.tsx, Sidebar.tsx, ...); reusing it here instead of
// re-diagnosing the same bug a third time.
function pickLocale(ts: unknown, locale: string): string {
  if (!ts) return "";
  return getTStringValue(ts as TStringValue, locale);
}

// Last-line-of-defense for every place a label is actually rendered as a
// JSX child (AvailableCard/SelectedCard/DragOverlay below): a plain string
// (skill.name/project.name are plain `string` fields, not TString - see
// Resume.emi.yml) passes straight through *without* going through
// getTStringValue, which would otherwise index into it character-by-character
// (a bare string has no `.get`, so it falls through to `value[locale]` then
// `Object.values(value)` - on a string, that returns its individual
// characters). Anything TString-shaped goes through pickLocale above, and
// any other unexpected value (not even an object - a number, `null`
// surviving a bad merge, ...) becomes "" rather than reaching JSX at all.
// `PickerItem.label` is typed `string`, but that's a compile-time promise
// only - a persisted `content` row is raw JSON off the wire, not something
// TypeScript actually checked, so this is what makes a malformed one inert
// instead of a crash. No locale needed here (defaults to "en", matching
// ResumeToLatexImplementation.go's own default) - by construction `label`
// is already a resolved plain string by the time it reaches these render
// sites; this only ever fires for already-bad persisted data.
function safeLabel(v: unknown): string {
  if (typeof v === "string") return v;
  return pickLocale(v, "en");
}

// Draggable/sortable ids need to be globally unique across both panes and
// carry enough information for handleDragEnd to act without a lookup table -
// "<list>:<kind>:<uniqueId>" does both. `list` tells the drop handler which
// pane a drag started/landed in; `kind`+`uniqueId` identify the item itself.
// uniqueId is always a plain uuid (see every generated *Entity's own
// UniqueId column default, gen_random_uuid()) so it never itself contains
// a ":" - safe to split on.
function toDomId(list: "avail" | "sel", item: Pick<PickerItem, "kind" | "uniqueId">) {
  return `${list}:${item.kind}:${item.uniqueId}`;
}

function fromDomId(id: string) {
  const [list, kind, uniqueId] = id.split(":");
  return { list: list as "avail" | "sel", kind: kind as ItemKind, uniqueId };
}

function itemKey(item: Pick<PickerItem, "kind" | "uniqueId">) {
  return `${item.kind}:${item.uniqueId}`;
}

const DROP_ZONE_ID = "resume-creator-drop-zone";

// `closestCenter` (the usual default) compares the dragged rect's center to
// each droppable's center - fine for a list of similarly-sized sortable
// items, but unreliable here: the left pane is one large drop target, and
// its center can end up far from wherever the pointer actually is,
// especially right after it grows/shrinks (adding or removing a card
// changes its height mid-interaction). `pointerWithin` checks the literal
// cursor position against each droppable's rect instead, which is what
// "drop it here" actually means to a user - falling back to
// `rectIntersection` (any overlap at all) only if the pointer is right at
// an edge and inside no rect exactly, e.g. between two stacked cards.
const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

const ITEM_ICONS: Record<ItemKind, typeof Sparkles> = {
  skill: Sparkles,
  project: Briefcase,
  workExperience: Building2,
  certification: Award,
  language: LanguagesIcon,
};

function ItemIcon({ kind }: { kind: ItemKind }) {
  const Icon = ITEM_ICONS[kind];
  return <Icon size={14} className="resume-creator__card-icon" />;
}

/** A card in the right (available) pane. Three independent ways to act on
 * it, none stepping on the others:
 *  - drag the grip handle onto the left pane (the original mechanism);
 *  - click anywhere else on the card (it's a real `<button>`, not just
 *    dragging - see this file's own doc comment on why) to add it
 *    immediately, no drag needed;
 *  - tick its checkbox to mark it for a batch add later (see
 *    ResumeCreator's own bulk-select toolbar) without adding it yet - a
 *    separate track from the immediate click-to-add, for picking several
 *    items before committing any of them.
 * Checkbox and grip handle are siblings of the add button below, not
 * nested inside it, so clicking either never also triggers onAdd. */
function AvailableCard({
  item,
  checked,
  onToggleCheck,
  onAdd,
}: {
  item: PickerItem;
  checked: boolean;
  onToggleCheck: () => void;
  onAdd: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: toDomId("avail", item),
  });

  return (
    <div
      ref={setNodeRef}
      className={
        "resume-creator__card" +
        (isDragging ? " resume-creator__card--dragging" : "")
      }
    >
      <span
        {...attributes}
        {...listeners}
        className="resume-creator__card-grip"
      >
        <GripVertical size={14} className="resume-creator__card-icon" />
      </span>
      <input
        type="checkbox"
        className="resume-creator__card-checkbox"
        checked={checked}
        onChange={onToggleCheck}
        aria-label={`Mark ${safeLabel(item.label)} for batch add`}
      />
      <button
        type="button"
        className="resume-creator__card-button"
        onClick={onAdd}
        title="Add to resume"
      >
        <ItemIcon kind={item.kind} />
        <span className="resume-creator__card-label">{safeLabel(item.label)}</span>
        <Plus size={14} className="resume-creator__card-add-icon" />
      </button>
    </div>
  );
}

/** A card in the left (selected) pane - sortable (so the selection can be
 * reordered) plus a remove button, since dragging it back out isn't wired
 * up (removing is a plain click instead, simpler than a second drop
 * target). */
function SelectedCard({
  item,
  onRemove,
}: {
  item: PickerItem;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: toDomId("sel", item) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        "resume-creator__card" +
        (isDragging ? " resume-creator__card--dragging" : "")
      }
    >
      <span {...attributes} {...listeners} className="resume-creator__card-grip">
        <GripVertical size={14} className="resume-creator__card-icon" />
      </span>
      <ItemIcon kind={item.kind} />
      <span className="resume-creator__card-label">{safeLabel(item.label)}</span>
      <button
        type="button"
        className="resume-creator__card-remove"
        onClick={onRemove}
        aria-label="Remove"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/** The left pane's drop target - a component of its own specifically so
 * `useDroppable` is called by a component *rendered inside* `<DndContext>`,
 * not by ResumeCreator itself (which renders `<DndContext>`, making it an
 * *ancestor* of the provider, not a descendant of it). Calling
 * useDraggable/useDroppable/useSortable from a component sitting above its
 * own `<DndContext>` silently connects to nothing: the hook still "works"
 * (no error, no warning), it just dispatches into a disconnected default
 * context that DndContext's own collision detection never reads from - so
 * every drop resolves with `over: null` no matter where you actually drop
 * it, indistinguishable from "the drop just didn't land". This is why
 * dragging visibly worked (AvailableCard/SelectedCard are correctly nested
 * *inside* DndContext) but dropping never did.
 */
function DropZone({
  selected,
  onRemove,
}: {
  selected: PickerItem[];
  onRemove: (item: PickerItem) => void;
}) {
  const { setNodeRef: setDropZoneRef, isOver } = useDroppable({
    id: DROP_ZONE_ID,
  });

  return (
    <div
      ref={setDropZoneRef}
      className={
        "resume-creator__dropzone" +
        (isOver ? " resume-creator__dropzone--over" : "")
      }
    >
      {selected.length === 0 ? (
        <div className="resume-creator__empty">Nothing selected yet</div>
      ) : (
        <SortableContext
          items={selected.map((i) => toDomId("sel", i))}
          strategy={verticalListSortingStrategy}
        >
          <div className="resume-creator__list">
            {selected.map((item) => (
              <SelectedCard
                key={itemKey(item)}
                item={item}
                onRemove={() => onRemove(item)}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}

/**
 * The actual picker UI - two panes, drag/click/batch-add, search - fully
 * controlled: `value`/`onChange` own the picked list, the same
 * `useState`-backed contract every rjsf field already uses (see
 * TStringField.tsx's own formData/onChange). Split out from `ResumeCreator`
 * (the standalone page below, which owns its own uncontrolled state)
 * specifically so ResumeContentField.tsx can embed this same picker inside
 * a modal for the `resume.content` field, without pulling in
 * usePageTitle/routing or duplicating any of the drag-and-drop logic.
 */
export function ResumeCreatorPicker({
  value,
  onChange,
}: {
  value: PickerItem[];
  onChange: (items: PickerItem[]) => void;
}) {
  const { locale } = useLocale();

  // No qs -> no LIMIT server-side (see this file's own header comment) -
  // every row of each kind the signed-in user has ever recorded comes back
  // in one page, which is exactly what a picker needs (unlike
  // ArchiveScreen's own paged/cursor browsing).
  const skillsQuery = useSkillBrowseActionQuery({});
  const projectsQuery = useProjectBrowseActionQuery({});
  const workExperiencesQuery = useWorkExperienceBrowseActionQuery({});
  const certificationsQuery = useCertificationBrowseActionQuery({});
  const languagesQuery = useLanguageBrowseActionQuery({});

  const availableSkills: PickerItem[] = useMemo(
    () =>
      (skillsQuery.data?.data?.items ?? []).map((s: any) => ({
        kind: "skill" as const,
        uniqueId: s.uniqueId,
        label: safeLabel(s.name),
      })),
    [skillsQuery.data],
  );
  const availableProjects: PickerItem[] = useMemo(
    () =>
      (projectsQuery.data?.data?.items ?? []).map((p: any) => ({
        kind: "project" as const,
        uniqueId: p.uniqueId,
        label: safeLabel(p.name),
      })),
    [projectsQuery.data],
  );
  const availableWorkExperiences: PickerItem[] = useMemo(
    () =>
      (workExperiencesQuery.data?.data?.items ?? []).map((w: any) => {
        const jobTitle = pickLocale(w.jobTitle, locale);
        const company = pickLocale(w.company, locale);
        return {
          kind: "workExperience" as const,
          uniqueId: w.uniqueId,
          label: company ? `${jobTitle} – ${company}` : jobTitle,
        };
      }),
    [workExperiencesQuery.data, locale],
  );
  const availableCertifications: PickerItem[] = useMemo(
    () =>
      (certificationsQuery.data?.data?.items ?? []).map((c: any) => ({
        kind: "certification" as const,
        uniqueId: c.uniqueId,
        label: pickLocale(c.name, locale),
      })),
    [certificationsQuery.data, locale],
  );
  const availableLanguages: PickerItem[] = useMemo(
    () =>
      (languagesQuery.data?.data?.items ?? []).map((l: any) => ({
        kind: "language" as const,
        uniqueId: l.uniqueId,
        label: pickLocale(l.name, locale),
      })),
    [languagesQuery.data, locale],
  );

  // One lookup table keyed by kind, so findAvailable/addChecked/the render
  // below don't each need their own hand-listed switch over all 5 pools.
  const availableByKind: Record<ItemKind, PickerItem[]> = {
    skill: availableSkills,
    project: availableProjects,
    workExperience: availableWorkExperiences,
    certification: availableCertifications,
    language: availableLanguages,
  };

  // `selected`/`setSelected` below is every bit of this component's own
  // logic, unchanged from before this was split out - it's just backed by
  // the controlled `value`/`onChange` pair now instead of its own
  // `useState`. setSelected keeps supporting the functional-updater form
  // (`setSelected((prev) => ...)`) every call site already uses.
  const selected = value;
  function setSelected(
    updater: PickerItem[] | ((prev: PickerItem[]) => PickerItem[]),
  ) {
    onChange(typeof updater === "function" ? updater(selected) : updater);
  }
  const selectedKeys = useMemo(
    () => new Set(selected.map(itemKey)),
    [selected],
  );

  // `selected`'s own `label` is a snapshot taken the moment an item was
  // added (see PickerItem's own doc comment), not a live lookup - it has to
  // be, since a card still needs *something* to show even for an item whose
  // source entity has since been deleted. But that means a label captured
  // wrong (e.g. computed before its browse query had finished loading -
  // this is exactly what happened for the crash this file used to have:
  // dragging a work-experience card while pickLocale still had a bug baked
  // an empty "" label into `content`, which then stayed empty forever after
  // the bug was fixed, since nothing ever went back and recomputed it) can
  // never self-correct on its own. This reconciles every selected item's
  // label against the freshest one available once its own kind's browse
  // query has data, silently repairing any drift the next time this modal
  // opens - a stale/wrong label heals itself instead of staying wrong until
  // someone notices and manually removes/re-adds the card. Deliberately
  // depends on the 5 memoized available* arrays (not `selected` itself, and
  // not the `availableByKind` object above, which is a fresh reference every
  // render) - re-running only when a browse query's data actually changes
  // keeps this from looping against its own setSelected call below.
  useEffect(() => {
    const pools: Record<ItemKind, PickerItem[]> = {
      skill: availableSkills,
      project: availableProjects,
      workExperience: availableWorkExperiences,
      certification: availableCertifications,
      language: availableLanguages,
    };
    setSelected((prev) => {
      let changed = false;
      const next = prev.map((item) => {
        const live = pools[item.kind].find((i) => i.uniqueId === item.uniqueId);
        if (live && live.label && live.label !== item.label) {
          changed = true;
          return { ...item, label: live.label };
        }
        return item;
      });
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    availableSkills,
    availableProjects,
    availableWorkExperiences,
    availableCertifications,
    availableLanguages,
  ]);

  const [activeItem, setActiveItem] = useState<PickerItem | null>(null);

  // Items ticked in the library for a batch add (see addChecked below) -
  // separate from `selected` itself: checking an item doesn't add it yet,
  // it just marks it as part of the next "Add selected" click. Keyed the
  // same way as everything else (itemKey), not by DOM id, since these never
  // touch dnd-kit.
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  // Click-to-add path (AvailableCard's own button) - the immediate,
  // one-item counterpart to dragging. Shares dedupe logic with
  // handleDragEnd's "avail" branch, just always appends rather than
  // inserting at a hovered position (there's no drop position to honor
  // here).
  function addItem(item: PickerItem) {
    setSelected((prev) =>
      prev.some((i) => i.kind === item.kind && i.uniqueId === item.uniqueId)
        ? prev
        : [...prev, item],
    );
    setCheckedKeys((prev) => {
      if (!prev.has(itemKey(item))) return prev;
      const next = new Set(prev);
      next.delete(itemKey(item));
      return next;
    });
  }

  function toggleChecked(item: PickerItem) {
    setCheckedKeys((prev) => {
      const key = itemKey(item);
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function addChecked() {
    const toAdd = ITEM_KINDS.flatMap((kind) => availableByKind[kind]).filter(
      (i) => checkedKeys.has(itemKey(i)),
    );
    if (toAdd.length === 0) return;
    setSelected((prev) => {
      const existing = new Set(prev.map(itemKey));
      return [...prev, ...toAdd.filter((i) => !existing.has(itemKey(i)))];
    });
    setCheckedKeys(new Set());
  }

  function clearChecked() {
    setCheckedKeys(new Set());
  }

  function findAvailable(kind: ItemKind, uniqueId: string): PickerItem | undefined {
    return availableByKind[kind].find((i) => i.uniqueId === uniqueId);
  }

  function handleDragStart(event: DragStartEvent) {
    const { list, kind, uniqueId } = fromDomId(String(event.active.id));
    const item =
      list === "avail"
        ? findAvailable(kind, uniqueId)
        : selected.find((i) => i.kind === kind && i.uniqueId === uniqueId);
    setActiveItem(item ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const activeInfo = fromDomId(String(active.id));

    if (activeInfo.list === "avail") {
      // Dropping an available card anywhere onto the left pane (its empty
      // background, or on top of an existing selected card) adds it - see
      // this file's own header comment on why order-of-drop-target doesn't
      // matter here, only "landed inside the left pane at all".
      if (selectedKeys.has(`${activeInfo.kind}:${activeInfo.uniqueId}`)) return;
      const item = findAvailable(activeInfo.kind, activeInfo.uniqueId);
      if (!item) return;

      const overInfo =
        String(over.id) === DROP_ZONE_ID ? null : fromDomId(String(over.id));
      setSelected((prev) => {
        if (!overInfo) return [...prev, item];
        const overIndex = prev.findIndex(
          (i) => i.kind === overInfo.kind && i.uniqueId === overInfo.uniqueId,
        );
        if (overIndex === -1) return [...prev, item];
        return [...prev.slice(0, overIndex), item, ...prev.slice(overIndex)];
      });
      return;
    }

    // Reordering within the left pane - both ends have to be an already-
    // selected card for arrayMove to make sense (dragging a selected card
    // back onto the right pane, or onto nothing, is a no-op: removal is a
    // deliberate click on the "x" instead, not an accidental drop).
    if (String(over.id) === DROP_ZONE_ID) return;
    const overInfo = fromDomId(String(over.id));
    if (overInfo.list !== "sel") return;

    setSelected((prev) => {
      const oldIndex = prev.findIndex(
        (i) => i.kind === activeInfo.kind && i.uniqueId === activeInfo.uniqueId,
      );
      const newIndex = prev.findIndex(
        (i) => i.kind === overInfo.kind && i.uniqueId === overInfo.uniqueId,
      );
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  function removeSelected(item: PickerItem) {
    setSelected((prev) =>
      prev.filter((i) => !(i.kind === item.kind && i.uniqueId === item.uniqueId)),
    );
  }

  // Search only ever narrows the library pane - it has no effect on what's
  // already picked on the left. Plain case-insensitive substring match on
  // the label, same as every other free-text filter in this app (see e.g.
  // TStringFilterDrawer.tsx).
  const searchTerm = search.trim().toLowerCase();
  const groups: Array<{ kind: ItemKind; title: string; items: PickerItem[] }> =
    ITEM_KINDS.map((kind) => {
      const pending = availableByKind[kind].filter(
        (i) => !selectedKeys.has(itemKey(i)),
      );
      const filtered = searchTerm
        ? pending.filter((i) => i.label.toLowerCase().includes(searchTerm))
        : pending;
      return { kind, title: GROUP_TITLES[kind], items: filtered };
    });

  const loading =
    skillsQuery.isLoading ||
    projectsQuery.isLoading ||
    workExperiencesQuery.isLoading ||
    certificationsQuery.isLoading ||
    languagesQuery.isLoading;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="resume-creator">
        <div className="resume-creator__column resume-creator__column--selected">
          <div className="resume-creator__column-title">Selected for resume</div>
          <div className="resume-creator__hint">
            Drag any section here from the right, then drag to reorder - this
            is exactly what ends up in the PDF, in this order.
          </div>
          <DropZone selected={selected} onRemove={removeSelected} />
        </div>

        <div className="resume-creator__column resume-creator__column--library">
          <div className="resume-creator__column-title">Your library</div>
          <div className="resume-creator__hint">
            {loading
              ? "Loading..."
              : "Drag, click, or tick and batch-add an item to the left column."}
          </div>

          <div className="resume-creator__search">
            <Search size={14} className="resume-creator__search-icon" />
            <input
              type="search"
              className="form-control resume-creator__search-input"
              placeholder="Search your library..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {checkedKeys.size > 0 && (
            <div className="resume-creator__bulk-bar">
              <span>{checkedKeys.size} selected</span>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={addChecked}
              >
                Add selected
              </button>
              <button
                type="button"
                className="btn btn-sm btn-link"
                onClick={clearChecked}
              >
                Clear
              </button>
            </div>
          )}

          {/* Scrolls on its own (independent of the page/left column) - a
              long skill/project list would otherwise stretch this whole
              screen tall enough that the drop target scrolls out of view
              mid-drag. */}
          <div className="resume-creator__library-scroll">
            {groups.map(
              (group) =>
                group.items.length > 0 && (
                  <div key={group.kind}>
                    <div className="resume-creator__group-title">{group.title}</div>
                    <div className="resume-creator__list">
                      {group.items.map((item) => (
                        <AvailableCard
                          key={itemKey(item)}
                          item={item}
                          checked={checkedKeys.has(itemKey(item))}
                          onToggleCheck={() => toggleChecked(item)}
                          onAdd={() => addItem(item)}
                        />
                      ))}
                    </div>
                  </div>
                ),
            )}

            {searchTerm && groups.every((group) => group.items.length === 0) && (
              <div className="resume-creator__empty">
                No matches for &quot;{search}&quot;
              </div>
            )}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="resume-creator__card">
            <GripVertical size={14} className="resume-creator__card-icon" />
            <ItemIcon kind={activeItem.kind} />
            <span className="resume-creator__card-label">{safeLabel(activeItem.label)}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/** The standalone "/resume-creator" screen (see cmd/resumeMenus.go's own
 * sidebar entry and ApplicationRoutes.tsx's route) - just ResumeCreatorPicker
 * with its own page title and locally-owned, uncontrolled state. Doesn't
 * persist anywhere on its own; ResumeContentField.tsx's modal is the other
 * (controlled) consumer of the same picker, wired to the `resume.content`
 * form field instead. */
export function ResumeCreator() {
  usePageTitle("Resume Creator");
  const [value, setValue] = useState<PickerItem[]>([]);
  return <ResumeCreatorPicker value={value} onChange={setValue} />;
}

export default ResumeCreator;
