export function parseSearchPlayerStats(data, stat) {
  data = data.data;

  if (data.length !== 0) {
    data.sort(function (a, b) {
      return a.game.date > b.game.date ? 1 : a.game.date < b.game.date ? -1 : 0;
    });

    console.log(data);
  }
  // player didn't play in this season
  else {

  }
}