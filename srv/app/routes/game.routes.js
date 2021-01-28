module.exports = (app) => {
  const game = require("../controllers/game.controller.js");

  var router = require("express").Router();

  // Create a new game
  router.post("/create", game.create);

  // Action Game
  router.post("/action", game.action);

  // Retrieve a single game with code
  router.post("/readByCode", game.findByCode);

  // Update a game with code
  router.post("/update", game.update);

  app.use("/api/game", router);
};