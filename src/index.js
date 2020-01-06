import "./styles/reset.scss";
import "./styles/index.scss";
import "./styles/graph.scss";

import { makeGraph } from './scripts/graph';

window.addEventListener("DOMContentLoaded", () => {
  makeGraph();
});