/* eslint-disable react/react-in-jsx-scope */
import { render } from "preact";

import { App } from "./app";

import "./index.css";

render(<App />, document.getElementById("app") as HTMLElement);
