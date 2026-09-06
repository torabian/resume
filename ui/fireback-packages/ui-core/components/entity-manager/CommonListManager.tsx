import "react-data-grid/lib/styles.css";

import { type GResponse } from "@fireback/js-remote-ctx/envelopes/index";
import {
  type QueryClient,
  type UseQueryResult,
  useQueryClient,
} from "@tanstack/react-query";
import { debounce } from "lodash";
import { type ReactNode, useEffect, useMemo, useRef } from "react";
import {
  type CalculatedColumn,
  DataGrid,
  type DataGridHandle,
  SelectColumn,
} from "react-data-grid";
import { useLocation } from "react-router-dom";
import { useOverlay } from "@fireback/overlay";
import { useDatatableFiltering } from "../../hooks/useDatatableFiltering";
import { useLocale } from "../../hooks/useLocale";
import { osResources } from "../../hooks/resources";
import { useS } from "../../hooks/useS";
import { type QueryArchiveColumn } from "../../types/QueryArchiveColumn";
import { castColumns } from "../common-data-table/PaginateUtils";
import { useReindexedContent } from "../common-data-table/useReindex";
import { useActions } from "../action-menu/ActionMenu";
import { getQueryErrorString, QueryErrorView } from "../error-view/QueryError";
import { Toast } from "../../hooks/toast";
import { LoadingProgress } from "../loading-progress/LoadingProgress";
import { useLoadingRibbon } from "../loading-ribbon/LoadingRibbonContext";
import { strings } from "../strings/translations";
import { useTableSizingManager } from "./useTableSizingManager";
import { QueryEmptyState } from "./QueryListStatus";
import { ListPaginationFooter } from "./ListPaginationFooter";
import { FILTER_META_KEYS } from "../../hooks/useUdfBrowseQuery";

interface ListState {
  udf: ReturnType<typeof useDatatableFiltering>;
}

// What every emi-generated useXxxBrowseActionQuery hook actually returns
// (see e.g. UserBrowseAction.ts) - the underlying react-query result plus
// isCompleted/response bolted on, always resolving to a GResponse whose
// data.items/data.cursor this component reads directly below (the reindex
// effect, handleScroll's nextCursor). GResponse<any> rather than a specific
// entity's item type since CommonListManager2 itself is entity-agnostic -
// columns/getCellValue already work in terms of `any` rows for the same
// reason.
type BrowseQueryResult = UseQueryResult<GResponse<any> | undefined, unknown>;

// queryHook may return that result directly, or nested under a `query` key -
// see `const q = source.query ? source : { query: source };` below.
type BrowseQuerySource =
  | BrowseQueryResult
  | { query: BrowseQueryResult; [key: string]: unknown };

// Mirrors every emi-generated useXxxAwareDeleteAction hook's shape (see e.g.
// UserAwareDeleteAction.ts's `useUserAwareDeleteAction`) - a mutation hook
// invoked with `{ queryClient }` below, whose mutateAsync deletes the
// selected uniqueIds.
type DeleteHook = (args: { queryClient: QueryClient }) => {
  mutateAsync?: (body: any, options?: any) => Promise<any>;
  [key: string]: unknown;
};

