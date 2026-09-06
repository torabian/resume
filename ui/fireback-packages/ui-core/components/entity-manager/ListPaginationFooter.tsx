import "./ListPaginationFooter.css";
import { useS } from "../../hooks/useS";
import { strings } from "../strings/translations";

const DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 100, 200, 500];

export interface ListPaginationFooterProps {
  /** Rows accumulated into the grid so far (indexedData.length). */
  loadedCount: number;
  /** Server-reported total, if known (GResponse.data.totalItems). */
  totalCount?: number | null;
  /** True once the most recent page fetch (first load or a later page) failed. */
  failed?: boolean;
  /** Human-readable reason for the last failure, if one is available. */
  errorMessage?: string;
  /** True while a retry is already in flight - disables the button instead of letting it double-fire. */
  retrying?: boolean;
  onRetry: () => void;
  /** Current udf.filters.itemsPerPage - omit onPageSizeChange to hide the dropdown entirely. */
  pageSize?: number;
  /** udf.setPageSize - resets to page 1 at the new size (see useDatatableFiltering's own comment on why). */
  onPageSizeChange?: (pageSize: number) => void;
  /** Defaults to [25, 50, 100, 200, 500]; pageSize itself is always included even if not in this list. */
  pageSizeOptions?: number[];
}

// Status/retry bar CommonListManager renders below its grid, always - not just on
// error. Three jobs: 1) tells the user how many rows are actually loaded (out of the
// server's own total, when it reports one), since the top ribbon (loading-ribbon/
// LoadingRibbonContext.tsx) is easy to miss and gives no indication of *how much* is
// left; 2) lets them change how many rows a page fetches at once; 3) surfaces a failed
// page fetch with its error message and a Retry button - CommonListManager's own toast
// for the same failure disappears after a few seconds, this stays up until the user
// acts on it (or a later page succeeds).
export function ListPaginationFooter({
  loadedCount,
  totalCount,
  failed,
  errorMessage,
  retrying,
  onRetry,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: ListPaginationFooterProps) {
  const s = useS(strings);

  const stats =
    typeof totalCount === "number"
      ? s.table.loadedCountOf
          .replace("{count}", String(loadedCount))
          .replace("{total}", String(totalCount))
      : s.table.loadedCount.replace("{count}", String(loadedCount));

  const options =
    pageSize && !pageSizeOptions.includes(pageSize)
      ? [...pageSizeOptions, pageSize].sort((a, b) => a - b)
      : pageSizeOptions;

  return (
    <div className="list-pagination-footer">
      <span className="list-pagination-footer__stats">{stats}</span>
      <div className="list-pagination-footer__right">
        {onPageSizeChange && (
          <label className="list-pagination-footer__page-size">
            {s.table.itemsPerPage}
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}
        {failed && (
          <span className="list-pagination-footer__error">
            <span className="list-pagination-footer__error-message">
              {errorMessage || s.table.errorTitle}
            </span>
            <button
              type="button"
              className="list-pagination-footer__retry"
              onClick={onRetry}
              disabled={retrying}
            >
              {s.components.retry}
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

export default ListPaginationFooter;
