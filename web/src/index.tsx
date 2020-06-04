import React from "react";
import { render } from "react-dom";
import App from "./App";

const rootComponent = document.querySelector("#root");

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootComponent
);
