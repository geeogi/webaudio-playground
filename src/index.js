import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Base } from "xrc";

const rootElement = document.getElementById("root");

const renderMethod = !!module.hot ? ReactDOM.render : ReactDOM.hydrate;

renderMethod(
  <Base>
    <App />
  </Base>,
  rootElement
);
