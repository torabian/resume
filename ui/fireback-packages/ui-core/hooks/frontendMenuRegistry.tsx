import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MenuItem } from "../types/MenuItem";

/**
 * Lets any frontend module contribute its own sidebar menu group(s) purely
 * from a component, without the app shell needing to know about it up
 * front - the mirror image of useRemoteMenuResolver.tsx (which pulls menu
 * groups down from the backend's `/cte-app-menus` AppMenu tree).
 *
 * A React context (not a module-level singleton) so registration follows
 * normal component lifetime: a module calls useMenu(...) from wherever it
 * already runs unconditionally while the app shell is up (its own
 * `use<Module>Routes()` hook is the natural place - see WalletMenu.ts/
 * WalletRoutes.tsx), and its items disappear on unmount instead of leaking
 * across app instances/tests. FrontendMenuProvider must be mounted above
 * both: every `use<Module>Routes()` call site (so useMenu has a provider to
 * register into) and Sidebar.tsx (so it can read the result) - see
 * EssentialApp.tsx, which wraps the whole app once, the same way it already
 * does for UIStateProvider.
 */

interface Registration {
  id: number;
  items: MenuItem[];
}

interface IFrontendMenuContext {
  register: (menuGroup: string, id: number, items: MenuItem[]) => void;
  unregister: (menuGroup: string, id: number) => void;
  getItems: (menuGroup: string) => MenuItem[];
}

const noop = () => {};
const EMPTY: MenuItem[] = [];

const FrontendMenuContext = React.createContext<IFrontendMenuContext>({
  register: noop,
  unregister: noop,
  getItems: () => EMPTY,
});

let nextRegistrationId = 1;

export function FrontendMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keyed by menuGroup ("sidebar", ...) -> every component currently
  // contributing to it, each keeping its own latest `items` so one
  // module's re-registration never has to know about another's.
  const [groups, setGroups] = useState<Map<string, Registration[]>>(
    () => new Map(),
  );

  const register = useCallback(
    (menuGroup: string, id: number, items: MenuItem[]) => {
      setGroups((prev) => {
        const next = new Map(prev);
        const existing = (next.get(menuGroup) || []).filter(
          (r) => r.id !== id,
        );
        next.set(menuGroup, [...existing, { id, items }]);
        return next;
      });
    },
    [],
  );

  const unregister = useCallback((menuGroup: string, id: number) => {
    setGroups((prev) => {
      const existing = prev.get(menuGroup);
      if (!existing || !existing.some((r) => r.id === id)) {
        return prev;
      }
      const next = new Map(prev);
      next.set(
        menuGroup,
        existing.filter((r) => r.id !== id),
      );
      return next;
    });
  }, []);

  // getItems reads straight off `groups` (closed over below via
  // useMemo's own dependency), not out of a ref, so a menuGroup with no
  // registrations yet - the common case for anything but "sidebar" - keeps
  // returning the same EMPTY array reference rather than allocating one.
  const getItems = useCallback(
    (menuGroup: string): MenuItem[] => {
      const registrations = groups.get(menuGroup);
      if (!registrations || registrations.length === 0) {
        return EMPTY;
      }
      return registrations.flatMap((r) => r.items);
    },
    [groups],
  );

  const value = useMemo(
    () => ({ register, unregister, getItems }),
    [register, unregister, getItems],
  );

  return (
    <FrontendMenuContext.Provider value={value}>
      {children}
    </FrontendMenuContext.Provider>
  );
}

/**
 * Registers `items` as one contribution to `menuGroup` ("sidebar" is the
 * one Sidebar.tsx actually renders today) for as long as the calling
 * component stays mounted - unregistering automatically on unmount, and
 * re-registering whenever `items` changes identity. Call it from a hook
 * that already runs unconditionally while the module is loaded (the same
 * place a module's own `use<Module>Routes()` hook lives), not from deep
 * inside a page that only mounts once its own route is visited - otherwise
 * the sidebar entry would only exist while that page happens to be open.
 *
 * `items` should be referentially stable across renders (wrap it in
 * useMemo at the call site) - a fresh array literal every render still
 * works, it just churns the registry (unregister+register) on every
 * render for no reason.
 */
export function useMenu(menuGroup: string, items: MenuItem[]): void {
  const { register, unregister } = useContext(FrontendMenuContext);
  const idRef = useRef<number | null>(null);
  if (idRef.current === null) {
    idRef.current = nextRegistrationId++;
  }

  useEffect(() => {
    const id = idRef.current as number;
    register(menuGroup, id, items);
    return () => unregister(menuGroup, id);
  }, [menuGroup, items, register, unregister]);
}

/** Sidebar-side counterpart to useMenu: every item currently registered
 * under `menuGroup`, re-rendering the caller whenever a module
 * registers/unregisters. */
export function useFrontendMenuItems(menuGroup: string): MenuItem[] {
  const { getItems } = useContext(FrontendMenuContext);
  return getItems(menuGroup);
}
