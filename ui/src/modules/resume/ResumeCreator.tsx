import "./ResumeCreator.css";

import { useMemo, useState } from "react";
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
import { Briefcase, GripVertical, Plus, Search, Sparkles, X } from "lucide-react";
import { usePageTitle } from "@fireback/ui-core/components/page-title/PageTitle";
import { useSkillBrowseActionQuery } from "@/modules/resume/sdk/SkillBrowseAction";
import { useProjectBrowseActionQuery } from "@/modules/resume/sdk/ProjectBrowseAction";

// ResumeCreator - a two-pane picker for assembling one resume's worth of
// skills/projects out of everything you've ever recorded (see Skill/Project
// browse actions - both entities are standalone rows today, not scoped to
// any one Resume, so this is a manual curation step rather than a
// query-driven one).
//
// Right pane lists every Skill/Project (unfiltered browse - no qs means no
// LIMIT is applied server-side, see emigorm.ApplyQueryPage, so this really
// is "everything" - fine for a personal tool's own handful of rows).
// Dragging a card from there into the left pane adds it to `selected`
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
type ItemKind = "skill" | "project";

interface PickerItem {
  kind: ItemKind;
  uniqueId: string;
  label: string;
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

function ItemIcon({ kind }: { kind: ItemKind }) {
  return kind === "skill" ? (
    <Sparkles size={14} className="resume-creator__card-icon" />
  ) : (
    <Briefcase size={14} className="resume-creator__card-icon" />
  );
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
        aria-label={`Mark ${item.label} for batch add`}
      />
      <button
        type="button"
        className="resume-creator__card-button"
        onClick={onAdd}
        title="Add to resume"
      >
        <ItemIcon kind={item.kind} />
        <span className="resume-creator__card-label">{item.label}</span>
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
      <span className="resume-creator__card-label">{item.label}</span>
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

export function ResumeCreator() {
  usePageTitle("Resume Creator");

  // No qs -> no LIMIT server-side (see this file's own header comment) -
  // every skill/project the signed-in user has ever recorded comes back in
  // one page, which is exactly what a picker needs (unlike ArchiveScreen's
  // own paged/cursor browsing).
  const skillsQuery = useSkillBrowseActionQuery({});
  const projectsQuery = useProjectBrowseActionQuery({});

  const availableSkills: PickerItem[] = useMemo(
    () =>
      (skillsQuery.data?.data?.items ?? []).map((s: any) => ({
        kind: "skill" as const,
        uniqueId: s.uniqueId,
        label: s.name,
      })),
    [skillsQuery.data],
  );
  const availableProjects: PickerItem[] = useMemo(
    () =>
      (projectsQuery.data?.data?.items ?? []).map((p: any) => ({
        kind: "project" as const,
        uniqueId: p.uniqueId,
        label: p.name,
      })),
    [projectsQuery.data],
  );

  // The one piece of state this whole screen exists to build - the
  // skills/projects (and their order) picked for this resume. Nothing here
  // is submitted anywhere yet; a real "save this as a resume" action would
  // read this array.
  const [selected, setSelected] = useState<PickerItem[]>([]);
  const selectedKeys = useMemo(
    () => new Set(selected.map(itemKey)),
    [selected],
  );

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
    const toAdd = [...availableSkills, ...availableProjects].filter((i) =>
      checkedKeys.has(itemKey(i)),
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
    const pool = kind === "skill" ? availableSkills : availableProjects;
    return pool.find((i) => i.uniqueId === uniqueId);
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

  const pendingSkills = availableSkills.filter(
    (i) => !selectedKeys.has(itemKey(i)),
  );
  const pendingProjects = availableProjects.filter(
    (i) => !selectedKeys.has(itemKey(i)),
  );

  // Search only ever narrows the library pane - it has no effect on what's
  // already picked on the left. Plain case-insensitive substring match on
  // the label, same as every other free-text filter in this app (see e.g.
  // TStringFilterDrawer.tsx).
  const searchTerm = search.trim().toLowerCase();
  const filteredSkills = searchTerm
    ? pendingSkills.filter((i) => i.label.toLowerCase().includes(searchTerm))
    : pendingSkills;
  const filteredProjects = searchTerm
    ? pendingProjects.filter((i) => i.label.toLowerCase().includes(searchTerm))
    : pendingProjects;

  const loading = skillsQuery.isLoading || projectsQuery.isLoading;

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
            Drag skills and projects here from the right, then drag to reorder.
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
              placeholder="Search skills and projects..."
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
            {filteredSkills.length > 0 && (
              <>
                <div className="resume-creator__group-title">Skills</div>
                <div className="resume-creator__list">
                  {filteredSkills.map((item) => (
                    <AvailableCard
                      key={itemKey(item)}
                      item={item}
                      checked={checkedKeys.has(itemKey(item))}
                      onToggleCheck={() => toggleChecked(item)}
                      onAdd={() => addItem(item)}
                    />
                  ))}
                </div>
              </>
            )}

            {filteredProjects.length > 0 && (
              <>
                <div className="resume-creator__group-title">Projects</div>
                <div className="resume-creator__list">
                  {filteredProjects.map((item) => (
                    <AvailableCard
                      key={itemKey(item)}
                      item={item}
                      checked={checkedKeys.has(itemKey(item))}
                      onToggleCheck={() => toggleChecked(item)}
                      onAdd={() => addItem(item)}
                    />
                  ))}
                </div>
              </>
            )}

            {searchTerm &&
              filteredSkills.length === 0 &&
              filteredProjects.length === 0 && (
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
            <span className="resume-creator__card-label">{activeItem.label}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default ResumeCreator;
