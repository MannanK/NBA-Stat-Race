import { merge } from 'lodash';

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

export function makeGraph(data, makeHover) {
  if (document.getElementsByTagName("svg").length !== 0) {
    updateGraph(data);
  } else {
    let docGraphWidth = document.getElementById("graph-container").clientWidth;
    let docGraphHeight = document.getElementById("graph-container").clientHeight;

    let width = docGraphWidth - margin.left - margin.right;
    let height = docGraphHeight - margin.top - margin.bottom;

    // Margin convention and make the graph resize as the window resizes
    // From now on, all subsequent code can just use 'width' and 'height'
    let svg = d3.select('#graph-container').append("svg")
      .attr('width', docGraphWidth)
      .attr('height', docGraphHeight);
    // .call(resizingFunction);

    let g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // make the hover info/tooltip container
    d3.select('#graph-container')
      .append("g")
      .attr("class", "hover-info-container")
      .style('display', 'none');

    // make the hover line that will show up as the mouse moves
    g.append("line")
      .attr("class", "hover-line")
      .style("shape-rendering", "crispEdges");

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
      .text("Total")
      .attr("fill", "white");

    updateGraph(data, makeHover);
  }
}

export function updateGraph(data, makeHover) {
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
    .domain([0, maxTotal + 10])
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
  let paths = linesContainer.selectAll(`.line`).data(data);

  paths.exit().remove();

  // for each object (player) in the data array, make the lines
  // make the group element for the line
  // put the actual line on the screen
  paths
    .enter()
    .append("g")
    .attr("class", "line-container")
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

  // let names = data.map(player => player.name);
  // hoverInfo(data, names, color, xScale, yScale);

  d3.selectAll('.hover-overlay').remove();
  let hoverOverlay = svg.append("rect")
    .attr("class", "hover-overlay")
    .attr("x", margin.left)
    .attr("y", margin.bottom)
    .attr('opacity', 0)
    .attr("width", width)
    .attr("height", height)

  if (makeHover) {
    // const hoverOverlay = d3.selectAll('.hover-overlay');
    const hoverInfoContainer = d3.selectAll('.hover-info-container');
    const hoverLine = d3.selectAll(".hover-line");

    let newData = data.map(player => merge({}, player));

    data.forEach((player, idx) => {
      let numGamesPlayed = player.values.length - 1;

      if (numGamesPlayed != 82) {
        let lastGame = numGamesPlayed + 1;
        let total = player.values[numGamesPlayed].total;

        for (let i = lastGame; i <= 82; i++) {
          let obj = {
            game: lastGame,
            total
          }

          newData[idx].values.push(obj);
          lastGame++;
        }
      }

      newData[idx].originalIndex = idx;
    });

    d3.select(".hover-overlay")
      .on('mousemove', showHoverInfo.bind(this, newData, xScale, yScale, hoverOverlay, hoverInfoContainer, hoverLine, width, height, color))
      .on('mouseout', hideHoverInfo);
  }
}

function hideHoverInfo() {
  const hoverInfoContainer = d3.select('.hover-info-container');
  const hoverLine = d3.select(".hover-line");

  if (hoverInfoContainer) hoverInfoContainer.style('display', 'none');
  if (hoverLine) hoverLine.attr('stroke', 'none');
}

function showHoverInfo(data, xScale, yScale, hoverOverlay, hoverInfoContainer, hoverLine, width, height, color) {
  const bisector = d3.bisector(function (d) { return d.game; }).left;
  const overlayNode = hoverOverlay.node();
  const mousePos = d3.mouse(overlayNode);

  let x = xScale.invert(mousePos[0] - 50);
  const game = bisector(data[0].values, x, 1);
  const currentDimensions = overlayNode.getBoundingClientRect();

  if (game >= 0 && game <= 82) {
    data.sort((player1, player2) => {
      return (
        player2.values
          .find(obj => obj.game == game).total -
        player1.values
          .find(obj => obj.game == game).total
      );
    })

    hoverLine
      .attr('stroke', 'white')
      .attr('x1', xScale(game))
      .attr('x2', xScale(game))
      .attr('y1', 0)
      .attr('y2', height);

    hoverInfoContainer
      .text("Game: " + game)
      .style('color', "white")
      .style('display', 'flex')
      .selectAll()
      .data(data)
      .enter()
      .append('text')
      .style('color', (d) => color(d.originalIndex))
      .text(d => d.name + ': ' + d.values.find(h => h.game == game).total);

    let hoverInfoContainerWidth = hoverInfoContainer.node().offsetWidth;

    let left = (mousePos[0] + hoverInfoContainerWidth) > width ? (
      ((mousePos[0] - hoverInfoContainerWidth) - 20) * (currentDimensions.width / width)
    ) : (
      (mousePos[0] + 30) * (currentDimensions.width / width)
    );

    hoverInfoContainer
      .style('left', `${left}px`)
      .style('top', `${(mousePos[1] - 15) * (currentDimensions.height / height)}px`)
  }

  // xScale(game) > (width - width/4)
  //   ? d3.selectAll(".hover-info-container")
  //     .attr("text-anchor", "end")
  //     .attr("dx", -10)
  //   : d3.selectAll(".hover-info-container")
  //     .attr("text-anchor", "start")
  //     .attr("dx", 10)
}