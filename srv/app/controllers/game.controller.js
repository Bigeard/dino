const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const { generateMap, addPlayer } = require("../tools/game/lib");
const items = require("../tools/game/data/items");
const userController = require("./user.controller.js");
const GameDB = db.game;
const UserDB = db.user;

// Find a single Game with a code
exports.findByCode = (req, res, sendData) => {
  const code = req.body.code;
  if (!code) res.status(500).send({ message: "Missing data" });
  // No validation because it's a GET request
  return GameDB.findOne({ code: code })
    .then((data) => {
      if (!data) res.status(404).send({ message: "Not found game..." });
      else return sendData ? res.send(data) : data;
    })
    .catch((_) => {
      res.status(500).send({ message: "Error server..." });
    });
};

// Update a single Game with a code
exports.updateByCode = (code, game) => {
  return GameDB.updateOne({ code: code }, game)
    .then((data) => {
      if (!data) res.status(404).send({ message: "Not found game..." });
      else return data;
    })
    .catch((_) => {
      res.status(500).send({ message: "Error server..." });
    });
};

// Create and Save a new Game
exports.create = async (req, res) => {
  const passId = req.body.passId;
  if (!passId) res.status(404).send({ message: "Not found user..." });

  // Find User in the database
  const user = await UserDB.findOne({ passId: passId }, "-passId").catch((e) =>
    res.status(500).send({ message: e.message || "Error server..." })
  );
  if (!user) return res.status(404).send({ message: "Not found user..." });

  // New game
  const { new_map, gen_player } = generateMap(
    20,
    20,
    [
      {
        _id: user._id,
        name: user.username,
      },
    ],
    40,
    6,
    items.items
  );
  const game = {
    name: "Game of " + user.username,
    code: uuidv4(),
    map: new_map,
    players: gen_player,
    owner: user._id,
    width: 20,
    height: 20,
    status: "new_game",
  };

  // Save Game in the database
  return await GameDB.create(game)
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Game.",
      });
    });
};

// Update a Game id in the request
exports.update = async (req, res) => {
  const { passId, code, genNewMap, new_name, start } = req.body;
  if (!passId || !code)
    return res.status(200).send({ message: "Missing data" });

  // Find User in the database
  const user = await UserDB.findOne({ passId: passId }, "-passId").catch((e) =>
    res.status(500).send({ message: e.message || "Error server..." })
  );
  if (!user) return res.status(404).send({ message: "Not found user..." });
  let game = await this.findByCode(req, res);
  if (!game) return;
  // Check if game has already started
  if (game.status !== "new_game") return res.send(game);

  // Update Owner @TODO use .equals() ... Need test
  if (game.owner == user._id) {
    if (genNewMap) {
      const { new_map, gen_player } = generateMap(
        20,
        20,
        game.players,
        40,
        6,
        items.items
      );
      game.map = new_map;
      game.players = gen_player;
    }
    if (
      new_name &&
      new_name.length >= 3 &&
      new_name.length <= 24 &&
      /^[\w. ]*$/.test(new_name)
    ) {
      game.name = new_name;
    }
    if (start && game.players.length >= 2) {
      game.status = "in_progress";
    }
    await this.updateByCode(code, game);
  } else {
    // Add player
    if (
      game.players.map((e) => e._id).indexOf(user._id) < 0 &&
      game.players.length < 5
    ) {
      const { new_map, gen_player } = addPlayer(game, user);
      game.map = new_map;
      game.players = gen_player;
      await this.updateByCode(code, game);
    }
  }
  res.send(game);
};

