function makeGraph() {
  let margin = { top: 50, right: 50, bottom: 50, left: 50 };
  let docGraphWidth = document.getElementById("graph-container").clientWidth;
  let docGraphHeight = document.getElementById("graph-container").clientHeight;

  let width = docGraphWidth - margin.left - margin.right;
  let height = docGraphHeight - margin.top - margin.bottom;
}

module.exports = {
  makeGraph
};