import "./CommonSingleManager.css";
import { useEffect } from "react";
import { useCommonEntityManager } from "../../hooks/useCommonEntityManager";
import { KeyboardAction } from "../../hooks/useExportTools";
import { useBackButton, useEditAction } from "../action-menu/ActionMenu";
import { getQueryErrorString } from "../error-view/QueryError";
import { Toast } from "../../hooks/toast";
import { LoadingProgress } from "../loading-progress/LoadingProgress";
import { useS } from "../../hooks/useS";
import { strings } from "../strings/translations";

export const CommonSingleManager = ({
  children,
  getSingleHook,
  editEntityHandler,
  noBack,
  disableOnGetFailed,
}: {
  getSingleHook?: any;
  children?: React.ReactNode;
  editEntityHandler?: (data: { locale: string; router: any }) => void;
  noBack?: boolean;
  disableOnGetFailed?: boolean;
}) => {
  const { router, locale } = useCommonEntityManager<Partial<any>>({});
  const s = useS(strings);

  useEditAction(
    editEntityHandler ? () => editEntityHandler({ locale, router }) : undefined,
    KeyboardAction.EditEntity,
  );

  useBackButton(
    noBack !== true ? () => router.goBack() : null,
    KeyboardAction.CommonBack,
  );

  // getSingleHook is the raw emi-generated useXxxGetActionQuery result
  // itself (e.g. WalletCurrencySingleScreen.tsx's own getSingleHook, passed
  // straight through) - it has no nested `.query` the way CommonListManager's
  // queryHook result sometimes does, so every read below is off
  // getSingleHook directly.
  //
  // Same "resolve, don't reject" gap CommonListManager works around (see its
  // own doc comment on lastFetchFailed): a backend-returned or raw-HTTP
  // failure still resolves the query rather than rejecting it, so the raw
  // response's own `.ok`/`.status` is the one signal that's always right,
  // alongside react-query's isError for a genuinely thrown/rejected fetch
  // (offline, CORS, ...).
  const resp: any = getSingleHook?.response;
  const lastFetchFailed = !!getSingleHook && (
    (!!resp && resp.ok === false) || !!getSingleHook.isError
  );
  const lastErrorMessage = lastFetchFailed
    ? getQueryErrorString(s, getSingleHook) ||
      (resp && !resp.ok ? `${s.table.errorTitle} (${resp.status})` : s.table.errorTitle)
    : undefined;

  // Always toast on failure, regardless of disableOnGetFailed - that prop
  // only controls whether `children` still renders with whatever (possibly
  // stale) data it has, not whether the user gets told the load failed.
  // Keyed on getSingleHook.dataUpdatedAt/errorUpdatedAt so this fires once
  // per completed fetch (first load or a manual reload), not on every
  // unrelated re-render while a past failure lingers.
  useEffect(() => {
    if (lastFetchFailed) {
      Toast(lastErrorMessage!, { type: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resp, getSingleHook?.errorUpdatedAt]);

  // First-ever fetch (no data at all yet): block on a spinner instead of
  // rendering `children` against data that doesn't exist yet.
  if (getSingleHook?.isLoading) {
    return <LoadingProgress message={s.components.loading} />;
  }

  return (
    <>
      {lastFetchFailed && (
        <div className="single-manager-error-banner">
          <span className="single-manager-error-banner__message">
            {lastErrorMessage}
          </span>
          <button
            type="button"
            className="single-manager-error-banner__reload"
            onClick={() => getSingleHook.refetch()}
            disabled={getSingleHook?.isFetching}
          >
            {s.components.retry}
          </button>
        </div>
      )}

      {disableOnGetFailed === true && lastFetchFailed ? null : <>{children}</>}
    </>
  );
};
