const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const Game = db.game;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  //const username = req.body.username;
  console.log(req.body);
  //   if (
  //     !username ||
  //     username.length < 3 ||
  //     username.length > 13 ||
  //     !/^[\w.]*$/.test(username)
  //   ) {
  //     res.status(400).send({ message: "Wrong username format!" });
  //     return;
  //   }
  /*
  // Create a User
  const game = new Game({
      name: req.body.username,
      code: uuidv4(),
      map: req.body.map,
      actions: req.body.actions,
      players: req.body.players,
      status: req.body.status
  });

  // Save User in the database
  game
    .save(game)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Game.",
      })
    );
*/
};
