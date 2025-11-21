import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.js";
import "./index.module.css";

const root = document.getElementById("root");
const app = (
  <BrowserRouter basename={BASENAME}>
    <App />
  </BrowserRouter>
);

createRoot(root).render(app);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
