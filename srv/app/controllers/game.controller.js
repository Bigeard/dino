const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const { generateMap, randInt } = require("../tools/game/lib");
const items = require("../tools/game/data/items");
const { user } = require("../models");
const GameDB = db.game;
const UserDB = db.user;

const gameObject = {
  map: [],
  players: [],
  generateNewMapCount: 0,
};

// Create and Save a new Game
exports.create = async (req, res) => {
  const passId = req.body.passId;
  const { new_map, gen_player } = generateMap(20, 20, [], 40, 6, items);

  const curentUserForCreateGame = {
    id: "",
    username: "",
  };

  const game = new GameDB({
    name: "",
    code: uuidv4(),
    map: new_map,
    actions: [],
    players: gen_player,
    owner: "",
    status: "creating-new-game",
  });

  // Find User in the database
  const findUser = await UserDB.findOne({ passId: passId }, "-passId")
    .then(async (data) => {
      if (!data) {
        res.status(404).send({ message: "Not found user..." });
      } else {
        curentUserForCreateGame.id = data._id;
        curentUserForCreateGame.username = data.username;

        game.name = "game of " + data.username;
        game.players = curentUserForCreateGame;
        game.owner = data._id;

        // Save Game in the database
        if (game.name || game.code || game.owner || game.status) {
          return await game
            .save(game)
            .then((data) => res.send(data))
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the Game.",
              });
            });
        }
        res.status(500).send({ message: "Data is incomplete!" });
      }
      res.status(400).send({ message: "Error server..." });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message || "Error server..." });
    });

  // Create a Game
  if (!passId) res.status(404).send({ message: "Not found user..." });
  return findUser;
};

// Find a single Game with a code
exports.findByCode = (req, res, sendData) => {
  const code = req.body.code;
  // No validation because it's a GET request
  GameDB.findOne({ code: code })
    .then((data) => {
      if (!data) res.status(404).send({ message: "Not found game..." });
      else return sendData ? res.send(data) : data;
    })
    .catch((_) => {
      res.status(500).send({ message: "Error server..." });
    });
};

// Update a Game id in the request
exports.update = async (req, res) => {
  const { passIdCurentUser, code, name } = req.body;

  const user = {
    _id: "",
    username: "",
  };

  const game = {
    name: "",
    code: "",
    map: [],
    actions: [],
    players: [],
    owner: "",
    status: "game-launched",
  };

  // Find User in the database
  const findUser = await UserDB.findOne({ passId: passIdCurentUser }, "-passId")
    .then(async (data) => {
      if (!data) {
        res.status(404).send({ message: "Not found user..." });
      } else {
        user._id = data._id;
        user.username = data.username;
        // Find a single Game with a code
        return await GameDB.findOne({ code: code })
          .then(async (data) => {
            if (!data) {
              res.status(404).send({ message: "Not found game..." });
            } else {
              if (user._id == data.owner) {
                game.name = name;
                game.code = data.code;
                game.map = data.map;
                game.actions = data.actions;
                game.players = data.players;
                game.owner = data.owner;
                // Update name, status and map of this Game in the database if it is the owner
                return await GameDB.updateOne(game)
                  .then(async () => {
                    // Again find a single Game with a code because the result of update request return status code but not data
                    return await GameDB.findOne({ code: code })
                      .then((data) => res.send(data))
                      .catch((_) => {
                        res.status(500).send({ message: "Error server..." });
                      });
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message:
                        err.message ||
                        "Some error occurred while update the Game.",
                    });
                  });
              } else {
                if (
                  data.players.length > 0 &&
                  data.players.length < 6
                ) {
                  let filterPlayers = data.players.filter(
                    (player) =>
                      player.username == user.username
                  );
                  if (filterPlayers.length === 0) {
                    data.players.push(user);
                  }
                }
                game.name = data.name;
                game.code = data.code;
                game.map = data.map;
                game.actions = data.actions;
                game.players = data.players;
                game.owner = data.owner;
                game.status = data.status;
                // Update player of this Game in the database if it is not the owner
                return await GameDB.updateOne(game)
                  .then(async () => {
                    // Again find a single Game with a code because the result of update request return status code but not data
                    return await GameDB.findOne({ code: code })
                      .then((data) => res.send(data))
                      .catch((_) => {
                        res.status(500).send({ message: "Error server..." });
                      });
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message:
                        err.message ||
                        "Some error occurred while update the Game.",
                    });
                  });
              }
            }
          })
          .catch((_) => {
            res.status(500).send({ message: "Error server..." });
          });
      }
      res.status(400).send({ message: "Error server..." });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message || "Error server..." });
    });

  // Update a Game
  if (!passIdCurentUser) res.status(404).send({ message: "Not found user..." });
  return findUser;
};
