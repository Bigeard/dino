module.exports = app => {
    const player = require("../controllers/player.controller.js");

    var router = require("express").Router();

    // Create a new player
    router.post("/", player.create);

    // Retrieve all players
    router.get("/", player.findAll);

    // Retrieve all players of a game
    router.get("/:game", player.findByGame);

    // Retrieve a single player with id
    router.get("/:id", player.findOne);

    // Delete a player with id
    router.delete("/:id", player.delete);

    app.use("/api/player", router);
};