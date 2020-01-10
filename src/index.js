import "./styles/reset.scss";
import "./styles/animations.scss";
import "./styles/index.scss";
import "./styles/graph.scss";

import { makeGraph, updateGraph } from './scripts/graph';
import { searchPlayers, searchPlayerStats } from './scripts/api_util';
import { debounce } from 'lodash';

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

let data = [];

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

  dropdownEl.onchange = function () {
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

// check if the user has entered valid input
// if yes, pass off the input to the debouncedSearch
// if not, remove the dropdown element from the DOM
function handlePlayerInput(e) {
  let inputVal = e.currentTarget.value;

  if (inputVal !== "" && inputVal.length > 1) {
    debouncedSearch(inputVal);
  } else {
    if (document.getElementById("player-dropdown")) {
      document.getElementById("player-dropdown").remove();
    }
  }
}

// user made a valid input, pass off to searchPlayers to send the API request
// on return, make the dropdown containing the results
function debouncedSearch(input) {
  searchPlayers(input).then(searchResults => {
    makePlayerDropdown(searchResults);
  });
}

// with the results gotten from the API requests, make the dropdown element
function makePlayerDropdown(searchResults) {
  const playerInputContainer = document.getElementsByClassName("search-players-input-container")[0];

  let playerList = document.getElementById("player-dropdown");

  // if the dropdown currently exists (user added more letters), empty it out
  if (playerList) {
    playerList.innerHTML = "";
  }
  // otherwise, make a new ul for the dropdown
  else {
    playerList = document.createElement("ul")
    playerList.setAttribute("id", "player-dropdown");
  }

  // one by one create a new list element for each player
  searchResults.forEach(({ first_name, last_name, id }) => {
    let playerName = first_name + " " + last_name;

    let playerItem = document.createElement("li");
    playerItem.classList.add("player-item");
    playerItem.setAttribute("id", id);
    playerItem.onclick = handlePlayerClick;
    playerItem.innerHTML = playerName;
    playerList.append(playerItem);
  });

  // add the list items to the dropdown
  playerInputContainer.append(playerList);
}

function handlePlayerClick(e) {
  const seasonDropdown = document.getElementById("season-dropdown");
  const statDropdown = document.getElementById("stat-dropdown");

  // if nothing is selected for season, show a modal error?
  // if (seasonDropdown.selectedIndex <= 0) {

  // }

  // if nothing is selected for stat, show a modal error?
  // if (statDropdown.selectedIndex <= 0) {

  // }

  // add to the player-names container (if data returned back successfully)

  // first make sure the two dropdowns are correctly selected

  if (seasonDropdown.selectedIndex > 0 && statDropdown.selectedIndex > 0) {
    let seasonVal = seasonDropdown.options[seasonDropdown.selectedIndex].value;
    let statVal = statDropdown.options[statDropdown.selectedIndex].value;
    let playerVal = e.target.id;

    searchPlayerStats(seasonVal, statVal, playerVal).then(searchResults => {
      if (data.length !== 0) {
        data.push(searchResults);
        updateGraph(data);
      } else {
        data.push(searchResults);
        makeGraph(data);
      }
    });

    window.addEventListener('resize', resize);

    function resize() {
      if (document.getElementsByTagName("svg").length === 1) {
        let svgWidth = document.getElementsByTagName("svg")[0].clientWidth;
        let svgHeight = document.getElementsByTagName("svg")[0].clientHeight;

        document.getElementById("graph-container").style.height = `${svgHeight}px`;
        document.getElementById("graph-container").style.width = `${svgWidth}px`;
      }
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  makeSeasonDropdown();
  makeStatDropdown();

  const playerInputEl = document.getElementById("search-players-input");

  // every time the user changes the input field, call handlePlayerInput
  playerInputEl.oninput = handlePlayerInput;

  // if user clicks outside of the dropdown or input field, hide the dropdown
  // if it is currently on the page
  document.onclick = function (e) {
    if (e.target.id !== "search-players-input" && e.target.className !== "player-item") {
      if (document.getElementById("player-dropdown")) {
        document.getElementById("player-dropdown").style.display = "none";
      }
    }
  }

  // if user clicks on the input field, show the dropdown if it is currently
  // hidden
  // allows us to not send out another API call since input hasn't changed
  playerInputEl.onclick = function (e) {
    if (document.getElementById("player-dropdown")) {
      document.getElementById("player-dropdown").style.display = "";
    }
  };

  debouncedSearch = debounce(debouncedSearch, 400);
});