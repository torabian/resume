import { source } from "../../hooks/source";
import { useS } from "../../hooks/useS";
import { strings } from "../strings/translations";

/**
 * Translated "there's nothing to show here" state for CommonListManager -
 * same visual slot/markup as EmptyList.tsx (".empty-list-indicator", reuses
 * its image), but with a description and a reload button, since a bare
 * list is ambiguous ("is this still loading, or truly empty?") without one.
 * Query errors are handled separately, by QueryErrorView (see
 * error-view/QueryError.tsx) - this only ever renders once a query has
 * settled successfully with zero rows.
 */
export function QueryEmptyState({ onReload }: { onReload: () => void }) {
  const s = useS(strings);
  return (
    <div className="empty-list-indicator">
      <img src={source("/common/empty.png")} />
      <div>{s.table.emptyTitle}</div>
      <p style={{ opacity: 0.7, maxWidth: 420 }}>{s.table.noRecords}</p>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={onReload}
      >
        {s.components.retry}
      </button>
    </div>
  );
}
