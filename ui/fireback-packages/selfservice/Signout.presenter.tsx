import { useAuthentication } from "@fireback/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  SignoutActionReq,
  useSignoutAction,
} from "@fireback/selfservice/sdk/abac/SignoutAction";
import { readUrlParam } from "./auth.common";

/**
 * Everything a signout needs to do, in order:
 *
 * 1. Tell the backend, so the passport/token this session was using is
 *    actually invalidated there too - `useAuthentication().signout()` by
 *    itself is local-only (see its own doc comment) and would otherwise
 *    leave a still-valid token floating around server-side.
 * 2. Drop every cached query response - `queryClient.clear()`, not just the
 *    workspace list CurrentUser.tsx narrowly resets - so a different user
 *    signing in on the same tab right after never briefly renders with the
 *    previous user's cached data before their own requests land.
 * 3. Clear the local session + selected workspace (`signout()`), which also
 *    flips `isAuthenticated` false - App.tsx's own session check reacts to
 *    that by swapping from the authenticated route table to the public one,
 *    whose catch-all sends the browser to /selfservice/welcome. No explicit
 *    navigate is needed here for that reason, but see the ReactNativeWebView
 *    case below.
 * 4. Tell an embedding React Native WebView it happened, mirroring the
 *    postMessage useCompleteAuth's onComplete sends on sign-*in* - a wrapping
 *    native app has no other way to observe that the session it was handed
 *    is now gone.
 * 5. Send the browser back to wherever it came from, if this page was
 *    reached via a `?redirect=` param - the shape `useAuthentication()`'s
 *    `signoutRemotely()` (an app that only imports this lib as a dependency,
 *    rather than being self-service itself) sends the browser here with.
 *    Nothing to do here when it's absent - a visit from within self-service
 *    itself (e.g. UserPassports' own signout button) has nowhere else to go
 *    back to, and App.tsx's own authenticated-vs-public check already lands
 *    it on /selfservice/welcome once `signout()` below clears the session.
 *
 * The backend call is best-effort: a network blip on step 1 shouldn't strand
 * someone signed in locally with no way to leave, so steps 2-5 always run
 * once the request settles, regardless of whether it succeeded.
 */
export const usePresenter = () => {
  const { signout } = useAuthentication();
  const queryClient = useQueryClient();
  const { mutate } = useSignoutAction();
  const started = useRef(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (started.current) {
      return;
    }
    started.current = true;

    // Always attempted, whether or not self-service itself sees a local
    // session: reached via `signoutRemotely()` (an importing app, with its
    // own separate session storage), this browser may still be carrying a
    // signed cookie only the backend can invalidate, and `signout()`/
    // `queryClient.clear()` below are harmless no-ops when there's nothing
    // local to clear in the first place.
    const finish = () => {
      queryClient.clear();
      signout();

      if ((window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView.postMessage(
          JSON.stringify({ signedOut: true }),
        );
      }

      setDone(true);

      const redirectUrl = readUrlParam("redirect");
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    };

    mutate(new SignoutActionReq(), { onSettled: finish });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { done };
};
