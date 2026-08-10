import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// @ts-ignore: CSS imported as a side effect without type declarations
import "./index.css";
import App from "./App";

// Drop the SEO head tags baked in by prerender.mjs before React renders its own.
//
// React 19 hoists <title>, <meta> and <link> rendered anywhere in the tree into
// <head> itself. It has no way to adopt DOM nodes it did not create, so the
// prerendered tags simply survive alongside React's — every page ended up
// serving two <title>, two meta descriptions and two canonicals once JavaScript
// ran, which Bing reports as "More than one title tag".
//
// The prerendered copies have to be there for crawlers that never run
// JavaScript, so they are tagged at build time and removed here instead. Runs
// before render, so there is no window in which both sets exist.
for (const el of document.head.querySelectorAll("[data-prerendered-seo]")) {
  el.remove();
}

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// Dispatch custom event to trigger prerendering after a short delay
// to ensure dynamic content is loaded
setTimeout(() => {
  document.dispatchEvent(new Event("custom-render-trigger"));
}, 1000);