export const CommonListManager = ({
  children,
  columns,
  deleteHook,
  uniqueIdHrefHandler,
  queryHook,
  onRecordsDeleted,
  id,
  help,
}: {
  queryHook: any;
  deleteHook?: any;
  // queryHook: ({ state }: { state: ListState }) => BrowseQuerySource;
  // deleteHook?: DeleteHook;
  columns: QueryArchiveColumn[] | any;
  id?: string;
  uniqueIdHrefHandler?: (id: string) => string;
  onRecordsDeleted?: ({ queryClient }: { queryClient: QueryClient }) => void;
  children?: any;
  /**
   * A short guide for this specific list - a plain string (rendered as
   * preformatted text) or a full React component/element for anything richer
   * (steps, links, screenshots, ...). When set, a "Help" button is added to
   * this list's own action menu - a dedicated "listHelp" menu key, not
   * "commonEntityActions" (the one CommonArchiveManager's own New/Edit
   * buttons register into - reusing that same key here would silently
   * overwrite whichever of the two rendered its action-menu items last,
   * since ActionMenuProvider.setActionMenu replaces a menu key's entire
   * array rather than merging into it). Clicking it opens the content in a
   * modal via useOverlay - see CommonOverlays.tsx's own confirmModal for the
   * same open-a-modal convention.
   */
  help?: string | ReactNode;
}) => {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const { dir } = useLocale();
  const { openModal } = useOverlay();
  const s = useS(strings);

  useActions("listHelp", [
    help
      ? {
          // osResources.about is a heavy filled circle (128x128 viewBox) that reads much
          // bulkier than the other thin-stroke 24x24 action icons once scaled into the
          // same 30x30 box - questionBank is drawn at the same weight/viewBox as e.g.
          // edit/left, so it sits consistently next to them.
          icon: osResources.questionBank,
          label: s.actions.help,
          uniqueActionKey: "help",
          onSelect: () => {
            openModal(
              () => (
                <div className="p-3">
                  {typeof help === "string" ? (
                    <div style={{ whiteSpace: "pre-wrap" }}>{help}</div>
                  ) : (
                    help
                  )}
                </div>
              ),
              { title: s.actions.help },
            );
          },
        }
      : undefined,
  ]);

  const { columnSizes, onColumnWidthsChange } = useTableSizingManager({
    columns,
    tableId: id,
  });

  const delHook =
    deleteHook &&
    deleteHook({
      queryClient,
    });

  const onRecordsDeleted$ = (items: string[]) => {
    if (onRecordsDeleted) {
      onRecordsDeleted({ queryClient });
    }
    deleteViaUniqueIds(items);
    // deleteViaUniqueIds only trims the locally accumulated indexedData.
    // Refetch the underlying list query too, so a since-scrolled-past page
    // doesn't bring the deleted row back on the next cursor advance, same
    // pattern FlatListMode's onRefresh already uses.
    q.query.refetch();
  };

  const udf = useDatatableFiltering({
    urlMask: "",
    submitDelete: delHook?.mutateAsync,
    onRecordsDeleted: onRecordsDeleted$,
  });

  const source = queryHook({ state: { udf } });

  const { indexedData, reindex, deleteViaUniqueIds } = useReindexedContent(udf);

  const q = source.query ? source : { query: source };

  const ref = useRef<DataGridHandle>();

  // Whether the real DataGrid (the `return` at the very end of this
  // component) has ever actually been rendered for this mounted instance -
  // see showedTableBefore below, right where this is read.
  const hasShownTableRef = useRef(false);

  // Accumulate pages as the cursor advances: reindex() appends the new
  // page's rows while udf.queryHash stays the same (cursor is stripped out
  // of it), and resets to just the new rows whenever the actual filters
  // change. See useReindex.tsx.
  //
  // udf.queryHash alone isn't a safe query identity here: it's derived only
  // from filters, so two *different* entity lists both sitting at their
  // default (no filter) state hash to the same "{}" string. When a route
  // change reuses this same CommonListManager instance instead of
  // remounting it (e.g. a generic archive screen keyed by a route param),
  // reindex() then sees a "matching" hash and appends the new entity's rows
  // onto the previous entity's still-accumulated ones instead of resetting -
  // stale rows bleed across routes. Folding pathname into the identity means
  // a route change always looks like a new query, even when the filters
  // happen to collide.
  const listKey = `${pathname}::${udf.queryHash}`;

  // Which listKey `rows` (indexedData) was last actually reconciled for -
  // set only once the effect below has run reindex() against it. Filter/
  // route changes update `filters`/`pathname` (and so `listKey`, and
  // `hasActiveFilters` below) synchronously in the same render they happen,
  // but reindex() only runs afterwards, in this effect - so for one render
  // in between, `rows` can still be holding the *previous* listKey's
  // (possibly zero) rows while everything else already reflects the new
  // one. Comparing against this ref (isReconciled below) is what tells that
  // in-between render apart from a genuinely settled empty result - without
  // it, clearing a filter that had zero matches flashes the full
  // QueryErrorView/QueryEmptyState screen for a frame before the real,
  // unfiltered rows (or lack thereof) arrive.
  const reconciledKeyRef = useRef<string>();

  useEffect(() => {
    if (!q.query.data) return;
    reindex(
      q.query.data?.data?.items || [],
      listKey,
      // reindex's own onKeyChange - fires only on the "this is a genuinely
      // new query" branch (filters/sort changed, or the route did - see
      // useReindex.tsx), never on a plain cursor page appending onto the
      // same query. That's exactly "the udf started from zero" moment: the
      // grid's now showing page 1 of a different result set, so whatever
      // the user had scrolled down to no longer means anything - scroll
      // back to the top rather than leaving them stranded mid-list.
      () => ref.current?.scrollToCell({ idx: 0, rowIdx: 0 }),
    );
    reconciledKeyRef.current = listKey;
    // pathname is also a dep (not just q.query.data): a route change whose
    // new query happens to resolve from react-query's cache with the exact
    // same data reference as the previous route's would otherwise never
    // re-run this effect at all.
  }, [q.query.data, pathname]);

  const isReconciled = reconciledKeyRef.current === listKey;

  const rows: any = indexedData;

  const { setCursor, selection, setSelection, filters, setPageSize } = udf;

  // First-ever fetch (nothing accumulated into indexedData yet): show a
  // spinner instead of an empty/misleading grid. Any *later* fetch (cursor
  // paging in via handleScroll, or a filter/sort change that reindex()
  // already reset rows for) gets the shared top-page ribbon instead -
  // rows already sitting in indexedData stay on screen and the next page
  // just appends once it arrives.
  //
  // Deliberately keyed off rows.length rather than react-query's own
  // isLoading/isFetching split: the emi-generated browse query hook keys
  // its cache on the full query params, cursor included, so paging in a
  // new cursor is a brand new queryKey with no cached data of its own -
  // react-query's isLoading is true for it exactly like a real first load,
  // even though indexedData already has every earlier page's rows sitting
  // in it. Gating on isLoading here would flash the blocking spinner (and
  // hide the already-loaded rows) on every single page scrolled in.
  //
  // `!isReconciled` also holds this true across the one render between a
  // filter/route change and reindex() actually catching up with it (see
  // isReconciled's own doc comment above) - without it, that render would
  // fall through to the empty-state branch below with a stale rows.length
  // === 0 that has nothing to do with the *new* filters, flashing "no
  // records" every time a filter that had zero matches gets cleared.
  const isFirstLoading =
    rows.length === 0 && (q.query.isFetching || !isReconciled);
  const isSubsequentFetching = rows.length > 0 && q.query.isFetching;

  const ribbon = useLoadingRibbon();
  const ribbonKey = useRef(`common-list-manager:${id || Math.random()}`).current;

  useEffect(() => {
    if (isSubsequentFetching) {
      return ribbon.start(ribbonKey);
    }
    ribbon.stop(ribbonKey);
  }, [isSubsequentFetching, ribbonKey]);

  // The generated fetch layer deliberately *resolves* rather than rejects a
  // request that came back with a backend-returned error body (see
  // hooks/api.ts's own doc comments on mutationErrorsToFormik/httpErrorHanlder) -
  // so react-query's isError/query.data?.error (what QueryErrorView itself
  // checks) never fires for a raw HTTP failure with no parsed error envelope
  // either (e.g. `fireback start --unstable`'s plain 500s, or any proxy/gateway
  // failure upstream of the app). The one signal that's always right is the
  // raw HTTP response itself - every emi-generated browse hook exposes it as
  // its own `response` field alongside the react-query result (see e.g.
  // WalletCurrencyBrowseAction.ts's useWalletCurrencyBrowseActionQuery) - a
  // non-2xx status there means the fetch actually failed, whatever shape (or
  // lack of one) its body came back in.
  // A genuinely thrown/rejected fetch (offline, CORS, DNS, ...) is the other
  // half of "an error happened" - resp itself never updates for that case
  // (fetchx() throws before the browse hook's own setResponse(x.response)
  // ever runs), but react-query's isError/error do, exactly as designed. So
  // "did the last fetch fail" is either signal, not just the raw-response one.
  const resp: any = (q as any).response ?? (q.query as any).response;
  const lastFetchFailed = (!!resp && resp.ok === false) || !!q.query.isError;
  const lastErrorMessage = lastFetchFailed
    ? getQueryErrorString(s, q.query as any) ||
      (resp && !resp.ok ? `${s.table.errorTitle} (${resp.status})` : s.table.errorTitle)
    : undefined;

  // A page fetch failing once rows are already on screen (cursor paging in,
  // or a background refetch) never hides the grid the way a first-load
  // error does (see the rows.length === 0 branch below) - the user already
  // has data in front of them, and losing it because one more page didn't
  // load would be worse than just telling them it failed and leaving
  // everything as-is. They get two cues: this toast (transient), and the
  // ListPaginationFooter below the grid (persistent, with its own Retry
  // button) - both driven off the same lastFetchFailed/resp so they always
  // agree. Keyed on `resp`'s identity and errorUpdatedAt, not lastFetchFailed
  // itself - the browse hook calls setResponse(...) with a new object on
  // every resolved fetch, and react-query bumps errorUpdatedAt on every
  // newly-thrown one, so this fires exactly once per completed fetch either
  // way rather than on every unrelated re-render while a past failure lingers.
  useEffect(() => {
    if (rows.length > 0 && lastFetchFailed) {
      Toast(lastErrorMessage!, { type: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resp, (q.query as any).errorUpdatedAt]);

  const cols = useMemo(() => {
    return [
      SelectColumn,
      ...castColumns(
        columns,
        (field, value) => {
          udf.setFilter({ [field]: value });
        },
        udf,
        columnSizes,
        uniqueIdHrefHandler,
        pathname,
      ),
    ];
  }, [columns, columnSizes]);

  // Bug fix: handleScroll used to fire the next-page fetch off of *any*
  // onScroll event that happened to read "within 300px of the bottom", with
  // no check that the container had actually been scrolled any further down
  // since the last time this ran. Appending a freshly fetched page's rows
  // below the fold doesn't move `scrollTop` on its own, but react-data-grid
  // still emits its own onScroll events as part of recalculating the
  // viewport after `rows` grows - each one re-read as "still at the bottom"
  // (nothing moved) and requested yet another page, immediately, with no
  // further input from the user: a runaway fetch-append-refire loop that
  // only ever stopped once the server ran out of pages. Tracking the last
  // seen scrollTop and requiring it to have actually increased makes "at
  // the bottom" only ever trigger a fetch on a genuine additional scroll,
  // the same way a real infinite scroll is supposed to behave - a re-fired
  // event reporting the same position it already handled is now a no-op
  // instead of another page.
  const lastScrollTopRef = useRef(0);

  async function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop } = event.currentTarget;
    const scrolledDown = scrollTop > lastScrollTopRef.current;
    lastScrollTopRef.current = scrollTop;
    if (!scrolledDown) return;

    if (q.query.isLoading || !isAtBottom(event)) return;

    // GResponse.next.cursor is "" once the server has no more rows to give.
    const nextCursor = q.query.data?.data.cursor;
    if (nextCursor) {
      setCursor(nextCursor);
    }
  }

  // Bug fix: this used to call debounce(...) fresh on every render, with no
  // useMemo/useCallback wrapping it. lodash's debounce closes over a
  // pending-timer + last-call state that's the whole point of debouncing -
  // recreating it every render throws that state away, so a resize drag
  // (which fires onColumnResize repeatedly, and this component re-renders
  // on plenty of things unrelated to resizing - query state, the loading
  // ribbon, toasts) could land consecutive calls on different debounce
  // instances that never see each other, calling onColumnWidthsChange (and
  // so submitTableSizing/localStorage.setItem in useTableSizingManager) far
  // more often than the intended "once per 300ms of no further resizing."
  // colsRef (kept current every render below) lets the debounced closure
  // itself stay a single stable instance across renders while still always
  // reading the latest columns - putting `cols` in the useMemo deps instead
  // would recreate (and drop any pending call from) the debounced function
  // on every column-size change, defeating the fix the same way the
  // original bug did.
  const colsRef = useRef(cols);
  colsRef.current = cols;
  const onColumnResize = useMemo(
    () =>
      debounce((column: CalculatedColumn<any, unknown>, width: number) => {
        const newSizes = colsRef.current.map((col: any) => {
          return {
            columnName: col.key,
            width: col.name === column.name ? width : col.width,
          };
        });

        onColumnWidthsChange(newSizes);
      }, 300),
    [onColumnWidthsChange],
  );

  // Note: BooleanTypeProvider (dx-react-grid) and `children` are kept
  // defined for parity with the previous PaginateTable2-based structure,
  // but were never actually rendered there either (PaginateTable2 never
  // rendered its `children` prop) - rendering DataTypeProvider standalone
  // (without a dx-react-grid Grid/PluginHost ancestor) throws at runtime.

  void children;

  // Once the real table has been shown once, it stays - a filter/sort
  // change (or a fetch that fails, or one that genuinely comes back with
  // zero matches) never swaps it back out for the spinner or the full
  // QueryErrorView/QueryEmptyState screen below, even mid-render while
  // `isFirstLoading`/the empty check below would otherwise say to. Losing
  // the mounted DataGrid that way loses whatever the user was doing with it
  // (focus, an in-progress cell edit, scroll position) for what's often
  // just a one-frame blip (see isReconciled's own doc comment) - and even
  // when it isn't a blip (a filter that legitimately matches nothing), the
  // table itself - headers, filter row, ListPaginationFooter's Retry - is
  // still the more useful thing on screen than a blank replacement, exactly
  // the same reasoning "empty result with filters active" below already
  // used to keep the grid up instead of taking this same branch.
  //
  // Mutated directly during render (not via useState) - it only ever flips
  // false -> true once, and needs to take effect for *this* render's return
  // below, not one render later.
  const showedTableBefore = hasShownTableRef.current;

  if (!showedTableBefore && isFirstLoading) {
    return <LoadingProgress message={s.components.loading} />;
  }

  // Whether the user has actually typed/picked a filter, as opposed to
  // udf.filters just carrying its usual pagination/sort bookkeeping keys
  // (itemsPerPage, cursor, sort, sorting - see FILTER_META_KEYS' own doc
  // comment) - the same distinction buildUdfBrowseQs already makes when
  // deciding what counts as a real column filter to send the server.
  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) =>
      !FILTER_META_KEYS.has(key) &&
      value !== undefined &&
      value !== null &&
      value !== "",
  );

  // Only the "nothing to show yet, and nothing the user did explains why"
  // case (a real empty result with no filters applied, or a first-load
  // failure with no rows accumulated) goes through QueryErrorView/
  // QueryEmptyState and hides the grid entirely - once there are rows on
  // screen, an error never reaches this branch at all (see the toast/footer
  // above and below instead), so the grid is never hidden by a failed page
  // fetch. A genuinely empty result *with* filters active falls through to
  // the grid below instead (still zero rows, but the table/header/filter
  // row and the footer's Retry stay visible and usable) - "no records
  // exist at all" and "no records match what you filtered for" read very
  // differently, and only the former should look like the list is broken/
  // empty. And per showedTableBefore above, none of this applies at all
  // once the table has already been shown once.
  //
  // QueryErrorView on its own can't see a raw HTTP failure any better than
  // the toast effect above could (see lastFetchFailed's own doc comment) -
  // errorAwareQuery patches isError/error onto q.query only for that case,
  // in the exact shape getQueryErrorString already knows how to read
  // (query.error.error.message), so QueryErrorView renders its normal error
  // box (with lastErrorMessage and a working Retry) instead of silently
  // falling through to "no records", which would misreport a failure as an
  // empty result. A failure always takes over this branch regardless of
  // filters - there's nothing useful to show in an empty grid when the
  // fetch itself didn't succeed.
  if (!showedTableBefore && rows.length === 0 && (lastFetchFailed || !hasActiveFilters)) {
    const errorAwareQuery =
      lastFetchFailed && !q.query.isError
        ? { ...q.query, isError: true, error: { error: { message: lastErrorMessage } } }
        : q.query;
    return (
      <QueryErrorView query={errorAwareQuery}>
        <QueryEmptyState onReload={() => q.query.refetch()} />
      </QueryErrorView>
    );
  }

  hasShownTableRef.current = true;

  return (
    // A plain flex column filling whatever height the parent gives this
    // component (same 100% the lone DataGrid used to claim via its own
    // "calc(100% - 2px)") - DataGrid takes flex:1/minHeight:0 (shrinks to
    // make room instead of overflowing) and the footer sizes to its own
    // content below it, so adding the footer never pushes anything out of
    // view or leaves it clipped against a parent that still thinks only a
    // full-height grid lives in here.
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <DataGrid
        columns={cols}
        onScroll={handleScroll}
        onColumnResize={onColumnResize}
        direction={dir as any}
        onSelectedRowsChange={(value) => {
          setSelection(Array.from(value));
        }}
        selectedRows={new Set(selection)}
        ref={ref}
        rows={rows}
        rowKeyGetter={(item) => item.uniqueId}
        style={{ flex: "1 1 auto", minHeight: 0, margin: "1px -14px" }}
      />
      <ListPaginationFooter
        loadedCount={rows.length}
        totalCount={q.query.data?.data?.totalItems ?? undefined}
        failed={lastFetchFailed}
        errorMessage={lastErrorMessage}
        retrying={q.query.isFetching}
        onRetry={() => q.query.refetch()}
        pageSize={filters.itemsPerPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

function isAtBottom({ currentTarget }: React.UIEvent<HTMLDivElement>): boolean {
  return (
    currentTarget.scrollTop + 300 >=
    currentTarget.scrollHeight - currentTarget.clientHeight
  );
}
