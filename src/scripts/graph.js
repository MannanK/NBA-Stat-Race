// hardcoded data for now
// game # : total stat so far
let data = {
  stephenCurry: {
    '1': 3,
    '2': 7,
    '3': 13,
    '4': 15,
    '5': 19,
    '6': 22,
    '7': 25,
    '8': 32,
    '9': 35,
    '10': 40,
    '11': 42,
    '12': 44,
    '13': 47,
    '14': 49,
    '15': 53,
    '16': 57,
    '17': 60,
    '18': 64,
    '19': 67,
    '20': 70,
    '21': 73,
    '22': 78,
    '23': 83,
    '24': 93,
    '25': 99,
    '26': 103,
    '27': 111,
    '28': 116,
    '29': 118,
    '30': 122,
    '31': 128,
    '32': 133,
    '33': 141,
    '34': 146,
    '35': 154,
    '36': 155,
    '37': 158,
    '38': 163,
    '39': 165,
    '40': 169,
    '41': 172,
    '42': 175,
    '43': 178,
    '44': 186,
    '45': 191,
    '46': 195,
    '47': 199,
    '48': 203,
    '49': 209,
    '50': 209,
    '51': 212
  },
  joelEmbiid: {
    '1': 0,
    '2': 0,
    '3': 1,
    '4': 2,
    '5': 5,
    '6': 5,
    '7': 6,
    '8': 6,
    '9': 7,
    '10': 7,
    '11': 8,
    '12': 10,
    '13': 11,
    '14': 11,
    '15': 12,
    '16': 13,
    '17': 13,
    '18': 13,
    '19': 13,
    '20': 13,
    '21': 15,
    '22': 15,
    '23': 16,
    '24': 16,
    '25': 17,
    '26': 19,
    '27': 25,
    '28': 25,
    '29': 25,
    '30': 25,
    '31': 26,
    '32': 27,
    '33': 28,
    '34': 28,
    '35': 30,
    '36': 30,
    '37': 31,
    '38': 32,
    '39': 35,
    '40': 36,
    '41': 36,
    '42': 36,
    '43': 39,
    '44': 41,
    '45': 42,
    '46': 43,
    '47': 43,
    '48': 46,
    '49': 47,
    '50': 49,
    '51': 52,
    '52': 52,
    '53': 53,
    '54': 53,
    '55': 53,
    '56': 56,
    '57': 57,
    '58': 57,
    '59': 59,
    '60': 60,
    '61': 64,
    '62': 64,
    '63': 65,
    '64': 66,
    '65': 66,
    '66': 66,
    '67': 69,
    '68': 69,
    '69': 69,
    '70': 71,
    '71': 72,
    '72': 72,
    '73': 74,
    '74': 74
  },
  georgeHill: {
    '1': 1,
    '2': 4,
    '3': 4,
    '4': 4,
    '5': 4,
    '6': 4,
    '7': 6,
    '8': 6,
    '9': 6,
    '10': 7,
    '11': 10,
    '12': 11,
    '13': 12,
    '14': 14,
    '15': 17,
    '16': 17,
    '17': 18,
    '18': 22,
    '19': 22,
    '20': 22,
    '21': 22,
    '22': 24,
    '23': 25,
    '24': 27,
    '25': 31,
    '26': 35,
    '27': 39,
    '28': 40,
    '29': 40,
    '30': 40,
    '31': 41,
    '32': 42,
    '33': 45,
    '34': 46,
    '35': 46,
    '36': 48,
    '37': 52,
    '38': 52,
    '39': 52,
    '40': 52,
    '41': 52,
    '42': 55,
    '43': 56,
    '44': 56,
    '45': 56,
    '46': 58,
    '47': 60,
    '48': 61,
    '49': 61,
    '50': 62,
    '51': 62,
    '52': 65,
    '53': 65,
    '54': 68,
    '55': 68,
    '56': 69,
    '57': 71,
    '58': 72,
    '59': 74,
    '60': 76,
    '61': 77,
    '62': 77,
    '63': 79,
    '64': 80,
    '65': 83,
    '66': 83,
    '67': 84,
    '68': 84,
    '69': 85,
    '70': 85
  }
};

function makeGraph() {
  let margin = { top: 40, right: 40, bottom: 40, left: 40 };
  let docGraphWidth = document.getElementById("graph-container").clientWidth;
  let docGraphHeight = document.getElementById("graph-container").clientHeight;

  let width = docGraphWidth - margin.left - margin.right;
  let height = docGraphHeight - margin.top - margin.bottom;

  // Margin convention and make the graph resize as the window resizes
  // From now on, all subsequent code can just use 'width' and 'height'
  let svg = d3.select('#graph-container').append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr('viewBox', '0 0 ' + Math.min(docGraphWidth, docGraphHeight) + ' ' + Math.min(docGraphWidth, docGraphHeight))
      .attr('preserveAspectRatio', 'xMinYMin');

  let g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

module.exports = {
  makeGraph
};