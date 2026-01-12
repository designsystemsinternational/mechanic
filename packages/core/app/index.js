import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./index.module.css";

const root = document.getElementById("root");

createRoot(root).render(<App />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
