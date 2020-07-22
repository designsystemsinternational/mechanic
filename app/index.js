import React, { Component } from "react";
import { render, hydrate } from "react-dom";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { isClient } from "./utils";
import { BrowserRouter, StaticRouter } from "react-router-dom";
import App from "./App.js";
import "./index.css";

if (isClient) {
  const root = document.getElementById("root");
  const app = (
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  );
  if (root.hasChildNodes()) {
    hydrate(app, root);
  } else {
    render(app, root);
  }
}

export default () => {
  HelmetProvider.canUseDOM = false;
  const ctx = {};
  const html = renderToString(
    <HelmetProvider context={ctx}>
      <StaticRouter location={"/"} context={ctx}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
  const { helmet } = ctx;
  return [
    html,
    helmet.title.toString() +
      helmet.link.toString() +
      helmet.script.toString() +
      helmet.meta.toString()
  ];
};
