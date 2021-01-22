module.exports = app => {
    const game = require("../controllers/game.controller.js");

    var router = require("express").Router();

    // Create a new game
    router.post("/create", game.create);

    // Retrieve all games
    //router.get("/", game.findAll);

    // Retrieve all games of a user
    //router.get("/:game", game.findByUser);

    // Retrieve a single game with id
    //router.get("/:id", game.findOne);

    // Retrieve a single game with code
    router.get("/readByCode/:code", game.findByCode);

    app.use("/api/game", router);
};