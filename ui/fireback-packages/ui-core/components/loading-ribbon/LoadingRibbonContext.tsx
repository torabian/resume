import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { LineLoader } from "../line-loader/LineLoader";
import "./LoadingRibbonContext.css";

export interface ILoadingRibbonContext {
  /** Marks `key` as loading and shows the ribbon; call the returned fn (or `stop(key)`) once it's done. */
  start: (key: string) => () => void;
  stop: (key: string) => void;
  isActive: boolean;
}

const LoadingRibbonContext = createContext<ILoadingRibbonContext>({
  start: () => () => {},
  stop: () => {},
  isActive: false,
});

// Global top-page ribbon loader: any component (CommonListManager's own
// subsequent-page fetches being the motivating case) can flag itself as
// "loading" via useLoadingRibbon() without needing to render its own
// loader or know where in the tree the ribbon actually lives. Several
// callers can be in flight at once (e.g. two lists on the same page each
// fetching a page) - a Set of active keys, rather than a single boolean, is
// what makes the ribbon only disappear once *every* caller has finished.
export function LoadingRibbonProvider({ children }: { children: ReactNode }) {
  const activeKeys = useRef(new Set<string>());
  const [isActive, setIsActive] = useState(false);

  const sync = useCallback(() => {
    setIsActive(activeKeys.current.size > 0);
  }, []);

  const stop = useCallback(
    (key: string) => {
      activeKeys.current.delete(key);
      sync();
    },
    [sync],
  );

  const start = useCallback(
    (key: string) => {
      activeKeys.current.add(key);
      sync();
      return () => stop(key);
    },
    [sync, stop],
  );

  const value = useMemo(
    () => ({ start, stop, isActive }),
    [start, stop, isActive],
  );

  return (
    <LoadingRibbonContext.Provider value={value}>
      <div className="loading-ribbon-slot">
        {isActive && <LineLoader className="loading-ribbon-slot__bar" />}
      </div>
      {children}
    </LoadingRibbonContext.Provider>
  );
}

/** Global hook: `useLoadingRibbon().start(key)` while a fetch is in flight, `stop(key)` (or the fn `start` returns) when it settles. */
export function useLoadingRibbon() {
  return useContext(LoadingRibbonContext);
}
