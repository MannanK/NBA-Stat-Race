// Old seasons don't have most stats available!! Need to check for this??
export function parseSearchPlayerStats(data, stat) {
  // get the array of stats per game from the 'data' key
  let gameStats = data.data;
  // get the player object that each gameStat object has, just pull it from the
  // first
  let playerInfo = gameStats[0].player;

  // player played in this season
  if (gameStats.length !== 0) {
    let returnData = {
      "name": playerInfo.first_name + " " + playerInfo.last_name,
      "values": [{ game: 0, total: 0 }]
    };

    let values = returnData.values;

    // sort the stats per game objects by date, beginning of season to end
    gameStats.sort(function (a, b) {
      return a.game.date > b.game.date ? 1 : a.game.date < b.game.date ? -1 : 0;
    });

    // parse out the specific stat we're looking for
    // will need to modify this for stats with percentages, not adding up
      // totals for these
    gameStats.forEach((game, i) => {
      if (i === 0) {
        game[stat] !== null ? (
          values.push({ game: i+1, total: game[stat] })
        ) : (
            values.push({ game: i+1, total: 0 })
          );
      } else {
        if (game[stat]) {
          values.push({ game: i+1, total: values[values.length-1].total + game[stat] });
        } else {
          values.push({ game: i+1, total: values[values.length-1].total });
        }
      }
    });

    return returnData;
  }
  // player didn't play in this season
  else {
    return {
      "error": "Player didn't play in this season!"
    };
  }
}