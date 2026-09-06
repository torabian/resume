// @ts-nocheck

/**
 * VITE_TARGET_APP is an environment variables that you can
 * use for spliting app into a different product.
 * when you import App.tsx from an specific project,
 * only routes and modules defined there will be added to your
 * pack. This is similar to C preprocessors idea.
 */
import React from "react";
import ReactDOM from "react-dom/client";

// #v-ifdef VITE_TARGET_APP == 'manage'
import App from "./apps/manage/App";
// #v-endif

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
