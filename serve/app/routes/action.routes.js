module.exports = app => {
    const action = require("../controllers/action.controller.js");

    var router = require("express").Router();

    // Create a new action
    router.post("/", action.create);

    // Retrieve all actions
    router.get("/", action.findAll);

    // Retrieve all actions of a game
    router.get("/:game", action.findByGame);

    // Retrieve a single action with id
    router.get("/:id", action.findOne);

    // Delete a action with id
    router.delete("/:id", action.delete);

    app.use("/api/action", router);
};