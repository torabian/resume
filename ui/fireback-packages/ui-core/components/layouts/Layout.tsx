import { Outlet, useLocation } from "react-router-dom";
import { type MenuItem } from "../../types/MenuItem";
import { ActionMenuManager } from "../action-menu/ActionMenu";
import Navbar from "./Navbar";

// We do not compile the pull to refresh for desktop and web
////// # if env.TARGET_TYPE == 'mobile' && !env.DISABLE_PULL_TO_REFRESH
import classNames from "classnames";
import { useContext } from "react";
import { useUiState } from "../../hooks/uiStateContext";
import { ReactiveSearchContext } from "../reactive-search/ReactiveSearchContext";
import { ReactiveSearchResult } from "../reactive-search/ReactiveSearchResult";
// @ts-ignore
function ContentSection({ children }: any) {
  // Bug fix: React Router does NOT remount a route's element just because
  // its own path *params* changed (e.g. /roles/abc -> /roles/def matching
  // the exact same <Route path=":uniqueId">, or a generic archive screen
  // keyed by an :entityName param - see CommonListManager.tsx's own comment
  // on this same issue) - it's the same element type at the same position
  // in the tree, so React reuses the existing component instance and just
  // re-renders it with new params/query results. Every bit of *local* state
  // that instance built up - useDatatableFiltering's filters (CommonListManager),
  // formik's touchedData/values (CommonEntityManager), plain useState in any
  // screen - survives right along with it, which is exactly the "filters
  // didn't reset switching lists" / "form didn't update switching :id" bugs
  // this fixes. Keying the Outlet by pathname forces React to tear down and
  // rebuild the whole matched subtree on any real navigation - fresh state
  // every time - while deliberately excluding the query string, so
  // CommonListManager's own filter changes (pushed via router.push("?...")
  // - same pathname, new search) don't get treated as a new page and lose
  // the in-progress infinite-scroll/filter state they're supposed to keep.
  const { pathname } = useLocation();
  return (
    <>
      <Outlet key={pathname} />
      {children}
    </>
  );
}
// /// # else
// // @ts-ignore
// function ContentSection({ children }: any) {
//   const { pathname } = useLocation();
//   return (
//     <>
//       <Outlet key={pathname} />
//       {children}
//     </>
//   );
// }
// /// # endif

const Layout = ({
  children,
  navbarMenu,
  sidebarMenu,
  routerId,
}: {
  children?: React.ReactNode;
  sidebarMenu?: MenuItem | MenuItem[];
  navbarMenu?: MenuItem;
  routerId?: string;
}) => {
  const { result, phrase, reset } = useContext(ReactiveSearchContext);

  const { sidebarVisible, toggleSidebar: toggleSidebar$ } = useUiState();

  const onSearch = phrase.length > 0;

  return (
    <>
      <div style={{ display: "flex", width: "100%" }}>
        <div
          className={classNames(
            "sidebar-overlay",
            sidebarVisible ? "open" : "",
          )}
          onClick={(e) => {
            toggleSidebar$();
            e.stopPropagation();
          }}
        ></div>
        <div style={{ width: "100%", flex: 1 }}>
          <Navbar routerId={routerId} menu={navbarMenu} />
          <div className="content-section">
            {onSearch ? (
              <div className="content-container">
                <ReactiveSearchResult
                  onComplete={() => reset()}
                  result={result}
                />
              </div>
            ) : null}
            <div
              className="content-container"
              style={{ visibility: !onSearch ? undefined : "hidden" }}
            >
              <ContentSection>{children}</ContentSection>
            </div>
          </div>
        </div>
      </div>
      <span className="general-action-menu mobile-view">
        <ActionMenuManager />
      </span>
    </>
  );
};

export default Layout;
