function makeGraph() {
  let margin = { top: 40, right: 40, bottom: 40, left: 40 };
  let docGraphWidth = document.getElementById("graph-container").clientWidth;
  let docGraphHeight = document.getElementById("graph-container").clientHeight;

  let width = docGraphWidth - margin.left - margin.right;
  let height = docGraphHeight - margin.top - margin.bottom;

  let svg = d3.select('#graph-container').append("svg")
      .attr("width", docGraphWidth)
      .attr("height", docGraphHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

module.exports = {
  makeGraph
};