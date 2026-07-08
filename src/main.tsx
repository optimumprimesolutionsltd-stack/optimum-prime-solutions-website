import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// @ts-ignore: CSS imported as a side effect without type declarations
import "./index.css";
import App from "./App";

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