// Action Game
exports.action = async (req, res) => {
  const { passId, code, x, y } = req.body;
  if (!passId || !code) {
    return res.status(400).send({
      message: "Data is incomplete!",
    });
  }

  // Detect if user exist
  const user = await userController.findByPassId(req, res, false);
  if (!user) return;
  user.passId = req.body.passId;

  // Detect if game exist
  const game = await this.findByCode(req, res, false);
  if (!game) return;

  // Check if the turn of user
  if (game.players[0]._id != user._id.toString()) {
    return res.send({
      message: "Is not your turn. Turn of player: " + game.players[0].name,
    });
  }

  const player = findPlayerInTheMap(game, user._id);
  console.log("Game:", game._id);
  console.log("Player:", player.obj._id, player.x, player.y);
  console.log("Action:", x, y);

  if (
    !checkIfAccessible(game, player.x, player.y, player.obj.stat.move, x, y)
  ) {
    return res.send({
      message:
        "You don't have the possibility to do this action: " +
        game.players[0].name,
    });
  }

  // Action Player
  if (game.map[y][x].name === "Player") {
    // Calcule domage infliged
    const totalDamage = calcTotalDamage(player.obj);
    game.map[y][x].obj.stat.health =
      game.map[y][x].obj.stat.health - totalDamage;

    // Check if player is dead
    if (game.map[y][x].obj.stat.health <= 0) {
      const index = game.players
        .map((e) => e.name)
        .indexOf(game.map[y][x].obj.name);

      if (index > -1) game.players[index].dead = true;
    }

    game.map[y][x] = {
      name: "Ground",
      x: x,
      y: y,
      items: [],
      obstacle: false,
      view_distance: null,
    };

    // If he is the last player, he has won!
    if (
      game.players.map((e) => e.dead).filter((e) => e === false).length === 1
    ) {
      console.log(player.name + " WIN !!!");
      return res.send({ message: player.name + " WIN !!!" });
    }
  } else {
    // Player change position
    game.map[player.y][player.x] = {
      name: "Ground",
      x: player.x,
      y: player.y,
      obstacle: false,
      view_distance: null,
    };
    player.x = x;
    player.y = y;

    if (game.map[y][x].name === "Item") {
      player.obj.items.push(game.map[y][x].obj);
    }
    game.map[y][x] = player;
  }

  game.players = changeTurn(game.players);
  await this.updateByCode(code, game);
  res.send(game);
};

findPlayerInTheMap = (game, user_id) => {
  for (let y = 0; y < game.map.length; y++) {
    for (let x = 0; x < game.map.length; x++) {
      if (game.map[y][x].obj && game.map[y][x].obj._id && game.map[y][x].obj._id.toString() == user_id) {
        return game.map[y][x];
      }
    }
  }
};

changeTurn = (players, i = 0) => {
  players.splice(players.length, 0, players.splice(0, 1)[0]);
  if (players[0].dead && i < 4) changeTurn(players, i);
  else return players;
};

calcTotalDamage = (obj) => {
  // Calculate damage with items
  let itemsDamage = 0;
  if (!obj.items) return obj.stat.damage;
  obj.items.forEach((i) => {
    itemsDamage += i.stat.damage;
  });
  // Inflicts damage
  return obj.stat.damage + itemsDamage;
};

checkIfAccessible = (game, player_x, player_y, move, x, y) => {
  let accessible = false;
  accessibleCellsAround(game, player_x, player_y, move).forEach((e) => {
    if (e.x === x && e.y === y) return (accessible = true);
  });
  return accessible;
};

/**
 * Displays the distance and the cells that the user can travel.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} move The distance the player can travel
 * @param {Set} existingSet
 */
accessibleCellsAround = (game, x, y, move, existingSet) => {
  if (move == 0) {
    return existingSet;
  }
  if (!existingSet) {
    existingSet = new Set([]);
  }
  const directions = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ];
  for (const dir of directions) {
    const target = { x: x + dir.x, y: y + dir.y };
    if (cellIsWalkable(game, target.x, target.y)) {
      existingSet.add(game.map[target.y][target.x]);
      accessibleCellsAround(game, target.x, target.y, move - 1, existingSet);
    }
  }
  return existingSet;
};

cellIsWalkable = (game, x, y) => {
  if (x < 0 || x >= game.map[0].length || y < 0 || y >= game.map.length) return false;
  return !game.map[y][x].obstacle;
};
