function SEARCH_URL(input) {
  return (
    "https://www.balldontlie.io/api/v1/players?search=" +
    input +
    "&per_page=10"
  );
}

// sort by player names?
export function searchPlayers(input) {
  return fetch(SEARCH_URL(input))
    .then(resp => resp.json())
    .then(data => {
      return data.data;
    })
    .catch(error => console.log(error));
}