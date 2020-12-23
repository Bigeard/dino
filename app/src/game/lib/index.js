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
        items: [],
        obstacle: false,
        view_distance: null
      });
    }
  }

  // Generate the Players
  let randCell = null;
  for (let p = 0; p < players.length; p++) {
    randCell = map[randInt(0, height)][randInt(0, width)];
    randCell.id = p;
    randCell.name = "Player";
    randCell.obstacle = false;
    randCell.obj = {
      name: players[p],
      img: "/public/img/icons/zorfiL.gif",
      stat: {
        health: 40,
        damage: 4,
        move: 3
      }
    };
  }

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

  return map;
};

export { randInt, generateMap };
