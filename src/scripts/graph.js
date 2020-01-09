const margin = { top: 50, right: 50, bottom: 50, left: 50 };

function resizingFunction(svg) {
  let width = parseInt(svg.style('width'), 10);
  let height = parseInt(svg.style('height'), 10);
  let aspectRatio = width / height;

  svg.attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMin')
    .call(resize);

  d3.select(window).on('resize', resize);

  function resize() {
    let docGraphWidth = document.getElementById("graph-container").clientWidth;

    svg.attr('width', docGraphWidth);
    svg.attr('height', Math.round(docGraphWidth / aspectRatio));
    document.getElementById("graph-container").style.height = `${Math.round(docGraphWidth / aspectRatio)}px`;
  }
}

export function makeGraph(data, update) {
  // document.getElementById("graph-container").style.height = "75vh";

  let docGraphWidth = document.getElementById("graph-container").clientWidth;
  let docGraphHeight = document.getElementById("graph-container").clientHeight;

  let width = docGraphWidth - margin.left - margin.right;
  let height = docGraphHeight - margin.top - margin.bottom;

  // Margin convention and make the graph resize as the window resizes
  // From now on, all subsequent code can just use 'width' and 'height'
  let svg = d3.select('#graph-container').append("svg")
    .attr('width', docGraphWidth)
    .attr('height', docGraphHeight)
    .call(resizingFunction);

  let g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let linesContainer = g.append('g')
    .attr('class', 'lines-container');

  let xScale = d3.scaleLinear()
    .domain([0, 82])
    .range([0, width]);

  let bisectGame = d3.bisector(d => d.game).left

  // change these two to g.append if want axis in front of the lines
  // make the x axis group
  linesContainer.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr('class', "x-axis")
    .transition()
    .duration(750)
    .call(d3.axisBottom(xScale));

  // make the y axis group
  linesContainer.append("g")
    .attr('class', "y-axis")
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 10)
    .attr("dy", "0.8em")
    .text("Total");

  // --------- hover info ---------

  let hoverInfoContainer = svg.append("g")
		.attr("class", "hover-info-container")
		.style("display", "none");

  hoverInfoContainer
    .append("line")
    .attr("class", "hover-line")
    .style("stroke", "#ff0000")
		.attr("stroke-width", 1)
		.style("shape-rendering", "crispEdges")
		.style("opacity", 0.5)
		.attr("y1", (-1 * height))
		.attr("y2", 0);

  hoverInfoContainer
    .append("text")
    .attr("class", "hover-game")
		.attr("text-anchor", "middle")
		.attr("font-size", 17);

	let hoverOverlay = svg.append("rect")
		.attr("class", "hover-overlay")
		.attr("x", margin.left)
		.attr("width", docGraphWidth - margin.right)
		.attr("height", docGraphHeight - margin.bottom)

  updateGraph(data);
}

export function updateGraph(data) {
  let svg = d3.selectAll('svg');

  let docGraphWidth = document.getElementById("graph-container").clientWidth;
  let docGraphHeight = document.getElementById("graph-container").clientHeight;

  let width = docGraphWidth - margin.left - margin.right;
  let height = docGraphHeight - margin.top - margin.bottom;

  let maxTotal = Math.max(...data.map(obj => {
    return Math.max(...Object.values(obj.values).map(player => {
      return player.total;
    }));
  }));

  let xScale = d3.scaleLinear()
    .domain([0, 82])
    .range([0, width]);

  let yScale = d3.scaleLinear()
    .domain([0, maxTotal + 20])
    .range([height, 0]);

  svg.selectAll(".y-axis")
    .transition()
    .duration(750)
    .call(d3.axisLeft(yScale));

  let line = d3.line()
    .x(function (d) { return xScale(d.game); })
    .y(function (d) { return yScale(d.total); })
    .curve(d3.curveLinear);

  let color = d3.scaleOrdinal(d3.schemeCategory10);

  let linesContainer = svg.selectAll('.lines-container');
  linesContainer.selectAll(`.dot-group`).remove();
  linesContainer.selectAll(`.dot-container`).remove();
  linesContainer.selectAll(`.dot`).remove();

  let paths = linesContainer.selectAll(`.line`).data(data);

  paths.exit().remove();

  // for each object (player) in the data array, make the lines
  // make the group element for the line
  // put the actual line on the screen
  paths
    .enter()
    .append("g")
    .append("path")
    .attr("class", "line")
    .attr('d', d => line(d.values))
    .each(function (d) { d.totalLength = this.getTotalLength(); })
    .attr("stroke-dasharray", function (d) { return d.totalLength + " " + d.totalLength; })
    .attr("stroke-dashoffset", function (d) { return d.totalLength; })
    .merge(paths)
    .attr("stroke", (d, i) => color(i))
    .transition()
    .duration(750)
    .attr('d', d => line(d.values))
    .transition()
    .duration(3000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0)
    .attr("fill", "none");

  hoverInfo();
}