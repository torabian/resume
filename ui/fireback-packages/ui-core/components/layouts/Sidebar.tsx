import { type MenuItem } from "../../types/MenuItem";
import { source } from "../../hooks/source";
import { useUiState } from "../../hooks/uiStateContext";

import classNames from "classnames";
import React, { useContext } from "react";
import { BUILD_VARIABLES } from "../../hooks/build-variables";
import { detectDeviceType } from "../../hooks/deviceInformation";
import { useRemoteMenuResolver } from "../../hooks/useRemoteMenuResolver";
import { useFrontendMenuItems } from "../../hooks/frontendMenuRegistry";
import { useSortableOrder } from "../../hooks/useSortableOrder";
import { osResources } from "../../hooks/resources";
import type { AppMenuOptionalDto } from "@fireback/ui-core/sdk/interfacetools/AppMenuOptionalDto";
import { AppMenuDto } from "@fireback/ui-core/sdk/interfacetools/AppMenuDto";
import { getTStringValue } from "../../types/TString";
import { ReactiveSearchContext } from "../reactive-search/ReactiveSearchContext";
import { CurrentUser } from "./CurrentUser";
import { MenuParticle } from "./MenuParticle";
import { useWorkspacesMenuPresenter } from "./useWorkspacesMenuPresenter";
import { demoMenuItems } from "./demoMenuItems";
import { useS } from "../../hooks/useS";
import { strings } from "../strings/translations";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { GripVertical } from "lucide-react";

export function dataMenuToMenu(
  data: AppMenuOptionalDto,
  permissionCheck: (permissionKey?: string | null) => boolean = () => true,
  locale: string,
): MenuItem | null {
  if (!permissionCheck(data.capabilityId)) {
    return null;
  }

  const children = (data.children || [])
    .map((v: AppMenuOptionalDto) => dataMenuToMenu(v, permissionCheck, locale))
    .filter(Boolean) as MenuItem[];

  // Bug fix: data.label is a real complexes.TString instance now that
  // @fireback/complexes actually exports TString correctly (see
  // Abac.emi.yml/InterfaceTools.emi.yml's complexes: block) - it used to be
  // effectively unreachable code (AppMenuOptionalDto's setter threw
  // "TString is not defined" the moment any label was set, before that fix,
  // taking down the whole Sidebar via its ErrorBoundary), so this never got
  // to run against the real shape. A TString instance's per-locale values
  // live behind a private field, not as directly-indexable object keys -
  // `label[locale]` on one always resolved to undefined, rendering a blank
  // menu label instead of throwing. getTStringValue (duck-typed against
  // TString's own .get()) is the one already-established way every other
  // TString-valued field in this app resolves down to a single locale's text.
  const label = getTStringValue(data.label as any, locale);

  return {
    label,
    // Bug fix: menuGroups below used to derive each sortable group's identity
    // from its (locale-dependent) translated label text - switching language
    // changed every group's id at once, so useSortableOrder saw the whole set
    // as "disappeared" and re-appended everything in insertion order,
    // silently discarding any drag-to-reorder the user had done (and, for the
    // workspace switcher specifically - see useWorkspacesMenuPresenter.tsx -
    // moving it off the top). uniqueId is stable across locales; only fall
    // back to the label for a menu entry that somehow has none.
    key: data.uniqueId || undefined,
    children,
    displayFn: castMenuDefinitionToDisplayFn(data),
    icon: data.icon,
    href: data.href,
    activeMatcher: data.activeMatcher
      ? new RegExp(data.activeMatcher)
      : undefined,
  };
}

function castMenuDefinitionToDisplayFn(data: AppMenuDto) {
  return () => true;
}

export const defaultNavbar: MenuItem = {
  label: "Navbar",
  children: [],
};

