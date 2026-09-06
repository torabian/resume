import { AuthLoader } from "@fireback/ui-core/components/auth-loader/AuthLoader";
import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
import { usePresenter } from "./Signout.presenter";

/**
 * Visiting this route signs the current session out (see Signout.presenter's
 * doc comment for the full list of steps) and shows a brief loading state
 * while that happens. There's nothing to click - once `signout()` clears the
 * session, App.tsx's own authenticated-vs-public check swaps the route table
 * out from under this screen and lands on /selfservice/welcome on its own,
 * so `done` only guards against rendering the loader forever if that ever
 * doesn't happen (e.g. this screen mounted standalone, outside that App.tsx).
 */
export const SignoutScreen = () => {
  const { done } = usePresenter();
  const s = useS(strings);

  return (
    <div className="signin-form-container">
      <h1>{s.signout}</h1>
      {done ? <p>{s.signedOut}</p> : <AuthLoader />}
    </div>
  );
};
