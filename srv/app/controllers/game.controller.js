const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const { generateMap, addPlayer } = require("../tools/game/lib");
const items = require("../tools/game/data/items");
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
    items
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

  // Update Owner
  if (game.owner == user._id) {
    if (genNewMap) {
      const { new_map, gen_player } = generateMap(
        20,
        20,
        game.players,
        40,
        6,
        items
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
