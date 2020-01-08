import "./styles/reset.scss";
import "./styles/index.scss";
import "./styles/graph.scss";

import { makeGraph } from './scripts/graph';

const stats = [
  { 'fgm': "FGM" },
  { 'fga': "FGA" },
  { 'fg3m': "3PM" },
  { 'fg3a': "3PA" },
  { 'ftm': "FTM" },
  { 'fta': "FTA" },
  { 'oreb': "OREB" },
  { 'dreb': "DREB" },
  { 'reb': "REB" },
  { 'ast': "AST" },
  { 'stl': "STL" },
  { 'blk': "BLK" },
  { 'turnover': "TO" },
  { 'pf': "PF" },
  { 'pts': "PTS" },
  { 'fg_pct': "FG%" },
  { 'fg3_pct': "3PT%" },
  { 'ft_pct': "FT%" }
];

window.addEventListener("DOMContentLoaded", () => {
  makeGraph();

  makeSeasonDropdown();
  makeStatDropdown();
});

// make the season dropdown menu
function makeSeasonDropdown() {
  const dropdownEl = document.getElementById("season-dropdown");

  let startYear = 1979;
  let end = new Date().getFullYear();
  let options = "<option selected disabled>Please select a season</option>";
  
  for (let year = startYear; year <= end; year++) {
    options += `<option value="${year}">` + year + "</option>";
  }

  dropdownEl.innerHTML = options;

  dropdownEl.onchange = function() {
    // to reset the stat dropdown
    // document.getElementById("stat-dropdown").selectedIndex = 0;

    // call the overall fetch function to make a request to the API
      // again, as long as all fields are still inputed correctly?
      // check this inside the function using document functions, gets the
      // inputs from all 3 fields (and existing players already added) and if
      // all are present then make the API request

    //apiFunctionHere();

    // reset the players as soon as the season dropdown selection
      // changes?
  };
}

// make the stat dropdown menu
function makeStatDropdown() {
  const dropdownEl = document.getElementById("stat-dropdown");

  let options = "<option selected disabled>Please select a stat</option>";

  stats.forEach(stat => {
    let key = Object.keys(stat)[0];
    let val = Object.values(stat)[0];

    options += `<option value="${key}">` + val + "</option>";
  });

  dropdownEl.innerHTML = options;
}