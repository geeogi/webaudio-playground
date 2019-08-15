import React from "react";
import { render } from "react-dom";
import { Base } from "xrc";
import App from "./App";
import { Theme } from "./assets/theme";
import "./index.css";

const rootElement = document.getElementById("root");

console.log(
  [
    "Created by @geeogi.",
    "Source code: https://github.com/geeogi/webaudio-playground"
  ].join(" ")
);

render(
  <Base theme={Theme}>
    <App />
  </Base>,
  rootElement
);
