import { useS } from "../../hooks/useS";
import { useApiOptions } from "../../hooks/useApiOptions";
import { useState } from "react";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { FormButton } from "../forms/form-button/FormButton";
import { strings } from "../strings/translations";

// Appends "(<remote>)" only when params.remote actually has a value -
// callers outside this file's own QueryErrorView (CommonListManager,
// CommonSingleManager, CommonEntityManager's mutationErrorMessage, ...) call
// getQueryErrorString(s, hook) with no params/no remote at all, and
// `+ "(" + undefined + ")"` was rendering literally as "...(undefined)" in
// the resulting toast/banner text.
function withRemoteSuffix(message: string, remote: unknown): string {
  return remote ? `${message}(${remote})` : message;
}

export function getQueryErrorString(
  s: typeof strings,
  query: UseQueryResult<any, any> | UseMutationResult<any, any>,
  params: any = {},
): string | null {
  // The generated fetch layer resolves rather than rejects a backend-
  // returned failure (see hooks/api.ts's own doc comments) - so a raw,
  // non-2xx HTTP response with no parsed error envelope at all (a plain
  // 500 with an empty body, say) never sets isError and was never reported
  // here, in every one of this function's callers, until this check was
  // centralized. Every emi-generated query/mutation hook exposes the raw
  // response as its own `response` field alongside the react-query result
  // (see e.g. WalletCurrencyBrowseAction.ts) - checked ahead of isError
  // since it's the more concrete signal when both happen to be set.
  const resp = (query as any)?.response;
  if (resp && resp.ok === false) {
    return `${s.table.errorTitle} (${resp.status})`;
  }

  if (query.isError) {
    if (query.error?.status === 404) {
      return withRemoteSuffix(s.notfound, params.remote);
    }
    if (query.error.message === "Failed to fetch") {
      return withRemoteSuffix(s.networkError, params.remote);
    }

    if (query.error?.error?.messageTranslated) {
      return query.error?.error?.messageTranslated;
    }
    if (query.error?.error?.message) {
      return query.error?.error?.message;
    }

    let unknownStr = query.error?.toString();

    if ((unknownStr + "").includes("object Object")) {
      unknownStr = s.components.unknownError;
    }

    return unknownStr;
  }

  if (query.data?.error?.messageTranslated) {
    return query.data?.error?.messageTranslated;
  }

  return null;
}

export function QueryErrorView({
  query,
  children,
}: {
  query: UseQueryResult<any, any> | UseMutationResult<any, any> | any;
  children?: React.ReactNode;
}) {
  const s = useS(strings);
  const options = useApiOptions();
  // Dev-only "the app is pointed at the wrong host:port" helper - local to
  // this component now (nothing else ever read it from the old
  // RemoteQueryContext either, and it never actually affected the generated
  // SDK's own requests, only this component's own display below).
  const [overrideRemoteUrl, setOverrideRemoteUrl] = useState<
    string | undefined
  >(undefined);

  let showAutoAdjustTheUrl = false;
  let port = "80";

  try {
    if (options?.prefix) {
      const url = new URL(options?.prefix);
      port = url.port || (url.protocol === "https:" ? "443" : "80");
      showAutoAdjustTheUrl =
        (location.host.includes("192.168") ||
          location.host.includes("127.0")) &&
        query.error?.message?.includes("Failed to fetch");
    }
  } catch (err) {}

  const autoAdjust = () => {
    setOverrideRemoteUrl("http://" + location.hostname + ":" + port + "/");
  };

  if (!query) {
    return null;
  }

  const rawResponseFailed = query.response && query.response.ok === false;
  const hasError =
    query.isError || query.data?.error?.messageTranslated || rawResponseFailed;

  return (
    <>
      {hasError && (
        <div className="basic-error-box fadein">
          {getQueryErrorString(s, query, { remote: options.prefix }) || ""}
          {showAutoAdjustTheUrl && (
            <button className="btn btn-sm btn-secondary" onClick={autoAdjust}>
              {s.components.autoReroute}
            </button>
          )}
          {overrideRemoteUrl && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setOverrideRemoteUrl(undefined)}
            >
              {s.components.reset}
            </button>
          )}
          <ul>
            {(query.error?.error?.errors || []).map((item) => {
              return (
                <li key={item.location}>
                  {item.messageTranslated || item.message} ({item.location})
                </li>
              );
            })}
          </ul>
          {query.refetch && (
            <FormButton onClick={query.refetch}>
              {s.components.retry}
            </FormButton>
          )}
        </div>
      )}
      {/* Now this is to debate, if there is an error, and no data, then hide it. */}
      {(!query.isError && !rawResponseFailed) || (query as any).isPreviousData
        ? children
        : null}
    </>
  );
}