function Sidebar({
  miniSize,
  onClose,
  sidebarItemSelectedExtra,
}: {
  miniSize: boolean;
  onClose?: () => void;
  sidebarItemSelectedExtra?: () => void;
}) {
  const {
    sidebarVisible,
    toggleSidebar: toggleSidebar$,
    sidebarItemSelected,
  } = useUiState();
  const menu = useRemoteMenuResolver("sidebar");
  // Menu groups any frontend module has registered for itself via
  // useMenu("sidebar", ...) - see frontendMenuRegistry.tsx. Purely
  // client-side, independent of the backend's /cte-app-menus data above, so
  // a module never needs a backend seeder just to show up here.
  const frontendMenu = useFrontendMenuItems("sidebar");
  const s = useS(strings);

  const { reset } = useContext(ReactiveSearchContext);

  const toggleSidebar = () => {
    reset();
    toggleSidebar$();
  };

  if (!menu) {
    return null;
  }

  let menus: MenuItem[] = [];
  if (Array.isArray(menu)) {
    menus = [...menu];
  } else if ((menu as any).children?.length) {
    menus.push(menu);
  }
  menus = [...menus, ...frontendMenu];

  // Rendered on its own, fixed above the sortable groups below (see the
  // return statement) rather than folded into `menus` - the workspace
  // switcher always stays the top item, not just draggable-back-to-top:
  // it never participates in useSortableOrder's persisted order at all.
  const { menus: workspaceMenus } = useWorkspacesMenuPresenter();

  // id prefers m.key (stable, locale-independent - see dataMenuToMenu's own
  // comment) over the translated label text, so useSortableOrder's drag
  // order survives a language switch instead of resetting to insertion
  // order every time (every group's id used to change at once).
  const menuGroups = menus.map((m, index) => ({
    id: m.key || (typeof m.label === "string" && m.label) || `group-${index}`,
    menu: m,
  }));

  // Session-only reordering of the top-level menu groups — see
  // useSortableOrder. Nothing is persisted, so this resets on refresh.
  const { ordered: orderedGroups, reorder: reorderGroups } = useSortableOrder(
    menuGroups,
    (g) => g.id,
  );
  const groupSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function handleGroupDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderGroups(String(active.id), String(over.id));
    }
  }

  return (
    <div
      data-wails-drag
      className={classNames(
        miniSize ? "sidebar-extra-small" : "",
        "sidebar",
        sidebarVisible ? "open" : "",
        "scrollable-element",
        detectDeviceType().isMobileView ? "has-bottom-tab" : undefined,
      )}
    >
      <button
        className="sidebar-close"
        onClick={() => (onClose ? onClose() : toggleSidebar())}
      >
        <img src={source(osResources.cancel)} />
      </button>

      {/* Always the top item, deliberately outside the sortable groups below -
          see useWorkspacesMenuPresenter's own comment on why this can't just be
          a regular (draggable-but-usually-on-top) group. */}
      {workspaceMenus[0] && (
        <MenuParticle
          menu={workspaceMenus[0]}
          onClick={() => {
            sidebarItemSelected();
            sidebarItemSelectedExtra?.();
          }}
        />
      )}

      <DndContext
        sensors={groupSensors}
        collisionDetection={closestCenter}
        onDragEnd={handleGroupDragEnd}
        // See MenuParticle.tsx — the sidebar is a scroll container, and
        // dnd-kit's default auto-scroll fights with that while dragging.
        autoScroll={false}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={orderedGroups.map((g) => g.id)}
          strategy={verticalListSortingStrategy}
        >
          {orderedGroups.map((g) => (
            <SortableMenuGroup
              key={g.id}
              id={g.id}
              menu={g.menu}
              onClick={() => {
                sidebarItemSelected();
                sidebarItemSelectedExtra?.();
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
      {BUILD_VARIABLES.GITHUB_DEMO === "true" && (
        <MenuParticle
          onClick={() => {
            sidebarItemSelected();
            sidebarItemSelectedExtra?.();
          }}
          menu={{
            label: s.components.demo,
            children: demoMenuItems.map((item) => ({
              label: s.components[item.labelKey],
              icon: item.icon,
              children: [],
              href: item.href,
            })),
          }}
        />
      )}
      <CurrentUser
        onClick={() => {
          sidebarItemSelected();
          sidebarItemSelectedExtra?.();
        }}
      />
    </div>
  );
}

function SortableMenuGroup({
  id,
  menu,
  onClick,
}: {
  id: string;
  menu: MenuItem;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandle = (
    <span
      className="drag-handle"
      aria-hidden="true"
      {...attributes}
      {...listeners}
    >
      <GripVertical size={14} />
    </span>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classNames("sortable-menu-group", isDragging && "is-dragging")}
    >
      <MenuParticle menu={menu} onClick={onClick} dragHandle={dragHandle} />
    </div>
  );
}

export default React.memo(Sidebar);
