import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./globals.css";

function routerBase(): string {
  try {
    const cfg = (window as any).SITE_CONFIG || {};
    const base = new URL(cfg.baseUrl || "/", window.location.origin).pathname.replace(/\/+$/, "");
    if (base && window.location.pathname.startsWith(base)) return base;
  } catch {
    /* fall through */
  }
  return "/";
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={routerBase()}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
