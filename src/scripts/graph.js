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

  // change these two to g.append if want axis in front of the lines
  // make the x axis group
  linesContainer.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr('class', "x-axis")
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
    .duration(1000)
    .call(d3.axisLeft(yScale))

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
  paths
    .enter()
    .append("g")
    // put the actual line on the screen
    .append("path")
    .attr("class", "line")
    .merge(paths)
    .attr("stroke", (d, i) => color(i))
    .transition()
    .duration(1000)
    .attr('d', d => line(d.values))
    
    .attr("fill", "none")

  // for each object (player) in the data array, make the dots and text
  // make the group element for the dots
  linesContainer.selectAll(`.dot-group`)
    .data(data)
    .enter()
    .append("g")
    .attr("class", `dot-group`)
    .selectAll(`.dot-container`)
    .data(d => d.values)
    .enter()
    // make the group element container for each dot one by one (because of data)
    .append("g")
    .attr("class", `dot-container`)
    .on("mouseover", function (d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text(`Game: ${d.game}, Total: ${d.total}`)
        .attr('text-anchor', 'middle')
        .attr("x", d => xScale(d.game))
        .attr("y", d => yScale(d.total) - 15);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("cursor", "none")
        .selectAll(".text").remove();
    })
    // make the actual dot
    .append("circle")
    .attr("class", `dot`)
    .attr("stroke", (d, i) => color(i))
    .attr("fill", "white")
    .transition()
    .duration(750)
    .attr("cx", d => xScale(d.game))
    .attr("cy", d => yScale(d.total))
    .attr("r", ".25%");
}