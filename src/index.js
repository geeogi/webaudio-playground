import React from "react";
import { render } from "react-snapshot";
import { Base } from "xrc";
import App from "./App";
import { Theme } from "./assets/theme";
import "./index.css";

const rootElement = document.getElementById("root");

render(
  <Base theme={Theme}>
    <App />
  </Base>,
  rootElement
);
