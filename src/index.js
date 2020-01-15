import "./styles/reset.scss";
import "./styles/animations.scss";
import "./styles/index.scss";
import "./styles/graph.scss";
import "./styles/modals.scss";

import { makeGraph, updateGraph } from './scripts/graph';
import { searchPlayers, searchPlayerStats } from './scripts/api_util';
import { debounce } from 'lodash';

const stats = [
  { 'pts': "PTS" },
  { 'fgm': "FGM" },
  { 'fga': "FGA" },
  { 'fg3m': "3PM" },
  { 'fg3a': "3PA" },
  { 'ftm': "FTM" },
  { 'fta': "FTA" },
  { 'ast': "AST" },
  { 'reb': "REB" },
  { 'dreb': "DREB" },
  { 'oreb': "OREB" },
  { 'stl': "STL" },
  { 'blk': "BLK" },
  { 'turnover': "TO" },
  { 'pf': "PF" }
  // { 'fg_pct': "FG%" },
  // { 'fg3_pct': "3PT%" },
  // { 'ft_pct': "FT%" }
];

let data = [];
let resetData = false;
let previousSeasonVal = 0;
let previousStatVal = 0;

// make the season dropdown menu
function makeSeasonDropdown() {
  const dropdownEl = document.getElementById("season-dropdown");

  let startYear = 1990;
  let end = new Date().getFullYear();
  let options = "<option selected disabled>Please select a season</option>";

  for (let year = startYear; year < end; year++) {
    options += `<option value="${year}">` + year + "</option>";
  }

  dropdownEl.innerHTML = options;

  dropdownEl.onclick = function () {
    dropdownEl.classList.remove("not-selected-error");
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

  dropdownEl.onclick = function () {
    dropdownEl.classList.remove("not-selected-error");
  };
}

function checkGraphGlow() {
  const seasonDropdown = document.getElementById("season-dropdown");
  const statDropdown = document.getElementById("stat-dropdown");
  const graphContainer = document.getElementById("graph-container");
  const playerNamesContainer = document.getElementsByClassName("player-names-container")[0];
  const lineContainer = document.getElementsByClassName("line-container");

  seasonDropdown.onchange = function () {
    if (seasonDropdown.selectedIndex === previousSeasonVal && statDropdown.selectedIndex === previousStatVal) {
      graphContainer.classList.remove("graph-glow");
      playerNamesContainer.classList.remove("graph-glow");
      resetData = false;
    } else {
      if (lineContainer.length !== 0) {
        graphContainer.classList.add("graph-glow");
        playerNamesContainer.classList.add("graph-glow");
        resetData = true;
      }
    }
  };

  statDropdown.onchange = function () {
    if (statDropdown.selectedIndex === previousStatVal && seasonDropdown.selectedIndex === previousSeasonVal) {
      graphContainer.classList.remove("graph-glow");
      playerNamesContainer.classList.remove("graph-glow");
      resetData = false;
    } else {
      if (lineContainer.length !== 0) {
        graphContainer.classList.add("graph-glow");
        playerNamesContainer.classList.add("graph-glow");
        resetData = true;
      }
    }
  };
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
    playerList = document.createElement("ul");
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
  const playerDropdown = document.getElementById("player-dropdown");
  const playerInputEl = document.getElementById("search-players-input");
  const graphContainer = document.getElementById("graph-container");
  const playerNamesContainer = document.getElementsByClassName("player-names-container")[0];

  if (seasonDropdown.selectedIndex > 0 && statDropdown.selectedIndex > 0) {
    let seasonVal = seasonDropdown.options[seasonDropdown.selectedIndex].value;
    let statVal = statDropdown.options[statDropdown.selectedIndex].value;
    let playerVal = e.target.id;

    searchPlayerStats(seasonVal, statVal, playerVal)
      .then(searchResults => {
        if (searchResults !== null) {
          if (resetData) {
            data = [];
            resetData = false;
          }

          playerDropdown.remove();
          previousSeasonVal = seasonDropdown.selectedIndex;
          previousStatVal = statDropdown.selectedIndex;
          graphContainer.classList.remove("graph-glow");
          playerNamesContainer.classList.remove("graph-glow");
          playerInputEl.value = "";

          data.push(searchResults);
          updateGraph(data, true);

          updatePlayerNames();
        } else {
          let playerName = e.target.innerHTML;
          playerDropdown.remove();
          playerInputEl.value = "";
          
          makeModal("no-player-in-season", playerName);
        }
      });
  } else {
    if (seasonDropdown.selectedIndex === 0) {
      seasonDropdown.classList.add("not-selected-error", "animation");
      setTimeout(() => {
        seasonDropdown.classList.remove("animation");
      }, 400);
    }

    if (statDropdown.selectedIndex === 0) {
      statDropdown.classList.add("not-selected-error", "animation");
      setTimeout(() => {
        statDropdown.classList.remove("animation");
      }, 400);
    }

    if (playerDropdown) {
      playerDropdown.style.display = "none";
    }
  }
}

function updatePlayerNames() {
  const playerNamesContainer = document.getElementsByClassName("player-names-container")[0];
  while (playerNamesContainer.firstChild) {
    playerNamesContainer.removeChild(playerNamesContainer.firstChild);
  }

  data.forEach((player, i) => {
    let playerNameContainer = document.createElement("div");
    playerNameContainer.classList.add("player-name-container");
    playerNameContainer.innerHTML = `<span class="player-name">${player.name}</span>`;

    const removePlayerButton = document.createElement('button');
    removePlayerButton.setAttribute("id", `player-name-${i}`);
    removePlayerButton.className = "remove-player-button";
    removePlayerButton.innerHTML = '<i class="fas fa-window-close"></i>';
    removePlayerButton.onclick = handleRemovePlayer;
    
    playerNameContainer.appendChild(removePlayerButton);
    playerNamesContainer.append(playerNameContainer);
  });
}

function handleRemovePlayer(e) {
  let idx = e.target.parentNode.id.split("-")[2];
  data.splice(idx, 1);
  
  if (data.length !== 0) {
    updateGraph(data, true);
  } else {
    updateGraph(data, false);
  }

  updatePlayerNames();
}

window.data = data;

function makeModal(type, playerName) {
  if (type === "no-player-in-season") {
    const modalBackground = document.createElement('div');
    modalBackground.className = type;
    document.body.appendChild(modalBackground);

    // const mainContentEl = document.getElementsByClassName("content")[0];
    const modalPopup = document.createElement('section');
    modalPopup.className = "no-player-in-season-popup";

    const popupText = document.createElement('strong');
    popupText.textContent = `${playerName} didn't play in this season!`;
    modalPopup.appendChild(popupText);

    const popupButton = document.createElement('button');
    popupButton.className = "no-player-in-season-button";
    popupButton.innerHTML = '<i class="fas fa-window-close"></i>';
    modalPopup.appendChild(popupButton);

    popupButton.onclick = function () {
      modalBackground.remove();
    };

    modalBackground.appendChild(modalPopup);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.addEventListener('resize', resize);

  function resize() {
    if (document.getElementsByTagName("svg").length === 1) {
      let svgWidth = document.getElementsByTagName("svg")[0].clientWidth;
      let svgHeight = document.getElementsByTagName("svg")[0].clientHeight;

      document.getElementById("graph-container").style.height = `${svgHeight}px`;
      document.getElementById("graph-container").style.width = `${svgWidth}px`;
    }
  }

  makeSeasonDropdown();
  makeStatDropdown();
  checkGraphGlow();

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
  };

  // if user clicks on the input field, show the dropdown if it is currently
  // hidden
  // allows us to not send out another API call since input hasn't changed
  playerInputEl.onclick = function (e) {
    if (document.getElementById("player-dropdown")) {
      document.getElementById("player-dropdown").style.display = "";
    }
  };

  debouncedSearch = debounce(debouncedSearch, 400);

  makeGraph(data, false);
});