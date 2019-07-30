import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Base } from "xrc";
import { Theme } from "./assets/theme";

const rootElement = document.getElementById("root");

const renderMethod = !!module.hot ? ReactDOM.render : ReactDOM.hydrate;

renderMethod(
  <Base theme={Theme}>
    <App />
  </Base>,
  rootElement
);
