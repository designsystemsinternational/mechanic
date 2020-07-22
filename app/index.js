import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App.js";
import "./index.css";

const root = document.getElementById("root");
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
render(app, root);
