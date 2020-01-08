import { parseSearchPlayerStats } from './api_parsing';

const apiUrl = "https://www.balldontlie.io/api/v1/";

function SEARCH_PLAYER_URL(playerName) {
  return (
    apiUrl +
    "players?search=" + playerName +
    "&per_page=10"
  );
}

// postseason false, per_page=82
// https://www.balldontlie.io/api/v1/stats?player_ids[]=237&seasons[]=2018&postseason=false&per_page=82
function SEARCH_PLAYER_STATS_URL(season, playerId) {
  return (
    apiUrl +
    "stats?player_ids[]=" + playerId +
    "&seasons[]=" + season +
    "&postseason=false&per_page=82"
  );
}

// sort by player names?
export function searchPlayers(playerName) {
  return fetch(SEARCH_PLAYER_URL(playerName))
    .then(resp => resp.json())
    .then(data => {
      return data.data;
    })
    .catch(error => console.log(error));
}

export function searchPlayerStats(season, stat, playerId) {
  return fetch(SEARCH_PLAYER_STATS_URL(season, playerId))
    .then(resp => resp.json())
    .then(data => {
      return parseSearchPlayerStats(data, stat);
    })
    .catch(error => console.log(error));
}