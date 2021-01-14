const randInt = (min, max) => {
  return min + Math.floor((max - min) * Math.random());
};

/**
 * This function allows you to generate a map randomly.
 * @param {*} width
 * @param {*} height
 * @param {*} players
 * @param {*} numObstacle
 * @param {*} numItems
 * @param {*} items
 * @return map
 */
const generateMap = (width, height, players, numObstacle, numItems, items) => {
  let map = [];

  // Generate the Ground
  for (let y = 0; y < height; y++) {
    map.push([]);
    for (let x = 0; x < width; x++) {
      map[y].push({
        name: "Ground",
        x: x,
        y: y,
        obstacle: false,
        view_distance: null
      });
    }
  }

  // Generate the Players
  let randCell = null;
  let data_players = [];
  for (let p = 0; p < players.length; p++) {
    randCell = map[randInt(0, height)][randInt(0, width)];
    randCell.id = p;
    randCell.name = "Player";
    randCell.obstacle = false;
    randCell.obj = {
      _id: Date.now().toString() + Math.floor(Math.random() * 100).toString(),
      name: players[p],
      img: "/public/img/icons/zorfiL.gif",
      dead: false,
      items: [],
      numPlayer: p,
      stat: {
        health: 40,
        damage: 4,
        move: 3
      }
    };
    data_players.push(randCell.obj);
  }
  players = data_players;

  // Generate the Obstacles
  for (let o = 0; o < numObstacle; o++) {
    randCell = map[randInt(0, height)][randInt(0, width)];
    if (randCell.name === "Ground") {
      randCell.name = "Obstacle";
      randCell.obstacle = true;
    }
  }

  // Generate the Items
  for (let i = 0; i < numItems; i++) {
    randCell = map[randInt(0, height)][randInt(0, width)];
    if (randCell.name === "Ground") {
      randCell.name = "Item";
      randCell.obstacle = false;
      randCell.obj = items[randInt(0, items.length)];
    }
  }

  return { new_map: map, gen_player: players };
};

export { randInt, generateMap };
