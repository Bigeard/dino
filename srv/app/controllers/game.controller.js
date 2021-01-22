const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const Game = db.game;

// Create and Save a new Game
exports.create = (req, res) => {

  // Create a Game
  const game = new Game({
      name: req.body.name,
      code: uuidv4(),
      map: req.body.map,
      actions: req.body.actions,
      players: req.body.players,
      owner: req.body.owner,
      status: req.body.status
  });
  console.log(game);

  // Save Game in the database
  game
    .save(game)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Game.",
      })
    );
};

// Find a single Game with a code
exports.findByCode = (req, res, sendData) => {
  const code = req.params.code;
  // No validation because it's a GET request
  Game.findOne({ code: code }, "-code")
    .then((data) => {
      if (!data) res.status(404).send({ message: "Not found game..." });
      else return sendData ? res.send(data) : data;
    })
    .catch((_) => {
      res.status(500).send({ message: "Error server..." });
    });
};
