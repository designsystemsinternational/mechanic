import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.js";
import "./index.module.css";

const root = document.getElementById("root");
const app = (
  <BrowserRouter basename={BASENAME}>
    <App />
  </BrowserRouter>
);
render(app, root);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
